/*
* this file contains all possible element models
* like FunctionBlock, Function, Input, Output, ..
*/
class FunctionBlockModel {
  constructor(fbt) {
    this.id = `fb_${actRoomController.roomm.ElementsCount++}`;
    this.name = fbt.name;
	this.type = fbt.type;
    //this.ports = ports;
    this.inputs = [];
	this.outputs = [];
	this.copyInputs(fbt.inputs);
	this.copyOutputs(fbt.outputs);
	this.x = 50;								// default translattion x
	this.y = 50;								// default translattion y
  }
  
  copyInputs(inputs) {
	  for (var i = 0; i < inputs.length; i++) {
		this.inputs.push({"": inputs[i].type});
	  }
  }
  
  copyOutputs(outputs) {
	  for (var i = 0; i < outputs.length; i++) {
		this.outputs.push({"": outputs[i].type});
	  }
  }
}

class IO {
	constructor() {
		this.name = "";
		this.type = "";
		this.centerX = 0;
		this.centerY = 0;
		this.portConnector = undefined;			// PortConnectorModel
		this.connectionController = undefined;
		this.translateX = 0;
		this.translateY = 0;
	}
}

class PortConnectorModel {
	constructor() {
		this.connection = undefined;				// ConnectionController
		this.io = undefined;						// IO
	}
}

class ConnectionModel {
	constructor() {
		this.startPort = undefined;					// PortConnectorModel
		this.endPort = undefined;					// PortConnectorModel
	}
}

class FunctionModel {
  constructor() {
    this.id = `func_${actRoomController.FuncArray.length + 1}`;
    this.name = "";
   // this.ports = ports;
    this.inputPorts = [];
    this.outputPorts = [];
	this.x = 50;								// default translattion x
	this.y = 50;								// default translattion y
  }
}

class InputModel {
  constructor() {
	this.id = `in_${actRoomController.roomm.ElementsCount++}`;
    this.name = "Input";
	this.type = "input";
	this.output = undefined;
	this.x = 50;								// default translattion x
	this.y = 50;								// default translattion y
  }
}

class OutputModel {
  constructor() {
	this.id = `out_${actRoomController.roomm.ElementsCount++}`;
    this.name = "Output";
	this.type = "output";
	this.input = undefined;
	this.x = 50;								// default translattion x
	this.y = 50;								// default translattion y
  }
}

//
// CONNECTOR
// ===========================================================================
class Connector {

  constructor(connectionType) {
    this.id = `connector_${++actRoomController.nextUid}`;
//    this.dragType = "connector";
//    this.isSelected = false;
//    this.element = connectorElement.cloneNode(true);
//	this.connectionType = connectionType;
	this.elementin = undefined;
	this.elementout = undefined;
  }
}

class RoomModel {
  constructor(name) {
    this.name = name;
	this.Elements = {};
	this.ElementsCount = 0;
    this.FBArray = {};
    this.FBArrayCount = 0;
    this.FuncArray = {};
    this.FuncArrayCount = 0;
    this.InArray = {};
    this.InArrayCount = 0;
    this.OutArray = {};
    this.OutArrayCount = 0;
	this.nextUid = 0;
  }
}

// test fb type
var fbt = {
	"name": "Licht",
	"type": "Lichtsteuerung X5", 
	"inputs" : [						// IO
	  {
		  "name": "eingang1",
		  "type" : "bool"
	  },
	  {
		  "name": "eingang2",
		  "type" : "bool"
	  },
	  {
		  "name": "eingang3",
		  "type" : "bool"
	  },
	  {
		  "name": "eingang4",
		  "type" : "bool"		  
	  },
	  {
		  "name": "eingang5",
		  "type" : "bool"		  
	  }
	],
	"outputs" : [
	  {
		  "name": "ausgang",
		  "type" : "bool"
	  }
	,
	  {
		  "name": "ausgang_inv",
		  "type" : "bool",
		  "inverted": true
	  }
	]
  }
  
  // test roll type
var roll = {
	"name": "Rollladen",
	"type": "Rollladen X1", 
	"inputs" : [
	  {
		  "name": "rauf",
		  "type" : "bool"
	  },
	  {
		  "name": "stop",
		  "type" : "bool"
	  },
	  {
		  "name": "runter",
		  "type" : "bool"
	  }
	],
	"outputs" : [
	  {
		  "name": "rauf",
		  "type" : "bool"
	  }
	,
	  {
		  "name": "runter",
		  "type" : "bool",
		  "inverted": true
	  }
	]
  }
// *******************************************************************************
//
// Array where newly created fbs, functions, outputs, .. get stored as object
//
// *******************************************************************************
//const FBArray = {};
//var FBArrayCount = 0;
//const FuncArray = {};
//var FuncArrayCount = 0;
//const InArray = {};
//var InArrayCount = 0;
//const OutArray = {};
//var OutArrayCount = 0;
//var actRoomController = new RoomController("Wohnzimmer_Licht");
var RoomControllers = {};
var actRoomController = undefined;
var RoomControllerCount = 0;
//Rooms["Wohnzimmer_Licht"] = actRoom;
//Rooms["Kueche_Licht"] = new Room("Kueche_Licht");
