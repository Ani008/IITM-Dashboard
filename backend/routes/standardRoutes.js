const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
const {
  getAllStandards,
  getStandardById,
  createStandard,
  updateStandard,
  deleteStandard,
  getNextIcn,
  getUniqueFieldValues
} = require('../controllers/standardController');


router.post(
  '/import-excel',
  protect,                  // only logged in
  authorize('ADMIN')
);

router.get('/next-icn', getNextIcn);
router.get('/unique-values/:field', getUniqueFieldValues);

router.route('/')
  .get(getAllStandards)
  .post(protect, authorize('ADMIN'), createStandard);

router.route('/:id')
  .get(getStandardById)
  .put(protect, authorize('ADMIN'), updateStandard)
  .delete(protect, authorize('ADMIN'), deleteStandard);




module.exports = router;