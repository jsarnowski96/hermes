import React from 'react';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

//import config from '../../constants/request-config';
import checkLocalStorage from '../../services/languageChanger';

import ProjectItem from '../Project/Project';
import NewProject from '../Project/NewProject';

import '../../assets/css/dashboard.css';

let config = {}

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
            projects: []
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

        config = {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.state.auth.refreshToken
            },
        };

        this.getProjectList();
    }

    getProjectList() {
        axios.get('http://localhost:3300/project/list', config)
        .then((response) => {
            if(response.data.projects !== 'undefined' || response.data.projects !== '' || response.data.projects.length > 0) {
                this.setState({projects: response.data.projects});
            }
        })
    }

    render() {
        // let items = [];
        // this.state.first.forEach(first => {
        //     this.state.second.forEach(second => {
        //         items.push(<ProjectItem first={first} second={second} />)
        //     });
        // });
        const {t} = this.props;

        // if(this.state.userId !== '' && this.state.refreshToken !== '') {
        //     return(
        //         <NewProject userId={this.state.userId} refreshToken={this.state.refreshToken} />
        //     )
        // }

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
                    {this.state.projects.map((project, index) => (
                        <tr>
                            <td>{project.name}</td>
                            <td>{project.category}</td>
                            <td>{project.due_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }    
}

const ProjectListTranslation = withTranslation('common')(ProjectList);

export default ProjectListTranslation;