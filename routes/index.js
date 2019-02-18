const express = require('express');
const router = express.Router();

router.use('/users', require('../controllers/User'));
router.use('/groups', require('../controllers/Group'));
router.use('/invitations', require('../controllers/Invitation'));
router.use('/departments', require('../controllers/Department'));
router.use('/products', require('../controllers/Product'));
router.use('/lists', require('../controllers/List'));
router.use('/auth', require('../controllers/Auth'));
router.use('/favorites', require('../controllers/Favorite'));

module.exports = router;