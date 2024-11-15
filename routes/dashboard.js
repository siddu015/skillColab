// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { renderDashboardPage } = require('../controllers/dashboard');

// Dashboard Routes
router.get("/dashboard", renderDashboardPage);

module.exports = router;
