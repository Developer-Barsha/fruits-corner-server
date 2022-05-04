const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const token = jwt.sign({ foo: 'bar' }, 'shhhhh');
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const verifyJWT=user=>{

}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ldw54.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    await client.connect();
    const fruitsCollection = client.db("fruitsCenter").collection("fruit");
    
    try {
        // AUTH
        app.post('/login', async(req, res)=>{
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.SECRET_TOKEN, {
                expiresIn:'1d'
            });
            res.send({accessToken});
        })

        // get all fruits
        app.get('/allfruits', async (req, res) => {
            const query = {};
            const cursor = fruitsCollection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);
        })

        // get fruits by user email
        app.get('/userfruits', async (req, res) => {
            const authHeader = req.headers.authorization;
            console.log(authHeader);
            const email = req.query.email;
            const query = email ? {email} : {};
            const cursor = fruitsCollection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);
        })

        // post fruit api
        app.post('/allfruits', async (req, res) => {
            const query = req.body;
            const fruits = await fruitsCollection.insertOne(query);
            res.send(fruits);
        })

        // get fruit by id
        app.get('/allfruits/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const fruit = await fruitsCollection.findOne(query);
            res.send(fruit);
        })
        
        // update fruit api
        app.put('/allfruits/:id', async (req, res) => {
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
        
        // delete fruit api
        app.delete('/allfruits/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await fruitsCollection.deleteOne(query);
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