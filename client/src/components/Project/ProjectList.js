import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import CreateProject from './CreateProject';

import Login from '../Nav/Login';

import '../../assets/css/dashboard.css';

class ProjectList extends React.Component {
    constructor(props) {
        super(props);
        var jwt = getJwtDataFromSessionStorage();

        if(jwt !== null) {
            this.state = {
                auth: {
                    userId: jwt.userId,
                    refreshToken: jwt.refreshToken
                },
                projects: []
            }
        } else {
            this.state = {
                auth: {
                    userId: null,
                    refreshToken: null
                },
                projects: []
            }
        }

        this.getProjectList = this.getProjectList.bind(this);

        this.getProjectList();
    }

    getProjectList() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.auth.refreshToken}`
        };

        axios.post('http://localhost:3300/project/list', 
        {
            userId: this.state.auth.userId    
        },
        {
            withCredentials: true,
            headers: headers
        })
        .then((response) => {
            if(response.data.projects !== undefined && response.data.projects !== '' && response.data.projects !== null && response.data.projects.length > 0) {
                this.setState({projects: response.data.projects});
            }
        })
        .catch((error) => {
            console.log(error);
            console.log(error.response);
        });
    }

    render() {
        const{t} = this.props;

        if(this.state.auth.userId !== '' && this.state.auth.userId !== undefined && this.state.auth.userId !== null && this.state.auth.refreshToken !== '' && this.state.auth.refreshToken !== null) {
            
            return(
                <table class="tab-table">
                    <thead>
                        <tr>
                            <th>{t('content.projects.tableHeaders.name')}</th>
                            <th>{t('content.projects.tableHeaders.assignedTeam')}</th>
                            <th>{t('content.projects.tableHeaders.category')}</th>
                            <th>{t('content.projects.tableHeaders.dueDate')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.projects.map((project, index) => (
                            <tr>
                                <td>{project.name}</td>
                                <td>{project.assignedTeam}</td>
                                <td>{project.category}</td>
                                <td>{project.dueDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
        } else {
            return <Login />
        }
    }    
}

const ProjectListTranslation = withTranslation('common')(ProjectList);

export default ProjectListTranslation;