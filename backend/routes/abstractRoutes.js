const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();
const {
  getAllAbstracts,
  getAbstractById,
  createAbstract,
  updateAbstract,
  deleteAbstract,
  getAbstractsByIds
} = require('../controllers/abstractController');


router.post('/export-data', getAbstractsByIds);

router.post(
  '/import-excel',
  protect,                  // only logged in
  authorize('ADMIN')
);

router.route('/')
  .get(getAllAbstracts)
  .post(createAbstract);

router.route('/:id')
  .get(getAbstractById)
  .put(updateAbstract)
  .delete(deleteAbstract);

module.exports = router;