import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class RepositoryList extends React.Component {
    constructor(props) {
        super(props);
        var jwt = getJwtDataFromSessionStorage();

        if(jwt !== null) {
            this.state = {
                auth: {
                    userId: jwt.userId,
                    refreshToken: jwt.refreshToken
                },
                repositories: []
            }
        } else {
            this.state = {
                auth: {
                    userId: null,
                    refreshToken: null
                },
                repositories: []
            }
        }

        this.getRepositoryList = this.getRepositoryList.bind(this);

        this.getRepositoryList();
    }

    getRepositoryList() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.auth.refreshToken}`
        };

        axios.post('http://localhost:3300/repository/list', 
        {
            userId: this.state.auth.userId    
        },
        {
            withCredentials: true,
            headers: headers
        })
        .then((response) => {
            if(response.data.repositories !== undefined && response.data.repositories !== '' && response.data.repositories !== null && response.data.repositories.length > 0) {
                this.setState({repositories: response.data.repositories});
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
                        <th>{t('content.repositories.tableHeaders.name')}</th>
                        <th>{t('content.repositories.tableHeaders.type')}</th>
                        <th>{t('content.repositories.tableHeaders.content')}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.repositories.map((repository, index) => (
                        <tr>
                            <td>{repository.name}</td>
                            <td>{repository.type}</td>
                            <td>{repository.content}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }    
}

const RepositoryListTranslation = withTranslation('common')(RepositoryList);

export default RepositoryListTranslation;