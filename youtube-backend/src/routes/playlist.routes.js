import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createPlaylist, getPlaylistById, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router()
router.use(verifyJwt)

router.route("/").post(createPlaylist)
router.route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)

export default router