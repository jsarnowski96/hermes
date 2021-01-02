import React from 'react';

class ProjectItem extends React.Component {
    render() {
        return(
            <tr>
                <td>{this.props.first}</td>
                <td>{this.props.second}</td>
            </tr>
        )
    }    
}

export default ProjectItem;

