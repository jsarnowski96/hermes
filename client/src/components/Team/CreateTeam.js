import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import axios from 'axios';

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
                    refreshToken: this.jwt.refreshToken
                },
                categories: [],
                organizations: [],
                team: null,
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
        this.getOrganizations();
    }

    componentWillUnmount() {
        axios.Cancel('Axios request canceled.');
    }

    resetForm() {
        document.getElementById('serverResponse').innerHTML = '';
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
            if(!fields['description'].match(/^.{1,500}$/gm)) {
                let regex = /^.{1,500}$/gm;
                isValid = false;
                errors['description'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        this.setState({errors: errors});

        return isValid;
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
                    removeJwtDataFromSessionStorage()
                }
                
                this.setState({
                    serverResponse: error.response.data.error
                })
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
                    removeJwtDataFromSessionStorage()
                }
                
                this.setState({
                    serverResponse: error.response.data.error
                })
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
                axios.post('http://localhost:3300/team/create', {
                    userId: this.state.auth.userId,
                    teamObj: this.state.fields
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.team !== null) {
                        this.setState({
                            team: response.data.team, serverResponse: t('content.team.actions.createTeam.actionResults.success')
                        })
                    }  
                })
                .catch(error => {
                    if(error) {
                        this.setState({
                            serverResponse: error.response.data.error
                        })
                    }
                }) 
            } catch(e) {
                this.setState({
                    serverResponse: e.message
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

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return(
                <div className="card">
                    <p className="card-title">{t('content.team.actions.createTeam.actionTitle')}</p><hr className="card-hr" />
                    <form className="card-form" onSubmit={this.onFormSubmit}>
                        <label htmlFor="name">{t('content.team.fields.name')}</label>
                        <input onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" name="name" />
                        <span className="error-msg-span">{this.state.errors["name"]}</span>
                        <label htmlFor="description">{t('content.team.fields.description')}</label>
                        <textarea onChange={this.onChange.bind(this, 'description')} value={this.state.fields['description']} type="description" id="description" name="description" />
                        <span className="error-msg-span">{this.state.errors["description"]}</span>
                        <label htmlFor="category">{t('content.category.title')}</label>
                        <select onChange={this.onChange.bind(this, 'category')} value={this.state.fields['category']} type="category" className="" name="category">
                            <option selected value="none">{t('misc.actionDescription.selectCategory')}</option>
                            {this.state.categories.length > 0 && (
                                this.state.categories.map((category, index) => {
                                    return <option value={category.name}>{category.name}</option>
                                })
                            )}
                        </select>
                        <span className="error-msg-span">{this.state.errors["category"]}</span>
                        <label htmlFor="organization">{t('content.organization.title')}</label>
                        <select onChange={this.onChange.bind(this, 'organization')} value={this.state.fields['organization']} type="organization" className="" name="organization">
                            <option selected value="none">{t('misc.actionDescription.selectOrganization')}</option>
                            {this.state.organizations.length > 0 && (
                                this.state.organizations.map((organization, index) => {
                                    return <option value={organization.name}>{organization.name}</option>
                                })
                            )}
                        </select>
                        <span className="error-msg-span">{this.state.errors["organization"]}</span>
                        <div class="card-form-divider">
                            <button type="submit" className="card-form-button">{t('misc.actionDescription.create')}</button>
                            <button type="reset" className="card-form-button" onClick={this.resetForm}>{t('misc.actionDescription.reset')}</button>
                            <button type="button" className="card-form-button"><Link to="/dashboard" className="card-form-button-link">{t('misc.actionDescription.cancel')}</Link></button>
                        </div>
                        {this.state.serverResponse !== null ? (
                                this.state.team !== null ? (
                                    <span className="error-msg-span" style={{display: "block", color: 'green'}} id="serverResponse">{this.state.serverResponse}</span>
                                ) : (
                                    <span className="error-msg-span" style={{display: "block"}} id="serverResponse">{t('content.team.actions.createTeam.errorMessages.dataValidation.' + this.state.serverResponse)}</span>
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

const CreateTeamTranslation = withTranslation('common')(CreateTeam);

export default CreateTeamTranslation;