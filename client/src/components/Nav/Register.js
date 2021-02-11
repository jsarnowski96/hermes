import React from 'react';
import {Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import Login from '../Nav/Login';

import '../../assets/css/register.css';
import '../../assets/css/style.css';
import '../../assets/css/errors.css';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            errors: {}
        };

        this.resetForm = this.resetForm.bind(this);
    }

    resetForm() {
        let fields = this.state.fields;
        let errors = this.state.errors;

        fields['firstname'] = '';
        fields['lastname'] = '';
        fields['username'] = '';
        fields['email'] = '';
        fields['phone'] = '';
        fields['position'] = '';
        fields['company'] = '';
        fields['password'] = '';
        fields['confirm'] = '';

        errors['firstname'] = '';
        errors['lastname'] = '';
        errors['username'] = '';
        errors['email'] = '';
        errors['phone'] = '';
        errors['position'] = '';
        errors['company'] = '';
        errors['password'] = '';
        errors['confirm'] = '';

        document.getElementById('serverErrorMsg').innerHTML = '';

        this.setState({fields, errors});
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

        if(!fields['firstname']) {
            isValid = false;
            errors['firstname'] = t('misc.phrases.field') + ' \'' + t('register.firstname') + '\'' + t('register.errors.requiredFieldIsEmpty');
        } else if(typeof fields['firstname'] !== 'undefined') {
            if(!fields['firstname'].match(/^[a-zA-Z_ ]+$/)) {
                isValid = false;
                errors['firstname'] = t('register.errors.allowedCharsOnly');
            }
        }

        if(!fields['lastname']) {
            isValid = false;
            errors['lastname'] = t('misc.phrases.field') + ' \'' + t('register.lastname') + '\'' + t('register.errors.requiredFieldIsEmpty');
        } else if(typeof fields['lastname'] !== 'undefined') {
            if(!fields['lastname'].match(/^[a-zA-Z_ ]+$/)) {
                isValid = false;
                errors['lastname'] = t('register.errors.allowedCharsOnly');
            }
        }

        if(!fields['username']) {
            isValid = false;
            errors['username'] = t('misc.phrases.field') + ' \'' + t('register.username') + '\'' + t('register.errors.requiredFieldIsEmpty');
        } else if(typeof fields['username'] !== 'undefined') {
            if(!fields['username'].match(/^[a-zA-Z0-9\-_.]+$/)) {
                isValid = false;
                errors['username'] = t('register.errors.allowedCharsOnly');
            }
        }

        if(!fields['email']) {
            isValid = false;
            errors['email'] = t('misc.phrases.field') + ' \'' + t('register.email') + '\'' + t('register.errors.requiredFieldIsEmpty');
        } else if(typeof fields['email'] != 'undefined') {
            if(!fields['email'].match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
                ///^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                isValid = false;
                errors['email'] = t('register.errors.emailNotValid');
            }
        }

        if(!fields['phone']) {
            isValid = false;
            errors['phone'] = t('misc.phrases.field') + ' \'' + t('register.phone') + '\'' + t('register.errors.requiredFieldIsEmpty');
        } else if(typeof fields['phone'] != 'undefined') {
            if(!fields['phone'].match(/^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3}?[-. ]?([0-9]{3}))$/) && !fields['phone'].match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/) && !fields['phone'].match(/^([0-9]{9})$/)) {
                isValid = false;
                errors['phone'] = t('register.errors.incorrectPhoneFormat');
            }
        }

        if(!fields['position']) {
            isValid = false;
            errors['position'] = t('misc.phrases.field') + ' \'' + t('register.position') + '\'' +  t('register.errors.requiredFieldIsEmpty');
        } else if(typeof fields['position'] !== 'undefined') {
            if(!fields['position'].match(/^[a-zA-Z_ ]+$/)) {
                isValid = false;
                errors['position'] = t('register.errors.allowedCharsOnly');
            }
        }

        if(!fields['company']) {
            isValid = false;
            errors['company'] = t('misc.phrases.field') + ' \'' + t('register.company') + '\'' + t('register.errors.requiredFieldIsEmpty');
        } else if(typeof fields['company'] !== 'undefined') {
            if(!fields['company'].match(/^[a-zA-Z0-9\-. ]+$/)) {
                isValid = false;
                errors['company'] = t('register.errors.allowedCharsOnly');
            }
        }

        if(!fields['password']) {
            isValid = false;
            errors['password'] = t('misc.phrases.field') + ' \'' + t('register.password') + '\'' + t('register.errors.requiredFieldIsEmpty');
        } else if(typeof fields['password'] !== 'undefined') {
            if(fields['password'].length < 6) {
                isValid = false;
                errors['password'] = t('register.errors.passwordTooShort');
            }
            if(fields['password'] !== fields['confirm']) {
                isValid = false;
                errors['password'] = t('register.errors.passwordsDoNotMatch');
            }
        }

        if(!fields['confirm']) {
            isValid = false;
            errors['confirm'] = t('register.errors.confirmPasswordIsEmpty');
        } else if(typeof fields['confirm'] !== 'undefined') {
            if(fields['confirm'] !== fields['password']) {
                isValid = false;
                errors['confirm'] = t('register.errors.passwordsDoNotMatch');
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
            axios.post('http://localhost:3300/auth/register', {
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
                let err = document.getElementById('serverErrorMsg');
                if(err) {
                    if(error.response.data.type === 'AccountDuplication') {
                        err.innerHTML = t('register.errors.serverResponses.userAlreadyExists');
                        err.style.display = 'block';
                    } else {
                        err.innerHTML = error.response;
                    }
                }
            });
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
                <p className="card-title">{t('register.title')}</p><hr className="card-hr" />
                <form className="card-form" onSubmit={this.onFormSubmit}>
                    <label htmlFor="firstname">{t('register.firstname')}</label>
                    <input onChange={this.onChange.bind(this, 'firstname')} value={this.state.fields['firstname']} type="firstname" className="" name="firstname" />
                    <span className="error-msg-span">{this.state.errors["firstname"]}</span>
                    <label htmlFor="lastname">{t('register.lastname')}</label>
                    <input onChange={this.onChange.bind(this, 'lastname')} value={this.state.fields['lastname']} type="lastname" className="" name="lastname" />
                    <span className="error-msg-span">{this.state.errors["lastname"]}</span>
                    <label htmlFor="username">{t('register.username')}</label>
                    <input onChange={this.onChange.bind(this, 'username')} value={this.state.fields['username']} type="username" className="" name="username" />
                    <span className="error-msg-span">{this.state.errors["username"]}</span>
                    <label htmlFor="email">{t('register.email')}</label>
                    <input onChange={this.onChange.bind(this, 'email')} value={this.state.fields['email']} type="email" className="" name="email" />
                    <span className="error-msg-span">{this.state.errors["email"]}</span>
                    <label htmlFor="phone">{t('register.phone')}</label>
                    <input onChange={this.onChange.bind(this, 'phone')} value={this.state.fields['phone']} type="phone" className="" name="phone" />
                    <span className="error-msg-span">{this.state.errors["phone"]}</span>
                    <label htmlFor="position">{t('register.position')}</label>
                    <input onChange={this.onChange.bind(this, 'position')} value={this.state.fields['position']} type="position" className="" name="position" />
                    <span className="error-msg-span">{this.state.errors["position"]}</span>
                    <label htmlFor="company">{t('register.company')}</label>
                    <input onChange={this.onChange.bind(this, 'company')} value={this.state.fields['company']} type="company" className="" name="company" />
                    <span className="error-msg-span">{this.state.errors["company"]}</span>
                    <label htmlFor="password">{t('register.password')}</label>
                    <input type="password" onChange={this.onChange.bind(this, 'password')} value={this.state.fields['password']} className="" id="password" />
                    <span className="error-msg-span">{this.state.errors["password"]}</span>
                    <label htmlFor="confirm">{t('register.confirm')}</label>
                    <input type="password" onChange={this.onChange.bind(this, 'confirm')} value={this.state.fields['confirm']} className="" id="confirm" />
                    <span className="error-msg-span">{this.state.errors["confirm"]}</span>
                    <div class="card-form-divider">
                        <button type="submit" className="card-form-button">{t('register.submit')}</button>
                        <button type="reset" onClick={this.resetForm} className="card-form-button" >{t('register.reset')}</button>
                        <button type="button" className="card-form-button"><Link to="/" className="card-form-button-link">{t('register.cancel')}</Link></button>
                    </div>
                    <span className="error-msg-span" id="serverErrorMsg"></span>
                </form>
                <p className="card-form-reminder">{t('register.loginTip')} <Link to="/login">{t('register.loginLink')}</Link></p>
            </div>
        )
    }    
}

const RegisterTranslation = withTranslation('common')(Register);

export default RegisterTranslation;

// TODO: FIX FORM VALIDATION MESSAGES DISPLAY !!!