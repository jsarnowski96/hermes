import React from 'react';
import {withTranslation} from 'react-i18next';

class Contact extends React.Component {    
    render() {
        const {t} = this.props;
        return(
            <div className="">
                <hr /><h1 className="">{t('contact.title')}</h1><hr />
            </div>
        )
    }
}

const ContactTranslation = withTranslation('common')(Contact);

export default ContactTranslation;