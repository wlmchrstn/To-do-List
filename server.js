const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
const env = process.env.NODE_ENV || 'development'
const router = require('./routes/index.js');

require('dotenv').config()

const dbConfig = {
    development: process.env.DBDEV,
    test: process.env.DBTEST,
    user: process.env.DBLOGIN
}

// mongoose.connect(dbConfig[env], { useNewUrlParser: true, useCreateIndex: true});

try{
    mongoose.connect(dbConfig[env], 
    { useNewUrlParser: true, useCreateIndex: true})
  
    app.listen(port, () => {
        console.log(`Server Started at ${Date()}!`);
        console.log(`Listening on port ${port}!`);
        });
  
    console.log("success connect to database")
  }
  catch(error){
    console.log(error)
  };


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/api', router);
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to To Do API!"
    });
    // res.render('home');
});

// app.get('/data', (req, res) => {
//     res.render('data', {
//         title: "ABC",
//         body: 123
//     })
// })

// app.listen(port, () => {
//     console.log(`Server started at ${Date()}!`);
//     console.log(`Listening on port ${port}!`);
// })

module.exports = app;
