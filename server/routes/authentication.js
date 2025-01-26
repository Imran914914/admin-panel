import express from "express"
import {auth} from '../controllers/Authentication.js'


const router = express.Router();


router.post("/Sign-Up", auth.SignUp);
router.post("/Sign-in", auth.SignIn)
router.post("/verify-otp", auth.confirmOtp)
router.post("/forgot-password", auth.forgotPassword)
router.post("/reset-password", auth.resetPassword)
router.post("/edit-profile", auth.editProfile)
router.get("/get-global-user", auth.getGlobalUser)
router.delete("/delete-user", auth.deleteUser)
router.post("/ban-user",auth.banUser)

export default router;
