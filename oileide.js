(function () {
	var oileide = function () {
		var self = {},
		// For Demo only
			timeout = 200,
			autoMode = false,
			autoRegex = /^oileide\[([a-zA-Z 0-9\-_]*)\]$/,
			cassandrasVeil = null;

		/**
		 * initialize XMLHttpObject
		 *
		 * @return new XMLHttpObject or equivalent on IE 5/6 or null
		 * @type {XMLHttpRequest}
		 * */
		self.sail = function () {
			var xmlHttp = null,
				MsXmlHttpVersions = ['MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'],
				i;
			if (window.XMLHttpRequest) {
				xmlHttp = new XMLHttpRequest();
			} else {
				for (i = 0; i < MsXmlHttpVersions.length; i += 1) {
					try {
						xmlHttp  = new MsXmlHttpVersions[i]();
						break;
					} catch (e) {}
				}
			}
			return xmlHttp;
		};

		/**
		 * loads json object via Ajax
		 * */
		self.loadJson = function () {
		};

		/**
		 * loads html document and returns its body via Ajax
		 *
		 * @param {string} url URL to load via ajax request
		 * @param {string} callBackFunction function to execute after html is loaded
		 * @param {boolean} asynchronous indicates whether the call is asynchronous, defaults to true
		 * @param {string} requestMethod how to call the URL, defaults to 'GET'
		 * @param {string} postData postData to send via Ajax, defaults to null
		 * @param {string} elementId ID of DOM element to give to callback function along with the return data of the Ajax request, defaults to null
		 *
		 * @return status for NOT successful loading
		 * @type boolean
		 * */
		self.loadHtml = function (url, callbackFunction, asynchronous, requestMethod, postData, elementId) {
			if (asynchronous === undefined) {
				asynchronous = true;
			}
			if (requestMethod === undefined) {
				requestMethod = 'GET';
			}
			if (postData === undefined) {
				postData = null;
			}
			if (elementId === undefined) {
				elementId = null;
			}
			var xmlHttp = self.sail(),
				bodyContent;
			if (xmlHttp !== null) {
				if (asynchronous === true) {
					xmlHttp.onreadystatechange = function () {
						if (xmlHttp.readyState === 4) {
							if (xmlHttp.status === 200 || xmlHttp.status === 304) {
								bodyContent = xmlHttp.responseText;
								callbackFunction(elementId, bodyContent);
								return false;
							} else {
								return true;
							}
						}
					};
				}
				xmlHttp.open(requestMethod, url, asynchronous);
				xmlHttp.send(postData);
				if (asynchronous === false) {
					if (xmlHttp.status === 200 || xmlHttp.status === 304) {
						bodyContent = xmlHttp.responseText;
						callbackFunction(elementId, bodyContent);
						return false;
					} else {
						return true;
					}

				}
			} else {
				return true;
			}
		};

		/**
		 * writes HTML into a DOM element
		 *
		 * @param {string} elementId ID of the DOM element to write to
		 * @param {string} content content to write into DOM element
		 * */
		self.writeHtml = function (elementId, content) {
			var element = document.getElementById(elementId),
				start,
				end;
			if (element) {
				//var currentNodes = element.childNodes
				//for (var i=0; i++; i<currentNodes.length) {
				//	var currentNode = currentNodes[i];
				//	if (currentNodes[i].nodeType == 1 || currentNodes[i].nodeType == 3) {
				//		element.removeChild(currentNodes[i]);
				//	}
				//}
				//TODO: Replace with real DOM
				start = content.indexOf("<body");
				start = content.indexOf(">", start);
				end = content.lastIndexOf("</body>");
				content = content.slice(start + 1, end);
				element.innerHTML = content;
				if (autoMode === true) {
					self.launchJavelin(element);
				}
			}
		};

		/**
		 * loads html document and writes its body into specified element
		 *
		 * @param {string} url URL to load via ajax request
		 * @param {string} elementId ID of DOM element to give to callback function along with the return data of the Ajax request, defaults to null
		 * @param {boolean} asynchronous indicates whether the call is asynchronous, defaults to true
		 * @param {string} requestMethod how to call the URL, defaults to 'GET'
		 * @param {string} postData postData to send via Ajax, defaults to null
		 * @param {string} callBackFunction function to execute after html is loaded
		 *
		 * @return status of NOT successfully loaded HTML
		 * @type boolean
		 * */
		self.insertHtml = function (url, elementId, asynchronous, requestMethod, postData) {
			return self.loadHtml(url, self.writeHtml, asynchronous, requestMethod, postData, elementId);
		};

		/**
		 * executes link of anchor element via ajax
		 *
		 * @param {object} aElement anchor element which was clicked
		 * @param {boolean} appendToLocation indicates whether to add element ID to hash
		 *
		 * @return status of NOT successfully inserted href
		 * @type boolean
		 * */
		self.autoInsert = function (aElement, appendToLocation) {
			var url = aElement.getAttribute('href'),
				stringToAppend = aElement.getAttribute('id'),
				matches = autoRegex.exec(aElement.rel),
				elementId = matches[1],
				status = true;

			self.showVeil(elementId);
			status = self.insertHtml(url, elementId, appendToLocation);
			if (appendToLocation === true) {
				self.appendToLocation(stringToAppend);
			}
			return status;
		};

		/**
		 * duplicates overlay and shows it over element
		 *
		 * @param {string} elementId ID of element to show overlay over it
		 * */
		self.showVeil = function (elementId) {
			var element = document.getElementById(elementId),
				veil,
				offset;
			if (element !== null) {
				veil = cassandrasVeil.cloneNode(true);
				offset = self.findPos(element);
				veil.style.left = offset[0];
				veil.style.top = offset[1];
				veil.style.width = element.offsetWidth + 'px';
				veil.style.height = element.offsetHeight + 'px';
				veil.style.display = 'block';
				element.appendChild(veil);
			}
		};

		/**
		 * returns position of DOM element
		 *
		 * @param {object} element DOM element to get position
		 * @return x and y position of element
		 * @type array
		 * */
		self.findPos = function (element) {
			var curleft = 0,
				curtop = 0;
			if (element.offsetParent) {
				do {
					curleft += element.offsetLeft;
					curtop += element.offsetTop;
				} while (element = element.offsetParent);
			}
			return [curleft, curtop];
		};


		/**
		 * loads xml document via Ajax
		 * */
		self.loadXml = function () {
		};

		/**
		 * append oleide to DOM element
		 *
		 * @param {object} node DOM node to parse for anchor elements
		 * */
		self.launchJavelin = function (node) {
			var aElements = node.getElementsByTagName("a"),
				i;
			for (i = 0; i < aElements.length; i += 1) {
				if (autoRegex.test(aElements[i].rel)) {
					aElements[i].onclick = function () {
						window.oileide.autoInsert(this, true);
						return false;
					};
				}
			}
		};

		/**
		 * appends string to browser location hash
		 *
		 * @param {string} anchorToAppend string to append to location hash
		 * */
		self.appendToLocation = function (anchorToAppend) {
			if (window.location.hash === '') {
				window.location.hash = anchorToAppend;
			} else {
				window.location.hash += ',' + anchorToAppend;
			}
		};

		/**
		 * reads hash from browser location and executes the indicated ajax requests synchronous
		 * */
		self.readFromLocation = function () {
			var clickedLinkIds = window.location.hash.substr(1).split(','),
				i,
				aElement;
			for (i = 0; i < clickedLinkIds.length; i += 1) {
				aElement = document.getElementById(clickedLinkIds[i]);
				if (aElement !== null) {
					/*if (timeout !== undefined && timeout > 0) {
						window.setTimeout(self.autoInsert(aElement, false), timeout);
					} else {*/
						self.autoInsert(aElement, false);
					//}
				}
			}
		};

		/**
		 * creates master overlay for loading elements
		 * */
		self.createCassandrasVeil = function () {
			cassandrasVeil = document.createElement('div');
			cassandrasVeil.className = 'cassandras-veil';
			cassandrasVeil.style.display = 'none';
			var loadingImage = document.createElement('img');
			loadingImage.src = 'loading.gif';
			cassandrasVeil.appendChild(loadingImage);
		}

		/**
		 * switches to automode
		 * */
		self.run = function () {
			autoMode = true;
			self.createCassandrasVeil();
			var bodyNode = document.getElementsByTagName("body");
			self.launchJavelin(bodyNode[0]);
			self.readFromLocation();
		};

		return self;
	};
	window.oileide = oileide();
}());
