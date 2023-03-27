const express = require("express");
const cors = require("cors")
const { connection } = require("./db");
const { userRouter } = require("./routes/users.route");
const { postRouter } = require("./routes/posts.route");
const { auth } = require("./middleware/auth");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req,res) => {
    res.status(200).send({msg: "HOME PAGE"})
})

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/auth", auth)

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Connection request failed! Cannot connect to MongoDB");
    }
    console.log("server is running on secured port");
})