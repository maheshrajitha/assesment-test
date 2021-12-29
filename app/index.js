require("dotenv").config({path:`${process.env.NODE_ENV}.env`})

const http = require("http")
const express = require("express")
const app = express()
const httpServer = http.createServer(app)
const fileParser = require("express-fileupload")
const redis = require("./util/redis").Client

require("./util/mysql").Client.connect((error)=>{
    if(error)
        console.log("MySql Failed",error);
})

redis.start()


httpServer.listen(process.env.APP_PORT,()=>{
    console.log(`Application Server Starts On PORT : ${process.env.APP_PORT}`)
})

app.use(express.json())
app.use(fileParser())
app.use(express.static('public'))


//CORS handler
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
    res.header("Access-Control-Max-Age", 86400);
    next();
}); 
//router file
app.use(require("./router"))


app.use((err, req, res, next) => {
    if (typeof err.error === "object" && typeof err.error.message === "string" && typeof err.error.code === "string") {
        err.message = err.error.message;
        err.error = err.error.code;
    } else {
        err.message = err.error;
        err.error = "UNEXPECTED_ERROR";
    }
    const statusCode = err.statusCode || 500;
    delete err.statusCode;
    return res.status(statusCode).json(err);
}); // error handler