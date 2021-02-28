import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUsers, faTasks, faCogs, faProjectDiagram, faHistory } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ProjectList from '../Project/ProjectList';
import TeamList from '../Team/TeamList';
import TaskList from '../Task/TaskList';
import UserActions from './UserActions';
import RecentActivity from './RecentActivity';

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
                    refreshToken: this.jwt.refreshToken
                }
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
                }
            }
        }
    }

    render() {
        const {t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return(
                <div className="dashboard">
                    <div className="tab project">
                        <p className="tab-title"><FontAwesomeIcon icon="project-diagram" size="xs" />{t('content.project.title')}</p>
                        <ProjectList />
                    </div>
                    <div className="tab teams">
                        <p className="tab-title"><FontAwesomeIcon icon="users" size="xs" />{t('content.teams.title')}</p>
                        <TeamList />
                    </div>
                    <div className="tab tasks">
                        <p className="tab-title"><FontAwesomeIcon icon="tasks" size="xs" />{t('content.tasks.title')}</p>
                        <TaskList />
                    </div>
                    <div className="tab recent">
                        <p className="tab-title"><FontAwesomeIcon icon="history" size="xs" />{t('content.recentActivity.title')}</p>
                        <RecentActivity />
                    </div>
                    <div className="tab userActions">
                        <p className="tab-title"><FontAwesomeIcon icon="cogs" size="xs" />{t('content.userActions.title')}</p>
                        <UserActions />
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