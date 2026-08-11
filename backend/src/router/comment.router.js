import { Router } from "express"
import { deleteComment, getVideoComment, postComment, updateComment } from "../controller/comment.controler.js"
import verifyJwt from "../middlewares/auth.middleware.js"
import optionalAuth from "../middlewares/optionalAuth.middleware.js"

const router = Router()

// GET comments: optional auth so we can check isLikedByUser
router.route("/:videoId").get(optionalAuth, getVideoComment)

// Write operations need full auth
router.route("/:videoId").post(verifyJwt, postComment)
router.route("/:commentId").delete(verifyJwt, deleteComment).patch(verifyJwt, updateComment)

export default router
