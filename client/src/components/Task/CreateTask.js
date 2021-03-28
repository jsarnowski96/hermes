import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import JoditEditor from 'jodit-react';

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
                    accessToken: this.jwt.accessToken
                },
                categories: [],
                teams: [],
                projects: [],
                users: [],
                statuses: [ 'To do', 'In progress', 'In review', 'Postponed', 'Done'],
                fields: {},
                errors: {},
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

        this.resetForm = this.resetForm.bind(this);                

        this.getCategoryList();
        this.getProjectList();
        this.getTeamList();
        this.getUserList();
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

    async getTeamList() {
        if(this.props.params === undefined) {
            if(this.props.location.state === undefined) {
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

    async getUserList() {
        if(this.props.params === undefined) {
            if(this.props.location.state === undefined) {
                try {
                    await axios.post('/user/list', 
                    {
                        ref: 'company',
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

    async getProjectList() {
        if(this.props.params === undefined) {
            if(this.props.location.state === undefined) {
                try {
                    axios.post('/project/list', 
                    {
                        ref: 'company',
                        objId: this.state.auth.userId
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

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const {t} = this.props;
        const fields = this.state.fields;
        this.setState({serverResponse: {
            origin: null,
            content: null
        }})

        if(this.validateForm()) {
            try {
                axios.post('/task/create', {
                    userId: this.state.auth.userId,
                    taskObj: this.state.fields
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.task !== null) {
                        this.setState({task: response.data.task, serverResponse: {
                            origin: response.data.origin,
                            content: t('content.task.actions.createTask.actionResults.success')
                        }})
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
            return(
                <div>
                    <h2>{t('content.task.actions.createTask.actionTitle')}</h2>
                    <form className="card-form" id="form" onSubmit={this.onFormSubmit}>
                    <table className="tab-table">
                            <thead>
                                <tr>
                                    <th>{t('content.task.fields.name')}</th>
                                    <th>{t('content.task.fields.category')}</th>
                                    <th>{t('content.task.fields.project')}</th>
                                    <th>{t('content.task.fields.assignedUser')}</th>
                                    <th>{t('content.task.fields.assignedTeams')}</th>
                                    <th>{t('content.task.fields.status')}</th>
                                    <th>{t('content.task.fields.dueDate')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input placeholder={t('misc.actionDescription.insertName')} onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" name="name" />
                                    </td>
                                    <td>
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
                                    </td>
                                    <td>
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
                                    </td>
                                    <td>
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
                                    </td>
                                    <td>
                                        <Select 
                                            options={this.state.teams} 
                                            isMulti
                                            value={this.state.fields['teams']}
                                            onChange={(value) => {
                                                let fields = this.state.fields;
                                                let errors = this.state.errors;
                                                fields['teams'] = value;
                                                errors['teams'] = '';
                                                this.setState({fields, errors});
                                            }}
                                            name="Teams"
                                            placeholder={t('misc.actionDescription.addTeam')}
                                            getOptionLabel={(option) => option.name} 
                                            getOptionValue={(option) => option._id}
                                            noOptionsMessage={() => t('commonErrors.noTeamsAvailable')}
                                            />
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
                                        <input onChange={this.onChange.bind(this, 'dueDate')} value={this.state.fields['dueDate']} type="date" className="" name="dueDate"
                                            min="2021-02-01" max="2022-12-31" />
                                    </td>
                                </tr>
                                <tr>
                                    <td><span className="error-msg-span">{this.state.errors["name"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["category"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["projectId"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["assigned_user"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["teams"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["status"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["dueDate"]}</span></td>
                                </tr>
                            </tbody>
                            <thead>
                                <tr><th colspan="7">{t('content.task.fields.description')}</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="7">
                                        <JoditEditor
                                            ref={this.state.fields['description']}
                                            value={this.state.fields['description']}
                                            tabIndex={1} // tabIndex of textarea
                                            onChange={(value) => {
                                                let fields = this.state.fields; 
                                                let errors = this.state.errors;
                                                fields['description'] = value; 
                                                errors['description'] = '';
                                                this.setState({fields, errors})}}
                                            //onBlur={newContent => { let fields = this.state.fields; fields['description'] = newContent; this.setState({fields})}} // preferred to use only this option to update the content for performance reasons
                                        />
                                    </td>
                                </tr>
                                <tr><td><span className="error-msg-span">{this.state.errors["description"]}</span></td></tr>
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
                                                <span className="error-msg-span" style={{display: "block"}} id="serverResponse">{t('content.task.actions.createTask.errorMessages.dataValidation.' + this.state.serverResponse.content)}</span>
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    null
                                )}
                            </tbody>
                        </table>
                    </form>
                    <div class="card-form-divider">
                        <button type="submit" form="form" className="card-form-button">{t('misc.actionDescription.create')}</button>
                        <button type="reset" className="card-form-button" onClick={this.resetForm}>{t('misc.actionDescription.reset')}</button>
                        <button type="button" className="card-form-button"><Link to="/dashboard" className="card-form-button-link">{t('misc.actionDescription.cancel')}</Link></button>
                    </div>
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