const bcrypt = require('bcrypt');

const userService = {
    hashPassword: async (password) => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },

    getAstrologerSearchQuery: (name, city) => {
        const regex = new RegExp(name, 'i');
        return city
            ? { firstname: regex, isAstrologer: true, 'geoLocation.city': city }
            : { firstname: regex, isAstrologer: true };
    },

    getUserSearchQuery: (firstname, lastname) => {
        const regexFirstname = new RegExp(firstname, 'i');
        const regexLastname = new RegExp(lastname, 'i');
        return { firstname: regexFirstname, lastname: regexLastname };
    }
};

module.exports = userService;
