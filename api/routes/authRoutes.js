import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.get('/hello', (req, res) => {
    res.send("hello");
  });
router.post("/signup", signup);
router.post("/login", login);

export default router;
