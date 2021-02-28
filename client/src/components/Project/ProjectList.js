import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class ProjectList extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    refreshToken: this.jwt.refreshToken
                },
                project: []
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
                project: []
            }
        }
        
        this.getProjectList();
    }

    getProjectList() {
        try {
            axios.post('http://localhost:3300/project/list', 
            {
                userId: this.state.auth.userId    
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response.data.project !== undefined && response.data.project !== '' && response.data.project !== null && response.data.project.length > 0) {
                    this.setState({project: response.data.project});
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
        const{t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            
            return(
                <table class="tab-table">
                    <thead>
                        <tr>
                            <th>{t('content.project.fieldNames.name')}</th>
                            <th>{t('content.project.fieldNames.assignedTeam')}</th>
                            <th>{t('content.project.fieldNames.category')}</th>
                            <th>{t('content.project.fieldNames.dueDate')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.project.map((project, index) => (
                            <tr>
                                <td>{project.name}</td>
                                <td>{project.assignedTeam}</td>
                                <td>{project.category}</td>
                                <td>{project.dueDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

const ProjectListTranslation = withTranslation('common')(ProjectList);

export default ProjectListTranslation;