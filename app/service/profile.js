const { executeAsync , executeWithDataAsync } = require("../util/mysql").Client
const { AppError , CommonError } = require("../util")

const ProfileErrors = {
    USER_NOT_FOUND:{
        message:"User Not Found",
        code:"USER_NOT_FOUND"
    }
}

module.exports = {saveProfilePic ,getProfileDataByUser }

async function saveProfilePic(req,res,next){
    if(typeof req.files.profilePic !== "undefined"){
        try {
            await req.files.profilePic.mv(`${process.env.STATIC_FILE_PATH}/images/${req.files.profilePic.name}`)
            await executeWithDataAsync(`UPDATE user SET ? WHERE id='${req.userId}'`,{avatar:`${process.env.STATIC_FILE_URI}${req.files.profilePic.name}` })
            res.send({
                message:"Profile Pic Uploded"
            })
        } catch (error) {
            next(new AppError(CommonError.INTERNAL_SERVER_ERROR,error,500))
        }
    }else next(new AppError(CommonError.INVALID_REQUEST,"No Profile pic selected",400))
}

async function getProfileDataByUser(req,res,next){
    try {
        let userData = await executeAsync(`SELECT first_name AS firstName,last_name AS lastName , email ,avatar FROM user WHERE id='${req.userId}'`)
        if(userData.length > 0){
            res.send(userData[0])
        }else next(new AppError(ProfileErrors.USER_NOT_FOUND,"User not found",404))
    } catch (error) {
        next(new AppError(CommonError.INTERNAL_SERVER_ERROR,error,500))
    }
}