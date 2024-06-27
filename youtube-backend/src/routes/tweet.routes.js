import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createTweet, updateTweet } from "../controllers/tweet.controller.js";

const router = Router()
router.use(verifyJwt)

router.route("/create").post(createTweet)

export default router