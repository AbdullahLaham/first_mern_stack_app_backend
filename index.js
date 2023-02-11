import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
// import dotenv from 'dotenv';
// const express = require('express');
const app = express();

// dotenv.config();

app.use(bodyParser.json({"limit": "30mb", extended: true})); // 30mb because we will send images
app.use(bodyParser.urlencoded({"limit": "30mb", extended: true}));
app.use(cors());
// localhost:5000/posts
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.get('/', (req, res) => res.send("App is running"))
const CONNECTION_URL = "mongodb+srv://abdullah:9Fu2XGokRTlpLbv5@cluster0.bmyhu08.mongodb.net/?retryWrites=true&w=majority"
const PORT = process.env.PORT || 5000;
mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true,})
.then(() => {
    app.listen(PORT, () => console.log(`server running on port: ${PORT}`))
}).catch((err) => {
    console.log(err.message)
})
