import React from 'react';
import {Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';

import '../assets/css/register.css';
import '../assets/css/style.css';

class Register extends React.Component {
    resetForm() {
        document.getElementById("register-form").reset();
    }
        
    render() {
        const {t} = this.props;

        return(
            <div className="card">
                <p className="card-title">{t('register.title')}</p><hr className="card-hr" />
                <form className="card-form">
                    <label htmlFor="firstname">{t('register.firstname')}</label>
                    <input type="firstname" className="" id="firstname" />
                    <label htmlFor="lastname">{t('register.lastname')}</label>
                    <input type="lastname" className="" id="lastname" />
                    <label htmlFor="username">{t('register.username')}</label>
                    <input type="username" className="" id="username" />
                    <label htmlFor="email">{t('register.email')}</label>
                    <input type="email" className="" id="email" />
                    <label htmlFor="phone">{t('register.phone')}</label>
                    <input type="phone" className="" id="phone" />
                    <label htmlFor="position">{t('register.position')}</label>
                    <input type="position" className="" id="position" />
                    <label htmlFor="company">{t('register.company')}</label>
                    <input type="company" className="" id="company" />
                    <label htmlFor="password">{t('register.password')}</label>
                    <input type="password" className="" id="password" />
                    <label htmlFor="confirm">{t('register.confirm')}</label>
                    <input type="password" className="" id="confirm" />
                    <div class="card-form-divider">
                        <button type="submit" className="card-form-button">{t('register.submit')}</button>
                        <button type="reset" onClick={this.resetForm} className="card-form-button">{t('register.reset')}</button>
                        <button type="button" className="card-form-button"><Link to="/" className="card-form-button-link">{t('register.cancel')}</Link></button>
                    </div>
                </form>
                <p className="card-form-reminder">{t('register.loginTip')} <Link to="/login">{t('register.loginLink')}</Link></p>
            </div>
        )
    }    
}

const RegisterTranslation = withTranslation('common')(Register);

export default RegisterTranslation;