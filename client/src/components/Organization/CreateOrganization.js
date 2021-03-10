import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import axios from 'axios';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/style.css';
import '../../assets/css/errors.css';

class CreateOrganization extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    refreshToken: this.jwt.refreshToken
                },
                fields: {},
                errors: {},
                organization: null,
                serverResponse: null
            }

            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.auth.refreshToken}`
            };
        }

        this.resetForm = this.resetForm.bind(this);                
    }

    componentWillUnmount() {
        axios.Cancel('Axios request canceled.');
    }

    resetForm() {
        document.getElementById('serverResponse').innerHTML = '';
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
            errors['name'] = t('misc.phrases.field') + ' \'' + t('content.organization.fields.name') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['name'] !== undefined) {
            if(!fields['name'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/;
                isValid = false;
                errors['name'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['company']) {
            isValid = false;
            errors['company'] = t('misc.phrases.field') + ' \'' + t('content.company.title') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['company'] !== undefined) {
            if(!fields['company'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/;
                isValid = false;
                errors['company'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(fields['avatar_url'] !== undefined && fields['avatar_url'] !== '') {
            if(!fields['avatar_url'].match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)?/gi)) {
                isValid = false;
                errors['avatar_url'] = t('commonErrors.formValidation.InvalidUrlFormat');
            }
        }

        if(!fields['description']) {
            isValid = false;
            errors['description'] = t('misc.phrases.field') + ' \'' + t('content.organization.fields.description') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
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

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const {t} = this.props;
        const fields = this.state.fields;

        if(this.validateForm()) {
            try {
                axios.post('http://localhost:3300/organization/create', {
                    userId: this.state.auth.userId,
                    organizationObj: this.state.fields
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.organization !== null) {
                        this.setState({
                            organization: response.data.organization,
                            serverResponse: t('content.organization.actions.createOrganization.actionResults.success')
                        })
                    }
                })
                .catch(error => {
                    if (error) {
                        this.setState({
                            serverResponse: error.response.data.error
                        });
                    }
                }) 
            } catch(e) {
                this.setState({
                    serverResponse: e.message
                });
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
                    <p className="card-title">{t('content.organization.actions.createOrganization.actionTitle')}</p><hr className="card-hr" />
                    <form className="card-form" onSubmit={this.onFormSubmit}>
                        <label htmlFor="name">{t('content.organization.fields.name')}</label>
                        <input onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" name="name" />
                        <span className="error-msg-span">{this.state.errors["name"]}</span>
                        <label htmlFor="company">{t('content.company.title')}</label>
                        <input onChange={this.onChange.bind(this, 'company')} value={this.state.fields['company']} type="company" className="" name="company" />
                        <span className="error-msg-span">{this.state.errors["company"]}</span>
                        <label htmlFor="description">{t('content.organization.fields.description')}</label>
                        <textarea onChange={this.onChange.bind(this, 'description')} value={this.state.fields['description']} type="description" id="description" name="description" />
                        <span className="error-msg-span">{this.state.errors["description"]}</span>
                        <label htmlFor="phone">{t('content.company.fields.avatarUrl')}</label>
                        <input onChange={this.onChange.bind(this, 'avatar_url')} value={this.state.fields['avatar_url']} type="avatar_url" className="" name="avatar_url" />
                        <span className="error-msg-span">{this.state.errors["avatar_url"]}</span>
                        <div class="card-form-divider">
                            <button type="submit" className="card-form-button">{t('misc.actionDescription.create')}</button>
                            <button type="reset" className="card-form-button" onClick={this.resetForm}>{t('misc.actionDescription.reset')}</button>
                            <button type="button" className="card-form-button"><Link to="/dashboard" className="card-form-button-link">{t('misc.actionDescription.cancel')}</Link></button>
                        </div>
                        {this.state.serverResponse !== null ? (
                                this.state.organization !== null ? (
                                    <span className="error-msg-span" style={{display: "block", color: 'green'}} id="serverResponse">{this.state.serverResponse}</span>
                                ) : (
                                    <span className="error-msg-span" style={{display: "block"}} id="serverResponse">{t('content.organization.actions.createOrganization.errorMessages.dataValidation.' + this.state.serverResponse)}</span>
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

const CreateOrganizationTranslation = withTranslation('common')(CreateOrganization);

export default CreateOrganizationTranslation;