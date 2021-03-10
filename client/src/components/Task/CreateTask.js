import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/style.css';
import '../../assets/css/errors.css';

class CreateTask extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    refreshToken: this.jwt.refreshToken
                },
                categories: [],
                teams: [],
                projects: [],
                users: [],
                statuses: [ 'To do', 'In progress', 'In review', 'Postponed', 'Done'],
                fields: {},
                errors: {},
                serverResponse: null
            }

            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.auth.refreshToken}`
            };
        }

        this.resetForm = this.resetForm.bind(this);                

        this.getCategories();
        this.getProjects();
        this.getTeams();
        this.getUsers();
    }

    componentWillUnmount() {
        axios.Cancel('Axios request canceled.');
    }

    resetForm() {
        document.getElementById('description').defaultValue = '';
        this.setState({fields: {}, errors: {}});
    }

    onChange(field, event) {
        let fields = this.state.fields;
        let errors = this.state.errors;
        
        fields[field] = event.target.value;       

        errors[field] = '';
        this.setState({fields, errors});
    }

    validateForm() {
        let fields = this.state.fields;
        let errors = this.state.errors;
        let isValid = true;
        const {t} = this.props;

        if(!fields['name']) {
            isValid = false;
            errors['name'] = t('misc.phrases.field') + ' \'' + t('content.task.fields.name') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['name'] !== undefined) {
            if(!fields['name'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/;
                isValid = false;
                errors['name'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['dueDate']) {
            isValid = false;
            errors['dueDate'] = errors['dueDate'] = t('misc.phrases.field') + ' \'' + t('content.task.fields.dueDate') + '\' ' + t('commonErrors.formValidation.requiredDate');
        }

        if(!fields['category'] || fields['category'] === 'none') {
            isValid = false;
            errors['category'] = t('misc.phrases.field') + ' \'' + t('content.category.title') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['projectId'] || fields['projectId'] === 'none') {
            isValid = false;
            errors['project'] = t('misc.phrases.field') + ' \'' + t('content.task.title') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['status'] || fields['status'] === 'none') {
            isValid = false;
            errors['status'] = t('misc.phrases.field') + ' \'' + t('content.task.fields.status') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['description']) {
            isValid = false;
            errors['description'] = t('misc.phrases.field') + ' \'' + t('content.task.fields.description') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['description'] !== undefined) {
            if(!fields['description'].match(/^.{1,500}$/gm)) {
                let regex = /^.{1,500}$/gm;
                isValid = false;
                errors['description'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        this.setState({errors: errors});

        return isValid;
    }

    async getTeams() {
        try {
            await axios.get('http://localhost:3300/team/list', {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response.data.teams !== undefined && response.data.teams !== '' && response.data.teams !== null && response.data.teams.length > 0) {
                    this.setState({teams: response.data.teams});
                }
            })
            .catch((error) => {
                if(error.response.data.error === 'JwtTokenExpired') {
                    removeJwtDataFromSessionStorage()
                } else {
                    this.setState({
                        serverResponse: error.response.data.error
                    })
                }
            });
        } catch(e) {
            this.setState({serverResponse: e.message});
        }
    }

    async getUsers() {
        try {
            await axios.post('http://localhost:3300/user/list', 
            {
            }, {headers: this.headers, withCredentials: true })
            .then((response) => {
                if(response.data.users.length > 0 && response.data.users !== null) {
                    this.setState({users: response.data.users});
                }   
            })
            .catch((error) => {
                if(error.response.data.error === 'JwtTokenExpired') {
                    removeJwtDataFromSessionStorage();
                } else {
                    this.setState({serverResponse: error.response.data.error});
                }
            });
        } catch(e) {
            this.setState({serverResponse: e.message});
        }
    }

    async getCategories() {
        await axios.post('http://localhost:3300/category/list', { category_type: 'task'}, {headers: this.headers, withCredentials: true })
            .then((response) => {
                if(response.data.categories.length > 0 && response.data.categories !== null) {
                    this.setState({categories: response.data.categories});
                } else {
                    this.setState({categories: null});
                }     
            })
            .catch((error) => {
                if(error.response.data.error === 'JwtTokenExpired') {
                    removeJwtDataFromSessionStorage()
                }
                
                this.setState({
                    serverResponse: error.response.data.error
                })
            });
    }

    async getProjects() {
        try {
            axios.post('http://localhost:3300/project/list', 
            {
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response !== undefined && response.data.projects !== null && response.data.projects.length > 0) {
                    this.setState({projects: response.data.projects});
                }
            })
            .catch((error) => {
                if(error) {
                    if(error.response.data.error === 'JwtTokenExpired') {
                        removeJwtDataFromSessionStorage()
                    } else {
                        this.setState({
                            serverResponse: error.response.data.error
                        })
                    }
                }
            });
        } catch(e) {
            this.setState({serverResponse: e.message});
        }
    }

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const {t} = this.props;
        const fields = this.state.fields;

        if(this.validateForm()) {
            try {
                axios.post('http://localhost:3300/task/create', {
                    userId: this.state.auth.userId,
                    taskObj: this.state.fields
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.task !== null) {
                        this.setState({task: response.data.task, serverResponse: t('content.task.actions.createTask.actionResults.success')});
                    }
                })
                .catch(error => {
                    if(error) {
                        this.setState({serverResponse: error.response.data.error});
                    }
                }) 
            } catch(e) {
                this.setState({serverResponse: e.message});
            }
        } else {
            let errors = document.querySelectorAll('.error-msg-span');
            for(var i = 0; i < errors.length; i++) {
                errors[i].style.display = 'block';
            }
        }
    }

    render() {
        const {t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return(
                <div className="card">
                    <p className="card-title">{t('content.task.actions.createTask.actionTitle')}</p><hr className="card-hr" />
                    <form className="card-form" onSubmit={this.onFormSubmit}>
                        <label htmlFor="name">{t('content.task.fields.name')}</label>
                        <input onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" name="name" />
                        <span className="error-msg-span">{this.state.errors["name"]}</span>
                        <label htmlFor="category">{t('content.task.fields.category')}</label>
                        <select onChange={this.onChange.bind(this, 'category')} value={this.state.fields['category']} type="category" className="" name="category">
                            <option selected value="none">{t('misc.actionDescription.selectCategory')}</option>
                            {this.state.categories.length > 0 && (
                                this.state.categories.map((category, index) => {
                                    if(index === 0) {
                                        return <option value={category.name}>{category.name}</option>
                                    } else {
                                        return <option value={category.name}>{category.name}</option>
                                    }
                                })
                            )}
                        </select>
                        <span className="error-msg-span">{this.state.errors["category"]}</span>
                        <label htmlFor="description">{t('content.task.fields.description')}</label>
                        <textarea onChange={this.onChange.bind(this, 'description')} value={this.state.fields['description']} type="description" id="description" name="description" />
                        <span className="error-msg-span">{this.state.errors["description"]}</span>
                        <label htmlFor="projectId">{t('content.task.fields.project')}</label>
                        <select onChange={this.onChange.bind(this, 'projectId')} value={this.state.fields['projectId']} type="projectId" className="" name="projectId">
                            <option selected value="none">{t('misc.actionDescription.selectProject')}</option>
                            {this.state.projects.length > 0 && (
                                this.state.projects.map((project, index) => {
                                    if(index === 0) {
                                        return <option value={project._id}>{project.name}</option>
                                    } else {
                                        return <option value={project._id}>{project.name}</option>
                                    }
                                })
                            )}
                        </select>
                        <span className="error-msg-span">{this.state.errors["projectId"]}</span>
                        <label htmlFor="assigned_user">{t('content.task.fields.assignedUser')}</label>
                        <select onChange={this.onChange.bind(this, 'assigned_user')} value={this.state.fields['assigned_user']} type="assigned_user" className="" name="assigned_user">
                            <option selected value="none">{t('misc.actionDescription.selectUser')}</option>
                            {this.state.users.length > 0 && (
                                this.state.users.map((user, index) => {
                                    if(index === 0) {
                                        return <option value={user._id}>{user.username}</option>
                                    } else {
                                        return <option value={user._id}>{user.username}</option>
                                    }
                                })
                            )}
                        </select>
                        <span className="error-msg-span">{this.state.errors["assigned_user"]}</span>
                        <label htmlFor="status">{t('content.task.fields.assignedTeams')}</label>
                        <select onChange={this.onChange.bind(this, 'teams')} value={this.state.fields['teams']} type="teams" className="" name="teams">
                            <option selected value="none">{t('misc.actionDescription.selectTeam')}</option>
                            {this.state.teams.length > 0 && (
                                this.state.teams.map((team, index) => {
                                    if(index === 0) {
                                        return <option value={team._id}>{team.name}</option>
                                    } else {
                                        return <option value={team._id}>{team.name}</option>
                                    }
                                })
                            )}
                        </select>
                        <span className="error-msg-span">{this.state.errors["teams"]}</span>
                        <label htmlFor="status">{t('content.task.fields.status')}</label>
                        <select onChange={this.onChange.bind(this, 'status')} value={this.state.fields['status']} type="status" className="" name="status">
                            <option selected value="none">{t('misc.actionDescription.selectStatus')}</option>
                            {this.state.statuses.map((status, index) => {
                                if(index === 0) {
                                    return <option value={status}>{status}</option>
                                } else {
                                    return <option value={status}>{status}</option>
                                }
                            })}
                        </select>
                        <span className="error-msg-span">{this.state.errors["status"]}</span>
                        <label htmlFor="dueDate">{t('content.task.fields.dueDate')}</label>
                        <input onChange={this.onChange.bind(this, 'dueDate')} value={this.state.fields['dueDate']} type="date" className="" name="dueDate"
                            min="2021-02-01" max="2022-12-31" />
                        <span className="error-msg-span">{this.state.errors["dueDate"]}</span>
                        <div class="card-form-divider">
                            <button type="submit" className="card-form-button">{t('misc.actionDescription.create')}</button>
                            <button type="reset" className="card-form-button" onClick={this.resetForm}>{t('misc.actionDescription.reset')}</button>
                            <button type="button" className="card-form-button"><Link to="/dashboard" className="card-form-button-link">{t('misc.actionDescription.cancel')}</Link></button>
                        </div>
                        {this.state.serverResponse !== null ? (
                                this.state.task !== null ? (
                                    <span className="error-msg-span" style={{display: "block", color: 'green'}} id="serverResponse">{this.state.serverResponse}</span>
                                ) : (
                                    <span className="error-msg-span" style={{display: "block"}} id="serverResponse">{t('content.task.actions.createTask.errorMessages.dataValidation.' + this.state.serverResponse)}</span>
                                )
                            ) : (
                                <span className="error-msg-span" id="serverResponse"></span>
                            )}
                    </form>
                </div>
            )
        } else {
            return(
                <Redirect to=
                    {{
                        pathname: '/login',
                        state: {
                            authenticated: false,
                            redirected: true
                        }
                    }}
                />
            ) 
        }
    }
}

const CreateTaskTranslation = withTranslation('common')(CreateTask);

export default CreateTaskTranslation;