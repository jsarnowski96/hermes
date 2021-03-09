import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import axios from 'axios';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/register.css';
import '../../assets/css/style.css';
import '../../assets/css/errors.css';

class CreateCompany extends React.Component {
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
                errors: {}
            }

            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.auth.refreshToken}`
            };
        } else {
            this.state = {
                auth: {
                    userId: null,
                    refreshToken: null
                },
                fields: {},
                errors: {}
            }
        }

        this.resetForm = this.resetForm.bind(this);
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
        this.setState({fields});
    }

    validateForm() {
        let fields = this.state.fields;
        let errors = this.state.errors;
        let isValid = true;
        const {t} = this.props;

        if(!fields['name']) {
            isValid = false;
            errors['name'] = t('misc.phrases.field') + ' \'' + t('content.company.fields.name') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['name'] !== undefined) {
            if(!fields['name'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/;
                isValid = false;
                errors['name'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['description']) {
            isValid = false;
            errors['description'] = t('misc.phrases.field') + ' \'' + t('content.company.fields.description') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['description'] !== undefined) {
            if(!fields['description'].match(/^.{1,500}$/)) {
                let regex = /^.{1,500}$/;
                isValid = false;
                errors['description'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['email']) {
            isValid = false;
            errors['email'] = t('misc.phrases.field') + ' \'' + t('content.company.fields.email') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['email'] !== undefined) {
            if(!fields['email'].match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) && !fields['email'].match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
                let regex1 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                let regex2 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                isValid = false;
                errors['email'] = t('commonErrors.formValidation.emailNotValid') + '\n\n' + regex1 + ', ' + regex2;
            }
        }

        if(!fields['phone']) {
            isValid = false;
            errors['phone'] = t('misc.phrases.field') + ' \'' + t('content.company.fields.phone') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['phone'] !== undefined) {
            if(!fields['phone'].match(/^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3}?[-. ]?([0-9]{3}))$/) && !fields['phone'].match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/) && !fields['phone'].match(/^([0-9]{9})$/)) {
                let regex1 = 'yy xxx xxx xxx';
                let regex2 = 'xxx xxx xxx';
                let regex3 = 'xxxxxxxxx';
                isValid = false;
                errors['phone'] = t('commonErrors.formValidation.incorrectPhoneNumberFormat') + '\n\n' + regex1 + ', ' + regex2 + ' ' + t('misc.phrases.or') + ' ' + regex3;
            }
        }

        if(!fields['website']) {
            isValid = false;
            errors['website'] = t('misc.phrases.field') + '\'' + t('content.company.fields.website') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['website'] !== undefined) {
            if(!fields['website'].match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)?/gi)) {
                //let regex = /^\((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?$/;
                isValid = false;
                errors['website'] = t('commonErrors.formValidation.InvalidUrlFormat');
            }
        }

        if(fields['avatar_url'] !== undefined && fields['avatar_url'] !== '') {
            if(!fields['avatar_url'].match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)?/gi)) {
                isValid = false;
                errors['avatar_url'] = t('commonErrors.formValidation.InvalidUrlFormat');
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
                axios.post('http://localhost:3300/company/create', {
                    userId: this.state.auth.userId,
                    companyObj: this.state.fields
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.company !== null) {
                        this.setState({
                            company: response.data.company
                        })
                    }      
                })
                .catch((error) => {
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
                    <p className="card-title">{t('content.company.actions.createCompany.actionTitle')}</p><hr className="card-hr" />
                    <form className="card-form" onSubmit={this.onFormSubmit}>
                        <label htmlFor="name">{t('content.company.fields.name')}</label>
                        <input onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" name="name" />
                        <span className="error-msg-span">{this.state.errors["name"]}</span>
                        <label htmlFor="description">{t('content.company.fields.description')}</label>
                        <textarea onChange={this.onChange.bind(this, 'description')} value={this.state.fields['description']} type="description" id="description" name="description" rows="10" cols="40" />
                        <span className="error-msg-span">{this.state.errors["description"]}</span>
                        <label htmlFor="email">{t('content.company.fields.email')}</label>
                        <input onChange={this.onChange.bind(this, 'email')} value={this.state.fields['email']} type="email" className="" name="email" />
                        <span className="error-msg-span">{this.state.errors["email"]}</span>
                        <label htmlFor="phone">{t('content.company.fields.phone')}</label>
                        <input onChange={this.onChange.bind(this, 'phone')} value={this.state.fields['phone']} type="phone" className="" name="phone" />
                        <span className="error-msg-span">{this.state.errors["phone"]}</span>
                        <label htmlFor="phone">{t('content.company.fields.website')}</label>
                        <input onChange={this.onChange.bind(this, 'website')} value={this.state.fields['website']} type="website" className="" name="website" />
                        <span className="error-msg-span">{this.state.errors["website"]}</span>
                        <label htmlFor="phone">{t('content.company.fields.avatarUrl')}</label>
                        <input onChange={this.onChange.bind(this, 'avatar_url')} value={this.state.fields['avatar_url']} type="avatar_url" className="" name="avatar_url" />
                        <span className="error-msg-span">{this.state.errors["avatar_url"]}</span>
                        <div class="card-form-divider">
                            <button type="submit" className="card-form-button">{t('misc.actionDescription.create')}</button>
                            <button type="reset" className="card-form-button" onClick={this.resetForm}>{t('misc.actionDescription.reset')}</button>
                            <button type="button" className="card-form-button"><Link to="/dashboard" className="card-form-button-link">{t('misc.actionDescription.cancel')}</Link></button>
                        </div>
                        {this.state.serverResponse !== null ? (
                            <span className="error-msg-span" style={{display: "block"}} id="serverResponse">{this.state.serverResponse}</span>
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

const CreateCompanyTranslation = withTranslation('common')(CreateCompany);

export default CreateCompanyTranslation;