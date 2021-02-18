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
import RecentActivity from './Dashboard/RecentActivity';
import UserActions from './Dashboard/UserActions';

import Project from './Project/Project';
import Task from './Task/TaskList';
import Comment from './Comment/Comment';
import Company from './Company/Company';
import Team from './Team/Team';
import Repository from './Repository/Repository';
import Role from './Role/Role';

import ProjectList from './Project/ProjectList';
import TeamList from './Team/TeamList';
import CommentList from './Comment/CommentList';
import CompanyList from './Company/CompanyList';
import UserList from './User/UserList';
import RepositoryList from './Repository/RepositoryList';
import TaskList from './Task/TaskList';
import RoleList from './Role/RoleList';

import CreateProject from './Project/CreateProject';
import CreateTask from './Task/CreateTask';
import CreateComment from './Comment/CreateComment';
import CreateCompany from './Company/CreateCompany';
import CreateTeam from './Team/CreateTeam';
import CreateRepository from './Repository/CreateRepository';
import CreateRole from './Role/CreateRole';

import EditProject from './Project/EditProject';
import EditTask from './Task/EditTask';
import EditComment from './Comment/EditComment';
import EditCompany from './Company/EditCompany';
import EditTeam from './Team/EditTeam';
import EditRepository from './Repository/EditRepository';
import EditRole from './Role/EditRole';

import NotFound from './NotFound';

import getLanguageFromLocalStorage from '../middleware/languageLocalStorage';

import '../assets/css/style.css';

class App extends React.Component {    
    constructor(props) {
        super(props);
        const {i18n} = this.props;
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
                        <Route path="/recent" component={RecentActivity} />
                        <Route path="/userActions" component={UserActions} />
                        <Route exact path="/project" component={Project} />
                        <Route path="/project/list" component={ProjectList} />
                        <Route path="/project/create" component={CreateProject} />
                        <Route path="/project/edit" component={EditProject} />
                        <Route exact path="/team" component={Team} />
                        <Route path="/team/list" component={TeamList} />
                        <Route path="/team/create" component={CreateTeam} />
                        <Route path="/team/edit" component={EditTeam} />
                        <Route exact path="/repository" component={Repository} />
                        <Route path="/repository/list" component={RepositoryList} />
                        <Route path="/repository/create" component={CreateRepository} />
                        <Route path="/repository/edit" component={EditRepository} />
                        <Route exact path="/comment" component={Comment} />
                        <Route path="/comment/list" component={CommentList} />
                        <Route path="/comment/create" component={CreateComment} />
                        <Route path="/comment/edit" component={EditComment} />
                        <Route exact path="/role" component={Role} />
                        <Route path="/role/list" component={RoleList} />
                        <Route path="/role/create" component={CreateRole} />
                        <Route path="/role/edit" component={EditRole} />
                        <Route exact path="/company" component={Company} />
                        <Route path="/company/list" component={CompanyList} />
                        <Route path="/company/create" component={CreateCompany} />
                        <Route path="/company/edit" component={EditCompany} />
                        <Route component={NotFound} />
                    </Switch>
                </main>
            </BrowserRouter>
        )
    }
}

const AppTranslation = withTranslation('common')(App);

export default AppTranslation;