const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();

const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());


// const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = "mongodb+srv://lifemark_db:JjnwVSIIoXVbwNa9@cluster0.m25rjlj.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const userCollection = client.db('tms_db').collection('user')
        const taskCollection = client.db('tms_db').collection('tasks')




        app.post('/user', async (req, res) => {
            const user = req.body
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query)
            if (existingUser) {
                return res.send(console.log("User Exist"))
            }
            const result = await userCollection.insertOne(user)
            res.send(result);
        })

        // ---- Get All The Users ----
        app.get('/user', async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result);
        })


        app.get('/user/:email', async (req, res) => {
            try {
                const email = req.params.email;
                console.log(email);
                const query = {
                    email: email,
                };
                const result = await userCollection.find(query).toArray();
                console.log(result);
                if (!result) {
                    res.status(404).send('Item not found');
                    return;
                }
                res.send(result)
            }
            catch (err) {
                console.log(err);
                // res.status(500).send('Internal Server Error');
            }
        })

        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task)
            res.send(result)
        })
        app.get('/tasks/:email', async (req, res) => {
            try {
                const email = req.params.email;
                console.log(email);
                const query = {
                    email: email,
                };
                const result = await taskCollection.find(query).toArray();
                console.log(result);
                if (!result) {
                    res.status(404).send('Item not found');
                    return;
                }
                res.send(result)
            }
            catch (err) {
                console.log(err);
                // res.status(500).send('Internal Server Error');
            }
        })

        app.put('/tasks/:email', async (req, res) => {
            try {
                const email = req.params.email;
                console.log(email);
                const query = {
                    email: email,
                };
                const result = await taskCollection.updateOne(query)
                if (!result) {
                    res.status(404).send('Item Not Found')
                    return;
                }
                res.send(result);
            }
            catch (err) {
                console.log(err);
                // res.status(500).send('Internal Server Error');
            }
        })

        app.delete('/tasks/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = {
                email: email,
            };
            const result = taskCollection.deleteOne(query)
            res.send(result)
        })

















        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})