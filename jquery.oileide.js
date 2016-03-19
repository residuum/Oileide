/* -----------------------------------------------------------------------------------
	Oileide v 0.2.0
	by Thomas Mayer - http://ix.residuum.org/oileide/oileide.html
	License: MIT license, i.e. more or less: Do As Thou Wilst (with the code) Shall
	Be The Whole of The Law.

	Copyright (c) 2010-2016 Thomas Mayer

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

(function ($) {
	var oileide = function () {
		var loadingImageFileName = 'loading.gif',
		    self = {},
		    autoMode = false,
		    cassandrasVeil = $("<div></div>").hide().addClass("cassandras-veil")
		        .append($('<img src="'+loadingImageFileName+'" alt="loading">'));

		/**
		 * loads data and executed callback function via Ajax
		 *
		 * @param {string} url URL to load via ajax request
		 * @param {string} callBackFunction function to execute after html is loaded
		 * @param {boolean} isAsynchronous indicates whether the call is asynchronous, defaults to true
		 * */
		self.callForAchilleus = function (url, callbackFunction, isAsynchronous, target, append) {
			$.get(url, function (data) {
					callbackFunction(data, target, append);
				});
		};


		/**
		 * gets body from HTML string
		 * @param {string} htmlString HTML file as string
		 *
		 * @return DOM object of content of <body> tag
		 * @type object
		 * */
		self.getBodyFromHtml = function (htmlString) {
			return $($(htmlString).find("body").html());
		};

		/**
		 * writes HTML into a DOM element
		 *
		 * @param {object} content DOM element to put into element with ID elementId
		 * @param {string} elementId ID of the DOM element to write to
		 * */
		self.writeHtml = function (content, target, append) {
			self.removeVeil(target);
			var cleanedContent = self.removeOlympics(content);
			if (append) {
				target.append(cleanedContent);
			}else {
				target.html(cleanedContent);
			}
			self.launchSpear(cleanedContent);
		};

		self.removeVeil = function(target) {
			target.find('.cassandras-veil').remove();
		};

		/**
		 * loads html document and writes its body into specified element
		 *
		 * @param {string} url URL to load via ajax request
		 * @param {string} elementId ID of DOM element to give to callback function along with the return data of the Ajax request, defaults to null
		 * @param {boolean} isAsynchronous indicates whether the call is asynchronous, defaults to true
		 * */
		self.insertHtml = function (url, targetSelector, append, isAsynchronous) {
			var target = $(targetSelector)
			self.showVeil(target, append);
			self.callForAchilleus(url, self.writeHtml, isAsynchronous, target, append);
		};

		/**
		 * executes link of anchor element via ajax
		 *
		 * @param {object} aElement anchor element which was clicked
		 * @param {boolean} appendToLocation indicates whether to add element ID to hash
		 * @param {boolean} isAsynchronous indicates whether the call isAsynchronous
		 * */
		self.autoInsert = function (link, appendToLocation, isAsynchronous) {
			var url = link.attr('href'),
			    stringToAppend = link.attr('id'),
			    targetSelector = link.attr('data-oileide-target'),
			    append = link.attr('data-oileide-append');

			self.insertHtml(url, targetSelector, append, isAsynchronous);
			if (appendToLocation === true && stringToAppend) {
				self.appendToLocation(stringToAppend);
			}
		};

		/**
		 * duplicates overlay and shows it over element
		 *
		 * @param {string} elementId ID of element to show overlay over it
		 * */
		self.showVeil = function (target, append) {
			var veil = cassandrasVeil.clone(),
			    pos = target.position();
			if (append) {
				target.append(veil.show());
			} else {
				if (pos) {
					veil.css("top", pos.top+"px");
					veil.css("left", pos.left+"px");
				}
				target.html(veil.show());
			}

		};

		/**
		 * appends window.oileide.autoInsert to anchor elements of DOM element
		 *
		 * @param {object} node DOM node to parse for anchor elements
		 * */
		self.launchSpear = function (node) {
			node.find("a").each(function() {
				var link = $(this),
				target = link.attr("data-oileide-target");
			if (target) {
				link.click(function(ev) {
					self.autoInsert($(this), true, true);
					ev.preventDefault();
					return false;
				});
			}

			});
		};

		/**
		 * removes elements with class "olympic" from node
		 *
		 * @param {object} node DOM node to remove elements from
		 * */
		self.removeOlympics = function (content) {
			content = content.replace('<body', '<body><div id="body"').replace('</body>','</div></body>');
			var body = $(content).filter('#body');
			body.find(".olympic").remove();
			return body;
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
				aElement = $("#"+clickedLinkIds[i]);
				if (aElement !== null) {
					self.autoInsert(aElement, false, false);
				}
			}
		};

		/**
		 * switches to automode
		 * */
		self.run = function (veil) {
			if (veil) {
				cassandrasVeil = veil;
			}
			autoMode = true;
			var bodyNode = $("body");
			self.launchSpear(bodyNode);
			self.readFromLocation();
		};

		return self;
	};
	$.fn.oileide = oileide();
})(jQuery);
