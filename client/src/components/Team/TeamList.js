import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

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
                teams: []
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
                teams: []
            }
        }
    }

    getTeamList() {
        try {
            axios.post('http://localhost:3300/team/list', 
            {
                userId: this.state.auth.userId    
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response.data.teams !== undefined && response.data.teams !== '' && response.data.teams !== null && response.data.teams.length > 0) {
                    this.setState({teams: response.data.teams});
                }
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
        } catch(e) {
            console.log(e);
        }
    }

    render() {
        const {t} = this.props;
        return(
            <table class="tab-table">
                <thead>
                    <tr>
                        <th>{t('content.teams.fieldNames.name')}</th>
                        <th>{t('content.teams.fieldNames.leader')}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.teams.map((team, index) => (
                        <tr>
                            <td>{team.name}</td>
                            <td>{team.leader}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }    
}

const TeamListTranslation = withTranslation('common')(TeamList);

export default TeamListTranslation;