import { Router } from "express";
import { signIn, signUp } from "../controllers/userController.js";
import { loginSchema, signUpSchema } from "../schemas/userSchemas.js";
import validateSchema from "../middlewares/schemaMiddleware.js";

const authRouter = Router();

authRouter.post("/sign-up", validateSchema(signUpSchema),  signUp);
authRouter.post("/sign-in", validateSchema(loginSchema), signIn);

export default authRouter;