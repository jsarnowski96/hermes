import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect, Link} from 'react-router-dom';
import axios from 'axios';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';
import moment from 'moment';

class Recent extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    accessToken: this.jwt.accessToken
                },
                recents: [],
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
        
        this.getRecent();
    }

    getRecent() {
        try {
            axios.post('/recent', 
            {
                userId: this.state.auth.userId
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response.data.recents !== undefined && response.data.recents !== null && response.data.recents.length > 0) {
                    this.setState({recents: response.data.recents});
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
            this.setState({
                serverResponse: {
                        origin: 'axios',
                        content: e.message
                    }
            })
        }
    }

    render() {
        const{t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.accessToken !== null) {
            return(
                <div>
                    <table className="tab-table">
                        <thead>
                            <tr>
                                <th>{t('content.recent.fields.createdAt')}</th>
                                <th>{t('content.recent.fields.description')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.recents.length > 0 ? (
                                this.state.recents.map((recent, index) => (
                                    <tr>
                                        <td>{moment(recent.created_at).format('YYYY-MM-DD | hh:mm:ss')}</td>
                                        <td>{t('content.recent.fields.user')} <Link to={{pathname: '/user/profile', state: { userId: recent.user}}}>{recent.user}</Link> {t('content.recent.actions.' + recent.action_type)} {t('content.recent.fields.' + recent.collection_name)} <Link to={{pathname: '/' + recent.collection_name + '/details', state: { ref: 'user', objId: recent.document}}}>{recent.document.name}</Link></td>
                                    </tr>
                                ))
                            ) : (
                                this.state.serverResponse.content === null ? (
                                    <tr>
                                        <td colspan="6" align="center">-</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colspan="6" align="center">- {t('content.recent.errorMessages.dataValidation.' + this.state.serverResponse.content)} -</td>
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