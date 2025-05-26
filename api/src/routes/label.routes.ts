import { Router } from "express";
import { LabelController } from "../controllers/label.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// CREATE LABEL
router.post("/", authMiddleware, LabelController.createLabel);

// UPDATE LABEL
router.patch("/:id", authMiddleware, LabelController.updateLabel);

// FETCH LABELS
router.get("/", authMiddleware, LabelController.fetchLabels);

// GET LABEL
router.get("/:id", authMiddleware, LabelController.getLabel);

// EXPORT ROUTER
export default router;
