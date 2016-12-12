$(document).ready(() => {
	var data = {
	  "title": "CS3 Data Structures & Algorithms",
	  "desc": "CS3 Data Structures & Algorithms",
	  "build_dir": "Books",
	  "code_dir": "SourceCode/",
	  "lang": "en",
	  "chapters" : {
	  	"Preface" : "One",
		"Introduction" : "Two"
	  }
	};
	var source = "<ul><li data-name=\"title\">Title: <input value=\"{{title}}\"></li>" +
				   "<ul> {{#each chapters}}" +
				   "<li> {{@key}} </li>" +
				   "{{/each}} </ul>" + 
				   "</ul>";
	var template = Handlebars.compile(source);
	var html = template(data);
	$('#content').html(html);
})
/*

{{#each myObject}}
    Key: {{@key}} Value = {{this}}
{{/each}}

var data = {
    employees: [
    {   firstName: "Christophe",
        lastName: "Coenraets"},
    {   firstName: "John",
        lastName: "Smith"}
    ]};
var template = "Employees:<ul>{{#employees}}" +
                            "<li>{{firstName}} {{lastName}}</li>" +
                            "{{/employees}}</ul>";
var html = Mustache.to_html(template, data);
$('#sampleArea').html(html);
*/
/*
var data = {
  "title": "CS3 Data Structures & Algorithms",
  "desc": "CS3 Data Structures & Algorithms",
  "build_dir": "Books",
  "code_dir": "SourceCode/",
  "lang": "en"
};
var template = "<li data-name=\"title\">Title: <input value=\"{{title}}\"></li>";
var html = Mustache.to_html(template, data);
$('#content').html(html);
*/
/*
{
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
  "chapters": {
    "Preface": {
      "Intro": {
        "long_name": "How to Use this System",
        "sections": {}
      }
    },
    "Introduction": {
      "Background/IntroDSA": {
        "long_name": "Introduction to Data Structures and Algorithms",
        "sections": {
          "Data Structures and Algorithms": {
            "IntroSumm": {
              "long_name": "Introduction Summary Questions",
              "required": true,
              "points": 1.0,
              "threshold": 5
            }
          },
          "Some Software Engineering Topics": {
            "showsection": false
          }
        }
      },
      "Design/ADT": {
        "long_name": "Abstract Data Types",
        "sections": {
          "Abstract Data Types": {
            "ADTCON": {},
            "IntroADTSumm": {
              "long_name": "ADT Summary Questions",
              "required": true,
              "points": 1.0,
              "threshold": 4
            }
          }
        }
      }
    }
  }
}
*/