const express = require('express')
const RootRouter = express.Router()
const Authorize = require("./interceptors/auth")

const AuthService = require("./service/auth")
//auth routes
RootRouter.post("/login",AuthService.login)
RootRouter.delete("/logout",AuthService.logout)

const UserService = require("./service/user")
//User Routes
RootRouter.post("/register",UserService.save)

const ProfileRouter = express.Router()
const ProfileService = require("./service/profile")
ProfileRouter.get("/",Authorize(),ProfileService.getProfileDataByUser)
ProfileRouter.post("/image",Authorize(),ProfileService.saveProfilePic)

RootRouter.use("/profile",ProfileRouter)


module.exports = RootRouter