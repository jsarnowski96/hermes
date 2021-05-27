import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class TeamList extends React.Component {
    constructor(props) {
        super(props);
        
        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    accessToken: this.jwt.accessToken
                },
                teams: [],
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

        this.getTeamList();
    }

    getTeamList() {
        if(this.props.params === undefined) {
            if(this.props.location === undefined && this.props.location.state === undefined) {
                try {
                    axios.post('/team/list',
                    {
                        ref: 'user',
                        userId: this.state.auth.userId,
                        objId: this.state.auth.userId
                    }, {headers: this.headers, withCredentials: true})
                    .then((response) => {
                        if(response.data.teams !== undefined && response.data.teams !== null && response.data.teams.length > 0) {
                            this.setState({teams: response.data.teams});
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
                    axios.post('/team/list',
                    {
                        ref: this.props.location.state.ref,
                        userId: this.props.location.state.userId,
                        objId: this.props.location.state.objId
                    }, {headers: this.headers, withCredentials: true})
                    .then((response) => {
                        if(response.data.teams !== undefined && response.data.teams !== null && response.data.teams.length > 0) {
                            this.setState({teams: response.data.teams});
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
                axios.post('/team/list',
                {
                    ref: this.props.params.ref,
                    userId: this.props.params.userId,
                    objId: this.props.params.objId
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response.data.teams !== undefined && response.data.teams !== null && response.data.teams.length > 0) {
                        this.setState({teams: response.data.teams});
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
                                    <h2>{t('content.userAction.actions.teamsOverview')}</h2>
                                )
                            }
                        })()
                    }
                    <table className="tab-table">
                        <thead>
                            <tr>
                                <th>{t('content.team.fields.name')}</th>
                                <th>{t('content.team.fields.owner')}</th>
                                <th>{t('content.team.fields.organization')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.teams.length > 0 ? (
                                this.state.teams.map((team, index) => (
                                    <tr>
                                        <td><Link to={{pathname: '/team/details', state: {ref: 'user', userId: this.state.auth.userId, objId: this.state.auth.userId}}}>{team.name}</Link></td>
                                        <td><Link to={{pathname: '/user/profile', state: {userId: team.owner._id}}}>{team.owner.firstname + ' ' + team.owner.lastname}</Link></td>
                                        <td>{team.organization.name}</td>
                                    </tr>
                                    ))
                            ) : (
                                <tr>
                                    {this.state.serverResponse.content !== null ? (
                                        <td colspan="6" align="center">- {t('content.team.actions.selectTeamList.errorMessages.dataValidation.' + this.state.serverResponse.content)} -</td>
                                    ) : (
                                        <td colspan="6" align="center">-</td>
                                    )}
                                </tr>
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

const TeamListTranslation = withTranslation('common')(TeamList);

export default TeamListTranslation;