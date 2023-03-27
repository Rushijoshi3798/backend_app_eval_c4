const express = require("express");
const {UserModel} = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

userRouter.post("/register", async (req,res) => {
   
    console.log(req.body);

    const {name,email, gender, password, age, city, is_married} = req.body;

    const exist = await UserModel.findOne({email});
    console.log(exist);

    if(exist){
        if(exist.email == email){
            res.status(400).send({msg: "User already exist, please login"})
        }
    }else {
        try {
            bcrypt.hash(password, 5, (err, hash) => {
                const user = new UserModel({email, password: hash, name,gender, age, city, is_married})
                user.save();
                res.status(200).send({msg: "Registration has been successfull"})
            })
            
        } catch (error) {
            res.status(400).send({msg: error.message})
        }
    }
    
})

userRouter.post("/login", async(req,res) => {

    const {email,password} = req.body;

    try {
        const user = await UserModel.findOne({email});
        console.log(user);

        if(user){
            bcrypt.compare(password, user.password, (err, result) => {
                if(result){
                    res.status(200).send({ msg: "Login Successful", token: jwt.sign({userID: user._id}, "eval" )})
                }else {
                    res.status(400).send({ msg: "password Incorrect"})
                }
            });
        }else {
            res.status(400).send({ msg: "user is not present in Database"})
        }
    } catch (error) {
        res.status(400).send({msg: "Login Not Verified"})
    }
})



module.exports = {
    userRouter
}



