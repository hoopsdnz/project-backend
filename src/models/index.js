import mongoose from 'mongoose';

import User from './user';
import Message from './message';

mongoose.set('useCreateIndex', true);

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
};

const models = { User, Message };

export { connectDb };

export default models;