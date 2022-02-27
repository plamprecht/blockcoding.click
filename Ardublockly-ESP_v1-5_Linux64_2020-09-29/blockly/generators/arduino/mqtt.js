/**
 * MQTT GENERATOR!
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Arduino code generator for the MQTT library blocks.
 */
'use strict';

goog.provide('Blockly.Arduino.mqtt');

goog.require('Blockly.Arduino');


/**
 * Code generator for the mqtt server setup.
 * @MANDATORY!! TO RUN this Block you need to add the PubSubClient Library into Arduino IDE
 * Please Setup Serial before this Block to see all the status messages
 */
 
Blockly.Arduino['mqtt_server_connect'] = function(block) {
  var mqtt_server = block.getFieldValue('MQTT Server');
  var mqtt_server_port = block.getFieldValue('MQTT Server Port');
  var mqtt_client_name = Blockly.Arduino.valueToCode(block, 'MQTT Client name', Blockly.Arduino.ORDER_ATOMIC);
  var mqtt_client_name_variable = Blockly.Arduino.valueToCode(block, 'MQTT Client name variable', Blockly.Arduino.ORDER_ATOMIC);
  var mqtt_user = block.getFieldValue('MQTT User');
  var mqtt_password = block.getFieldValue('MQTT Password');
  
  var variable_mqtt_server = "const char* mqtt_server = \""+ mqtt_server + "\";";
  if(mqtt_server_port == "")
	  var variable_mqtt_server_port = "const int mqtt_port = 1883;";
  else
	  var variable_mqtt_server_port = "const int mqtt_port = "+ mqtt_server_port + ";";
  
  if(mqtt_client_name_variable == ""){
	  var variable_mqtt_client_name = "const char* mqtt_client_name;";
	  var setupCode_mqtt_client_name = "String mqtt_client_name_str = " + mqtt_client_name + ";\n  ";
	  setupCode_mqtt_client_name += "mqtt_client_name = mqtt_client_name_str.c_str();";
  }
  else{
	  var variable_mqtt_client_name = "const char* mqtt_client_name;\n";
	  variable_mqtt_client_name += "String " + mqtt_client_name_variable + ";";
	  var setupCode_mqtt_client_name = mqtt_client_name_variable + " = " + mqtt_client_name + ";\n  ";
	  setupCode_mqtt_client_name += "const char* mqtt_client_name = " + mqtt_client_name_variable + ".c_str();";
  }
  var variable_mqtt_user = "const char* mqtt_user = \""+ mqtt_user + "\";";
  var variable_mqtt_password = "const char* mqtt_password = \""+ mqtt_password + "\";";
  
  var define_WiFiClient = "WiFiClient espClient;";
  var define_PubSubClient = "PubSubClient client(espClient);";
  
  var setupCode_mqtt_SetServer = "client.setServer(mqtt_server, mqtt_port);";
  
  //connect to MQTT Server
  var setupCode_mqtt_Connect = "Serial.print(\"Connecting to MQTT Server\");" + "\n  ";
  setupCode_mqtt_Connect += "while (!client.connected()) {" + "\n";
  setupCode_mqtt_Connect += "    Serial.print(\".\");" + "\n";
  if(mqtt_user == "")
	  setupCode_mqtt_Connect += "    if(client.connect(mqtt_client_name))" + "\n";
  else
	  setupCode_mqtt_Connect += "    if(client.connect(mqtt_client_name, mqtt_user, mqtt_password))" + "\n";
  setupCode_mqtt_Connect += "      Serial.println(\"\\nMQTT connected!\");" + "\n";
  setupCode_mqtt_Connect += "    else {" + "\n";
  setupCode_mqtt_Connect += "      Serial.print(\"\\nMQTT Connection failed with state: \");" + "\n";
  setupCode_mqtt_Connect += "      Serial.println(client.state());" + "\n" + "      delay(2000);\n    }\n  }";
  
  Blockly.Arduino.addInclude('mqtt', '#include <PubSubClient.h>');
  Blockly.Arduino.addVariable("mqtt_server", variable_mqtt_server, true);
  Blockly.Arduino.addVariable("mqtt_server_port", variable_mqtt_server_port, true);
  Blockly.Arduino.addVariable("mqtt_client_name", variable_mqtt_client_name, true);
  Blockly.Arduino.addVariable("mqtt_user", variable_mqtt_user, true);
  Blockly.Arduino.addVariable("mqtt_password", variable_mqtt_password, true);
  Blockly.Arduino.addVariable("WiFiClient", define_WiFiClient, true);
  Blockly.Arduino.addVariable("PubSubClient", define_PubSubClient, true);
  Blockly.Arduino.addSetup("mqtt_SetClientName", setupCode_mqtt_client_name, true);
  Blockly.Arduino.addSetup("mqtt_SetServer", setupCode_mqtt_SetServer, true);
  Blockly.Arduino.addSetup("mqtt_Connect", setupCode_mqtt_Connect, true);
  
  return "";
};

Blockly.Arduino['mqtt_publish'] = function(block) {
  var mqtt_topic = Blockly.Arduino.valueToCode(this, 'MQTT_topic', Blockly.Arduino.ORDER_ATOMIC);
  var mqtt_message = Blockly.Arduino.valueToCode(this, 'MQTT_message', Blockly.Arduino.ORDER_ATOMIC);
  var code = "client.publish(String(" + mqtt_topic + ").c_str(), String(" + mqtt_message + ").c_str());\n";
  return code;
};

Blockly.Arduino['mqtt_subscribe_function'] = function(block) {
  var mqtt_subscribe_blocks = Blockly.Arduino.statementToCode(block, 'MQTT_Subscribe_Blocks');
  mqtt_subscribe_blocks = Blockly.Arduino.addLoopTrap(mqtt_subscribe_blocks, block.id);
    
  var function_mqtt_callback = "void mqtt_callback(char* topic, byte* message_byte, unsigned int length) {\n  ";
  function_mqtt_callback += "char* tmp_message = (char*) calloc(length+1,sizeof(char));\n  "
  function_mqtt_callback += "for (int z = 0; z < length; z++){\n    ";
  function_mqtt_callback += "tmp_message[z] = (char)message_byte[z];\n  ";
  function_mqtt_callback += "}\n  ";
  function_mqtt_callback += "tmp_message[length] = '\\0'; //set null char as end of string\n  ";
  function_mqtt_callback += "String message = String(tmp_message);\n";
  function_mqtt_callback += mqtt_subscribe_blocks;
  function_mqtt_callback += "}";
  
  var setupCode_mqtt_SetCallback = "client.setCallback(mqtt_callback);";
  
  Blockly.Arduino.addFunction("mqtt_callback_function", function_mqtt_callback);
  Blockly.Arduino.addSetup("mqtt_setcallback", setupCode_mqtt_SetCallback, true);
  
  return '';
};

Blockly.Arduino['mqtt_subscribe'] = function(block) {
  var mqtt_topic = Blockly.Arduino.valueToCode(block, 'MQTT_topic', Blockly.Arduino.ORDER_ATOMIC);
  var mqtt_topic_actions_blocks = Blockly.Arduino.statementToCode(block, 'MQTT_topic_actions');
  
  var function_mqtt_callback_subscribe = "if (strcmp(topic, "+ mqtt_topic + ") == 0){\n";
  function_mqtt_callback_subscribe += mqtt_topic_actions_blocks + "}\n";
  
  var setupCode_mqtt_subscribe = "client.subscribe(String(" + mqtt_topic + ").c_str());\n  ";
  setupCode_mqtt_subscribe += "Serial.println(\"Subscribed to MQTT topic '" + mqtt_topic.replace(/"/g, "") + "'\");";
  
  Blockly.Arduino.addSetup("mqtt_subscribe_" + mqtt_topic, setupCode_mqtt_subscribe, true);
  
  return function_mqtt_callback_subscribe;
};

Blockly.Arduino['mqtt_subscribe_get_content'] = function(block) {
  var code = "client.loop();\n";
  
  return code;
};
