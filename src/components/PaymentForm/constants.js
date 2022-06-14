import AMEX from '../../assets/amex.png';
import DISCOVER from '../../assets/discover.png';
import MASTER_CARD from '../../assets/masterCard.png';
import VISA from '../../assets/visa.png';

export const CARD_ICONS = {
   AMEX: AMEX,
   DISCOVER: DISCOVER,
   MASTERCARD: MASTER_CARD,
   VISA: VISA
};

const CARD_REGEX = {
    AMEX: /^3[47][0-9]{13}$/,
    DISCOVER: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
    MASTERCARD: /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
    VISA: /^4[0-9]{12}(?:[0-9]{3})?$/
}

export const MONTH_OPTIONS = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
];

export const YEAR_OPTIONS = () => {
    let years = [];
    let currentYear = new Date().getFullYear();
    for (let y = 0; y < 6; y++) years.push(currentYear + y);
    return years;
}

export const formatCardNumber = number => {
    const cleanedNumber = ('' + number).replace(/\D/g, '');
    const cardPrefixes = ['4', '51', '52', '53', '54', '55', '65', '6011'];
    if (!number) return { mask: '', error: 'Enter your Card Number' };
    if (cleanedNumber.startsWith('34') || cleanedNumber.startsWith('37')) {
        return {
            mask: cleanedNumber.replace(/\b(\d{4})(\d{6})(\d{5})\b/, '$1 $2 $3'),
            max: 17, cvv: 4
        }
    }
    for (let i = 0; i < cardPrefixes.length; i++) {
        if (cleanedNumber.startsWith(cardPrefixes[i])) {
            return {
                mask: cleanedNumber.match(new RegExp('.{1,4}', 'g')).join(' '),
                max: 19, cvv: 3
            }
        }
    }
    return {
        mask: cleanedNumber,
        error: 'Invalid Card Number'
    }
};

export const getCardType = number => {
    if (!number) return { cardType: '', icon: '' };
    const cleanedNumber = ('' + number).replace(/\D/g, '');
    for (const card in CARD_REGEX) {
        if (cleanedNumber.match(CARD_REGEX[card])) {
            return { cardType: card, icon: CARD_ICONS[card] }
        }
    }
};

export const checkExpDate = (month, year) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const compareDate = new Date(currentYear, currentMonth, 1);
    const expMonth = MONTH_OPTIONS.findIndex(option => option === month);
    const expDate = new Date(year, expMonth, 1);
    if(expDate < compareDate) return 'Invalid Date';
    return null;
}

export const validatePaymentForm = (e, cvvLength) => {
    const { name, value } = e.target;
    let error = '';
    switch(name) {
        case 'name': 
            if (!value || value.length < 2) error = 'Enter Cardholder\'s Name'
            break;
        case 'expMonth':
            if (!value || value === 'Month') error = 'Required';
            break;
        case 'expYear':
            if (!value || value === 'Year') error = 'Required';
            break;
        case 'cvv': {
            if (!value) error = 'Required';
            if (value && value.length < cvvLength) error = 'Not Valid';
            break;
        }
        default: break;
    }
    return error;
}