const express = require('express');
const path = require('path');
const cors = require("cors");
const bodyparser = require('body-parser');
const app = express();
const PORT = 8000;

app.use(cors())
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
// Init Middleware
app.use(bodyparser());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/verify', require('./routes/api/verify'));

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
