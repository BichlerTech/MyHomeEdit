
// add a new Functionblock (model and view)
class FunctionBlockController {
  constructor(fbt) {						// function block type - previously defined fb
    this.model = new FunctionBlockModel(fbt);
	this.view = new FunctionBlockView(this.model);
    shapeLookup[this.model.id] = this.model;
    // push function block into Device Array for easier overview
  }
  
  drawFB() {
	this.view.draw();
  }
  
  updateName(name) {
	  this.model.name = name;
	  this.view.updateCaption();
  }
  
  findPort(elemid) {
		if(elemid.indexOf('input') > 0) {
			for (var i = 0; i < this.model.inputs.length; i++) {
				if(this.model.inputs[i].id == elemid)
					return this.model.inputs[i];
			}
		} else if(elemid.indexOf('output') > 0) {
			for (var i = 0; i < this.model.outputs.length; i++) {
				if(this.model.outputs[i].id == elemid)
					return this.model.outputs[i];
			}
		}  
  }
  
  delete() {
	  this.view.delete();
  }
  
  translate(x, y) {
	  this.view.translate(x,y);
	  // update children
  }
  
  update(x, y) {
	  var deltax = x - this.model.x;
	  var deltay = y - this.model.y;
	  for (var i = 0; i < this.model.outputs.length; i++) {
		  this.model.outputs[i].translateX += deltax;
		  this.model.outputs[i].translateY += deltay;
		  var controller = this.model.outputs[i].connectionController;//new ConnectionController();
		  //controller.cm = this.model.outputs[i].portConnector;
		  // this.model.outputs[i].connectionController;
		  if(controller != undefined) {
			controller.updatePath();
		  }
	  }
	  for (var i = 0; i < this.model.inputs.length; i++) {
		  this.model.inputs[i].translateX += deltax;
		  this.model.inputs[i].translateY += deltay;
		  var controller = this.model.inputs[i].connectionController;//new ConnectionController();
		  //controller.cm = this.model.outputs[i].portConnector;
		  // this.model.outputs[i].connectionController;
		  if(controller != undefined) {
			controller.updatePath();
		  }
	  }
	  this.model.x = x;
	  this.model.y = y;
	  
  }
}

// add a new Function (model and view)
class FunctionController {
  constructor() {
    this.model = new FunctionModel();
	this.view = new FunctionView(this.model);
    shapeLookup[model.id] = model;
    // push Device into Device Array for easier overview
    actRoom.Elements[this.model.id] = this;
  }
  
  drawFunc() {
	this.view.draw();
  }
  
  updateName(name) {
	  this.model.name = name;
	  this.view.updateCaption();
  }
  
  delete() {
	  this.view.delete();
  }
}

class InputController {
  constructor() {						// function block type - previously defined fb
    this.model = new InputModel();
	this.view = new InputView(this.model);
    shapeLookup[this.model.id] = this.model;
    // push function block into Device Array for easier overview
    //actRoom.InArray[this.inm.id] = this;
  }
  
  drawInput() {
	this.view.draw();
  }
  
  updateName(name) {
	  this.model.name = name;
	  this.view.updateCaption();
  }
  
  delete() {
	  this.view.delete();
  }
}

class OutputController {
  constructor() {						// function block type - previously defined fb
    this.model = new OutputModel();
	this.view = new OutputView(this.model);
    shapeLookup[this.model.id] = this.model;
    // push function block into Device Array for easier overview
    //actRoom.OutArray[this.outm.id] = this;
  }
  
  drawOutput() {
	this.view.draw();
  }
  
  updateName(name) {
	  this.model.name = name;
	  this.view.updateCaption();
  }
  
  delete() {
	  this.view.delete();
  }
}

class ConnectionController {
	constructor() {
		this.cm = undefined;				// ConnectionModel
		actConnection = this;
	}
	
	addConnection(io) {
		var pcm = new PortConnectorModel();
		io.portConnector = pcm;
		io.connectionController = this;
				
		this.cm = new ConnectionModel();
		pcm.connection = this.cm;
		pcm.io = io;
				
		this.cm.startPort = pcm;
		this.cm.endPort = new PortConnectorModel();
	//	this.cm.endPort.connection = this.cm;
		this.cm.endPort.io = new IO();					// dummy io
		this.cm.endPort.io.translateX = io.centerX;
		this.cm.endPort.io.translateY = io.centerY;
	}
	
	removeConnection() {
		this.circle.parentElement.removeChild(this.circle);
		this.path.parentElement.removeChild(this.path);
	}
	
	draw() {
		this.connector = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		this.circle.setAttribute("r", 4);
		this.circle.setAttribute("cx", this.cm.startPort.io.centerX);
		this.circle.setAttribute("cy", this.cm.startPort.io.centerY);
		var portElem = document.getElementById(this.cm.startPort.io.id);
		portElem.childNodes[0].appendChild(this.circle);
		
		this.path = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
		var room = document.getElementById("Wohnzimmer_Licht_node-layer");
		room.appendChild(this.path);
		this.path.classList.add('connector-path');
	}
	
	finishConnect(e) {
		// find io element
		var input = document.elementFromPoint( e.clientX, e.clientY ).parentElement.parentElement;
	//	console.log(input);
		if(input.id.indexOf('-input-field-') >= 0) {
			// try to find input port;
			let io = actRoomController.findPort(input.id);
			this.cm.endPort.io = io;
			this.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			this.circle.setAttribute("r", 4);
			this.circle.setAttribute("cx", io.centerX);
			this.circle.setAttribute("cy", io.centerY);
			
			var portElem = document.getElementById(input.id);
			portElem.childNodes[0].appendChild(this.circle);
			this.cm.endPort.io.connectionController = this;
			this.cm.endPort.io.translateX = io.translateX;
			this.cm.endPort.io.translateY = io.translateY;
			this.updatePath();
		} else {
			this.removeConnection();
		}
	}
	
	updatePath() {

	if(this.cm.startPort == undefined || this.cm.endPort == undefined)
		return;
	
    const x1 = this.cm.startPort.io.translateX;
    const y1 = this.cm.startPort.io.translateY;

    const x4 = this.cm.endPort.io.translateX;
    const y4 = this.cm.endPort.io.translateY;

	var p0x = 0;
	var p0y = 0;

	var p1x = 0;
	var p1y = 0;
	
	var p2x = 0;
	var p2y = 0;
	
	var p3x = 0;
	var p3y = 0;
	
	var p4x = 0;
	var p4y = 0;
	
	if(x1 < x4) {
		//from right to left
		p0x = x1;
		p0y = y1;
		
		p1x = x1 + (x4 - x1)/2;
		p1y = y1;

		p2x = x4 - (x4 - x1)/2;
		p2y = y4;

		p3x = x4;
		p3y = y4;
		
	} else {
		//from left to right
		p0x = x1;
		p0y = y1;

		p1x = x4 - (x4 - x1)/2;
		p1y = y1;

		p2x = x4 - (x4 - x1)/2;
		p2y = y4;
		
		p3x = x4;
		p3y = y4;
	}
	
//	const data = `M${p0x} ${p0y} ${p1x} ${p1y} ${p2x} ${p2y} ${p3x} ${p3y} ${p4x} ${p4y}`;
	const data = `${p0x} ${p0y} ${p1x} ${p1y} ${p2x} ${p2y} ${p3x} ${p3y}`;

 //   this.path.setAttribute("d", data);
 //   this.pathOutline.setAttribute("d", data);
	this.path.setAttribute("points", data);
   // this.pathOutline.setAttribute("points", data);
  }
}

function addRoom(room) {
	roomController = new RoomController();
	roomController.roomm.name = room;
	RoomControllers[room] = roomController;
	actRoomController = roomController;
	
	roomController.roomv.draw();
	RoomControllerCount++;
	
	switch2Room(room);
}

class RoomController {
	constructor(name) {
		this.roomm = new RoomModel();
		this.roomm.name = name;
		this.roomv = new RoomView(this.roomm, this);
	}
	
	updateName(name) {
		RoomControllers[name] = this;
		delete RoomControllers[this.roomm.name];
		document.getElementById(this.roomm.name).id = name;
		document.getElementById(this.roomm.name + "_node-layer").id = name + "_node-layer";
		this.roomm.name = name;
		this.roomv.updateCaption();
	}
	
	addFunctionBlock(fbt) {
		var fbc = new FunctionBlockController(fbt);
		this.roomm.Elements[fbc.model.id] = fbc;
		fbc.drawFB();
	}
	
	addCPU(cput) {
		var cpuc = new CPUController(cput);
		this.roomm.Elements[cpuc.model.id] = cpuc;
		cpuc.drawCPU();
	}
	
	addInput() {
		var inp = new InputController();
		this.roomm.Elements[inp.model.id] = inp;
		inp.drawInput();
	}
	
	addOutput() {
		var outp = new OutputController();
		this.roomm.Elements[outp.model.id] = outp;
		outp.drawOutput();
	}
	
	findPort(elemid) {
		var portid = elemid;
		if(elemid.indexOf('output') > 0) {
			elemid = elemid.substring(0, elemid.indexOf('-output-field'));
		}
		else if(elemid.indexOf('input') > 0) {
			elemid = elemid.substring(0, elemid.indexOf('-input-field'));
		}
		var elem = this.roomm.Elements[elemid];
		return elem.findPort(portid);
	}
}

addRoom("Wohnzimmer_Licht");
addRoom("Kueche_Licht");
switch2Room("Wohnzimmer_Licht");