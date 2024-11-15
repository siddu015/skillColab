const Project = require("../models/project");

module.exports.renderDashboardPage = async (req, res) => {
    if (!req.user) {
        return res.redirect("/login");
    }

    try {
        const projects = await Project.find({
            $or: [
                { createdBy: req.user._id },
                { members: req.user._id }
            ]
        }).populate("createdBy members", "firstName lastName");

        res.render("dashboard/index", { projects });
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong!");
        res.redirect("/dashboard");
    }
};

module.exports.renderNewProjectForm = (req, res) => {
    res.render("dashboard/newProject");
};

module.exports.createNewProject = async (req, res) => {
    const { title, description, skillsRequired, rolesRequired } = req.body;
    const newProject = new Project({
        title,
        description,
        skillsRequired: skillsRequired.split(",").map(skill => skill.trim()),
        rolesRequired: rolesRequired.split(",").map(role => role.trim()),
        createdBy: req.user._id,
        status: 'open'
    });

    try {
        await newProject.save();
        req.flash("success", "Project created successfully!");
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        req.flash("error", "There was an error creating your project!");
        res.redirect("/newProject");
    }
};
