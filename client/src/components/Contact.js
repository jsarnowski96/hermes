import React from 'react';
import {withTranslation} from 'react-i18next';

class Contact extends React.Component {    
    render() {
        const {t} = this.props;
        return(
            <div className="col-12 col-lg-6 mx-auto">
                <hr /><h1 className="text-center">{t('contact.title')}</h1><hr />
            </div>
        )
    }
}

const ContactTranslation = withTranslation('common')(Contact);

export default ContactTranslation;