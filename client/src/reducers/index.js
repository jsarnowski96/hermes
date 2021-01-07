import {GRANT_ACCESS_TOKEN, SET_LANGUAGE, USER_LOGIN} from '../constants/action-types';

const initialState = {
    user: [],
    refreshToken: '',
    accessToken: '',
    language: ''
}

function rootReducer(state = initialState, action) {
    switch(action.type) {
        case USER_LOGIN:
            return Object.assign({}, state, {
                user: state.user.concat(action.payload)
            })
        case GRANT_ACCESS_TOKEN:
            return Object.assign({}, state, {
                accessToken: state.accessToken.concat(action.payload)
            })
        case SET_LANGUAGE:
            return Object.assign({}, state, {
                language: state.language.concat(action.payload)
            })
        default:
            return state;
    }
}

export default rootReducer;