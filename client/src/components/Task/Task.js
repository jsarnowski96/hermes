import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import JoditEditor from 'jodit-react';
import ProjectList from '../Project/ProjectList';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class Task extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    accessToken: this.jwt.accessToken
                },
                task: null,
                categories: [],
                teams: [],
                users: [],
                projects: [],
                statuses: ['To do', 'In progress', 'In review', 'Postponed', 'Done'],
                fields: {},
                errors: {},
                enableEdit: false,
                allowSave: false,
                serverResponse: {
                    origin: null,
                    content: null
                }
            }

            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.auth.accessToken}`
            };
        }

        this.deleteTask = this.deleteTask.bind(this);

        this.getTeamList();
        this.getCategoryList();
        this.getProjectList();
        this.getTask();
        this.getUserList();
    }

    onChange(field, event) {
        let fields = this.state.fields;
        let errors = this.state.errors;
        
        fields[field] = event.target.value;    
        errors[field] = '';

        if(field === 'category') {
            if(fields[field] === this.state.task[field].name) {
                this.setState({fields, errors, allowSave: false});
            } else {
                this.setState({fields, errors, allowSave: true});
            }
        }
        
        if(fields[field] === this.state.task[field]) {
            this.setState({fields, errors, allowSave: false});
        } else {
            this.setState({fields, errors, allowSave: true});
        }
    }

    resetForm() {
        let fields = this.state.fields;
        fields['name'] = this.state.task.name;
        fields['description'] = this.state.task.description;
        fields['category'] = this.state.task.category.name;
        fields['teams'] = this.state.task.teams;
        fields['status'] = this.state.task.status;
        fields['project'] = this.state.task.project;
        fields['assigned_user'] = this.state.task.assigned_user._id;
        fields['dueDate'] = moment(this.state.task.dueDate).format('YYYY-MM-DD');

        this.setState({fields, errors: {}, allowSave: false, serverResponse: {
                    origin: null,
                    content: null
                }});
    }

    validateForm() {
        let fields = this.state.fields;
        let errors = this.state.errors;
        let isValid = true;
        const {t} = this.props;

        if(!fields['name']) {
            isValid = false;
            errors['name'] = t('misc.phrases.field') + ' \'' + t('content.project.fields.name') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['name'] !== undefined) {
            if(!fields['name'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/;
                isValid = false;
                errors['name'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['dueDate']) {
            isValid = false;
            errors['dueDate'] = errors['dueDate'] = t('misc.phrases.field') + ' \'' + t('content.project.fields.dueDate') + '\' ' + t('commonErrors.formValidation.requiredDate');
        }

        if(!fields['category'] || fields['category'] === 'none') {
            isValid = false;
            errors['category'] = t('misc.phrases.field') + ' \'' + t('content.category.title') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['teams'] || fields['teams'] === 'none') {
            isValid = false;
            errors['teams'] = t('misc.phrases.field') + ' \'' + t('content.team.title') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['status'] || fields['status'] === 'none') {
            isValid = false;
            errors['status'] = t('misc.phrases.field') + ' \'' + t('content.project.fields.status') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['description']) {
            isValid = false;
            errors['description'] = t('misc.phrases.field') + ' \'' + t('content.project.fields.description') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['description'] !== undefined) {
            if(!fields['description'].match(/^.{1,500}$/gm)) {
                let regex = /^.{1,500}$/gm;
                isValid = false;
                errors['description'] = t('content.project.actions.createProject.errorMessages.formValidation.allowedCharsOnly') + regex;
            }
        }

        this.setState({errors: errors});

        return isValid;
    }

    async getProjectList() {
        if(this.props.params === undefined) {
            if(this.props.location === undefined && this.props.location.state === undefined) {
                try {
                    axios.post('/project/list', 
                    {
                        ref: 'task',
                        objId: this.state.task._id
                    }, {headers: this.headers, withCredentials: true})
                    .then((response) => {
                        if(response !== undefined && response.data.projects !== null && response.data.projects.length > 0) {
                            this.setState({projects: response.data.projects});
                        }
                    })
                    .catch((error) => {
                        if(error !== undefined && error.response !== undefined) {
                            if(error.response.data.error === 'JwtTokenExpired') {
                                removeJwtDataFromSessionStorage()
                            } else {
                                this.setState({
                                    serverResponse: {
                                        origin: error.response.data.origin,
                                        content: error.response.data.error
                                    }
                                })
                            }
                        }
                    });
                } catch(e) {
                    this.setState({serverResponse: {
                        origin: 'axios',
                        content: e.message
                    }});
                }
            } else {
                try {
                    axios.post('/project/list', 
                    {
                        ref: this.props.location.state.ref,
                        objId: this.props.location.state.objId
                    }, {headers: this.headers, withCredentials: true})
                    .then((response) => {
                        if(response !== undefined && response.data.projects !== null && response.data.projects.length > 0) {
                            this.setState({projects: response.data.projects});
                        }
                    })
                    .catch((error) => {
                        if(error !== undefined && error.response !== undefined) {
                            if(error.response.data.error === 'JwtTokenExpired') {
                                removeJwtDataFromSessionStorage()
                            } else {
                                this.setState({
                                    serverResponse: {
                                        origin: error.response.data.origin,
                                        content: error.response.data.error
                                    }
                                })
                            }
                        }
                    });
                } catch(e) {
                    this.setState({serverResponse: {
                        origin: 'axios',
                        content: e.message
                    }});
                }
            } 
        } else {
            try {
                axios.post('/project/list', 
                {
                    ref: this.props.params.ref,
                    objId: this.props.params.objId
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.projects !== null && response.data.projects.length > 0) {
                        this.setState({projects: response.data.projects});
                    }
                })
                .catch((error) => {
                    if(error !== undefined && error.response !== undefined) {
                        if(error.response.data.error === 'JwtTokenExpired') {
                            removeJwtDataFromSessionStorage()
                        } else {
                            this.setState({
                                serverResponse: {
                                    origin: error.response.data.origin,
                                    content: error.response.data.error
                                }
                            })
                        }
                    }
                });
            } catch(e) {
                this.setState({serverResponse: {
                        origin: 'axios',
                        content: e.message
                    }});
            }
        }
    }

    async getCategoryList() {
        await axios.post('/category/list', { category_type: 'task'}, {headers: this.headers, withCredentials: true })
            .then((response) => {
                if(response.data.categories.length > 0 && response.data.categories !== null) {
                    this.setState({categories: response.data.categories});
                } else {
                    this.setState({categories: null});
                }     
            })
            .catch((error) => {
                if(error !== undefined && error.response !== undefined) {
                    if(error.response.data.error === 'JwtTokenExpired') {
                        removeJwtDataFromSessionStorage()
                    } else {
                        this.setState({
                            serverResponse: {
                                origin: error.response.data.origin,
                                content: error.response.data.error
                            }
                        })
                    }
                }
            });
    }

    async getTeamList() {
        if(this.props.params === undefined) {
            if(this.props.location === undefined && this.props.location.state === undefined) {
                try {
                    await axios.post('/team/list', 
                    {
                        ref: 'user',
                        objId: this.state.auth.userId
                    }, {headers: this.headers, withCredentials: true})
                    .then((response) => {
                        if(response.data.teams !== undefined && response.data.teams !== '' && response.data.teams !== null && response.data.teams.length > 0) {
                            this.setState({teams: response.data.teams});
                        }
                    })
                    .catch((error) => {
                        if(error !== undefined && error.response !== undefined) {
                            if(error.response.data.error === 'JwtTokenExpired') {
                                removeJwtDataFromSessionStorage()
                            } else {
                                this.setState({
                                    serverResponse: {
                                        origin: error.response.data.origin,
                                        content: error.response.data.error
                                    }
                                })
                            }
                        }
                    });
                } catch(e) {
                    this.setState({serverResponse: {
                        origin: 'axios',
                        content: e.message
                    }});
                }
            } else {
                try {
                    await axios.post('/team/list', 
                    {
                        ref: this.props.location.state.ref,
                        objId: this.props.location.state.objId
                    }, {headers: this.headers, withCredentials: true})
                    .then((response) => {
                        if(response.data.teams !== undefined && response.data.teams !== '' && response.data.teams !== null && response.data.teams.length > 0) {
                            this.setState({teams: response.data.teams});
                        }
                    })
                    .catch((error) => {
                        if(error !== undefined && error.response !== undefined) {
                            if(error.response.data.error === 'JwtTokenExpired') {
                                removeJwtDataFromSessionStorage()
                            } else {
                                this.setState({
                                    serverResponse: {
                                        origin: error.response.data.origin,
                                        content: error.response.data.error
                                    }
                                })
                            }
                        }
                    });
                } catch(e) {
                    this.setState({serverResponse: {
                        origin: 'axios',
                        content: e.message
                    }});
                }
            }
        } else {
            try {
                await axios.post('/team/list', 
                {
                    ref: this.props.params.ref,
                    objId: this.props.params.objId
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response.data.teams !== undefined && response.data.teams !== '' && response.data.teams !== null && response.data.teams.length > 0) {
                        this.setState({teams: response.data.teams});
                    }
                })
                .catch((error) => {
                    if(error !== undefined && error.response !== undefined) {
                        if(error.response.data.error === 'JwtTokenExpired') {
                            removeJwtDataFromSessionStorage()
                        } else {
                            this.setState({
                                serverResponse: {
                                    origin: error.response.data.origin,
                                    content: error.response.data.error
                                }
                            })
                        }
                    }
                });
            } catch(e) {
                this.setState({serverResponse: {
                        origin: 'axios',
                        content: e.message
                    }});
            }
        }
    }

    async getTask() {
        let fields = this.state.fields;
        try {
            await axios.post('/task/details', 
            {
                userId: this.state.auth.userId,
                taskId: this.props.location.state.taskId
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response !== undefined || response.data.task !== null) {
                    this.setState({
                        task: response.data.task
                    })
                    fields['name'] = this.state.task.name;
                    fields['description'] = this.state.task.description;
                    fields['category'] = this.state.task.category.name;
                    fields['teams'] = this.state.task.teams;
                    fields['status'] = this.state.task.status;
                    fields['project'] = this.state.task.project;
                    fields['assigned_user'] = this.state.task.assigned_user._id;
                    fields['dueDate'] = moment(this.state.task.dueDate).format('YYYY-MM-DD');
                    this.setState({fields});
                }          
            }, {headers: this.headers, withCredentials: true})
            .catch(error => {
                if(error !== undefined && error.response !== undefined) {
                    if(error.response.data.error === 'JwtTokenExpired') {
                        removeJwtDataFromSessionStorage()
                    } else {
                        this.setState({
                            serverResponse: {
                                origin: error.response.data.origin,
                                content: error.response.data.error
                            }
                        })
                    }
                }
            })    
        } catch(e) {
            this.setState({
                serverResponse: {
                        origin: 'axios',
                        content: e.message
                    }
            })
        }
    }

    async getUserList() {
        if(this.props.params === undefined) {
            if(this.props.location === undefined && this.props.location.state === undefined) {
                try {
                    await axios.post('/user/list', 
                    {
                        ref: 'user',
                        objId: this.state.auth.userId
                    }, {headers: this.headers, withCredentials: true })
                    .then((response) => {
                        if(response.data.users.length > 0 && response.data.users !== null) {
                            this.setState({users: response.data.users});
                        }   
                    })
                    .catch((error) => {
                        if(error !== undefined && error.response !== undefined) {
                            if(error.response.data.error === 'JwtTokenExpired') {
                                removeJwtDataFromSessionStorage()
                            } else {
                                this.setState({
                                    serverResponse: {
                                        origin: error.response.data.origin,
                                        content: error.response.data.error
                                    }
                                })
                            }
                        }
                    });
                } catch(e) {
                    this.setState({serverResponse: {
                        origin: 'axios',
                        content: e.message
                    }});
                }
            } else {
                try {
                    await axios.post('/user/list', 
                    {
                        ref: this.props.location.state.ref,
                        objId: this.props.location.state.objId
                    }, {headers: this.headers, withCredentials: true })
                    .then((response) => {
                        if(response.data.users.length > 0 && response.data.users !== null) {
                            this.setState({users: response.data.users});
                        }   
                    })
                    .catch((error) => {
                        if(error !== undefined && error.response !== undefined) {
                            if(error.response.data.error === 'JwtTokenExpired') {
                                removeJwtDataFromSessionStorage()
                            } else {
                                this.setState({
                                    serverResponse: {
                                        origin: error.response.data.origin,
                                        content: error.response.data.error
                                    }
                                })
                            }
                        }
                    });
                } catch(e) {
                    this.setState({serverResponse: {
                        origin: 'axios',
                        content: e.message
                    }});
                }
            }
        } else {
            try {
                await axios.post('/user/list', 
                {
                    ref: this.props.params.ref,
                    objId: this.props.params.objId
                }, {headers: this.headers, withCredentials: true })
                .then((response) => {
                    if(response.data.users.length > 0 && response.data.users !== null) {
                        this.setState({users: response.data.users});
                    }   
                })
                .catch((error) => {
                    if(error !== undefined && error.response !== undefined) {
                        if(error.response.data.error === 'JwtTokenExpired') {
                            removeJwtDataFromSessionStorage()
                        } else {
                            this.setState({
                                serverResponse: {
                                    origin: error.response.data.origin,
                                    content: error.response.data.error
                                }
                            })
                        }
                    }
                });
            } catch(e) {
                this.setState({serverResponse: {
                        origin: 'axios',
                        content: e.message
                    }});
            }
        }
    }

    async deleteTask() {
        const {t} = this.props;
        try {
            await axios.post('/task/delete',
            {
                userId: this.state.auth.userId,
                taskId: this.state.task._id
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response !== undefined && response.data.task !== null) {
                    this.setState({task: response.data.task, serverResponse: t('content.task.actions.deleteTask.actionResults.success')});
                }
            })
            .catch((error) => {
                if(error !== undefined && error.response !== undefined) {
                    if(error.response.data.error === 'JwtTokenExpired') {
                        removeJwtDataFromSessionStorage()
                    } else {
                        this.setState({
                            serverResponse: {
                                origin: error.response.data.origin,
                                content: error.response.data.error
                            }
                        })
                    }
                }
            })
        } catch(e) {
            this.setState({serverResponse: {
                origin: 'axios',
                content: e.message
            }});
        }
    }

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const {t} = this.props;
        this.setState({serverResponse: {
            origin: null,
            content: null
        }})

        if(this.validateForm()) {
            try {
                axios.post('/task/update', {
                    userId: this.state.auth.userId,
                    taskId: this.state.task._id,
                    taskObj: this.state.fields
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.task !== null) {
                        this.setState({
                            task: response.data.task,
                            serverResponse: {
                                origin: response.data.origin,
                                content: t('content.task.actions.updateTask.actionResults.success')
                            }
                        });
                    }
                })
                .catch(error => {
                    if(error !== undefined && error.response !== undefined) {
                        if(error.response.data.error === 'JwtTokenExpired') {
                            removeJwtDataFromSessionStorage()
                        } else {
                            this.setState({
                                serverResponse: {
                                    origin: error.response.data.origin,
                                    content: error.response.data.error
                                }
                            })
                        }
                    }
                }) 
            } catch(e) {
                this.setState({serverResponse: {
                    origin: 'axios',
                    content: e.message
                }});
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

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.accessToken !== null) {
            if(this.props.location.state !== undefined && this.props.location.state.taskId) {
                return( 
                    <div>
                        <h2>{t('content.task.fields.overview')}</h2>
                        {this.state.task !== null ? (
                            <div>
                                <form id="form" onSubmit={this.onFormSubmit}>
                                    <table className="tab-table">
                                        <thead>
                                            <tr>
                                                <th>{t('content.task.fields.name')}</th>
                                                <th>{t('content.task.fields.category')}</th>
                                                <th>{t('content.task.fields.project')}</th>
                                                <th>{t('content.task.fields.status')}</th>
                                                <th>{t('content.task.fields.assignedUser')}</th>
                                                <th>{t('content.task.fields.assignedTeams')}</th>
                                                <th>{t('content.project.fields.dueDate')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input placeholder={t('misc.actionDescription.insertName')} onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" name="name" disabled={!this.state.enableEdit} />
                                                </td>
                                                <td>
                                                    <select onChange={this.onChange.bind(this, 'category')} value={this.state.fields['category']} type="category" className="" name="category" disabled={!this.state.enableEdit} >
                                                        <option selected value={this.state.task.category.name}>{this.state.task.category.name}</option>
                                                        {this.state.categories.length > 0 && (
                                                            this.state.categories.map((category, index) => {
                                                                if(category._id !== this.state.task.category._id) {
                                                                    return <option value={category.name}>{category.name}</option>
                                                                }
                                                            })
                                                        )}
                                                    </select>
                                                </td>
                                                <td>
                                                    {this.state.task.project !== null ? (
                                                        <select onChange={this.onChange.bind(this, 'project')} value={this.state.fields['project']} type="project" className="" name="project" disabled={!this.state.enableEdit} >
                                                            <option selected value={this.state.task.project._id}>{this.state.task.project.name}</option>
                                                            {this.state.projects.length > 0 && (
                                                                this.state.projects.map((project, index) => {
                                                                    if(project._id !== this.state.task.project._id) {
                                                                        return <option value={project._id}>{project.name}</option>
                                                                    }
                                                                })
                                                            )}
                                                        </select>   
                                                    ) : (
                                                        <select onChange={this.onChange.bind(this, 'project')} value={this.state.fields['project']} type="project" className="" name="project" disabled={!this.state.enableEdit} >
                                                            <option selected value='none'></option>
                                                            {this.state.projects.length > 0 && (
                                                                this.state.projects.map((project, index) => {
                                                                    return <option value={project._id}>{project.name}</option>
                                                                })
                                                            )}
                                                        </select> 
                                                    )}
                                                </td>
                                                <td>
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
                                                </td>
                                                <td>
                                                    <select onChange={this.onChange.bind(this, 'assigned_user')} value={this.state.fields['assigned_user']} type="assigned_user" className="" name="assigned_user" disabled={!this.state.enableEdit} >
                                                        <option selected value={this.state.task.assigned_user._id}>{this.state.task.assigned_user.username}</option>
                                                        {this.state.users.length > 0 && (
                                                            this.state.users.map((user, index) => {
                                                                if(user._id !== this.state.task.assigned_user._id) {
                                                                    return <option value={user._id}>{user.username}</option>
                                                                }
                                                            })
                                                        )}
                                                    </select>
                                                </td>
                                                <td style={{maxWidth: '10vw'}}>
                                                    <Select 
                                                        options={this.state.teams} 
                                                        isMulti
                                                        value={this.state.fields['teams']}
                                                        onChange={(value) => {
                                                            let fields = this.state.fields;
                                                            fields['teams'] = value;
                                                            if(fields['teams'] !== this.state.task.teams) {
                                                                this.setState({allowSave: true})
                                                            }
                                                            this.setState({fields});
                                                        }}
                                                        name="Teams"
                                                        defaultValue={() => this.state.task.teams.map((team) => {return [team.name]})}
                                                        placeholder={t('misc.actionDescription.addTeam')}
                                                        getOptionLabel={(option) => option.name} 
                                                        getOptionValue={(option) => option._id}
                                                        noOptionsMessage={() => t('commonErrors.noTeamsAvailable')}
                                                        isDisabled={!this.state.enableEdit} />
                                                </td>
                                                <td>
                                                    <input onChange={this.onChange.bind(this, 'dueDate')} value={this.state.fields['dueDate']} type="date" className="" name="dueDate"
                                                        min="2021-02-01" max="2022-12-31" disabled={!this.state.enableEdit} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><span className="error-msg-span">{this.state.errors["name"]}</span></td>
                                                <td><span className="error-msg-span">{this.state.errors["category"]}</span></td>
                                                <td><span className="error-msg-span">{this.state.errors["project"]}</span></td>
                                                <td><span className="error-msg-span">{this.state.errors["status"]}</span></td>
                                                <td><span className="error-msg-span">{this.state.errors["teams"]}</span></td>
                                                <td><span className="error-msg-span">{this.state.errors["teams"]}</span></td>
                                                <td><span className="error-msg-span">{this.state.errors["dueDate"]}</span></td>
                                            </tr>
                                        </tbody>
                                        <thead>
                                            <tr>
                                                <th colspan="7">{t('content.task.fields.description')}</th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colspan="7" height="10vh">
                                                    <JoditEditor
                                                        ref={this.state.fields['description']}
                                                        value={this.state.fields['description']}
                                                        tabIndex={1} // tabIndex of textarea
                                                        onChange={(value) => {let fields = this.state.fields; let errors = this.state.errors; fields['description'] = value; errors['description'] = ''; this.setState({fields, allowSave: true})}}
                                                        //onBlur={newContent => { let fields = this.state.fields; fields['description'] = newContent; this.setState({fields})}} // preferred to use only this option to update the content for performance reasons
                                                    />
                                                </td>
                                            </tr>
                                            <tr><td><span className="error-msg-span">{this.state.errors["description"]}</span></td></tr>
                                            <tr>
                                                <th>{t('misc.fields.createdAt')}</th>
                                                <td>{moment(this.state.task.created_at).format('YYYY-MM-DD | hh:mm:ss')}</td>
                                                <th>{t('misc.fields.modifiedAt')}</th>
                                                <td>{moment(this.state.task.modified_at).format('YYYY-MM-DD | hh:mm:ss')}</td>
                                            </tr>
                                            {this.state.serverResponse.content !== null ? (
                                            this.state.user !== null ? (
                                                <tr>
                                                    <td colspan="7" align="center">
                                                        <span className="error-msg-span" style={{display: "block", color: 'green'}} id="serverResponse">{this.state.serverResponse.content}</span>                                                            
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr>
                                                    <td colspan="7" align="center">
                                                        <span className="error-msg-span" style={{display: "block"}} id="serverResponse">{t('content.task.actions.selectTask.errorMessages.dataValidation.' + this.state.serverResponse.content)}</span>
                                                    </td>
                                                </tr>
                                                )
                                            ) : (
                                                null
                                            )}
                                        </tbody>
                                    </table>
                                </form>
                                {(this.state.auth.userId === this.state.task.assigned_user._id) || (this.state.auth.userId === this.state.task.author._id) ? (
                                    <div>
                                        <div class="card-form-divider">
                                            <Link to='/dashboard'><button className="card-form-button">{t('misc.actionDescription.return')}</button></Link>
                                            <button className="card-form-button" form="form" type="submit" hidden={!this.state.enableEdit} disabled={this.state.allowSave}>{t('misc.actionDescription.save')}</button>
                                            <button className="card-form-button" onClick={() => {this.setState(prev => ({enableEdit: !prev.enableEdit}))}} hidden={this.state.enableEdit}>{t('misc.actionDescription.edit')}</button>
                                            <button className="card-form-button" onClick={() => {this.setState(prev => ({enableEdit: !prev.enableEdit})); this.resetForm()}} hidden={!this.state.enableEdit}>{t('misc.actionDescription.cancel')}</button>
                                            <button className="card-form-button" onClick={this.deleteTask} hidden={!this.state.enableEdit}>{t('misc.actionDescription.delete')}</button>
                                        </div>
                                        <br /><hr className="tab-hr" /><br />
                                                                        
                                        <h3>{t('content.task.actions.selectTask.associatedProjects')}</h3>
                                        <ProjectList params={{ref: 'task', objId: this.state.task._id}} />
                                    </div>
                                ) : (
                                    <div class="card-form-divider">
                                        <Link to='/dashboard'><button className="card-form-button">{t('misc.actionDescription.return')}</button></Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            null
                        )}
                    </div>
                )
            } else {
                return( 
                    <div align="center">
                        <h3>{t('content.task.actions.selectTask.errorMessages.dataValidation.missingProps')}</h3>
                        <Link to='/dashboard'><button className="card-form-button">{t('misc.actionDescription.return')}</button></Link>
                    </div>
                )
            }
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

const TaskTranslation = withTranslation('common')(Task);

export default TaskTranslation;

