import { Router } from "express";
import { createUser, getChannelProfile, getCurrentUser, getWatchHistory, loggedInUser, loggedOutUser, refreshTokens, updateAvatar, updateCoverImage, updatePassword, updateProfile } from "../controller/user.controler.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/auth.middleware.js";
import optionalAuth from "../middlewares/optionalAuth.middleware.js";

const router = Router()

router.route('/register').post(upload.fields([
    { name:"avatar", maxCount:1 },
    { name:"coverImage", maxCount:1 }
]),createUser)

router.route('/login').post(loggedInUser)
router.route('/logout').post(verifyJwt, loggedOutUser)
router.route('/user').get(verifyJwt, getCurrentUser)
router.route('/update-profile').patch(verifyJwt, updateProfile)
router.route('/update-password').patch(verifyJwt, updatePassword)
router.route('/update-avatar').patch(verifyJwt, upload.single("avatar"), updateAvatar)
router.route('/update-coverimage').patch(verifyJwt, upload.single("coverImage"), updateCoverImage)
router.route('/c/:username').get(optionalAuth, getChannelProfile)
router.route('/history').get(verifyJwt, getWatchHistory)
router.route('/refresh-token').post(refreshTokens)

export default router