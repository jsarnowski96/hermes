import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import axios from 'axios';
import Select from 'react-select';

import ProjectList from '../Project/ProjectList';
import TaskList from '../Task/TaskList';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class Team extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    refreshToken: this.jwt.refreshToken
                },
                team: null,
                organizations: [],
                categories: [],
                users: [],
                options: [],
                fields: {},
                errors: {},
                enableEdit: false,
                addMember: false,
                allowSave: false,
                serverResponse: null
            }

            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.auth.refreshToken}`
            };
        }

        
        this.getUsers();
        this.getCategories();
        this.getOrganizations();
        this.getTeam();
    }

    onChange(field, event) {
        let fields = this.state.fields;
        let errors = this.state.errors;

        fields[field] = event.target.value;
        errors[field] = '';
        
        if(field === 'organization' || field === 'category') {
            if(fields[field] === this.state.team[field].name) {
                this.setState({fields, errors, allowSave: false});
            } else {
                this.setState({fields, errors, allowSave: true});
            }
        }
        
        if(fields[field] === this.state.team[field]) {
            this.setState({fields, errors, allowSave: false});
        } else {
            this.setState({fields, errors, allowSave: true});
        }
    }

    resetForm() {
        let fields = this.state.fields;
        fields['organization'] = this.state.team.organization.name;
        fields['category'] = this.state.team.category.name;
        fields['name'] = this.state.team.name;
        fields['members'] = this.state.team.members;
        fields['description'] = this.state.team.description;
        fields['owner'] = this.state.team.owner;
        fields['avatar_url'] = this.state.team.avatar_url;

        document.getElementById('serverResponse').innerHTML = '';
        this.setState({fields, errors: {}, serverResponse: null});
    }

    validateForm() {
        let fields = this.state.fields;
        let errors = this.state.errors;
        let isValid = true;
        const {t} = this.props;

        if(!fields['name']) {
            isValid = false;
            errors['name'] = t('misc.phrases.field') + ' \'' + t('content.team.fields.name') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['name'] !== undefined) {
            if(!fields['name'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/;
                isValid = false;
                errors['name'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['category'] || fields['category'] === 'none') {
            isValid = false;
            errors['category'] = t('misc.phrases.field') + ' \'' + t('content.category.title') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['organization'] || fields['organization'] === 'none') {
            isValid = false;
            errors['organization'] = t('misc.phrases.field') + ' \'' + t('content.organization.title') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['description']) {
            isValid = false;
            errors['description'] = t('misc.phrases.field') + ' \'' + t('content.team.fields.description') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['description'] !== undefined) {
            if(!fields['description'].match(/^.{1,500}$/)) {
                let regex = /^.{1,500}$/;
                isValid = false;
                errors['description'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        this.setState({errors: errors});

        return isValid;
    }

    async getTeam() {
        let fields = this.state.fields;
        try {
            await axios.post('http://localhost:3300/team/details', {
                ref: this.props.location.state.ref,
                objId: this.props.location.state.objId
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response !== undefined && response.data.team !== null) {
                    this.setState({team: response.data.team});
                    fields['organization'] = this.state.team.organization.name;
                    fields['category'] = this.state.team.category.name;
                    fields['owner'] = this.state.team.owner;
                    fields['name'] = this.state.team.name;
                    fields['members'] = this.state.team.members;
                    fields['description'] = this.state.team.description;
                    fields['avatar_url'] = this.state.team.avatar_url;
                    this.setState({fields});
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
    }

    async getCategories() {
        try {
            await axios.post('http://localhost:3300/category/list', { category_type: 'team'}, {headers: this.headers, withCredentials: true })
            .then((response) => {
                if(response.data.categories.length > 0 && response.data.categories !== null) {
                    this.setState({categories: response.data.categories});
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

    async getOrganizations() {
        try {
            await axios.post('http://localhost:3300/organization/list', { company: 'Firma testowa #1'}, {headers: this.headers, withCredentials: true })
            .then((response) => {
                if(response.data.organizations.length > 0 && response.data.organizations !== null) {
                    this.setState({organizations: response.data.organizations});
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

    async getUsers() {
        try {
            await axios.post('http://localhost:3300/user/list', 
            {
                ref: 'team',
                objId: this.state.team._id
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

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const fields = this.state.fields;
        const {t} = this.props;

        if(this.validateForm()) {
            try {
                axios.post('http://localhost:3300/team/update',
                {  
                    userId: this.state.auth.userId,
                    teamId: this.state.team._id,
                    teamObj: this.state.fields
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.team !== null) {
                        this.setState({
                            team: response.data.team,
                            serverResponse: t('content.team.actions.updateTeam.actionResults.success')
                        });
                    }
                })
                .catch((error) => {
                    if(error.response.data.error === 'JwtTokenExpired') {
                        removeJwtDataFromSessionStorage();
                    } else {
                        this.setState({serverResponse: error.response.data.error});
                    }
                })
            } catch(e) {
                this.setState({ serverResponse: e.message});
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
                <div>
                    <h2>{t('content.team.fields.overview')}</h2>
                    {this.state.team !== null ? (
                        <div>
                            <form id="form" onSubmit={this.onFormSubmit}>
                                <table className="tab-table">
                                    <thead>
                                        <tr>
                                            <th>{t('content.team.fields.name')}</th>
                                            <th>{t('content.team.fields.description')}</th>
                                            <th>{t('content.team.fields.category')}</th>
                                             <th>{t('content.team.fields.owner')}</th>
                                            <th>{t('content.team.fields.organization')}</th>
                                            <th>{t('content.team.fields.members')}</th>
                                            <th>{t('content.team.fields.avatarUrl')}</th>
                                        </tr>
                                    </thead>
                                     <tbody>
                                        <tr>
                                            <td>
                                                <input onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" id="name" name="name" disabled={!this.state.enableEdit}/>
                                                <span className="error-msg-span">{this.state.errors["name"]}</span>
                                            </td>
                                            <td>
                                                <input onChange={this.onChange.bind(this, 'description')} value={this.state.fields['description']} type="description" className="" id="description" name="description" disabled={!this.state.enableEdit}/>
                                                <span className="error-msg-span">{this.state.errors["description"]}</span>
                                            </td>
                                            <td>
                                                <select defaultValue={this.state.team.category.name} value={this.state.fields['category']} onChange={this.onChange.bind(this, 'category')} type="category" className="" name="category" disabled={!this.state.enableEdit}>
                                                    <option selected  value={this.state.team.category.name}>{this.state.team.category.name}</option>
                                                    {this.state.categories.length > 0 && (
                                                        this.state.categories.map((category, index) => {
                                                            if(category._id !== this.state.team.category._id) {
                                                                return <option value={category.name}>{category.name}</option>
                                                            }
                                                        })
                                                    )}
                                                </select>
                                                <span className="error-msg-span">{this.state.errors["category"]}</span>
                                            </td>
                                            <td>
                                                <select defaultValue={this.state.team.owner._id} value={this.state.fields['owner']}  onChange={this.onChange.bind(this, 'owner')} type="owner" className="" name="owner" disabled={!this.state.enableEdit}>
                                                    <option selected value={this.state.team.owner._id}>{this.state.team.owner.username}</option>
                                                    {this.state.team.members.length > 0 && (
                                                        this.state.team.members.map((member, index) => {
                                                            if(member._id !== this.state.team.owner._id) {
                                                                return <option value={member._id}>{member.username}</option>
                                                            }
                                                        })
                                                    )}
                                                </select>
                                            </td>
                                            <td nowrap="nowrap">
                                                <select defaultValue={this.state.team.organization.name} value={this.state.fields['organization']}  onChange={this.onChange.bind(this, 'organization')} type="organization" className="" name="organization" disabled={!this.state.enableEdit}>
                                                    <option selected value={this.state.team.organization.name}>{this.state.team.organization.name}</option>
                                                    {this.state.organizations.length > 0 && (
                                                        this.state.organizations.map((organization, index) => {
                                                            if(organization._id !== this.state.team.organization._id) {
                                                                return <option value={organization.name}>{organization.name}</option>
                                                            }
                                                        })
                                                    )}
                                                </select>
                                                <span className="error-msg-span">{this.state.errors["organization"]}</span>
                                            </td>
                                            <td>
                                                <Select 
                                                    options={this.state.users} 
                                                    isMulti
                                                    value={this.state.fields['members']}
                                                    onChange={(value) => { 
                                                        let fields = this.state.fields; 
                                                        fields['members'] = value; 
                                                        if(fields['members'] !== this.state.team.members) {
                                                            this.setState({allowSave: true})
                                                        }
                                                        this.setState({fields})}}
                                                    name="Members"
                                                    defaultValue={() => this.state.team.members.map((member) => {return [member.username]})}
                                                    placeholder={t('misc.actionDescription.addMember')}
                                                    getOptionLabel={(option) => option.username} 
                                                    getOptionValue={(option) => option._id} 
                                                    noOptionsMessage={() => t('commonErrors.noMembersAvailable')}
                                                    isDisabled={!this.state.enableEdit}/>
                                                <span className="error-msg-span">{this.state.errors["members"]}</span>
                                            </td>
                                            <td>
                                                <input onChange={this.onChange.bind(this, 'avatar_url')} value={this.state.fields['avatar_url']} type="avatar_url" className="" id="avatar_url" name="avatar_url" disabled={!this.state.enableEdit}/>
                                                <span className="error-msg-span">{this.state.errors["avatar_url"]}</span>
                                            </td>
                                        </tr>
                                        {this.state.serverResponse !== null ? (
                                            this.state.team !== null ? (
                                                <tr>
                                                    <td colspan="7" align="center">
                                                        <span className="error-msg-span" style={{display: "block", color: 'green'}} id="serverResponse">{this.state.serverResponse}</span>                                                            
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr>
                                                    <td colspan="7" align="center">
                                                        <span className="error-msg-span" style={{display: "block"}} id="serverResponse">- {t('content.team.actions.updateTeam.errorMessages.dataValidation.' + this.state.serverResponse)} -</span>
                                                    </td>
                                                </tr>
                                            )
                                        ) : (
                                            null
                                        )}
                                    </tbody>
                                </table>
                            </form>
                            {this.state.auth.userId === this.state.team.owner._id ? (
                                <div class="card-form-divider">
                                    <button className="card-form-button"><Link to='/dashboard'>{t('misc.actionDescription.return')}</Link></button>
                                    <button className="card-form-button" form="form" type="submit" hidden={!this.state.enableEdit} disabled={!this.state.allowSave}>{t('misc.actionDescription.save')}</button>
                                    <button className="card-form-button" onClick={() => {this.setState(prev => ({enableEdit: !prev.enableEdit}))}} hidden={this.state.enableEdit}>{t('misc.actionDescription.edit')}</button>
                                    <button className="card-form-button" onClick={() => {this.setState(prev => ({enableEdit: !prev.enableEdit})); this.resetForm()}} hidden={!this.state.enableEdit}>{t('misc.actionDescription.cancel')}</button>
                                </div>
                            ) : (
                                <div class="card-form-divider">
                                    <button className="card-form-button"><Link to='/dashboard'>{t('misc.actionDescription.return')}</Link></button>
                                </div>
                            )}

                            <h3>{t('content.team.actions.selectTeam.associatedProjects')}</h3>
                            <ProjectList ref='team' objId={this.state.team._id} />

                            <h3>{t('content.team.actions.selectTeam.associatedTasks')}</h3>
                            <TaskList ref='team' objId={this.state.team._id} />
                        </div>
                    ) : (
                        <div>
                            <table className="tab-table">
                                <tr>
                                    {this.state.serverResponse !== null ? (
                                        <td colspan="6" align="center">{t('content.team.actions.selectTeam.errorMessages.dataValidation.' + this.state.serverResponse)}</td>
                                    ) : (
                                        <td colspan="6" align="center">-</td>
                                    )}
                                </tr>
                            </table>
                            <div className="card-form-divider">
                                <button className="card-form-button"><Link to='/dashboard'>{t('misc.actionDescription.return')}</Link></button>
                            </div>
                        </div>
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

const TeamTranslation = withTranslation('common')(Team);

export default TeamTranslation;

