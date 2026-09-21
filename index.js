const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
app.use(cors())
app.use(express.json());
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const { ObjectId } = require('mongodb');
// 

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbanp2q.mongodb.net/?appName=Cluster0
`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    try {
        await client.connect();

        const userCollenction = client.db('plantsDb').collection('users');
        const plantCollection = client.db('plantsDb').collection('plants');

        // const database = client.db('plantsDb');
        // const userCollenction = database.collection('users');
        // const plantCollection = database.collection('plants');

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollenction.insertOne(newUser);
            res.send(result);
        });

        app.post('/plants', async (req, res) => {
            const newPlant = req.body;
            const result = await plantCollection.insertOne(newPlant);
            res.send(result);
        });

        app.get('/plants', async (req, res) => {
            const result = await plantCollection.find().toArray();
            res.send(result);
        });

        app.get('/plants/:id', async (req, res) => {
            const id = req.params.id;
            const result = await plantCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.get('/myplants', async (req, res) => {
            const userEmail = req.query.email;
            console.log('User email from query:', userEmail);

            const result = await plantCollection.find({ userEmail }).toArray();
            console.log('Plants found:', result);

            res.send(result);
        });


        app.put('/plants/:id', async (req, res) => {
            const id = req.params.id;
            const updatedPlant = req.body;
            const result = await plantCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedPlant }
            );
            res.send(result);

        });

        app.delete('/plants/:id', async (req, res) => {
            const id = req.params.id;
            const result = await plantCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);

        });





        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('welcomerrrrrr')
});

app.listen(port, () => {
    console.log(`my sever is running ${port}`);
})