const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
// const env = process.env.NODE_ENV //|| 'development'
const router = require('./routes/index.js');

/* istanbul ignore else */
// if (
//     //env == 'development' || 
//     env == 'test') {
//     require('dotenv').config();
// }

// const dbConfig = {
//     development: process.env.DBDEV,  
//     test: process.env.DBTEST,
//     user: process.env.DBLOGIN,
//     production: process.env.DBPROD,
// }

mongoose.connect("mongodb+srv://William:mirai2704@todoapi-tmbsb.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useCreateIndex: true})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/api', router);
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to To Do API!"
    });
});

app.listen(port, () => {
    console.log(`Server started at ${Date()}!`);
    console.log(`Listening on port ${port}!`);
})

module.exports = app;
