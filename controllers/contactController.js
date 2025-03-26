const ContactPage = require('../models/contactPage');
const ContactQuery = require('../models/contactQuery');

/**
 * GET /api/contact/page
 * Public endpoint to retrieve static contact page information.
 */
exports.getContactPage = async (req, res) => {
    try {
        let page = await ContactPage.findOne();
        if (!page) {
            page = new ContactPage();
            await page.save();
        }
        return res.status(200).json(page);
    } catch (error) {
        console.error('getContactPage Error:', error);
        return res.status(500).json({ error: 'Server error fetching contact page.' });
    }
};

/**
 * PUT /api/contact/page
 * Admin-only endpoint to update static contact page details.
 * Expected body: { pageTitle, contactEmail, phone, address }
 */
exports.updateContactPage = async (req, res) => {
    try {
        const { pageTitle, contactEmail, phone, address } = req.body;
        let page = await ContactPage.findOne();
        if (!page) {
            page = new ContactPage();
        }
        if (pageTitle !== undefined) page.pageTitle = pageTitle;
        if (contactEmail !== undefined) page.contactEmail = contactEmail;
        if (phone !== undefined) page.phone = phone;
        if (address !== undefined) page.address = address;
        await page.save();
        return res.status(200).json({
            message: 'Contact page updated successfully.',
            page,
        });
    } catch (error) {
        console.error('updateContactPage Error:', error);
        return res.status(500).json({ error: 'Server error updating contact page.' });
    }
};

/**
 * POST /api/contact/queries
 * Public endpoint for any visitor to submit a contact query.
 * Expected body: { fullName, address, contactNumber, email, message }
 */
exports.submitContactQuery = async (req, res) => {
    try {
        const { fullName, address, contactNumber, email, message } = req.body;
        if (!fullName || !address || !contactNumber || !email || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const query = new ContactQuery({
            fullName,
            address,
            contactNumber,
            email,
            message,
        });
        await query.save();
        return res.status(201).json({
            message: 'Your query has been submitted successfully.',
            query,
        });
    } catch (error) {
        console.error('submitContactQuery Error:', error);
        return res.status(500).json({ error: 'Server error submitting contact query.' });
    }
};

/**
 * GET /api/contact/queries
 * Admin-only endpoint to retrieve all submitted contact queries.
 */
exports.getContactQueries = async (req, res) => {
    try {
        const queries = await ContactQuery.find().sort({ submittedAt: -1 });

        if (!queries.length) {
            return res.status(200).json({ message: "No contact queries found." });
        }
        return res.status(200).json(queries);
    } catch (error) {
        console.error('getContactQueries Error:', error);
        return res.status(500).json({ error: 'Server error fetching contact queries.' });
    }
};

/**
 * DELETE /api/contact/queries/:id
 * Admin-only endpoint to delete a specific contact query.
 */
exports.deleteContactQuery = async (req, res) => {
    try {
        const { id } = req.params;
        const query = await ContactQuery.findByIdAndDelete(id);
        if (!query) {
            return res.status(404).json({ error: 'Query not found.' });
        }
        return res.status(200).json({ message: 'Contact query deleted successfully.' });
    } catch (error) {
        console.error('deleteContactQuery Error:', error);
        return res.status(500).json({ error: 'Server error deleting contact query.' });
    }
};
