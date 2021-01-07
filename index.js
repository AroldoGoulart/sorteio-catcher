require('dotenv').config()
const express = require("express");
const cors = require('cors');
var router = require('./src/routes');

const app = express();
var port = process.env.port || 8889;

app.use(cors());
app.use(router)

app.listen(process.env.PORT || 5000, () => {
  console.log(`App listening at http://localhost:${port}`)
})