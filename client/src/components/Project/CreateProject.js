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
                teams: [],
                statuses: [ 'To do', 'In progress', 'In review', 'Postponed', 'Done'],
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
        this.getTeams();
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
        
        if(field === 'restricted_access') {
            fields[field] = event.target.checked;
        } else {
            fields[field] = event.target.value;       
        }

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
            errors['name'] = t('misc.phrases.field') + ' \'' + t('content.project.fields.name') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['name'] !== undefined) {
            if(!fields['name'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/;
                isValid = false;
                errors['name'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['dueDate']) {
            isValid = false;
            errors['dueDate'] = errors['dueDate'] = t('misc.phrases.field') + ' \'' + t('content.project.fields.dueDate') + '\' ' + t('commonErrors.formValidation.requiredDate');
        }

        if(!fields['category'] || fields['category'] === 'none') {
            isValid = false;
            errors['category'] = t('misc.phrases.field') + ' \'' + t('content.category.title') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['team'] || fields['team'] === 'none') {
            isValid = false;
            errors['team'] = t('misc.phrases.field') + ' \'' + t('content.team.title') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['status'] || fields['status'] === 'none') {
            isValid = false;
            errors['status'] = t('misc.phrases.field') + ' \'' + t('content.project.fields.status') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['description']) {
            isValid = false;
            errors['description'] = t('misc.phrases.field') + ' \'' + t('content.project.fields.description') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['description'] !== undefined) {
            if(!fields['description'].match(/^.{1,500}$/)) {
                let regex = /^.{1,500}$/;
                isValid = false;
                errors['description'] = t('content.project.actions.createProject.errorMessages.formValidation.allowedCharsOnly') + regex;
            }
        }

        this.setState({errors: errors});

        return isValid;
    }

    async getCategories() {
        await axios.post('http://localhost:3300/category/list', { category_type: 'project'}, {headers: this.headers, withCredentials: true })
            .then((response) => {
                if(response.data.categories.length > 0 && response.data.categories !== null) {
                    this.setState({categories: response.data.categories});
                } else {
                    this.setState({categories: null});
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
                if (error.response.data.error instanceof Error && (error.response.status === 404 || error.response.status === 406 || error.response.status === 500)) {
                    this.setState({
                        serverResponse: error.response.data.error
                    });
                }
                throw error;
            });
    }

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const {t} = this.props;
        const fields = this.state.fields;

        if(this.validateForm()) {
            try {
                axios.post('http://localhost:3300/project/create', {
                    userId: this.state.auth.userId,
                    projectObj: this.state.fields
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.project !== null) {
                        this.setState({project: response.data.project, serverResponse: t('content.project.actions.createProject.actionResults.success')});
                    }
                })
                .catch(error => {
                    if(error) {
                        this.setState({serverResponse: error.response.data.error});
                    }
                }) 
            } catch(e) {
                this.setState({serverResponse: e.message});
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
                        <label htmlFor="name">{t('content.project.fields.name')}</label>
                        <input onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" name="name" />
                        <span className="error-msg-span">{this.state.errors["name"]}</span>
                        <label htmlFor="category">{t('content.project.fields.category')}</label>
                        <select onChange={this.onChange.bind(this, 'category')} value={this.state.fields['category']} type="category" className="" name="category">
                            <option selected value="none">{t('misc.actionDescription.selectCategory')}</option>
                            {this.state.categories.length > 0 && (
                                this.state.categories.map((category, index) => {
                                    if(index === 0) {
                                        return <option value={category.name}>{category.name}</option>
                                    } else {
                                        return <option value={category.name}>{category.name}</option>
                                    }
                                })
                            )}
                        </select>
                        <span className="error-msg-span">{this.state.errors["category"]}</span>
                        <label htmlFor="description">{t('content.project.fields.description')}</label>
                        <textarea onChange={this.onChange.bind(this, 'description')} value={this.state.fields['description']} type="description" id="description" name="description" />
                        <span className="error-msg-span">{this.state.errors["description"]}</span>
                        <label htmlFor="team">{t('content.project.fields.team')}</label>
                        <select onChange={this.onChange.bind(this, 'team')} value={this.state.fields['team']} type="team" className="" name="team">
                            <option selected value="none">{t('misc.actionDescription.selectTeam')}</option>
                            {this.state.teams.length > 0 && (
                                this.state.teams.map((team, index) => {
                                    if(index === 0) {
                                        return <option value={team.name}>{team.name}</option>
                                    } else {
                                        return <option value={team.name}>{team.name}</option>
                                    }
                                })
                            )}
                        </select>
                        <span className="error-msg-span">{this.state.errors["team"]}</span>
                        <label htmlFor="status">{t('content.project.fields.status')}</label>
                        <select onChange={this.onChange.bind(this, 'status')} value={this.state.fields['status']} type="status" className="" name="status">
                            <option selected value="none">{t('misc.actionDescription.selectStatus')}</option>
                            {this.state.statuses.map((status, index) => {
                                if(index === 0) {
                                    return <option value={status}>{status}</option>
                                } else {
                                    return <option value={status}>{status}</option>
                                }
                            })}
                        </select>
                        <span className="error-msg-span">{this.state.errors["status"]}</span>
                        <label htmlFor="dueDate">{t('content.project.fields.dueDate')}</label>
                        <input onChange={this.onChange.bind(this, 'dueDate')} value={this.state.fields['dueDate']} type="date" className="" name="dueDate"
                            min="2021-02-01" max="2022-12-31" />
                        <span className="error-msg-span">{this.state.errors["dueDate"]}</span>
                        <label htmlFor="restrictedAccess">{t('content.project.fields.restrictedAccess')}</label>
                        <input onChange={this.onChange.bind(this, 'restrictedAccess')} value={this.state.fields['restrictedAccess']} type="checkbox" className="" name="restrictedAccess" />
                        <div class="card-form-divider">
                            <button type="submit" className="card-form-button">{t('misc.actionDescription.create')}</button>
                            <button type="reset" className="card-form-button" onClick={this.resetForm}>{t('misc.actionDescription.reset')}</button>
                            <button type="button" className="card-form-button"><Link to="/dashboard" className="card-form-button-link">{t('misc.actionDescription.cancel')}</Link></button>
                        </div>
                        {this.state.serverResponse !== null ? (
                                this.state.project !== null ? (
                                    <span className="error-msg-span" style={{display: "block", color: 'green'}} id="serverResponse">{this.state.serverResponse}</span>
                                ) : (
                                    <span className="error-msg-span" style={{display: "block"}} id="serverResponse">{t('content.project.actions.createProject.errorMessages.dataValidation.' + this.state.serverResponse)}</span>
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

const CreateProjectTranslation = withTranslation('common')(CreateProject);

export default CreateProjectTranslation;