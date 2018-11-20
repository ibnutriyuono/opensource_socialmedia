const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateProfileInput(data) {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if (!Validator.isLength(data.handle, {
            min: 2,
            max: 40
        })) {
        errors.handle = "Handle need to between 2 and 40 chars"
    }

    if (Validator.isEmpty(data.handle)) {
        errors.handle = "Profile handle is required"
    }

    if (Validator.isEmpty(data.status)) {
        errors.handle = "Status handle is required"
    }

    if (Validator.isEmpty(data.skills)) {
        errors.handle = "Skills handle is required"
    }

    if (!iSEmpty(data.website)) {
        if (!Validator.isURL(data.website)) {
            errors.website = "Not a valid URL"
        }
    }

    if (!iSEmpty(data.youtube)) {
        if (!Validator.isURL(data.youtube)) {
            errors.website = "Not a valid URL"
        }
    }

    if (!iSEmpty(data.facebook)) {
        if (!Validator.isURL(data.facebook)) {
            errors.website = "Not a valid URL"
        }
    }

    if (!iSEmpty(data.linkedin)) {
        if (!Validator.isURL(data.linkedin)) {
            errors.website = "Not a valid URL"
        }
    }

    if (!iSEmpty(data.instagram)) {
        if (!Validator.isURL(data.instagram)) {
            errors.website = "Not a valid URL"
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};