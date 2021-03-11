import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import JoditEditor from 'jodit-react';

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
                organizations: [],
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
        this.getOrganizations();
    }

    componentWillUnmount() {
        axios.Cancel('Axios request canceled.');
    }

    resetForm() {
        // document.getElementById('serverResponse').innerHTML = '';
        //document.getElementById('description').defaultValue = '';
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

        if(!fields['organization'] || fields['organization'] === 'none') {
            isValid = false;
            errors['organization'] = t('misc.phrases.field') + ' \'' + t('content.organization.title') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['teams'] || fields['teams'] === 'none') {
            isValid = false;
            errors['teams'] = t('misc.phrases.field') + ' \'' + t('content.team.title') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['status'] || fields['status'] === 'none') {
            isValid = false;
            errors['status'] = t('misc.phrases.field') + ' \'' + t('content.project.fields.status') + '\' ' + t('commonErrors.formValidation.requiredDropDownSelection');
        }

        if(!fields['description']) {
            isValid = false;
            errors['description'] = t('misc.phrases.field') + ' \'' + t('content.project.fields.description') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
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

    async getOrganizations() {
        if(this.props.params === undefined) {
            if(this.props.location === undefined && this.props.location.state === undefined) {
                try {
                    await axios.post('http://localhost:3300/organization/list',
                    {
                        ref: 'user',
                        objId: this.state.auth.userId
                    }, {headers: this.headers, withCredentials: true })
                    .then((response) => {
                        if(response.data.organizations.length > 0 && response.data.organizations !== null) {
                            this.setState({organizations: response.data.organizations});
                        }   
                    })
                    .catch((error) => {
                        if(error.response.data.error === 'JwtTokenExpired') {
                            removeJwtDataFromSessionStorage();
                        } else {
                            this.setState({serverResponse: error.response.data.error});
                        }
                    });
                } catch(e) {
                    this.setState({serverResponse: e.message});
                }
            } else {
                try {
                    await axios.post('http://localhost:3300/organization/list',
                    {
                        ref: this.props.location.state.ref,
                        objId: this.props.location.state.objId
                    }, {headers: this.headers, withCredentials: true })
                    .then((response) => {
                        if(response.data.organizations.length > 0 && response.data.organizations !== null) {
                            this.setState({organizations: response.data.organizations});
                        }   
                    })
                    .catch((error) => {
                        if(error.response.data.error === 'JwtTokenExpired') {
                            removeJwtDataFromSessionStorage();
                        } else {
                            this.setState({serverResponse: error.response.data.error});
                        }
                    });
                } catch(e) {
                    this.setState({serverResponse: e.message});
                }
            }
        } else {
            try {
                await axios.post('http://localhost:3300/organization/list',
                {
                    ref: this.props.params.ref,
                    objId: this.props.params.objId
                }, {headers: this.headers, withCredentials: true })
                .then((response) => {
                    if(response.data.organizations.length > 0 && response.data.organizations !== null) {
                        this.setState({organizations: response.data.organizations});
                    }   
                })
                .catch((error) => {
                    if(error.response.data.error === 'JwtTokenExpired') {
                        removeJwtDataFromSessionStorage();
                    } else {
                        this.setState({serverResponse: error.response.data.error});
                    }
                });
            } catch(e) {
                this.setState({serverResponse: e.message});
            }
        }
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

    getTeams() {
        if(this.props.params === undefined) {
            if(this.props.location === undefined && this.props.location.state === undefined) {
                try {
                    axios.post('http://localhost:3300/team/list',
                    {
                        ref: 'user',
                        objId: this.state.auth.userId
                    }, {headers: this.headers, withCredentials: true})
                    .then((response) => {
                        if(response.data.teams !== undefined && response.data.teams !== '' && response.data.teams !== null && response.data.teams.length > 0) {
                            this.setState({teams: response.data.teams});
                        }
                    })
                    .catch((error) => {
                        if(error.response.data.error === 'JwtTokenExpired') {
                            removeJwtDataFromSessionStorage()
                        } else {
                            this.setState({
                                serverResponse: error.response.data.error
                            })
                        }
                    });
                } catch(e) {
                    this.setState({serverResponse: e.message});
                }
            } else {
                try {
                    axios.post('http://localhost:3300/team/list',
                    {
                        ref: this.props.location.state.ref,
                        objId: this.props.location.state.objId
                    }, {headers: this.headers, withCredentials: true})
                    .then((response) => {
                        if(response.data.teams !== undefined && response.data.teams !== '' && response.data.teams !== null && response.data.teams.length > 0) {
                            this.setState({teams: response.data.teams});
                        }
                    })
                    .catch((error) => {
                        if(error.response.data.error === 'JwtTokenExpired') {
                            removeJwtDataFromSessionStorage()
                        } else {
                            this.setState({
                                serverResponse: error.response.data.error
                            })
                        }
                    });
                } catch(e) {
                    this.setState({serverResponse: e.message});
                }
            }
        } else {
            try {
                axios.post('http://localhost:3300/team/list',
                {
                    ref: this.props.params.ref,
                    objId: this.props.params.objId
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response.data.teams !== undefined && response.data.teams !== '' && response.data.teams !== null && response.data.teams.length > 0) {
                        this.setState({teams: response.data.teams});
                    }
                })
                .catch((error) => {
                    if(error.response.data.error === 'JwtTokenExpired') {
                        removeJwtDataFromSessionStorage()
                    } else {
                        this.setState({
                            serverResponse: error.response.data.error
                        })
                    }
                });
            } catch(e) {
                this.setState({serverResponse: e.message});
            }
        }
    }

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const {t} = this.props;
        const fields = this.state.fields;
        this.setState({serverResponse: null})

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
                <div>
                    <h2>{t('content.project.actions.createProject.actionTitle')}</h2>
                    <form className="card-form" onSubmit={this.onFormSubmit}>
                        <table className="tab-table">
                            <thead>
                                <tr>
                                    <th>{t('content.project.fields.name')}</th>
                                    <th>{t('content.project.fields.category')}</th>
                                    <th>{t('content.project.fields.associatedTeams')}</th>
                                    <th>{t('content.project.fields.organization')}</th>
                                    <th>{t('content.project.fields.status')}</th>
                                    <th>{t('content.project.fields.dueDate')}</th>
                                    <th>{t('content.project.fields.restrictedAccess')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input placeholder={t('misc.actionDescription.insertName')} onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" name="name" />
                                    </td>
                                    <td>
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
                                    </td>
                                    <td>
                                        <Select 
                                                options={this.state.teams} 
                                                isMulti
                                                value={this.state.fields['teams']}
                                                onChange={(value) => {
                                                    let fields = this.state.fields;
                                                    fields['teams'] = value;
                                                    this.setState({fields});
                                                }}
                                                name="Teams"
                                                //defaultValue={() => this.state.project.teams.map((team) => {return [team.name]})}
                                                placeholder={t('misc.actionDescription.addTeam')}
                                                getOptionLabel={(option) => option.name} 
                                                getOptionValue={(option) => option._id}
                                                noOptionsMessage={() => t('commonErrors.noTeamsAvailable')}
                                                />
                                    </td>
                                    <td>
                                        <select onChange={this.onChange.bind(this, 'organization')} value={this.state.fields['organization']} type="organization" className="" name="organization">
                                            <option selected value="none">{t('misc.actionDescription.selectOrganization')}</option>
                                            {this.state.organizations.length > 0 && (
                                                this.state.organizations.map((organization, index) => {
                                                    return <option value={organization.name}>{organization.name}</option>
                                                })
                                            )}
                                        </select>
                                    </td>
                                    <td>
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
                                    </td>
                                    <td>
                                        <input onChange={this.onChange.bind(this, 'dueDate')} value={this.state.fields['dueDate']} type="date" className="" name="dueDate"
                                            min="2021-02-01" max="2022-12-31" />
                                        
                                    </td>
                                    <td>
                                        <input onChange={this.onChange.bind(this, 'restrictedAccess')} value={this.state.fields['restrictedAccess']} type="checkbox" className="" name="restrictedAccess" />
                                    </td>
                                </tr>
                                <tr>
                                    <td><span className="error-msg-span">{this.state.errors["name"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["category"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["teams"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["organization"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["status"]}</span></td>
                                    <td><span className="error-msg-span">{this.state.errors["dueDate"]}</span></td>
                                </tr>
                            </tbody>
                            <thead>
                                <tr>
                                    <th colSpan="7">{t('content.project.fields.description')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="7">
                                        <JoditEditor
                                            ref={this.state.fields['description']}
                                            value={this.state.fields['description']}
                                            
                                            tabIndex={1} // tabIndex of textarea
                                            onChange={(value) => {let fields = this.state.fields; 
                                                let errors = this.state.errors;
                                                fields['description'] = value; 
                                                errors['description'] = '';
                                                this.setState({fields, errors})}}
                                            //onBlur={newContent => { let fields = this.state.fields; fields['description'] = newContent; this.setState({fields})}} // preferred to use only this option to update the content for performance reasons
                                        />
                                        
                                    </td>
                                </tr>
                                <tr><td><span className="error-msg-span">{this.state.errors["description"]}</span></td></tr>
                                {this.state.serverResponse !== null ? (
                                    this.state.user !== null ? (
                                        <tr>
                                            <td colspan="8" align="center">
                                                <span className="error-msg-span" style={{display: "block", color: 'green'}} id="serverResponse">{this.state.serverResponse}</span>                                                            
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td colspan="8" align="center">
                                                <span className="error-msg-span" style={{display: "block"}} id="serverResponse">{t('content.project.actions.createProject.errorMessages.dataValidation.' + this.state.serverResponse)}</span>
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    null
                                )}
                            </tbody>
                        </table>
                        <div class="card-form-divider">
                            <button type="submit" className="card-form-button">{t('misc.actionDescription.create')}</button>
                            <button type="reset" className="card-form-button" onClick={this.resetForm}>{t('misc.actionDescription.reset')}</button>
                            <button type="button" className="card-form-button"><Link to="/dashboard" className="card-form-button-link">{t('misc.actionDescription.cancel')}</Link></button>
                        </div>
                        
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