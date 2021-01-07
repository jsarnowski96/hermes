import React from 'react';
import {Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router';
import axios from 'axios';

import Dashboard from '../Dashboard/Dashboard'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: {
                refreshToken: '',
                accessToken: '',
                userId: ''
            },
            fields: {},
            errors: {}
        };
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

        if(!fields['login']) {
            isValid = false;
            errors['login'] = t('misc.phrases.field') + ' \'' + t('register.login') + '\'' + t('register.errors.requiredFieldIsEmpty');
        }

        if(typeof fields['login'] != 'undefined') {
            if(!fields['login'].match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) && !fields['login'].match(/^[a-zA-Z0-9\-_.]+$/)) {
                isValid = false;
                errors['login'] = t('register.errors.loginNotValid');
            }
        }

        if(!fields['password']) {
            isValid = false;
            errors['password'] = t('misc.phrases.field') + ' \'' + t('register.password') + '\'' + t('register.errors.requiredFieldIsEmpty');
        }

        this.setState({errors: errors});

        return isValid;
    }

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const fields = this.state.fields;
        const {t} = this.props;

        //const reqPayload = Buffer.from(`${fields['login']}:${fields['password']}`, 'utf8').toString('base64');

        if(this.validateForm()) {
            axios.post('http://localhost:3300/auth/login', 
                {
                    login: fields['login'],
                    password: fields['password'],
                }, 
                {
                    auth: 
                    {
                        username: fields['login'],
                        password: fields['password']
                    }
            }).then((response) => {
                if(response.data.user !== 'undefined' && response.data.token !== 'undefined') {
                    this.setState({
                        auth: {
                            ...this.state.auth,
                            userId: response.data.user._id,
                            refreshToken: response.data.refreshToken
                        }
                    })
                };
            })
            .catch(function(error) {
                let err = document.getElementById('serverErrorMsg');
                if(err) {
                    if(error.response.data.type === 'AccountDuplication') {
                        err.innerHTML = t('register.errors.serverResponses.userAlreadyExists');
                        err.style.display = 'block';
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

        if(this.state.auth.userId !== '' && this.state.auth.refreshToken !== '') {
            return(
                <Dashboard userId={this.state.auth.userId} refreshToken={this.state.auth.refreshToken} />
            )
        }

        return(
            <div className="card">
                <p className="card-title">{t('login.title')}</p><hr className="card-hr" />
                <form className="card-form" onSubmit={this.onFormSubmit}>
                    <label htmlFor="login">{t('login.login')}</label>
                    <input onChange={this.onChange.bind(this, 'login')} value={this.state.fields['login']} type="login" className="" id="login" />
                    <span id="errorSpan" className="error-msg-span">{this.state.errors["login"]}</span>
                    <label htmlFor="password">{t('login.password')}</label>
                    <input onChange={this.onChange.bind(this, 'password')} value={this.state.fields['password']} type="password" className="" id="password" />
                    <span id="errorSpan" className="error-msg-span">{this.state.errors["password"]}</span>
                    <div class="card-form-divider">
                        <button type="submit" className="card-form-button">{t('login.submit')}</button>
                        <button type="button" className="card-form-button"><Link to="/" className="card-form-button-link">{t('login.cancel')}</Link></button>
                    </div>
                    <span className="error-msg-span" id="serverErrorMsg"></span>
                </form>
                <p className="card-form-reminder">{t('login.registerTip')} <Link to="/register">{t('login.registerLink')}</Link></p>
            </div>
        )
    }    
}

const LoginTranslation = withTranslation('common')(Login);

export default LoginTranslation;