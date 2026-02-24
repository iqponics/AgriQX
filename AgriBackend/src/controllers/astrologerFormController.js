const astrologerFormRepository = require('../repositories/astrologerFormRepository');

const astrologerFormController = {
    createForm: async (req, res) => {
        try {
            const savedForm = await astrologerFormRepository.create(req.body);
            res.status(200).json(savedForm);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteForm: async (req, res) => {
        try {
            const form = await astrologerFormRepository.findById(req.params.id);
            if (form.astrologerId === req.params.astrologerId) {
                await astrologerFormRepository.deleteOne({ _id: req.params.id });
                res.status(200).json("Form deleted");
            } else {
                res.status(403).json("You can delete only your Form");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateForm: async (req, res) => {
        try {
            const form = await astrologerFormRepository.findById(req.params.id);
            if (form.astrologerId === req.body.astrologerId) {
                await astrologerFormRepository.save(Object.assign(form, req.body));
                res.status(200).json("Form Updated");
            } else {
                res.status(403).json("You can update only your Form");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getForms: async (req, res) => {
        try {
            const userForms = await astrologerFormRepository.find({ astrologerId: req.params.astrologerId });
            res.status(200).json(userForms);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getFormByCaseId: async (req, res) => {
        try {
            const form = await astrologerFormRepository.findOne({ caseID: req.params.caseID });
            res.status(200).json(form);
        } catch (err) {
            res.status(500).json(err);
        }
    }
};

module.exports = astrologerFormController;
