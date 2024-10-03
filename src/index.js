const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require('cors')

dotenv.config()

const app = express()
const port = process.env.PORT || 3001
app.use(cors())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connect DB success!!!')
    })
    .catch((err) => {
        console.log(err)
    });

app.listen(port, () => {
    console.log('Server running in port: ', port)
})