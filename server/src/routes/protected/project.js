const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const project = require('../../middleware/db/project');

const Project = require('../../models/project');
const ProjectUser = require('../../models/projectUser');

const {ensureAuthenticated} = require('../../middleware/auth');

router.all('*', ensureAuthenticated);

router.get('/:id', (req, res, next) => {
    res.status(200).json({message: 'Project ID route'});
});

router.post('/list', (req, res, next) => {
    var associatedProjects = project.getProjectList(req.body._id);
    if(associatedProjects.length > 0) {
        console.log(associatedProjects);
        res.status(200).json({associatedProjects});
    } else {
        res.status(404).json({message: 'No projects found.'});
    }
});

router.get('/edit', (req, res, next) => {

});

router.post('/create', async (req, res, next) => {
    if(await project.createProject(req.body)) {
        res.status(200).json({message: 'Project succesfully added to the database'});
    } else {
        res.status(400).json({message: 'Could not add project to the database'});
    }
});

router.post('/edit', (req, res, next) => {

});

module.exports = router;