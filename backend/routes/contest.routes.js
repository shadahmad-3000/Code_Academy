import { Router } from "express";
import { 
  createContest, 
  getAllContests, 
  getContestById, 
  updateContest, 
  deleteContest 
} from '../controllers/contest.controller.js';

const router = Router();

// Routes with authentication middleware
router.post('/', createContest);
router.get('/', getAllContests);
router.get('/:id', getContestById);
router.put('/update/:id', updateContest);
router.delete('/delete/:id', deleteContest);

export default router;