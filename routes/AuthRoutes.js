const router = require('express').Router()
// import auth controller
const AuthController = require('../controllers/AuthController')



router.post('/login',AuthController.authLogin)
router.post('/adduserbyadmin',AuthController.adduserbyadmin)
router.post('/addagentbyadmin',AuthController.addagentbyadmin)
router.post('/authFetchGameSetting',AuthController.authFetchGameSetting)

router.put('/setBallSettings',AuthController.setBallSettings)

router.post('/addAdminContact',AuthController.addAdminContact)







module.exports = router




















