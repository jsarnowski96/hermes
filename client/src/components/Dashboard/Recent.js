import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class Recent extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    refreshToken: this.jwt.refreshToken
                },
                recent: [],
                serverResponse: null
            }

            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.auth.refreshToken}`
            };
        }
        
        this.getRecent();
    }

    getRecent() {
        try {
            axios.post('http://localhost:3300/recent', 
            {
                userId: this.state.auth.userId
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response.data.recent !== undefined && response.data.recent !== '' && response.data.recent !== null && response.data.recent.length > 0) {
                    this.setState({recent: response.data.recent});
                }
            })
            .catch((error) => {
                if(error) {
                    if(error.response.data.error === 'JwtTokenExpired') {
                        removeJwtDataFromSessionStorage()
                    } else {
                        this.setState({
                            serverResponse: error.response.data.error
                        })
                    }
                }
            });
        } catch(e) {
            this.setState({
                serverResponse: e.message
            })
        }
    }

    render() {
        const{t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return(
                <div>
                    <table className="tab-table">
                        <thead>
                            <tr>
                                <th>{t('content.recent.fields.description')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.recent.length > 0 ? (
                                this.state.recent.map((recent, index) => (
                                    <tr>
                                        <td>{recent.description}</td>
                                    </tr>
                                ))
                            ) : (
                                this.state.serverResponse === null ? (
                                    <tr>
                                        <td colspan="6" align="center">-</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colspan="6" align="center">- {t('content.recent.actions.selectRecent.errorMessages.dataValidation.' + this.state.serverResponse)} -</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
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

const RecentTranslation = withTranslation('common')(Recent);

export default RecentTranslation;