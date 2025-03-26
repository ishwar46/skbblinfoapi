const SidebarItem = require('../models/sidebarItem');

/**
 * Create a new sidebar item (Admins only)
 * POST /api/sidebar
 * Body: { title, icon, link, order, rolesAllowed, parentId }
 */
exports.createSidebarItem = async (req, res) => {
    try {
        const { title, icon, link, order, rolesAllowed, parentId } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required.' });
        }

        const item = new SidebarItem({
            title,
            icon,
            link,
            order: order || 0,
            rolesAllowed: rolesAllowed || ['user', 'admin', 'superadmin'],
            parentId: parentId || null,
        });
        await item.save();

        return res.status(201).json({
            message: 'Sidebar item created.',
            item,
        });
    } catch (error) {
        console.error('createSidebarItem Error:', error);
        return res.status(500).json({ error: 'Server error creating sidebar item.' });
    }
};

/**
 * Update a sidebar item (Admins only)
 * PATCH /api/sidebar/:id
 */
exports.updateSidebarItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, icon, link, order, rolesAllowed, parentId } = req.body;

        const item = await SidebarItem.findById(id);
        if (!item) {
            return res.status(404).json({ error: 'Sidebar item not found.' });
        }

        if (title !== undefined) item.title = title;
        if (icon !== undefined) item.icon = icon;
        if (link !== undefined) item.link = link;
        if (order !== undefined) item.order = order;
        if (rolesAllowed !== undefined) item.rolesAllowed = rolesAllowed;
        if (parentId !== undefined) item.parentId = parentId;

        await item.save();

        return res.status(200).json({
            message: 'Sidebar item updated.',
            item,
        });
    } catch (error) {
        console.error('updateSidebarItem Error:', error);
        return res.status(500).json({ error: 'Server error updating sidebar item.' });
    }
};

/**
 * Delete a sidebar item (Admins only)
 * DELETE /api/sidebar/:id
 *
 * Optionally, you could also delete all children
 * if you want a cascading delete. 
 */
exports.deleteSidebarItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await SidebarItem.findByIdAndDelete(id);
        if (!item) {
            return res.status(404).json({ error: 'Sidebar item not found or already deleted.' });
        }

        // If you want to also remove sub-items:
        // await SidebarItem.deleteMany({ parentId: id });

        return res.status(200).json({ message: 'Sidebar item deleted.' });
    } catch (error) {
        console.error('deleteSidebarItem Error:', error);
        return res.status(500).json({ error: 'Server error deleting sidebar item.' });
    }
};

/**
 * Get a nested sidebar tree for the logged-in user
 * GET /api/sidebar
 *
 * We filter items by rolesAllowed, then build a tree structure.
 * The user role is assumed from req.user or a query param.
 */

exports.getSidebarTree = async (req, res) => {
    try {
        
        const role = req.user?.role || 'user';

        // Grab all items that contain this role in rolesAllowed
        const allItems = await SidebarItem.find({
            rolesAllowed: { $in: [role] },
        }).sort({ order: 1 });

        //console.log('Role used:', role);
        ///console.log('allItems =', JSON.stringify(allItems, null, 2));

        // a map (dictionary) for quick lookup
        const itemsById = {};
        allItems.forEach((item) => {
            itemsById[item._id] = {
                _id: item._id,
                title: item.title,
                icon: item.icon,
                link: item.link,
                order: item.order,
                parentId: item.parentId,
                rolesAllowed: item.rolesAllowed,
                children: [],
            };
        });

        // Attach children to their parent
        const rootItems = [];
        console.log('rootItems = ', JSON.stringify(rootItems, null, 2));

        allItems.forEach((item) => {
            const current = itemsById[item._id];
            if (!item.parentId) {
                // top-level
                rootItems.push(current);
            } else {
                // push into parent's children array
                if (itemsById[item.parentId]) {
                    itemsById[item.parentId].children.push(current);
                }
            }
        });

        return res.status(200).json(rootItems);
    } catch (error) {
        console.error('getSidebarTree Error:', error);
        return res.status(500).json({ error: 'Server error getting sidebar tree.' });
    }
};
