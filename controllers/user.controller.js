const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) =>{
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
};

module.exports.userInfo = (req, res) =>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send('ID unknown : ' + req.params.id)
    }else{
        UserModel.findById(req.params.id, (err, docs) =>{
            if(!err){res.send(docs);}
            else{console.log('ID unknow: ' + err);}
        }).select('-password');
    }
};

module.exports.updateUser = async (req, res) =>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send('ID unknown : ' + req.params.id)
    }

    
    await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                bio: req.body.bio,
            },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true}
    )
    .then((docs) => res.send(docs))
    .catch((err) =>res.status(500).send({ message: err}));
    
};

module.exports.deleteUser = async (req, res) =>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send('ID unknown : ' + req.params.id)
    }

    try{
        await UserModel.deleteOne({_id: req.params.id}).exec();
        res.status(200).json({message: "User deleted"})
    } catch (err){
        return res.status(500).json({ message: err})
    }
}

module.exports.follow = async (req, res) =>{
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)){
        return res.status(400).send('ID unknown : ' + req.params.id)
    }

    
    // add to the follower liste
    await UserModel.findByIdAndUpdate(req.params.id, {
        $addToSet: { following: req.body.idToFollow}},
        { new: true, upsert: true},
        
    )
    .then((docs) => res.send(docs))
    .catch((err) =>res.status(500).send({ message: err}));

    // add to the following liste
    await UserModel.findByIdAndUpdate(req.body.idToFollow, {
        $addToSet: { followers: req.params.id}},
        { new: true, upsert: true},
    )
    .catch((err) =>res.status(500).send({ message: err}));
}

module.exports.unfollow = async (req, res) =>{
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow)){
        return res.status(400).send('ID unknown : ' + req.params.id)
    }

    // remove to the follower liste
    await UserModel.findByIdAndUpdate(req.params.id, {
        $pull: { following: req.body.idToUnfollow}},
        { new: true, upsert: true},
        
    )
    .then((docs) => res.send(docs))
    .catch((err) =>res.status(500).send({ message: err}));

    // remove to the following liste
    await UserModel.findByIdAndUpdate(req.body.idToUnfollow, {
        $pull: { followers: req.params.id}},
        { new: true, upsert: true},
    )
    .catch((err) =>res.status(500).send({ message: err}));
}