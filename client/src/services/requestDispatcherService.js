import axios from 'axios';

export async function getCompany(userId, headers) {
    try {
        await axios.post('/company/details',
        {
            userId: userId
        }, {headers: headers, withCredentials: true})
        .then((response) => {
            if(response !== undefined) {
                return response.data.company;
            }
        })
        .catch((error) => {
            if(error) {
                if(error !== undefined && error.response !== undefined) {
                    return [error.response.data.origin, error.response.data.error];
                }
            }
        })
    } catch(exception) {
        if(exception) {
            throw exception;
        }
    }
}

export async function getCompanyList() {

}

export async function deleteCompany() {
    
}

export async function getOrganization() {

}

export async function getOrganizationList() {
    try {
        if(arguments.length === 0) {
            await axios.post('/organization/list', {
                ref: 'company'
            })
        }
    } catch(exception) {
        if(exception) {
            throw exception;
        }
    }
}

export async function deleteOrganization() {

}

export async function getTeam() {

}

export async function getTeamList() {

}

export async function deleteTeam() {

}

export async function getUser(userId, headers) {
    try {
        await axios.post('/user/profile', {
            userId: userId
        }, {headers: headers, withCredentials: true})
        .then((response) => {
            if(response !== undefined) {
                return response.data.user;
            }
        })
        .catch((error) => {
            if(error !== undefined && error.response !== undefined) {
                return [error.response.data.origin, error.response.data.error];
            }
        })
    } catch(exception) {
        if(exception) {
            throw exception;
        }
    }
}

export async function getUserList() {

}

export async function deleteUser() {

}

export async function getProject() {

}

export async function getProjectList() {

}

export async function deleteProject() {

}

export async function getTask() {

}

export async function getTaskList() {
    
}

export async function deleteTask() {

}

export async function getCategory() {

}

export async function getCategoryList() {

}

export async function deleteCategory() {
    
}

export async function getRecent() {

}