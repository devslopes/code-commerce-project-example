import { REGEX_PATTERNS } from '../../utils/helpers';

export const validateUserSignup = inputs => {
    const { email, password, confirmPassword, f_name, l_name, zip } = inputs;
    let errors = {};
    if (!REGEX_PATTERNS.EMAIL.test(email)) {
        errors = { ...errors, email: 'Valid E-Mail Required' }
    };
    if (!REGEX_PATTERNS.PASSWORD.test(password)) {
        errors = { ...errors, password: 'Invalid Password' }
    };
    if (password !== confirmPassword) {
        errors = { ...errors, confirmPassword: 'Passwords Do Not Match' }
    };
    if (!REGEX_PATTERNS.NAME.test(f_name)) {
        errors = { ...errors, f_name: 'Enter a Valid First Name' }
    };
    if (!REGEX_PATTERNS.NAME.test(l_name)) {
        errors = { ...errors, l_name: 'Enter a Valid Surname' }
    };
    if (zip.length) if(!REGEX_PATTERNS.ZIP.test(zip)) {
        errors = { ...errors, zip: 'Enter a valid Zip Code' }
    };
    return errors;
};

export const validateUserLogin = inputs => {
    const { email, password } = inputs;
    let errors = {};
    if(!REGEX_PATTERNS.EMAIL.test(email)) {
        errors = { ...errors, email: 'Valid E-Mail required'}
    };
    if(!password.length || password.length < 1) {
        errors = { ...errors, password: 'Please enter your Password'}
    };
    return errors;
}