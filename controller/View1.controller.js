// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/core/Fragment",
//     "sap/m/MessageToast",
//     "sap/m/MessageBox",
//     "sap/ui/model/json/JSONModel",
//     "sap/ui/model/Filter",
//     "sap/ui/model/FilterOperator"
// ], function (Controller, Fragment, MessageToast, MessageBox, JSONModel, Filter, FilterOperator) {
//     "use strict";

//     return Controller.extend("naruto.wizardapp.controller.View1", {

//         onInit: function () {
//             this._validationEnabled = true;
//             this._wizard = this.byId("jobWizard");
//             this._btnNext = this.byId("btnNext");
//             this._btnPrev = this.byId("btnPrev");

//             var oDataModel = new JSONModel();
//             oDataModel.loadData("../model/data.json");
//             this.getView().setModel(oDataModel);

//             this._photoBase64 = "";
//             this._resumeBase64 = "";
//             this._resumeName = "";

//             this.byId("inpName").attachLiveChange(this._validateName.bind(this));
//             this.byId("inpEmail").attachLiveChange(this._validateEmail.bind(this));
//             this.byId("inpPhone").attachLiveChange(this._validatePhone.bind(this));
//             this.byId("inpCgpa").attachLiveChange(this._validateCgpa.bind(this));
//             this.byId("inpYear").attachLiveChange(this._validateYear.bind(this));
//             this.byId("inpExp").attachLiveChange(this._validateExp.bind(this));
//         },
//         onValidationToggle: function(oEvent) {
//                 this._validationEnabled = !oEvent.getParameter("state"); 

//                 const inputs = [
//                     this.byId("inpExp"),
//                     this.byId("inpPhone"),
//                     this.byId("inpCgpa")
//                 ];

//                 inputs.forEach(input => {
//                     if (!this._validationEnabled) {
//                         input.setValueState("None");
//                         input.setValueStateText("");
//                     }
//                 });

//                 if (!this._validationEnabled) {
//                     this.byId("miSkills").setValueState("None");
//                     this.byId("miSkills").setValueStateText("");
//                 }
//             },

//         _validateName: function(oEvent) {
//             const value = oEvent.getParameter("value");
//             const regex = /^[A-Za-z ]{3,50}$/;
//             this._setInputState(this.byId("inpName"), regex.test(value), "Enter a valid name (3-50 letters)");
//         },

//         _validateEmail: function(oEvent) {
//             const value = oEvent.getParameter("value");
//             const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             this._setInputState(this.byId("inpEmail"), regex.test(value), "Enter a valid email");
//         },

//         _validatePhone: function(oEvent) {
//             if (!this._validationEnabled) return;
//             const value = oEvent.getParameter("value");
//             const regex = /^\d{10}$/;
//             this._setInputState(this.byId("inpPhone"), regex.test(value), "Enter a 10-digit phone number");
//         },

//         _validateCgpa: function(oEvent) {
//             if (!this._validationEnabled) return;
//             const value = parseFloat(oEvent.getParameter("value"));
//             const isValid = !isNaN(value) && value >= 0 && value <= 10;
//             this._setInputState(this.byId("inpCgpa"), isValid, "Enter CGPA between 0 and 10");
//         },

//         _validateYear: function(oEvent) {
//             const value = oEvent.getParameter("value");
//             const regex = /^(19|20)\d{2}$/;
//             this._setInputState(this.byId("inpYear"), regex.test(value), "Enter a valid year (YYYY)");
//         },

//         _validateExp: function(oEvent) {
//             if (!this._validationEnabled) return;
//             const value = parseFloat(oEvent.getParameter("value"));
//             const isValid = !isNaN(value) && value >= 0;
//             this._setInputState(this.byId("inpExp"), isValid, "Enter valid experience in years");
//         },

//         _setInputState: function(oInput, isValid, msg) {
//             oInput.setValueState(isValid ? "None" : "Error");
//             oInput.setValueStateText(isValid ? "" : msg);
//         },

//         // _validateStep: function () {
//         //     const step = this._wizard.getCurrentStep();

//         //     if (step === this.byId("stepPersonal").getId()) {
//         //         if ([this.byId("inpName"), this.byId("inpEmail"), this.byId("inpPhone")].some(i => i.getValueState() === "Error") ||
//         //             !this.byId("cbCountry").getSelectedKey() ||
//         //             !this.byId("cbState").getSelectedKey() ||
//         //             !this.byId("cbCity").getSelectedKey()) {
//         //             MessageToast.show("Please correct personal details");
//         //             return false;
//         //         }
//         //     }

//         //     if (step === this.byId("stepAcademic").getId()) {
//         //         if (this.byId("inpCollege").getValue() === "" ||
//         //             this.byId("inpCgpa").getValueState() === "Error" ||
//         //             this.byId("inpYear").getValueState() === "Error") {
//         //             MessageToast.show("Please correct academic details");
//         //             return false;
//         //         }
//         //     }

//         //     if (step === this.byId("stepJob").getId()) {
//         //         if (!this.byId("cbRole").getSelectedKey() ||
//         //             this.byId("inpExp").getValueState() === "Error" ||
//         //             this.byId("miSkills").getTokens().length === 0) {
//         //             MessageToast.show("Please correct job details");
//         //             return false;
//         //         }
//         //     }

//         //     return true;
//         // },

//         _validateStep: function() {
//             const step = this._wizard.getCurrentStep();

//             if (step === this.byId("stepPersonal").getId()) {
//                 if (this._validationEnabled && this.byId("inpPhone").getValueState() === "Error") {
//                     MessageToast.show("Please correct mobile number");
//                     return false;
//                 }
//             }

//             if (step === this.byId("stepAcademic").getId()) {
//                 if (this._validationEnabled && this.byId("inpCgpa").getValueState() === "Error") {
//                     MessageToast.show("Please correct CGPA");
//                     return false;
//                 }
//             }

//             if (step === this.byId("stepJob").getId()) {
//                 if (this._validationEnabled) {
//                     if (this.byId("inpExp").getValueState() === "Error" || this.byId("miSkills").getTokens().length === 0) {
//                         MessageToast.show("Please correct job details");
//                         return false;
//                     }
//                 }
//             }

//             return true;
//         },

//         onCollegeValueHelp: function () {
//             if (!this._collegeDialog) {
//                 Fragment.load({
//                     name: "naruto.wizardapp.Fragments.CollegeDialog",
//                     controller: this
//                 }).then(function (oDialog) {
//                     this._collegeDialog = oDialog;
//                     this.getView().addDependent(oDialog);
//                     oDialog.setModel(this.getView().getModel());
//                     oDialog.open();
//                 }.bind(this));
//             } else {
//                 this._collegeDialog.open();
//             }
//         },

//         onCollegeSearch: function (oEvent) {
//             const sValue = oEvent.getParameter("value");
//             const oBinding = oEvent.getSource().getBinding("items");
//             oBinding.filter(sValue ? [new Filter("name", FilterOperator.Contains, sValue)] : []);
//         },

//         onCollegeSelect: function (oEvent) {
//             const oItem = oEvent.getParameter("selectedItem");
//             if (oItem) {
//                 this.byId("inpCollege").setValue(oItem.getTitle());
//             }
//         },

//         onSkillsValueHelp: function () {
//             if (!this._skillsDialog) {
//                 Fragment.load({
//                     name: "naruto.wizardapp.Fragments.SkillsDialog",
//                     controller: this
//                 }).then(function (oDialog) {
//                     this._skillsDialog = oDialog;
//                     this.getView().addDependent(oDialog);
//                     oDialog.setModel(this.getView().getModel());
//                     oDialog.open();
//                 }.bind(this));
//             } else {
//                 this._skillsDialog.open();
//             }
//         },

//         onSkillsSearch: function (oEvent) {
//             const sValue = oEvent.getParameter("value");
//             const oBinding = oEvent.getSource().getBinding("items");
//             oBinding.filter(sValue ? [new Filter("skill", FilterOperator.Contains, sValue)] : []);
//         },

//         onSkillSelect: function (oEvent) {
//             const sText = oEvent.getParameter("selectedItem")?.getTitle();
//             if (sText) this._addSkill(sText);
//         },

//         onSkillSubmit: function (oEvent) {
//             const sVal = oEvent.getParameter("value");
//             if (sVal && sVal.trim()) this._addSkill(sVal.trim());
//             oEvent.getSource().setValue("");
//         },

//         _addSkill: function (sText) {
//             const oMI = this.byId("miSkills");
//             const exists = oMI.getTokens().some(t => t.getText().toLowerCase() === sText.toLowerCase());
//             if (!exists) oMI.addToken(new sap.m.Token({ text: sText }));
//             else MessageToast.show("Skill already added");
//         },

//         onPhotoChange: function (oEvent) {
//             const file = oEvent.getParameter("files")?.[0];
//             if (!file) return;

//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const img = new Image();
//                 img.onload = () => {
//                     const canvas = document.createElement("canvas");
//                     const max = 400;
//                     let w = img.width, h = img.height;
//                     if (w > h && w > max) { h *= max / w; w = max; }
//                     else if (h > max) { w *= max / h; h = max; }
//                     canvas.width = w;
//                     canvas.height = h;
//                     canvas.getContext("2d").drawImage(img, 0, 0, w, h);
//                     this._photoBase64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
//                     this.byId("avatarPreview").setSrc("data:image/jpeg;base64," + this._photoBase64);
//                 };
//                 img.src = e.target.result;
//             };
//             reader.readAsDataURL(file);
//         },

//         onResumeChange: function (oEvent) {
//             const file = oEvent.getParameter("files")?.[0];
//             if (!file) return;

//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 this._resumeBase64 = e.target.result.split(",")[1];
//                 this._resumeName = file.name;
//                 MessageToast.show("Resume uploaded: " + file.name);
//             };
//             reader.readAsDataURL(file);
//         },

//         onWizardComplete: function () {
//                 const oData = {
//                 name: this.byId("inpName").getValue(),
//                 email: this.byId("inpEmail").getValue(),
//                 mobile: this.byId("inpPhone").getValue(),
//                 country: this.byId("cbCountry").getSelectedItem()?.getText(),
//                 state: this.byId("cbState").getSelectedItem()?.getText(),
//                 city: this.byId("cbCity").getSelectedItem()?.getText(),
//                 college: this.byId("inpCollege").getValue(),
//                 cgpa: this.byId("inpCgpa").getValue(),
//                 year: this.byId("inpYear").getValue(),
//                 role: this.byId("cbRole").getSelectedItem()?.getText(),
//                 experience: this.byId("inpExp").getValue(),
//                 skills: this.byId("miSkills").getTokens().map(t => t.getText()).join(", "),
//                 photo: this._photoBase64,
//                 resumeName: this._resumeName,
//                 resumeData: this._resumeBase64
//             };
//             if (!this._reviewDialog) {
//                 Fragment.load({
//                     name: "naruto.wizardapp.Fragments.ReviewDialog",
//                     type: "XML",
//                     controller: this
//                 }).then(function (oDialog) {
//                     this._reviewDialog = oDialog;
//                     this.getView().addDependent(oDialog);
//                     oDialog.open();
//                 }.bind(this));
//             } else {
//                 this._reviewDialog.open();
//             }
        

//             const oPreviewModel = new JSONModel(oData);
//             this.getView().setModel(oPreviewModel, "previewData");

            
//         },

//         onReviewConfirm: function () {
//                 MessageBox.success("Application submitted successfully!");
                
//                 this._reviewDialog.close();

//                 this._wizard.discardProgress(this._wizard.getSteps()[0]);
//                 this._wizard.goToStep(this._wizard.getSteps()[0]); 

//                 this.byId("inpName").setValue("");
//                 this.byId("inpEmail").setValue("");
//                 this.byId("inpPhone").setValue("");
//                 this.byId("cbCountry").setSelectedKey("");
//                 this.byId("cbState").setSelectedKey("");
//                 this.byId("cbCity").setSelectedKey("");
//                 this.byId("inpCollege").setValue("");
//                 this.byId("inpCgpa").setValue("");
//                 this.byId("inpYear").setValue("");
//                 this.byId("cbRole").setSelectedKey("");
//                 this.byId("inpExp").setValue("");
//                 this.byId("miSkills").removeAllTokens();

//                 this._photoBase64 = "";
//                 this.byId("avatarPreview").setSrc("");
//                 this._resumeBase64 = "";
//                 this._resumeName = "";
//                 this.byId("fuPhoto").setValue("");
//                 this.byId("fuResume").setValue("");
//             },


//         onReviewCancel: function () {
//                 this._reviewDialog.close();
//              },

//     });
// });

// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/core/Fragment",
//     "sap/m/MessageToast",
//     "sap/m/MessageBox",
//     "sap/ui/model/json/JSONModel",
//     "sap/ui/model/Filter",
//     "sap/ui/model/FilterOperator"
// ], function (Controller, Fragment, MessageToast, MessageBox, JSONModel, Filter, FilterOperator) {
//     "use strict";

//     return Controller.extend("naruto.wizardapp.controller.View1", {

//         onInit: function () {
//             this._validationEnabled = true;
//             this._wizard = this.byId("jobWizard");
//             this._btnNext = this.byId("btnNext");
//             this._btnPrev = this.byId("btnPrev");

//             var oDataModel = new JSONModel();
//             oDataModel.loadData("../model/data.json");
//             this.getView().setModel(oDataModel);

//             this._photoBase64 = "";
//             this._resumeBase64 = "";
//             this._resumeName = "";

//             // Attach live change validations
//             this.byId("inpName").attachLiveChange(this._validateName.bind(this));
//             this.byId("inpEmail").attachLiveChange(this._validateEmail.bind(this));
//             this.byId("inpPhone").attachLiveChange(this._validatePhone.bind(this));
//             this.byId("inpCgpa").attachLiveChange(this._validateCgpa.bind(this));
//             this.byId("inpYear").attachLiveChange(this._validateYear.bind(this));
//             this.byId("inpExp").attachLiveChange(this._validateExp.bind(this));

//             // Hide optional fields initially if needed
//             this.byId("inpExp").setVisible(true); // change to false if default hidden
//             this.byId("inpPhone").setVisible(true);
//             this.byId("inpCgpa").setVisible(true);
//             this.byId("miSkills").setVisible(true);
//         },

//         // Toggle switch logic
//         onValidationToggle: function(oEvent) {
//             const isSwitchOn = oEvent.getParameter("state"); // true if ON
//             this._validationEnabled = isSwitchOn;

//             // Fields to show/hide
//             const fields = [
//                 this.byId("inpExp"),
//                 this.byId("inpPhone"),
//                 this.byId("inpCgpa"),
//                 this.byId("miSkills")
//             ];

//             fields.forEach(input => {
//                 input.setVisible(isSwitchOn);
//                 if (!isSwitchOn) {
//                     input.setValueState("None");
//                     input.setValueStateText("");
//                 }
//             });
//         },

//         // Validation functions
//         _validateName: function(oEvent) {
//             const value = oEvent.getParameter("value");
//             const regex = /^[A-Za-z ]{3,50}$/;
//             this._setInputState(this.byId("inpName"), regex.test(value), "Enter a valid name (3-50 letters)");
//         },

//         _validateEmail: function(oEvent) {
//             const value = oEvent.getParameter("value");
//             const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             this._setInputState(this.byId("inpEmail"), regex.test(value), "Enter a valid email");
//         },

//         _validatePhone: function(oEvent) {
//             const input = this.byId("inpPhone");
//             if (!this._validationEnabled || !input.getVisible()) return;
//             const value = oEvent.getParameter("value");
//             const regex = /^\d{10}$/;
//             this._setInputState(input, regex.test(value), "Enter a 10-digit phone number");
//         },

//         _validateCgpa: function(oEvent) {
//             const input = this.byId("inpCgpa");
//             if (!this._validationEnabled || !input.getVisible()) return;
//             const value = parseFloat(oEvent.getParameter("value"));
//             const isValid = !isNaN(value) && value >= 0 && value <= 10;
//             this._setInputState(input, isValid, "Enter CGPA between 0 and 10");
//         },

//         _validateYear: function(oEvent) {
//             const value = oEvent.getParameter("value");
//             const regex = /^(19|20)\d{2}$/;
//             this._setInputState(this.byId("inpYear"), regex.test(value), "Enter a valid year (YYYY)");
//         },

//         _validateExp: function(oEvent) {
//             const input = this.byId("inpExp");
//             if (!this._validationEnabled || !input.getVisible()) return;
//             const value = parseFloat(oEvent.getParameter("value"));
//             const isValid = !isNaN(value) && value >= 0;
//             this._setInputState(input, isValid, "Enter valid experience in years");
//         },

//         _setInputState: function(oInput, isValid, msg) {
//             oInput.setValueState(isValid ? "None" : "Error");
//             oInput.setValueStateText(isValid ? "" : msg);
//         },

//         // Validate only visible fields
//         _validateStep: function() {
//             const step = this._wizard.getCurrentStep();

//             if (step === this.byId("stepPersonal").getId()) {
//                 const phone = this.byId("inpPhone");
//                 if (phone.getVisible() && this._validationEnabled && phone.getValueState() === "Error") {
//                     MessageToast.show("Please correct mobile number");
//                     return false;
//                 }
//             }

//             if (step === this.byId("stepAcademic").getId()) {
//                 const cgpa = this.byId("inpCgpa");
//                 if (cgpa.getVisible() && this._validationEnabled && cgpa.getValueState() === "Error") {
//                     MessageToast.show("Please correct CGPA");
//                     return false;
//                 }
//             }

//             if (step === this.byId("stepJob").getId()) {
//                 const exp = this.byId("inpExp");
//                 const skills = this.byId("miSkills");
//                 if (this._validationEnabled) {
//                     if ((exp.getVisible() && exp.getValueState() === "Error") ||
//                         (skills.getVisible() && skills.getTokens().length === 0)) {
//                         MessageToast.show("Please correct job details");
//                         return false;
//                     }
//                 }
//             }

//             return true;
//         },

//         // College dialog functions
//         onCollegeValueHelp: function () {
//             if (!this._collegeDialog) {
//                 Fragment.load({
//                     name: "naruto.wizardapp.Fragments.CollegeDialog",
//                     controller: this
//                 }).then(function (oDialog) {
//                     this._collegeDialog = oDialog;
//                     this.getView().addDependent(oDialog);
//                     oDialog.setModel(this.getView().getModel());
//                     oDialog.open();
//                 }.bind(this));
//             } else {
//                 this._collegeDialog.open();
//             }
//         },

//         onCollegeSearch: function (oEvent) {
//             const sValue = oEvent.getParameter("value");
//             const oBinding = oEvent.getSource().getBinding("items");
//             oBinding.filter(sValue ? [new Filter("name", FilterOperator.Contains, sValue)] : []);
//         },

//         onCollegeSelect: function (oEvent) {
//             const oItem = oEvent.getParameter("selectedItem");
//             if (oItem) this.byId("inpCollege").setValue(oItem.getTitle());
//         },

//         // Skills dialog functions
//         onSkillsValueHelp: function () {
//             if (!this._skillsDialog) {
//                 Fragment.load({
//                     name: "naruto.wizardapp.Fragments.SkillsDialog",
//                     controller: this
//                 }).then(function (oDialog) {
//                     this._skillsDialog = oDialog;
//                     this.getView().addDependent(oDialog);
//                     oDialog.setModel(this.getView().getModel());
//                     oDialog.open();
//                 }.bind(this));
//             } else {
//                 this._skillsDialog.open();
//             }
//         },

//         onSkillsSearch: function (oEvent) {
//             const sValue = oEvent.getParameter("value");
//             const oBinding = oEvent.getSource().getBinding("items");
//             oBinding.filter(sValue ? [new Filter("skill", FilterOperator.Contains, sValue)] : []);
//         },

//         onSkillSelect: function (oEvent) {
//             const sText = oEvent.getParameter("selectedItem")?.getTitle();
//             if (sText) this._addSkill(sText);
//         },

//         onSkillSubmit: function (oEvent) {
//             const sVal = oEvent.getParameter("value");
//             if (sVal && sVal.trim()) this._addSkill(sVal.trim());
//             oEvent.getSource().setValue("");
//         },

//         _addSkill: function (sText) {
//             const oMI = this.byId("miSkills");
//             const exists = oMI.getTokens().some(t => t.getText().toLowerCase() === sText.toLowerCase());
//             if (!exists) oMI.addToken(new sap.m.Token({ text: sText }));
//             else MessageToast.show("Skill already added");
//         },

//         // Photo & Resume upload
//         onPhotoChange: function (oEvent) {
//             const file = oEvent.getParameter("files")?.[0];
//             if (!file) return;

//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const img = new Image();
//                 img.onload = () => {
//                     const canvas = document.createElement("canvas");
//                     const max = 400;
//                     let w = img.width, h = img.height;
//                     if (w > h && w > max) { h *= max / w; w = max; }
//                     else if (h > max) { w *= max / h; h = max; }
//                     canvas.width = w;
//                     canvas.height = h;
//                     canvas.getContext("2d").drawImage(img, 0, 0, w, h);
//                     this._photoBase64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
//                     this.byId("avatarPreview").setSrc("data:image/jpeg;base64," + this._photoBase64);
//                 };
//                 img.src = e.target.result;
//             };
//             reader.readAsDataURL(file);
//         },

//         onResumeChange: function (oEvent) {
//             const file = oEvent.getParameter("files")?.[0];
//             if (!file) return;

//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 this._resumeBase64 = e.target.result.split(",")[1];
//                 this._resumeName = file.name;
//                 MessageToast.show("Resume uploaded: " + file.name);
//             };
//             reader.readAsDataURL(file);
//         },

//         // Wizard complete
//         onWizardComplete: function () {
//             const oData = {
//                 name: this.byId("inpName").getValue(),
//                 email: this.byId("inpEmail").getValue(),
//                 mobile: this.byId("inpPhone").getValue(),
//                 country: this.byId("cbCountry").getSelectedItem()?.getText(),
//                 state: this.byId("cbState").getSelectedItem()?.getText(),
//                 city: this.byId("cbCity").getSelectedItem()?.getText(),
//                 college: this.byId("inpCollege").getValue(),
//                 cgpa: this.byId("inpCgpa").getValue(),
//                 year: this.byId("inpYear").getValue(),
//                 role: this.byId("cbRole").getSelectedItem()?.getText(),
//                 experience: this.byId("inpExp").getValue(),
//                 skills: this.byId("miSkills").getTokens().map(t => t.getText()).join(", "),
//                 photo: this._photoBase64,
//                 resumeName: this._resumeName,
//                 resumeData: this._resumeBase64
//             };

//             if (!this._reviewDialog) {
//                 Fragment.load({
//                     name: "naruto.wizardapp.Fragments.ReviewDialog",
//                     type: "XML",
//                     controller: this
//                 }).then(function (oDialog) {
//                     this._reviewDialog = oDialog;
//                     this.getView().addDependent(oDialog);
//                     oDialog.open();
//                 }.bind(this));
//             } else {
//                 this._reviewDialog.open();
//             }

//             const oPreviewModel = new JSONModel(oData);
//             this.getView().setModel(oPreviewModel, "previewData");
//         },

//         onReviewConfirm: function () {
//             MessageBox.success("Application submitted successfully!");
//             this._reviewDialog.close();

//             // Reset wizard
//             this._wizard.discardProgress(this._wizard.getSteps()[0]);
//             this._wizard.goToStep(this._wizard.getSteps()[0]); 

//             // Reset form fields
//             this.byId("inpName").setValue("");
//             this.byId("inpEmail").setValue("");
//             this.byId("inpPhone").setValue("");
//             this.byId("cbCountry").setSelectedKey("");
//             this.byId("cbState").setSelectedKey("");
//             this.byId("cbCity").setSelectedKey("");
//             this.byId("inpCollege").setValue("");
//             this.byId("inpCgpa").setValue("");
//             this.byId("inpYear").setValue("");
//             this.byId("cbRole").setSelectedKey("");
//             this.byId("inpExp").setValue("");
//             this.byId("miSkills").removeAllTokens();

//             this._photoBase64 = "";
//             this.byId("avatarPreview").setSrc("");
//             this._resumeBase64 = "";
//             this._resumeName = "";
//             this.byId("fuPhoto").setValue("");
//             this.byId("fuResume").setValue("");
//         },

//         onReviewCancel: function () {
//             this._reviewDialog.close();
//         }

//     });
// });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, Fragment, MessageToast, MessageBox, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("naruto.wizardapp.controller.View1", {

        onInit: function () {
            this._validationEnabled = true;
            this._wizard = this.byId("jobWizard");

            var oDataModel = new JSONModel();
            oDataModel.loadData("../model/data.json");
            this.getView().setModel(oDataModel);

            this._photoBase64 = "";
            this._resumeBase64 = "";
            this._resumeName = "";

            this.byId("inpName").attachLiveChange(this._validateName.bind(this));
            this.byId("inpEmail").attachLiveChange(this._validateEmail.bind(this));
            this.byId("inpPhone").attachLiveChange(this._validatePhone.bind(this));
            this.byId("inpCgpa").attachLiveChange(this._validateCgpa.bind(this));
            this.byId("inpYear").attachLiveChange(this._validateYear.bind(this));
            this.byId("inpExp").attachLiveChange(this._validateExp.bind(this));
        },

        onValidationToggle: function(oEvent) {
            const isSwitchOn = oEvent.getParameter("state");
            this._validationEnabled = isSwitchOn;

            const fields = [
                { container: this.byId("vbExperience"), input: this.byId("inpExp") },
                { container: this.byId("vbSkills"), input: this.byId("miSkills") },
                { container: this.byId("vbCgpa"), input: this.byId("inpCgpa") },
                { container: this.byId("vbPhone"), input: this.byId("inpPhone") }
            ];

            fields.forEach(f => {
                f.container.setVisible(isSwitchOn);
                if (!isSwitchOn) {
                    f.input.setValueState("None");
                    f.input.setValueStateText("");
                }
            });
        },

        _validateName: function(oEvent) {
            const value = oEvent.getParameter("value");
            const regex = /^[A-Za-z ]{3,50}$/;
            this._setInputState(this.byId("inpName"), regex.test(value), "Enter a valid name (3-50 letters)");
        },

        _validateEmail: function(oEvent) {
            const value = oEvent.getParameter("value");
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            this._setInputState(this.byId("inpEmail"), regex.test(value), "Enter a valid email");
        },

        _validatePhone: function(oEvent) {
            const input = this.byId("inpPhone");
            if (!this._validationEnabled || !input.getVisible()) return;
            const value = oEvent.getParameter("value");
            const regex = /^\d{10}$/;
            this._setInputState(input, regex.test(value), "Enter a 10-digit phone number");
        },

        _validateCgpa: function(oEvent) {
            const input = this.byId("inpCgpa");
            if (!this._validationEnabled || !input.getVisible()) return;
            const value = parseFloat(oEvent.getParameter("value"));
            const isValid = !isNaN(value) && value >= 0 && value <= 10;
            this._setInputState(input, isValid, "Enter CGPA between 0 and 10");
        },

        _validateYear: function(oEvent) {
            const value = oEvent.getParameter("value");
            const regex = /^(19|20)\d{2}$/;
            this._setInputState(this.byId("inpYear"), regex.test(value), "Enter a valid year (YYYY)");
        },

        _validateExp: function(oEvent) {
            const input = this.byId("inpExp");
            if (!this._validationEnabled || !input.getVisible()) return;
            const value = parseFloat(oEvent.getParameter("value"));
            const isValid = !isNaN(value) && value >= 0;
            this._setInputState(input, isValid, "Enter valid experience in years");
        },

        _setInputState: function(oInput, isValid, msg) {
            oInput.setValueState(isValid ? "None" : "Error");
            oInput.setValueStateText(isValid ? "" : msg);
        },

        _validateStep: function() {
            const step = this._wizard.getCurrentStep();

            const phone = this.byId("inpPhone");
            if (phone.getVisible() && this._validationEnabled && phone.getValueState() === "Error") {
                MessageToast.show("Please correct mobile number");
                return false;
            }

            const cgpa = this.byId("inpCgpa");
            if (cgpa.getVisible() && this._validationEnabled && cgpa.getValueState() === "Error") {
                MessageToast.show("Please correct CGPA");
                return false;
            }

            const exp = this.byId("inpExp");
            const skills = this.byId("miSkills");
            if (this._validationEnabled) {
                if ((exp.getVisible() && exp.getValueState() === "Error") ||
                    (skills.getVisible() && skills.getTokens().length === 0)) {
                    MessageToast.show("Please correct job details");
                    return false;
                }
            }

            return true;
        },

        onCollegeValueHelp: function () {
            if (!this._collegeDialog) {
                Fragment.load({
                    name: "naruto.wizardapp.Fragments.CollegeDialog",
                    controller: this
                }).then(function (oDialog) {
                    this._collegeDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setModel(this.getView().getModel());
                    oDialog.open();
                }.bind(this));
            } else {
                this._collegeDialog.open();
            }
        },

        onCollegeSearch: function (oEvent) {
            const sValue = oEvent.getParameter("value");
            const oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(sValue ? [new Filter("name", FilterOperator.Contains, sValue)] : []);
        },

        onCollegeSelect: function (oEvent) {
            const oItem = oEvent.getParameter("selectedItem");
            if (oItem) this.byId("inpCollege").setValue(oItem.getTitle());
        },

        onSkillsValueHelp: function () {
            if (!this._skillsDialog) {
                Fragment.load({
                    name: "naruto.wizardapp.Fragments.SkillsDialog",
                    controller: this
                }).then(function (oDialog) {
                    this._skillsDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setModel(this.getView().getModel());
                    oDialog.open();
                }.bind(this));
            } else {
                this._skillsDialog.open();
            }
        },

        onSkillsSearch: function (oEvent) {
            const sValue = oEvent.getParameter("value");
            const oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(sValue ? [new Filter("skill", FilterOperator.Contains, sValue)] : []);
        },

        onSkillSelect: function (oEvent) {
            const sText = oEvent.getParameter("selectedItem")?.getTitle();
            if (sText) this._addSkill(sText);
        },

        onSkillSubmit: function (oEvent) {
            const sVal = oEvent.getParameter("value");
            if (sVal && sVal.trim()) this._addSkill(sVal.trim());
            oEvent.getSource().setValue("");
        },

        _addSkill: function (sText) {
            const oMI = this.byId("miSkills");
            const exists = oMI.getTokens().some(t => t.getText().toLowerCase() === sText.toLowerCase());
            if (!exists) oMI.addToken(new sap.m.Token({ text: sText }));
            else MessageToast.show("Skill already added");
        },

        onPhotoChange: function (oEvent) {
            const file = oEvent.getParameter("files")?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const max = 400;
                    let w = img.width, h = img.height;
                    if (w > h && w > max) { h *= max / w; w = max; }
                    else if (h > max) { w *= max / h; h = max; }
                    canvas.width = w;
                    canvas.height = h;
                    canvas.getContext("2d").drawImage(img, 0, 0, w, h);
                    this._photoBase64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
                    this.byId("avatarPreview").setSrc("data:image/jpeg;base64," + this._photoBase64);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        },

        onResumeChange: function (oEvent) {
            const file = oEvent.getParameter("files")?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                this._resumeBase64 = e.target.result.split(",")[1];
                this._resumeName = file.name;
                MessageToast.show("Resume uploaded: " + file.name);
            };
            reader.readAsDataURL(file);
        },

        onWizardComplete: function () {
            const oData = {
                name: this.byId("inpName").getValue(),
                email: this.byId("inpEmail").getValue(),
                mobile: this.byId("inpPhone").getValue(),
                country: this.byId("cbCountry").getSelectedItem()?.getText(),
                state: this.byId("cbState").getSelectedItem()?.getText(),
                city: this.byId("cbCity").getSelectedItem()?.getText(),
                college: this.byId("inpCollege").getValue(),
                cgpa: this.byId("inpCgpa").getValue(),
                year: this.byId("inpYear").getValue(),
                role: this.byId("cbRole").getSelectedItem()?.getText(),
                experience: this.byId("inpExp").getValue(),
                skills: this.byId("miSkills").getTokens().map(t => t.getText()).join(", "),
                photo: this._photoBase64,
                resumeName: this._resumeName,
                resumeData: this._resumeBase64
            };

            if (!this._reviewDialog) {
                Fragment.load({
                    name: "naruto.wizardapp.Fragments.ReviewDialog",
                    type: "XML",
                    controller: this
                }).then(function (oDialog) {
                    this._reviewDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                this._reviewDialog.open();
            }

            const oPreviewModel = new JSONModel(oData);
            this.getView().setModel(oPreviewModel, "previewData");
        },

        onReviewConfirm: function () {
            MessageBox.success("Application submitted successfully!");
            this._reviewDialog.close();

            this._wizard.discardProgress(this._wizard.getSteps()[0]);
            this._wizard.goToStep(this._wizard.getSteps()[0]); 

            const fields = [
                "inpName","inpEmail","inpPhone","cbCountry","cbState","cbCity",
                "inpCollege","inpCgpa","inpYear","cbRole","inpExp","miSkills",
                "fuPhoto","fuResume","avatarPreview"
            ];

           
                fields.forEach(id => {
                                const control = this.byId(id);
                                if (!control) return;
                                if (control.setValue) control.setValue("");
                                if (control.setSelectedKey) control.setSelectedKey("");
                                if (control.removeAllTokens) control.removeAllTokens();
                                if (id === "avatarPreview") control.setSrc("");
                            });

                            this._photoBase64 = "";
                            this._resumeBase64 = "";
                            this._resumeName = "";
        },

        onReviewCancel: function () {
            this._reviewDialog.close();
        }

    });
});