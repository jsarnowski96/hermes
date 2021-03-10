export function getJwtDataFromSessionStorage() {
    if(sessionStorage.getItem('jwt') !== null && sessionStorage.getItem('jwt') !== '' && sessionStorage.getItem('jwt') !== undefined) {
        var jwt = JSON.parse(sessionStorage.getItem('jwt'));
        return jwt;
    } else {
        return null;
    }
}

export function setJwtDataInSessionStorage(userId, refreshToken) {
    if(sessionStorage.getItem('jwt') === null || sessionStorage.getItem('jwt') === '' || sessionStorage.getItem('jwt') === undefined) {
        if(userId !== null && userId !== '' && userId !== undefined && refreshToken !== null && refreshToken !== '' && refreshToken !== undefined) {
            var jwt = {
                userId: userId,
                refreshToken: refreshToken
            }
            sessionStorage.setItem('jwt', JSON.stringify(jwt));
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export function removeJwtDataFromSessionStorage() {
    if(sessionStorage.getItem('jwt') !== null && sessionStorage.getItem('jwt') !== '' && sessionStorage.getItem('jwt') !== undefined) {
        sessionStorage.removeItem('jwt');
        return true;
    } else {
        return false;
    }
}

export default getJwtDataFromSessionStorage;