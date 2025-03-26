const { title } = require('process');
const { link } = require('fs');
const MenuItem = require('../models/menuItem');

/**
 * Create a new menu item (Admins only)
 * POST /api/menu-items
 * Body: { title, link, order, rolesAllowed }
 */

exports.createMenuItem = async (req, res) => {
    try {
        const { title, link, order, rolesAllowed } = req.body;

        // Basic validation
        if (!title || !link) {
            return res.status(400).json({ error: 'Title and link are required.' });
        }

        const menuItem = new MenuItem({
            title,
            link,
            order: order || 0,
            rolesAllowed: rolesAllowed || ['user', 'admin', 'superadmin'],
        });
        await menuItem.save();

        return res.status(201).json({ message: 'Menu item created.', menuItem });
    } catch (error) {
        console.error('createMenuItem Error:', error);
        return res.status(500).json({ error: 'Server error creating menu item.' });
    }
};

/**
 * ! Update a menu item (Admins only)
 * ! PATCH /api/menu-items/:id
 */

exports.updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, link, order, rolesAllowed } = req.body;

        // Check if at least one field is provided for update
        if (
            title === undefined &&
            link === undefined &&
            order === undefined &&
            rolesAllowed === undefined
        ) {
            return res.status(400).json({ error: 'No fields provided for update.' });
        }

        // Find the menu item by id
        const menuItem = await MenuItem.findById(id);
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found.' });
        }

        // Update fields if provided
        if (title !== undefined) menuItem.title = title;
        if (link !== undefined) menuItem.link = link;
        if (order !== undefined) menuItem.order = order;
        if (rolesAllowed !== undefined) menuItem.rolesAllowed = rolesAllowed;

        // Save the updated menu item
        await menuItem.save();

        return res.status(200).json({ message: 'Menu item updated.', menuItem });
    } catch (error) {
        console.error('updateMenuItem Error:', error);
        return res.status(500).json({ error: 'Server error updating menu item.' });
    }
};


/**
 * Delete a menu item (Admins only)
 * DELETE /api/menu-items/:id
 */

exports.deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const menuItem = await MenuItem.findByIdAndDelete(id);
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found or already deleted.' });
        }
        return res.status(200).json({ message: 'Menu item deleted.' });
    } catch (error) {
        console.error('deleteMenuItem Error', error);
        return res.status(500).json({ error: 'Server error deleting menu item' });
    }
};

/**
 * Get all menu items (Public or Authenticated)
 * GET /api/menu-items
 * Query param example: ?role=user to filter for a certain role
 */
exports.getMenuItems = async (req, res) => {
    try {
        const { role } = req.query;
        let filter = {};

        // If a role is provided, filter menu items by this role
        if (role) {
            filter.rolesAllowed = role;
        }

        // Fetch menu items from the database and sort by the 'order' field
        const items = await MenuItem.find(filter).sort({ order: 1 });

        // Check if no menu items are found
        if (!items.length) {
            return res.status(200).json({ message: 'No menu items available.' });
        }

        // Return the found menu items
        return res.status(200).json(items);
    } catch (error) {
        console.error('getMenuItems Error:', error);
        return res.status(500).json({ error: 'Server error fetching menu items.' });
    }
};
