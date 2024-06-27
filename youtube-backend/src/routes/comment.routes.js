import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, updateComment } from "../controllers/comment.controller.js";

const router = Router()
router.use(verifyJwt)

router.route("/:videoId")
    .post(addComment)

router.route("/c/:commentId")
    .patch(updateComment)
    .delete(deleteComment)

export default router