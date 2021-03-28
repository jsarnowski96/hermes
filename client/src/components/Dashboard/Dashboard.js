import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUsers, faTasks, faCogs, faProjectDiagram, faHistory } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ProjectList from '../Project/ProjectList';
import TeamList from '../Team/TeamList';
import TaskList from '../Task/TaskList';
import UserAction from './UserAction';
import Recent from './Recent';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/style.css';
import '../../assets/css/dashboard.css';

library.add(faUsers, faTasks, faCogs, faProjectDiagram, faHistory);

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    accessToken: this.jwt.accessToken
                },
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
                }
            }
        }
    }

    render() {
        const {t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.accessToken !== null) {
            return(
                <div className="dashboard">
                    <div className="tab userAction">
                        <p className="tab-title"><FontAwesomeIcon icon="cogs" size="xs" />{t('content.userAction.titlePlural')}</p>
                        <UserAction />
                    </div>
                    <div className="tab project">
                        <p className="tab-title"><FontAwesomeIcon icon="project-diagram" size="xs" />{t('content.project.titlePlural')}</p>
                        <ProjectList params={{ref: 'user', objId: this.state.auth.userId}} />
                    </div>
                    <div className="tab teams">
                        <p className="tab-title"><FontAwesomeIcon icon="users" size="xs" />{t('content.team.titlePlural')}</p>
                        <TeamList params={{ref: 'user', userId: this.state.auth.userId, objId: this.state.auth.userId}} />
                    </div>
                    <div className="tab tasks">
                        <p className="tab-title"><FontAwesomeIcon icon="tasks" size="xs" />{t('content.task.titlePlural')}</p>
                        <TaskList params={{ref: 'user', info: 'basic', objId: this.state.auth.userId}} />
                    </div>
                    <div className="tab recent">
                        <p className="tab-title"><FontAwesomeIcon icon="history" size="xs" />{t('content.recent.title')}</p>
                        <Recent />
                    </div>
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

const DashboardTranslation = withTranslation('common')(Dashboard);

export default DashboardTranslation;