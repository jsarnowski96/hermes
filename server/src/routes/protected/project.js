const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Project = require('../../models/project');
const ProjectUser = require('../../models/projectUser');

const getProjectList = require('../../services/resourceDispatcher').getProjectList;

const {ensureAuthenticated} = require('../../config/auth');

router.all('*', ensureAuthenticated);

router.get('/', (req, res, next) => {
    res.status(200).json({message: 'Project route'});
});

router.get('/list', async (req, res, next) => {
    let projectList = await getProjectList(req.user._id);
    console.log(projectList);
    if(projectList.length > 0) {
        res.status(200).json({projectList});
    } else {
        res.status(404).json({message: 'Not found'});
    }
});

router.get('/edit', (req, res, next) => {

});

router.get('/create', (req, res, next) => {
    res.status(200).json({message: 'Project create route'});
})

router.post('/create', async (req, res, next) => {
    const {name, category, requirements, due_date} = req.body;
    if(!name || !category || !requirements || !due_date) {
        res.status(401).json({message: 'Please fill in all required fields'});
    } else {
        const project = new Project({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            category: category,
            requirements: requirements,
            owner_id: '5fd000820a123678b07b034c',
            due_date: due_date
        });

        await project.save()
        .then(result => {
            if(result) {
                console.log(project);
            }
        })
        .catch(error => {
            console.log(error);
        })

        if(project && Project.findById(project._id)) {
            const projectUser = new ProjectUser({
                _id: new mongoose.Types.ObjectId(),
                user_id: '5fd000820a123678b07b034c',
                project_id: project._id
            })

            await projectUser.save()
            .then(result => {
                if(result) {
                    console.log(projectUser);
                    res.status(200).json({message: 'Project added'});
                } else {
                    res.status(401).json({message: 'Could not add project'});
                }
            })
            .catch(error => {
                console.log(error);
                res.status(401).json({message: error});
            })
        } else {
            res.status(404).json({message: 'Project not found'});
        }
    }
});

router.post('/edit', (req, res, next) => {

});

module.exports = router;