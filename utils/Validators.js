
/**
 * Validates if the provided email has a proper format.
 * @param {string} email - The email string to validate.
 * @returns {boolean} - Returns true if the email is valid, false otherwise.
 */

function isValidEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
}

module.exports = isValidEmail;
