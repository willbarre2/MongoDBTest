const UserModel = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
const { uploadErrors } = require('../utils/errors.utils');
const pipeline = promisify(require("stream").pipeline);

module.exports.uploadProfil = async (req, res) =>{
    try{
        if(req.file.detectedMimeType != "image/jpg" && req.file.detectedMimeType != "image/png" && req.file.detectedMimeType != "image/jpeg"){
            // renvoie erreur au catch
            throw Error("invalid file");
        }
        if(req.file.size > 500000){
            throw Error("max size");
        }
    }catch (err){
        const errors = uploadErrors(err);
        return res.status(201).json({ errors });
    }

    const fileName = req.body.name + ".jpg";

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    )

    await UserModel.findByIdAndUpdate(req.body.userId, {
        $set: {picture: "./uploads/profil/" + fileName}},
        { new: true, upsert: true, setDefaultsOnInsert: true},
    )
    .then((docs) => res.send(docs))
    .catch((err) =>res.status(400).send({ message: err}));

}