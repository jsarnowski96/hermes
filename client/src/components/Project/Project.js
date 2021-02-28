import React from 'react';
import {Redirect} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class Project extends React.Component {
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

    getProject() {
        const {t} = this.props;

        try {
            axios.post('http://localhost:3300/project/details', {
                id: this.props.projectId
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                let res = document.getElementById('serverResponse');
                console.log(response);
                res.innerHTML = response;
                res.style.display = 'block';            
            }, {headers: this.headers, withCredentials: true})
            .catch(error => {
                let sr = document.getElementById('serverResponse');
                if(error) {
                    if(error.response.data.message === 'JwtTokenExpired') {
                        removeJwtDataFromSessionStorage();
                    } else {
                        sr.innerHTML = error;
                        sr.style.display = 'block';
                    }
                }
            })    
        } catch(e) {
            console.log(e);
        }
    }
    
    render() {
        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return( 
                <div>
                    <h1>Project</h1>
                    <span id="serverResponse"></span>
                </div>
            )
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

const ProjectTranslation = withTranslation('common')(Project);

export default ProjectTranslation;

