const express = require("express");
const astrologerFormRouter = express.Router();
const astrologerFormController = require("../controllers/astrologerFormController");

// create a form
astrologerFormRouter.post("/", astrologerFormController.createForm);

// delete a form
astrologerFormRouter.delete("/:id/:astrologerId", astrologerFormController.deleteForm);

// edit a form
astrologerFormRouter.put("/:id", astrologerFormController.updateForm);

// get forms
astrologerFormRouter.get("/:astrologerId", astrologerFormController.getForms);

// search form with caseID
astrologerFormRouter.get("/form/:caseID", astrologerFormController.getFormByCaseId);

module.exports = astrologerFormRouter;
