const jsonwebtoken = require("jsonwebtoken")
const { AppError , CommonError } = require("../util")
const redis = require("../util/redis").Client


async function acessTokenVaalidate(req){
    if(typeof req.headers.authorization !== "undefined"){
        let authHeader = req.headers.authorization.split(" ")
        if(authHeader.length === 2){
            try {
                let token = jsonwebtoken.verify(authHeader[1],process.env.TOKEN_SECRET)
                req.userId = token.userId
                let data = await redis.get(token.id)
                if (data !== null){
                    throw new Error("Token Not Valid")
                }
            } catch (error) {
                throw error
            }
        }else throw new Error("Token Not Valid")
    }else throw new Error("Token Not Found")
}

module.exports = ()=>{
    return[
        (req , res ,next)=>{
            acessTokenVaalidate(req).then(_=>{
                next()
            }).catch(error=>{
                console.log(error);
                next(new AppError(CommonError.UNAUTHORIZED,error,401))
            })
        }
    ]
}