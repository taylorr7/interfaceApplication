/*  
  "title": "CS3 Data Structures & Algorithms",
  "desc": "CS3 Data Structures & Algorithms",
  "build_dir": "Books",
  "code_dir": "SourceCode/",
  "lang": "en",
  "build_JSAV": false,
  "build_cmap": false,
  "suppress_todo": true,
  "assumes": "recursion",
  "dispModComp": true,
  "glob_exer_options": {},
  
  "title: <input type="text" value=\"" + book[title] + "\">";
*/

var jsonFile = "https://taylorr7.github.io/interfaceApplication/GUI_Project/CS3.json";

$(document).on('click', '#toggle', function() {
	$('#options').toggle();
	if($('#toggle').html() == "Show Options") {
		$('#toggle').html("Hide Options");
	} else {
		$('#toggle').html("Show Options");
	}
});

$(document).on( 'click', '.collapse li a', function() {
	$(this).parent().children('ul').toggle();
	if($(this).css('color') === 'rgb(0, 0, 255)') {
		$(this).css('color', 'purple');
	} else {
		$(this).css('color', 'blue');
	}
});

const encode = ( key, val, index) => {
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

const chapter = ( key, val, index ) => {
	if( key.includes("'") ) {
		htmlKey = key.replace( "'", "&#39;");
	} else {
		htmlKey = key;
	}
  let output = "";
  output += "<li><a>" + key + "</a>";
  output += "<ul>";
  for( let entry in val ) {
    //output += "<li>" + val + "</li>";
    const path = entry.search('/') + 1;
    const entryName = entry.substr(path);
    //output += "<li>" + entryName + "<ul>";
    output += "<li><a>" + val[entry]['long_name'] + "</a>";
    //if(val[entry]['sections'] != null) {
      //alert(val[entry]['sections']);
      for( let section in val[entry]['sections'] ) {
       //alert(section);
       output += "<ul><li><a> Sections: </a><ul>";
       output += "<li>" + section + "</li>";
       output += "</ul></li></ul></li>";
      }
    //output += "</ul></li>"; 
  }
  output += "</ul></li>"
  return output;
}

$.getJSON( jsonFile, function( data ) {
	
	let headerString = "<h1> Header: </h1>";
	headerString += "File Name: <input type=\"text\" value=\"CS3.json\"> <br>";
	headerString += "Title: <input type=\"text\" value=\"" + data['title'] + "\"> <br>";
	headerString += "Desc: <input type=\"text\" value=\"" + data['desc'] + "\"> <br>";
	$('#header').html(headerString);
	
	let optionString =""
	optionString += "Build Dir: <input type=\"text\" value=\"" + data['build_dir'] + "\"> <br>";
	optionString += "Code Dir: <input type=\"text\" value=\"" + data['code_dir'] + "\"> <br>";
	optionString += "Lang: <input type=\"text\" value=\"" + data['lang'] + "\"> <br>";
	optionString += "Build JSAV: <input type=\"text\" value=\"" + data['build_JSAV'] + "\"> <br>";
	optionString += "Build CMAP: <input type=\"text\" value=\"" + data['build_cmap'] + "\"> <br>";
	optionString += "Suppress TODO: <input type=\"text\" value=\"" + data['suppress_todo'] + "\"> <br>";
	optionString += "Assumes: <input type=\"text\" value=\"" + data['recursion'] + "\"> <br>";
	optionString += "Disp Mod Comp: <input type=\"text\" value=\"" + data['dispModComp'] + "\"> <br>";
	optionString += "Global Exercise Options: <input type=\"text\" value=\"" + data['glob_exer_options'] + "\"> <br>";
	$('#options').html(optionString);
	
	let chapterString = "<h1> Chapters: </h1> <ul class=\"collapse\">";
	$.each( data['chapters'], function( key, val ) {
		chapterString += encode( key, val, 1 );
	});
	chapterString += "</ul>";
	$('#chapters').html(chapterString);
	
});

/*
	JSON => Chapters => Chapter Headings => 'long_name', 'sections' => Sections => Exercises
	A chapter can have any number of headings, each of which has to have a 'long_name' and 'sections'.
	Each section within 'sections' can have any number of exercises which each have four properties:
	'long_name', 'required', 'points', 'threshold'.
*/