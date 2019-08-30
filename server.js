const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
const env = process.env.NODE_ENV || 'production'
const router = require('./routes/index.js');

if (env == 'production') {
    const dotenv = require('dotenv').config();
}

const dbConfig = {
    development: process.env.DBDEV,
    test: process.env.DBTEST,
    user: process.env.DBLOGIN,
    production: process.env.DBPROD,
    staging: "mongodb+srv://William:mirai2704@todoapi-tmbsb.mongodb.net/test?retryWrites=true&w=majority"
}

mongoose.connect(dbConfig[env], { useNewUrlParser: true, useCreateIndex: true}, (err)=>{
    if(err) return console.log(err)
});



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

app.listen(port, () => {
    console.log(`Server started at ${Date()}!`);
    console.log(`Listening on port ${port}!`);
    // console.log(process.env)
})

module.exports = app;
