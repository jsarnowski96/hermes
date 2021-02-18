import React from 'react';
import {Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faCoffee, faHome, faPaperPlane, faInfoCircle, faUserPlus, faFingerprint, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';

import '../../assets/css/sidebar.css';

import getJwtDataFromSessionStorage from '../../middleware/jwtSessionStorage';

library.add(faCheckSquare, faCoffee, faHome, faPaperPlane, faInfoCircle, faUserPlus, faFingerprint, faSignOutAlt);

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.jwt = getJwtDataFromSessionStorage();
        this.state ={
            renderLogoutBtn: sessionStorage.getItem('renderLogoutBtn')
        }

        this.onLanguageChange = this.onLanguageChange.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    componentDidMount() {
        if(this.jwt !== null && this.jwt !== undefined) {
            if(sessionStorage.getItem('renderLogoutBtn') === false) {
                sessionStorage.setItem('renderLogoutBtn', true);
            }
        } else {
            if(sessionStorage.getItem('renderLogoutBtn') === true) {
                sessionStorage.setItem('renderLogoutBtn', false);
            }
        }

        this.setState({ renderLogoutBtn: sessionStorage.getItem('renderLogoutBtn')})
        this.forceUpdate();
    }

    onLanguageChange(event) {
        const {i18n} = this.props;
        if(event.target.name === 'pl') {
            localStorage.setItem('language', 'pl');
            i18n.changeLanguage('pl');
        } else if(event.target.name === 'en') {
            localStorage.setItem('language', 'en');
            i18n.changeLanguage('en');
        }
    }

    onLogout() {
        if(this.jwt !== null && this.jwt !== undefined && this.jwt !== '') {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.jwt.refreshToken}`
            };
    
            axios.post('http://localhost:3300/auth/logout', 
            {},
            {
                withCredentials: true,
                headers: headers
            })

            sessionStorage.setItem('renderLogoutBtn', false);
            sessionStorage.removeItem('jwt');
        }        
    }

    renderBtn() {
        const {t} = this.props;
        var btn = <li className="nav-item"><Link to="/" className="nav-link"><FontAwesomeIcon icon="sign-out-alt" size="lg" /><span className="link-text" onClick={this.onLogout}>{t('content.navbar.logout')}</span></Link></li>
        if(this.state.renderLogoutBtn === true) {
            return btn
        } else {
            return null
        }
    }

    render() {
        const {t} = this.props;

        return(
            <nav className="navbar">
                <ul className="navbar-nav">
                    <Link to="/" className="navbar-title">Hermes</Link><hr className="navbar-title-hr" />
                    <li className="nav-item"><Link to="/" className="nav-link"><FontAwesomeIcon icon="home" size="lg" /><span className="link-text">{t('content.navbar.home')}</span></Link></li>
                    <li className="nav-item"><Link to="/login" className="nav-link"><FontAwesomeIcon icon="fingerprint" size="lg" /><span className="link-text">{t('content.navbar.login')}</span></Link></li>
                    <li className="nav-item"><Link to="/register" className="nav-link"><FontAwesomeIcon icon="user-plus" size="lg" /><span className="link-text">{t('content.navbar.register')}</span></Link></li>
                    <li className="nav-item"><Link to="/about" className="nav-link"><FontAwesomeIcon icon="info-circle" size="lg" /><span className="link-text">{t('content.navbar.about')}</span></Link></li>
                    <li className="nav-item"><Link to="/contact" className="nav-link"><FontAwesomeIcon icon="paper-plane" size="lg" /><span className="link-text">{t('content.navbar.contact')}</span></Link></li>
                    {this.renderBtn()}
                    <li className="nav-item lng-change">
                        <button type="button" name='pl' style={{backgroundColor: "white"}} className="lng-button" onClick={this.onLanguageChange}>PL</button>
                        <button type="button" name='en' style={{backgroundColor: "red"}} className="lng-button" onClick={this.onLanguageChange}>EN</button>
                    </li>
                </ul>
            </nav>
        )
    }
}

const SidebarTranslation = withTranslation('common')(Sidebar);

export default SidebarTranslation;