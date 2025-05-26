import { Router } from 'express';
import { ReleaseController } from '../controllers/release.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// CREATE RELEASE
router.post('/', authMiddleware, ReleaseController.createRelease);

// FETCH RELEASES
router.get('/', authMiddleware, ReleaseController.fetchReleases);

// GET RELEASE
router.get('/:id', authMiddleware, ReleaseController.getRelease);

// EXPORT ROUTER
export default router;
