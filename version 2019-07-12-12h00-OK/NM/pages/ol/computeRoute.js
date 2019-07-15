// for google
var _directionsService;

function initGoogleMap() {
	_directionsService = new google.maps.DirectionsService;
	}
	
// The "start" and "destination" features.
var _startPoint = new ol.Feature();
var _destPoint = new ol.Feature();

var _routePoints = new Array();
var _linePoints = new Array();

var _travelLayer = null;
var _travelLineLayer = null;

// A transformRoute function to convert coordinates from EPSG:3857
// to EPSG:4326.
var _transformRoute = null;

var _vectorLayer = null;

/*
	*/
function initializeRoute() {
	// The vector layer used to display the "start" and "destination" features.
	_vectorLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: [_startPoint, _destPoint]
			})
		});
	_map.addLayer(_vectorLayer);


	// A transformRoute function to convert coordinates from EPSG:3857
	// to EPSG:4326.
	_transformRoute = ol.proj.getTransform('EPSG:3857', 'EPSG:4326');
	}
	
/*
	*/
function clearTravelLayer() {
	
	if (_travelLayer != null) {
		if (_travelLayer.getSource() != null) _travelLayer.getSource().clear();
		_travelLayer.setSource( null);
		_map.removeLayer( _travelLayer);
		_travelLayer = null;
		}
	_routePoints = new Array();
	}
	
/*
	*/
function clearTravelLine() {
	
	if (_travelLineLayer != null) {
		if (_travelLineLayer.getSource() != null) _travelLineLayer.getSource().clear();
		_travelLineLayer.setSource( null);
		_map.removeLayer( _travelLineLayer);
		_travelLineLayer = null;
		}
	_linePoints  = new Array();
	}

/*
	*/
function calcRoute( start, end, mode) {

	var request = {
		origin:start, 
		destination:end,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
		};
		
	_directionsService.route(request, function( response, status) {
	
		if (status == google.maps.DirectionsStatus.OK) {
			
			clearTravelLayer();
			
			clearTravelLine();
	
			function processPoint( lng, lat) {
				var xPoint = new ol.Feature();
				var arr = new Array();
				arr.push( lng);
				arr.push( lat);
				
				_linePoints.push( arr);
				
				var pt = ol.proj.transform( arr, 'EPSG:4326', 'EPSG:3857');
				
				var aPoint = new ol.geom.Point( pt);
				//aPoint.transform('EPSG:4326', 'EPSG:900913');
				
				xPoint.setGeometry( aPoint);
				_routePoints.push( xPoint);
				}
				
			if (mode == "mainWay") {
			
	
				var myRoute = response.routes[0].legs[0];
				for (var i = 0; i < myRoute.steps.length; i++) {
					processPoint( myRoute.steps[i].start_point.lng(), myRoute.steps[i].start_point.lat());
					}
				var last = end.split(",");
				processPoint( Number(last[1]), Number(last[0]));
				}
				
			if (mode == "detailledWay") {
				var routePath = response.routes[ 0].overview_path;
				for(var i = 0; i < routePath.length; i++){
					
					processPoint( routePath[ i].lng(), routePath[ i].lat());
					}
				}
			
			_travelLayer = new ol.layer.Vector({
				source: new ol.source.Vector({
					features: _routePoints
					}),
				});
				
			_map.addLayer( _travelLayer);
				
			drawTravel( _linePoints);
			}
		else {
			console.log( status.toString());
			}
		});
	}
	
/*
	*/
function drawTravel( points) {

	for (var i = 0; i < points.length; i++) {
		points[i] = ol.proj.transform(points[i], 'EPSG:4326', 'EPSG:3857');
		}

	var featureLine = new ol.Feature({
		geometry: new ol.geom.LineString(points)
		});

	var vectorLine = new ol.source.Vector({});
	vectorLine.addFeature( featureLine);

	_travelLineLayer = new ol.layer.Vector({
		source: vectorLine,
		style: new ol.style.Style({
			fill: new ol.style.Fill({ color: '#00FF00', weight: 4 }),
			stroke: new ol.style.Stroke({ color: '#00FF00', width: 2 })
			})
		});
	_map.addLayer(_travelLineLayer);
	}