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
    const fruitsCollection = client.db("fruitsCorner").collection("fruit");

    try{
        app.get('/fruits', async(req, res)=>{
            const query = {};
            const cursor = fruitsCollection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);
        })

        app.get('/fruits/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const fruit = await fruitsCollection.findOne(query);
            res.send(fruit);
        })

        console.log('connected to db');
    }
    finally{

    }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Running Fruits Corner server')
})

app.listen(port, ()=>{
    console.log('listening to port:- ', port);
})