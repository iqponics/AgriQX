const express = require("express");
const lawyerFormRouter = express.Router();
const lawyerFormController = require("../controllers/lawyerFormController");

// create a form
lawyerFormRouter.post("/", lawyerFormController.createForm);

// delete a form
lawyerFormRouter.delete("/:id/:lawyerId", lawyerFormController.deleteForm);

// edit a form
lawyerFormRouter.put("/:id", lawyerFormController.updateForm);

// get forms
lawyerFormRouter.get("/:lawyerId", lawyerFormController.getForms);

// search form with caseID
lawyerFormRouter.get("/form/:caseID", lawyerFormController.getFormByCaseId);

module.exports = lawyerFormRouter;
