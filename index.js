const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload"); // on installe et require ça pour pouvoir lire les fichiers envoyés par postman en body>form-data
const cloudinary = require("cloudinary").v2;

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");

app.use(userRoutes);
app.use(offerRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Not found !" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started 🚀");
});
