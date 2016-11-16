$(document).ready(() => {
	let globText = "";
	const rst = "Summations.rst";

	const listRST = (url) => {
		$.ajax({
			url: url,
			success: function(data) {
				$(data).find("a:contains(.css)").each(function() {
					alert($(this).attr("href"));
				});
			},
			error: function() {
				alert("error");
			}
		});
	};
	
	const openRST = (url) => {
		$.get({
			type: "GET",
			url: url,
			dataType: "text",
			success: function(text) {
				parseRST(text);
			},
			error: function() {
				alert("error");
			}
		});
	};
	
	const parseRST = (text) => {
		let avIndex = [];
		let avEnds = [];
		let avStrings = [];
		for(i = 0; i < text.length; i++) {
			if(text.substr(i).search('.. inlineav::') > 0) {
				const nextFind = text.substr(0, i).length + text.substr(i).search('.. inlineav::');
				const nextEnd = nextFind + text.substr(nextFind).search('\n');
				avIndex.push(nextFind);
				avEnds.push(nextEnd);
				i = nextFind;
			}
		}
		for(i = 0; i < avIndex.length; i++) {
			avStrings.push(text.substr(avIndex[i], avEnds[i] - avIndex[i]));
		}
		let exerciseString = "<ul>";
		for(i = 0; i < avStrings.length; i++) {
			let parseString = avStrings[i];
			const startString = parseString.search('::') + 3;
			const endString = parseString.search('$') - 3;
			parseString = parseString.substr(startString, endString - startString);
			exerciseString += "<li>" + parseString + "</li><ul>";
			exerciseString += "<li> Long Name: <input type=\"text\" value=\"?\"> </li>";
			exerciseString += "<li> Required: <input type=\"text\" value=\"true\"> </li>";
			exerciseString += "<li> Points: <input type=\"text\" value=\"1.0\"> </li>";
			exerciseString += "<li> Threshold: <input type=\"text\" value=\"1.0\"> </li></ul>";
		}
		exerciseString += "</ul>";
		$('#exercises').html(exerciseString);
	};
	
	//openRST(rst);
	
	listRST('http://localhost/interfaceApplication/GUI_Project/css/');
	
});