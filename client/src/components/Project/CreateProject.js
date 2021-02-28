import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import axios from 'axios';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/style.css';
import '../../assets/css/errors.css';

class CreateProject extends React.Component {
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
                statuses: [ 'To do', 'In progress', 'In review', 'Postponed', 'Done'],
                teams: [],
                fields: {},
                errors: {},
                serverResponse: null
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
                categories: [],
                statuses: [ 'To do', 'In progress', 'In review', 'Postponed', 'Done'],
                teams: [],
                fields: {},
                errors: {},
                serverResponse: null
            }
        }

        this.resetForm = this.resetForm.bind(this);        
        this.getCategories = this.getCategories.bind(this);
        this.getTeams = this.getTeams.bind(this);
    }

    componentDidMount() {
        this.getCategories();
        this.getTeams();
    }

    componentWillUnmount() {
        axios.Cancel('Axios request canceled.');
    }

    resetForm() {
        document.getElementById('serverResponse').innerHTML = '';
        document.getElementById('requirements').defaultValue = '';
        this.setState({fields: {}, errors: {}});
    }

    validateForm() {
        let fields = this.state.fields;
        let errors = this.state.errors;
        let isValid = true;
        const {t} = this.props;

        if(!fields['name']) {
            isValid = false;
            errors['name'] = t('misc.phrases.field') + ' \'' + t('content.project.fieldNames.name') + '\' ' + t('content.project.actions.createProject.errorMessages.formValidation.requiredFieldIsEmpty');
        } else if(typeof fields['name'] !== undefined) {
            if(!fields['name'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/;
                isValid = false;
                errors['name'] = t('content.project.actions.createProject.errorMessages.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['requirements']) {
            isValid = false;
            errors['requirements'] = t('misc.phrases.field') + ' \'' + t('content.project.fieldNames.requirements') + '\' ' + t('content.project.actions.createProject.errorMessages.formValidation.requiredFieldIsEmpty');
        } else if(typeof fields['requirements'] !== undefined) {
            if(!fields['requirements'].match(/^.{1,500}$/)) {
                let regex = /^.{1,500}$/;
                isValid = false;
                errors['requirements'] = t('content.project.actions.createProject.errorMessages.formValidation.allowedCharsOnly') + regex;
            }
        }

        this.setState({errors: errors});

        return isValid;
    }

    async getCategories() {
        await axios.post('http://localhost:3300/category/list', { category_type: 'project'}, {headers: this.headers, withCredentials: true, })
            .then((response) => {
                if(response.data.categories.length > 0 && response.data.categories !== null) {
                    this.setState({categories: response.data.categories});
                } else {
                    this.setState({categories: null});
                }     
            })
            .catch((error) => {
                //console.log(JSON.parse(JSON.stringify(error)));
                if (error instanceof Error && (error.response.status === 404 || error.response.status === 406 || error.response.statu === 500)) {
                    this.setState({
                        serverResponse: error.response.data
                    });
                }
                throw error;
            });
    }

    async getTeams() {
        await axios.get('http://localhost:3300/team/list', {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response.data.teams.length > 0 && response.data.teams !== null) {
                    this.setState({teams: response.data.teams});
                } else {
                    this.setState({teams: null});
                }
            })
            .catch((error) => {
                //console.log(JSON.parse(JSON.stringify(error)));
                if (error instanceof Error && (error.response.status === 404 || error.response.status === 406 || error.response.statu === 500)) {
                    this.setState({
                        serverResponse: error.response.data
                    });
                }
                throw error;
            });
    }

    onChange(field, event) {
        let fields = this.state.fields;
        let errors = this.state.errors;
        if(field === 'restricted_access') {
            fields[field] = event.target.checked;
        } else {
            fields[field] = event.target.value;       
        }
        errors[field] = '';
        this.setState({fields, errors});
    }

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const {t} = this.props;
        const fields = this.state.fields;

        if(this.validateForm()) {
            try {
                axios.post('http://localhost:3300/project/create', {
                    name: fields['name'],
                    category: fields['category'],
                    requirements: fields['requirements'],
                    restricted_access: fields['restricted_access'],
                    userId: this.state.auth.userId,
                    dueDate: fields['dueDate']
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    let res = document.getElementById('serverResponse');
                    if(response.data.message === 'ProjectCreateSuccess') {
                        res.innerHTML = t('content.project.actions.createProject.actionResults.success');
                        res.style.color = 'green';
                    } else if(response.data.message === 'ProjectCreateFailure') {
                        res.innerHTML = t('content.project.actions.createProject.actionResults.failure');
                    } else {
                        res.innerHTML = response.data.message;
                    }
                    res.style.display = 'block';   
                })
                .catch(error => {
                    if (error instanceof Error && (error.response.status === 404 || error.response.status === 406 || error.response.statu === 500)) {
                        this.setState({
                            serverResponse: error.response.data
                        });
                    }
                    throw error;
                }) 
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

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return(
                <div className="card">
                    <p className="card-title">{t('content.project.actions.createProject.actionTitle')}</p><hr className="card-hr" />
                    <form className="card-form" onSubmit={this.onFormSubmit}>
                        <label htmlFor="name">{t('content.project.fieldNames.name')}</label>
                        <input onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" name="name" />
                        <span className="error-msg-span">{this.state.errors["name"]}</span>
                        <label htmlFor="category">{t('content.project.fieldNames.category')}</label>
                        <select onChange={this.onChange.bind(this, 'category')} value={this.state.fields['category']} type="category" className="" name="category">
                            {this.state.categories.map((category, index) => {
                                if(index === 0) {
                                    return <option value={category} default>{category}</option>
                                } else {
                                    return <option value={category}>{category}</option>
                                }
                            })}
                        </select>
                        <span className="error-msg-span">{this.state.errors["category"]}</span>
                        <label htmlFor="requirements">{t('content.project.fieldNames.requirements')}</label>
                        <textarea onChange={this.onChange.bind(this, 'requirements')} value={this.state.fields['requirements']} type="requirements" id="requirements" name="requirements" />
                        <span className="error-msg-span">{this.state.errors["requirements"]}</span>
                        <label htmlFor="category">{t('content.project.fieldNames.assignedTeam')}</label>
                        <select onChange={this.onChange.bind(this, 'team')} value={this.state.fields['team']} type="team" className="" name="team">
                            {this.state.teams.map((team, index) => {
                                if(index === 0) {
                                    return <option value={team} default>{team}</option>
                                } else {
                                    return <option value={team}>{team}</option>
                                }
                            })}
                        </select>
                        <label htmlFor="category">{t('content.project.fieldNames.status')}</label>
                        <select onChange={this.onChange.bind(this, 'status')} value={this.state.fields['status']} type="status" className="" name="status">
                            {this.state.statuses.map((status, index) => {
                                if(index === 0) {
                                    return <option value={status} default>{status}</option>
                                } else {
                                    return <option value={status}>{status}</option>
                                }
                            })}
                        </select>
                        <span className="error-msg-span">{this.state.errors["category"]}</span>
                        <label htmlFor="dueDate">{t('content.project.fieldNames.dueDate')}</label>
                        <input onChange={this.onChange.bind(this, 'dueDate')} value={this.state.fields['dueDate']} type="date" className="" name="dueDate"
                            min="2021-02-01" max="2022-12-31" />
                        <span className="error-msg-span">{this.state.errors["dueDate"]}</span>
                        <label htmlFor="restricted_access">{t('content.project.fieldNames.restrictedAccess')}</label>
                        <input onChange={this.onChange.bind(this, 'restricted_access')} value={this.state.fields['restricted_access']} type="checkbox" className="" name="restricted_access" />
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

const CreateProjectTranslation = withTranslation('common')(CreateProject);

export default CreateProjectTranslation;