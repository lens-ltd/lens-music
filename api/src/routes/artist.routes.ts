import { Router } from "express";
import { ArtistController } from "../controllers/artist.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

// CREATE ROUTER
const router = Router();

/**
 * ARTIST ROUTES
 */

// CREATE ARTIST
router.post("/", authMiddleware, ArtistController.createArtist);

// FETCH ARTISTS
router.get("/", authMiddleware, ArtistController.fetchArtists);

// GET ARTIST
router.get("/:id", authMiddleware, ArtistController.getArtistById);

// UPDATE ARTIST
router.patch("/:id", authMiddleware, ArtistController.updateArtist);

// DELETE ARTIST
router.delete("/:id", authMiddleware, ArtistController.deleteArtist);

// EXPORT ROUTER
export default router;
