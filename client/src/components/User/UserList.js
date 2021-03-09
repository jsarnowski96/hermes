import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

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
                users: []
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
                users: []
            }
        }
    }

    getUserList() {
        try {
            axios.post('http://localhost:3300/user/list', 
            {
                userId: this.state.auth.userId    
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response.data.users !== undefined && response.data.users !== '' && response.data.users !== null && response.data.users.length > 0) {
                    this.setState({users: response.data.users});
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
            <table className="tab-table">
                <thead>
                    <tr>
                        <th>{t('content.users.fields.name')}</th>
                        <th>{t('content.users.fields.position')}</th>
                        <th>{t('content.users.fields.team')}</th>
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