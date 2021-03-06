(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,10,1970)
		.marker('First commercial widebody plane', 'aviation','.timeline__first-commercial-widebody')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(51.507351, -0.127758, undefined, 'London')
				.add(40.712784, -74.005941, 8, 'New York')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
		});

}())
