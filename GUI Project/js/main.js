
/*
	The sortable classes. Each layer needs their own class
	as to not interfere with the others.
*/
$( function() {
	$( ".sortable1" ).sortable();
	$( ".sortable2" ).sortable();
	$( ".sortable3" ).sortable();
	$( ".sortable4" ).sortable();
	$( ".sortable5" ).sortable();
	$( ".sortable6" ).sortable();
	$( ".sortable7" ).sortable();
});

/*
	The collapsible function that allows each of the dynamically
	created elements to be able to hide and reveal its children
	by clicking on it.
*/
$(document).on( 'click', '.collapse li a', function() {
	$(this).parent().children('ul').toggle();
	if($(this).css('color') === 'rgb(0, 0, 255)') {
		$(this).css('color', 'purple');
	} else {
		$(this).css('color', 'blue');
	}
});

/*
	Recursively builds the html page by parsing through the .json file.
	Each time an object is found, this function is called again and each
	time a non-object is found, it is added to the list.
*/	
encode = function( key, val, index ) {
	if( typeof val === 'object' && val !== null ) {
		var output = "";
		output = output + "<li id='" + key + "'><a>" + key + "</a><ul class='sortable" + index + " contain'>";
		for( var entry in val ) {
			output = output + encode( entry, val[entry], index + 1 );
		}
		output = output + "</ul></li>";
		return output;
	} else {
		return "<li id='" + key + "'>" + key + ": <input type='text' name='" + key + "' value='" + val + "'></li>";
	}
}


/*
	Called when the page loads and searches for the .json file and begins
	to build the html page based on what is found in the file. Makes a call
	to encode(); to do the majority of this.
*/		
$.getJSON( "CS3.json", function( data ) {
	var items = [];
	$.each( data, function( key, val ) {
		items.push( encode( key, val, 1 ) );
	});
			
	$("<ul/>", {
		"class": "collapse",
		html: items.join( "" )
	}).appendTo( "body" );
});