// IN PROGRESS
const dashboard = (req, res) => {
    res.send('Admin Dashboard');
};

const documentsRequest = (req, res) => {
    res.send('Admin Documents Request');
};

const adminAccount = (req, res) => {
    res.send('Admin Account');
};

module.exports = {
    dashboard,
    documentsRequest,
    adminAccount
};
