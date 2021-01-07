const Project = require('../models/project')
const ProjectUser = require('../models/projectUser');
const Team = require('../models/team');
const TeamUser = require('../models/teamUser');
const Comment = require('../models/comment');

const Role = require('../models/role');
const User = require('../models/user');

module.exports = {
    getProject,
    editProject,
    getProjectList,
    getTeam,
    editTeam,
    getTeamList,
    getTask,
    editTask,
    getTaskList
}

function getProject() {

}

function editProject() {

}

async function getProjectList(id) {
    let associatedProjects = [];
    let projects = [];
    ProjectUser.find({user_id: id})
    .then(projectUser => {
        if(projectUser) {
            associatedProjects.push(projectUser.project_id);
        } else {
            throw 'No associated projects found';
        }
    })
    .catch(error => {
        console.log(error);
    })

    for(var i = 0; i < associatedProjects.length; i++) {
        await Project.findById({_id: associatedProjects[i]})
        .then(project => {
            if(project) {
                projects.push(project);
            } else {
                throw `Project with ID ${associatedProjects[i]} not found`;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    return projects;
}

function getTeam() {

}

function editTeam() {

}

function getTeamList() {

}

function getTask() {

}

function editTask() {

}

function getTaskList() {

}