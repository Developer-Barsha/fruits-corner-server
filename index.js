const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

async function verifyJWT(req, res, next) {
    const authHeader = req?.headers?.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized access' })
    }
    const token = authHeader?.split(' ')[1];
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ldw54.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    await client.connect();
    const fruitsCollection = client.db("fruitsCenter").collection("fruit");
    const blogsCollection = client.db("fruitsCenter").collection("blog");
    const teamCollection = client.db("fruitsCenter").collection("team");

    try {
        // AUTH
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.SECRET_TOKEN, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })

        // get all fruits
        app.get('/allfruits', async (req, res) => {
            const query = {};
            const cursor = fruitsCollection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);
        })

        
        // get fruits by user email
        app.get('/userfruits', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded?.email;
            const email = req.query.email;
            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = fruitsCollection.find(query);
                const fruits = await cursor.toArray();
                res.send(fruits);
            }
            else {
                res.status(403).send({ message: 'Forbidden access' })
            }
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

        // get all blogs
        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = blogsCollection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs);
        })

        // get all team members
        app.get('/team', async (req, res) => {
            const query = {};
            const cursor = teamCollection.find(query);
            const team = await cursor.toArray();
            res.send(team);
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