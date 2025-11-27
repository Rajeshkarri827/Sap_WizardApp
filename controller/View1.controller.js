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
            this._wizard = this.byId("jobWizard");
            this._btnNext = this.byId("btnNext");
            this._btnPrev = this.byId("btnPrev");

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
            const value = oEvent.getParameter("value");
            const regex = /^\d{10}$/;
            this._setInputState(this.byId("inpPhone"), regex.test(value), "Enter a 10-digit phone number");
        },

        _validateCgpa: function(oEvent) {
            const value = parseFloat(oEvent.getParameter("value"));
            const isValid = !isNaN(value) && value >= 0 && value <= 10;
            this._setInputState(this.byId("inpCgpa"), isValid, "Enter CGPA between 0 and 10");
        },

        _validateYear: function(oEvent) {
            const value = oEvent.getParameter("value");
            const regex = /^(19|20)\d{2}$/;
            this._setInputState(this.byId("inpYear"), regex.test(value), "Enter a valid year (YYYY)");
        },

        _validateExp: function(oEvent) {
            const value = parseFloat(oEvent.getParameter("value"));
            const isValid = !isNaN(value) && value >= 0;
            this._setInputState(this.byId("inpExp"), isValid, "Enter valid experience in years");
        },

        _setInputState: function(oInput, isValid, msg) {
            oInput.setValueState(isValid ? "None" : "Error");
            oInput.setValueStateText(isValid ? "" : msg);
        },

        _validateStep: function () {
            var step = this._wizard.getCurrentStep();

            if (step === this.byId("stepPersonal").getId()) {
                if ([this.byId("inpName"), this.byId("inpEmail"), this.byId("inpPhone")].some(i => i.getValueState() === "Error") ||
                    !this.byId("cbCountry").getSelectedKey() ||
                    !this.byId("cbState").getSelectedKey() ||
                    !this.byId("cbCity").getSelectedKey()) {
                    MessageToast.show("Please correct personal details");
                    return false;
                }
            }

            if (step === this.byId("stepAcademic").getId()) {
                if (this.byId("inpCollege").getValue() === "" ||
                    this.byId("inpCgpa").getValueState() === "Error" ||
                    this.byId("inpYear").getValueState() === "Error") {
                    MessageToast.show("Please correct academic details");
                    return false;
                }
            }

            if (step === this.byId("stepJob").getId()) {
                if (!this.byId("cbRole").getSelectedKey() ||
                    this.byId("inpExp").getValueState() === "Error" ||
                    this.byId("miSkills").getTokens().length === 0) {
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
            var sValue = oEvent.getParameter("value");
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(sValue ? [new Filter("name", FilterOperator.Contains, sValue)] : []);
        },

        onCollegeSelect: function (oEvent) {
            var oItem = oEvent.getParameter("selectedItem");
            if (oItem) {
                var sName = oItem.getTitle();
                this.byId("inpCollege").setValue(sName);
            }
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
            var sValue = oEvent.getParameter("value");
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(sValue ? [new Filter("skill", FilterOperator.Contains, sValue)] : []);
        },

        onSkillSelect: function (oEvent) {
            var sText = oEvent.getParameter("selectedItem")?.getTitle();
            if (sText) {
                this._addSkill(sText);
            }
        },

        onSkillSubmit: function (oEvent) {
            var sVal = oEvent.getParameter("value");
            if (sVal && sVal.trim()) {
                this._addSkill(sVal.trim());
            }
            oEvent.getSource().setValue("");
        },

        _addSkill: function (sText) {
            var oMI = this.byId("miSkills");
            var exists = oMI.getTokens().some(t => t.getText().toLowerCase() === sText.toLowerCase());
            if (!exists) {
                oMI.addToken(new sap.m.Token({ text: sText }));
            } else {
                MessageToast.show("Skill already added");
            }
        },

        onPhotoChange: function (oEvent) {
            var file = oEvent.getParameter("files")?.[0];
            if (!file) return;

            var reader = new FileReader();
            reader.onload = (e) => {
                var img = new Image();
                img.onload = () => {
                    var canvas = document.createElement("canvas");
                    var max = 400, w = img.width, h = img.height;

                    if (w > h && w > max) { h *= max / w; w = max; }
                    else if (h > max) { w *= max / h; h = max; }

                    canvas.width = w;
                    canvas.height = h;
                    canvas.getContext("2d").drawImage(img, 0, 0, w, h);

                    var base64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
                    this._photoBase64 = base64;
                    this.byId("avatarPreview").setSrc("data:image/jpeg;base64," + base64);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        },

        onResumeChange: function (oEvent) {
            var file = oEvent.getParameter("files")?.[0];
            if (!file) return;

            var reader = new FileReader();
            reader.onload = (e) => {
                this._resumeBase64 = e.target.result.split(",")[1];
                this._resumeName = file.name;
                MessageToast.show("Resume uploaded: " + file.name);
            };
            reader.readAsDataURL(file);
        },

        _updateButtons: function () {
            var cur = this._wizard.getCurrentStep();
            this._btnPrev.setEnabled(cur !== this.byId("stepPersonal").getId());
            this._btnNext.setEnabled(cur !== this.byId("stepReview").getId());
        },

        onSubmit: function () {
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

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "previewData");

            console.log("Final Submitted Data:", oData);
            MessageBox.success("Application submitted successfully!");
        }

    });
});

