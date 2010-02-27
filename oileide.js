/* -----------------------------------------------------------------------------------
	Oileide v 0.1
	by Thomas Mayer - http://ix.residuum.org/oileide/oileide.html
	License: MIT license, i.e. more or less: Do As Thou Wilst (with the code) Shall
	Be The Whole of The Law.

	Copyright (c) 2010 Thomas Mayer

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
 * ----------------------------------------------------------------------------------- */

(function () {
	var oileide = function () {
		// Configurables
		var loadingImageFileName = 'loading.gif', // path to loading gif
			oileideFileNameRegex = /(^|\/)oileide.*\.js\?auto$/, // regex for automode src
			autoRegex = /^oileide\[([a-zA-Z 0-9\-_]*)\]$/, // regex for rel attribute
		// End Configurables
			self = {},
			autoMode = false,
			cassandrasVeil = null;

		/**
		 * initialize XMLHttpObject
		 *
		 * @return new XMLHttpObject or equivalent on IE 5/6 or null
		 * @type {XMLHttpRequest}
		 * */
		self.sail = function () {
			var xmlHttp = null,
				MsXmlHttpVersions = ['MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'], // different versions of ms xmlhttp
				i,
				len;
			if (window.XMLHttpRequest) {
				xmlHttp = new XMLHttpRequest();
			} else {
				// try one ms xmlhttp after another
				len = MsXmlHttpVersions.length;
				for (i = 0; i < len; i += 1) {
					try {
						xmlHttp  = new ActiveXObject(MsXmlHttpVersions[i]);
						break;
					} catch (e) {
					}
				}
			}
			return xmlHttp;
		};

		/**
		 * loads data and executed callback function via Ajax
		 *
		 * @param {string} dataType type of data to load via Ajax and hand over to callback function, either JSON, XML or HTML
		 * @param {string} url URL to load via ajax request
		 * @param {string} callBackFunction function to execute after html is loaded
		 * @param {boolean} isAsynchronous indicates whether the call is asynchronous, defaults to true
		 * @param {string} requestMethod how to call the URL, defaults to 'GET'
		 * @param {string} postData postData to send via Ajax, defaults to null
		 * @param {object} additionalParams additional parameters for callback function
		 *
		 * @return status for successful loading
		 * @type boolean
		 * */
		self.callForAchilleus = function (dataType, url, callbackFunction, isAsynchronous, requestMethod, postData, additionalParams) {
			if (dataType !== 'JSON' && dataType !== 'XML' && dataType !== 'HTML' && dataType !== 'Text') {
				throw ('Unsupported Data Type');
			}
			if (isAsynchronous === undefined) {
				isAsynchronous = true;
			}
			if (requestMethod === undefined) {
				requestMethod = 'GET';
			}
			if (postData === undefined) {
				postData = null;
			}
			var xmlHttp = self.sail(),
				responseContent;
			if (xmlHttp !== null) {
				if (isAsynchronous === true) {
					xmlHttp.onreadystatechange = function () {
						if (xmlHttp.readyState === 4 && (xmlHttp.status === 200 || xmlHttp.status === 304)) {
							switch (dataType) {
							case 'HTML':
								responseContent = self.getBodyFromHtml(xmlHttp.responseText);
								break;
							case 'XML':
								responseContent = xmlHttp.responseXML;
								break;
							case 'JSON': // actually the same as Text
								responseContent = xmlHttp.responseText;
								break;
							case 'Text':
								responseContent = xmlHttp.responseText;
								break;
							}
							callbackFunction(responseContent, additionalParams);
						}
					};
				}
				xmlHttp.open(requestMethod, url, isAsynchronous);
				xmlHttp.send(postData);
				if (isAsynchronous === false) {
					if (xmlHttp.status === 200 || xmlHttp.status === 304) {
						switch (dataType) {
						case 'HTML':
							responseContent = self.getBodyFromHtml(xmlHttp.responseText);
							break;
						case 'XML':
							responseContent = xmlHttp.responseXML;
							break;
						case 'JSON': // actually the same as Text
							responseContent = xmlHttp.responseText;
							break;
						case 'Text':
							responseContent = xmlHttp.responseText;
							break;
						}
						callbackFunction(responseContent, additionalParams);
						return true;
					} else {
						return false;
					}
				} else {
					return true; // No information because of asynchronous call, assume success
				}
			} else {
				return false; // No XmlHttpRequest available
			}
		};

		/**
		 * loads JSON object and executed callback function via Ajax
		 *
		 * @param {string} url URL to load via ajax request
		 * @param {string} callBackFunction function to execute after html is loaded
		 * @param {boolean} isAsynchronous indicates whether the call is asynchronous, defaults to true
		 * @param {string} requestMethod how to call the URL, defaults to 'GET'
		 * @param {string} postData postData to send via Ajax, defaults to null
		 * @param {object} additonalParams additionalParameters for callback function
		 *
		 * @return status for successful loading
		 * @type boolean
		 * */
		self.loadJson = function (url, callbackFunction, isAsynchronous, requestMethod, postData, additionalParams) {
			return self.callForAchilleus('JSON', url, callbackFunction, isAsynchronous, requestMethod, postData, additionalParams);
		};

		/**
		 * loads text and executed callback function via Ajax
		 *
		 * @param {string} url URL to load via ajax request
		 * @param {string} callBackFunction function to execute after html is loaded
		 * @param {boolean} isAsynchronous indicates whether the call is asynchronous, defaults to true
		 * @param {string} requestMethod how to call the URL, defaults to 'GET'
		 * @param {string} postData postData to send via Ajax, defaults to null
		 * @param {object} additonalParams additionalParameters for callback function
		 *
		 * @return status for successful loading
		 * @type boolean
		 * */
		self.loadText = function (url, callbackFunction, isAsynchronous, requestMethod, postData, additionalParams) {
			return self.callForAchilleus('Text', url, callbackFunction, isAsynchronous, requestMethod, postData, additionalParams);
		};

		/**
		 * loads XML document and executed callback function via Ajax
		 *
		 * @param {string} url URL to load via ajax request
		 * @param {string} callBackFunction function to execute after html is loaded
		 * @param {boolean} isAsynchronous indicates whether the call is asynchronous, defaults to true
		 * @param {string} requestMethod how to call the URL, defaults to 'GET'
		 * @param {string} postData postData to send via Ajax, defaults to null
		 * @param {object} additonalParams additionalParameters for callback function
		 *
		 * @return status for successful loading
		 * @type boolean
		 * */
		self.loadXml = function (url, callbackFunction, isAsynchronous, requestMethod, postData, additionalParams) {
			return self.callForAchilleus('XML', url, callbackFunction, isAsynchronous, requestMethod, postData);
		};

		/**
		 * loads HTML document and executes callback function via Ajax
		 *
		 * @param {string} url URL to load via ajax request
		 * @param {string} callBackFunction function to execute after html is loaded
		 * @param {boolean} isAsynchronous indicates whether the call is asynchronous, defaults to true
		 * @param {string} requestMethod how to call the URL, defaults to 'GET'
		 * @param {string} postData postData to send via Ajax, defaults to null
		 * @param {object} additonalParams additionalParameters for callback function
		 *
		 * @return status for successful loading
		 * @type boolean
		 * */
		self.loadHtml = function (url, callbackFunction, isAsynchronous, requestMethod, postData, additionalParams) {
			return self.callForAchilleus('HTML', url, callbackFunction, isAsynchronous, requestMethod, postData, additionalParams);
		};

		/**
		 * gets body from HTML string
		 * @param {string} htmlString HTML file as string
		 *
		 * @return DOM object of content of <body> tag
		 * @type object
		 * */
		self.getBodyFromHtml = function (htmlString) {
			var tempDomEl,
				start,
				end;
			// Workaround for real DOM pt. 1:
			// get everything between <body ...> and </body>
			start = htmlString.indexOf("<body");
			start = htmlString.indexOf(">", start);
			end = htmlString.lastIndexOf("</body>");
			htmlString = htmlString.slice(start + 1, end);
			// Workaround for real DOM pt. 2:
			// Create div and use innerHTML
			tempDomEl = document.createElement('div');
			tempDomEl.innerHTML = htmlString;
			return tempDomEl;
		};

		/**
		 * writes HTML into a DOM element
		 *
		 * @param {object} content DOM element to put into element with ID elementId
		 * @param {string} elementId ID of the DOM element to write to
		 * */
		self.writeHtml = function (content, elementId) {
			var element = document.getElementById(elementId),
				currentNodes,
				currentNode,
				i,
				len;
			if (element) {
				content = self.removeOlympics(content);
				// Remove old child nodes
				currentNodes = element.childNodes;
				for (i = currentNodes.length - 1; i >= 0 ; i -= 1) {
					currentNode = currentNodes[i];
					if (currentNode.nodeType === 1 || currentNode.nodeType === 3) {
						element.removeChild(currentNode);
					}
				}
				// Insert new child nodes
				currentNodes = content.childNodes;
				for (i = 0, len = currentNodes.length; i < len; i += 1) {
					currentNode = currentNodes[i].cloneNode(true); // clone nodes to not remove currentNode from currentNodes during insertion
					if (currentNode.nodeType === 1 || currentNode.nodeType === 3) {
						element.appendChild(currentNode);
					}
				}
				if (autoMode === true) {
					self.launchSpear(element);
				}
			}
		};

		/**
		 * loads html document and writes its body into specified element
		 *
		 * @param {string} url URL to load via ajax request
		 * @param {string} elementId ID of DOM element to give to callback function along with the return data of the Ajax request, defaults to null
		 * @param {boolean} veilShown indicates whether to show the overlay over the element
		 * @param {boolean} isAsynchronous indicates whether the call is asynchronous, defaults to true
		 * @param {string} requestMethod how to call the URL, defaults to 'GET'
		 * @param {string} postData postData to send via Ajax, defaults to null
		 * @param {string} callBackFunction function to execute after html is loaded
		 *
		 * @return status of successfully loaded HTML
		 * @type boolean
		 * */
		self.insertHtml = function (url, elementId, veilShown, isAsynchronous, requestMethod, postData) {
			if (veilShown === true) {
				self.showVeil(elementId);
			}
			return self.loadHtml(url, self.writeHtml, isAsynchronous, requestMethod, postData, elementId);
		};

		/**
		 * executes link of anchor element via ajax
		 *
		 * @param {object} aElement anchor element which was clicked
		 * @param {boolean} appendToLocation indicates whether to add element ID to hash
		 * @param {boolean} isAsynchronous indicates whether the call isAsynchronous
		 *
		 * @return status of successfully inserted href
		 * @type boolean
		 * */
		self.autoInsert = function (aElement, appendToLocation, isAsynchronous) {
			var url = aElement.getAttribute('href'),
				stringToAppend = aElement.getAttribute('id'),
				matches = autoRegex.exec(aElement.getAttribute('rel')),
				elementId = matches[1],
				status = false;

			status = self.insertHtml(url, elementId, true, isAsynchronous);
			if (appendToLocation === true && stringToAppend) {
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
				position;
			if (element !== null) {
				veil = cassandrasVeil.cloneNode(true);
				position = self.getElementPosition(element);
				veil.style.left = position[0];
				veil.style.top = position[1];
				veil.style.width = position[2];
				veil.style.height = position[3];
				veil.style.display = 'block';
				element.appendChild(veil);
			}
		};

		/**
		 * finds position of DOM element
		 *
		 * @param {object} element DOM element to get position
		 *
		 * @return x and y position of element, until parent is positioned and height and width of element
		 * @type array
		 * */
		self.getElementPosition = function (element) {
			var curleft = 0, // default values: overlay over whole page
				curtop = 0,
				width = '100%',
				height = '100%',
				positioning;
			if (element.offsetParent) {
				width = element.offsetWidth + 'px';
				height = element.offsetHeight + 'px';
				do {
					positioning = self.getElementPositioning(element);
					if (positioning === 'relative' || positioning === 'absolute' || positioning === 'fixed') {
						break; // if element is not positioned statically, then top/left of overlay is computed from that element
					}
					curleft += element.offsetLeft;
					curtop += element.offsetTop;
					element = element.offsetParent;
				} while (element);
			}
			curleft += 'px';
			curtop += 'px';
			return [curleft, curtop, width, height];
		};

		/**
		 * gets computed position CSS property of element
		 *
		 * @param {object} element DOM element to get position property
		 *
		 * @return computed positioning of element
		 * @type string
		 * */
		self.getElementPositioning = function (element) {
			if (element.currentStyle) { // IE
				return element.currentStyle.position;
			} else if (document.defaultView) { // Gecko
				return document.defaultView.getComputedStyle(element, '').getPropertyValue('position');
			} else { // at least something
				return element.style.position;
			}
		};

		/**
		 * appends window.oileide.autoInsert to anchor elements of DOM element
		 *
		 * @param {object} node DOM node to parse for anchor elements
		 * */
		self.launchSpear = function (node) {
			var aElements = node.getElementsByTagName("a"),
				i,
				len;
			for (i = 0, len = aElements.length; i < len; i += 1) {
				if (autoRegex.test(aElements[i].rel)) {
					aElements[i].onclick = function () {
						var status = window.oileide.autoInsert(this, true, true);
						if (status === true) {
							return false;
						} else {
							// On error follow link
							return true;
						}
					};
				}
			}
		};

		/**
		 * removes elements with class "olympic" from node
		 *
		 * @param {object} node DOM node to remove elements from
		 * */
		self.removeOlympics = function (node) {
			var olympics,
				i,
				classes;
			if (node.getElementsByClassName === undefined) {
				// http://javascript.about.com/library/bldom08.htm
				olympics = node.getElementsByTagName('*');
				for (i = olympics.length - 1; i >= 0; i -= 1) {
					classes = olympics[i].className;
					if (/\bolympic\b/.test(classes) === true) {
						olympics[i].parentNode.removeChild(olympics[i]);
					}
				}
			} else {
				olympics = node.getElementsByClassName("olympic");
				for (i = olympics.length - 1; i >= 0; i -= 1) {
					olympics[i].parentNode.removeChild(olympics[i]);
				}
			}
			return node;
		};

		/**
		 * appends string to browser location hash
		 *
		 * @param {string} stringToAppend string to append to location hash
		 * */
		self.appendToLocation = function (stringToAppend) {
			if (window.location.hash === '') {
				window.location.hash = stringToAppend;
			} else {
				window.location.hash += ',' + stringToAppend;
			}
		};

		/**
		 * reads hash from browser location and executes the indicated ajax requests synchronous
		 * */
		self.readFromLocation = function () {
			// window.location.hash still contains the # on getting (not on setting)
			var clickedLinkIds = window.location.hash.substr(1).split(','),
				i,
				aElement,
				len;
			for (i = 0, len = clickedLinkIds.length; i < len; i += 1) {
				aElement = document.getElementById(clickedLinkIds[i]);
				if (aElement !== null) {
					self.autoInsert(aElement, false, false);
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
			loadingImage.src = loadingImageFileName;
			cassandrasVeil.appendChild(loadingImage);
		};

		/**
		 * switches to automode
		 * */
		self.run = function () {
			autoMode = true;
			self.createCassandrasVeil();
			var bodyNode = document.getElementsByTagName("body");
			self.launchSpear(bodyNode[0]);
			self.readFromLocation();
		};

		/**
		 * try to find auto mode switch in HTML source
		 * */
		self.getParam = function () {
			var scriptTags = document.getElementsByTagName("head")[0].getElementsByTagName("script"),
				i,
				path,
				len;
			for (i = 0, len = scriptTags.length; i < len; i += 1) {
				path = scriptTags[i].src;
				if (path.match(oileideFileNameRegex)) {
					self.run();
				}
			}
		};

		return self;
	};
	window.oileide = oileide();

	/**
	 * Add parameter search to onload
	 * */
	if (window.addEventListener) { // DOM method
		window.addEventListener('load', function () {
			window.oileide.getParam();
		}, false);
	} else if (window.attachEvent) { // IE
		window.attachEvent('onload', function () {
			window.oileide.getParam();
		});
	} else if (typeof window.onload === 'undefined') { // older browsers
		window.onload = function () {
			window.oileide.getParam();
		};
	} else {
		window.onload = window.onload && function () {
			window.oileide.getParam();
		};
	}
}());
