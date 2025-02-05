const { Router } = require('express');
const { createContact, getAllContact, getContactByid, updateContacts, deleteContacts } = require('../controllers/contact.controller');
const validateSchema = require('../middlewares/inputValidator');
const router = Router();


router.get('/', getAllContact);
router.get('/:id', getContactByid);
router.post('/', validateSchema, createContact);
router.put('/:id', validateSchema, updateContacts);
router.delete('/:id', deleteContacts);


module.exports = router;