const { json } = require('body-parser');
const express = require('express');
const dbConfig = require('./config/dbConfig')
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');




const userRoute = require('./routes/usersRoute');
const busesRoute = require('./routes/busesRoute'); 
const bookingsRoute = require('./routes/bookingsRoute')



const app = express();
app.use(json());

//deploy
app.use(express.static(path.join(__dirname,'./client/build')))

app.get('*',(req,res)=> {
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

app.use('/api/users',userRoute);
app.use('/api/buses',busesRoute);
app.use('/api/bookings',bookingsRoute);



//database connection 

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;

db.on('connected',()=> {
    console.log('Mongo db connection successfull');
} );

db.off('error',()=> {
    console.log('mongo db connection failed');
})



const port = process.env.PORT || 5000;
app.listen(port,()=> console.log(`server start at port number : ${port}`)); 