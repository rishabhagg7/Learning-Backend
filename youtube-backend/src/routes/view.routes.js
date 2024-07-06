import { Router } from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { addVideoView } from "../controllers/view.controller.js"

const router = Router()
router.use(verifyJwt)

router.route("/:videoId").post(addVideoView)

export default router