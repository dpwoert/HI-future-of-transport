(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,5,2010)
		.marker('Uber beta starts', 'cars')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(37.774929, -122.419416, 'San Francisco')
				.build('cars');

		})
		.onLeave(function(){
			route.remove();
		});

}())