import React from 'react';
import {withTranslation} from 'react-i18next';

import getJwtDataFromSessionStorage from '../../middleware/jwtSessionStorage';

import '../../assets/css/dashboard.css';

class Tasks extends React.Component {
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
    }    
}

const TasksTranslation = withTranslation('common')(Tasks);

export default TasksTranslation;