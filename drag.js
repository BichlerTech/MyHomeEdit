// dragging functions
const Drag = (() => {
	let offsetX;
	let offsetY;
	let nodeContainer = null;
	let newX = 0;
	let newY = 0;
	function updatePosition(element, x, offsetX, y, offsetY) {
		const menuWidth = document.querySelector('.w3-bar-block').getBoundingClientRect().width;
		if (element !== null) {
			var elem = actRoomController.roomm.Elements[element.id];
			newX = x - offsetX + elem.model.x;
			newY = y - offsetY + elem.model.y;
			newX = Math.round(newX / 5) * 5;
			newY = Math.round(newY / 5) * 5;
			elem.translate(newX, newY);
		}
	};
	
	function updateConnectionPosition(io, x, offsetX, y, offsetY) {
		const menuWidth = document.querySelector('.w3-bar-block').getBoundingClientRect().width;
		if (io !== null) {
			newX = x - offsetX;
			newY = y;
			io.translateX = newX;
			io.translateY = newY;
		}
	};

	function getOffset(measurement, offset, clientPosition) {
		return measurement - (measurement + offset - clientPosition);
	};
	
	function mouseUpConnection(e) {
		// test if it is on io element
		actConnection.finishConnect(e);
		document.removeEventListener('mousemove', moveConnection);
		document.removeEventListener('mouseup', mouseUpConnection);
	}
	
	function moveConnection(e) {
		updateConnectionPosition(actConnection.cm.endPort.io, e.clientX, offsetX, e.clientY, offsetY)
		actConnection.updatePath();
	}
	
	function mouseUpMove(e) {
		//console.log(e.target.parentElement.parentElement);
		if(nodeContainer != null) {
			var elem = actRoomController.roomm.Elements[nodeContainer.id];
			if(elem != undefined) {
			// controller.updateX()
				elem.update(newX, newY);
			}
		} else {
						// 
		}
		nodeContainer = null;
		document.removeEventListener('mousemove', move);
		document.removeEventListener('mouseup', mouseUpMove);
	}
	
	function move(e) {
		updatePosition(nodeContainer, e.clientX, offsetX, e.clientY, offsetY)
	}
	return {
		dragNode(e) {

			nodeContainer = e.target.parentElement;
			if (!nodeContainer.classList.contains('node-container')) {
				nodeContainer = nodeContainer.parentElement;
			}
			if (nodeContainer.classList.contains('node-container')) {

				const rect = nodeContainer.getBoundingClientRect();
				offsetX = e.clientX;
				offsetY = e.clientY;
 
				document.addEventListener('mousemove', move);

				document.addEventListener('mouseup', mouseUpMove);

				var button = e.which || e.button;
				var del = false;
				if (button === 3) {
					del = true;
				}
				var id = nodeContainer.getAttribute('id');

				if (id.startsWith('fb_')) {
					var elem = actRoomController.roomm.Elements[id];
					if (del) {
						// delete FB
						elem.delete();
						delete actRoomController.roomm.Elements[id];
					}
					else {
						properties.setFBProperties(elem);
					}
				} else if (id.startsWith('func_')) {
					var elem = actRoomController.roomm.Elements[id];
					if (del) {
						// delete Func
						elem.delete();
						delete actRoomController.roomm.Elements[id];
					}
					else {
						properties.setFuncProperties(elem);
					}
				} else if (id.startsWith('in_')) {
					var elem = actRoomController.roomm.Elements[id];
					if (del) {
						// delete input
						elem.delete();
						delete actRoomController.roomm.Elements[id];
					}
					else {
						properties.setInputProperties(elem);
					}
				} else if (id.startsWith('out_')) {
					var elem = actRoomController.roomm.Elements[id];
					if (del) {
						// delete Output
						elem.delete();
						delete actRoomController.roomm.Elements[id];
						return false;
					}
					else {
						properties.setOutputProperties(elem);
					}
				}
			} else if (nodeContainer.classList.contains('output-field')) {
				
				var io = actRoomController.findPort(nodeContainer.id);			// IO
				offsetX = e.clientX - io.translateX;
				offsetY = e.clientY;
				new ConnectionController();
				actConnection.addConnection(io);
				actConnection.draw();
				document.addEventListener('mousemove', moveConnection);
				document.addEventListener('mouseup', mouseUpConnection);
			} else if (nodeContainer.classList.contains('input-field')) {
				var port = actRoomController.findPort(nodeContainer.id);
				//document.addEventListener('mousemove', moveConnection);
				//document.addEventListener('mouseup', function (e) {
			//		document.removeEventListener('mousemove', moveConnection);
				//});
			} else {
				nodeContainer = null;
			}
		}
	}
})();