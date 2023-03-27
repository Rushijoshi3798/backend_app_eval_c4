const jwt = require("jsonwebtoken");

const auth = (req,res,next) => {
    console.log("connected to auth route");
    const token = req.headers.authorization;

    if(token){
        const decoded = jwt.verify(token, "eval");
        if(decoded){
            req.body.userID = decoded.userID;
            next();

        }else {
           res.status(400).send({msg: "please login first"}) 
        }
    }else {
        res.status(400).send({msg: "token not sended / Incorrect"}) 
    }
}

module.exports = {
    auth
}