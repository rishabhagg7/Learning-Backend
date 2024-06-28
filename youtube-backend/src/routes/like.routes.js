import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router()
router.use(verifyJwt)

router.route("/toggle/v/:videoId").post(toggleVideoLike)
router.route("/toggle/t/:tweetId").post(toggleTweetLike)

export default router