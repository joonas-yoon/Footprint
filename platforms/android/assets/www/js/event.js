
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
		"startDate": "05/08/2016",
		"endDate": "05/14/2016",
		"opens": "center",
		"locale": {
			format: 'YYYY년 MM월 DD일 H시 mm분'
		}
	}, function(start, end, label) {
		console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
	});

}, false);

window.splitDate = function(text){
	var r = text.split(/[^0-9\s]/);
	return {
		year: parseInt(r[0]),
		mon : parseInt(r[1]),
		day : parseInt(r[2]),
		hour: parseInt(r[3]),
		min : parseInt(r[4]),
		sec : parseInt(r[5])
	};
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
			"http://maps.google.com/maps/api/js?key=AIzaSyA8g19UNRVSoaIBM5fXqApuojGkSm5pFdI&callback="
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
	navigator.geolocation.getCurrentPosition(loadMap, geoError, options);
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