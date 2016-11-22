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

let fileName = "CS3.json";
let jsonFile = "https://taylorr7.github.io/interfaceApplication/GUI_Project/CS3.json";
let textFile = null; // Temporary global variable used for download link.

$(document).ready(() => {
  //let jsonFile = "https://github.com/OpenDSA/OpenDSA/blob/master/config/Everything.json";
  if(jsonFile != "") {
    loadJSON(jsonFile);
  } else {
    $('#header').html("<h1> Please load a book to edit. </h1>");
  }
})

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

$(document).on('click', '#load', function() {
  jsonFile = "https://taylorr7.github.io/interfaceApplication/GUI_Project/CS3.json";
  loadJSON(jsonFile);
});

$(document).on('click', '#save', function() {
  let json = buildJSON();
  let download = document.getElementById('downloadLink');
  download.href = makeFile(json);
  alert("Ready for Download!");
  $('#downloadLink').toggle();
});

$(document).on('click', '.remove', function() {
  $(this).parent().remove();
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
  } else if(value === "true" || value === "false") {
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

const chapter = ( key, val ) => {
  let htmlKey = "";
	if( key.includes("'") ) {
		htmlKey = key.replace( "'", "&#39;");
	} else {
		htmlKey = key;
	}
  if( typeof val === 'object' && val !== null ) {
		var output = "";
		//output = output + "<li id='" + htmlKey + "'><a>" + key + "</a><button class='remove'>Delete</button><ul class='contain'>";
    output = output + "<li id='" + htmlKey + "'><a>" + key + "</a><ul class='contain'>";
		for( var entry in val ) {
			output = output + chapter( entry, val[entry] );
		}
		output = output + "</ul></li>";
		return output;
	} else {
		return "<li id='" + htmlKey + "'>" + key + ": <input type='text' name='" + htmlKey + "' value='" + val + "'></li>";
	}
}

/*
const chapter = ( key, val, index ) => {
  let htmlKey = "";
	if( key.includes("'") ) {
		htmlKey = key.replace( "'", "&#39;");
	} else {
		htmlKey = key;
	}
  let output = "";
  output += "<li><a>" + htmlKey + "</a>";
  output += "<ul>";
  for( let entry in val ) {
    const path = entry.search('/') + 1;
    const entryName = entry.substr(path);
    output += "<li><a class=\"" + entry + "\">" + val[entry]['long_name'] + "</a><ul>";
    //output += "<li> Hard Deadline: <input type=\"text\" value=\"" + $.datepicker.formatDate('mm/dd/yy', new Date()) + "\" class=\"datepicker\"> <br>";
    //output += "<li> Soft Deadline: <input type=\"text\" value=\"" + $.datepicker.formatDate('mm/dd/yy', new Date()) + "\" class=\"datepicker\"> <br>";
    output += "<li><a> Sections: </a><ul>";
    for( let section in val[entry]['sections'] ) {
      output += "<li><a>" + section + "</a></li><ul>";
      for( let exercise in val[entry]['sections'][section] ) {
        output += "<li><a>" + exercise + "</a><ul>";
        for( let field in val[entry]['sections'][section][exercise] ) {
          output += "<li>" + field + ": <input type=\"text\" value=\"" + val[entry]['sections'][section][exercise][field] + "\"></li>";
        }
        output += "</ul></li>";
      }
      output += "</ul>";
    }
    output += "</ul></li></ul></li>";
  }
  output += "</ul></li>"
  return output;
}
*/

const buildJSON = ( ) => {
  let json = "{\n";
  let spacing = "  ";
  let header = $('#header').html();
 
  let headerArray = prepArray(header);

  $('#downloadLink').attr('download', pullValue(headerArray[5]));
  json += spacing + makePair("title", pullValue(headerArray[7]));
  json += spacing + makePair("desc", pullValue(headerArray[9]));
  
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
  let fileArray = prepArray(chapters);
  json += spacing + "\"chapters\": ";
  /*
  for(i = 0; i < chapterArray.length; i++) {
    //alert(chapterArray[i]);
    let line = "";
    if(chapterArray[i].startsWith("a")) {
      //if(chapterArray[i].contains("class=") {
        //alert("Hi");
      //}
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
				if((i + 3 < chapterArray.length) && (chapterArray[i+4].startsWith("li"))) {
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
  }*/
  
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
  
  json += "\n}";
  alert(json);
  return json;
}

/*
decode = function( ) {
	file = file.replace(/ class="ui-sortable-handle"/g, "");
}
*/

/*
const newJSON = function(jsonFile) {
    let headerString = "<h1> Header: <button id=\"toggle\"> Show Options </button> </h1>";
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
  
    let chapterString = "<h1> Chapters: <button id=\"add\"> Add Chapter </button> </h1> <ul class=\"collapse\">";
    chapterString += "</ul>";
    $('#chapters').html(chapterString);
}
*/

const loadJSON = function(jsonFile) {
  $.getJSON( jsonFile, function( data ) {
    let headerString = "<h1> Header: <button id=\"toggle\"> Show Options </button> </h1>";
    headerString += "File Name: <input type=\"text\" value=\"" + fileName + "\"> <br>";
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
    optionString += "Assumes: <input type=\"text\" value=\"" + data['assumes'] + "\"> <br>";
    optionString += "Disp Mod Comp: <input type=\"text\" value=\"" + data['dispModComp'] + "\"> <br>";
    optionString += "Global Exercise Options: <input type=\"text\" value=\"" + data['glob_exer_options'] + "\"> <br>";
    $('#options').html(optionString);

    let chapterString = "<h1> Chapters: <button id=\"add\"> Add Chapter </button> </h1> <ul class=\"collapse\">";
    //let chapterString = "<h1> Chapters: </h1> <ul class=\"collapse\">";
    $.each( data['chapters'], function( key, val ) {
      chapterString += chapter( key, val, 1 );
    });
    chapterString += "</ul>";
    $('#chapters').html(chapterString);
    $('button').addClass("ui-button ui-corner-all");
  });
}