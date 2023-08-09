const router = require('express').Router();
const Message = require('../models/MessageSchema');

router.get('/admin-message', async (req, res) => {
    try {
        const receiver = req.query.receiver
        const users = await Message.find({receiver});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

module.exports = router;