require('../src/models/User');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const authRoutes = require('../src/routes/authRoutes');
const trackRoutes = require('../src/routes/trackRoutes');
const requireAuth = require('../src/middlewares/requireAuth');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(authRoutes);
app.use(trackRoutes);
mongoose.connect(process.env.MONGOURI);

mongoose.connection.on('connected', () => {
  console.log('Application connected to mongodb');
});

mongoose.connection.on('error',(err) => {
  console.error('Error on mongo db connection',err);
})


app.get('/', requireAuth, (req,res) => {
  res.send({user: req.user});
});

app.listen(3000,()=> {
  console.log('Server listen on port 3000');
})