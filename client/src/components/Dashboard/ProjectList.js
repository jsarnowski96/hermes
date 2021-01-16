import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

//import config from '../../constants/request-config';
import checkLocalStorage from '../../middleware/languageChanger';

import ProjectItem from '../Project/Project';
import NewProject from '../Project/NewProject';

import Login from '../Nav/Login';

import '../../assets/css/dashboard.css';

class ProjectList extends React.Component {
    // state = { first: ['A', 'B', 'C', 'D'], second: ['1', '2', '3', '4']};

    constructor(props) {
        super(props);
        this.state = {
            auth: {
                refreshToken: '',
                accessToken: '',
                userId: '',
            },
            associatedProjects: []
        };

        this.getProjectList = this.getProjectList.bind(this);

        checkLocalStorage();
    }

    componentDidMount() {
        this.setState({
            auth: {
                ...this.state.auth,
                userId: this.props.userId,
                refreshToken: this.props.refreshToken
            }
        });
    }

    async getProjectList() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.auth.refreshToken}`
        };

        await axios.post('http://localhost:3300/project/list', 
        {
            _id: this.state.auth.userId    
        },
        {
            withCredentials: true,
            headers: headers
        })
        .then((response) => {
            if(response.data.associatedProjects !== 'undefined' && response.data.associatedProjects !== '' && response.data.associatedProjects !== null && response.data.associatedProjects.length > 0) {
                this.setState({associatedProjects: response.data.associatedProjects});
            }
        })
        .catch((error) => {
            console.log(error);
            console.log(error.response);
        });
    }

    render() {
        const {t, i18n} = this.props;

        if(this.state.auth.userId !== '' && this.state.auth.userId !== 'undefined' && this.state.auth.userId !== null && this.state.auth.refreshToken !== '' && this.state.auth.refreshToken !== null) {
            this.getProjectList();
            
            return(
                <table class="tab-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Due date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.associatedProjects.map((project, index) => (
                            <tr>
                                <td>{project.name}</td>
                                <td>{project.category}</td>
                                <td>{project.due_date}</td>
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