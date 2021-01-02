import React from 'react';
import {withTranslation} from 'react-i18next';

import ProjectItem from '../Project/Project';

import '../../assets/css/dashboard.css';

class ProjectList extends React.Component {
    state = { first: ['A', 'B', 'C', 'D'], second: ['1', '2', '3', '4']};

    render() {
        let items = [];
        this.state.first.forEach(first => {
            this.state.second.forEach(second => {
                items.push(<ProjectItem first={first} second={second} />)
            });
        });
        const {t} = this.props;
        return(
            <table class="tab-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </table>
        )
    }    
}

const ProjectListTranslation = withTranslation('common')(ProjectList);

export default ProjectListTranslation;