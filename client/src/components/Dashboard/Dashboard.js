import React from 'react';
import {withTranslation} from 'react-i18next';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUsers, faTasks, faCogs, faProjectDiagram, faHistory } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import ProjectList from './ProjectList';
import TeamUserList from './UserList';
import TaskList from './TaskList';
import Recent from './Recent';
import ActivityList from './ActivityList';

import '../../assets/css/style.css';
import '../../assets/css/dashboard.css';

library.add(faUsers, faTasks, faCogs, faProjectDiagram, faHistory);

class Dashboard extends React.Component {
    render() {
        const {t} = this.props;
        return(
            <div className="dashboard">
                <div className="tab projects">
                    <p className="tab-title"><FontAwesomeIcon icon="project-diagram" size="xs" />{t('dashboard.projects.title')}</p>
                    <ProjectList />
                </div>
                <div className="tab team">
                    <p className="tab-title"><FontAwesomeIcon icon="users" size="xs" />{t('dashboard.team.title')}</p>
                    <TeamUserList />
                </div>
                <div className="tab tasks">
                    <p className="tab-title"><FontAwesomeIcon icon="tasks" size="xs" />{t('dashboard.tasks.title')}</p>
                    <TaskList />
                </div>
                <div className="tab recent">
                    <p className="tab-title"><FontAwesomeIcon icon="history" size="xs" />{t('dashboard.recent.title')}</p>
                    <Recent />
                </div>
                <div className="tab activities">
                    <p className="tab-title"><FontAwesomeIcon icon="cogs" size="xs" />{t('dashboard.activities.title')}</p>
                    <ActivityList />
                </div>
            </div>
        )
    }
}

const DashboardTranslation = withTranslation('common')(Dashboard);

export default DashboardTranslation;