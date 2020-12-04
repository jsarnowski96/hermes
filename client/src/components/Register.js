import React from 'react';
import {withTranslation} from 'react-i18next';

class Register extends React.Component {
    resetForm() {
        document.getElementById("register-form").reset();
    }
        
    render() {
        const {t} = this.props;

        return(
            <div className="col-12 col-lg-6 mx-auto">
                <hr /><h1 className="text-center">{t('register.title')}</h1><hr />
                <form id="register-form">
                    <div className="form-group">
                        <label for="username">{t('register.username')}</label>
                        <input type="username" className="form-control" id="username" />
                    </div>
                    <div className="form-group">
                        <label for="firstname">{t('register.firstname')}</label>
                        <input type="firstname" className="form-control" id="firstname" />
                    </div>
                    <div className="form-group">
                        <label for="lastname">{t('register.lastname')}</label>
                        <input type="lastname" className="form-control" id="lastname" />
                    </div>
                    <div className="form-group">
                        <label for="email">{t('register.email')}</label>
                        <input type="email" className="form-control" id="email" />
                    </div>
                    <div className="form-group">
                        <label for="phone">{t('register.phone')}</label>
                        <input type="phone" className="form-control" id="phone" />
                    </div>
                    <div className="form-group">
                        <label for="position">{t('register.position')}</label>
                        <input type="position" className="form-control" id="position" />
                    </div>
                    <div className="form-group">
                        <label for="company">{t('register.company')}</label>
                        <input type="company" className="form-control" id="company" />
                    </div>
                    <div className="form-group">
                        <label for="password">{t('register.password')}</label>
                        <input type="password" className="form-control" id="password" />
                    </div>
                    <div className="form-group">
                        <label for="confirm">{t('register.confirm')}</label>
                        <input type="password" className="form-control" id="confirm" />
                    </div>
                    <div className="form-row">
                        <button type="submit" className="btn btn-success mx-auto">{t('register.submit')}</button>
                        <button type="reset" onClick={this.resetForm} className="btn btn-warning mx-auto">{t('register.reset')}</button>
                        <a role="button" className="btn btn-danger mx-auto" href="/">{t('register.cancel')}</a>
                    </div>
                </form>
            </div>
        )
    }    
}

const RegisterTranslation = withTranslation('common')(Register);

export default RegisterTranslation;