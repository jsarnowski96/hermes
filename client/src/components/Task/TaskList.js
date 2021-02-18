import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getLanguageFromLocalStorage} from '../../middleware/languageLocalStorage';
import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class TaskList extends React.Component {
    constructor(props) {
        super(props);
        var jwt = getJwtDataFromSessionStorage();

        if(jwt !== null) {
            this.state = {
                auth: {
                    userId: jwt.userId,
                    refreshToken: jwt.refreshToken
                },
                tasks: []
            }
        } else {
            this.state = {
                auth: {
                    userId: null,
                    refreshToken: null
                },
                tasks: []
            }
        }

        this.getTaskList = this.getTaskList.bind(this);

        getLanguageFromLocalStorage();

        this.getTaskList();
    }

    getTaskList() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.auth.refreshToken}`
        };

        axios.post('http://localhost:3300/task/list', 
        {
            userId: this.state.auth.userId    
        },
        {
            withCredentials: true,
            headers: headers
        })
        .then((response) => {
            if(response.data.tasks !== undefined && response.data.tasks !== '' && response.data.tasks !== null && response.data.tasks.length > 0) {
                this.setState({tasks: response.data.tasks});
            }
        })
        .catch((error) => {
            console.log(error);
            console.log(error.response);
        });
    }

    render() {
        const {t} = this.props;
        return(
            <table class="tab-table">
                <thead>
                    <tr>
                        <th>{t('content.tasks.tableHeaders.name')}</th>
                        <th>{t('content.tasks.tableHeaders.category')}</th>
                        <th>{t('content.tasks.tableHeaders.dueDate')}</th>
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