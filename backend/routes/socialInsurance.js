import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addSocialInsurance, getSocialInsurances, getSocialInsurance, updateSocialInsurance, deleteSocialInsurance } from '../controllers/socialInsuranceController.js';

const router = express.Router();

router.get('/', authMiddleware, getSocialInsurances);
router.post('/add', authMiddleware, addSocialInsurance);
router.get('/:id', authMiddleware, getSocialInsurance);
router.put('/:id', authMiddleware, updateSocialInsurance);
router.delete('/:id', authMiddleware, deleteSocialInsurance);

export default router;