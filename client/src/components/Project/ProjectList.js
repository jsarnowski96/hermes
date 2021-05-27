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
                    accessToken: this.jwt.accessToken
                },
                projects: [],
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
        
        this.getProjectList();
    }

    getProjectList() {
        if(this.props.params === undefined) {
            try {
                axios.post('/project/list', 
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
                this.setState({serverResponse: {
                    origin: 'axios',
                    content: e.message
                }});
            }
        } else {
            try {
                axios.post('/project/list', 
                {
                    ref: this.props.params.ref,
                    objId: this.props.params.objId,
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.projects !== null && response.data.projects.length > 0) {
                        this.setState({projects: response.data.projects});
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
                this.setState({serverResponse: {
                    origin: 'axios',
                    content: e.message
                }});
            }
        }
    }

    render() {
        const{t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.accessToken !== null) {
            return(
                <div>
                    {
                        (() => {
                            if(this.props.location !== undefined && this.props.location.state !== undefined && this.props.location.state.navBtn === true) {
                                return(
                                    <h2>{t('content.userAction.actions.projectsOverview')}</h2>
                                )
                            }
                        })()
                    }
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
                                            <Link to={{pathname: '/project/details', state: {userId: this.state.auth.userId, projectId: project._id}}}>{project.name}</Link>
                                        </td>
                                        <td>
                                            {project.teams.map((team) => {
                                                return <span style={{marginLeft: '0.5vw'}}><Link to={{pathname: '/team/details', state: {ref: 'team', userId: team.owner, objId: team._id}}}>{team.name}</Link></span>
                                            })}
                                        </td>
                                        <td>{project.category.name}</td>
                                        <td>{moment(project.dueDate).format('YYYY-MM-DD')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    {this.state.serverResponse.content !== null ? (
                                        <td colspan="6" align="center">- {t('content.project.actions.selectProjectList.errorMessages.dataValidation.' + this.state.serverResponse.content)} -</td>
                                    ) : (
                                        <td colspan="6" align="center">-</td>
                                    )}
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {
                        (() => {
                            if(this.props.location !== undefined && this.props.location.state !== undefined && this.props.location.state.navBtn === true) {
                                return(
                                    <div class="card-form-divider">
                                        <Link to='/dashboard'><button className="card-form-button">{t('misc.actionDescription.return')}</button></Link>
                                    </div>
                                )
                            }
                        })()
                    }
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

const ProjectListTranslation = withTranslation('common')(ProjectList);

export default ProjectListTranslation;