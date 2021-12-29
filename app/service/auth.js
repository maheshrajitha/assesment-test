const { executeAsync , executeWithDataAsync } = require("../util/mysql").Client
const { v1 } = require("uuid")
const { requestDataValidate } = require("../util").Validator
const { eq } = require("../util").Hash
const { AppError , CommonError } = require("../util")
const jsonwebtoken = require("jsonwebtoken")
const redis = require("../util/redis").Client

const AuthServiceErrors = {
    PASSWORD_NOT_MATCH:{
        message:"Passwords not match",
        code:"PASSWORD_NOT_MATCH"
    },
    NO_USER_WITH_EMAIL_ADDRESS:{
        message:"There is no user with this email address",
        code:"NO_USER_WITH_EMAIL_ADDRESS"
    }
}

module.exports = {
    login,
    logout
}


//i haven't use any refresh machanisms in this demo project so i set a token id for tracking and identify the access token
function generateAccessToken(userData){
    let tokenId = v1()
    return {
        id: tokenId,
        accessToken: jsonwebtoken.sign({
            id: tokenId,
            userId: userData.id,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) //exp in a hour
        },process.env.TOKEN_SECRET)
    }
}

async function login(req,res,next){
    if(requestDataValidate(req.body,{email:"string",password:"string"})){
        try {
            let userData = await executeAsync(`SELECT * FROM user WHERE email='${req.body.email}'`)
            if(userData.length > 0){
                userData = userData[0]
                if(eq(userData.password,req.body.password)){
                    let token = generateAccessToken(userData)
                    res.send({
                        authorization: token.accessToken,
                        tokenId: token.id,
                        tokenType:"Bearer"
                    })
                }else{
                    next(new AppError(AuthServiceErrors.PASSWORD_NOT_MATCH,"Password Not Match",400))
                }
            }else next(new AppError(AuthServiceErrors.NO_USER_WITH_EMAIL_ADDRESS,"No User With this email address",404))
        } catch (error) {
            next(new AppError(CommonError.INTERNAL_SERVER_ERROR,error,500))
        }
    }else next(new AppError(CommonError.INVALID_REQUEST,"Invalid Request Body",400))
}

async function logout(req,res,next){
    if(requestDataValidate(req.body,{token:"string"})){
        try {
            await redis.setWithTTL(req.body.token,req.body.token,3600 )
            res.send({
                message:"Logout Successfully"
            })
        } catch (error) {
            next(new AppError(CommonError.INTERNAL_SERVER_ERROR,error,500))
        }
    }else next(new AppError(CommonError.INVALID_REQUEST,"Invalid Request Body",400))
}