import { Router } from "express"
import verifyJwt from "../middlewares/auth.middleware.js"
import {
    addVideoToPlaylist, createPlaylist, deletePlaylist,
    getPlaylistById, getUsersPlaylists, removeVideoToPlaylist, updatePlaylist
} from "../controller/playlist.controler.js"

const router = Router()

// Public routes — anyone can view playlists
router.route("/user/:userId").get(getUsersPlaylists)
router.route("/:playlistId").get(getPlaylistById)

// Protected routes — must be logged in
router.use(verifyJwt)
router.route("/create").post(createPlaylist)
router.route("/:playlistId").patch(updatePlaylist).delete(deletePlaylist)
router.route("/add/:videoid/:playlistid").post(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").delete(removeVideoToPlaylist)

export default router
