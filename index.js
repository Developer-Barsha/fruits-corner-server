const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ldw54.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    await client.connect();
    const fruitsCollection = client.db("fruits").collection("fruit");
    console.log('connected to db');
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Running Fruits Corner server')
})

app.listen(port, ()=>{
    console.log('listening to port:- ', port);
})