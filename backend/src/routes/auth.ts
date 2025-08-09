//this file defines the API route for authentication logic

import { Router } from "express";
import { register, login, logout } from "../controllers/authController";

//middleware
import { auth } from "../middleware/auth";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", auth, logout);

router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
