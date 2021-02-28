import React from 'react';
import {Redirect} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class RecentActivity extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    refreshToken: this.jwt.refreshToken
                },
                recentActivity: []
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
                recentActivity: []
            }
        }
    }

    getRecentActivityList() {
        const {t} = this.props;

        try {
            axios.post('http://localhost:3300/recentActivity/list', 
            {
                userId: this.state.auth.userId    
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response.data.recentActivity !== undefined && response.data.recentActivity !== '' && response.data.recentActivity !== null && response.data.recentActivity.length > 0) {
                    this.setState({recentActivity: response.data.recentActivity});
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
        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return(
                <table class="tab-table">
                    <thead>
                        <tr>
                            <th>{t('content.recentActivity.fieldNames.name')}</th>
                            <th>{t('content.recentActivity.fieldNames.type')}</th>
                            <th>{t('content.recentActivity.fieldNames.content')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.recentActivity.map((activity, index) => (
                            <tr>
                                <td>{activity.name}</td>
                                <td>{activity.type}</td>
                                <td>{activity.content}</td>
                            </tr>
                        ))}
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

const RecentActivityTranslation = withTranslation('common')(RecentActivity);

export default RecentActivityTranslation;