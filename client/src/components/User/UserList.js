import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        
        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    refreshToken: this.jwt.refreshToken
                },
                users: [],
                serverResponse: null
            }

            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.auth.refreshToken}`
            };
        }

        this.getUserList();
    }

    getUserList() {
        if(this.props.params === undefined) {
            try {
                axios.post('http://localhost:3300/user/list', 
                {
                   
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response.data.users !== undefined && response.data.users !== '' && response.data.users !== null && response.data.users.length > 0) {
                        this.setState({users: response.data.users});
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
                axios.post('http://localhost:3300/user/list', 
                {
                   ref: this.props.params.ref,
                   objId: this.props.params.objId,
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response.data.users !== undefined && response.data.users !== '' && response.data.users !== null && response.data.users.length > 0) {
                        this.setState({users: response.data.users});
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

    render() {
        const {t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return(
                <div>
                    <table className="tab-table">
                        <thead>
                            <tr>
                                <th>{t('content.user.fields.firstname')}</th>
                                <th>{t('content.user.fields.lastname')}</th>
                                <th>{t('content.user.fields.username')}</th>
                                <th>{t('content.user.fields.email')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.users.length > 0 ? (
                                this.state.users.map((user, index) => (
                                    <tr>
                                        <td>{user.firstname}</td>
                                        <td>{user.lastname}</td>
                                        <td><Link to={{pathname: '/user/profile', state: {userId: user._id}}}>{user.username}</Link></td>
                                        <td>{user.email}</td>
                                    </tr>
                                    ))
                            ) : (
                                this.state.serverResponse === null ? (
                                    <tr>
                                        <td colspan="4" align="center">-</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colspan="4" align="center">- {t('content.team.actions.selectTeamList.errorMessages.dataValidation.' + this.state.serverResponse)} -</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                    {/* {this.props.location.state !== undefined && this.props.location.state.navBtn === true &
                        <div class="card-form-divider">
                            <button className="card-form-button"><Link to='/dashboard'>{t('misc.actionDescription.return')}</Link></button>
                        </div>
                    } */}
                </div>
            )
        } else {
            return(
                <Redirect to=
                    {{
                        pathname: "/login",
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

const UserListTranslation = withTranslation('common')(UserList);

export default UserListTranslation;