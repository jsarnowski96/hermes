import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router-dom';

import {getJwtDataFromSessionStorage, setJwtDataInSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/home.css';
import '../../assets/css/style.css';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                authenticated: true,
                redirected: false,
                serverResponse: {
                    origin: null,
                    content: null
                },
                fields: {},
                errors: {}
            }
        } else {
            this.state = {
                authenticated: false,
                redirected: false,
                serverResponse: {
                    origin: null,
                    content: null
                },
                fields: {},
                errors: {}
            }
        }
    }

    render() {
        const {t} = this.props;

        if(this.state.authenticated === true && this.jwt !== null) {
            return(
                <Redirect to=
                   {{ 
                        pathname: '/dashboard'
                   }} 
                />
            )
        } else {
            return(
                <section>
                    <hr /><h1 className="title">{t('content.home.title')}</h1><hr />
                    <div className="home">
                        <a href={process.env.PUBLIC_URL + '/images/dashboard.PNG'}><img className="image" src={process.env.PUBLIC_URL + '/images/dashboard.PNG'} alt=""/></a>
                        <a href={process.env.PUBLIC_URL + '/images/createProject.PNG'}><img className="image" src={process.env.PUBLIC_URL + '/images/createProject.PNG'} alt="" /></a>
                        <a href={process.env.PUBLIC_URL + '/images/createTeam.PNG'}><img className="image" src={process.env.PUBLIC_URL + '/images/createTeam.PNG'} alt="" /></a>
                        <a href={process.env.PUBLIC_URL + '/images/createTask.PNG'}><img className="image" src={process.env.PUBLIC_URL + '/images/createTask.PNG'} alt="" /></a>
                    </div>
                </section>
            )
        }    
        }
}

const HomeTranslation = withTranslation('common')(Home);

export default HomeTranslation;