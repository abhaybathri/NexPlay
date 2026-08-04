import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishVideo, togglePublishStatus, updateVideo } from "../controller/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router()
router.route("/").get(getAllVideos)
router.route("/publish").post(verifyJwt,upload.fields(
    [
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:"thumbnailFile",
            maxCount:1
        }
    ]
),publishVideo)


router.route("/g/:videoId").get(getVideoById)
router.route("/d/:videoId").delete(verifyJwt,deleteVideo)
router.route("/u/:videoId").patch(verifyJwt,upload.single("thumbnail"),updateVideo)

router.route("/t/:videoId").patch(verifyJwt,togglePublishStatus)



export default router