// add a new Functionblock
var headerHeight = 30;
var headerTypeHeight = 30;
var fbWidth = 220;
var fbInputWidth = 15;
var fbOutputWidth = 15;

class RoomView {
	constructor(roomm, roomc) {
		this.roomm = roomm;
		this.roomc = roomc;
	}
	
	draw() {
		// add room in tab
		var bar = document.getElementById('rooms_bottom');
		this.caption = document.createElement("button");
		this.caption.innerText = this.roomm.name;
		this.caption.id = this.roomm.name+ "_button";
		this.caption.classList.add("w3-bar-item");
		this.caption.classList.add("w3-button");
		this.caption.onclick = function(ev) {
			switch2Room(this.innerText);
		}
		bar.appendChild(this.caption);
		
		/*
		* add new room in drawing area
		*/
		var roomDiv = document.createElement('div');
		roomDiv.classList.add("room-main-div");
		roomDiv.id = this.roomm.name;
		var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
		svg.classList.add("room-main-svg");
		var nodeLayer = document.createElementNS("http://www.w3.org/2000/svg", 'g');
		nodeLayer.id = this.roomm.name + "_node-layer";
		var main = document.getElementById('rooms');
		// set room style
		
		main.appendChild(roomDiv);
		roomDiv.appendChild(svg);
		svg.appendChild(nodeLayer);
	}
	
	updateCaption() {
	  this.caption.innerHTML = this.roomm.name;
  }
}

class FunctionBlockView {
  constructor(model, controller) {			// FunctionBlockModel fb
    this.model = model;
	this.controller = controller;
	this.rootg = undefined;
  }

  draw() {
    this.rootg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.rootg.setAttribute('class', 'node-container');
	this.rootg.setAttribute('transform', 'translate(' + this.model.x + ', ' + this.model.y + ')');
	this.rootg.setAttribute('id', this.model.id);
    this.rootg.setAttribute('width', fbWidth);
    var root = document.getElementById(actRoomController.roomm.name + "_node-layer");
    root.setAttribute('x', '30');
    root.setAttribute('y', '30');
    root.setAttribute('width', fbWidth);
    root.appendChild(this.rootg);

 //   shapeElements.push(this.rootg);

	var maxports = this.model.inputs.length;

    // create node header
    var header = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    header.setAttribute('class', 'node-background');
    header.setAttribute('width', fbWidth - fbInputWidth - fbOutputWidth);
    header.setAttribute('x', fbInputWidth)
    header.setAttribute('height', (maxports - 1) * 30 + 38 + headerHeight + headerTypeHeight);
    header.setAttribute('rx', '2');
    header.setAttribute('ry', '2');
    this.rootg.appendChild(header);

    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute('class', 'node-header');
    g.setAttribute('width', fbWidth - fbInputWidth - fbOutputWidth)
    this.rootg.appendChild(g);

    let irect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    irect.setAttribute('class', 'header-rect');
    irect.setAttribute('width', fbWidth - fbInputWidth - fbOutputWidth);
    irect.setAttribute('x', fbInputWidth);
    irect.setAttribute('height', headerHeight);
    g.appendChild(irect);
	
	var typeg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    typeg.setAttribute('class', 'node-type-header');
    typeg.setAttribute('width', fbWidth - fbInputWidth - fbOutputWidth)
    this.rootg.appendChild(typeg);
	
	irect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    irect.setAttribute('class', 'header-type-rect');
    irect.setAttribute('width', fbWidth - fbInputWidth - fbOutputWidth);
    irect.setAttribute('x', fbInputWidth);
	irect.setAttribute('y', headerHeight);
    irect.setAttribute('height', headerTypeHeight);
    typeg.appendChild(irect);

    this.caption = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.caption.setAttribute('class', 'header-title');
    this.caption.setAttribute('x', fbInputWidth + ((fbWidth- fbInputWidth - fbOutputWidth)/2));
    this.caption.setAttribute('y', '25');
    this.caption.innerHTML = this.model.name;
    g.appendChild(this.caption);
	
	var itext = document.createElementNS("http://www.w3.org/2000/svg", "text");
    itext.setAttribute('class', 'header-title');
    itext.setAttribute('x', fbInputWidth + ((fbWidth- fbInputWidth - fbOutputWidth)/2));
    itext.setAttribute('y', headerHeight + 25);
    itext.innerHTML = this.model.type;
    typeg.appendChild(itext);

    g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute('class', 'node-content');
    this.rootg.appendChild(g);

    this.drawInputs(g);
	this.drawOutputs(g);
    //this.drawShape(this.rootg);
  }
  
  updateCaption() {
	  this.caption.innerHTML = this.model.name;
  }

  drawInputs(root) {
    var inputs = document.createElementNS("http://www.w3.org/2000/svg", "g");
    inputs.setAttribute('class', 'inoutputs');
    root.appendChild(inputs);
    var i;

    for (i = 1; i <= this.model.inputs.length; i++) {
      this.drawInput(inputs, i);
    }
  }
  
  drawOutputs(root) {
    var outputs = document.createElementNS("http://www.w3.org/2000/svg", "g");
    outputs.setAttribute('class', 'inoutputs');
    root.appendChild(outputs);
    var i;

    for (i = 1; i <= this.model.outputs.length; i++) {
      this.drawOutput(outputs, i);
    }
  }

  drawInput(inp, index) {
	var inputPort = this.model.inputs[index - 1];
	inputPort.id = this.model.id + '-input-field-' + index;
    var input = document.createElementNS("http://www.w3.org/2000/svg", "g");
    input.setAttribute('class', 'input-field');
    input.setAttribute('transform', 'translate(0, ' + (headerHeight + headerTypeHeight + 12 + 30 * (index-1)) + ')');
	input.id = inputPort.id;
	inputPort.centerX = fbOutputWidth/2 + 2;//fbWidth - fbOutputWidth/2;
	inputPort.centerY = 8;
	inputPort.translateX = this.model.x + fbOutputWidth/2;
	inputPort.translateY = (headerHeight + headerTypeHeight + 12 + 30 * (index-1)) + 8 + this.model.y;
    inp.appendChild(input);
    var innerinput = document.createElementNS("http://www.w3.org/2000/svg", "g");
    innerinput.setAttribute('class', 'port');
    innerinput.setAttribute('data-clickable', 'false');
    input.appendChild(innerinput);
	
    var iport = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
    iport.setAttribute('class', 'port-scrim-input');
    iport.setAttribute('points', fbInputWidth + ',0 ' + fbInputWidth + ',16 0,16 5,8 0,0');
    iport.setAttribute('data-clickable', 'false');
    iport.setAttribute('data-drag', 'port_5:port');
    innerinput.appendChild(iport);

    var inputText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    inputText.setAttribute('class', 'port-label');
	if(inputPort.inverted === true) {
		inputText.setAttribute('text-decoration', 'overline');
	}
    inputText.setAttribute('x', fbInputWidth + 10);
    inputText.setAttribute('y', '14');
    inputText.innerHTML = inputPort.name;
    input.appendChild(inputText);
    
  }
  
  drawOutput(outp, index) {
	var outputPort = this.model.outputs[index - 1];
	outputPort.id = this.model.id + '-output-field-' + index;
    var output = document.createElementNS("http://www.w3.org/2000/svg", "g");
    output.setAttribute('class', 'output-field');
    output.setAttribute('transform', 'translate(0, ' + (headerHeight + headerTypeHeight + 12 + 30 * (index-1)) + ')');
	output.id = outputPort.id;
    outp.appendChild(output);
    var inneroutput = document.createElementNS("http://www.w3.org/2000/svg", "g");
    inneroutput.setAttribute('class', 'port');
    inneroutput.setAttribute('data-clickable', 'false');
    output.appendChild(inneroutput);

    var oport = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    oport.setAttribute('class', 'port-scrim-output');
    oport.setAttribute('points', (fbWidth - fbOutputWidth)+',0 ' + (fbWidth - 5) + ',0 ' + fbWidth + ',8 ' + (fbWidth - 5) + ',16 '+(fbWidth - fbOutputWidth)+',16');
	outputPort.centerX = fbWidth - fbOutputWidth/2;
	outputPort.centerY = 8;
	outputPort.translateX = this.model.x + fbWidth - fbOutputWidth/2;
	outputPort.translateY = (headerHeight + headerTypeHeight + 12 + 30 * (index-1)) + 8 + this.model.y;
	oport.id = outputPort.id + '-port-scrim';
    inneroutput.appendChild(oport);

    var outputText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    outputText.setAttribute('class', 'port-label');
	if(outputPort.inverted === true) {
		outputText.setAttribute('text-decoration', 'overline');
	}
    outputText.setAttribute('x', fbWidth - fbOutputWidth - 10);
    outputText.setAttribute('y', '14');
    outputText.innerHTML = outputPort.name;
    output.appendChild(outputText);
  }

  delete() {
	  var parent = this.rootg.parentElement;
	  parent.removeChild(this.rootg);
  }
  
  translate(newX, newY) {
	  this.rootg.setAttribute('transform', 'translate(' + newX + ',' + newY + ")");
	  
  }
}

class PortConnectorView {
	constructor(model, controller, parent) {
		this.model = model;
		this.controller = controller;
		this.parent = parent;
	}
	
	draw() {
		console.log(port.center);
		var connector = document.createElementNS("http://www.w3.org/2000/svg", "g");
		var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		circle.setAttribute("r", 4);
		circle.setAttribute("cx", port.centerX);
		parent.appendChild(circle);
	}
}

var inputWidth = 200;
var inputOutputWidth = 15;
var inputHeight = 30;

class InputView {
  constructor(model, controller) {			// InputModel fb
    this.model = model;
	this.controller = controller;
	this.rootg = undefined;
	this.caption = undefined;
  }
  
  draw() {
    this.rootg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.rootg.setAttribute('class', 'node-container');
	this.rootg.setAttribute('id', this.model.id);
	this.rootg.setAttribute('transform', 'translate(' + this.model.x + ', ' + this.model.y + ')');
    this.rootg.setAttribute('width', inputWidth);
    var root = document.getElementById(actRoomController.roomm.name + "_node-layer");
    root.setAttribute('x', '30');
    root.setAttribute('y', '30');
    root.setAttribute('width', inputWidth);
    root.appendChild(this.rootg);

 //   shapeElements.push(this.rootg);

    // create node header
    var header = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    header.setAttribute('class', 'node-background');
    header.setAttribute('width', inputWidth - inputOutputWidth);
    header.setAttribute('height', inputHeight);
    header.setAttribute('rx', '2');
    header.setAttribute('ry', '2');
    this.rootg.appendChild(header);

    this.caption = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.caption.setAttribute('class', 'header-title');
    this.caption.setAttribute('x', '15');
    this.caption.setAttribute('y', '20');
    this.caption.innerHTML = this.model.name;
    this.rootg.appendChild(this.caption);

	this.drawOutput(this.rootg);
  }
  
  updateCaption() {
	  this.caption.innerHTML = this.model.name;
  }

  drawOutput(outp) {
    var input = document.createElementNS("http://www.w3.org/2000/svg", "g");
    input.setAttribute('class', 'output-field');
    input.setAttribute('transform', 'translate(0, 7)');
    outp.appendChild(input);
    var innerinput = document.createElementNS("http://www.w3.org/2000/svg", "g");
    innerinput.setAttribute('class', 'port');
    innerinput.setAttribute('data-clickable', 'false');
    input.appendChild(innerinput);

    var oport = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    oport.setAttribute('class', 'port-scrim');
    oport.setAttribute('points', (inputWidth - inputOutputWidth)+',0 ' + (inputWidth - 5) + ',0 ' + inputWidth + ',8 ' + (inputWidth - 5) + ',16 '+(inputWidth - inputOutputWidth)+',16')
    oport.setAttribute('data-clickable', 'false');
    oport.setAttribute('data-drag', 'port_5:port');
    innerinput.appendChild(oport);
  }

  delete() {
	  var parent = this.rootg.parentElement;
	  parent.removeChild(this.rootg);
  }
}

var outputWidth = 200;
var outputInputWidth = 15;
var outputHeight = 30;

class OutputView {
  constructor(model, controller) {			// OutputModel fb
    this.model = model;
	this.controller = controller;
	this.rootg = undefined;
	this.caption = undefined;
  }
  
  draw() {
    this.rootg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.rootg.setAttribute('class', 'node-container');
	this.rootg.setAttribute('id', this.model.id);
	this.rootg.setAttribute('transform', 'translate(' + this.model.x + ', ' + this.model.y + ')');
    this.rootg.setAttribute('width', outputWidth);
    var root = document.getElementById(actRoomController.roomm.name + "_node-layer");
 //   root.setAttribute('x', '30');
 //   root.setAttribute('y', '30');
    root.setAttribute('width', outputWidth);
    root.appendChild(this.rootg);

 //   shapeElements.push(this.rootg);

    // create node header
    var header = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    header.setAttribute('class', 'node-background');
    header.setAttribute('width', outputWidth - inputOutputWidth);
	header.setAttribute('x', outputInputWidth);
    header.setAttribute('height', inputHeight);
    header.setAttribute('rx', '2');
    header.setAttribute('ry', '2');
    this.rootg.appendChild(header);

    this.caption = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.caption.setAttribute('class', 'header-title');
    this.caption.setAttribute('x', outputInputWidth + 10);
    this.caption.setAttribute('y', '20');
    this.caption.innerHTML = this.model.name;
    this.rootg.appendChild(this.caption);

	this.drawOutput(this.rootg);
  }
  
  updateCaption() {
	  this.caption.innerHTML = this.model.name;
  }
  
  drawOutput(outp) {
    var output = document.createElementNS("http://www.w3.org/2000/svg", "g");
    output.setAttribute('class', 'input-field');
    output.setAttribute('transform', 'translate(0, 7)');
    outp.appendChild(output);
    var innerinput = document.createElementNS("http://www.w3.org/2000/svg", "g");
    innerinput.setAttribute('class', 'port');
    innerinput.setAttribute('data-clickable', 'false');
    output.appendChild(innerinput);
	
    var iport = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
    iport.setAttribute('class', 'port-scrim_input');
    iport.setAttribute('points', fbInputWidth + ',0 ' + fbInputWidth + ',16 0,16 5,8 0,0');
    iport.setAttribute('data-clickable', 'false');
    iport.setAttribute('data-drag', 'port_5:port');
    innerinput.appendChild(iport);    
  }

  delete() {
	  var parent = this.rootg.parentElement;
	  parent.removeChild(this.rootg);
  }
}