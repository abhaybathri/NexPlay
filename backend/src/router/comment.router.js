import { Router } from "express";
import { deleteComment, getVideoComment, postComment, updateComment } from "../controller/comment.controler.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyJwt)
router.route("/:videoId")
        .get(getVideoComment)
        .post(postComment)

router.route("/:commentId")
        .delete(deleteComment)
        .patch(updateComment)

export default router