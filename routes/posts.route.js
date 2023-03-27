const express = require("express");
const {PostModel} = require("../model/post.model");
const jwt = require("jsonwebtoken");
const {auth} = require("../middleware/auth")
const postRouter = express.Router();


postRouter.get("/", async (req,res) => {
    const token = req.headers.authorization;
    console.log(token);

    const decoded = jwt.verify(token, "eval");
    try {
        if(decoded){
            const post = await PostModel.find({ userID: decoded.userID});

            res.status(200).send(post);

        }else {
            res.status(400).send({msg: "Token not verified"});
        }
    } catch (error) {
        res.status(400).send({msg: err.message});
    }


})

postRouter.post("/add", auth, async (req,res) => {
    try{

        const post = new PostModel(req.body);
        await post.save();
        res.status(200).send({msg: "Post has been successfully added"})
    }catch(err){
        res.status(400).send({msg: err.message})
    }
})

postRouter.patch("/update/:postID", async (req,res )=> {
    const token = req.headers.authorization;

    console.log(req.params);
    const payload = req.body;
    const decoded = jwt.verify(token, "eval");
    console.log(decoded);

    const req_id = decoded.userID;

    const postID = req.params.postID;
    const post = await PostModel.findOne({userID: postID})
    const userID_in_post = post.userID
    
    try {
        console.log(userID_in_post, postID, req_id);

        if(req_id === userID_in_post){
            await PostModel.findByIdAndUpdate({_id: post._id}, payload);
            res.status(200).send({msg: "Post has been successfully Updated"})
        }else {
            res.status(400).send({msg: "you are not authorized to update the post"})
        }
    } catch (error) {
        res.status(400).send({msg: err.message})
    }
})

postRouter.delete("/delete/:postID", async (req,res )=> {
    const token = req.headers.authorization;

    console.log(req.params);
    const decoded = jwt.verify(token, "eval");
    console.log(decoded);

    const req_id = decoded.userID;

    const postID = req.params.postID;
    const post = await PostModel.findOne({userID: postID})
    const userID_in_post = post.userID
    
    try {
        console.log(userID_in_post, postID, req_id);

        if(req_id === userID_in_post){
            await PostModel.findByIdAndDelete({_id: post._id});
            res.status(200).send({msg: "Post has been successfully Deleted"})
        }else {
            res.status(400).send({msg: "you are not authorized to Delete the post"})
        }
    } catch (error) {
        res.status(400).send({msg: err.message})
    }
})



module.exports = {
    postRouter
}