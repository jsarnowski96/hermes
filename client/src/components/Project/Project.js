import React from 'react';

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: {
                refreshToken: '',
                accessToken: '',
                userId: ''
            },
            projectId: '',
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
            },
            projectId: this.props.projectId
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

export default Project;

