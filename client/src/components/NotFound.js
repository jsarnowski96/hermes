import React from 'react';
import {withTranslation} from 'react-i18next';

class NotFound extends React.Component {
    render() {
        const {t} = this.props;
        return <h1>404 - {t('commonErrors.notFound')}</h1>
    }    
}

const NotFoundTranslation = withTranslation('common')(NotFound);

export default NotFoundTranslation;

