const Product = require('../../models/Product')


// controllers/shop/search-controller.js

const searchProducts = async (req, res) => {
    try {
        const { keyword } = req.params; // or req.query if using ?keyword=
        if (!keyword || typeof keyword !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Keyword is required and must be a string',
            });
        }

        const regEx = new RegExp(keyword, 'i');

        const createSearchQuery = {
            $or: [
                { title: regEx },
                { description: regEx },
                { category: regEx },
                { brand: regEx },
            ],
        };

        const searchResults = await Product.find(createSearchQuery);
        res.status(200).json({
            success: true,
            data: searchResults,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'Error is here',
        });
    }
};


module.exports = {searchProducts}