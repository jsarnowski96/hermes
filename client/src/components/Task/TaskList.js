import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage, removeJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class TaskList extends React.Component {
    constructor(props) {
        super(props);
        
        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    refreshToken: this.jwt.refreshToken
                },
                tasks: [],
                serverResponse: null
            }

            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.auth.refreshToken}`
            };
        }

        this.getTaskList();
    }

    getTaskList() {
        try {
            axios.post('http://localhost:3300/task/list', 
            {
                ref: 'user',
                objId: this.state.auth.userId    
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response.data.tasks !== undefined && response.data.tasks !== '' && response.data.tasks !== null && response.data.tasks.length > 0) {
                    this.setState({tasks: response.data.tasks});
                }
            })
            .catch((error) => {
                if(error.response.data.error === 'JwtTokenExpired') {
                    removeJwtDataFromSessionStorage()
                }
                
                this.setState({
                    serverResponse: error.response.data.error
                })
            });
        } catch(e) {
            console.log(e);
        }
    }

    render() {
        const {t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return(
                <table className="tab-table">
                    <thead>
                        <tr>
                            <th>{t('content.task.fields.name')}</th>
                            <th>{t('content.task.fields.assignedUser')}</th>
                            <th>{t('content.task.fields.status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.teams > 0 ? (
                            this.state.tasks.map((task, index) => (
                                <tr>
                                    <td>{task.name}</td>
                                    <td>{task.status}</td>
                                    <td>{task.assigned_user.username}</td>
                                </tr>
                                ))
                        ) : (
                            this.state.serverResponse === null ? (
                                <tr>
                                    <td colspan="6" align="center">-</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colspan="6" align="center">- {t('content.task.actions.selectTaskList.errorMessages.dataValidation.' + this.state.serverResponse)} -</td>
                                </tr>
                            )
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

const TaskListTranslation = withTranslation('common')(TaskList);

export default TaskListTranslation;