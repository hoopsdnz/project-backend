import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import routes from './routes';
import models, { connectDb } from './models';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
    req.context = {
      models,
      me: await models.User.findByLogin('rwieruch'),
    };
    next();
});

app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);

app.get('/', (req, res) => {
    return res.send('Received a GET HTTP method');
});

app.post('/', (req, res) => {
    return res.send('Received a POST HTTP method');
});
  
app.put('/', (req, res) => {
    return res.send('Received a PUT HTTP method');
});
  
app.delete('/', (req, res) => {
    return res.send('Received a DELETE HTTP method');
});

const eraseDatabaseOnSync = true;

connectDb().then(async () => {
    if (eraseDatabaseOnSync) {
        await Promise.all([
            models.User.deleteMany({}),
            models.Message.deleteMany({}),
        ]);
    
        createUsersWithMessages();
    }

    app.listen(process.env.PORT, () =>
      console.log(`Example app listening on port ${process.env.PORT}!`),
    );
});

const createUsersWithMessages = async () => {
    const user1 = new models.User({
      username: 'rwieruch',
    });
  
    const user2 = new models.User({
      username: 'ddavids',
    });
  
    const message1 = new models.Message({
      text: 'Published the Road to learn React',
      user: user1.id,
    });
  
    const message2 = new models.Message({
      text: 'Happy to release ...',
      user: user2.id,
    });
  
    const message3 = new models.Message({
      text: 'Published a complete ...',
      user: user2.id,
    });
  
    await message1.save();
    await message2.save();
    await message3.save();
  
    await user1.save();
    await user2.save();
};