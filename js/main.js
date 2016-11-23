/*
	NOT ACTIVELY BEING USED ANYMORE. EVERYTHING WAS MOVED OVER TO 'make.js'.
*/

var jsonFile = "https://taylorr7.github.io/interfaceApplication/GUI_Project/CS3.json"; // Temporary global variable used for finding the input file.
var textFile = null; // Temporary global variable used for download link.

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
	Temporary function that will write the generated .json file
	to a text file that the user can download. This was done for
	testing purposes and should be removed later.
*/
makeFile = function(textArray) {
	if(textFile != null) {
		window.URL.revokeObjectURL(textFile);
	}
	data = new Blob([textArray], {type: 'text/plain'});
	textFile = window.URL.createObjectURL(data);
	return textFile;
}

/*
	Recursively builds the html page by parsing through the .json file.
	Each time an object is found, this function is called again and each
	time a non-object is found, it is added to the list.
*/	
encode = function( key, val, index ) {
	if( key.includes("'") ) {
		htmlKey = key.replace( "'", "&#39;");
	} else {
		htmlKey = key;
	}
	if( typeof val === 'object' && val !== null ) {
		var output = "";
		output = output + "<li id='" + htmlKey + "'><a>" + key + "</a><ul class='sortable" + index + " contain'>";
		for( var entry in val ) {
			output = output + encode( entry, val[entry], index + 1 );
		}
		output = output + "</ul></li>";
		return output;
	} else {
		return "<li id='" + htmlKey + "'>" + key + ": <input type='text' name='" + htmlKey + "' value='" + val + "'></li>";
	}
}

/*
	Iteratively builds the .json file, in the form of a string, by parsing 
	through the html page. The resulting string is then returned to be used 
	by other functions.
*/
decode = function( ) {
	json = "{\n";
	spacing = "  ";
	file = document.getElementById("json").innerHTML;
	file = file.replace(/&amp;/g, "&");
	file = file.replace(/ class="ui-sortable-handle"/g, "");
	fileArray = file.split("<");
	for(i = 0; i < fileArray.length; i++)
	{
		line = "";
		if(fileArray[i].startsWith("li")) {
			stringStart = fileArray[i].search("id=\"");
			stringEnd = fileArray[i].search("\">");
			innerValue = fileArray[i].slice(stringStart + 4, stringEnd);
			line = spacing + "\"" + innerValue + "\": ";
		} else if(fileArray[i].startsWith("input")) {
			stringStart = fileArray[i].search("value=\"");
			stringEnd = fileArray[i].search("\" type=");
			innerValue = fileArray[i].slice(stringStart + 7, stringEnd);
			if(innerValue === "true" || innerValue === "false") {
				if((i + 2 < fileArray.length) && (fileArray[i+2].startsWith("li"))) {
					line = innerValue + ",";
				}
				else {
					line = innerValue;
				}
			} else if(!isNaN(parseFloat(innerValue))) {
				if((i + 2 < fileArray.length) && (fileArray[i+2].startsWith("li"))) {
					line = innerValue + ","
				}
				else {
					line = parseFloat(innerValue);
				}
			} else {
				if((i + 2 < fileArray.length) && (fileArray[i+2].startsWith("li"))) {
					line = "\"" + innerValue + "\",";
				}
				else {
					line = "\"" + innerValue + "\"";
				}
			}
		} else if(fileArray[i].startsWith("ul")) {
			if(fileArray[i+1].startsWith("/ul")) {
				if((i + 3 < fileArray.length) && (fileArray[i+3].startsWith("li"))) {
					line = "{},";
					i++;
				} else {
					line = "{}";
					i++;
				}
			} else {
				line = "{ \n";
				spacing = spacing + "  ";
			}
		} else if(fileArray[i].startsWith("/li")) {
			line = "\n";
		} else if(fileArray[i].startsWith("/ul")) {
			spacing = spacing.slice(0, spacing.length-2);
			if((i + 2 < fileArray.length) && (fileArray[i+2].startsWith("li"))) {
				line = spacing + "},";
			}
			else {
				line = spacing + "}";
			}
		} else if(fileArray[i].startsWith("a")) {
		} else if(fileArray[i].startsWith("/a")) {
		} else {
			//alert(fileArray[i]);
		}
		json = json + line;
	}
	json = json + "}";
	//alert(json);
	return json;
}


/*
	Called when the 'Add Chapter' button is clicked.
	Parses through the rst files to build a list
	of possible chapters and allows the user to pick
	from them to add to the book.
*/
addChapter = function() {
	alert("Add Chapter");
}

/*
	Called when the 'Export' button is clicked.
	Makes a call to the decode() function to produce a string
	and then converts this to a download link, for the time being.
	This functionality will be replaced later.
*/
parseJson = function() {
	json = decode();
	download = document.getElementById('downloadLink');
	download.href = makeFile(json);
	alert("Ready!");
}

/*
	Called when the page loads and searches for the .json file and begins
	to build the html page based on what is found in the file. Makes a call
	to encode(); to do the majority of this.
*/		
$.getJSON( jsonFile, function( data ) {
	var items = [];
	$.each( data, function( key, val ) {
		items.push( encode( key, val, 1 ) );
	});
			
	$("<ul/>", {
		"id": "json",
		"class": "collapse",
		html: items.join( "" )
	}).appendTo( "body" );
	
	$("<button/>", {
		"onclick": "addChapter()",
		html: "Add Chapter"
	}).appendTo( "body" );
	
	$("<button/>", {
		"onclick": "parseJson()",
		html: "Export"
	}).appendTo( "body" );
});