import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class Project extends React.Component {
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
            <h1>Project</h1>
        )
    }    
}

const ProjectTranslation = withTranslation('common')(Project);

export default ProjectTranslation;

