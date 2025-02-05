// const pool = require('../config/db');
const { addContacts, getAllContacts, getContactsByID, updateContact, deleteContact } = require('../models/contacts.model');

module.exports = {
    createContact: async (req, res, next) => {
        const { firstname, lastname, phone, zip } = req.body;
        try {
            const create = await addContacts(firstname, lastname, phone, zip);
            res.status(201).json({
                message: 'Contact created successfully',
                create,
            });
        }
        catch (error) {
          console.log(error);
          next(error);
        };
    },
    getAllContact: async (req, res, next) => {
        try {
            const getAll = await getAllContacts();
            res.status(200).json({ message: 'all contacts locked', getAll });
        }
         catch (error) {
            console.log(error);
            next(error);
        }
    },
    getContactByid: async (req, res, next) => {
        const { id } = req.params;
        try {
            const getOne = await getContactsByID(id);
            res.status(200).json({ message: 'Contact found', getOne });
        }
        catch (err) {
            console.log(err);
            next(err);
        };
    },
    updateContacts: async (req, res, next) => {
        const { id } = req.params;
        const { firstname, lastname, phone, zip } = req.body;
        try {
            const update = await updateContact(id, firstname, lastname, phone, zip);
            if (!update) {
                return res.status(404).json({ message: 'Contact not found' });
            }
            res.status(200).json({ message: 'Contact updated successfully', update });
        }
        catch (error) {
           console.log(error);
           next(error);
        }
    },
    deleteContacts: async (req, res, next) => {
        const { id } = req.params;
        try {
         const deleteCon = await deleteContact(id);
          if (!deleteCon) {
            res.status(404).json({ message: 'Contact not found' });
          }
         res.status(200).json({ message: 'Contact deleted successfully', deleteCon });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    },


};