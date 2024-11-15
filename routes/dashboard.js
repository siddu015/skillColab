const express = require('express');
const router = express.Router();
const { renderDashboardPage, renderNewProjectForm, createNewProject } = require('../controllers/dashboard');

router.get("/dashboard", renderDashboardPage);

router.get("/newProject", renderNewProjectForm);

router.post("/newProject", createNewProject);

module.exports = router;
