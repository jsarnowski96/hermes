import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect, Link} from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

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
        if(this.props.params === undefined) {
            if(this.props.location === undefined && this.props.location.state === undefined) {
                try {
                    axios.post('http://localhost:3300/task/list', 
                    {
                        ref: 'user',
                        objId: this.state.auth.userId
                    }, {headers: this.headers, withCredentials: true})
                    .then((response) => {
                        if(response !== undefined && response.data.tasks !== null && response.data.tasks.length > 0) {
                            this.setState({tasks: response.data.tasks});
                        }
                    })
                    .catch((error) => {
                        if(error !== undefined) {
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
            } else {
                try {
                    axios.post('http://localhost:3300/task/list', 
                    {
                        ref: this.props.location.state.ref,
                        objId: this.props.location.state.objId
                    }, {headers: this.headers, withCredentials: true})
                    .then((response) => {
                        if(response !== undefined && response.data.tasks !== null && response.data.tasks.length > 0) {
                            this.setState({tasks: response.data.tasks});
                        }
                    })
                    .catch((error) => {
                        if(error !== undefined) {
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
        } else {
            try {
                axios.post('http://localhost:3300/task/list', 
                {
                    ref: this.props.params.ref,
                    objId: this.props.params.objId,
                }, {headers: this.headers, withCredentials: true})
                .then((response) => {
                    if(response !== undefined && response.data.tasks !== null && response.data.tasks.length > 0) {
                        this.setState({tasks: response.data.tasks});
                    }
                })
                .catch((error) => {
                    if(error !== undefined) {
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
    }

    render() {
        const{t} = this.props;

        if(this.jwt !== null && this.state.auth.userId !== null && this.state.auth.refreshToken !== null) {
            return(
                <div>
                    {
                        (() => {
                            if(this.props.location !== undefined && this.props.location.state !== undefined && this.props.location.state.navBtn === true) {
                                return(
                                    <h2>{t('content.userAction.actions.tasksOverview')}</h2>
                                )
                            }
                        })()
                    }
                    <table className="tab-table">
                        <thead>
                            <tr>
                                <th>{t('content.task.fields.name')}</th>
                                {
                                    (() => {
                                        if(this.props.params !== undefined && this.props.params.info === 'basic') {
                                            return <th>{t('content.task.fields.project')}</th>
                                        } else {
                                            return <th>{t('content.task.fields.assignedUser')}</th>
                                        }
                                    })()
                                }
                                <th>{t('content.task.fields.category')}</th>
                                <th>{t('content.task.fields.dueDate')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.tasks.length > 0 ? (
                                this.state.tasks.map((task, index) => (
                                    <tr>
                                        <td>
                                            <Link to={{pathname: '/task/details', state: {taskId: task._id}}}>{task.name}</Link>
                                        </td>
                                        {/* <td style={{wordWrap: 'break-word', maxWidth: '10vw'}}><p dangerouslySetInnerHTML={{__html: task.description}} style={{whiteSpace: "pre-wrap"}} /></td> */}
                                        <td>
                                            {
                                                (() => {
                                                    if(this.props.params !== undefined && this.props.params.info === 'basic') {
                                                        task.project !== null ? (
                                                            <Link to={{pathname: '/project/details', state: {userId: this.state.auth.userId, projectId: task.project._id}}}>{task.project.name}</Link>
                                                        ) : (
                                                            <Link to={{pathname: '/project/details', state: {userId: this.state.auth.userId, projectId: null}}}>-</Link>
                                                        )
                                                    } else {
                                                        return <Link to={{pathname: '/user/profile', state: {userId: task.assigned_user._id}}}>{task.assigned_user.firstname} {task.assigned_user.lastname}</Link>
                                                    }
                                                })()
                                            }
                                        </td>
                                        <td>{task.category.name}</td>
                                        <td>{moment(task.dueDate).format('YYYY-MM-DD')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    {this.state.serverResponse !== null ? (
                                        <td colspan="6" align="center">- {t('content.task.actions.selectTaskList.errorMessages.dataValidation.' + this.state.serverResponse)} -</td>
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
                                        <button className="card-form-button"><Link to='/dashboard'>{t('misc.actionDescription.return')}</Link></button>
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

const TaskListTranslation = withTranslation('common')(TaskList);

export default TaskListTranslation;