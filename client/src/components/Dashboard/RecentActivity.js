import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class RecentActivity extends React.Component {
    constructor(props) {
        super(props);
        var jwt = getJwtDataFromSessionStorage();

        if(jwt != null) {
            this.state = {
                auth: {
                    userId: jwt.userId,
                    refreshToken: jwt.refreshToken
                },
                recentActivity: []
            }
        } else {
            this.state = {
                auth: {
                    userId: null,
                    refreshToken: null
                },
                recentActivity: []
            }
        }

        this.getRecentActivityList = this.getRecentActivityList.bind(this);

        this.getRecentActivityList();
    }

    getRecentActivityList() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.auth.refreshToken}`
        };

        axios.post('http://localhost:3300/recentActivity/list', 
        {
            userId: this.state.auth.userId    
        },
        {
            withCredentials: true,
            headers: headers
        })
        .then((response) => {
            if(response.data.recentActivity !== undefined && response.data.recentActivity !== '' && response.data.recentActivity !== null && response.data.recentActivity.length > 0) {
                this.setState({recentActivity: response.data.recentActivity});
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
                        <th>{t('content.recentActivity.tableHeaders.name')}</th>
                        <th>{t('content.recentActivity.tableHeaders.type')}</th>
                        <th>{t('content.recentActivity.tableHeaders.content')}</th>
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
    }    
}

const RecentActivityTranslation = withTranslation('common')(RecentActivity);

export default RecentActivityTranslation;