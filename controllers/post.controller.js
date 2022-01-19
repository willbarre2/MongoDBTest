const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;
const { uploadErrors } = require("../utils/errors.utils");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if (!err) {
            res.send(docs);
        }else{
            console.log('Error to get data :' + err);
        }
    }).sort({ createdAt: -1 });
    // trié du plus réscent au plus ancien
};

module.exports.createPost = async (req, res) => {
    let fileName;

    if (req.file !== null) {
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

        fileName = req.body.posterId + Date.now() + '.jpg';

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../client/public/uploads/posts/${fileName}`
            )
        )
    }

    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file !== null ? "./uploads/posts/" + fileName: "",
        video: req.body.video,
        likers: [],
        comments: [],
    })

    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err){
        return res.status(400).send(err);
    }
};

module.exports.updatePost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send('ID unknown : ' + req.params.id)
    }

    await PostModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                message: req.body.message,
            },
        },
        { new: true }
    )
    .then((docs) => res.send(docs))
    .catch((err) =>res.status(400).send({ message: err}));
};

module.exports.deletePost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send('ID unknown : ' + req.params.id)
    }

    try{
        await PostModel.deleteOne({_id: req.params.id}).exec();
        res.status(200).json({message: "Post deleted"})
    } catch (err){
        return res.status(400).json({ message: err})
    }
};

module.exports.likePost = async (req, res) =>{
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.id)){
        return res.status(400).send('ID unknown : ' + req.params.id)
    }

    
    // add to the likers liste
    await PostModel.findByIdAndUpdate(req.params.id, {
        $addToSet: { likers: req.body.id}},
        { new: true},
        
    )
    .catch((err) =>res.status(400).send({ message: err}));

    // add to the likes liste
    await UserModel.findByIdAndUpdate(req.body.id, {
        $addToSet: { likes: req.params.id}},
        { new: true},
    )
    .then((docs) => res.send(docs))
    .catch((err) =>res.status(400).send({ message: err}));
};


module.exports.unlikePost = async (req, res) =>{
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.id)){
        return res.status(400).send('ID unknown : ' + req.params.id)
    }

    
    // delete from the likers liste
    await PostModel.findByIdAndUpdate(req.params.id, {
        $pull: { likers: req.body.id}},
        { new: true},
        
    )
    .catch((err) =>res.status(400).send({ message: err}));

    // delete from the likes liste
    await UserModel.findByIdAndUpdate(req.body.id, {
        $pull: { likes: req.params.id}},
        { new: true},
    )
    .then((docs) => res.send(docs))
    .catch((err) =>res.status(400).send({ message: err}));;
};

module.exports.commentPost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.commenterId)){
        return res.status(400).send('ID unknown : ' + req.params.id)
    }

    await PostModel.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                comments: {
                    commenterId: req.body.commenterId,
                    commenterPseudo: req.body.commenterPseudo,
                    text: req.body.text,
                    timestamp: new Date().getTime()
                },
            },
        },
        { new: true }
    )
    .then((docs) => res.send(docs))
    .catch((err) =>res.status(400).send({ message: err}));
};

module.exports.editCommentPost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send('ID unknown : ' + req.params.id)
    }

    await PostModel.findById(
        req.params.id
    )
    .then((docs) =>{
        const theComment = docs.comments.find((comment) =>
            comment._id.equals(req.body.commentId)
        );

        if (!theComment) return res.status(404).send("Comment not found");
        
        theComment.text = req.body.text;

        return docs.save((err) => {
            if (!err) return res.status(200).send(docs);
            return res.status(400).send(err);
        });
    })
    .catch((err) =>res.status(400).send({ message: err}));
};

module.exports.deleteCommentPost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send('ID unknown : ' + req.params.id)
    }

    await PostModel.findByIdAndUpdate(
        req.params.id,
        {
            $pull: {
                comments: {
                    _id: req.body.commentId
                },
            },
        },
        { new: true }
    )
    .then((docs) => res.send(docs))
    .catch((err) =>res.status(400).send({ message: err}));
};