import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const app = express();
dotenv.config();
const port = process.env.PORT;

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.CONNECTION_STRING, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
        socketTimeoutMS: 45000,
      });
      console.log("Database Connected Successfully!");
    } catch (error) {
      console.error("Database Connection Error:", error.message);
      process.exit(1);
    }
  };

  connectDB();

app.listen(port , () =>{
    console.log(`App is listening to port: ${port}`)
})