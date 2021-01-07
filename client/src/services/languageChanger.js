export function getLanguageFromLocalStorage() {
    if(localStorage.getItem('language') !== null || localStorage.getItem('language') !== '' || localStorage.getItem('language') !== 'undefined') {
        if(localStorage.getItem('language') === 'pl') {
            return 'pl';
        } else if(localStorage.getItem('language') === 'en') {
            return 'en';
        }
    }
}

export default getLanguageFromLocalStorage;