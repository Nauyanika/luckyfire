const router = require("express").Router();
// import auth controller
const UsersController = require("../controllers/UserController");




router.post('/deductCredits',UsersController.deductCredits);
router.post('/debitPoints',UsersController.debitPoints);
router.post('/addCredits',UsersController.addCredits);
router.post('/creditPoints',UsersController.creditPoints);
router.post('/fetchCredits',UsersController.fetchCredits);
router.post('/addPhoneNumber',UsersController.addPhoneNumber);
router.post('/saveBallData',UsersController.saveBallData);
router.post('/fetchBallData',UsersController.fetchBallData);
router.post('/fetchAgentContact',UsersController.fetchAgentContact);
router.get("/getPlayer", UsersController.getPlayerData);
router.get("/getPlayerId", UsersController.getPlayerIdData);
router.get("/fetchUsers", UsersController.fetchUsers);
router.put('/block/:userId', UsersController.blockUser);
router.post('/isUserBlocked', UsersController.isUserBlocked);
// router.delete('/deleteUser/:user_id', UsersController.deleteUser);

router.delete('/deleteUser', UsersController.deleteUser);
router.get('/fetchContact',UsersController.fetchContact);
router.delete('/deleteUser', UsersController.deleteUser)
router.put('/editUser', UsersController.editUser);
router.get('/fetchAgentData',UsersController.fetchAgentData);
router.put('/updateAgentPhoneNumber', UsersController.updateAgentPhoneNumber);
router.post("/fetchAgentPhoneNumber", UsersController.fetchAgentPhoneNumber);
router.delete('/deleteAgent/:id', UsersController.deleteAgent);
router.put('/editAgent', UsersController.editAgent);
router.get('/transactions', UsersController.transactions);
router.post("/getAgentPlayer", UsersController.getAgentPlayer);
router.post("/getAgentDetail", UsersController.getAgentDetail);










module.exports = router;