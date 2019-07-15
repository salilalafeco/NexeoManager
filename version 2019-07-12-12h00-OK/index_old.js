/* index.js
	- 2019/06/21-19h33, FPI
	- serveur nodejs du nexomanager
	- dernieres modifs : 
		accepter la mise à jour de zones de francissement;
		filtrer les spat recus
		boutons arrondis
    */
const fs = require('fs');

// npm install fs-copy-file --save
const copyFile = require('fs-copy-file');

// npm install --save fs-extra
// const fs = require("fs-extra");

var utils = require("./utils.js");

utils.initializeLog( '/var/log/NexoManagerLog');

utils.logAll("launch NexoManager...");

// npm install http --save
const http = require('http');

// npm install url --save
const url = require('url');

const path = require('path');

// npm install child_process --save
const _execAsync = require('child_process');
const _execSync = require('child_process').execSync;
const _spawn = require('child_process').spawn;

// npm install xml2js --save
const _parseString = require('xml2js').parseString;
const _xml2js = require('xml2js');

const _formidable = require('formidable');

/*
// npm install express --save
const express = require('express');
const _expressHdl = express();
*/

// npm install websocket --save
var WebSocketServer = require('websocket').server;
const _httpPort = 9080;
//const _httpPortExpress = 9081;

/*_expressHdl.listen( _httpPortExpress, function() {
	_logC.info('listen on port ', _httpPortExpress);
	});*/

utils.logAll("http Server...");
var _httpServer = http.createServer( httpRequestHandler);
_httpServer.listen( _httpPort, (err) => {
	if (err) {
		utils.logAll('_httpServer.listen > something bad happened > ' + err, 'warn');
		return;
		}
  
	utils.logAll(`_httpServer.listen > server is listening on ${_httpPort}`);
  	})


const _wsHttpPort = 9081;
utils.logAll("WebSocketServer http Server...");
var _webSocketHttpServer = http.createServer( function(request, response) {
	// process HTTP request. Since we're writing just WebSockets
	// server we don't have to implement anything.	
    });
    
_webSocketHttpServer.listen( _wsHttpPort, (err) => {
	if (err) {
		utils.logAll(`_webSocketHttpServer.listen > something bad happened > ${err}`, 'warn')
		return ;
		}
	utils.logAll(`_webSocketHttpServer.listen > server is listening on ${_wsHttpPort}`);
	})
// create the server
var _wsServer = new WebSocketServer({
	httpServer: _webSocketHttpServer
	});

// clients wevSockets
var _wsServerClients = [ ];
  
// WebSocket server
_wsServer.on('request', function(request) {

	var connection = request.accept( null, request.origin);

	//declare un nouveau client connecté
	var _indexWsClient = _wsServerClients.push( connection) - 1;
	utils.logAll(`_wsServer.accept new connection ${_indexWsClient}`);

	// This is the most important callback for us, we'll handle
	// all messages from users here.
	connection.on('message', wsServer_OnMessage);
  
	connection.on('close', function(connection) {
		// remove user from the list of connected clients
		_wsServerClients.splice( _indexWsClient, 1);
		utils.logAll(`_wsServer.close connection ${_indexWsClient}`);
		});
	});

/*
	*/
function varToJson( v ) {
	var result = {};

    for (var x in v) {
		try {
			if (typeof v[x] === "function") continue;

			if (utils.isObject(x)) {
				result[x] = varToJson( v[x]);
				}
			else {
				result[x] = v[x];
				}
			}
		catch(err) {
			var serr = err;
			}
		}
	return result;
	}

/*
	*/
function BroadcastToWsClients( jsn) {
	
	//var jsn = varToJson( v);
	var strMsg = JSON.stringify( jsn);
	
	for (var i=0; i < _wsServerClients.length; i++) {
		BroadcastToWsClient( _wsServerClients[i], strMsg);
		}
	}

/*
	*/
function BroadcastToWsClient( wsServerClient, jsnMessage) {
	
	var strMsg = JSON.stringify( jsnMessage);
	wsServerClient.sendUTF( strMsg);
    }
	
// distribue à tous les connectés l'horodate de l'UBR	
setInterval( givesCurrentDateTime, 5000);


/*
	*/
function httpRequestHandler(request, response) {
	
	try {
		utils.logAll( `request.url > ${request.url}` );
		
		var parseUrl = url.parse( decodeURI( request.url), true);
		var query = url.parse( decodeURI( request.url), true).query;

		var filePath = './pages' + parseUrl.path;

		var extname = "";
		if (parseUrl.path != ""
			&& parseUrl.path != "/"
			&& fs.existsSync(filePath)) {
			extname = path.extname( "./pages/" + filePath);
			}
		else if (request.url == '/spatModuleParamToUpload') {

			executeCommand( "mount -o remount,rw /", null);

			var form = new _formidable.IncomingForm();
			form.parse( request, function (err, fields, files) {
				var oldpath = files.theFile.path;
				var newpath = '/root/spat_mobile_params.xml';
				copyFile( oldpath, newpath, function (err) {
					if (err) {
						response.writeHead( 200, { 'Content-Type': 'text/html' });
						var jAnswer = { 'request': request.url, 
							'report' : 'NOK',
							'comment' : err};
						var sAnswer = JSON.stringify( jAnswer);
						response.end( sAnswer);
						}
					else {
						response.writeHead( 200, { 'Content-Type': 'text/html' });
						var jAnswer = { 'request': request.url, 
							'report' : 'OK',
							'comment' : `le fichier de parametrage "${newpath}" a ete copie`};
						var sAnswer = JSON.stringify( jAnswer);
						response.end( sAnswer);
						}
					// executeCommand( "mount -o remount,r /", null);
					});
				});
			return;
			}
		else if (request.url.startsWith('/spatModuleParamToDownload')) {
			getFile( '/root/spat_mobile_params.xml', parseUrl, response, 'text/xml' );
			return;
			}
		else if (request.url.startsWith('/mapFileToDownload')) {
			getFile( '/root/map_params.json', parseUrl, response, 'text/json' );
			return;
			}
		else if (request.url.startsWith('/filePartToDownload')) {
			var filePath = query['filePath'];
			var sizeInBytes = 1000;
			try {
				sizeInBytes = query['sizeInBytes'];
				}
			catch(err) {}
			// AAA
			executeCommand('tail -c ' + sizeInBytes + ' ' + filePath, parseUrl, response, 'text/html', sizeInBytes + 1000 );
			return;
			}
		else if (request.url == '/mapFileToUpload') {

			executeCommand( "mount -o remount,rw /", null);

			var form = new _formidable.IncomingForm();
			form.parse( request, function (err, fields, files) {
				var oldpath = files.theFile.path;
				var newpath = '/root/map_params.json';
				copyFile( oldpath, newpath, function (err) {
					if (err) {
						response.writeHead( 200, { 'Content-Type': 'text/html' });
						var jAnswer = { 'request': request.url, 
							'report' : 'NOK',
							'comment' : err};
						var sAnswer = JSON.stringify( jAnswer);
						response.end( sAnswer);
						}
					else {
						response.writeHead( 200, { 'Content-Type': 'text/html' });
						var jAnswer = { 'request': request.url, 
							'report' : 'OK',
							'comment' : `le fichier de parametrage "${newpath}" a ete copie`};
						var sAnswer = JSON.stringify( jAnswer);
						response.end( sAnswer);
						}
					// executeCommand( "mount -o remount,r /", null);
					});
				});
			return;
			}
		else if (request.url == '/spatProgToUpload') {

			executeCommand( "mount -o remount,rw /", null);

			var form = new _formidable.IncomingForm();
			form.parse( request, function (err, fields, files) {
				var oldpath = files.theFile.path;
				var newpath = '/root/spat_mobile_appli';

				copyFile( oldpath, newpath, function (err) {
					if (err) {
						response.writeHead( 200, { 'Content-Type': 'text/html' });
						var jAnswer = { 'request': request.url, 
							'report' : 'NOK',
							'comment' : err};
						var sAnswer = JSON.stringify( jAnswer);
						response.end( sAnswer);
						}
					else {
						// rendre executable
						executeCommand( "chmod +x " + newpath, null);

						response.writeHead( 200, { 'Content-Type': 'text/html' });
						var jAnswer = { 'request': request.url, 
							'report' : 'OK',
							'comment' : `le programe "${newpath}" a ete copie`};
						var sAnswer = JSON.stringify( jAnswer);
						response.end( sAnswer);
						}
					//executeCommand( "mount -o remount,r /", null);
					});
				});
			return;
			}
		/* modification des lignes de franchissements
			On reçoit un tableau JSON avec le descriptif de chaque ligne,
			On va donc charger le fichier spat_mobile_params, le purger de ses 'ZonesDetections',
			et recréer chacune des 'ZoneDetection'
			*/
		else if (request.url == '/spatModuleParamUploadFranchissementLignes'
			&& request.method == 'POST') {
			// FPI
			executeCommand( "mount -o remount,rw /", null);

			var body = ''
			request.on('data', function(data) {
				body += data
				console.log('Partial body: ' + body)
				});

			request.on('end', function() {
				// on a reçu tous le json
				console.log('ZonesDetections data : ' + body);
				var jsonBody = JSON.parse( body);
				
				var theFile = '/root/spat_mobile_params.xml';
				updateXmlFile( theFile, updateSpatParamWithZonesDetections, jsonBody,
					parseUrl, response, 'text/html');
				});
			return;
			}
		else {
			utils.logAll( `request.url > ${request.url}` );
			utils.logAll( `parseUrl.path > ${parseUrl.path}` );

			// requêtes spéciales
			var contentType = 'text/html';
			var ok = false;
			var report = "";

			do {
				if ( parseUrl.pathname == "/stopStartService") {
					ok = true;
					var service = query['service'];
					var way = query['way'];
					
					stopStartService( service, way, parseUrl, response, contentType);

					return;
					}

				if ( parseUrl.pathname == "/System.Reboot") {
					ok = true;
					executeCommand('reboot', parseUrl, response, contentType );
					return;
					}
				if ( parseUrl.pathname == "/System.Halt") {
					ok = true;
					executeCommand('halt', parseUrl, response, contentType );
					return;
					}			
				if ( parseUrl.pathname == "/System.Date.Force") {
					ok = true;
					var datetime = query['datetime'];

					var sCmd = "mount -o remount,rw /; ";
					sCmd += "timedatectl set-ntp false; ";
					sCmd += 'timedatectl set-time "' + datetime + '"; ';
					sCmd += "timedatectl set-ntp true;";

					executeCommand( sCmd, parseUrl, response, contentType );
					return;
					}		
				if ( parseUrl.pathname == "/MiddleWare.Restart") {
					ok = true;
					executeCommand('systemctl restart mw-server', parseUrl, response, contentType );
					return;
					}
				if ( parseUrl.pathname == "/MiddleWare.Version.Get") {
					ok = true;
					/*
					//pour tester sur la machine widows
					if (utils.GetPlatform().startsWith("win")) {
						executeCommand('tail -n 100000 \\var\\log\\syslog | grep "Starting middleware-server"',
							parseUrl, response, contentType );
						}
					else {
						//executeCommand('tail -n 100000 /var/log/syslog | grep "Starting middleware-server"',
						executeCommand('tac /var/log/syslog | grep -m 1 "Starting middleware-server"',
							parseUrl, response, contentType );
						}*/
					
					// lire le fichier /run/spat_mobile_infos.json
					// extraire MiddleWare.VersionLogiciel
					var theFile = "/run/spat_mobile_infos.json";
					if (fs.existsSync( theFile)) {
						var contents = fs.readFileSync( theFile);
						var jsonContent = JSON.parse(contents);
						var theValue = jsonContent.MiddleWare.VersionLogiciel;
						response.writeHead(200, { 'Content-Type': contentType });
						var jAnswer = { 'request': parseUrl.path, 
							'report' : 'OK',
							'value' : theValue,
							'comment' : 'attribut lu avec succès',
							'newValue': theValue };
						var sAnswer = JSON.stringify( jAnswer);
						response.end( sAnswer);
						}
					else {
						response.writeHead(200, { 'Content-Type': contentType });
						var jAnswer = { 'request': parseUrl.path, 
							'report' : 'NOK',
							'comment' : 'fichier absent'};
						var sAnswer = JSON.stringify( jAnswer);
						response.end( sAnswer);
						}
					return;
					}

				if ( parseUrl.pathname == "/SpatModule.Version.Get") {
					ok = true;

					/*executeCommand( 'tac /var/log/syslog | grep -m 1 "Demarrage sPatMobile"',
						parseUrl, response, contentType );
					// la fonction envoie la réponse*/
					// extraire sPatMobile.VersionLogiciel + VersionParams
					var theFile = "/run/spat_mobile_infos.json";
					if (fs.existsSync( theFile)) {
						var contents = fs.readFileSync(theFile);
						var jsonContent = JSON.parse(contents);
						var theValue = jsonContent.sPatMobile.VersionLogiciel + " - " + 
							jsonContent.sPatMobile.VersionParams;
						response.writeHead(200, { 'Content-Type': contentType });
						var jAnswer = { 'request': parseUrl.path, 
							'report' : 'OK',
							'value' : theValue,
							'comment' : 'attribut lu avec succès',
							'newValue': theValue };
						var sAnswer = JSON.stringify( jAnswer);
						response.end( sAnswer);
						}
					else {
						response.writeHead(200, { 'Content-Type': contentType });
						var jAnswer = { 'request': parseUrl.path, 
							'report' : 'NOK',
							'comment' : 'fichier absent'};
						var sAnswer = JSON.stringify( jAnswer);
						response.end( sAnswer);
						}
					return;
					//!!!!!
					}

				if ( parseUrl.pathname == "/MiddleWare.StationId.Get") {
					ok = true;

					getXmlAttribute( '/etc/mw-server/choirconf.xml', '/configuration/globalconf', 'its_su_id', 
						parseUrl, response, contentType );
					// la fonction envoie la réponse
					return;
					//!!!!!
					}

				if ( parseUrl.pathname == "/MiddleWare.StationId.Set") {
					ok = true;
					var stationId = query['stationId'];

					executeCommand( "mount -o remount,rw /", null);

					setTimeout( function() {
						utils.logAll( "/MiddleWare.StationId.Set differe");

						// la fonction envoie la réponse
						updateXmlAttribute( '/etc/mw-server/choirconf.xml', '/configuration/globalconf', 'its_su_id', stationId,
							parseUrl, response, contentType );
						}, 2000);
					
					return;
					//!!!!!
					}

				if ( parseUrl.pathname == "/MiddleWare.StationType.Get") {
					ok = true;

					getXmlAttribute( '/etc/mw-server/choirconf.xml', '/configuration/globalconf', 'stationtype', 
						parseUrl, response, contentType );
					// la fonction envoie la réponse
					return;
					//!!!!!
					}
					
				if ( parseUrl.pathname == "/MiddleWare.Latitude.Set") {
					ok = true;
					var latitude = query['latitude'];

					executeCommand( "mount -o remount,rw /", null);

					setTimeout( function() {
						utils.logAll( "/MiddleWare.Latitude.Set differe");
						// la fonction envoie la réponse
						updateXmlAttribute( '/etc/mw-server/config/30-positionprovider.xml', '/configuration/config/staticprovider', 'latitude', latitude,
							parseUrl, response, contentType );
						}, 2000);

					return;
					//!!!!!
					}

				if ( parseUrl.pathname == "/MiddleWare.Longitude.Set") {
					ok = true;
					var longitude = query['longitude'];

					executeCommand( "mount -o remount,rw /", null);

					setTimeout( function() {
						utils.logAll( "/MiddleWare.Longitude.Set differe");

						// la fonction envoie la réponse
						updateXmlAttribute( '/etc/mw-server/config/30-positionprovider.xml', '/configuration/config/staticprovider', 'longitude', longitude,
							parseUrl, response, contentType );
						}, 2000);
					return;
					//!!!!!
					}

				if ( parseUrl.pathname == "/MiddleWare.Latitude.Get") {
					ok = true;

					getXmlAttribute( '/etc/mw-server/config/30-positionprovider.xml', '/configuration/config/staticprovider', 'latitude', 
						parseUrl, response, contentType );
					// la fonction envoie la réponse
					return;
					//!!!!!
					}

				if ( parseUrl.pathname == "/MiddleWare.Longitude.Get") {
					ok = true;

					getXmlAttribute( '/etc/mw-server/config/30-positionprovider.xml', '/configuration/config/staticprovider', 'longitude', 
						parseUrl, response, contentType );
					// la fonction envoie la réponse
					return;
					//!!!!!
					}

				if ( parseUrl.pathname == "/System.IpFixe.Get") {
					ok = true;

					/*
					executeCommand('ip addr show eth0 | grep -m 1 "inet"',
						parseUrl, response, contentType );
					// la fonction envoie la réponse*/
					// lire le fichier /etc/network/interfaces.d/01-eth0
					var theFile = "/etc/network/interfaces.d/01-eth0";
					var theValue =  fs.readFileSync(theFile, "utf-8");
					utils.logAll( "/etc/network/interfaces.d/01-eth0 > " + theValue);
					response.writeHead(200, { 'Content-Type': contentType });
					var jAnswer = { 'request': parseUrl.path, 
						'report' : 'OK',
						'value' : theValue,
						'comment' : 'fichier ' + theFile + " lu avec succes.",
						'newValue': theValue };
					var sAnswer = JSON.stringify( jAnswer);
					response.end( sAnswer);

					return;
					//!!!!!
					}
					
				if ( parseUrl.pathname == "/System.IpFixe.Set") {
					ok = true;

					executeCommand( "mount -o remount,rw /", null);

					setTimeout( function() {

						utils.logAll( "/System.IpFixe.Set differe");

						try {
							var ipFixe = query['ipFixe'];
							var maskFixe = query['maskFixe'];
							var gatewayFixe = query['gatewayFixe'];

							var theFile = "/etc/network/interfaces.d/01-eth0";
							var theValue = 
								"allow-hotplug eth0\n" +
								"iface eth0 inet static\n" + 
								"	address " + ipFixe + "\n" +
								"	netmask " + maskFixe + "\n" +
								"	gateway " + gatewayFixe + "\n" +
								"	dns-search google.com\n" +
								"	dns-nameservers 8.8.8.8\n" +
								"	pre-up iptables -t nat -A POSTROUTING -s 192.168.50.0/24 -o eth0 -p udp -j MASQUERADE --to-ports 10000-65535\n" +
								"	pre-up iptables -t nat -A POSTROUTING -s 192.168.50.0/24 -o eth0 -p tcp -j MASQUERADE --to-ports 10000-65535\n" +
								"	pre-up iptables -t nat -A POSTROUTING -s 192.168.50.0/24 -o eth0 -p icmp -j MASQUERADE";

							fs.writeFileSync( theFile, theValue);

							utils.logAll( "/etc/network/interfaces.d/01-eth0 > " + theValue);

							response.writeHead(200, { 'Content-Type': contentType });
							var jAnswer = { 'request': parseUrl.path, 
								'report' : 'OK',
								'comment' : 'fichier ' + theFile + " écrit avec succes." };
							var sAnswer = JSON.stringify( jAnswer);
							response.end( sAnswer);
							}
						catch(err) {
							response.writeHead(200, { 'Content-Type': contentType });
							var jAnswer = { 'request': parseUrl.path, 
								'report' : 'NOK',
								'comment' : 'fichier ' + theFile + " erreur : " + err.toString() };
							var sAnswer = JSON.stringify( jAnswer);
							response.end( sAnswer);
							}
						}, 2000);
					
					return;
					//!!!!!
					}

				if ( parseUrl.pathname == "/System.Hostname.Get") {
					ok = true;

					executeCommand('hostname',
						parseUrl, response, contentType );
					// la fonction envoie la réponse
					return;
					//!!!!!
					}

				if ( parseUrl.pathname == "/System.Temperature.Get") {
					ok = true;

					executeCommand('/root/NexoManager/scripts/temperature.sh',
						parseUrl, response, contentType );
					// la fonction envoie la réponse
					return;
					//!!!!!
					}
				}
			while(false);

			if (ok) {
				response.writeHead(200, { 'Content-Type': contentType });
				response.end( parseUrl.path + " : " + report);
				}
			else {
				/*response.writeHead(200, { 'Content-Type': contentType });
				response.end( parseUrl.path + " : " + "echec !");*/
				var contentType = 'text/html';
				fs.readFile('./pages/404.html', function(error, content) {
					if (error) {
						response.writeHead(404);
						response.end('Erreur : 404 (page introuvable)\n', 'utf-8');
						response.end(); 
						}
					else {
						response.writeHead(200, { 'Content-Type': contentType });
						response.end(content, 'utf-8');
						}
					});
				}

			return;
			//!!!!!
			}

		var contentType = 'text/html';
		switch (extname) {
			case '.js':
				contentType = 'text/javascript';
				break;
			case '.css':
				contentType = 'text/css';
				break;
			case '.json':
				contentType = 'application/json';
				break;
			case '.png':
				contentType = 'image/png';
				break;      
			case '.jpg':
				contentType = 'image/jpg';
				break;
			case '.wav':
				contentType = 'audio/wav';
				break;
			}

		fs.readFile(filePath, function(error, content) {
			if (error) {
				if (error.code == 'ENOENT'){
					
					fs.readFile('./pages/404.html', function(error, content) {
						if (error) {
							response.writeHead(404);
							response.end('Erreur : 404 (page introuvable)\n', 'utf-8');
							response.end(); 
							}
						else {
							response.writeHead(200, { 'Content-Type': contentType });
							response.end(content, 'utf-8');
							}
						});
					}
				else {
					response.writeHead(500);
					response.end('Erreur : ' + error.code+' ..\n', 'utf-8');
					response.end(); 
					}
				}
			else {
				response.writeHead(200, { 'Content-Type': contentType });
				response.end( content, 'utf-8');
				}
			});
		}
	catch (errGlob) {
		response.writeHead(404);
		response.end('Erreur :exception : ' + errGlob.toString(), 'utf-8');
		response.end(); 
		}
	}

/*
	*/
function executeCommand( cmd, parseUrl, response, contentType, specificStdoutSize ) {

	try {
		var maxBufferSize = 100000;
		if (specificStdoutSize != undefined
			&& specificStdoutSize != null) {
			maxBufferSize = specificStdoutSize;
			}
		console.log("maxBufferSize=" + maxBufferSize);
		_execAsync.exec( cmd, {'maxBuffer': maxBufferSize}, (err, stdout, stderr) => {
			if (err) {
				utils.logAll( `execute "${cmd}" > exception > "${err}"`, 'warn');
				
				if (parseUrl != null) {
					response.writeHead(200, { 'Content-Type': contentType });
					var jAnswer = { 'request': parseUrl.path, 
						'report' : 'NOK',
						'comment' : err};
					var sAnswer = JSON.stringify( jAnswer);
					response.end( sAnswer);
					}
				}
			else if (stdout) {
				utils.logAll( `execute "${cmd}" > succes > "${stdout}"`);
				
				if (parseUrl != null) {
					response.writeHead(200, { 'Content-Type': contentType });
					var jAnswer = { 'request': parseUrl.path, 
						'report' : 'OK',
						'comment' : stdout,
						'newValue': stdout};
					var sAnswer = JSON.stringify( jAnswer);
					response.end( sAnswer);
					}
				}			
			else if (stderr) {
				utils.logAll( `execute "${cmd}" > echec > "${stderr}"`, 'warn');
				
				if (parseUrl != null) {
					response.writeHead(200, { 'Content-Type': contentType });
					var jAnswer = { 'request': parseUrl.path, 
						'report' : 'NOK',
						'comment' : stderr};
					var sAnswer = JSON.stringify( jAnswer);
					response.end( sAnswer);
					}
				}

			});
		}
	catch(err) {
		utils.logAll( `execute "${cmd}" > exception > "${err}"`, 'warn');
		
		if (parseUrl != null) {
			response.writeHead(200, { 'Content-Type': contentType });
			var jAnswer = { 'request': parseUrl.path, 
				'report' : 'exception',
				'comment' : `exception > ${err}`};
			var sAnswer = JSON.stringify( jAnswer);
			response.end( sAnswer);
			utils.logAll( JSON.stringify( jAnswer), 'warn');
			}
		}
	}

/*
	*/
function processSync( cmd){
	var report = { 'status':1, 'message':null, 'stderr':null, 'stdout':null};
	try {
		var rep = _execSync(cmd);
		console.log( `processSync > ${cmd} > ok > ` + rep.toString());
		report.stdout = rep.toString();
		report.status = 0;
	  	} 
	catch (error) {
		console.log( `processSync > ${cmd} > NOK > ` + error.toString());
		report.status = error.status;
		report.message = error.message.toString();
		report.stderr = error.stderr.toString();
		report.stdout = error.stdout.toString();
		}
	return report;
	}

/**/ 
function stopStartService( service, way, parseUrl, response, contentType) {
	
	/*const util = require('util');
	const exec = util.promisify(require('child_process').exec);*/

	function failure(report) {
		console.log( `failure ${way} ${service} ...`);
		response.writeHead(200, { 'Content-Type': contentType });
		var jAnswer = { 'request': parseUrl.path, 
			'report' : 'NOK',
			'comment' : report,
			'newValue': ''};
		var sAnswer = JSON.stringify( jAnswer);
		response.end( sAnswer);
		}
	function success(report) {
		console.log( `success ${way} ${service} ...`);
		response.writeHead(200, { 'Content-Type': contentType });
		var jAnswer = { 'request': parseUrl.path, 
			'report' : 'OK',
			'comment' : report,
			'newValue': ''};
		var sAnswer = JSON.stringify( jAnswer);
		response.end( sAnswer);
		}

	console.log( `${way} ${service} ...`);
	var report = processSync( `systemctl ${way} ${service}`);
	if (report.stderr != null) {
		failure(report.stderr);
		return;
		}

	setTimeout( () => {
		console.log('is-active ' + service + '...');
		var report = processSync( `systemctl is-active ${service}`);
		if (report.stderr != null) {
			failure(report.stderr);
			return;
			}
		if (	(way == 'stop' && report.stdout.startsWith( 'inactive'))
			||	(way == 'start' && report.stdout.startsWith( 'active')) ) {
			console.log('success');
			success('success');
			return;
			}
		else {
			console.log('failure');
			failure('unsuccess');
			return;
			}
		}, 5000);
	}

/*
	*/
function wsServer_OnMessage(message) {
	utils.logAll(`wsServer_OnMessage receive "${message}"`);
	if (message.type === 'utf8') {
		// process WebSocket message
		}
	}

/*
	*/
function updateXmlAttribute( theFile, thePath, attributeName, theValue,
	parseUrl, response, contentType) {
	
	executeCommand( "mount -o remount,rw /", null);

	fs.readFile( theFile, 'utf-8', function (err, data){
		if(err) {
			response.writeHead(200, { 'Content-Type': contentType });
			var jAnswer = { 'request': parseUrl.path, 
				'report' : 'err',
				'comment' : `fs.readFile > ${err}`};
			var sAnswer = JSON.stringify( jAnswer);
			response.end( sAnswer);
			utils.logAll( JSON.stringify( jAnswer), 'warn');

			return;
			}

		// we log out the readFile results    
		utils.logAll( `file content before : ${data}`);

		// we then pass the data to our method here
		_parseString( data, function( err, result){
			if (err)  {
				response.writeHead(200, { 'Content-Type': contentType });
				var jAnswer = { 'request': parseUrl.path, 
					'report' : 'err',
					'comment' : `parseString > ${err}`};
				var sAnswer = JSON.stringify( jAnswer);
				response.end( sAnswer);
				utils.logAll( JSON.stringify( jAnswer), 'warn');

				return;
				}
			// here we log the results of our xml string conversion
			// console.log(result); 
			
			var json = result;

			var attrNode = utils.getXmlAttributeNode( json, thePath);
			if (attrNode == null) {
				response.writeHead(200, { 'Content-Type': contentType });
				var jAnswer = { 'request': parseUrl.path, 
					'report' : 'err',
					'comment' : `attribut non trouvé !`};
				var sAnswer = JSON.stringify( jAnswer);
				response.end( sAnswer);
				utils.logAll( JSON.stringify( jAnswer), 'warn');

				return;
				//!!!!!
				}

			attrNode[0]['$'][attributeName] = theValue;
			
			// create a new builder object and then convert
			// our json back to xml.
			var builder = new _xml2js.Builder();
			var xml = builder.buildObject(json);
			
			fs.writeFile( theFile, xml, function( err, data){
				if (err) {
					response.writeHead(200, { 'Content-Type': contentType });
					var jAnswer = { 'request': parseUrl.path, 
						'report' : 'err',
						'comment' : `fs.writeFile > ${err}`};
					var sAnswer = JSON.stringify( jAnswer);
					response.end( sAnswer);
					utils.logAll( JSON.stringify( jAnswer), 'warn');

					return;
					}
				
				response.writeHead(200, { 'Content-Type': contentType });
				var jAnswer = { 'request': parseUrl.path, 
					'report' : 'OK',
					'comment' : 'attribut modifié avec succès',
					'newValue': theValue };
				var sAnswer = JSON.stringify( jAnswer);
				response.end( sAnswer);

				utils.logAll( JSON.stringify( jAnswer));

				// executeCommand( "mount -o remount,r /", null);
				})	  
			});
		});
	}


/*
	*/
function updateXmlFile( theFile, theProcessingFunction, jsonInputInformations,
	parseUrl, response, contentType) {
	
	executeCommand( "mount -o remount,rw /", null);

	fs.readFile( theFile, 'utf-8', function (err, data){
		if(err) {
			response.writeHead(200, { 'Content-Type': contentType });
			var jAnswer = { 'request': parseUrl.path, 
				'report' : 'err',
				'comment' : `fs.readFile > ${err}`};
			var sAnswer = JSON.stringify( jAnswer);
			response.end( sAnswer);
			utils.logAll( JSON.stringify( jAnswer), 'warn');

			return;
			}

		// we log out the readFile results    
		utils.logAll( `file content before : ${data}`);

		// we then pass the data to our method here
		_parseString( data, function( err, result){
			if (err)  {
				response.writeHead(200, { 'Content-Type': contentType });
				var jAnswer = { 'request': parseUrl.path, 
					'report' : 'err',
					'comment' : `parseString > ${err}`};
				var sAnswer = JSON.stringify( jAnswer);
				response.end( sAnswer);
				utils.logAll( JSON.stringify( jAnswer), 'warn');

				return;
				}

			// here we log the results of our xml string conversion
			// console.log(result); 
			
			var json = result;

			json = theProcessingFunction( json, jsonInputInformations);
			
			// create a new builder object and then convert
			// our json back to xml.
			var builder = new _xml2js.Builder();
			var xml = builder.buildObject( json);
			
			// pour tester
			//theFile = "/tmp/test.xml";
			fs.writeFile( theFile, xml, function( err, data){
				if (err) {
					response.writeHead(200, { 'Content-Type': contentType });
					var jAnswer = { 'request': parseUrl.path, 
						'report' : 'err',
						'comment' : `fs.writeFile > ${err}`};
					var sAnswer = JSON.stringify( jAnswer);
					response.end( sAnswer);
					utils.logAll( JSON.stringify( jAnswer), 'warn');

					return;
					}
				
				response.writeHead(200, { 'Content-Type': contentType });
				var jAnswer = { 'request': parseUrl.path, 
					'report' : 'OK',
					'comment' : 'fichier modifié avec succès'};
				var sAnswer = JSON.stringify( jAnswer);
				response.end( sAnswer);

				utils.logAll( JSON.stringify( jAnswer));
				})	  
			});
		});
	}

	
/*
	*/
function getXmlAttribute( theFile, thePath, attributeName, 
	parseUrl, response, contentType) {

	fs.readFile( theFile, 'utf-8', function (err, data){
		if(err) {
			response.writeHead(200, { 'Content-Type': contentType });
			var jAnswer = { 'request': parseUrl.path, 
				'report' : 'err',
				'comment' : `fs.readFile > ${err}`};
			var sAnswer = JSON.stringify( jAnswer);
			response.end( sAnswer);
			utils.logAll( JSON.stringify( jAnswer), 'warn');

			return;
			}

		// we log out the readFile results    
		// _logF.info( "file content before : ", data);

		// we then pass the data to our method here
		_parseString(data, function(err, result){
			if (err)  {
				response.writeHead(200, { 'Content-Type': contentType });
				var jAnswer = { 'request': parseUrl.path, 
					'report' : 'err',
					'comment' : `parseString > ${err}`};
				var sAnswer = JSON.stringify( jAnswer);
				response.end( sAnswer);
				utils.logAll( JSON.stringify( jAnswer), 'warn');

				return;
				}
			// here we log the results of our xml string conversion
			//console.log(result); 
			
			var json = result;

			var attrNode = utils.getXmlAttributeNode( json, thePath);
			if (attrNode == null) return;

			var theValue=  attrNode[0]['$'][attributeName];
			
			response.writeHead(200, { 'Content-Type': contentType });
			var jAnswer = { 'request': parseUrl.path, 
				'report' : 'OK',
				'value' : theValue,
				'comment' : 'attribut lu avec succès',
				'newValue': theValue };
			var sAnswer = JSON.stringify( jAnswer);
			response.end( sAnswer);

			utils.logAll( JSON.stringify( jAnswer));
			});
		});
	}

	
/*
	*/
function getFile( theFile, 
	parseUrl, response, contentType) {

	fs.readFile( theFile, 'utf-8', function (err, data){
		if(err) {
			response.writeHead(200, { 'Content-Type': contentType });
			var jAnswer = { 'request': parseUrl.path, 
				'report' : 'err',
				'comment' : `fs.readFile > ${err}`};
			var sAnswer = JSON.stringify( jAnswer);
			response.end( sAnswer);
			utils.logAll( JSON.stringify( jAnswer), 'warn');

			return;
			}

		response.writeHead(200, { 'Content-Type': contentType });
		response.end( data, "utf-8");
		});
	}

/*
	*/
function updateSpatParamWithZonesDetections( json, ZonesDetectionsArray) {
	
	do {
		var nParametres = utils.getXmlAttributeNode( json, '/Parametres');
		if (nParametres == null) break;
		try {
			nParametres['ZonesDetections'] = {};

			var nZones = [];
			for( var z=0; z < ZonesDetectionsArray.length; z++) {
				var nZoneDetection = {};
				nZoneDetection['$'] = {};
				nZoneDetection['$']['Nom'] = ZonesDetectionsArray[z]['Nom'];
				nZoneDetection['$']['MasqueGroupesVehicules'] = ZonesDetectionsArray[z]['MasqueGroupesVehicules'];

				nZoneDetection['$']['Franchiss0Longi'] = ZonesDetectionsArray[z]['Franchiss0'][0];
				nZoneDetection['$']['Franchiss0Lati'] = ZonesDetectionsArray[z]['Franchiss0'][1];
				nZoneDetection['$']['Franchiss1Longi'] = ZonesDetectionsArray[z]['Franchiss1'][0];
				nZoneDetection['$']['Franchiss1Lati'] = ZonesDetectionsArray[z]['Franchiss1'][1];

				nZoneDetection['$']['AxeVehi0Longi'] = ZonesDetectionsArray[z]['AxeVehi0'][0];
				nZoneDetection['$']['AxeVehi0Lati'] = ZonesDetectionsArray[z]['AxeVehi0'][1];
				nZoneDetection['$']['AxeVehi1Longi'] = ZonesDetectionsArray[z]['AxeVehi1'][0];
				nZoneDetection['$']['AxeVehi1Lati'] = ZonesDetectionsArray[z]['AxeVehi1'][1];

				nZoneDetection['$']['RessType'] = ZonesDetectionsArray[z]['RessType'];
				nZoneDetection['$']['RessNum'] = ZonesDetectionsArray[z]['RessNum'];

				nZones.push( nZoneDetection );
				}
			nParametres['ZonesDetections']['ZoneDetection'] = nZones;
			}
		catch( err) {
			console.log( 'updateSpatParamWithZonesDetections > ' + err);
			}
		}
	while(false);

	return json;
	}

/****
 * gestion des n° de message par WebSocket
 */
var _wsMsgIndex = 0;
function getNextMsgIndex() {
	_wsMsgIndex++;
	return _wsMsgIndex;
	}

function BuildWsMessage( sMsgType) {

	var jsn = {};
	
	jsn.context = {};
	jsn.context.MsgType = sMsgType;
	jsn.context.MsgIndex = getNextMsgIndex().toString();

	var dt = new Date();
	jsn.context.TimeStamp = dt.toString();	// dt.yyyymmddhhmmsslll();

	jsn.message = {};

	return jsn;
	}

/****
 * Donne l'heure de l'UBR à tous les clients
 * - utile pour calculer l'offset entre l'heure de l'UBR et du PC éxécutant le navigateur;
 */
function givesCurrentDateTime() {
		
	var jsn = BuildWsMessage( 'horodate');
	
	BroadcastToWsClients( jsn);
	}