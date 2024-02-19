const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

mongoose
  .connect(
    "mongodb+srv://brian-matcha:HTO5BTCCqK5pH13Z@matchacluster.syyjdyn.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
