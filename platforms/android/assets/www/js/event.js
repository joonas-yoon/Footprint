
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
}, false);