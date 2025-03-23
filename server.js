import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import morgan from 'morgan';
import jobRouter from './routers/jobRouter.js';
import mongoose from 'mongoose';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import authRouter from './routers/authRouter.js';

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/auth', authRouter);

// GET ALL JOBS
app.get('/api/v1/jobs', );

  // CREATE JOB
app.post('/api/v1/jobs', );

// GET SINGLE JOB
app.get('/api/v1/jobs/:id', );

// EDIT JOB
app.patch('/api/v1/jobs/:id', );

// DELETE JOB
app.delete('/api/v1/jobs/:id', );

app.use('*', (req, res) => {
    res.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}