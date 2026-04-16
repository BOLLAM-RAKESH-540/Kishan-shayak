import { Router } from 'express';
import { 
    createHusbandryListing, 
    getMyHusbandryListings,
    deleteHusbandryListing,
    toggleListingStatus
} from '../controllers/husbandry.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// All husbandry routes require authentication
router.post('/create', authMiddleware, createHusbandryListing);
router.get('/my-listings/:userId', authMiddleware, getMyHusbandryListings);
router.get('/my-listings', authMiddleware, getMyHusbandryListings);
router.patch('/toggle-status/:id', authMiddleware, toggleListingStatus);
router.delete('/delete/:id', authMiddleware, deleteHusbandryListing);

export default router;