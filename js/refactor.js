var jsonFile = "https://taylorr7.github.io/interfaceApplication/json/CS3.json";
let textFile = null; // Temporary global variable used for download link.

/*
 * The click event for the collapsible lists.
 */
$(document).on( 'click', '.collapse li a', function() {
	$(this).parent().children('ul').toggle();
});

/*
 * Defines the class 'datepicker' as a jquery ui datepicker widget.
 */
$(document).on('focus', '.datepicker', function() {
  $(this).datepicker();
});

/*
 * The click event for the 'Save Book' button.
 * Currently, this saves the book as an html download object.
 */
$(document).on('click', '#save', function() {
  let json = buildJSON();
  let download = document.getElementById('downloadLink');
  download.href = makeFile(json);
  alert("Ready for Download!");
  $('#downloadLink').toggle();
});

/*
 * Function to take a text array and turn it into an html download object.
 */
const makeFile = ( textArray ) => {
	if(textFile != null) {
		window.URL.revokeObjectURL(textFile);
	}
	const data = new Blob([textArray], {type: 'text/plain'});
	textFile = window.URL.createObjectURL(data);
	return textFile;
}

/*
 * Function to build a json file from the html on the page.
 */
const buildJSON = ( ) => {
  /*
  let json = "{\n";
  let spacing = "  ";

  let header = $('#heading').html();
  let headerArray = prepArray(header);
  json += decode( headerArray, false );

  let options = $('#options').html();
  let optionArray = prepArray(options);
  json += decode( optionArray, false );

  let chapters = $('#chapters').html();
  chapters = chapters.replace(/readonly=/g, "");
  let chapterArray = prepArray(chapters);
  json += spacing + "\"chapters\": ";
  json += decode( chapterArray );
  
  json += "\n}";
  return json;
  */
	
	let json = "{\n}";
}

const decode = ( fileArray ) => {
}

/*
const decode = ( fileArray, chapter = true ) => {
	let jsonString = "";
	let spacing = "  ";
	for(i = 0; i < fileArray.length; i++)
	{
		let line = "";
		if(fileArray[i].startsWith("li")) {
			let stringStart = fileArray[i].search("id=\"");
			let stringEnd = fileArray[i].search("\">");
			let value = fileArray[i].slice(stringStart + 4, stringEnd);
			line = spacing + "\"" + value + "\": ";
		} else if(fileArray[i].startsWith("input")) {
			let stringStart = fileArray[i].search("id=\"");
			let stringEnd = fileArray[i].search("\" type=");
			let id = "#" + fileArray[i].slice(stringStart + 4, stringEnd);
      let value = $(id).val();
			if(value === "true" || value === "false") {
				if((i + 2 < fileArray.length) && (fileArray[i+2].startsWith("li"))) {
					line = value + ",";
				}
				else {
					line = value;
				}
			} else if(!isNaN(parseFloat(value))) {
				if(!value.includes("/")) {
					if((i + 2 < fileArray.length) && (fileArray[i+2].startsWith("li"))) {
						line = parseFloat(value) + ","
					}
					else {
						line = parseFloat(value);
					}
				} else {
					line = "\"" + value + "\",";
          // line = value + ",";
				}
			} else {
				if((!chapter) || (i + 2 < fileArray.length) && (fileArray[i+2].startsWith("li"))) {
					line = "\"" + value + "\",";
				}
				else {
					line = "\"" + value + "\"";
				}
			}
		} else if(fileArray[i].startsWith("ul")) {
			if(fileArray[i+1].startsWith("/ul")) {
				if((!chapter) || (i + 3 < fileArray.length) && (fileArray[i+3].startsWith("li"))) {
					line = "{},";
					i++;
				} else {
					line = "{}";
					i++;
				}
			} else {
				if(chapter || (i != 1 && i != (fileArray.length - 1))) {
					line = "{ \n";
					spacing = spacing + "  ";
				}
			}
		} else if(fileArray[i].startsWith("/li")) {
			line = "\n";
		} else if(fileArray[i].startsWith("/ul")) {
			if(chapter || (i != 1 && i != (fileArray.length - 1))) {
				spacing = spacing.slice(0, spacing.length-2);
        if(chapter) {
          if((i + 2 < fileArray.length) && (fileArray[i+2].startsWith("li"))) {
            line = spacing + "},";
          }
          else {
            line = spacing + "}";
          }
        } else {
          line = spacing + "},";
        }
			}
		} else if(fileArray[i].startsWith("a")) {
		} else if(fileArray[i].startsWith("/a")) {
		} else {
			//alert(fileArray[i]);
		}
		jsonString += line;
	}
	return jsonString;
}
*/

$(document).on('click', '.chapterLoad', function() {
	$('#chapterSoft').attr('data-chapter', $(this).attr('data-chapter'));
	$('#chapterHard').attr('data-chapter', $(this).attr('data-chapter'));
});

$(document).on('click', '#chapterSubmit', function() {
	var chapterTitle = $('#chapterSoft').attr('data-chapter');
	var checkChapter = '[data-chapter=\"' + chapterTitle + '\"]';
	$(checkChapter + '[data-type="soft"').val($('#chapterSoft').val());
	$(checkChapter + '[data-type="hard"').val($('#chapterHard').val());
});

$(document).ready(() => {
	$.getJSON(jsonFile, function(data) {
		Handlebars.registerHelper('pullModule', function(path) {
			return path.substr(path.indexOf("/") + 1);
		});
		
		Handlebars.registerHelper('keyCheck', function(key) {
			if(key == "long_name") {
				return "long name";
			} else if(key == "resource_type") {
				return "resource type";
			} else if(key == "resource_name") {
				return "resource name";
			} else if(key == "exer_options") {
				return "exercise options";
			} else if(key == "learning_tool") {
				return "learning tool";
			} else {
				return key;
			}
		});
		
		Handlebars.registerHelper('valCheck', function(key, value) {
			if(key == "required") {
				if(value == "true") {
					return new Handlebars.SafeString("<select><option value=\"true\">true</option><option value=\"false\">false</option></select>");
				} else {
					return new Handlebars.SafeString("<select><option value=\"true\">true</option><option value=\"false\">false</option></select>");
				}
			} else if(typeof(value) === 'object') {
				return new Handlebars.SafeString("<input value=\"{}\">");
			} else {
				return new Handlebars.SafeString("<input value=\"" + value + "\">");
			}
		});
		
		var source = "<h1> Chapters: </h1> <ul class=\"collapse sortable\"> {{#each chapters}}" + // List
				   "<li><a data-key=\"{{@key}}\"> <strong> Chapter: </strong> {{@key}} </a>" + // Chapters
				   //"<button type=\"button\" data-toggle=\"modal\" data-target=\"#chapterDue\" data-chapter=\"{{@key}}\" class=\"chapterLoad\">Set Due Dates</button>" + // Chapter Due Date Button
				   "<ul class=\"sortable\"> {{#each .}}" + // Chapters
				   "<li><a data-key=\"{{@key}}\"> <strong> Module: </strong> {{long_name}} </a><ul> {{#each sections}}" + // Modules
				   "<li><a data-key=\"{{@key}}\"> <strong> Section: </strong> {{@key}} </a> <ul> {{#each .}}" + // Sections
				   "{{#if long_name}} <li><a data-key=\"{{@key}}\"> <strong> Exercise: </strong> {{long_name}} </a> <ul> {{#each .}}" + // Exercises
				   "<li><a data-key=\"{{@key}}\"> {{keyCheck @key}}: </a> {{valCheck @key this}} </li>" + // Exercise Data
				   "{{/each}} </ul></li>" + // Close Exercise Data
				   "{{else}} <li><a data-key=\"{{@key}}\"> {{keyCheck @key}}: </a> {{valCheck @key this}} </li> {{/if}}" + // Parse Additional Learning Tools
				   "{{/each}}" + // Close Exercises
				   "<li><a data-key=\"soft_deadline\">Soft Deadline: </a> <input data-chapter=\"{{@../../key}}\" data-type=\"soft\" type=\"text\" value=\"" + $.datepicker.formatDate('mm/dd/yy', new Date()) + "\" class=\"datepicker\">" + // Section Soft Deadline
				   "<li><a data-key=\"hard_deadline\">Hard Deadline: </a> <input data-chapter=\"{{@../../key}}\" data-type=\"hard\" type=\"text\" value=\"" + $.datepicker.formatDate('mm/dd/yy', new Date()) + "\" class=\"datepicker\">" + // Section Hard Deadline
				   "</ul></li>" + // Close Sections
				   "{{/each}} </ul></li>" + // Close Modules
				   "{{/each}} </ul></li>" + // Close Chapters
				   "{{/each}} </ul>"; // Close List
				   
		var template = Handlebars.compile(source);
		var html = template(data);
		$('#content').html(html);
		
		$( ".sortable" ).sortable();	
	});
})