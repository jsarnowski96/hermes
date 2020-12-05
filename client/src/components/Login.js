import React from 'react';
import {Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';

class Login extends React.Component {
    render() {
        const {t} = this.props;
        return(
            <div className="card">
                <p className="card-title">{t('login.title')}</p><hr className="card-hr" />
                <form className="card-form">
                    <label htmlFor="email">{t('login.email')}</label>
                    <input type="email" className="" id="email" />
                    <label htmlFor="password">{t('login.password')}</label>
                    <input type="password" className="" id="password" />
                    <div class="card-form-divider">
                        <button type="submit" className="card-form-button">{t('login.submit')}</button>
                        <button type="button" className="card-form-button"><Link to="/" className="card-form-button-link">{t('login.cancel')}</Link></button>
                    </div>
                </form>
                <p className="card-form-reminder">{t('login.registerTip')} <Link to="/register">{t('login.registerLink')}</Link></p>
            </div>
        )
    }    
}

const LoginTranslation = withTranslation('common')(Login);

export default LoginTranslation;