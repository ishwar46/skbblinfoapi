const { timeStamp } = require('console');
const mongoose = require('mongoose');
const { title } = require('process');

const MenuItemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true
        },
        // for sorting items in the navbar
        order: {
            type: Number,
            default: 0,
        },

        rolesAllowed: {
            type: [String],
            default: ['user', 'admin', 'superadmin']
        },

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('MenuItem', MenuItemSchema)