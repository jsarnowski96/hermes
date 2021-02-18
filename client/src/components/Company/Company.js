import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class Company extends React.Component {
    constructor(props) {
        super(props);

        var jwt = getJwtDataFromSessionStorage();

        if(jwt !== null) {
            this.state = {
                auth: {
                    userId: jwt.userId,
                    refreshToken: jwt.refreshToken
                },
                fields: {},
                errors: {}
            }
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
        return(
            <h1>Company</h1>
        )
    }    
}

const CompanyTranslation = withTranslation('common')(Company);

export default CompanyTranslation;

