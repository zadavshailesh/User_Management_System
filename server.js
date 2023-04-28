const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/user_management_system');

const express = require('express');
const app = express();

//For userRoute
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);

//For admin routes
const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);

app.listen(5000, () => {
  console.log('Server is running at http://localhost:5000');
});
