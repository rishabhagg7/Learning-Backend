import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getChannelVideos } from "../controllers/dashboard.controller.js";

const router = Router()
router.use(verifyJwt)

router.route("/video/:channelId").get(getChannelVideos)

export default router