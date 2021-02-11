import React from 'react';
import {withTranslation} from 'react-i18next';

import Login from '../Nav/Login';

import getJwtDataFromSessionStorage from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class Activities extends React.Component {
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
        const {t, i18n} = this.props;

        if((this.state.auth.userId !== '' && this.state.auth.userId !== 'undefined' && this.state.auth.userId !== null) && (this.state.auth.refreshToken !== '' && this.state.auth.refreshToken !== 'undefined' && this.state.auth.refreshToken !== null)) {
            return(
                <table class="tab-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Points</th>
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
            return <Login />
        }
    }    
}

const ActivitiesTranslation = withTranslation('common')(Activities);

export default ActivitiesTranslation;