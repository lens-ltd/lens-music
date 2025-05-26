import { Router } from "express";
import { UserController } from "../controllers/user.contoller";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware";

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// DELETE USER
router.delete("/:id", authMiddleware, adminMiddleware, UserController.deleteUser);

// EXPORT ROUTER
export default router;
