import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUsers, faTasks, faCogs, faProjectDiagram, faHistory } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ProjectList from './ProjectList';
import TeamUserList from './UserList';
import TaskList from './TaskList';
import Recent from './Recent';
import ActivityList from './ActivityList';

import Login from '../Nav/Login';

import checkLocalStorage from '../../middleware/languageChanger';

import '../../assets/css/style.css';
import '../../assets/css/dashboard.css';

library.add(faUsers, faTasks, faCogs, faProjectDiagram, faHistory);

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: {
                refreshToken: '',
                accessToken: '',
                userId: '',
            }
        };

        checkLocalStorage();
    }

    componentDidMount(props) {
        this.setState({
            auth: {
                ...this.state.auth,
                userId: this.props.userId,
                refreshToken: this.props.refreshToken
            }
        })
    }

    render() {
        const {t, i18n} = this.props;

        if((this.state.auth.userId !== '' && this.state.auth.userId !== 'undefined' && this.state.auth.userId !== null) && (this.state.auth.refreshToken !== '' && this.state.auth.refreshToken !== 'undefined' && this.state.auth.refreshToken !== null)) {
            return(
                <div className="dashboard">
                    <div className="tab projects">
                        <p className="tab-title"><FontAwesomeIcon icon="project-diagram" size="xs" />{t('dashboard.projects.title')}</p>
                        <ProjectList userId={this.state.auth.userId} refreshToken={this.state.auth.refreshToken} />
                    </div>
                    <div className="tab team">
                        <p className="tab-title"><FontAwesomeIcon icon="users" size="xs" />{t('dashboard.team.title')}</p>
                        <TeamUserList userId={this.state.auth.userId} refreshToken={this.state.auth.refreshToken} />
                    </div>
                    <div className="tab tasks">
                        <p className="tab-title"><FontAwesomeIcon icon="tasks" size="xs" />{t('dashboard.tasks.title')}</p>
                        <TaskList userId={this.state.auth.userId} refreshToken={this.state.auth.refreshToken} />
                    </div>
                    <div className="tab recent">
                        <p className="tab-title"><FontAwesomeIcon icon="history" size="xs" />{t('dashboard.recent.title')}</p>
                        <Recent userId={this.state.auth.userId} refreshToken={this.state.auth.refreshToken} />
                    </div>
                    <div className="tab activities">
                        <p className="tab-title"><FontAwesomeIcon icon="cogs" size="xs" />{t('dashboard.activities.title')}</p>
                        <ActivityList userId={this.state.auth.userId} refreshToken={this.state.auth.refreshToken} />
                    </div>
                </div>
            )
        } else {
            return <Login />
        }
        
    }
}

const DashboardTranslation = withTranslation('common')(Dashboard);

export default DashboardTranslation;