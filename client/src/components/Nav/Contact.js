import React from 'react';
import {withTranslation} from 'react-i18next';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class Contact extends React.Component {    
    render() {
        const {t} = this.props;
        return(
            <div className="">
                <hr /><h1 className="">{t('content.contact.title')}</h1><hr />
            </div>
        )
    }
}

const ContactTranslation = withTranslation('common')(Contact);

export default ContactTranslation;