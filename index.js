const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const errorMiddleware = require('./middlewares/error-middleware');
const router = require('./router/index');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
   try {
      mongoose.connect(process.env.DB_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      app.listen(PORT, () => console.log(`server started on port ${PORT}`));
   } catch (error) {
      console.log(error);
   }
};

start();
