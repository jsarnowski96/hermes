import React from 'react';
import {Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import '../../assets/css/register.css';
import '../../assets/css/style.css';
import '../../assets/css/errors.css';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class Register extends React.Component {
    constructor(props) {
        super(props);
        
        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                authenticated: true,
                fields: {},
                errors: {}
            };
        } else {
            this.state = {
                authenticated: false,
                fields: {},
                errors: {}
            };
        }

        this.resetForm = this.resetForm.bind(this);
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

        if(!fields['firstname']) {
            isValid = false;
            errors['firstname'] = t('misc.phrases.field') + ' \'' + t('content.register.firstname') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['firstname'] !== undefined) {
            if(!fields['firstname'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,20}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,20}$/;
                isValid = false;
                errors['firstname'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['lastname']) {
            isValid = false;
            errors['lastname'] = t('misc.phrases.field') + ' \'' + t('content.register.lastname') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['lastname'] !== undefined) {
            if(!fields['lastname'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,20}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,20}$/;
                isValid = false;
                errors['lastname'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['username']) {
            isValid = false;
            errors['username'] = t('misc.phrases.field') + ' \'' + t('content.register.username') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['username'] !== undefined) {
            if(!fields['username'].match(/^[a-zA-Z0-9\-_.]+$/)) {
                let regex = /^[a-zA-Z0-9\-_.]+$/;
                isValid = false;
                errors['username'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['email']) {
            isValid = false;
            errors['email'] = t('misc.phrases.field') + ' \'' + t('content.register.email') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['email'] != undefined) {
            if(!fields['email'].match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) && !fields['email'].match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                isValid = false;
                errors['email'] = t('commonErrors.formValidation.emailNotValid');
            }
        }

        if(!fields['phone']) {
            isValid = false;
            errors['phone'] = t('misc.phrases.field') + ' \'' + t('content.register.phone') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['phone'] != undefined) {
            if(!fields['phone'].match(/^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3}?[-. ]?([0-9]{3}))$/) && !fields['phone'].match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/) && !fields['phone'].match(/^([0-9]{9})$/)) {
                let regex1 = 'yy xxx xxx xxx';
                let regex2 = 'xxx xxx xxx';
                let regex3 = 'xxxxxxxxx';
                isValid = false;
                errors['phone'] = t('commonErrors.formValidation.incorrectPhoneNumberFormat') + '\n\n' + regex1 + ', ' + regex2 + ' ' + t('misc.phrases.or') + ' ' + regex3;
            }
        }

        if(!fields['position']) {
            isValid = false;
            errors['position'] = t('misc.phrases.field') + ' \'' + t('content.register.position') + '\' ' +  t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['position'] !== undefined) {
            if(!fields['position'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,30}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,30}$/;
                isValid = false;
                errors['position'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(fields['company'] !== undefined && fields['company'] !== '') {
            if(!fields['company'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/;
                isValid = false;
                errors['company'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        // if(!fields['company']) {
        //     isValid = false;
        //     errors['company'] = t('misc.phrases.field') + ' \'' + t('content.register.company') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        // }

        if(!fields['password']) {
            isValid = false;
            errors['password'] = t('misc.phrases.field') + ' \'' + t('content.register.password') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['password'] !== undefined) {
            if(fields['password'].length < 6) {
                isValid = false;
                errors['password'] = t('commonErrors.formValidation.passwordTooShort');
            }
            if(fields['password'] !== fields['confirm']) {
                isValid = false;
                errors['password'] = t('commonErrors.formValidation.passwordsDoNotMatch');
            }
        }

        if(!fields['confirm']) {
            isValid = false;
            errors['confirm'] = t('commonErrors.formValidation.confirmPasswordIsEmpty');
        } else if(fields['confirm'] !== undefined) {
            if(fields['confirm'] !== fields['password']) {
                isValid = false;
                errors['confirm'] = t('commonErrors.formValidation.passwordsDoNotMatch');
            }
        }

        this.setState({errors: errors});

        return isValid;
    }

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const fields = this.state.fields;
        const {t} = this.props;

        if(this.validateForm()) {
            try {
                axios.post('http://localhost:3300/register', {
                    firstname: fields['firstname'],
                    lastname: fields['lastname'],
                    username: fields['username'],
                    email: fields['email'],
                    phone: fields['phone'],
                    position: fields['position'],
                    company: fields['company'],
                    password: fields['password']
                }).then((response) => {
                    console.log(response);
                })
                .catch(error => {
                    let err = document.getElementById('serverResponse');
                    if(error) {
                        if(error.response.data.type === 'AccountDuplication') {
                            err.innerHTML = t('content.register.errorMessages.dataValidation.userAlreadyExists');
                            err.style.display = 'block';
                        } else {
                            err.innerHTML = error.response;
                        }
                    }
                });
            } catch(e) {
                console.log(e);
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

        return(
            <div className="card">
                <p className="card-title">{t('content.register.title')}</p><hr className="card-hr" />
                <form className="card-form" onSubmit={this.onFormSubmit}>
                    <label htmlFor="firstname">{t('content.register.firstname')}</label>
                    <input onChange={this.onChange.bind(this, 'firstname')} value={this.state.fields['firstname']} type="firstname" className="" name="firstname" />
                    <span className="error-msg-span">{this.state.errors["firstname"]}</span>
                    <label htmlFor="lastname">{t('content.register.lastname')}</label>
                    <input onChange={this.onChange.bind(this, 'lastname')} value={this.state.fields['lastname']} type="lastname" className="" name="lastname" />
                    <span className="error-msg-span">{this.state.errors["lastname"]}</span>
                    <label htmlFor="username">{t('content.register.username')}</label>
                    <input onChange={this.onChange.bind(this, 'username')} value={this.state.fields['username']} type="username" className="" name="username" />
                    <span className="error-msg-span">{this.state.errors["username"]}</span>
                    <label htmlFor="email">{t('content.register.email')}</label>
                    <input onChange={this.onChange.bind(this, 'email')} value={this.state.fields['email']} type="email" className="" name="email" />
                    <span className="error-msg-span">{this.state.errors["email"]}</span>
                    <label htmlFor="phone">{t('content.register.phone')}</label>
                    <input onChange={this.onChange.bind(this, 'phone')} value={this.state.fields['phone']} type="phone" className="" name="phone" />
                    <span className="error-msg-span">{this.state.errors["phone"]}</span>
                    <label htmlFor="position">{t('content.register.position')}</label>
                    <input onChange={this.onChange.bind(this, 'position')} value={this.state.fields['position']} type="position" className="" name="position" />
                    <span className="error-msg-span">{this.state.errors["position"]}</span>
                    <label htmlFor="company">{t('content.register.company')}</label>
                    <input onChange={this.onChange.bind(this, 'company')} value={this.state.fields['company']} type="company" className="" name="company" />
                    <span className="error-msg-span">{this.state.errors["company"]}</span>
                    <label htmlFor="password">{t('content.register.password')}</label>
                    <input type="password" onChange={this.onChange.bind(this, 'password')} value={this.state.fields['password']} className="" id="password" />
                    <span className="error-msg-span">{this.state.errors["password"]}</span>
                    <label htmlFor="confirm">{t('content.register.confirm')}</label>
                    <input type="password" onChange={this.onChange.bind(this, 'confirm')} value={this.state.fields['confirm']} className="" id="confirm" />
                    <span className="error-msg-span">{this.state.errors["confirm"]}</span>
                    <div class="card-form-divider">
                        <button type="submit" className="card-form-button">{t('misc.actionDescription.register')}</button>
                        <button type="reset" onClick={this.resetForm} className="card-form-button" >{t('misc.actionDescription.reset')}</button>
                        <button type="button" className="card-form-button"><Link to="/" className="card-form-button-link">{t('misc.actionDescription.cancel')}</Link></button>
                    </div>
                    {this.state.authenticated ? (
                        <span className="error-msg-span" id="serverResponse">Already authenticated</span>
                    ) : (
                        <span className="error-msg-span" id="serverResponse"></span>
                    )}
                </form>
                <p className="card-form-reminder">{t('content.register.loginTip')} <Link to="/login">{t('content.register.loginLink')}</Link></p>
            </div>
        )
    }    
}

const RegisterTranslation = withTranslation('common')(Register);

export default RegisterTranslation;

// TODO: FIX FORM VALIDATION MESSAGES DISPLAY !!!