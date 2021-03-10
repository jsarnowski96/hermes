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
                    refreshToken: this.jwt.refreshToken
                },
                teams: [],
                serverResponse: null
            }

            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.auth.refreshToken}`
            };
        }

        this.getTeamList();
    }

    getTeamList() {
        try {
            axios.get('http://localhost:3300/team/list', {headers: this.headers, withCredentials: true})
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

    render() {
        const {t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return(
                <table className="tab-table">
                    <thead>
                        <tr>
                            <th>{t('content.team.fields.name')}</th>
                            <th>{t('content.team.fields.owner')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.teams.length > 0 ? (
                            this.state.teams.map((team, index) => (
                                <tr>
                                    <td><Link to={{pathname: '/team/details', state: {ref: 'team', objId: team._id}}}>{team.name}</Link></td>
                                    <td><Link to={{pathname: '/user/profile', state: {userId: team.owner._id}}}>{team.owner.firstname + ' ' + team.owner.lastname}</Link></td>
                                </tr>
                                ))
                        ) : (
                            this.state.serverResponse === null ? (
                                <tr>
                                    <td colspan="6" align="center">-</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colspan="6" align="center">- {t('content.team.actions.selectTeamList.errorMessages.dataValidation.' + this.state.serverResponse)} -</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
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