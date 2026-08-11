import { Router } from "express"
import verifyJwt from "../middlewares/auth.middleware.js"
import optionalAuth from "../middlewares/optionalAuth.middleware.js"
import { deleteVideo, getAllVideos, getVideoById, publishVideo, togglePublishStatus, updateVideo } from "../controller/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = new Router()

// Public with optional auth (so watch history + view count work for logged in users)
router.route("/").get(optionalAuth, getAllVideos)
router.route("/g/:videoId").get(optionalAuth, getVideoById)

// Protected
router.route("/publish").post(verifyJwt, upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnailFile", maxCount: 1 }
]), publishVideo)

router.route("/d/:videoId").delete(verifyJwt, deleteVideo)
router.route("/u/:videoId").patch(verifyJwt, upload.single("thumbnail"), updateVideo)
router.route("/t/:videoId").patch(verifyJwt, togglePublishStatus)

export default router
