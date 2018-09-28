const express = require('express');

const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./schema/schema');

const app = express();

mongoose.connect('mongodb://anand:password123@ds115543.mlab.com:15543/gqlproject');
mongoose.connection.once('open',()=>{
    console.log('connected to db');
})

app.use('/graphql', graphqlHTTP({

    schema: schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log("listening to port 4000")
})