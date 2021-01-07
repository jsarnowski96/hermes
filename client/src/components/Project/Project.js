import React from 'react';

class ProjectItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: {
                refreshToken: '',
                accessToken: '',
                userId: ''
            },
            fields: {},
            errors: {}
        };
    }

    componentDidMount(props) {
        this.setState({
            auth: {
                ...this.state.auth,
                userId: this.props.userId,
                refreshToken: this.props.refreshToken
            }
        })
    }
    
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

