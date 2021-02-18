import React from 'react';
import {withTranslation} from 'react-i18next';

import {getJwtDataFromSessionStorage} from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class UserActions extends React.Component {
    constructor(props) {
        super(props);
        var jwt = getJwtDataFromSessionStorage();

        if(jwt !== null) {
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
        const{t} = this.props;

        if((this.state.auth.userId !== '' && this.state.auth.userId !== undefined && this.state.auth.userId !== null) && (this.state.auth.refreshToken !== '' && this.state.auth.refreshToken !== undefined && this.state.auth.refreshToken !== null)) {
            return(
                <table class="tab-table">
                    <thead>
                        <tr>
                            <th>{t('content.userActions.tableHeaders.name')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Dom</td>
                            <td>6000</td>
                        </tr>
                        <tr class="active-row">
                            <td>Melissa</td>
                            <td>5150</td>
                        </tr>
                        <tr>
                            <td>Dom</td>
                            <td>6000</td>
                        </tr>
                        <tr class="active-row">
                            <td>Melissa</td>
                            <td>5150</td>
                        </tr>
                        <tr>
                            <td>Dom</td>
                            <td>6000</td>
                        </tr>
                        <tr class="active-row">
                            <td>Melissa</td>
                            <td>5150</td>
                        </tr>
                        <tr>
                            <td>Dom</td>
                            <td>6000</td>
                        </tr>
                        <tr class="active-row">
                            <td>Melissa</td>
                            <td>5150</td>
                        </tr>
                        <tr>
                            <td>Dom</td>
                            <td>6000</td>
                        </tr>
                        <tr class="active-row">
                            <td>Melissa</td>
                            <td>5150</td>
                        </tr>
                    </tbody>
                </table>
            )
        } else {
            return <h2>Unauthorized</h2>
        }
    }    
}

const UserActionsTranslation = withTranslation('common')(UserActions);

export default UserActionsTranslation;