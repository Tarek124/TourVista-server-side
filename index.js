const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.83drhwd.mongodb.net/
  `;

const data = [
  {
    country_name: "Bangladesh",
    image: [
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.britannica.com%2Fplace%2FBangladesh&psig=AOvVaw2y-PkSHfw9ws6sWdIc_pHI&ust=1714297952146000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNjZ8dSP4oUDFQAAAAAdAAAAABAJ",
      "https://i.natgeofe.com/n/ca8eeb79-c104-4080-8690-5bee44fb7560/00-bangladesh-climate-migrant-crisis_3x2.jpg?w=826&h=550",
      "https://medglobal.org/wp-content/uploads/2022/05/Bangladesh-Banner.png",
    ],
    description:
      "Bangladesh is a South Asian country known for its lush greenery, extensive river systems, and vibrant culture. The Sundarbans, the largest mangrove forest, and historical sites like the 60 Dome Mosque are notable attractions. Dhaka, the capital, is a bustling city filled with rich history and vibrant street life.",
  },
  {
    country_name: "Thailand",
    image: [
      "https://www.holidify.com/images/cmsuploads/compressed/shutterstock_1014644104(1)_20200114154141.jpg",
      "https://www.planetware.com/wpimages/2019/10/thailand-top-attractions-khao-sok-national-park.jpg",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tripsavvy.com%2Fplaces-to-visit-in-thailand-1458668&psig=AOvVaw2H87aQzfXf-109ziVesEFR&ust=1714298070266000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPiCnYuQ4oUDFQAAAAAdAAAAABAk",
    ],
    description:
      "Thailand is a Southeast Asian nation celebrated for its tropical beaches, opulent palaces, ancient temples, and rich cultural heritage. Bangkok, the capital, is renowned for its bustling markets and street food. Chiang Mai offers ancient temples and a vibrant arts scene, while Phuket is famous for its resorts and nightlife.",
  },
  {
    country_name: "Indonesia",
    image: [
      "https://d1bv4heaa2n05k.cloudfront.net/user-images/1531818714682/shutterstock-463299110_destinationMain_1531818723725.jpeg",
      "https://uploads-ssl.webflow.com/576fd5a8f192527e50a4b95c/5e1756c2e2aa6471e49e4ef2_indonesia%20places%20to%20visit.jpg",
      "https://assets.traveltriangle.com/blog/wp-content/uploads/2015/08/Raja-Ampat-Island-in-Indonesia.jpg",
    ],
    description:
      "Indonesia, the world's largest archipelago, consists of more than 17,000 islands. Known for its diverse cultures, stunning landscapes, and vibrant cities, Indonesia is home to iconic sites like Bali's beaches, Java's active volcanoes, and Komodo National Park. Jakarta, the capital, is a dynamic city with a rich history and modern skyline.",
  },
  {
    country_name: "Malaysia",
    image: [
      "https://static.javatpoint.com/tourist-places/images/tourist-places-in-malaysia40.png",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCpTJswn3GPUU7DCyMAyBAlWxCxZ7bmqV8Z7NW_WAqXw&s",
      "https://static.javatpoint.com/tourist-places/images/tourist-places-in-malaysia41.png",
    ],
    description:
      "Malaysia, a Southeast Asian country, is known for its modern cities, lush rainforests, and cultural diversity. Kuala Lumpur, the capital, is famous for the Petronas Twin Towers and bustling street markets. Penang is celebrated for its colonial architecture and culinary scene, while Borneo's rainforests are home to unique wildlife.",
  },
  {
    country_name: "Vietnam",
    image: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8Go9cADNq0Yyd_a7XK-eoq2JMl7rMbq1B__WaYpHFjA&s",
      "https://www.toptourist.com/wp-content/uploads/2015/07/26308156_l-1920x900.jpg",
      "https://www.travelanddestinations.com/wp-content/uploads/2019/10/Ban-Gioc-Detian-Waterfalls-Vietnam-1.jpg",
    ],
    description:
      "Vietnam, in Southeast Asia, is known for its rich history, stunning landscapes, and delicious cuisine. The capital, Hanoi, boasts French colonial architecture and ancient temples, while Ho Chi Minh City (formerly Saigon) is known for its vibrant street life and historic landmarks. Halong Bay is a UNESCO World Heritage Site.",
  },
  {
    country_name: "Cambodia",
    image: [
      "https://res.cloudinary.com/rainforest-cruises/images/c_fill,g_auto/f_auto,q_auto/w_1120,h_650/v1620229703/Best-Places-To-Visit-Cambodia-Phnom-Penh/Best-Places-To-Visit-Cambodia-Phnom-Penh.jpg",
      "https://image.jimcdn.com/app/cms/image/transf/dimension=4000x3000:format=jpg/path/s0ca27f7814ed51fd/image/i1620157a73a62d62/version/1638366025/top-5-tourist-attractions-in-cambodia-that-you-must-visit.jpg",
      "https://www.experiencetravelgroup.com/blog/wp-content/uploads/2022/12/Dollarphotoclub_73953575-2-scaled.jpg",
    ],
    description:
      "Cambodia, located in Southeast Asia, is best known for its ancient temples, with Angkor Wat being the most iconic. Phnom Penh, the capital, features the Royal Palace and the National Museum with Khmer art. The country has a rich history, with sites like the Killing Fields offering a somber reminder of its turbulent past.",
  },
];

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
      const cursor = touristsSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/touristSpots", async (req, res) => {
      const touristSpot = req.body;
      const result = await touristsSpotCollection.insertOne(touristSpot);
      res.send(result);
    });
    
    app.get("/countrys", async (req, res) => {
        const cursor = countryCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsSpotCollection.findOne(query);
      res.send(result);
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
