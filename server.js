const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require("./middleware/error");

// Route Files
const bootcamps = require('./routes/bootcamps');

// Middleware
const logger = require('./middleware/logger');

// ENV variables
dotenv.config({ path: './config/config.env' });

// Connect Database
connectDB();

const app = express();

// Body Parser : used to handel request from outside:: without this we will get undefined on console
app.use(express.json());

// Mount Middleware 
//app.use(logger);

// Dev logging Middleware
if(process.env.NODE_ENV === 'developmemt'){
      // console.log('Api : ' + process.env.GEOCODER_API_KEY);
      app.use(morgan()); // ::1 - - [Sat, 26 Sep 2020 06:53:29 GMT] "PUT /api/v1/bootcamps/1656 HTTP/1.1" 200 55 "-" "PostmanRuntime/7.26.4"
}

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);


// Custom error handler : middleware concept
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
      console.log('App listening on port ${PORT} ${process.env.NODE_ENV}');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
      console.log(`Unhandled Rejection: ${err.message}`);
      // Close Server
      server.close(() => process.exit(1));
})