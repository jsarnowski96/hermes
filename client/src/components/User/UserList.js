import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getLanguageFromLocalStorage} from '../../middleware/languageLocalStorage';
import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        var jwt = getJwtDataFromSessionStorage();

        if(jwt != null) {
            this.state = {
                auth: {
                    userId: jwt.userId,
                    refreshToken: jwt.refreshToken
                },
                users: []
            }
        } else {
            this.state = {
                auth: {
                    userId: null,
                    refreshToken: null
                },
                users: []
            }
        }

        this.getUserList = this.getUserList.bind(this);

        getLanguageFromLocalStorage();

        this.getUserList();
    }

    getUserList() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.auth.refreshToken}`
        };

        axios.post('http://localhost:3300/user/list', 
        {
            userId: this.state.auth.userId    
        },
        {
            withCredentials: true,
            headers: headers
        })
        .then((response) => {
            if(response.data.users !== undefined && response.data.users !== '' && response.data.users !== null && response.data.users.length > 0) {
                this.setState({users: response.data.users});
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
                        <th>{t('content.users.tableHeaders.name')}</th>
                        <th>{t('content.users.tableHeaders.position')}</th>
                        <th>{t('content.users.tableHeaders.team')}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.users.map((user, index) => (
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.position}</td>
                            <td>{user.team}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }    
}

const UserListTranslation = withTranslation('common')(UserList);

export default UserListTranslation;