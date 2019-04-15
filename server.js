const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
const mongoose = require("mongoose");
require('dotenv').config()

const PORT = process.env.PORT || 9000;

// Connect to database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, () => {
    console.log("Database connected");
});
mongoose.connection.on("error", (error) => {
    console.log(`Connect occur error: ${error}`);
});

// Bring in routes
const AuthRoute = require("./routes/auth");


// Middle ware
app.use(morgan("dev"));
// app.use(cors());
app.use(bodyParser.json());
app.use(expressValidator());


app.use('/', AuthRoute);

app.listen(PORT, () => {
    console.log(`API listen on port ${PORT}`);
});