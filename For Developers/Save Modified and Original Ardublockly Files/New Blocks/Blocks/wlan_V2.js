/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Blocks for Arduino WIFI library.
 *     The Arduino WIFI functions syntax can be found in the following URL:
 *     http://arduino.cc/en/Reference/Stepper
 *     Note that this block uses the Blockly.FieldInstance instead of
 *     Blockly.FieldDropdown which generates a unique instance per setup block
 *     in the workspace.
 */
'use strict';

goog.provide('Blockly.Blocks.wifi');

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');



Blockly.Blocks['connect_to_wlan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Connect to this WLAN Network:");
    this.appendDummyInput()
        .appendField("WLAN SSID")
        .appendField(new Blockly.FieldTextInput(""), "SSID");
    this.appendDummyInput()
        .appendField("WLAN Key")
        .appendField(new Blockly.FieldTextInput(""), "Key");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Connect ESP with an existing WIFI Network");
 this.setHelpUrl("https://techtutorialsx.com/2017/04/24/esp32-connecting-to-a-wifi-network/");
  }
};

Blockly.Blocks['start_wifi_access_point'] = {
  init: function() {
    this.appendValueInput("SSID")
        .setCheck("String")
        .appendField("WIFI SSID");
    this.appendValueInput("Key")
        .setCheck("String")
        .appendField("WIFI Key");
    this.setInputsInline(true);
	this.appendStatementInput("while_wifi_connected")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Start a WIFI Access Point with the ESP");
 this.setHelpUrl("https://randomnerdtutorials.com/esp32-access-point-ap-web-server/");
  }
};