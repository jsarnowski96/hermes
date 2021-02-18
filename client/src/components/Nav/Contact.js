import React from 'react';
import {withTranslation} from 'react-i18next';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class Contact extends React.Component {    
    constructor(props) {
        super(props);

        var jwt = getJwtDataFromSessionStorage();

        if(jwt != null) {
            this.state = {
                auth: {
                    userId: jwt.userId,
                    refreshToken: jwt.refreshToken
                }
            }
        } else {
            this.state = {
                auth: {
                    userId: null,
                    refreshToken: null
                }
            }
        }
    }

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