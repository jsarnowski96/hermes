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

class CreateTeam extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    accessToken: this.jwt.accessToken
                },
                user: null,
                categories: [],
                organizations: [],
                team: null,
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

        this.getUser();
        this.getCategoryList();
        this.getOrganizationList();
        this.getUserList();
    }

    componentWillUnmount() {
        axios.Cancel('Axios request canceled.');
    }

    resetForm() {
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
            errors['name'] = t('misc.phrases.field') + ' \'' + t('content.team.fields.name') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['name'] !== undefined) {
            if(!fields['name'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/;
                isValid = false;
                errors['name'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['members'] || fields['members'] === 'none') {
            isValid = false;
            errors['members'] = t('misc.phrases.field') + ' \'' + t('content.team.fields.members') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
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
            if(!fields['description'].match(/^.{1,500}$/gm)) {
                let regex = /^.{1,500}$/gm;
                isValid = false;
                errors['description'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        this.setState({errors: errors});

        return isValid;
    }

    async getUser() {
        let fields = this.state.fields;

        await axios.post('/user/profile', { userId: this.state.auth.userId}, {headers: this.headers, withCredentials: true})
        .then((response) => {
            if(response !== undefined) {
                fields['members'] = response.data.user;
                this.setState({fields, user: response.data.user});
            }
        })
        .catch((error) => {
            if(error.response.data.error === 'JwtTokenExpired') {
                removeJwtDataFromSessionStorage()
            }
            
            this.setState({
                serverResponse: {
                    origin: error.response.data.origin,
                    content: error.response.data.error
                }
            })
        })
    }

    async getCategoryList() {
        try {
            await axios.post('/category/list', { category_type: 'team'}, {headers: this.headers, withCredentials: true })
            .then((response) => {
                if(response.data.categories.length > 0 && response.data.categories !== null) {
                    this.setState({categories: response.data.categories});
                }   
            })
            .catch((error) => {
                if(error.response.data.error === 'JwtTokenExpired') {
                    removeJwtDataFromSessionStorage()
                }
                
                this.setState({
                    serverResponse: {
                        origin: error.response.data.origin,
                        content: error.response.data.error
                    }
                })
            });
        } catch(e) {
            this.setState({serverResponse: {
                origin: 'axios',
                content: e.message
            }});
        }
        
    }

    async getUserList() {
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
    }

    async getOrganizationList() {
        try {
            await axios.post('/organization/list', 
            {
                ref: 'user',
                objId: this.state.auth.userId
            }, {headers: this.headers, withCredentials: true })
            .then((response) => {
                if(response.data.organizations.length > 0 && response.data.organizations !== null) {
                    this.setState({organizations: response.data.organizations});
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

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const fields = this.state.fields;
        const {t} = this.props;
        this.setState({serverResponse: {
            origin: null,
            content: null
        }})

        if(this.validateForm()) {
            try {
                axios.post('/team/create', {
                    userId: this.state.auth.userId,
                    teamObj: this.state.fields
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.team !== null) {
                        this.setState({
                            team: response.data.team, serverResponse: {
                                origin: response.data.origin,
                                content: t('content.team.actions.createTeam.actionResults.success')
                            }
                        })
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
                this.setState({
                    serverResponse: {
                        origin: 'axios',
                        content: e.message
                    }
                })
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
                    <h2>{t('content.team.actions.createTeam.actionTitle')}</h2>
                    <form className="card-form" onSubmit={this.onFormSubmit}>
                        <table className="tab-table">
                            <thead>
                                <tr>
                                    <th>{t('content.team.fields.name')}</th>
                                    <th>{t('content.category.title')}</th>
                                    <th>{t('content.organization.title')}</th>
                                    <th>{t('content.team.fields.members')}</th>
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
                                                    return <option value={category.name}>{category.name}</option>
                                                })
                                            )}
                                        </select>
                                    </td>
                                    <td>
                                        <select onChange={this.onChange.bind(this, 'organization')} value={this.state.fields['organization']} type="organization" className="" name="organization">
                                            <option selected value="none">{t('misc.actionDescription.selectOrganization')}</option>
                                            {this.state.organizations.length > 0 && (
                                                this.state.organizations.map((organization, index) => {
                                                    return <option value={organization.name}>{organization.name}</option>
                                                })
                                            )}
                                        </select>
                                    </td>
                                    <td>
                                        <Select 
                                            options={this.state.users} 
                                            isMulti
                                            value={this.state.fields['members']}
                                            onChange={(value) => { 
                                                let fields = this.state.fields; 
                                                let errors = this.state.errors;
                                                fields['members'] = value; 
                                                errors['members'] = ''
                                                this.setState({fields, errors})}}
                                            name="Members"
                                            placeholder={t('misc.actionDescription.addMember')}
                                            getOptionLabel={(option) => option.username} 
                                            getOptionValue={(option) => option._id} 
                                            noOptionsMessage={() => t('commonErrors.noMembersAvailable')}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td><span className="error-msg-span">{this.state.errors["name"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["category"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["organization"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["members"]}</span></td>
                                </tr>
                            </tbody>
                            <thead>
                                <tr><th colspan="4">{t('content.team.fields.description')}</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="4">
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
                                            <td colspan="4" align="center">
                                                <span className="error-msg-span" style={{display: "block", color: 'green'}} id="serverResponse">{this.state.serverResponse.content}</span>                                                            
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td colspan="4" align="center">
                                                <span className="error-msg-span" style={{display: "block"}} id="serverResponse">{t('content.team.actions.createTeam.errorMessages.dataValidation.' + this.state.serverResponse.content)}</span>
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    null
                                )}
                            </tbody>
                        </table>
                        <div class="card-form-divider">
                            <button type="submit" className="card-form-button">{t('misc.actionDescription.create')}</button>
                            <button type="reset" className="card-form-button" onClick={this.resetForm}>{t('misc.actionDescription.reset')}</button>
                            <button type="button" className="card-form-button"><Link to="/dashboard" className="card-form-button-link">{t('misc.actionDescription.cancel')}</Link></button>
                        </div>
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

const CreateTeamTranslation = withTranslation('common')(CreateTeam);

export default CreateTeamTranslation;