import React from 'react';
import {withTranslation} from 'react-i18next';

class Login extends React.Component {
    render() {
        const {t} = this.props;
        return(
            <div className="col-12 col-lg-6 mx-auto">
                <hr /><h1 className="text-center">{t('login.title')}</h1><hr />
                <form id="register-form">
                    <div className="form-group">
                        <label for="email">{t('login.email')}</label>
                        <input type="email" className="form-control" id="email" />
                    </div>
                    <div className="form-group">
                        <label for="password">{t('login.password')}</label>
                        <input type="password" className="form-control" id="password" />
                    </div>
                    <div className="form-row">
                        <button type="submit" className="btn btn-success mx-auto">{t('login.submit')}</button>
                        <a role="button" className="btn btn-danger mx-auto" href="/">{t('register.cancel')}</a>
                    </div>
                </form>
            </div>
        )
    }    
}

const LoginTranslation = withTranslation('common')(Login);

export default LoginTranslation;