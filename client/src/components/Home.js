import React from 'react';
import {withTranslation} from 'react-i18next';

class Home extends React.Component {
    render() {
        const {t} = this.props;
        return(
            <div className="col-6 mx-auto">
                <hr /><h1 className="text-center">{t('home.title')}</h1><hr />
            </div>
        )
    }    
}

const HomeTranslation = withTranslation('common')(Home);

export default HomeTranslation;

// TODO : FIX OVERLAPPING WITH NAVBAR