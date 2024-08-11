const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const Offer = require("../model/Offer");
const User = require("../model/User");
const isAuthentificated = require("../middlewares/isAuthentificated");

const convertToBase64 = (file) => {
  // on conertit les files en base64, paramètre file, en argument on mettra notre req, req.files.picture pour avoir l'image de la req en base64
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.post(
  "/offer/publish",
  isAuthentificated, // on ne met pas de parenthèses à isAuthentificated pour que la route n'appelle pas la fonction directement
  fileUpload(), // il y a des parenthèses à fileUpload car return la définition d'une fonction
  async (req, res) => {
    // on utilise fileUpload pour lire les fichiers envoyés via form-data, la fonction sera d'abord exécutée, ensuite la fonction (req, res), on ne fait pas app.use(fileUpload) pour éviter que toutes nos requêtes ne passent pas par fileUpload, on va le mettre uniquement sur les routes où on en a besoin
    try {
      // console.log(req.headers.authorization.replace("Bearer ", "")); // pour récupérer le token de l'user, je le récupère dans le terminal avec bearer + token, on fait replace "bearer " par rien, pour ne récupérer que le token
      // console.log(req.body); // permet de récupérer les req en text de body form-data
      // console.log(req.files); // ici pour les fichiers on ne peut pas récupérer les req
      // console.log(convertToBase64(req.files.picture)); // je récupère mon image en base64

      const result = await cloudinary.uploader.upload(
        // pour enregistrer mon image sur cloudinary
        convertToBase64(req.files.picture)
      );
      // console.log(result) // affiche un objet avec plein de données, dont le lien sécurisé pour accéder à l'image
      const newOffer = new Offer({
        product_name: req.body.title,
        product_description: req.body.description,
        product_price: req.body.price,
        product_details: [
          { MARQUE: req.body.brand },
          { TAILLE: req.body.size },
          { ETAT: req.body.condition },
          { COULEUR: req.body.color },
          { EMPLACEMENT: req.body.city },
        ],
        product_image: result.secure_url,
        owner: {
          account: req.user.acount,
          _id: req.user._id,
        },
      });
      console.log(newOffer);

      await newOffer.save();

      res.status(201).json(newOffer);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
);

// router.get("/offers", async (req, res) => {
//   try {
//     const filter = {};

//     if (req.query.title) {
//       filter.product_name = new RegExp(req.query.title, "i");
//     }

//     if (req.query.priceMin) {
//       filter.product_price = req.query.priceMin;
//     }

//     const offers = await Offer.find().sort({ product_price: 1 });
//     console.log(req.query.sort);

//     console.log(filter);

//     res.json({ offers: offers });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// });

router.get("/offers/:id", async (req, res) => {
  try {
    const offers = await Offer.findById(req.params.id);

    res.json(offers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: message.error });
  }
});

module.exports = router;
