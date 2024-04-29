const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.83drhwd.mongodb.net/
  `;

// middleware
app.use(express.json());
app.use(cors());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();

    const touristsSpotCollection = client
      .db("TouristSpot")
      .collection("TouristSpotCollection");

    const countryCollection = client
      .db("TouristSpot")
      .collection("countryCollection");

    app.get("/touristSpots", async (req, res) => {
      const cursor = touristsSpotCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/mylist", async (req, res) => {
      const cursor = touristsSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/touristSpots", async (req, res) => {
      const touristSpot = req.body;
      const result = await touristsSpotCollection.insertOne(touristSpot);
      res.send(result);
    });
    app.get("/myData/:id", async (req, res) => {
      const { id } = req.params;
      const query = { email: id };
      const cursor = touristsSpotCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/update/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await touristsSpotCollection.findOne(query);
      res.send(result);
    });
    app.delete("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsSpotCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedData = req.body;

      const update = {
        $set: {
          tourists_spot_name: updatedData.tourists_spot_name,
          country: updatedData.country,
          location: updatedData.location,
          short_description: updatedData.short_description,
          average_cost: updatedData.average_cost,
          totaVisitorsPerYear: updatedData.totaVisitorsPerYear,
          photoURL: updatedData.photoURL,
          seassonValue: updatedData.seassonValue,
          travelTime: updatedData.travelTime,
          email: updatedData.email,
          name: updatedData.name,
        },
      };

      const result = await touristsSpotCollection.updateOne(
        filter,
        update,
        options
      );
      res.send(result);
    });
    app.get("/countries", async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/touristSpots/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await touristsSpotCollection.findOne(query);

        if (result) {
          res.send(result);
        } else {
          res.status(404).send("Tourist spot not found");
        }
      } catch (error) {
        res.status(500).send("Error finding tourist spot");
      }
    });
    app.get("/countries/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await countryCollection.findOne(query);

        if (result) {
          res.send(result);
        } else {
          res.status(404).send("Tourist spot not found");
        }
      } catch (error) {
        res.status(500).send("Error finding tourist spot");
      }
    });
  } catch (error) {
    // Do not close the client in the finally block
    console.error("Error connecting to MongoDB:", error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
