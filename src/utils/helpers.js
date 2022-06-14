// import DataService from "../services/data-service";
// let ds = new DataService();

export const REGEX_PATTERNS = {
    NUM_KEY: /^[\d ]*$/,
    EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    NAME: /^[a-zA-Z]+$/,
    ZIP: /^[0-9]{5}/,
    PHONE: /^(\d{3})(\d{3})(\d{4})$/
};

export const debounce = (callback, delay = 500) => {
    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => callback(), delay);
}

class HelperFunctions {
    currencyFormat = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}

const Helpers = new HelperFunctions();
export default Helpers;