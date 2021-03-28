import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {withTranslation} from 'react-i18next';

import Sidebar from './Nav/Sidebar';
import About from './Nav/About';
import Contact from './Nav/Contact';
import Login from './Nav/Login';
import Register from './Nav/Register';
import Home from './Nav/Home';

import Dashboard from './Dashboard/Dashboard';
import Recent from './Dashboard/Recent';
import UserAction from './Dashboard/UserAction';

import Project from './Project/Project';
import Task from './Task/Task';
import Company from './Company/Company';
import Team from './Team/Team';
import User from './User/User';
import Organization from './Organization/Organization';

import ProjectList from './Project/ProjectList';
import TeamList from './Team/TeamList';
import CompanyList from './Company/CompanyList';
import UserList from './User/UserList';
import TaskList from './Task/TaskList';
import OrganizationList from './Organization/OrganizationList';

import CreateProject from './Project/CreateProject';
import CreateTask from './Task/CreateTask';
import CreateCompany from './Company/CreateCompany';
import CreateTeam from './Team/CreateTeam';
import CreateUser from './User/CreateUser';
import CreateOrganization from './Organization/CreateOrganization';

import NotFound from './NotFound';

import getLanguageFromLocalStorage from '../middleware/languageLocalStorage';

import '../assets/css/style.css';

class App extends React.Component {    
    constructor(props) {
        super(props);
        const {i18n} = this.props;

        this.state = {
            toggleSlide: false
        }

        let lsLanguage = getLanguageFromLocalStorage();
        if(i18n.language !== lsLanguage) {
            i18n.changeLanguage(lsLanguage);
        }
        if(sessionStorage.getItem('renderLogoutBtn') === undefined || sessionStorage.getItem('renderLogoutBtn') === null) {
            sessionStorage.setItem('renderLogoutBtn', false);
        }
    }

    render() {
        return(
            <BrowserRouter>
                <Sidebar />
                <main>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/about" component={About} />
                        <Route path="/contact" component={Contact} />
                        <Route path="/dashboard" component={Dashboard} />
                        <Route exact path="/recent" component={Recent} />
                        <Route exact path="/organization/details" component={Organization} />
                        <Route exact path="/organization/list" component={OrganizationList} />
                        <Route exact path="/organization/create" component={CreateOrganization} />
                        <Route exact path="/project/details" component={Project} />
                        <Route exact path="/project/list" component={ProjectList} />
                        <Route exact path="/project/create" component={CreateProject} />
                        <Route exact path="/team/details" component={Team} />
                        <Route exact path="/team/list" component={TeamList} />
                        <Route exact path="/team/create" component={CreateTeam} />
                        <Route exact path="/comment" component={Comment} />
                        <Route exact path="/company" component={Company} />
                        <Route exact path="/company/list" component={CompanyList} />
                        <Route exact path="/company/create" component={CreateCompany} />
                        <Route exact path="/task/list" component={TaskList} />
                        <Route exact path="/task/create" component={CreateTask} />
                        <Route exact path="/task/details" component={Task} />
                        <Route exact path="/user/profile" component={User} />
                        <Route exact path="/user/create" component={CreateUser} />
                        <Route exact path="/user/list" component={UserList} />
                        <Route component={NotFound} />
                    </Switch>
                </main>
            </BrowserRouter>
        )
    }
}

const AppTranslation = withTranslation('common')(App);

export default AppTranslation;