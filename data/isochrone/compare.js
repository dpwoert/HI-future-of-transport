var map, background, drawnItems, image, f0, f1;
var options = {
	map: '1881',
	legends: [],
	value: ''
};

var saveFile = function(data, filename){

	if(!filename) {
		filename = 'data.json';
	}

	data = JSON.stringify(data);

	var blob = new Blob([data], {type: 'application/json'}),
	e    = document.createEvent('MouseEvents'),
	a    = document.createElement('a');

	a.download = filename;
	a.href = window.URL.createObjectURL(blob);
	a.dataset.downloadurl =  ['application/json', a.download, a.href].join(':');
	e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	a.dispatchEvent(e);

};

var getShapeColor = function(color){

	switch(color){
		case 'green': return '#1cb83a';
		case 'brown': return '#7e6026';
		case 'pink': return '#e90fb1';
		case 'yellow': return '#dfdd2f';
		case 'blue': return 'rgb(16, 106, 180)';
		default: return '#ffffff';
	}

};

options.load = function(){

	if(image){
		background.removeLayer(image);
	}

	switch(options.map){

		case '1881':

			var imageBounds = [[70,-160], [-40,180]];
			var url = '../../data/maps/Isochronic_Passage_Chart_Francis_Galton_1881.jpg';
			image = L.imageOverlay(url, imageBounds).addTo(background);
			// image.setOpacity(0.5);

			options.legends = ['choose', 'green', 'yellow', 'pink', 'blue', 'brown'];
			options.legendValues = [0, 24*10, 20*24, 30*24, 40*24, 50*24];

		break;

		case '2016':

			var imageBounds = [[90,-180], [-90,180]];
			var url = '../../data/maps/world-map-isochronic-2016-v2.jpg';
			image = L.imageOverlay(url, imageBounds).addTo(background);

			options.legends = ['choose', 'dark-red', 'red', 'light-red', 'yellow', 'green', 'dark-blue', 'blue'];
			options.legendValues = [0, 12, 18, 24, 36, 48];

		break;

	}

	for (var i in f1.__controllers) {
		f1.__controllers[i].updateDisplay();
		if(f1.__controllers[i].property === 'value'){
			f1.__controllers[i].remove();
		}

	}

	f1.add(options, 'value', options.legends).name('value').onFinishChange(options.change);

};
options.save = function(){

	var geo = drawnItems.toGeoJSON();
	var layers = drawnItems.getLayers();

	//get properties
	layers.forEach(function(layer, key){

		var index = options.legends.indexOf(layer.travelTime);
		geo.features[key].properties.color = layer.travelTime;
		geo.features[key].properties.travelTime = options.legendValues[index];

	})

	saveFile(geo, 'travel-times-'+ options.map +'.geojson');
};

var start = function(){

	var mapEl = document.querySelector('.map');

	//create container
	map = L
			.map(mapEl)
			.setView([20,0], 3);

	// Initialise the FeatureGroup to store editable layers
	background = new L.FeatureGroup();
	map.addLayer(background);

	// Initialise the FeatureGroup to store editable layers
	drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	// Initialise the draw control and pass it the FeatureGroup of editable layers
	var drawControl = new L.Control.Draw({
		edit: {
  			featureGroup: drawnItems
		}
	});
	map.addControl(drawControl);

	map.on('draw:created', function(event) {
		var layer = event.layer;

		//save legend value
		layer.travelTime = options.value;

		//get color
		layer.options.color = getShapeColor(options.value);
		drawnItems.addLayer(layer);

	});

	//add DATGUI
	var gui = new dat.GUI();

	f0 = gui.addFolder('Map');
	f1 = gui.addFolder('Readings');

	f0.add(options, 'map', ['1881', '1906','1914','1920','2016']).name('year');
	f0.add(options, 'load').name('change map')
	f0.add(options, 'save').name('save map')

	f1.add(options, 'value', options.legends).name('value');

	options.load();

	map.invalidateSize()

};

document.addEventListener("DOMContentLoaded", start);
