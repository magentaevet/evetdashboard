const mongoose = require('mongoose');

const DB = process.env.DATABASE;

const PORT = process.env.PORT;
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 })
 .then((db) => console.log("Database is connected"))
 .catch((err) => console.log(err));
