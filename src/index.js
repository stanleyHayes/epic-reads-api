import cors from "cors";
import dotenv from "dotenv";
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MongoDB Connected");
}).catch(error => {
    console.log(`Error connecting to MongoDB: ${error}`);
});

import bookRoutes from "./routes/book.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
// helps to transform the request body and makes
// it available on the req.body
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use("/books", bookRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});