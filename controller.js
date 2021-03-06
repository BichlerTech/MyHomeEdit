
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
  
  delete() {
	  this.view.delete();
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
	}
	
	createConnector() {

		let connector;

	//	if (connectorPool.length) {
	//	  connector = connectorPool.pop();
	//	  connectorLookup[connector.id] = connector;
	//	} else {
		  connector = new Connector();
	//	}

		connector.init(this);
	//	this.lastConnector = connector;
	//	this.connectors.push(connector);
	}
	
	updatePath() {

    const x1 = this.inputHandle._gsTransform.x;
    const y1 = this.inputHandle._gsTransform.y;

    const x4 = this.inoutputHandle._gsTransform.x;
    const y4 = this.inoutputHandle._gsTransform.y;

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
    this.pathOutline.setAttribute("points", data);
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
}

addRoom("Wohnzimmer_Licht");
addRoom("Kueche_Licht");
switch2Room("Wohnzimmer_Licht");