// Get all history records
exports.getHistory = (req, res) => {
    res.send('Get all History');
};

// Get history for a specific user by userId
exports.getUserHistory = (req, res) => {
    const userId = req.params.userId;
    res.send(`Get History for User ID: ${userId}`);
};

// Get history for a specific admin by adminId
exports.getAdminHistory = (req, res) => {
    const adminId = req.params.adminId;
    res.send(`Get History for Admin ID: ${adminId}`);
};
