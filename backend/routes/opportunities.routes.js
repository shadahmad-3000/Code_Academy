import { Router } from "express";
import { 
  createOpportunities, 
  getAllOpportunities, 
  getOpportunitiesById, 
  updateOpportunities,
  deleteOpportunities
} from '../controllers/opportunities.controller.js';

const router = Router();

// Routes with authentication middleware
router.post('/', createOpportunities);
router.get('/', getAllOpportunities);
router.get('/:id', getOpportunitiesById);
router.put('/update/:id', updateOpportunities);
router.delete('/delete/:id', deleteOpportunities);

export default router;