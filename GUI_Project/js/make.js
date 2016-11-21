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
*/

var jsonFile = "https://taylorr7.github.io/interfaceApplication/GUI_Project/CS3.json";
var textFile = null; // Temporary global variable used for download link.

$(document).on('focus', '.datepicker', function() {
  $(this).datepicker();
});

$(document).on('click', '#toggle', function() {
	$('#options').toggle();
	if($('#toggle').html() == "Show Options") {
		$('#toggle').html("Hide Options");
	} else {
		$('#toggle').html("Show Options");
	}
});

$(document).on('click', '#download', function() {
  let json = buildJSON();
  let download = document.getElementById('downloadLink');
  download.href = makeFile(json);
  alert("Ready for Download!");
  $('#downloadLink').toggle();
});

$(document).on( 'click', '.collapse li a', function() {
	$(this).parent().children('ul').toggle();
	if($(this).css('color') === 'rgb(0, 0, 255)') {
		$(this).css('color', 'purple');
	} else {
		$(this).css('color', 'blue');
	}
});

const prepArray = ( inputHTML ) => {
  inputHTML = inputHTML.replace(/&amp;/g, "&");
  let HTMLArray = inputHTML.split("<"); 
  return HTMLArray;
}

const pullValue = ( inputString ) => {
  let stringStart = inputString.search("value=\"");
  let stringEnd = inputString.search("\" type=");
  let value = inputString.slice(stringStart + 7, stringEnd);
  return value;
}

const makePair = ( key, value ) => {
  if(value === "{}") {
    return "\"" + key + "\": " + value + ",\n";
  } else {
    return "\"" + key + "\": \"" + value + "\",\n";
  }
}

const makeFile = ( textArray ) => {
	if(textFile != null) {
		window.URL.revokeObjectURL(textFile);
	}
	const data = new Blob([textArray], {type: 'text/plain'});
	textFile = window.URL.createObjectURL(data);
	return textFile;
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
    const path = entry.search('/') + 1;
    const entryName = entry.substr(path);
    output += "<li><a>" + val[entry]['long_name'] + "</a>";
    for( let section in val[entry]['sections'] ) {
      if(section != "{}") {
        output += "<ul>";
        //output += "<li> Hard Deadline: <input type=\"text\" value=\"" + $.datepicker.formatDate('mm/dd/yy', new Date()) + "\" class=\"datepicker\"> <br>";
        //output += "<li> Soft Deadline: <input type=\"text\" value=\"" + $.datepicker.formatDate('mm/dd/yy', new Date()) + "\" class=\"datepicker\"> <br>";
        output += "<li><a> Sections: </a><ul>";
        output += "<li><a>" + section + "</a><ul>";
        for( let exercise in val[entry]['sections'][section] ) {
          output += "<li><a>" + exercise + "</a><ul>";
          if(val[entry]['sections'][section][exercise]['long_name'] != null) {
            output += "<li>Long Name: <input type=\"text\" value=\"" + val[entry]['sections'][section][exercise]['long_name'] + "\" readonly></li>";
            if(val[entry]['sections'][section][exercise]['required']) {
              output += "<li>Required: <select> <option value=\"true\" selected> True </option> <option value=\"false\"> False </option> </select> </li>"
            } else {
              output += "<li>Required: <select> <option value=\"true\"> True </option> <option value=\"false\" selected> False </option> </select> </li>"
            }
            output += "<li>Points: <input type=\"text\" value=\"" + val[entry]['sections'][section][exercise]['points'] + "\"></li>";
            output += "<li>Threshold: <input type=\"text\" value=\"" + val[entry]['sections'][section][exercise]['threshold'] + "\"></li>";
          }
          output += "</ul></li>";
          
        }
        output += "</ul></li>";
        output += "</ul></li></ul></li>"; 
      }
    }
  }
  output += "</ul></li>"
  return output;
}

const buildJSON = ( ) => {
  let json = "{\n";
  let spacing = "  ";
  let header = $('#header').html();
 
  let headerArray = prepArray(header);

  $('#downloadLink').attr('download', pullValue(headerArray[3]));
  json += spacing + makePair("title", pullValue(headerArray[5]));
  json += spacing + makePair("desc", pullValue(headerArray[7]));
  
  let options = $('#options').html();
  let optionArray = prepArray(options);
  json += spacing + makePair("build_dir", pullValue(optionArray[1]));
  json += spacing + makePair("code_dir", pullValue(optionArray[3]));
  json += spacing + makePair("lang", pullValue(optionArray[5]));
  json += spacing + makePair("build_JSAV", pullValue(optionArray[7]));
  json += spacing + makePair("build_cmap", pullValue(optionArray[9]));
  json += spacing + makePair("suppress_todo", pullValue(optionArray[11]));
  json += spacing + makePair("assumes", pullValue(optionArray[13]));
  json += spacing + makePair("displayModComp", pullValue(optionArray[15]));
  //json += spacing + makePair("glob_exer_options", pullValue(optionArray[17]));
  json += spacing + makePair("glob_exer_options", "{}");
  
  let chapters = $('#chapters').html();
  chapters = chapters.replace(/readonly=/g, "");
  //chapters = chapters.replace( "readonly=\"\"/g", "");
  let chapterArray = prepArray(chapters);
  json += spacing + "\"chapters\": ";
  for(i = 0; i < chapterArray.length; i++) {
    //alert(chapterArray[i]);
    let line = "";
    if(chapterArray[i].startsWith("a")) {
      let stringStart = chapterArray[i].search(">");
      let stringEnd = chapterArray[i].search("$");
      let value = chapterArray[i].slice(stringStart + 1, stringEnd);
      line = spacing + "\"" + value + "\": ";
    } else if(chapterArray[i].startsWith("li")) {
      let stringStart = chapterArray[i].search("li>");
      let stringEnd = chapterArray[i].search(":");
      let value = chapterArray[i].slice(stringStart + 3, stringEnd);
      if(value != "") {
        line = spacing + "\"" + value + "\": ";
      }
    } else if(chapterArray[i].startsWith("/li")) { 
      line = "\n";
    } else if(chapterArray[i].startsWith("ul")) {
      if(chapterArray[i+1].startsWith("/ul")) {
				if((i + 3 < chapterArray.length) && (chapterArray[i+3].startsWith("li"))) {
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
    } else if(chapterArray[i].startsWith("/ul")) {
      spacing = spacing.slice(0, spacing.length-2);
			if((i + 2 < chapterArray.length) && (chapterArray[i+2].startsWith("li"))) {
				line = spacing + "},";
			}
			else {
				line = spacing + "}";
			}
    } else if(chapterArray[i].startsWith("input")) {
      let stringStart = chapterArray[i].search("value=\"");
			let stringEnd = chapterArray[i].search("\" type=");
      let value = chapterArray[i].slice(stringStart + 7, stringEnd);
      if(value === "true" || value === "false") {
        if((i + 2 < chapterArray.length) && (chapterArray[i+2].startsWith("li"))) {
					line = value + ",";
				}
				else {
					line = value;
				}
      } else if(!isNaN(parseFloat(value))) {
        if((i + 2 < chapterArray.length) && (chapterArray[i+2].startsWith("li"))) {
					line = value + ","
				}
				else {
					line = parseFloat(value);
				}
      } else {
        if((i + 2 < chapterArray.length) && (chapterArray[i+2].startsWith("li"))) {
					line = "\"" + value + "\",";
				}
				else {
					line = "\"" + value + "\"";
				}
      }
    } else if(chapterArray[i].startsWith("option")) {
      if(chapterArray[i].includes("selected")) {
        let stringStart = chapterArray[i].search("value=\"");
        let stringEnd = chapterArray[i].search("\" selected=");
        let value = chapterArray[i].slice(stringStart + 7, stringEnd);
        if(value === "true" || value === "false") {
          if(value === "false" && (i + 4 < chapterArray.length) && (chapterArray[i+4].startsWith("li"))) {
            line = value + ",";
          } else if(value === "true" && (i + 6 < chapterArray.length) && (chapterArray[i+6].startsWith("li"))) {
            line = value + ",";
          }
          else {
            line = value;
          }
        }
      }
    } else {
      //alert(chapterArray[i]);
    }
    json += line;
  }
  json += "\n}";
  return json;
}

/*
decode = function( ) {
	file = file.replace(/ class="ui-sortable-handle"/g, "");
}
*/

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
		chapterString += chapter( key, val, 1 );
	});
	chapterString += "</ul>";
	$('#chapters').html(chapterString);
});