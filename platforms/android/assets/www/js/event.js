
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
 * 데이터베이스 관련 함수
**/
window.dbConnect = function(dbname, desc){
    if( ! dbname ) dbname = 'Dummy DB';
    if( ! desc ) desc = 'No Description';
    var db = window.openDatabase(dbname, "1.0", desc, 65537); //will create database Dummy_DB or open it
    console.log('Connected DB : ' + db);
    return db;
}

window.setupTable = function(tx){
    tx.executeSql('DROP TABLE IF EXISTS paths');
    tx.executeSql('DROP TABLE IF EXISTS records');
    tx.executeSql('CREATE TABLE IF NOT EXISTS records (id INTEGER PRIMARY KEY AUTOINCREMENT, start_time TIMESTAMP NOT NULL, end_time TIMESTAMP NOT NULL, interval INTEGER NOT NULL)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS paths (id INTEGER PRIMARY KEY AUTOINCREMENT, rid INTEGER NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL, start_time TIMESTAMP NOT NULL, end_time TIMESTAMP NOT NULL )');
};

window.dbErrorHandler = function(err) {
    alert("Error processing SQL: "+err.code);
}

window.renderQueue = function(tx, result){
    // $('#resultQueue').empty();
    $.each(result.rows,function(index){
        var row = result.rows.item(index);
        $('#resultQueue').append('<p>'+row['title']+', 경도: '+row['comment']+', 시간: ' + row['start_time'] + '</p>');
    });
}

/**
 *   google maps script
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
		zoom: 17,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

    var poly = new google.maps.Polyline({
        strokeColor: '#D86F5E',
        strokeOpacity: 0.85,
        strokeWeight: 5
    });
    poly.setMap(map);

    var paths = poly.getPath();

	// Set destination, origin and travel mode.
	for(var i=0; i<path.length; ++i){
	    var latlng = new google.maps.LatLng(path[i].lat, path[i].lng);
	    paths.push(latlng);
	    console.log(path[i]);
	    new google.maps.Marker({
            position: latlng,
            title: '#' + paths.getLength(),
            map: map
        });
	}
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