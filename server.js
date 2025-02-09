require('dotenv').config();
require('express-async-errors');  
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/user.routes');
const productRouter = require('./routes/product.routes');
const { sendInternalErrorResponse } = require("./utils/response");
const cloudinary = require('./config/cloudinary');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//mongoose connection
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('open', () => console.log('Connected to DB'));
mongoose.connection.on('error', (err) => {
  console.log(err);
});

//api end points

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);



app.use((err, req, res, next) => {
  return sendInternalErrorResponse(res, err);
});
