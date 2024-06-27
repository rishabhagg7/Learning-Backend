import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, updateTweet } from "../controllers/tweet.controller.js";

const router = Router()
router.use(verifyJwt)

router.route("/create").post(createTweet)
router.route("/update/:tweetId").patch(updateTweet)
router.route("/delete/:tweetId").delete(deleteTweet)

export default router