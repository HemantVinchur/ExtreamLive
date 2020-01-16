const router = require('express').Router();
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const competitionRoutes = require('./competitionRoutes');
const coinRoutes = require('./coinRoutes');
console.log("Routes..............");
router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/competition', competitionRoutes);
router.use('/coin', coinRoutes);
module.exports = router;

