const Project = require('../../models/project')
const ProjectUser = require('../../models/projectUser');

module.exports = {
    getProject,
    getProjectList,
    createProject,
    editProject,
    deleteProject
}

async function getProject(id) {

}

function getProjectList(id) {
    var associatedProjects = [];
    ProjectUser.find({user_id: id})
    .populate('project_id')
    .exec(function(err, projectUser) {
        if(err) {
            console.log(error);
        }// } else {
        //     associatedProjects.push(projectUser.project_id);
        // }
    })
    .then(result => {
        if(result) {
            associatedProjects.push(result);
            return associatedProjects;
        } else {
            return null;
        }
    })
    .catch(error => {
        console.log(error);
    })
}

async function createProject(userId, dataSet) {
    const {name, category, requirements, due_date} = dataSet;
    if(!name || !category || !requirements || !due_date) {
        return 'Data set incomplete'
    } else {
        const project = new Project({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            category: category,
            requirements: requirements,
            owner_id: userId,
            due_date: due_date
        });
    
        await project.save()
        .then(result => {
            if(result) {
                console.log(project);
            } else {
                return null;
            }
        })
        .catch(error => {
            console.log(error);
            return error;
        })
    
        if(project && Project.findById(project._id)) {
            const projectUser = new ProjectUser({
                _id: new mongoose.Types.ObjectId(),
                user_id: userId,
                project_id: project._id
            })
    
            await projectUser.save()
            .then(result => {
                if(result) {
                    console.log(projectUser);
                } else {
                    return null;
                }
            })
            .catch(error => {
                console.log(error);
                return error;
            })
        } else {
            return 'Project not found'
        }
        return true;
    }
}

async function editProject(id) {

}

async function deleteProject(id) {

}