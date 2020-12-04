import React from 'react';
import {Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';

import '../assets/css/vertical-navbar.css';

class Navbar extends React.Component {
    render() {
        const {t, i18n} = this.props;

        return(
            <div className="vertical-navbar navbar-expand-lg navbar-expand-md bg-dark col-xs-2 col-sm-2 col-md-2 col-lg-1 col-xl-1 col-12">
                <Link to="/" className="navbar-brand text-center border-bottom mb-2">Hermes</Link>
                <button className="navbar-toggler navbar-dark align-content-center btn-block d-lg-none mt-3 mb-3" type="button" data-toggle="collapse" data-target="#collapseMenu" aria-controls="collapseMenu" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div classname="collapse navbar-collapse" id="collapseMenu">
                    <ul className="nav flex-column text-center">
                        <li className="navbar-item">
                            <Link to="/" className="navbar-link">{t('navbar.home')}</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/login" className="navbar-link">{t('navbar.login')}</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/register" className="navbar-link">{t('navbar.register')}</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/about" className="navbar-link">{t('navbar.about')}</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/contact" className="navbar-link">{t('navbar.contact')}</Link>
                        </li>
                    </ul>
                    <div className="mt-3 mb-3 border-top flex-column">
                        <button className="btn btn-outline-light btn-block mt-3" onClick={() => i18n.changeLanguage('pl')}>pl</button>
                        <button className="btn btn-outline-danger btn-block" onClick={() => i18n.changeLanguage('en')}>en</button>
                    </div>
                </div>
            </div>
        )
    }
}

const NavbarTranslation = withTranslation('common')(Navbar);

export default NavbarTranslation;