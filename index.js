const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');

const app = express();

const allowedOrigins = [process.env.ORIGIN];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests from allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // do not allow requests without an origin (like curl or mobile app requests)
    if (!origin) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    // otherwise, deny the request
    return callback(new Error('Not allowed by CORS'), false);
  }
}));

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

const PORT = process.env.PORT || 8800;
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(() => {
    console.log('Connected to MongoDb');
    app.listen(PORT, () => {
        console.log(`server listening on PORT: ${PORT}`);
    })
})
.catch((e) => {
    console.log(e);
})


