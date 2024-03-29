import React from 'react';
import {withTranslation} from 'react-i18next';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

class About extends React.Component {    
    render() {
        const {t} = this.props;
        return(
            <div className="">
                <hr /><h1 className="">{t('content.about.title')}</h1><hr />
            </div>
        )
    }
}

const AboutTranslation = withTranslation('common')(About);

export default AboutTranslation;