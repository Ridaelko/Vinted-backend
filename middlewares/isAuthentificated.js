const User = require("../model/User");

const isAuthentificated = async (req, res, next) => {
  try {
    // on fait ce fichier pour ne pas avoir à toujours mettre la condition si user a un token, s'il a un token c'est soit il s'est inscrit, soit il s'est connecté, donc il peut mettre des annonces, et on l'intégrera à nos routes qu'on a besoin comme fileUpload()
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(401).json({ message: "You have to login" });
    }

    req.user = user;
    return next();
  } catch (error) {
    res.status(500).json({ error: message.error });
  }
};

module.exports = isAuthentificated;
