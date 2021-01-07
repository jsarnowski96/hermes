import React from 'react';
import {withTranslation} from 'react-i18next';

import '../../assets/css/dashboard.css';

class Team extends React.Component {
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

const TeamTranslation = withTranslation('common')(Team);

export default TeamTranslation;