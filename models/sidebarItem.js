const mongoose = require('mongoose');

const sidebarItemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            default: '',
        },
        link: {
            type: String,
            default: '',
        },
        order: {
            type: Number,
            default: 0,
        },
        rolesAllowed: {
            type: [String],
            default: ['user', 'admin', 'superadmin'],
        },
        // parentId is null if it's a top-level menu item
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SidebarItem',
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('SidebarItem', sidebarItemSchema);
