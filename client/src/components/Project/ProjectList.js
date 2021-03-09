import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect, Link} from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

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
                projects: [],
                serverResponse: null
            }

            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.auth.refreshToken}`
            };
        }
        
        this.getProjectList();
    }

    getProjectList() {
        try {
            axios.post('http://localhost:3300/project/list', 
            {
                ref: 'user',
                objId: this.state.auth.userId
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response !== undefined && response.data.projects !== null && response.data.projects.length > 0) {
                    this.setState({projects: response.data.projects});
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
            this.setState({serverResponse: e.message});
        }
    }

    render() {
        const{t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return(
                <table className="tab-table">
                    <thead>
                        <tr>
                            <th>{t('content.project.fields.name')}</th>
                            <th>{t('content.project.fields.associatedTeams')}</th>
                            <th>{t('content.project.fields.category')}</th>
                            <th>{t('content.project.fields.dueDate')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.projects.length > 0 ? (
                            this.state.projects.map((project, index) => (
                                <tr>
                                    <td>
                                        <Link to={{pathname: '/project/details', state: {projectId: project._id}}}>{project.name}</Link>
                                    </td>
                                    <td>
                                        {project.teams.map((team) => {
                                            return <span style={{marginLeft: '1vw'}}><Link to={{pathname: '/team/details', state: {ref: 'team', objId: team._id}}}>{team.name}</Link></span>
                                        })}
                                    </td>
                                    <td>{project.category.name}</td>
                                    <td>{moment(project.dueDate).format('YYYY-MM-DD')}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {this.state.serverResponse !== null ? (
                                    <td colspan="6" align="center">- {t('content.project.actions.selectProjectList.errorMessages.dataValidation.' + this.state.serverResponse)} -</td>
                                ) : (
                                    <td colspan="6" align="center">-</td>
                                )}
                            </tr>
                        )}
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