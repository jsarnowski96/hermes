import React from 'react';
import {withTranslation} from 'react-i18next';

class About extends React.Component {    
    constructor(props) {
        super(props);
        this.state = {
            auth: {
                refreshToken: '',
                accessToken: '',
                userId: ''
            }
        };
    }

    render() {
        const {t} = this.props;
        return(
            <div className="">
                <hr /><h1 className="">{t('about.title')}</h1><hr />
            </div>
        )
    }
}

const AboutTranslation = withTranslation('common')(About);

export default AboutTranslation;