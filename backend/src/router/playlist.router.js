import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUsersPlaylists, removeVideoToPlaylist, updatePlaylist } from "../controller/playlist.controler.js";


const router = Router()
router.use(verifyJwt)
router
    .route('/:playlistId')
        .get(getPlaylistById)
        .patch(updatePlaylist)
        .delete(deletePlaylist)

router.route("/add/:videoid/:playlistid").post(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").delete(removeVideoToPlaylist)

router.route("/user/:userId").get(getUsersPlaylists)
router.route("/create").post(createPlaylist)

export default router