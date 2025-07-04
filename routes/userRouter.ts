import { Router } from "express";
import { userController } from "../controllers/userController"
const userRouter = Router();

userRouter.get("/", userController.MainGet);

userRouter.get("/profile", userController.profileGet);

userRouter.get("/sign-up", userController.signUpGet)
userRouter.post("/sign-up", userController.signUpPost)

userRouter.get("/login", userController.logInGet)
userRouter.post("/login", userController.logInPost)


export { userRouter };