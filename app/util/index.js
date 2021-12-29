const crypto = require("crypto")

exports.Hash ={
    sha256(plainText){
        return crypto.createHash("sha256").update(plainText).digest("hex");
    },
    eq(hashedText,plainText){
        return crypto.createHash("sha256").update(plainText).digest("hex") === hashedText
    }
}

exports.Validator ={
    requestDataValidate(object , keysAndTypes){
        if(Object.keys(object).length >= Object.keys(keysAndTypes).length){
            for (const key in keysAndTypes) {
                if(object[key] === null || typeof object[key] !== keysAndTypes[key]){
                    return false
                }
            }
            return true
        }else return false
    }
}
class AppError extends Error {
    constructor(error, exception, statusCode){
        super()
        this.error = error || "Application Error";
        if (process.env.DEBUG == "true")
            this.exception = exception;
        this.statusCode = statusCode || 400;
    }
}

exports.AppError = AppError

exports.CommonError = {
    PAGE_NOT_FOUND: { message: "page not found", code: "PAGE_NOT_FOUND" },

    UNAUTHORIZED: { message: "Unauthorized", code: "UNAUTHORIZED" },

    DATABASE_ERROR: { message: "Database Error", code: "DATABASE_ERROR" },

    FILE_UPLOAD_ERROR: { message: "File Upload Error", code: "FILE_UPLOAD_ERROR" },

    CACHE_ERROR: { message: "Cache Error", code: "CACHE_ERROR" },

    INVALID_REQUEST: { message: "Invalid Request", code: "INVALID_REQUEST" },

    INTERNAL_SERVER_ERROR: { message: "Something Went Wrong, We will fix it soon", code: "INTERNAL_SERVER_ERROR"}
};