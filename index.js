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

async function run() {
    await client.connect();
    const fruitsCollection = client.db("fruitsCenter").collection("fruit");
    
    try {
        // get all fruits
        app.get('/allfruits', async (req, res) => {
            const query = {};
            const cursor = fruitsCollection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);
        })

        // get all fruits by user email
        app.get('/userfruits', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = fruitsCollection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);
        })

        // post fruit api
        app.post('/fruits', async (req, res) => {
            const query = req.body;
            const fruits = await fruitsCollection.insertOne(query);
            res.send(fruits);
        })

        // get fruit by id
        app.get('/fruits/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const fruit = await fruitsCollection.findOne(query);
            res.send(fruit);
        })

        // update fruit info
        app.put('/fruits/:id', async (req, res) => {
            const id = req.params.id;
            const updatedFruit = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: updatedFruit
            };
            const result = await fruitsCollection.updateOne(query, updateDoc, options);
            res.send(result);
        })

        console.log('connected to db');
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Fruits Corner server')
})

app.listen(port, () => {
    console.log('listening to port:- ', port);
})