import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getLanguageFromLocalStorage} from '../../middleware/languageLocalStorage';
import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class TeamList extends React.Component {
    constructor(props) {
        super(props);
        var jwt = getJwtDataFromSessionStorage();

        if(jwt !== null) {
            this.state = {
                auth: {
                    userId: jwt.userId,
                    refreshToken: jwt.refreshToken
                },
                teams: []
            }
        } else {
            this.state = {
                auth: {
                    userId: null,
                    refreshToken: null
                },
                teams: []
            }
        }

        this.getTeamList = this.getTeamList.bind(this);

        getLanguageFromLocalStorage();

        this.getTeamList();
    }

    getTeamList() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.auth.refreshToken}`
        };

        axios.post('http://localhost:3300/team/list', 
        {
            userId: this.state.auth.userId    
        },
        {
            withCredentials: true,
            headers: headers
        })
        .then((response) => {
            if(response.data.teams !== undefined && response.data.teams !== '' && response.data.teams !== null && response.data.teams.length > 0) {
                this.setState({teams: response.data.teams});
            }
        })
        .catch((error) => {
            console.log(error);
            console.log(error.response);
        });
    }

    render() {
        const {t} = this.props;
        return(
            <table class="tab-table">
                <thead>
                    <tr>
                        <th>{t('content.teams.tableHeaders.name')}</th>
                        <th>{t('content.teams.tableHeaders.leader')}</th>
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