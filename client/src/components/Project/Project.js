import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import JoditEditor from 'jodit-react';
import TaskList from '../Task/TaskList';
import TeamList from '../Team/TeamList';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class Project extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    accessToken: this.jwt.accessToken
                },
                project: null,
                categories: [],
                teams: [],
                users: [],
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

        this.deleteProject = this.deleteProject.bind(this);

        this.getTeamList();
        this.getUserList();
        this.getCategoryList();
        this.getProject();
    }

    onChange(field, event) {
        let fields = this.state.fields;
        let errors = this.state.errors;
        
        if(field === 'restricted_access') {
            fields[field] = event.target.checked;
        } else {
            fields[field] = event.target.value;       
        }

        if(field === 'category') {
            if(fields[field] === this.state.project[field].name) {
                this.setState({fields, errors, allowSave: false});
            } else {
                this.setState({fields, errors, allowSave: true});
            }
        } else if(field === 'owner') {
            if(fields[field] === this.state.project[field].username) {
                this.setState({fields, errors, allowSave: false});
            } else {
                this.setState({fields, errors, allowSave: true});
            }
        } else {
            if(fields[field] === this.state.project[field]) {
                this.setState({fields, errors, allowSave: false});
            } else {
                this.setState({fields, errors, allowSave: true});
            }
        }

        errors[field] = '';
        this.setState({fields, errors});
    }

    resetForm() {
        let fields = this.state.fields;
        fields['name'] = this.state.project.name;
        fields['description'] = this.state.project.description;
        fields['organization'] = this.state.project.organization.name;
        fields['category'] = this.state.project.category.name;
        fields['teams'] = this.state.project.teams;
        fields['status'] = this.state.project.status;
        fields['owner'] = this.state.project.owner.username;
        fields['dueDate'] = moment(this.state.project.dueDate).format('YYYY-MM-DD');

        this.setState({fields, errors: {}, allowSave: false, 
            serverResponse: {
                origin: null,
                content: null
            }
        });
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

    async getCategoryList() {
        await axios.post('/category/list', { category_type: 'project'}, {headers: this.headers, withCredentials: true })
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

    getTeamList() {
        if(this.props.params === undefined) {
            if(this.props.location === undefined && this.props.location.state === undefined) {
                try {
                    axios.post('/team/list',
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
                    axios.post('/team/list',
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
                axios.post('/team/list',
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

    async getProject() {
        let fields = this.state.fields;
        try {
            await axios.post('/project/details', 
            {
                userId: this.state.auth.userId,
                projectId: this.props.location.state.projectId
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response !== undefined || response.data.project !== null) {
                    this.setState({
                        project: response.data.project
                    })
                    fields['name'] = this.state.project.name;
                    fields['description'] = this.state.project.description;
                    fields['category'] = this.state.project.category.name;
                    fields['teams'] = this.state.project.teams;
                    fields['organization'] = this.state.project.organization.name;
                    fields['status'] = this.state.project.status;
                    fields['owner'] = this.state.project.owner.username;
                    fields['dueDate'] = moment(this.state.project.dueDate).format('YYYY-MM-DD');
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

    async deleteProject() {
        const {t} = this.props;
        try {
            await axios.post('/project/delete',
            {
                userId: this.state.auth.userId,
                projectId: this.state.project._id
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response !== undefined && response.data.project !== null) {
                    this.setState({project: null, serverResponse: t('content.project.actions.deleteProject.actionResults.success')});
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
                axios.post('/project/update', {
                    userId: this.state.auth.userId,
                    projectId: this.state.project._id,
                    projectObj: this.state.fields
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.project !== null) {
                        this.setState({
                            project: response.data.project,
                            serverResponse: {
                                origin: response.data.origin,
                                content: t('content.project.actions.updateProject.actionResults.success')
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
            if(this.props.location.state !== undefined && this.props.location.state.userId && this.props.location.state.projectId) {
                return( 
                    <div>
                        {this.state.project !== null ? (
                            <div>
                                <h2>{t('content.project.fields.overview')}</h2>
                                <form id="form" onSubmit={this.onFormSubmit}>
                                    <table className="tab-table">
                                        <thead>
                                            <tr>
                                                <th>{t('content.project.fields.name')}</th>
                                                <th>{t('content.project.fields.category')}</th>
                                                <th>{t('content.project.fields.status')}</th>
                                                <th>{t('content.project.fields.projectManager')}</th>
                                                <th>{t('content.project.fields.associatedTeams')}</th>
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
                                                        <option selected value={this.state.project.category.name}>{this.state.project.category.name}</option>
                                                        {this.state.categories.length > 0 && (
                                                            this.state.categories.map((category, index) => {
                                                                if(category._id !== this.state.project.category._id) {
                                                                    return <option value={category.name}>{category.name}</option>
                                                                }
                                                            })
                                                        )}
                                                    </select>
                                                </td>
                                                <td>
                                                    <select onChange={this.onChange.bind(this, 'status')} value={this.state.fields['status']} type="status" className="" name="status" disabled={!this.state.enableEdit }>
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
                                                    <select defaultValue={this.state.project.owner._id} value={this.state.fields['owner']}  onChange={this.onChange.bind(this, 'owner')} type="owner" className="" name="owner" disabled={!this.state.enableEdit}>
                                                        <option selected value={this.state.project.owner._id}>{this.state.project.owner.username}</option>
                                                        {this.state.users.map((user, index) => {
                                                            if(user._id !== this.state.project.owner._id) {
                                                                return <option value={user._id}>{user.username}</option>
                                                            }
                                                        })}
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
                                                            errors['teams'] = ''
                                                            if(fields['teams'] !== this.state.project.teams) {
                                                                this.setState({allowSave: true})
                                                            }
                                                            this.setState({fields, errors});
                                                        }}
                                                        name="Teams"
                                                        defaultValue={() => this.state.project.teams.map((team) => {return [team.name]})}
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
                                                <td><span className="error-msg-span">{this.state.errors["status"]}</span></td>
                                                <td><span className="error-msg-span">{this.state.errors["owner"]}</span></td>
                                                <td><span className="error-msg-span">{this.state.errors["teams"]}</span></td>
                                                <td><span className="error-msg-span">{this.state.errors["dueDate"]}</span></td>
                                            </tr>
                                        </tbody>
                                        <thead>
                                            <tr>
                                                <th colspan="6">{t('content.project.fields.description')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colspan="6">
                                                    <JoditEditor
                                                        ref={this.state.fields['description']}
                                                        value={this.state.fields['description']}
                                                        tabIndex={1} // tabIndex of textarea
                                                        onChange={(value) => {let fields = this.state.fields; fields['description'] = value; this.setState({fields, allowSave: true})}}
                                                        //onBlur={newContent => { let fields = this.state.fields; fields['description'] = newContent; this.setState({fields})}} // preferred to use only this option to update the content for performance reasons
                                                    />
                                                </td>
                                                <td><span className="error-msg-span">{this.state.errors["description"]}</span></td>
                                            </tr>
                                            <tr>
                                                <th>{t('misc.fields.createdAt')}</th>
                                                <td>{moment(this.state.project.created_at).format('YYYY-MM-DD | hh:mm:ss')}</td>
                                                <th>{t('misc.fields.modifiedAt')}</th>
                                                <td>{moment(this.state.project.modified_at).format('YYYY-MM-DD | hh:mm:ss')}</td>
                                            </tr>
                                            {this.state.serverResponse.content !== null ? (
                                                this.state.user !== null ? (
                                                    <tr>
                                                        <td colspan="8" align="center">
                                                            <span className="error-msg-span" style={{display: "block", color: 'green'}} id="serverResponse">{this.state.serverResponse.content}</span>                                                            
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <tr>
                                                        <td colspan="8" align="center">
                                                            <span className="error-msg-span" style={{display: "block"}} id="serverResponse">{t('content.project.actions.updateProject.errorMessages.dataValidation.' + this.state.serverResponse.content)}</span>
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
                                    <Link to='/dashboard'><button className="card-form-button">{t('misc.actionDescription.return')}</button></Link>
                                    <button className="card-form-button" form="form" type="submit" hidden={!this.state.enableEdit} disabled={!this.state.allowSave}>{t('misc.actionDescription.save')}</button>
                                    <button className="card-form-button" onClick={() => {this.setState(prev => ({enableEdit: !prev.enableEdit}))}} hidden={this.state.enableEdit}>{t('misc.actionDescription.edit')}</button>
                                    <button className="card-form-button" onClick={() => {this.setState(prev => ({enableEdit: !prev.enableEdit})); this.resetForm()}} hidden={!this.state.enableEdit}>{t('misc.actionDescription.cancel')}</button>
                                    <button className="card-form-button" onClick={this.deleteProject} hidden={!this.state.enableEdit}>{t('misc.actionDescription.delete')}</button>
                                </div>

                                <br /><hr className="tab-hr" /><br />

                                <h3>{t('content.project.actions.selectProject.associatedTasks')}</h3>
                                <TaskList params={{ref: 'project', objId: this.state.project._id}} />

                                <h3>{t('content.project.actions.selectProject.associatedTeams')}</h3>
                                <TeamList params={{ref: 'project', objId: this.state.project._id}} />
                            </div>
                        ) : (
                            <div align="center">
                                <h3>{t('content.project.actions.selectProject.errorMessages.dataValidation.missingProps')}</h3>
                                <Link to='/dashboard'><button className="card-form-button">{t('misc.actionDescription.return')}</button></Link>
                            </div>
                        )}
                    </div>
                )
            } else {
                return( 
                    <div align="center">
                        <h3>{t('content.project.actions.selectProject.errorMessages.dataValidation.missingProps')}</h3>
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

const ProjectTranslation = withTranslation('common')(Project);

export default ProjectTranslation;

