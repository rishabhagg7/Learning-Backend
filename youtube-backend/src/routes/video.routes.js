import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { getVideoById, uploadVideo } from "../controllers/video.controller.js";

const router = Router()
router.use(verifyJwt) //apply verifyJwt middleware to all routes in this file

router.route("/upload-video").post(
    upload.fields([
        {
            name:"thumbnail",
            maxCount:1
        },
        {
            name:"videoFile",
            maxCount:1
        }
    ]),
    uploadVideo
)

router.route("/get-video/:videoId").get(getVideoById)
export default router