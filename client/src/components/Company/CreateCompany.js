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

        var jwt = getJwtDataFromSessionStorage();

        if(jwt != null) {
            this.state = {
                auth: {
                    userId: jwt.userId,
                    refreshToken: jwt.refreshToken
                },
                fields: {},
                errors: {}
            }
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
        this.setState({fields: {}, errors: {}});
    }

    onChange(field, event) {
        let fields = this.state.fields;
        let errors = this.state.errors;
        fields[field] = event.target.value;       
        errors[field] = '';
        this.setState({fields});
    }

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const {t} = this.props;
        const fields = this.state.fields;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.auth.refreshToken}`
        };

        axios.post('http://localhost:3300/company/create', {
            name: fields['name'],
            description: fields['description'],
            email: fields['email'],
            phone: fields['phone'],
            owner: this.state.auth.userId,
            website: fields['website'],
            avatar_url: fields['avatar_url']
        },
        {
            withCredentials: true,
            headers: headers
        })
        .then((response) => {
            let res = document.getElementById('serverResponse');
            if(response.data.message === 'CompanyCreateSuccess') {
                res.innerHTML = t('content.companies.createCompany.actionResults.success');
                res.style.color = 'green';
            } else if(response.data.message === 'CompanyCreateFailure') {
                res.innerHTML = t('content.Companys.createCompany.actionResults.failure');
            } else {
                res.innerHTML = response.data.message;
            }
            res.style.display = 'block';            
        })
        .catch(error => {
            let sr = document.getElementById('serverResponse');
            if(error) {
                if(error.response.data.message === 'JwtTokenExpired') {
                    removeJwtDataFromSessionStorage();
                } else {
                    sr.innerHTML = error;
                    sr.style.display = 'block';
                }
            }
        }) 
    }

    render() {
        const {t} = this.props;

        if(this.state.auth.userId !== '' && this.state.auth.userId !== undefined && this.state.auth.userId !== null && this.state.auth.refreshToken !== '' && this.state.auth.refreshToken !== undefined && this.state.auth.refreshToken !== null) {
            return(
                <div className="card">
                    <p className="card-title">Create new Company</p><hr className="card-hr" />
                    <form className="card-form" onSubmit={this.onFormSubmit}>
                        <label htmlFor="name">Company name</label>
                        <input onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" name="name" />
                        <span className="error-msg-span">{this.state.errors["name"]}</span>
                        <label htmlFor="description">Description</label>
                        <textarea onChange={this.onChange.bind(this, 'description')} value={this.state.fields['description']} type="description" className="" name="description" />
                        <span className="error-msg-span">{this.state.errors["description"]}</span>
                        <input onChange={this.onChange.bind(this, 'email')} value={this.state.fields['email']} type="email" className="" name="email" />
                        <span className="error-msg-span">{this.state.errors["email"]}</span>
                        <label htmlFor="phone">{t('content.register.phone')}</label>
                        <input onChange={this.onChange.bind(this, 'phone')} value={this.state.fields['phone']} type="phone" className="" name="phone" />
                        <span className="error-msg-span">{this.state.errors["phone"]}</span>
                        <input onChange={this.onChange.bind(this, 'website')} value={this.state.fields['website']} type="website" className="" name="website" />
                        <span className="error-msg-span">{this.state.errors["website"]}</span>
                        <input onChange={this.onChange.bind(this, 'avatar_url')} value={this.state.fields['avatar_url']} type="avatar_url" className="" name="avatar_url" />
                        <span className="error-msg-span">{this.state.errors["avatar_url"]}</span>
                        <div class="card-form-divider">
                            <button type="submit" className="card-form-button">Create</button>
                            <button type="reset" className="card-form-button" >Reset</button>
                            <button type="button" className="card-form-button"><Link to="/dashboard" className="card-form-button-link">Cancel</Link></button>
                        </div>
                        <span className="error-msg-span" id="serverResponse"></span>
                    </form>
                </div>
            )
        } else {
            return(
                <Redirect to=
                    {{
                        pathname: '/login',
                        state: {
                            unauthorized: true,
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