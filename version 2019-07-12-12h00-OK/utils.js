/* util.js
	2019/03/21, FPI
	- nodejs
	- utilisé par index.js du NexoManager
	*/
const fs = require('fs');

var _logF;
var _logC;

/*
	*/
exports.logAll = function( sMsg, how) {
	if (how == 'info' || how == undefined) {
		_logF.info( sMsg);
		_logC.info( sMsg);
		}
	else {
		_logF.warn( sMsg);
		_logC.warn( sMsg);
		}
	}

/*
	*/
exports.initializeLog = function( logPath) {

	if (fs.existsSync(logPath) == false) {
		fs.mkdir( logPath, { recursive: true }, (err) => {
			if (err) console.log(`log path "${logPath}" creation fails > ${err}`);		
			});
		}
	
	// https://www.npmjs.com/package/simple-node-logger
	// npm install simple-node-logger --save
	// create a rolling file logger based on date/time that fires process events
	const opts = {
		errorEventName:'error',
			logDirectory:'/var/log//NexoManagerLog', // NOTE: folder must exist and be writable...
			fileNamePattern:'roll-<DATE>.log',
			dateFormat:'YYYY.MM.DD'
		};
	
	_logF = require('simple-node-logger').createRollingFileLogger( opts );
	_logC = require('simple-node-logger').createSimpleLogger();	

	this.logAll(`log initialized in ${logPath}.`);
	}

/*
	*/
exports.isObject = function(value) {
	return (typeof value === 'object') && (value.constructor === Object);
	}
	
/*
	*/
exports.GetPlatform = function() {
	return process.platform;
	}
	
/*
'2015-09-30 16:20:30.127'
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
	var l = this.getMilliseconds() < 100 ? "0" : this.getMilliseconds() / 100;
	return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss + '.' + l;
	};
	
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
exports.getXmlAttributeNode = function( json, path) {
	var resultVar = null;

	var base = json;

	var arr = path.splitEx( "/");
	for( var i=0; i < arr.length; i++) {
		if (base instanceof Array) {
			base = base[0];
			}
		if ( arr[i] in base) {
			base = base[ arr[i] ];
			resultVar = base;
			}
		else {
			resultVar = null;
			break;
			}
		}

	return resultVar;
	}