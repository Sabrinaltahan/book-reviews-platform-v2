import { Router } from "express";
import {
  login,
  register,
} from "../controllers/authController";
import {
  authenticateToken,
  type AuthenticatedRequest,
} from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/protected",
  authenticateToken,
  (req: AuthenticatedRequest, res) => {
    return res.json({
      message: "Protected route works.",
      userId: req.userId,
    });
  }
);

export default router;