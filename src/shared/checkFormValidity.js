export const checkFormValidity = ( value, rules ) => {
    let valid = true;

    if (rules.isRequired) {
        valid = value.trim() !== "" && valid;
    }

    if (rules.minLength) {
        valid = value.length >= rules.minLength && valid;
    }

    if (rules.maxLength) {
        valid = value.length <= rules.maxLength && valid;
    }

    return valid;
};