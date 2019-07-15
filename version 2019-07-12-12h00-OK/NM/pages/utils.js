/* util.js
	2019/03/21, FPI
	- javascript
	- utilisé par accueil.html du NexoManager
	*/

/* MouseEvent
	*/
function whichMouseButton(event) {
	var btn = "none";
	if (!event) var event = window.event;
	if (event.which) {
		if (event.which == 3) {
			btn = "right";
			}
		else if (event.which == 2) {
			btn = "middle";
			}
		else if (event.which == 1) {
			btn = "left";
			}
		}
	else if (event.button) {
		if (event.button == 2) {
			btn = "right";
			}
		else if (event.button == 1) {
			btn = "left";
			}
		}
	else if (event.originalEvent) {
		if (event.originalEvent.button == 2) {
			btn = "right";
			}
		else if (event.originalEvent.button == 0) {
			btn = "left";
			}
		}
	return btn;
	}
	
String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
	};

function ValidateIPaddress(ipaddress) {
	 if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
		{
			return true;
		}
	
	return false;
	}
/*
	*/
function getFromPath( json, path) {
	var report = json;
	var arr = path.splitEx( "/");
	for( var i=0; i < arr.length; i++) {
		if ( arr[i] in report) {
			report = report[ arr[i]];
			}
		else {
			report = null;
			break;
			}
		}
	return report;
	}
   
/* formatage de chaine avec des arguments */
if (!String.prototype.format) {
	String.prototype.format = function() {
	  var args = arguments;
	  return this.replace(/{(\d+)}/g, function(match, number) { 
		return typeof args[number] != 'undefined'
		  ? args[number]
		  : match;
		});
	  };
	}

/*
'2015-09-30 16:20:30.0.12752200'
	*/
Date.prototype.yyyymmddhhmmsslll = function() {
	var yyyy = this.getFullYear();
	var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
	var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
	var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
	var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
	var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
	var lll = this.getMilliseconds() < 10 ? "00" + this.getMilliseconds() : 
		this.getMilliseconds() < 100 ? "0" + this.getMilliseconds() :
		this.getMilliseconds();
	return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss + '.' + lll;
	};
/*
'2015-09-30 16:20:30.1'
*/
Date.prototype.yyyymmddhhmmssl = function() {
	var yyyy = this.getFullYear();
	var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
	var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
	var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
	var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
	var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
	var l = this.getMilliseconds() < 100 ? "0" : Math.floor( this.getMilliseconds() / 100);
	return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss + '.' + l;
	};

Date.prototype.yyyymmddhhmmss = function() {
	var yyyy = this.getFullYear();
	var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
	var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
	var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
	var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
	var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
	return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
	};

function timedatectlFormat() {
	
	var date = new Date(); 
	var hutc = date.getUTCHours();
	var now_utc =  new Date(
		date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
		date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
	
	return now_utc.yyyymmddhhmmss();
	};

function TimeStampMilliToDate( unix_timestamp ) {
	// Create a new JavaScript Date object based on the timestamp
	
	var date = new Date(unix_timestamp);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();

	// Hours part from the timestamp
	var hours = date.getHours();
	// Minutes part from the timestamp
	var minutes = date.getMinutes();
	// Seconds part from the timestamp
	var seconds = date.getSeconds();
	var millis = date.getMilliseconds();

	// Will display time in 10:30:23 format
	var formattedTime = 
		year.toString().padStart(4, '0') 
		+ '/' + month.toString().padStart(2, '0') 
		+ '/' + day.toString().padStart(2, '0') 
		+ '-' + hours.toString().padStart(2, '0') 
		+ ':' + minutes.toString().padStart(2, '0')  
		+ ':' + seconds.toString().padStart(2, '0')
		+ '.' + millis.toString().padStart(3, '0') ;
	return formattedTime;
	}

/*
	*/
function saveTextAsFile( strText, strFileName, ext) {

	// grab the content of the form field and place it into a variable
	var textToWrite = strText;
		
	//  create a new Blob (html5 magic) that conatins the data from your form feild
	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
	
	// Specify the name of the file to be saved
	if (strFileName == null) {
		strFileName = "sample" + ext;
		}
	var fileNameToSaveAs = strFileName;

	// Optionally allow the user to choose a file name by providing 
	// an imput field in the HTML and using the collected data here
	// var fileNameToSaveAs = txtFileName.text;

	// create a link for our script to 'click'
	var downloadLink = document.createElement("a");
	//  supply the name of the file (from the var above).
	// you could create the name here but using a var
	// allows more flexability later.
	downloadLink.download = fileNameToSaveAs;
	// provide text for the link. This will be hidden so you
	// can actually use anything you want.
	downloadLink.innerHTML = "My Hidden Link";

	// allow our code to work in webkit & Gecko based browsers
	// without the need for a if / else block.
	window.URL = window.URL || window.webkitURL;
				
	// Create the link Object.
	downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
	// when link is clicked call a function to remove it from
	// the DOM in case user wants to save a second file.
	downloadLink.onclick = destroyClickedElement;
	// make sure the link is hidden.
	downloadLink.style.display = "none";
	// add the link to the DOM
	document.body.appendChild(downloadLink);

	// click the new link
	downloadLink.click();
	}
	
function destroyClickedElement(event) {
	// remove the link from the DOM
	document.body.removeChild(event.target);
	}

/**/
function deleteAllChild(nodeId) {
	var myNode = document.getElementById(nodeId);
	if (myNode == null) return;
	while (myNode.firstChild) {
    	myNode.removeChild( myNode.firstChild);
		}
	}
/**/
function walkJson(jsonObj, callBack) {
	
	if( typeof jsonObj == "object" ) {
		
		$.each( jsonObj, function( key,value) {
			
			if (key != "parent") {
				if (callBack( this, key, value)) {
					return true;
					}
					
				if ( typeof value == "object") {
					if (walkJson( value, callBack)) {
						return true;
						}
					}
				}
			});
		}
	else {
		// jsonOb is a number or string
		}
	return false;
	}
	
/**/
function removeValueFromArray( arr, val) {
	var index = arr.indexOf(val);
	if (index > -1) {
		arr.splice( index, 1);
		}
	return arr;
	}	
	
/**/
function removeFieldValueFromArray( arr, field, val) {
	for( var index = 0; index < arr.length; index++) {
		if (arr[index][field] == val){
			arr.splice( index, 1);
			break;
			}
		}
	return arr;
	}	
	
function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
	}
 
// then to call it, plus stitch in '4' in the third group
function newGuid() {
	return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
	}

/**/
function isFieldInArray( arr, field, val) {
	var report = -1;
	for( var index = 0; index < arr.length; index++) {
		if (arr[index][field] == val){
			report = index;
			break;
			}
		}
	return report;
	}	
		
/**/
function isInArray( arr, val) {
	if (arr == undefined || arr.length == 0) {
		return false;
		}	
	else {
		if (arr.indexOf(val) > -1) {
			return true;
			}
		else {
			return false;
			}
		}	
	}	

/**/
function ArrayMoveUp( arr, value) {
	var pos = undefined;
	for( var i1=0; i1 < arr.length; i1++) {
		if (arr[i1] == value) {
			pos = i1;
			break;
			}
		}
	if (pos != undefined && pos != 0) {
		var t = arr[pos-1];
		arr[pos-1] = arr[pos];
		arr[pos] = t;
		}
	return arr;
	}
	
/**/
function ArrayMoveDown( arr, value) {
	var pos = undefined;
	for( var i1=0; i1 < arr.length; i1++) {
		if (arr[i1] == value) {
			pos = i1;
			break;
			}
		}
	if (pos != undefined && pos != arr.length-1) {
		var t = arr[pos+1];
		arr[pos+1] = arr[pos];
		arr[pos] = t;
		}
	return arr;
	}
/**/
function getFileExtension( fileName) {
	return fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);
	}

/**/
function getFileName( fileName) {
	return fileName.replace(/.[^.]+$/,'');
	}

/**/
function isValidFileName(fname){
	var rg1=/^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
	var rg2=/^\./; // cannot start with dot (.)
	var rg3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
	return rg1.test(fname)&&!rg2.test(fname)&&!rg3.test(fname);
	}
	
/*
	*/
String.prototype.isEmpty = function() {
	if (this == undefined || this == "") {
		return true;
		}
	else {
		return false;
		}
	}	

/*
	*/
String.prototype.splitEx = function(sep) {
	var result = []
	parts = this.split(sep)
	for( var i1=0; i1 < parts.length; i1++) {
		if (parts[i1].isEmpty() == false) {
			result.push( parts[i1]);
			}
		}
	return result;
	}

/*
	*/
function replaceAccents(str){
  // verifies if the String has accents and replace them
  if (str.search(/[\xC0-\xFF]/g) > -1) {
      str = str
			.replace(/[\xC0-\xC5]/g, "A")
			.replace(/[\xC6]/g, "AE")
			.replace(/[\xC7]/g, "C")
			.replace(/[\xC8-\xCB]/g, "E")
			.replace(/[\xCC-\xCF]/g, "I")
			.replace(/[\xD0]/g, "D")
			.replace(/[\xD1]/g, "N")
			.replace(/[\xD2-\xD6\xD8]/g, "O")
			.replace(/[\xD9-\xDC]/g, "U")
			.replace(/[\xDD]/g, "Y")
			.replace(/[\xDE]/g, "P")
			.replace(/[\xE0-\xE5]/g, "a")
			.replace(/[\xE6]/g, "ae")
			.replace(/[\xE7]/g, "c")
			.replace(/[\xE8-\xEB]/g, "e")
			.replace(/[\xEC-\xEF]/g, "i")
			.replace(/[\xF1]/g, "n")
			.replace(/[\xF2-\xF6\xF8]/g, "o")
			.replace(/[\xF9-\xFC]/g, "u")
			.replace(/[\xFE]/g, "p")
			.replace(/[\xFD\xFF]/g, "y");
		}

  return str;
	}

String.prototype.toUpperPdf = function() {
	
	var correctedString = replaceAccents(this).toUpperCase();
	return  correctedString;
	}

function isFilled( o)  {
	if (o == undefined || o.toString() == "") {
		return false;
		}
	else {
		return true;
		}
	}

/*
	*/
Array.prototype.move = function(from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
	};

/*
	*/
String.prototype.uIndexOf = function (subString) {
	ignoreCase = true
	useLocale = true
	string1 = this
	string2 = subString
	if (ignoreCase) {
		if (useLocale) {
			string1 = string1.toLocaleLowerCase();
			string2 = string2.toLocaleLowerCase();
			}
		else {
			string1 = string1.toLowerCase();
			string2 = string2.toLowerCase();
			}
		}
	return string1.indexOf( string2);
	}
	
/**/	
function setCookie(cookieName, cookieValue, expirationDays) {
	var d = new Date();
	d.setTime(d.getTime() + (expirationDays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cookieName + "=" + cookieValue + "; " + expires;
	}
	
/**/
function getCookieValue(cookieName) {
	var name = cookieName + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') {
			c = c.substring(1);
			}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length,c.length);
			}
		}
	return "";
	}

/*
	*/
function isClass(element,name) {
	var success = false;
	var arr = element.className.split(" ");
	if (arr.indexOf(name) != -1) success = true;
	return success;  
	}
/*
<audio id="audio" src="./medias/beep-07.wav" autoplay="false" ></audio>
*/
function PlaySound(soundId) {
	try {
		var sound = document.getElementById(soundId);
		if (sound != null) {
			sound.play();
			}
		}
	catch(err) {
		var x = err;
		}
	}

/*
	*/
var fullColorHex = function(r,g,b) {   
	var red = valToHex(r);
	var green = valToHex(g);
	var blue = valToHex(b);
	return red+green+blue;
	};

/*
	*/
function valToHex( x ) {
	x = x.toString(16);
	return (x.length == 1) ? '0' + x : x;
	}

/*
	*/
function isPointInPoly(point, vs) {
	// ray-casting algorithm based on
	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	var inside = false;

	var x = point[0], y = point[1];

	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		var xi = vs[i][0], yi = vs[i][1];
		var xj = vs[j][0], yj = vs[j][1];

		var intersect = ((yi > y) != (yj > y))
				&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
		}

	return inside;
	}

/* ratio, decimal between 0 and 1
	*/
function colorGradient( color1, color2, ratio) {

	var r = Math.ceil( parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
	var g = Math.ceil( parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
	var b = Math.ceil( parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

	/*var r = Math.ceil( color1.r * ratio + color2.r * (1-ratio) );
	var g = Math.ceil( color1.g * ratio + color2.g * (1-ratio) );
	var b = Math.ceil( color1.b * ratio + color2.b * (1-ratio) );*/
	
	return valToHex(r) + valToHex(g) + valToHex(b);

	//return rgb(r, g, b);
	}
	
/** Extend Number object with method to convert numeric degrees to radians */
if (Number.prototype.toRadians === undefined) {
	Number.prototype.toRadians = function() { return this * Math.PI / 180; };
	}
  
/** Extend Number object with method to convert radians to numeric (signed) degrees */
if (Number.prototype.toDegrees === undefined) {
	Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
	}
	

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
if (typeof module != 'undefined' && module.exports) module.exports = LatLon; // ≡ export default LatLon

	/**
 * Creates a LatLon point on the earth's surface at the specified latitude / longitude.
 *
 * @constructor
 * @param {number} lat - Latitude in degrees.
 * @param {number} lon - Longitude in degrees.
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119);
 */
function LatLon(lat, lon) {
	// allow instantiation without 'new'
	if (!(this instanceof LatLon)) return new LatLon(lat, lon);

	this.lat = Number(lat);
	this.lon = Number(lon);
	}
	
/**
 * Returns the distance from ‘this’ point to destination point (using haversine formula).
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
 * @returns {number} Distance between this point and destination point, in same units as radius.
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119);
 *     var p2 = new LatLon(48.857, 2.351);
 *     var d = p1.distanceTo(p2); // 404.3 km
 */
LatLon.prototype.distanceTo = function(point, radius) {
	if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');
	radius = (radius === undefined) ? 6371e3 : Number(radius);

	// a = sin²(Δφ/2) + cos(φ1)⋅cos(φ2)⋅sin²(Δλ/2)
	// tanδ = √(a) / √(1−a)
	// see mathforum.org/library/drmath/view/51879.html for derivation

	var R = radius;
	var φ1 = this.lat.toRadians(),  λ1 = this.lon.toRadians();
	var φ2 = point.lat.toRadians(), λ2 = point.lon.toRadians();
	var Δφ = φ2 - φ1;
	var Δλ = λ2 - λ1;

	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2)
				+ Math.cos(φ1) * Math.cos(φ2)
				* Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;

	return d;
	};
	
/**
 * Returns the (initial) bearing from ‘this’ point to destination point.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number} Initial bearing in degrees from north.
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119);
 *     var p2 = new LatLon(48.857, 2.351);
 *     var b1 = p1.bearingTo(p2); // 156.2°
 */
LatLon.prototype.bearingTo = function(point) {
	if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	// tanθ = sinΔλ⋅cosφ2 / cosφ1⋅sinφ2 − sinφ1⋅cosφ2⋅cosΔλ
	// see mathforum.org/library/drmath/view/55417.html for derivation

	var φ1 = this.lat.toRadians(), φ2 = point.lat.toRadians();
	var Δλ = (point.lon-this.lon).toRadians();
	var y = Math.sin(Δλ) * Math.cos(φ2);
	var x = Math.cos(φ1)*Math.sin(φ2) -
			Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
	var θ = Math.atan2(y, x);

	return (θ.toDegrees()+360) % 360;
};


/**
 * Returns final bearing arriving at destination destination point from ‘this’ point; the final bearing
 * will differ from the initial bearing by varying degrees according to distance and latitude.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number} Final bearing in degrees from north.
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119);
 *     var p2 = new LatLon(48.857, 2.351);
 *     var b2 = p1.finalBearingTo(p2); // 157.9°
 */
LatLon.prototype.finalBearingTo = function(point) {
	if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	// get initial bearing from destination point to this point & reverse it by adding 180°
	return ( point.bearingTo(this)+180 ) % 360;
};


/**
 * Returns the midpoint between ‘this’ point and the supplied point.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {LatLon} Midpoint between this point and the supplied point.
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119);
 *     var p2 = new LatLon(48.857, 2.351);
 *     var pMid = p1.midpointTo(p2); // 50.5363°N, 001.2746°E
 */
LatLon.prototype.midpointTo = function(point) {
	if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	// φm = atan2( sinφ1 + sinφ2, √( (cosφ1 + cosφ2⋅cosΔλ) ⋅ (cosφ1 + cosφ2⋅cosΔλ) ) + cos²φ2⋅sin²Δλ )
	// λm = λ1 + atan2(cosφ2⋅sinΔλ, cosφ1 + cosφ2⋅cosΔλ)
	// see mathforum.org/library/drmath/view/51822.html for derivation

	var φ1 = this.lat.toRadians(), λ1 = this.lon.toRadians();
	var φ2 = point.lat.toRadians();
	var Δλ = (point.lon-this.lon).toRadians();

	var Bx = Math.cos(φ2) * Math.cos(Δλ);
	var By = Math.cos(φ2) * Math.sin(Δλ);

	var x = Math.sqrt((Math.cos(φ1) + Bx) * (Math.cos(φ1) + Bx) + By * By);
	var y = Math.sin(φ1) + Math.sin(φ2);
	var φ3 = Math.atan2(y, x);

	var λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);

	return new LatLon(φ3.toDegrees(), (λ3.toDegrees()+540)%360-180); // normalise to −180..+180°
};


/**
 * Returns the point at given fraction between ‘this’ point and specified point.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @param   {number} fraction - Fraction between the two points (0 = this point, 1 = specified point).
 * @returns {LatLon} Intermediate point between this point and destination point.
 *
 * @example
 *   let p1 = new LatLon(52.205, 0.119);
 *   let p2 = new LatLon(48.857, 2.351);
 *   let pMid = p1.intermediatePointTo(p2, 0.25); // 51.3721°N, 000.7073°E
 */
LatLon.prototype.intermediatePointTo = function(point, fraction) {
	if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	var φ1 = this.lat.toRadians(), λ1 = this.lon.toRadians();
	var φ2 = point.lat.toRadians(), λ2 = point.lon.toRadians();
	var sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), sinλ1 = Math.sin(λ1), cosλ1 = Math.cos(λ1);
	var sinφ2 = Math.sin(φ2), cosφ2 = Math.cos(φ2), sinλ2 = Math.sin(λ2), cosλ2 = Math.cos(λ2);

	// distance between points
	var Δφ = φ2 - φ1;
	var Δλ = λ2 - λ1;
	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2)
		+ Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var δ = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var A = Math.sin((1-fraction)*δ) / Math.sin(δ);
	var B = Math.sin(fraction*δ) / Math.sin(δ);

	var x = A * cosφ1 * cosλ1 + B * cosφ2 * cosλ2;
	var y = A * cosφ1 * sinλ1 + B * cosφ2 * sinλ2;
	var z = A * sinφ1 + B * sinφ2;

	var φ3 = Math.atan2(z, Math.sqrt(x*x + y*y));
	var λ3 = Math.atan2(y, x);

	return new LatLon(φ3.toDegrees(), (λ3.toDegrees()+540)%360-180); // normalise lon to −180..+180°
};


/**
 * Returns the destination point from ‘this’ point having travelled the given distance on the
 * given initial bearing (bearing normally varies around path followed).
 *
 * @param   {number} distance - Distance travelled, in same units as earth radius (default: metres).
 * @param   {number} bearing - Initial bearing in degrees from north.
 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
 * @returns {LatLon} Destination point.
 *
 * @example
 *     var p1 = new LatLon(51.4778, -0.0015);
 *     var p2 = p1.destinationPoint(7794, 300.7); // 51.5135°N, 000.0983°W
 */
LatLon.prototype.destinationPoint = function(distance, bearing, radius) {
	radius = (radius === undefined) ? 6371e3 : Number(radius);

	// sinφ2 = sinφ1⋅cosδ + cosφ1⋅sinδ⋅cosθ
	// tanΔλ = sinθ⋅sinδ⋅cosφ1 / cosδ−sinφ1⋅sinφ2
	// see mathforum.org/library/drmath/view/52049.html for derivation

	var δ = Number(distance) / radius; // angular distance in radians
	var θ = Number(bearing).toRadians();

	var φ1 = this.lat.toRadians();
	var λ1 = this.lon.toRadians();

	var sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1);
	var sinδ = Math.sin(δ), cosδ = Math.cos(δ);
	var sinθ = Math.sin(θ), cosθ = Math.cos(θ);

	var sinφ2 = sinφ1*cosδ + cosφ1*sinδ*cosθ;
	var φ2 = Math.asin(sinφ2);
	var y = sinθ * sinδ * cosφ1;
	var x = cosδ - sinφ1 * sinφ2;
	var λ2 = λ1 + Math.atan2(y, x);

	return new LatLon(φ2.toDegrees(), (λ2.toDegrees()+540)%360-180); // normalise to −180..+180°
};


/**
 * Returns the point of intersection of two paths defined by point and bearing.
 *
 * @param   {LatLon} p1 - First point.
 * @param   {number} brng1 - Initial bearing from first point.
 * @param   {LatLon} p2 - Second point.
 * @param   {number} brng2 - Initial bearing from second point.
 * @returns {LatLon|null} Destination point (null if no unique intersection defined).
 *
 * @example
 *     var p1 = LatLon(51.8853, 0.2545), brng1 = 108.547;
 *     var p2 = LatLon(49.0034, 2.5735), brng2 =  32.435;
 *     var pInt = LatLon.intersection(p1, brng1, p2, brng2); // 50.9078°N, 004.5084°E
 */
LatLon.intersection = function(p1, brng1, p2, brng2) {
	if (!(p1 instanceof LatLon)) throw new TypeError('p1 is not LatLon object');
	if (!(p2 instanceof LatLon)) throw new TypeError('p2 is not LatLon object');

	// see www.edwilliams.org/avform.htm#Intersection

	var φ1 = p1.lat.toRadians(), λ1 = p1.lon.toRadians();
	var φ2 = p2.lat.toRadians(), λ2 = p2.lon.toRadians();
	var θ13 = Number(brng1).toRadians(), θ23 = Number(brng2).toRadians();
	var Δφ = φ2-φ1, Δλ = λ2-λ1;

	// angular distance p1-p2
	var δ12 = 2*Math.asin( Math.sqrt( Math.sin(Δφ/2)*Math.sin(Δφ/2)
		+ Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2) ) );
	if (δ12 == 0) return null;

	// initial/final bearings between points
	var θa = Math.acos( ( Math.sin(φ2) - Math.sin(φ1)*Math.cos(δ12) ) / ( Math.sin(δ12)*Math.cos(φ1) ) );
	if (isNaN(θa)) θa = 0; // protect against rounding
	var θb = Math.acos( ( Math.sin(φ1) - Math.sin(φ2)*Math.cos(δ12) ) / ( Math.sin(δ12)*Math.cos(φ2) ) );

	var θ12 = Math.sin(λ2-λ1)>0 ? θa : 2*Math.PI-θa;
	var θ21 = Math.sin(λ2-λ1)>0 ? 2*Math.PI-θb : θb;

	var α1 = θ13 - θ12; // angle 2-1-3
	var α2 = θ21 - θ23; // angle 1-2-3

	if (Math.sin(α1)==0 && Math.sin(α2)==0) return null; // infinite intersections
	if (Math.sin(α1)*Math.sin(α2) < 0) return null;      // ambiguous intersection

	var α3 = Math.acos( -Math.cos(α1)*Math.cos(α2) + Math.sin(α1)*Math.sin(α2)*Math.cos(δ12) );
	var δ13 = Math.atan2( Math.sin(δ12)*Math.sin(α1)*Math.sin(α2), Math.cos(α2)+Math.cos(α1)*Math.cos(α3) );
	var φ3 = Math.asin( Math.sin(φ1)*Math.cos(δ13) + Math.cos(φ1)*Math.sin(δ13)*Math.cos(θ13) );
	var Δλ13 = Math.atan2( Math.sin(θ13)*Math.sin(δ13)*Math.cos(φ1), Math.cos(δ13)-Math.sin(φ1)*Math.sin(φ3) );
	var λ3 = λ1 + Δλ13;

	return new LatLon(φ3.toDegrees(), (λ3.toDegrees()+540)%360-180); // normalise to −180..+180°
};


/**
 * Returns (signed) distance from ‘this’ point to great circle defined by start-point and end-point.
 *
 * @param   {LatLon} pathStart - Start point of great circle path.
 * @param   {LatLon} pathEnd - End point of great circle path.
 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
 * @returns {number} Distance to great circle (-ve if to left, +ve if to right of path).
 *
 * @example
 *   var pCurrent = new LatLon(53.2611, -0.7972);
 *   var p1 = new LatLon(53.3206, -1.7297);
 *   var p2 = new LatLon(53.1887,  0.1334);
 *   var d = pCurrent.crossTrackDistanceTo(p1, p2);  // -307.5 m
 */
LatLon.prototype.crossTrackDistanceTo = function(pathStart, pathEnd, radius) {
	if (!(pathStart instanceof LatLon)) throw new TypeError('pathStart is not LatLon object');
	if (!(pathEnd instanceof LatLon)) throw new TypeError('pathEnd is not LatLon object');
	var R = (radius === undefined) ? 6371e3 : Number(radius);

	var δ13 = pathStart.distanceTo(this, R) / R;
	var θ13 = pathStart.bearingTo(this).toRadians();
	var θ12 = pathStart.bearingTo(pathEnd).toRadians();

	var δxt = Math.asin(Math.sin(δ13) * Math.sin(θ13-θ12));

	return δxt * R;
};


/**
 * Returns how far ‘this’ point is along a path from from start-point, heading towards end-point.
 * That is, if a perpendicular is drawn from ‘this’ point to the (great circle) path, the along-track
 * distance is the distance from the start point to where the perpendicular crosses the path.
 *
 * @param   {LatLon} pathStart - Start point of great circle path.
 * @param   {LatLon} pathEnd - End point of great circle path.
 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
 * @returns {number} Distance along great circle to point nearest ‘this’ point.
 *
 * @example
 *   var pCurrent = new LatLon(53.2611, -0.7972);
 *   var p1 = new LatLon(53.3206, -1.7297);
 *   var p2 = new LatLon(53.1887,  0.1334);
 *   var d = pCurrent.alongTrackDistanceTo(p1, p2);  // 62.331 km
 */
LatLon.prototype.alongTrackDistanceTo = function(pathStart, pathEnd, radius) {
	if (!(pathStart instanceof LatLon)) throw new TypeError('pathStart is not LatLon object');
	if (!(pathEnd instanceof LatLon)) throw new TypeError('pathEnd is not LatLon object');
	var R = (radius === undefined) ? 6371e3 : Number(radius);

	var δ13 = pathStart.distanceTo(this, R) / R;
	var θ13 = pathStart.bearingTo(this).toRadians();
	var θ12 = pathStart.bearingTo(pathEnd).toRadians();

	var δxt = Math.asin(Math.sin(δ13) * Math.sin(θ13-θ12));

	var δat = Math.acos(Math.cos(δ13) / Math.abs(Math.cos(δxt)));

	return δat*Math.sign(Math.cos(θ12-θ13)) * R;
};


/**
 * Returns maximum latitude reached when travelling on a great circle on given bearing from this
 * point ('Clairaut's formula'). Negate the result for the minimum latitude (in the Southern
 * hemisphere).
 *
 * The maximum latitude is independent of longitude; it will be the same for all points on a given
 * latitude.
 *
 * @param {number} bearing - Initial bearing.
 * @param {number} latitude - Starting latitude.
 */
LatLon.prototype.maxLatitude = function(bearing) {
	var θ = Number(bearing).toRadians();

	var φ = this.lat.toRadians();

	var φMax = Math.acos(Math.abs(Math.sin(θ)*Math.cos(φ)));

	return φMax.toDegrees();
};


/**
 * Returns the pair of meridians at which a great circle defined by two points crosses the given
 * latitude. If the great circle doesn't reach the given latitude, null is returned.
 *
 * @param {LatLon} point1 - First point defining great circle.
 * @param {LatLon} point2 - Second point defining great circle.
 * @param {number} latitude - Latitude crossings are to be determined for.
 * @returns {Object|null} Object containing { lon1, lon2 } or null if given latitude not reached.
 */
LatLon.crossingParallels = function(point1, point2, latitude) {
	var φ = Number(latitude).toRadians();

	var φ1 = point1.lat.toRadians();
	var λ1 = point1.lon.toRadians();
	var φ2 = point2.lat.toRadians();
	var λ2 = point2.lon.toRadians();

	var Δλ = λ2 - λ1;

	var x = Math.sin(φ1) * Math.cos(φ2) * Math.cos(φ) * Math.sin(Δλ);
	var y = Math.sin(φ1) * Math.cos(φ2) * Math.cos(φ) * Math.cos(Δλ) - Math.cos(φ1) * Math.sin(φ2) * Math.cos(φ);
	var z = Math.cos(φ1) * Math.cos(φ2) * Math.sin(φ) * Math.sin(Δλ);

	if (z*z > x*x + y*y) return null; // great circle doesn't reach latitude

	var λm = Math.atan2(-y, x);                  // longitude at max latitude
	var Δλi = Math.acos(z / Math.sqrt(x*x+y*y)); // Δλ from λm to intersection points

	var λi1 = λ1 + λm - Δλi;
	var λi2 = λ1 + λm + Δλi;

	return { lon1: (λi1.toDegrees()+540)%360-180, lon2: (λi2.toDegrees()+540)%360-180 }; // normalise to −180..+180°
	};