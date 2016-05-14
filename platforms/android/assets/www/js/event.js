
document.addEventListener("deviceready", function(){
	var buttons = $("button");
	console.log(buttons.length);
	for(var i=0; i< buttons.length; ++i){
		var el = $(buttons[i]);
		var href = el.attr('href');
		console.log(href);
		if( ! href ) continue;

		// disabled
		var current_path = window.location.pathname.split('/').pop();
		if( href == current_path ){
			el.addClass('disabled');
		}

		el.on("click", function(e){
			var href = $(this).attr('href');
			if( ! href ) return;
			location.href = href;
		});
	}

	$('input[data-type="date-range"]').daterangepicker({
		"singleDatePicker": true,
		"timePicker": true,
		"timePicker24Hour": true,
		"timePickerIncrement": 5,
		"autoApply": true,
		"alwaysShowCalendars": true,
		"startDate": momentToKor(moment()),
		"endDate": momentToKor(moment()),
		"opens": "center",
		"locale": {
			format: 'YYYY년 MM월 DD일 H시 mm분'
		}
	}, function(start, end, label) {
		console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
	});

}, false);

window.korToMoment = function(text){
	return moment(text, 'YYYY년 MM월 DD일 H시 m분');
}

window.momentToKor = function(mmt) {
    return mmt.format('YYYY년 MM월 DD일 H시 m분');
}

/**
 *
 *   google maps script
 *
**/
window.onMapLoad = function() {
	//if (isConnected) {
		// google api를 동적으로 Load한다.
		var fileref = document.createElement('script');
		fileref.setAttribute("type", "test/javascript");
		fileref.setAttribute("src",
			"http://maps.google.com/maps/api/js?v=3&callback="
				+ "getGeolocation");
		document.getElementsByTagName("head")[0].appendChild(fileref);
	//} else {
	//	alert("Must be connected to the Internet");
	//}
}

window.getGeolocation = function(path){
	// get the user's gps coordinates and display map
	var options = {
		maximumAge: 3000,
		timeout : 5000,
		enableHighAccuracy: true
	};
	if( ! path || path.length < 2 ){
	    navigator.geolocation.getCurrentPosition(loadMap, geoError, options);
	} else {
	    drawPath(path);
	}
}

window.drawPath = function(path) {
	var map = new google.maps.Map(document.getElementById('maps'), {
		center: path[0],
		scrollwheel: false,
		zoom: 10
	});

	var directionsDisplay = new google.maps.DirectionsRenderer({
		map: map
	});

	// Set destination, origin and travel mode.
	var wpts = [];
	for(var i=1; i<path.length - 1; ++i){
	    wpts.push({
            location: new google.maps.LatLng(path[i].lat, path[i].lng),
            stopover: true
	    });
	}

	var request = {
		destination: path[path.length - 1],
		origin: path[0],
        waypoints: wpts,
        optimizeWaypoints: true,
		travelMode: google.maps.TravelMode.DRIVING
	};

	// Pass the directions request to the directions service.
	var directionsService = new google.maps.DirectionsService();
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			// Display the route on the map.
			directionsDisplay.setDirections(response);
		}
	});
}

window.loadMap = function(position) {
	var latlng = new google.maps.LatLng (
		position.coords.latitude,
		position.coords.longitude
	);
	var options = {
		zoom : 16,
		center : latlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var mapObject = document.getElementById("maps");
	var map = new google.maps.Map(mapObject, options);
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		animation: google.maps.Animation.DROP,
		title: "You"
	});
}

window.geoError = function(error) {
	alert('code: ' + error.code + ' '+ 'message: ' + error.message + ' ');
}