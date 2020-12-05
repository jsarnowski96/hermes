import React from 'react';

import Projects from './Projects';
import Team from './Team';
import Tasks from './Tasks';

import '../assets/css/style.css';
import '../assets/css/dashboard.css';

class Dashboard extends React.Component {    
    render() {
        return(
            <div className="dashboard">
                <div className="tab projects">
                    <p className="tab-title">Projects</p>
                    <Projects />
                </div>
                <div className="tab team">
                <p className="tab-title">Team overview</p>
                <Team />
                </div>
                <div className="tab tasks">
                    <p className="tab-title">Tasks</p>
                    <Tasks />
                </div>
            </div>
        )
    }
}

export default Dashboard;