import React from 'react';
import {Redirect} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class Company extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    accessToken: this.jwt.accessToken
                },
                fields: {},
                errors: {},
                serverResponse: {
                    origin: null,
                    content: null
                }
            }

            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.auth.accessToken}`
            };
        } else {
            this.state = {
                auth: {
                    userId: null,
                    accessToken: null
                },
                serverResponse: {
                    origin: null,
                    content: null
                },
                fields: {},
                errors: {}
            }
        }
    }
    
    render() {
        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.accessToken !== null) {
            return <h1>Company</h1>
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

const CompanyTranslation = withTranslation('common')(Company);

export default CompanyTranslation;

