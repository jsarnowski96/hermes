import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import axios from 'axios';
import moment from 'moment';
import Select, { createFilter } from 'react-select';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class Project extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    refreshToken: this.jwt.refreshToken
                },
                project: null,
                categories: [],
                teams: [],
                statuses: ['To do', 'In progress', 'In review', 'Postponed', 'Done'],
                fields: {},
                errors: {},
                enableEdit: false,
                allowSave: false,
                serverResponse: null
            }

            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.auth.refreshToken}`
            };
        }

        this.getTeams();
        this.getCategories();
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

        document.getElementById('serverResponse').innerHTML = '';
        this.setState({fields, errors: {}, allowSave: false, serverResponse: null});
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

    async getCategories() {
        await axios.post('http://localhost:3300/category/list', { category_type: 'project'}, {headers: this.headers, withCredentials: true })
            .then((response) => {
                if(response.data.categories.length > 0 && response.data.categories !== null) {
                    this.setState({categories: response.data.categories});
                } else {
                    this.setState({categories: null});
                }     
            })
            .catch((error) => {
                if(error.response.data.error === 'JwtTokenExpired') {
                    removeJwtDataFromSessionStorage();
                } else {
                    this.setState({serverResponse: error.response.data.error});
                }
            });
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

    async getProject() {
        let fields = this.state.fields;
        try {
            await axios.post('http://localhost:3300/project/details', 
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
                if(error) {
                    if(error.response.data.error === 'JwtTokenExpired') {
                        removeJwtDataFromSessionStorage();
                    } else {
                        this.setState({
                            serverResponse: error.response.data.error
                        })
                    }
                }
            })    
        } catch(e) {
            this.setState({
                serverResponse: e.message
            })
        }
    }

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const {t} = this.props;

        if(this.validateForm()) {
            try {
                axios.post('http://localhost:3300/project/update', {
                    userId: this.state.auth.userId,
                    projectId: this.state.project._id,
                    projectObj: this.state.fields
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.project !== null) {
                        this.setState({
                            project: response.data.project,
                            serverResponse: t('content.project.actions.updateProject.actionResults.success')
                        });
                    }
                })
                .catch(error => {
                    if(error.response.data.error === 'JwtTokenExpired') {
                        removeJwtDataFromSessionStorage();
                    } else {
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
                    <p className="card-title">{t('content.project.fields.overview')}</p><hr className="card-hr" />
                    {this.state.project !== null ? (
                        <form id="form" onSubmit={this.onFormSubmit}>
                            <table className="tab-table">
                                <tr>
                                    <th>{t('content.project.fields.name')}</th>
                                    <td>
                                        <input onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" name="name" disabled={!this.state.enableEdit} />
                                        <span className="error-msg-span">{this.state.errors["name"]}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t('content.project.fields.description')}</th>
                                    <td>
                                        <textarea onChange={this.onChange.bind(this, 'description')} cols="40" rows="20" value={this.state.fields['description']} type="description" id="description" name="description" disabled={!this.state.enableEdit}/>
                                        <span className="error-msg-span">{this.state.errors["description"]}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t('content.project.fields.category')}</th>
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
                                        <span className="error-msg-span">{this.state.errors["category"]}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t('content.project.fields.status')}</th>
                                    <td>
                                        <Select 
                                            options={this.state.statuses.map((status) => ({value: status, label: status}))} 
                                            value={this.state.fields['status']}
                                            onChange={(value) => { 
                                                let fields = this.state.fields; 
                                                fields['status'] = value;
                                                if(fields['status'] !== JSON.stringify(this.state.project.status)) {
                                                    this.setState({allowSave: true})
                                                }
                                                this.setState({fields})}}
                                            name="Status"
                                            defaultValue={this.state.fields['status']}
                                            //filterOption={createFilter({stringify: option => `${option}`})}
                                            placeholder={t('misc.actionDescription.setStatus')}
                                            getOptionLabel={(option) => option} 
                                            getOptionValue={(option) => option}
                                            noOptionsMessage={() => t('commonErrors.noStatusesAvailable')}
                                            isDisabled={!this.state.enableEdit} />
                                        <span className="error-msg-span">{this.state.errors["status"]}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t('content.project.fields.projectManager')}</th>
                                    <td>
                                        <input onChange={this.onChange.bind(this, 'owner')} value={this.state.fields['owner']} type="owner" className="" name="owner" disabled={!this.state.enableEdit}/>
                                        <span className="error-msg-span">{this.state.errors["owner"]}</span>
                                    </td>
                                </tr>
                                <tr>    
                                    <th>{t('content.project.fields.associatedTeams')}</th>
                                    <td>
                                        <Select 
                                            options={this.state.teams} 
                                            isMulti
                                            value={this.state.fields['teams']}
                                            onChange={(value) => {
                                                let fields = this.state.fields;
                                                fields['teams'] = value;
                                                if(fields['teams'] !== this.state.project.teams) {
                                                    this.setState({allowSave: true})
                                                }
                                                this.setState({fields});
                                            }}
                                            name="Teams"
                                            defaultValue={() => this.state.project.teams.map((team) => {return [team.name]})}
                                            placeholder={t('misc.actionDescription.addTeam')}
                                            getOptionLabel={(option) => option.name} 
                                            getOptionValue={(option) => option._id}
                                            noOptionsMessage={() => t('commonErrors.noTeamsAvailable')}
                                            isDisabled={!this.state.enableEdit} />
                                        <span className="error-msg-span">{this.state.errors["teams"]}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t('content.project.fields.dueDate')}</th>
                                    <td>
                                        <input onChange={this.onChange.bind(this, 'dueDate')} value={this.state.fields['dueDate']} type="date" className="" name="dueDate"
                                            min="2021-02-01" max="2022-12-31" disabled={!this.state.enableEdit} />
                                        <span className="error-msg-span">{this.state.errors["dueDate"]}</span>
                                    </td>
                                </tr>
                            </table>
                        </form>
                    ) : (
                        <h3>{t('content.project.actions.selectProject.errorMessages.dataValidation.ProjectNotFound')}</h3>
                    )}
                    <div class="card-form-divider">
                        <button className="card-form-button"><Link to='/dashboard'>{t('misc.actionDescription.return')}</Link></button>
                        <button className="card-form-button" form="form" type="submit" hidden={!this.state.enableEdit} disabled={!this.state.allowSave}>{t('misc.actionDescription.save')}</button>
                        <button className="card-form-button" onClick={() => {this.setState(prev => ({enableEdit: !prev.enableEdit}))}} hidden={this.state.enableEdit}>{t('misc.actionDescription.edit')}</button>
                        <button className="card-form-button" onClick={() => {this.setState(prev => ({enableEdit: !prev.enableEdit})); this.resetForm()}} hidden={!this.state.enableEdit}>{t('misc.actionDescription.cancel')}</button>
                    </div>
                    {this.state.serverResponse !== null ? (
                        this.state.project !== null ? (
                            <span className="error-msg-span" style={{display: "block", color: 'green'}} id="serverResponse">{this.state.serverResponse}</span>
                        ) : (
                            <span className="error-msg-span" style={{display: "block"}} id="serverResponse">{t('content.project.actions.updateProject.errorMessages.dataValidation.' + this.state.serverResponse)}</span>
                        )
                    ) : (
                        <span className="error-msg-span" id="serverResponse"></span>
                    )}
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

const ProjectTranslation = withTranslation('common')(Project);

export default ProjectTranslation;

