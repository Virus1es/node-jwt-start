const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouter = require('./authRouter');

dotenv.config();

const DB_URL = process.env.DB_URL ?? '';
const PORT = process.env.PORT ?? 6000;

const app = express();

app.use(express.json());
app.use('/auth', authRouter);

const start = async () => {
    try {
        await mongoose.connect(DB_URL);
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }
    catch (e){
        console.log(e)
    }
}

start();