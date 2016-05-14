
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

function splitDate(text){
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