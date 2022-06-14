import States from '../../data/States';
import { REGEX_PATTERNS } from '../../utils/helpers';

export const STATE_OPTIONS = () => {
    let options = ['Select'];
    States.map(state => options.push(state.abbreviation));
    return options;
}

export const validateShippingForm = e => {
    const { name, value } = e.target;
    let error = '';
    switch(name) {
        case 'title':
            if(!value || value.length < 2) error = 'Please enter an Address Title';
            break;
        case 'f_name':
            if (!value || value < 2) error = 'Please enter your First Name';
            if (!REGEX_PATTERNS.NAME.test(value)) error = 'Please enter a valid First Name';
            break;
        case 'l_name':
            if (!value || value < 2) error = 'Please enter your Surname';
            if (!REGEX_PATTERNS.NAME.test(value)) error = 'Please enter a valid Surname';
            break;
        case 'street':
            if (!value || value < 5) error = 'Please enter your Street Address';
            break;
        case 'zip':
            if (!value || value < 5) error = 'Required';
            if (!REGEX_PATTERNS.ZIP.test(value)) error = 'Not valid';
            break;
        case 'city':
            if (!value || value.length < 3) error = 'Required';
            break;
        case 'state':
            if (!value || value === 'Select') error = 'Required';
            break;
        case 'cell':
            if (!value || value.length !== 14) error = 'Please enter a valid Cell Phone';
            break;
        case 'tel':
            if (!value || value.length !== 14) error = 'Please enter a valid Telephone';
            break;
        default: break;
    }
    return error;
}

export const formatPhoneNumber = number => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(REGEX_PATTERNS.PHONE);
    if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
    return number;
}