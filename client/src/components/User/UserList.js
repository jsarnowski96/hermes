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
                    accessToken: this.jwt.accessToken
                },
                users: [],
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

        this.getUserList();
    }

    async getUserList() {
        if(this.props.params === undefined) {
            if(this.props.location === undefined && this.props.location.state === undefined) {
                try {
                    await axios.post('/user/list', 
                    {
                        ref: 'company',
                        objId: this.state.auth.userId
                    }, {headers: this.headers, withCredentials: true })
                    .then((response) => {
                        if(response.data.users.length > 0 && response.data.users !== null) {
                            this.setState({users: response.data.users});
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
                    await axios.post('/user/list', 
                    {
                        ref: this.props.location.state.ref,
                        objId: this.props.location.state.objId
                    }, {headers: this.headers, withCredentials: true })
                    .then((response) => {
                        if(response.data.users.length > 0 && response.data.users !== null) {
                            this.setState({users: response.data.users});
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
        } else {
            try {
                await axios.post('/user/list', 
                {
                    ref: this.props.params.ref,
                    objId: this.props.params.objId
                }, {headers: this.headers, withCredentials: true })
                .then((response) => {
                    if(response.data.users.length > 0 && response.data.users !== null) {
                        this.setState({users: response.data.users});
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

    render() {
        const {t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.accessToken !== null) {
            return(
                <div>
                    {
                        (() => {
                            if(this.props.location !== undefined && this.props.location.state !== undefined && this.props.location.state.navBtn === true) {
                                return(
                                    <h2>{t('content.userAction.actions.usersOverview')}</h2>
                                )
                            }
                        })()
                    }
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
                                this.state.serverResponse.content === null ? (
                                    <tr>
                                        <td colspan="4" align="center">-</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colspan="4" align="center">- {t('content.team.actions.selectTeamList.errorMessages.dataValidation.' + this.state.serverResponse.content)} -</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                    {
                        (() => {
                            if(this.props.location !== undefined && this.props.location.state !== undefined && this.props.location.state.navBtn === true) {
                                return(
                                    <div class="card-form-divider">
                                        <Link to='/dashboard'><button className="card-form-button">{t('misc.actionDescription.return')}</button></Link>
                                    </div>
                                )
                            }
                        })()
                    }
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