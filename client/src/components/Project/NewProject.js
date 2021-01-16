import React from 'react';
import {withTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import axios from 'axios';

import '../../assets/css/register.css';
import '../../assets/css/style.css';
import '../../assets/css/errors.css';

class NewProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: {
                refreshToken: '',
                accessToken: '',
                userId: '',
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

    onChange(field, event) {
        let fields = this.state.fields;
        let errors = this.state.errors;
        fields[field] = event.target.value;       
        errors[field] = '';
        this.setState({fields});
    }

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const {t} = this.props;
        const fields = this.state.fields;

        axios.post('http://localhost:3300/project/create', {
            name: fields['name'],
            category: fields['category'],
            requirements: fields['requirements'],
            userId: this.state.auth.userId,
            due_date: fields['due_date']
        }).then((response) => {
            if(response) {
                console.log(response.data);
            } else {
                console.log('Could not retrieve response data');
            }
        })
        .catch(error => {
            console.log(error);
        }) 
    }

    render() {
        const {t} = this.props;
        return(
            <div className="card">
                <p className="card-title">Create new project</p><hr className="card-hr" />
                <form className="card-form" onSubmit={this.onFormSubmit}>
                    <label htmlFor="name">Project name</label>
                    <input onChange={this.onChange.bind(this, 'name')} value={this.state.fields['name']} type="name" className="" name="name" />
                    <span className="error-msg-span">{this.state.errors["name"]}</span>
                    <label htmlFor="category">Category</label>
                    <select onChange={this.onChange.bind(this, 'category')} value={this.state.fields['category']} type="category" className="" name="category">
                        <option value="Software Development" default>Software Development</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Databases">Databases</option>
                        <option value="R&D">R&D</option>
                    </select>
                    <span className="error-msg-span">{this.state.errors["category"]}</span>
                    <label htmlFor="requirements">Requirements</label>
                    <textarea onChange={this.onChange.bind(this, 'requirements')} value={this.state.fields['requirements']} type="requirements" className="" name="requirements" />
                    <span className="error-msg-span">{this.state.errors["requirements"]}</span>
                    <label htmlFor="due_date">Due date</label>
                    <input onChange={this.onChange.bind(this, 'due_date')} value={this.state.fields['due_date']} type="date" className="" name="due_date"
                        min="2021-02-01" max="2022-12-31" />
                    <span className="error-msg-span">{this.state.errors["due_date"]}</span>
                    <div class="card-form-divider">
                        <button type="submit" className="card-form-button">Create</button>
                        <button type="reset" className="card-form-button" >Reset</button>
                        <button type="button" className="card-form-button"><Link to="/dashboard" className="card-form-button-link">Cancel</Link></button>
                    </div>
                    <span className="error-msg-span" id="serverErrorMsg"></span>
                </form>
            </div>
        )
    }
}

export default NewProject;