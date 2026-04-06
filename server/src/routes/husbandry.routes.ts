import { Router } from 'express';
import { 
    createHusbandryListing, 
    getMyHusbandryListings,
    deleteHusbandryListing,
    toggleListingStatus
} from '../controllers/husbandry.controller';

const router = Router();

/**
 * @route   POST /api/husbandry/create
 * @desc    Create a new animal or milk listing
 */
router.post('/create', createHusbandryListing);

/**
 * @route   GET /api/husbandry/my-listings/:userId
 * @desc    Get all listings entered by a specific user (phone number)
 */
router.get('/my-listings/:userId', getMyHusbandryListings);

/**
 * @route   GET /api/husbandry/my-listings
 * @desc    Alternative: Get listings via query params
 */
router.get('/my-listings', getMyHusbandryListings);

/**
 * @route   PATCH /api/husbandry/toggle-status/:id
 * @desc    Mark an item as SOLD or ACTIVE (Toggle)
 */
router.patch('/toggle-status/:id', toggleListingStatus);

/**
 * @route   DELETE /api/husbandry/delete/:id
 * @desc    Permanently remove a listing
 */
router.delete('/delete/:id', deleteHusbandryListing);

export default router;