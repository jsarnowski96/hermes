import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import axios from 'axios';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/register.css';
import '../../assets/css/style.css';
import '../../assets/css/errors.css';

class CreateTask extends React.Component {
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
        this.setState({fields: {}, errors: {}});
    }

    onChange(field, event) {
        let fields = this.state.fields;
        let errors = this.state.errors;
        fields[field] = event.target.value;       
        errors[field] = '';
        this.setState({fields, errors});
    }

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const {t} = this.props;
        const fields = this.state.fields;

        try {
            axios.post('http://localhost:3300/project/create', {
                name: fields['name'],
                category: fields['category'],
                requirements: fields['requirements'],
                userId: this.state.auth.userId,
                dueDate: fields['dueDate']
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                let res = document.getElementById('serverResponse');
                if(response.data.message === 'ProjectCreateSuccess') {
                    res.innerHTML = t('content.project.createProject.actionResults.success');
                    res.style.color = 'green';
                } else if(response.data.message === 'ProjectCreateFailure') {
                    res.innerHTML = t('content.project.createProject.actionResults.failure');
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
        } catch(e) {
            console.log(e);
        }
    }

    render() {
        const {t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return(
                <div className="card">
                    <p className="card-title">Create new project</p><hr className="card-hr" />
                    <form className="card-form" onSubmit={this.onFormSubmit}>
                        <label htmlFor="name">Project name</label>
                        <input onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" name="name" />
                        <span className="error-msg-span">{this.state.errors["name"]}</span>
                        <label htmlFor="category">Category</label>
                        <select onChange={this.onChange.bind(this, 'category')} value={this.state.fields['category']} type="category" className="" name="category">
                            <option value="Software Development" default>Software Development</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Databases">Databases</option>
                            <option value="R&D">R&D</option>
                        </select>
                        <span className="error-msg-span">{this.state.errors["category"]}</span>
                        <label htmlFor="requirements">Requirements</label>
                        <textarea onChange={this.onChange.bind(this, 'requirements')} value={this.state.fields['requirements']} type="requirements" className="" name="requirements" />
                        <span className="error-msg-span">{this.state.errors["requirements"]}</span>
                        <label htmlFor="dueDate">Due date</label>
                        <input onChange={this.onChange.bind(this, 'dueDate')} value={this.state.fields['dueDate']} type="date" className="" name="dueDate"
                            min="2021-02-01" max="2022-12-31" />
                        <span className="error-msg-span">{this.state.errors["dueDate"]}</span>
                        <div class="card-form-divider">
                            <button type="submit" className="card-form-button">Create</button>
                            <button type="reset" className="card-form-button" onClick={this.resetForm}>Reset</button>
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
                            authenticated: false,
                            redirected: true
                        }
                    }}
                />
            ) 
        }
    }
}

const CreateTaskTranslation = withTranslation('common')(CreateTask);

export default CreateTaskTranslation;