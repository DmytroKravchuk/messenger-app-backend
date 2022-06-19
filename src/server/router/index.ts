const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const authMiddleware = require("../middlewares/auth-middleware");

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate:link', userController.activate);
router.get('/refresh', userController.refresh);
router.post('/users', authMiddleware, userController.postUsers);

module.exports = router;