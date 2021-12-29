const { executeWithDataAsync } = require("../util/mysql").Client
const { v1 } = require("uuid")
const { requestDataValidate } = require("../util").Validator
const {  sha256 } = require("../util").Hash
const { AppError , CommonError } = require("../util")

const UserServiceError = {
    INVALID_USER_DATA:{
        message:"Invalid User Data",
        code:"INVALID_USER_DATA"
    },
    DUPLICATE_USER_DATA:{
        message:"This emali already use by someone",
        code:"DUPLICATE_USER_DATA"
    }
}

module.exports={
    save
}

async function save(req,res,next){
    if(requestDataValidate(req.body,{
        firstName:"string",
        lastName:"string",
        email:"string",
        password:"string"
    })){
        try {
            let userData = {
                id: v1(),
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email,
                password: sha256(req.body.password)
            }
            await executeWithDataAsync(`INSERT INTO user SET ?`,userData)
            res.send({
                message:"User Save Successfully"
            })
        } catch (error) {
            if(typeof error.code == "string" && error.code == "ER_DUP_ENTRY"){
                next(new AppError(UserServiceError.DUPLICATE_USER_DATA,"Duplicate User Data",400))
            }else{
                next(new AppError(CommonError.INTERNAL_SERVER_ERROR,error,500))
            }
        }
    }else next(new AppError(UserServiceError.INVALID_USER_DATA,"Invalid User Data",400))
}