import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

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
                tasks: []
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
                tasks: []
            }
        }
    }

    getTaskList() {
        try {
            axios.post('http://localhost:3300/task/list', 
            {
                userId: this.state.auth.userId    
            }, {headers: this.headers, withCredentials: true})
            .then((response) => {
                if(response.data.tasks !== undefined && response.data.tasks !== '' && response.data.tasks !== null && response.data.tasks.length > 0) {
                    this.setState({tasks: response.data.tasks});
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
        const {t} = this.props;
        return(
            <table class="tab-table">
                <thead>
                    <tr>
                        <th>{t('content.tasks.fieldNames.name')}</th>
                        <th>{t('content.tasks.fieldNames.category')}</th>
                        <th>{t('content.tasks.fieldNames.dueDate')}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.tasks.map((task, index) => (
                        <tr>
                            <td>{task.name}</td>
                            <td>{task.category}</td>
                            <td>{task.dueDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }    
}

const TaskListTranslation = withTranslation('common')(TaskList);

export default TaskListTranslation;