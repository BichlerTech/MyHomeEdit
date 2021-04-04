SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function (toElement) {
  return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

function save() {
  var roomstring = "";
  for (var key in RoomControllers) {
	roomstring += "['room': '" + RoomControllers[key].roomm.name + "', 'Elements': ";
	
	for(ekey in RoomControllers[key].roomm.Elements) {
		var elem = RoomControllers[key].roomm.Elements[ekey];
		roomstring += "[{'name':'" + elem.model.name + "',";
		roomstring += "'type': '" + elem.model.type + "',";
		roomstring += "'x': " + elem.model.x + ",";
		roomstring += "'y': " + elem.model.y + "}";
	}
	roomstring += "]";
  }
  alert(roomstring);
}

function load(devices) {
  var devices = document.getElementById("node-layer");
  //devices.innerx
}

function switch2Room(room) {
  // show only
  for (var key in RoomControllers) {
    if(key == room) {
      actRoomController = RoomControllers[key];
	  document.getElementById(key).style.display = 'block';
	  document.getElementById(key + "_button").setAttribute("style", "background-color: lightgray;color:black;"); 
	  properties.setRoomProperties(actRoomController);
	}
	else {
	  document.getElementById(key).style.display = 'none';
	  document.getElementById(key + "_button").style.backgroundColor = 'black';
	  document.getElementById(key + "_button").style.color = 'white';
	}
  }
  
  
}

// Array where newly created devices get stored as object

// Array for All Ports with unique id of all Devices

const Ports = {
  inputPorts:[],
  outputPorts:[]
}

function storeDevice(ETHDevice) {
  DeviceArray.push(ETHDevice);
};

class InputPort {
  constructor(id) {
    this.id = `inPort_${id}`;
    this.isInput = true;
    this.connectedTo = null;
  }
  // Add port to Ports object
  addToPorts(){
    Ports.inputPorts.push(this)
  }

};

class OutputPort {
  constructor(id) {
    this.id = `outPort_${id}`;
    this.isOutput = true;
    this.connectedTo = null;
  }
  // Add port to Ports object
  addToPorts(){
    Ports.outputPorts.push(this)
  }
}

//
// CONNECTOR
// ===========================================================================
class Connector_ {

  constructor() {

    this.id = `connector_${++nextUid}`;
    this.dragType = "connector";
    this.isSelected = false;
    this.element = connectorElement.cloneNode(true);
    this.path = this.element.querySelector(".connector-path");
    this.pathOutline = this.element.querySelector(".connector-path-outline");
    this.inputHandle = this.element.querySelector(".input-handle");
    this.inoutputHandle = this.element.querySelector(".inoutput-handle");
  }

  init(port) {

    connectorLayer.appendChild(this.element);

    this.isInput = port.isInput;

    if (port.isInput) {
      this.inputPort = port;
      this.dragElement = this.inoutputHandle;
      this.staticElement = this.inputHandle;
    } else {
      this.inoutputPort = port;
      this.dragElement = this.inputHandle;
      this.staticElement = this.inoutputHandle;
    }

    this.staticPort = port;
    this.dragElement.setAttribute("data-drag", `${this.id}:connector`);
    this.staticElement.setAttribute("data-drag", `${port.id}:port`);

    TweenLite.set([this.inputHandle, this.inoutputHandle], {
      x: port.global.x,
      y: port.global.y
    });



  }

  updatePath() {

    const x1 = this.inputHandle._gsTransform.x;
    const y1 = this.inputHandle._gsTransform.y;

    const x4 = this.inoutputHandle._gsTransform.x;
    const y4 = this.inoutputHandle._gsTransform.y;

    const dx = Math.abs(x1 - x4) * bezierWeight;

    const p1x = x1;
    const p1y = y1;

    const p2x = x1 - dx;
    const p2y = y1;

    const p4x = x4;
    const p4y = y4;

    const p3x = x4 + dx;
    const p3y = y4;

    const data = `M${p1x} ${p1y} C ${p2x} ${p2y} ${p3x} ${p3y} ${p4x} ${p4y}`;

    this.path.setAttribute("d", data);
    this.pathOutline.setAttribute("d", data);
  }

  updateHandle(port) {

    if (port === this.inputPort) {

      TweenLite.set(this.inputHandle, {
        x: port.global.x,
        y: port.global.y
      });


    } else if (port === this.inoutputPort) {

      TweenLite.set(this.inoutputHandle, {
        x: port.global.x,
        y: port.global.y
      });

    }

    this.updatePath();
  }

  placeHandle() {

    const skipShape = this.staticPort.parentNode.element;

    let hitPort;

    for (let shape of shapes) {

      if (shape.element === skipShape) {
        continue;
      }

      if (Draggable.hitTest(this.dragElement, shape.element)) {

        //   const ports = this.isInput ? shape.inoutputs : shape.inputs;
        const ports = shape.inoutputs;

        for (let port of ports) {

          if (Draggable.hitTest(this.dragElement, port.portElement)) {
            hitPort = port;
            break;
          }
        }

        if (hitPort) {
          break;
        }
      }
    }

    if (hitPort) {

      if (this.isInput) {
        this.inoutputPort = hitPort;
      } else {
        this.inputPort = hitPort;
      }

      this.dragElement.setAttribute("data-drag", `${hitPort.id}:port`);

      hitPort.addConnector(this);
      this.updateHandle(hitPort);

    } else {
      this.remove();
    }
  }

  remove() {

    if (this.inputPort) {
      this.inputPort.removeConnector(this);
    }

    if (this.inoutputPort) {
      this.inoutputPort.removeConnector(this);
    }

    this.isSelected = false;

    this.path.removeAttribute("d");
    this.pathOutline.removeAttribute("d");
    this.dragElement.removeAttribute("data-drag");
    this.staticElement.removeAttribute("data-drag");

    this.staticPort = null;
    this.inputPort = null;
    this.inoutputPort = null;
    this.dragElement = null;
    this.staticElement = null;

    connectorLayer.removeChild(this.element);
    connectorPool.push(this);
  }

  onDrag() {
    this.updatePath();
  }

  onDragEnd() {
    this.placeHandle();
  }
}


//
// NODE PORT
// =========================================================================== 
class NodePort {

  constructor(parentNode, element, isInput) {

    this.id = `port_${++nextUid}`;
    this.dragType = "port";

    this.parentNode = parentNode;
    this.isInput = isInput;

    this.element = element;
    this.portElement = element.querySelector(".port");
    this.portScrim = element.querySelector(".port-scrim");

    this.portScrim.setAttribute("data-drag", `${this.id}:port`);

    this.connectors = [];
    this.lastConnector;

    const bbox = this.portElement.getBBox();

    this.global = svg.createSVGPoint();
    this.center = svg.createSVGPoint();
    this.center.x = bbox.x + bbox.width / 2;
    this.center.y = bbox.y + bbox.height / 2;

    this.update();
  }

  createConnector() {

    let connector;

    if (connectorPool.length) {
      connector = connectorPool.pop();
      connectorLookup[connector.id] = connector;
    } else {
      connector = new Connector();
    }

    connector.init(this);
    this.lastConnector = connector;
    this.connectors.push(connector);
  }

  removeConnector(connection) {

    const index = this.connectors.indexOf(connection);

    if (index > -1) {
      this.connectors.splice(index, 1);
    }
  }

  addConnector(connection) {
    this.connectors.push(connection);
  }

  update() {

    // const transform = this.portElement.getTransformToElement(diagramElement);
    
    // commented out -- does not work when Draggable isn´t loaded
    // this.global = this.center.matrixTransform(transform);

    for (let connector of this.connectors) {
      connector.updateHandle(this);
    }
  }
}


//
// NODE SHAPE
// =========================================================================== 
class ETHDevice {

  constructor(element, x, y) {

    this.id = `shape_${++nextUid}`;
    this.dragType = "shape";

    element.setAttribute("data-drag", `${this.id}:shape`);

    this.element = element;
    this.dragElement = element;

    TweenLite.set(element, { x, y });

    const inputElements = Array.from(element.querySelectorAll(".input-field"));
    const inoutputElements = Array.from(element.querySelectorAll(".inoutput-field"));

    this.inputs = inputElements.map(element => {
      const port = new NodePort(this, element, true);
      portLookup[port.id] = port;
      ports.push(port);
      return port;
    });

    this.inoutputs = inoutputElements.map(element => {
      const port = new NodePort(this, element, false);
      portLookup[port.id] = port;
      ports.push(port);
      return port;
    });
  }

  onDrag() {

    for (let input of this.inputs) {
      input.update();
    }

    for (let inoutput of this.inoutputs) {
      inoutput.update();
    }
  }
}



// DIAGRAM
// ===========================================================================
class Diagram {

  constructor() {

    this.dragElement = this.element = diagramElement;

 //   shapeElements.forEach((element, i) => {
 //     const shape = new ETHDevice(element, 50 + i * 250, 50);
 //     shapeLookup[shape.id] = shape;
 //     shapes.push(shape);
 //   });

    this.target = null;
    this.dragType = null;

    this.dragTarget = this.dragTarget.bind(this);
    this.prepareTarget = this.prepareTarget.bind(this);
    this.stopDragging = this.stopDragging.bind(this);

    this.draggable = new Draggable(dragProxy, {
      allowContextMenu: true,
      trigger: svg,
      onDrag: this.dragTarget,
      onDragEnd: this.stopDragging,
      onPress: this.prepareTarget
    });

  }

  stopDragging() {
    this.target.onDragEnd && this.target.onDragEnd();
  }

  prepareTarget(event) {

    let element = event.target;
    let drag;

    while (!(drag = element.getAttribute("data-drag")) && element !== svg) {
      element = element.parentNode;
    }

    drag = drag || "diagram:diagram";
    const split = drag.split(":");
    const id = split[0];
    const dragType = split[1];

    switch (dragType) {
      case "diagram":
        this.target = this;
        //let device = new ETHDeviceView("BTech Switch", 4, null);
        //device.add(4);
        break;

      case "shape":
        this.target = shapeLookup[id];
        break;

      case "port":
        const port = portLookup[id];
        port.createConnector();
        this.target = port.lastConnector;
        this.dragType = this.target.dragType;
        break;

      case "connector":
        this.target = connectorLookup[id];
        break;
    }

  }

  dragTarget() {

    TweenLite.set(this.target.dragElement, {
      x: `+=${this.draggable.deltaX}`,
      y: `+=${this.draggable.deltaY}`
    });


    this.target.onDrag && this.target.onDrag();
  }
}


//
// APP
// ===========================================================================
//let nextUid = 0;

const bezierWeight = 1.0;

const svg = document.querySelector("#svg");
const diagramElement = document.querySelector("#diagram");

const shapeLookup = {};
const portLookup = {};
const connectorLookup = {};
let actConnection = undefined;

const ports = [];
const shapes = [];
const connectorPool = [];

const dragProxy = document.querySelector("#drag-proxy");

document.addEventListener('mousedown', Drag.dragNode);
document.addEventListener('contextmenu', function(e) {
    alert("You've tried to open context menu"); //here you draw your own menu
    e.preventDefault();
  }, false);

function w3_open() {
  document.getElementById("main").style.marginLeft = "190px";
  document.getElementById("mySidebar").style.width = "190px";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("openNav").style.display = "none";
}
function w3_close() {
  document.getElementById("main").style.marginLeft = "0";
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("openNav").style.display = "inline-block";
}
