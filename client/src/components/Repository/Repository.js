import React from 'react';
import {Redirect} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class Repository extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    refreshToken: this.jwt.refreshToken
                },
                fields: {},
                errors: {}
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
                fields: {},
                errors: {}
            }
        }
    }
    
    render() {
        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return <h1>Repository</h1>
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

const RepositoryTranslation = withTranslation('common')(Repository);

export default RepositoryTranslation;

