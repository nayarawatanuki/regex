function start(event) {

	event.preventDefault();

	clearResults();
	var values = formValues();

    var results = regex(values);
    
    printResult(results);
    highlightResults(results, values.target);
}


function regex(values) {

	var textPattern = values.pattern; //mountPatternReadableDate();
	var textTarget  = values.target;
	var showIndex  = values.showIndex;
	var showGroups = values.showGroups;

	var results	 = [];
    var result 	 = null;


	var objectRegex  = new RegExp(textPattern, 'g');

	while (result = objectRegex.exec(textTarget)) {

		if(result[0] === "") {
			throw Error("Regex retornou valor vazio.");
		}

		console.log("Resultado: " + result[0]);

		results.push(executeResult(showGroups ? result.join(' ||| ') : result[0], result.index, objectRegex.lastIndex, showIndex));
	}


	time(textPattern, textTarget);

	return results;
}


function executeResult(result, index, lastIndex, showIndex) {

	var textIndex = showIndex ? " [" + index + "-" + lastIndex+ "]" : ""

	return {
		'result': result + textIndex,
		'index': index,
		'lastIndex': lastIndex
	};
}


function time(textPattern, textTarget) {
	var pobjectRegex  = new RegExp(textPattern, 'g');
    var start = performance.now();
    pobjectRegex.test(textTarget)
	var end =  performance.now();
	console.log("Tempo de execução (ms) " + (end-start));
}

function printResult(results) {
	var inputResult 	= document.querySelector('#result');
	var labelResult 	= document.querySelector('#labelResults');

    labelResult.innerHTML = (results.length) + " Matches (resultados)";

	var arrayResults = results.map(function(item){ 
		return item.result;
	});
	
	labelResult.innerHTML = (arrayResults.length) + " Matches (results)";

    if(arrayResults.length > 0) {
    	inputResult.value = arrayResults.join(' | ');
    	inputResult.style.borderStyle = 'solid';
    	inputResult.style.borderColor = 'lime';//verde
    } else {
    	inputResult.placeholder = 'Sem matches (resultados)';
    	inputResult.value = '';
    	inputResult.style.borderStyle = 'solid';
    	inputResult.style.borderColor = 'red';
    }
}


function highlightResults(results, text) {	
	var item = null;
	var indexBegin = 0;
	var content = "";

	while((item = results.shift()) != null) {
		content += withoutHighlight(escapeHtml(text.substring(indexBegin, item.index)));
		content += withHighlight(escapeHtml(text.substring(item.index, item.lastIndex)));
		indexBegin = item.lastIndex;
	}

	//sobrou algum text?
	if((text.length - indexBegin) > 0) {
		content += withoutHighlight(escapeHtml(text.substring(indexBegin, text.length)));
	}
	
	document.querySelector("#highlightText").innerHTML = content;
}

function withoutHighlight(text) {
	return text;
	//return "<s>" + text + "</s>";
}

function withHighlight(text) {
	return "<span class='bg-primary'>" + text + "</span>";
}

function escapeHtml( string ) {
     return string.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}	


function formValues() {

	var inputTarget 	= document.querySelector('#target');
	var inputPattern 	= document.querySelector('#pattern')
	inputPattern.focus();

	var checkboxIndex 	= document.querySelector('#showIndex');
	var checkboxGroups 	= document.querySelector('#showGroups');

  	_checkInputs(inputTarget, inputPattern);

  	console.log('Target:  ' + inputTarget.value);
  	console.log('Pattern: ' + inputPattern.value.trim());

  	return {'target': inputTarget.value.trim(), 
  			'pattern': inputPattern.value, 
  			'showIndex': checkboxIndex.checked, 
  			'showGroups' : checkboxGroups.checked};
}

function _checkInputs(inputTarget, inputPattern) {
	if(!inputTarget.value) {
		inputTarget.placeholder = 'Digite um target';
	}

	if(!inputPattern.value) {
		inputPattern.placeholder = 'Digite um pattern';
	}

	if(!inputTarget.value || !inputPattern.value) {
		throw Error('valores inválidos');
	}
}

function clearResults() {
	console.clear();
	document.querySelector('#labelResults').innerHTML = '0 Matches (resultados)';
	document.querySelector('#result').value = '';
	document.querySelector('#result').placeholder = 'sem resulto';
	document.querySelector("#highlightText").innerHTML = '<em>sem resulto</em>';

}

function mountPatternReadableDate() {

	var DAY  = "[0123]?\\d";
	var _DE_ = "\\s+(de )?\\s*";
	var MONTH  = "[A-Za-z][a-zç]{3,8}";
	var YEAR  = "[12]\\d{3}";
	return DAY + _DE_ +  MONTH + _DE_ + YEAR;  

}