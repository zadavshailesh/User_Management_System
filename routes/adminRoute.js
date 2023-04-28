const express = require('express');
const adminRoute = express();

const session = require('express-session');
const config = require('../config/config');
adminRoute.use(session({ secret: config.sessionSecret }));
const bodyParser = require('body-parser');

adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({ extended: true }));

adminRoute.set('view engine', 'ejs');
adminRoute.set('views', './views/admin');

const multer = require('multer');
const path = require('path');

//For rendering image
adminRoute.use(express.static('public'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/userImages'));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

const auth = require('../middleware/adminAuth');

const adminController = require('../controllers/adminController');
adminRoute.get('/', auth.isLogout, adminController.loadLogin);
adminRoute.post('/', adminController.verifyLogin);
adminRoute.get('/home', auth.isLogin, adminController.loadDashboard);
adminRoute.get('/logout', auth.isLogin, adminController.logout);
adminRoute.get('/forget', auth.isLogout, adminController.forgetLoad);
adminRoute.post('/forget', adminController.forgetVerify);
adminRoute.get(
  '/forget-password',
  auth.isLogout,
  adminController.forgetPasswordLoad
);
adminRoute.post('/forget-password', adminController.resetPassword);
adminRoute.get('/dashboard', auth.isLogin, adminController.adminDashboard);
adminRoute.get('/new-user', auth.isLogin, adminController.newUserLoad);
adminRoute.post('/new-user', upload.single('image'), adminController.addUser);
adminRoute.get('/edit-user', auth.isLogin, adminController.EditUserLoad);
adminRoute.post('/edit-user', adminController.updateUsers);
adminRoute.get('/delete-user', adminController.deleteUsers);
adminRoute.get('/export-users', auth.isLogin, adminController.exportUsers);
adminRoute.get(
  '/export-users-pdf',
  auth.isLogin,
  adminController.exportUsersPdf
);

adminRoute.get('*', function (req, res) {
  res.redirect('/admin');
});

module.exports = adminRoute;
