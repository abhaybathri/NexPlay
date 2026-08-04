import { Router } from "express";
import { healthCheck } from "../controller/healthcheck.controler.js";
import verifyJwt from "../middlewares/auth.middleware.js";
const router = Router()
router.route('/').get(verifyJwt,healthCheck)

export default router