sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/m/SelectDialog",
  "sap/m/StandardListItem",
  "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, MessageBox, SelectDialog, StandardListItem, JSONModel) {
  "use strict";

  return Controller.extend("naruto.wizardapp.controller.View1", {

    onInit: function () {
      this._wizard = this.byId("jobWizard");
      this._btnNext = this.byId("btnNext");
      this._btnPrev = this.byId("btnPrev");

      var oDataModel = new JSONModel();
      oDataModel.loadData("../model/data.json");
      this.getView().setModel(oDataModel);

      
      var oAppModel = new JSONModel({ application: {} });
      this.getView().setModel(oAppModel, "app");
    },

    onCountryChange: function (oEvent) {
      var countryCode = oEvent.getParameter("selectedItem")?.getKey();
      var states = this.getView().getModel().getProperty("/states").filter(s => s.countryCode === countryCode);
      this.byId("cbState").setModel(new JSONModel(states));
      this.byId("cbCity").setModel(new JSONModel([]));
      this.getView().getModel("app").setProperty("/application/country", this._getName("/countries", countryCode));
    },

    onStateChange: function (oEvent) {
      var stateCode = oEvent.getParameter("selectedItem")?.getKey();
      var cities = this.getView().getModel().getProperty("/cities").filter(c => c.stateCode === stateCode);
      this.byId("cbCity").setModel(new JSONModel(cities));
      this.getView().getModel("app").setProperty("/application/state", this._getName("/states", stateCode));
    },

    _getName: function (path, key) {
      var arr = this.getView().getModel().getProperty(path) || [];
      var found = arr.find(i => i.code === key);
      return found ? found.name : "";
    },


    onCollegeValueHelp: function () {
      var colleges = this.getView().getModel().getProperty("/colleges") || [];
      var that = this;

      new SelectDialog({
        title: "Select College",
        items: { path: "/", template: new StandardListItem({ title: "{name}", description: "{city}" }) },
        liveChange: function (evt) {
          var val = evt.getParameter("value");
          evt.getSource().getBinding("items").filter([new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, val)]);
        },
        confirm: function (evt) {
          var sel = evt.getParameter("selectedItem");
          if (sel) {
            that.byId("inpCollege").setValue(sel.getTitle());
            that.getView().getModel("app").setProperty("/application/college", sel.getTitle());
          }
        },
        cancel: function () {}
      }).setModel(new JSONModel(colleges)).open();
    },

    /* ---------------------------
       Skills MultiInput
       --------------------------- */
    onSkillsValueHelp: function (oEvent) {
      var skills = this.getView().getModel().getProperty("/skills") || [];
      var that = this;

      new SelectDialog({
        title: "Select Skill",
        items: { path: "/", template: new StandardListItem({ title: "{skill}" }) },
        confirm: function (evt) {
          var skill = evt.getParameter("selectedItem")?.getTitle();
          that._addSkill(skill);
        }
      }).setModel(new JSONModel(skills)).open();
    },

    onSkillSubmit: function (oEvent) {
      var val = oEvent.getParameter("value");
      if (val?.trim()) this._addSkill(val.trim());
      oEvent.getSource().setValue("");
    },

    _addSkill: function (sText) {
      var mi = this.byId("miSkills");
      if (!mi.getTokens().some(t => t.getText().toLowerCase() === sText.toLowerCase())) {
        mi.addToken(new sap.m.Token({ text: sText }));
      } else {
        MessageToast.show("Skill already added");
      }
      this._syncSkills();
    },

    _syncSkills: function () {
      var skills = this.byId("miSkills").getTokens().map(t => t.getText());
      this.getView().getModel("app").setProperty("/application/skills", skills);
    },

    /* ---------------------------
       File Uploads
       --------------------------- */
    onPhotoChange: function (oEvent) {
      var file = oEvent.getParameter("files")[0];
      if (!file) return;

      var reader = new FileReader();
      reader.onload = e => {
        var img = new Image();
        img.onload = () => {
          var canvas = document.createElement("canvas");
          var max = 400, w = img.width, h = img.height;
          if (w > h && w > max) { h *= max / w; w = max; } else if (h > max) { w *= max / h; h = max; }
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          var base64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
          this.byId("avatarPreview").setSrc(canvas.toDataURL("image/jpeg", 0.8));
          this.getView().getModel("app").setProperty("/application/photoData", base64);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    onResumeChange: function (oEvent) {
      var file = oEvent.getParameter("files")[0];
      if (!file) return;

      var reader = new FileReader();
      reader.onload = e => {
        var base64 = e.target.result.split(",")[1];
        var app = this.getView().getModel("app");
        app.setProperty("/application/resumeData", base64);
        app.setProperty("/application/resumeName", file.name);
        MessageToast.show("Resume loaded: " + file.name);
      };
      reader.readAsDataURL(file);
    },

    /* ---------------------------
       Wizard Navigation
       --------------------------- */
    onNext: function () {
      if (!this._validateStep()) return;
      this._wizard.nextStep();
      this._updateButtons();
    },

    onPrevious: function () {
      this._wizard.previousStep();
      this._updateButtons();
    },

    _updateButtons: function () {
      var cur = this._wizard.getCurrentStep();
      this._btnPrev.setEnabled(cur !== this.byId("stepPersonal").getId());
      this._btnNext.setEnabled(cur !== this.byId("stepReview").getId());
    },

    _validateStep: function () {
      var stepId = this._wizard.getCurrentStep();
      var app = this.getView().getModel("app");

      if (stepId === this.byId("stepPersonal").getId()) {
        var n = this.byId("inpName").getValue().trim(),
            e = this.byId("inpEmail").getValue().trim(),
            p = this.byId("inpPhone").getValue().trim(),
            c = this.byId("cbCountry").getSelectedKey(),
            s = this.byId("cbState").getSelectedKey(),
            city = this.byId("cbCity").getSelectedKey();
        if (!n || !e || !p || !c || !s || !city) { MessageToast.show("Please fill all personal details"); return false; }
      }

      if (stepId === this.byId("stepAcademic").getId()) {
        var college = this.byId("inpCollege").getValue().trim(),
            cgpa = parseFloat(this.byId("inpCgpa").getValue()),
            year = this.byId("inpYear").getValue().trim();
        if (!college || isNaN(cgpa) || cgpa < 0 || cgpa > 10 || !/^(19|20)\d{2}$/.test(year)) { MessageToast.show("Invalid academic details"); return false; }
      }

      if (stepId === this.byId("stepJob").getId()) {
        var role = this.byId("cbRole").getSelectedKey(),
            exp = parseFloat(this.byId("inpExp").getValue()),
            skills = this.byId("miSkills").getTokens();
        if (!role || isNaN(exp) || exp < 0 || skills.length === 0) { MessageToast.show("Invalid job details"); return false; }
      }
      return true;
    },

    /* ---------------------------
       Submit
       --------------------------- */
    onSubmit: function () {
      var data = this.getView().getModel("app").getProperty("/application");
      console.log("Application:", data);
      MessageBox.success("Application submitted successfully!");
    },

    onWizardComplete: function () {
      MessageToast.show("Wizard completed - press Submit to send application");
    }

  });
});
