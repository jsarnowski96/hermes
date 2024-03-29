import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class UserAction extends React.Component {
    constructor(props) {
        super(props);
        
        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    accessToken: this.jwt.accessToken
                },
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
    }

    onLogout() {
        try {
            axios.post('/auth/logout');
            sessionStorage.setItem('renderLogoutBtn', false);
            removeJwtDataFromSessionStorage();
        } catch(e) {
            this.setState({serverResponse: {
                origin: 'axios',
                content: e.message
            }});
        }      
    }

    render() {
        const{t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.accessToken !== null) {
            return(
                <table className="tab-table">
                    <thead>
                        <tr>
                            <th align="center">{t('content.userAction.fields.name')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td align="center"><Link to={{pathname: '/user/profile', state: { userId: this.state.auth.userId}}}>{t('content.userAction.actions.userProfile')}</Link></td>
                        </tr>
                        <tr>
                            <td align="center"><Link to={{pathname: '/team/details', state: { ref: 'user', userId: this.state.auth.userId, objId: this.state.auth.userId}}}>{t('content.userAction.actions.teamDetails')}</Link></td>
                        </tr>
                        <tr>
                            <td align="center"><Link to="/project/create">{t('content.userAction.actions.createProject')}</Link></td>
                        </tr>
                        <tr>
                            <td align="center"><Link to="/team/create">{t('content.userAction.actions.createTeam')}</Link></td>
                        </tr>
                        <tr>
                            <td align="center"><Link to="/task/create">{t('content.userAction.actions.createTask')}</Link></td>
                        </tr>
                        <tr>
                            <td align="center"><Link to={{pathname: "/project/list", state: {ref: 'company', objId: this.state.auth.userId, navBtn: true}}}>{t('content.userAction.actions.projectsOverview')}</Link></td>
                        </tr>
                        <tr>
                            <td align="center"><Link to={{pathname: "/task/list", state: {ref: 'user', objId: this.state.auth.userId, navBtn: true}}}>{t('content.userAction.actions.tasksOverview')}</Link></td>
                        </tr>
                        <tr>
                            <td align="center"><Link to={{pathname: "/team/list", state: {ref: 'user', objId: this.state.auth.userId, navBtn: true}}}>{t('content.userAction.actions.teamsOverview')}</Link></td>
                        </tr>
                        <tr>
                            <td align="center"><Link to={{pathname: "/user/list", state: {ref: 'company', objId: this.state.auth.userId, navBtn: true}}}>{t('content.userAction.actions.usersOverview')}</Link></td>
                        </tr>
                        <tr>
                            <td align="center"><Link to="/" onClick={this.onLogout}>{t('content.navbar.logout')}</Link></td>
                        </tr>
                    </tbody>
                </table>
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

const UserActionTranslation = withTranslation('common')(UserAction);

export default UserActionTranslation;