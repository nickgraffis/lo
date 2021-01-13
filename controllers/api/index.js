const router = require('express').Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const remarkRoutes = require('./remarkRoutes');
const tagRoutes = require('./tagRoutes');


router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/remarks', remarkRoutes);
router.use('/tags', tagRoutes);

module.exports = router;
