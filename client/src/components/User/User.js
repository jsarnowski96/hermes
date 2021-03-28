import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import TaskList from '../Task/TaskList';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class User extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    accessToken: this.jwt.accessToken
                },
                user: null,
                fields: {},
                errors: {},
                enableEdit: false,
                allowSave: false,
                serverResponse: {
                    origin: null,
                    content: null
                }
            }

            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.auth.accessToken}`
            };
        }

        this.getUser();
    }

    onChange(field, event) {
        let fields = this.state.fields;
        let errors = this.state.errors;
        
        fields[field] = event.target.value;       
        errors[field] = '';

        if(fields[field] === this.state.user[field]) {
            this.setState({fields, errors, allowSave: false});
        } else {
            this.setState({fields, errors, allowSave: true});
        }
    }

    resetForm() {
        let fields = this.state.fields;
        fields['firstname'] = this.state.user.firstname;
        fields['lastname'] = this.state.user.lastname;
        fields['username'] = this.state.user.username;
        fields['position'] = this.state.user.position;
        fields['company'] = this.state.user.company.name;
        fields['avatar_url'] = this.state.user.avatar_url;
        fields['email'] = this.state.user.email; 
        fields['phone'] = this.state.user.phone;

        document.getElementById('serverResponse').innerHTML = '';
        this.setState({fields, errors: {}, allowSave: false, 
            serverResponse: {
                origin: null,
                content: null
            }
        });
    }

    validateForm() {
        let fields = this.state.fields;
        let errors = this.state.errors;
        let isValid = true;
        const {t} = this.props;

        if(!fields['firstname']) {
            isValid = false;
            errors['firstname'] = t('misc.phrases.field') + ' \'' + t('content.register.firstname') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['firstname'] !== '') {
            if(!fields['firstname'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,20}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,20}$/;
                isValid = false;
                errors['firstname'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['lastname']) {
            isValid = false;
            errors['lastname'] = t('misc.phrases.field') + ' \'' + t('content.register.lastname') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['lastname'] !== '') {
            if(!fields['lastname'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,20}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,20}$/;
                isValid = false;
                errors['lastname'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['username']) {
            isValid = false;
            errors['username'] = t('misc.phrases.field') + ' \'' + t('content.register.username') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['username'] !== '') {
            if(!fields['username'].match(/^[a-zA-Z0-9\-_.]+$/)) {
                let regex = /^[a-zA-Z0-9\-_.]+$/;
                isValid = false;
                errors['username'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(!fields['email']) {
            isValid = false;
            errors['email'] = t('misc.phrases.field') + ' \'' + t('content.register.email') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['email'] !== '') {
            if(!fields['email'].match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) && !fields['email'].match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                isValid = false;
                errors['email'] = t('commonErrors.formValidation.emailNotValid');
            }
        }

        if(!fields['phone']) {
            isValid = false;
            errors['phone'] = t('misc.phrases.field') + ' \'' + t('content.register.phone') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        } else if(fields['phone'] !== '') {
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
        } else if(fields['position'] !== '') {
            if(!fields['position'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,30}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,30}$/;
                isValid = false;
                errors['position'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        }

        if(fields['company'] !== '' && fields['company'] !== '') {
            if(!fields['company'].match(/^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/)) {
                let regex = /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/;
                isValid = false;
                errors['company'] = t('commonErrors.formValidation.allowedCharsOnly') + regex;
            }
        } else if(!fields['company']) {
            isValid = false;
            errors['company'] = t('misc.phrases.field') + ' \'' + t('content.register.company') + '\' ' + t('commonErrors.formValidation.requiredFieldIsEmpty');
        }

        this.setState({errors: errors});

        return isValid;
    }

    async getUser() {
        let fields = this.state.fields;
        
        if(this.props.location === undefined && this.props.location.state === undefined) {
            try {
                await axios.post('/user/profile', 
                {
                    userId: this.state.auth.userId
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== '' && response.data.user !== null) {
                        this.setState({user: response.data.user});
                        fields['firstname'] = this.state.user.firstname;
                        fields['lastname'] = this.state.user.lastname;
                        fields['username'] = this.state.user.username;
                        fields['position'] = this.state.user.position;
                        fields['company'] = this.state.user.company.name;
                        fields['avatar_url'] = this.state.user.avatar_url;
                        fields['email'] = this.state.user.email; 
                        fields['phone'] = this.state.user.phone;
                        this.setState({fields});
                    }
                })
                .catch((error) => {
                    if(error !== undefined && error.response !== undefined) {
                        if(error.response.data.error === 'JwtTokenExpired') {
                            removeJwtDataFromSessionStorage()
                        } else {
                            this.setState({
                                serverResponse: {
                                    origin: error.response.data.origin,
                                    content: error.response.data.error
                                }
                            })
                        }
                    }
                });
            } catch(e) {
                this.setState({serverResponse: {
                    origin: 'axios',
                    content: e.message
                }});
            }
        } else {
            try {
                await axios.post('/user/profile', 
                {
                    userId: this.props.location.state.userId
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== '' && response.data.user !== null) {
                        this.setState({user: response.data.user});
                        fields['firstname'] = this.state.user.firstname;
                        fields['lastname'] = this.state.user.lastname;
                        fields['username'] = this.state.user.username;
                        fields['position'] = this.state.user.position;
                        fields['company'] = this.state.user.company.name;
                        fields['avatar_url'] = this.state.user.avatar_url;
                        fields['email'] = this.state.user.email; 
                        fields['phone'] = this.state.user.phone;
                        this.setState({fields});
                    }
                })
                .catch((error) => {
                    if(error !== undefined && error.response !== undefined) {
                        if(error.response.data.error === 'JwtTokenExpired') {
                            removeJwtDataFromSessionStorage()
                        } else {
                            this.setState({
                                serverResponse: {
                                    origin: error.response.data.origin,
                                    content: error.response.data.error
                                }
                            })
                        }
                    }
                });
            } catch(e) {
                this.setState({serverResponse: {
                    origin: 'axios',
                    content: e.message
                }});
            }
        }
    }

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const {t} = this.props;
        this.setState({serverResponse: {
            origin: null,
            content: null
        }})

        if(this.validateForm()) {
            try {
                axios.post('/user/update',
                {  
                    userId: this.state.auth.userId,
                    docId: this.state.user._id,
                    userObj: this.state.fields
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.user !== null) {
                        this.setState({user: response.data.user, serverResponse: { content: t('content.user.actions.updateUser.actionResults.success')}});
                    }
                })
                .catch((error) => {
                    if(error !== undefined && error.response !== undefined) {
                        if(error.response.data.error === 'JwtTokenExpired') {
                            removeJwtDataFromSessionStorage()
                        } else {
                            this.setState({
                                serverResponse: {
                                    origin: error.response.data.origin,
                                    content: error.response.data.error
                                }
                            })
                        }
                    }
                })
            } catch(e) {
                this.setState({ serverResponse: {
                    origin: 'axios',
                    content: e.message
                }});
            }
        }
    }
    
    render() {
        const {t} = this.props;
        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.accessToken !== null) {
            if(this.props.location.state !== undefined && this.props.location.state.userId) {
                return(
                    <div>
                        {this.state.user !== null ? (
                        <div>
                            <h2>{t('content.user.title')}</h2>
                            <form id="form" onSubmit={this.onFormSubmit}>
                                <table className="tab-table">
                                    <thead>
                                        <tr>
                                            <th>{t('content.user.fields.firstname')}</th>
                                            <th>{t('content.user.fields.lastname')}</th>
                                            <th>{t('content.user.fields.username')}</th>
                                            <th>{t('content.user.fields.email')}</th>
                                            <th>{t('content.user.fields.phone')}</th>
                                            <th>{t('content.user.fields.position')}</th>
                                            <th>{t('content.user.fields.company')}</th>
                                            <th>{t('content.user.fields.avatarUrl')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input onChange={this.onChange.bind(this, 'firstname')} value={this.state.fields['firstname']} type="firstname" className="" id="firstname" name="firstname" disabled={!this.state.enableEdit}/>
                                            </td>
                                            <td>
                                                <input onChange={this.onChange.bind(this, 'lastname')} value={this.state.fields['lastname']} type="lastname" className="" id="lastname" name="lastname" disabled={!this.state.enableEdit}/>
                                            </td>
                                            <td>
                                                <input onChange={this.onChange.bind(this, 'username')} value={this.state.fields['username']} type="username" className="" id="username" name="username" disabled={!this.state.enableEdit}/>
                                            </td>
                                            <td>
                                                <input onChange={this.onChange.bind(this, 'email')} value={this.state.fields['email']} type="email" className="" id="email" name="email" disabled={!this.state.enableEdit}/>
                                            </td>
                                            <td>
                                                <input onChange={this.onChange.bind(this, 'phone')} value={this.state.fields['phone']} type="phone" className="" id="phone" name="phone" disabled={!this.state.enableEdit}/>
                                            </td>
                                            <td>
                                                <input onChange={this.onChange.bind(this, 'position')} value={this.state.fields['position']} type="position" className="" id="position" name="position" disabled={!this.state.enableEdit}/>
                                            </td>
                                            <td>
                                                <input onChange={this.onChange.bind(this, 'company')} value={this.state.fields['company']} type="company" className="" id="company" name="company" disabled={!this.state.enableEdit}/>
                                            </td>
                                            <td>
                                                <input nowrap="nowrap" onChange={this.onChange.bind(this, 'avatar_url')} value={this.state.fields['avatar_url']} type="avatar_url" className="" id="avatar_url" name="avatar_url" disabled={!this.state.enableEdit}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><span className="error-msg-span">{this.state.errors["firstname"]}</span></td>
                                            <td><span className="error-msg-span">{this.state.errors["lastname"]}</span></td>
                                            <td><span className="error-msg-span">{this.state.errors["username"]}</span></td>
                                            <td><span className="error-msg-span">{this.state.errors["email"]}</span></td>
                                            <td><span className="error-msg-span">{this.state.errors["phone"]}</span></td>
                                            <td><span className="error-msg-span">{this.state.errors["position"]}</span></td>
                                            <td><span className="error-msg-span">{this.state.errors["company"]}</span></td>
                                            <td><span className="error-msg-span">{this.state.errors["avatar_url"]}</span></td>
                                        </tr>
                                        {this.state.serverResponse.content !== null ? (
                                            this.state.user !== null ? (
                                                <tr>
                                                    <td colspan="8" align="center">
                                                        <span className="error-msg-span" style={{display: "block", color: 'green'}} id="serverResponse">{this.state.serverResponse.content}</span>                                                            
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr>
                                                    <td colspan="8" align="center">
                                                        <span className="error-msg-span" style={{display: "block"}} id="serverResponse">{t('content.user.actions.selectUser.errorMessages.dataValidation.' + this.state.serverResponse.content)}</span>
                                                    </td>
                                                </tr>
                                            )
                                        ) : (
                                            null
                                        )}
                                    </tbody>
                                </table>
                            </form>
                            {this.state.auth.userId === this.state.user._id ? (
                                <div class="card-form-divider">
                                    <Link to='/dashboard'><button className="card-form-button">{t('misc.actionDescription.return')}</button></Link>
                                    <button className="card-form-button" form="form" type="submit" hidden={!this.state.enableEdit} disabled={!this.state.allowSave}>{t('misc.actionDescription.save')}</button>
                                    <button className="card-form-button" onClick={() => {this.setState(prev => ({enableEdit: !prev.enableEdit}))}} hidden={this.state.enableEdit}>{t('misc.actionDescription.edit')}</button>
                                    <button className="card-form-button" onClick={() => {this.setState(prev => ({enableEdit: !prev.enableEdit})); this.resetForm()}} hidden={!this.state.enableEdit}>{t('misc.actionDescription.cancel')}</button>
                                </div>
                            ) : (
                                <div class="card-form-divider">
                                    <Link to='/dashboard'><button className="card-form-button">{t('misc.actionDescription.return')}</button></Link>
                                </div>
                            )}
    
                            <br /><hr className="tab-hr" /><br />
    
                            <h2>{t('content.team.actions.selectTeam.associatedTasks')}</h2>
                            <TaskList params={{ref: 'user', objId: this.state.user._id}} />
                        </div>
                    ) : (
                        <table className="tab-table">
                            {this.state.serverResponse.content !== null ? (
                                this.state.serverResponse.content === 'unauthorized' ? (
                                    <tr>
                                        <td colspan="8" align="center">
                                            <tr><b>{t('commonErrors.' + this.state.serverResponse.content)}</b></tr>
                                            <tr><Link to='/dashboard'><button className="card-form-button">{t('misc.actionDescription.return')}</button></Link></tr>
                                        </td>
                                    </tr>
                                ) : (
                                    <tbody>
                                        <tr colspan="8"><td align="center">{t('content.user.actions.selectUser.errorMessages.dataValidation.' + this.state.serverResponse.content)}</td></tr>
                                        <tr colspan="8"><td align="center"><Link to='/dashboard'><button className="card-form-button">{t('misc.actionDescription.return')}</button></Link></td></tr>
                                    </tbody>
                                    )
                            ) : (
                                <tr>
                                    <td colspan="8" align="center">-</td>
                                </tr>
                            )}
                        </table>
                        )}
                    </div>
                )
            } else {
                return( 
                    <div align="center">
                        <h3>{t('content.user.actions.selectUser.errorMessages.dataValidation.missingProps')}</h3>
                        <Link to='/dashboard'><button className="card-form-button">{t('misc.actionDescription.return')}</button></Link>
                    </div>
                )
            }
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

const UserTranslation = withTranslation('common')(User);

export default UserTranslation;

