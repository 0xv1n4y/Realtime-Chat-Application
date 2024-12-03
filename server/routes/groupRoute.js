const express = require("express");

const router = express.Router();

const groupController = require('../controllers/groupController');


router.post('/group/new', groupController.createGroup);
router.post('/groups/:groupId/leave', groupController.removeMembers);
router.post('/group', groupController.leaveGroup);
router.put('/groups/:groupId', groupController.updateGroupName);
router.post('/groups/:groupId/members', groupController.addNewMembers);

module.exports = router;