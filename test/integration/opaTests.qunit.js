/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["naruto/wizardapp/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
