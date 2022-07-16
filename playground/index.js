// Setup editors
function setupInfoArea(id) {
  const e = ace.edit(id);
  e.setShowPrintMargin(false);
  e.setOptions({
    readOnly: true,
    highlightActiveLine: false,
    highlightGutterLine: false
  })
  e.renderer.$cursorLayer.element.style.opacity=0;
  return e;
}

function setupEditorArea(id, lsKey) {
  const e = ace.edit(id);
  e.setShowPrintMargin(false);
  e.setValue(localStorage.getItem(lsKey) || '');
  e.moveCursorTo(0, 0);
  return e;
}

const grammar = setupEditorArea("grammar-editor", "grammarText");
const code = setupEditorArea("code-editor", "codeText");

const codeGen = setupInfoArea("code-gen");
const codeTrace = setupInfoArea("code-trace");

$('#opt-mode').val(localStorage.getItem('optimizationMode') || '2');
$('#packrat').prop('checked', localStorage.getItem('packrat') === 'true');
$('#auto-refresh').prop('checked', localStorage.getItem('autoRefresh') === 'true');
$('#parse').prop('disabled', $('#auto-refresh').prop('checked'));

// Parse
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function nl2br(str) {
  return str.replace(/\n/g, '<br>\n')
}

function textToErrors(str) {
  let errors = [];
  var regExp = /([^\n]+?)\n/g, match;
  while (match = regExp.exec(str)) {
    let msg = match[1];
    let line_col = msg.match(/^script:(\d+):(\d+)/);
    if (line_col) {
      errors.push({"ln": line_col[1], "col":line_col[2], "msg": msg});
    } else {
      errors.push({"msg": msg});
    }
  }
  return errors;
}

function generateErrorListHTML(errors) {
  let html = '<ul>';

  html += $.map(errors, function (x) {
    if (x.ln > 0) {
      return '<li data-ln="' + x.ln + '" data-col="' + x.col +
        '"><span>' + escapeHtml(x.msg) + '</span></li>';
    } else {
      return '<li><span>' + escapeHtml(x.msg) + '</span></li>';
    }
  }).join('');

  html += '<ul>';

  return html;
}

function updateLocalStorage() {
  localStorage.setItem('grammarText', grammar.getValue());
  localStorage.setItem('codeText', code.getValue());
  localStorage.setItem('optimizationMode', $('#opt-mode').val());
  localStorage.setItem('packrat', $('#packrat').prop('checked'));
  localStorage.setItem('autoRefresh', $('#auto-refresh').prop('checked'));
}

function parse() {
  const $grammarValidation = $('#grammar-validation');
  const $grammarInfo = $('#grammar-info');
  const grammarText = grammar.getValue();

  const $codeValidation = $('#code-validation');
  const $codeInfo = $('#code-info');
  const codeText = code.getValue();

  const optimizationMode = $('#opt-mode').val();
  const packrat = $('#packrat').prop('checked');
  const trace = $('#show-trace').prop('checked');

  $grammarInfo.html('');
  $grammarValidation.hide();
  $codeInfo.html('');
  $codeValidation.hide();
  codeGen.setValue('');
  codeTrace.setValue('');

  outputs.compile_status = '';
  outputs.parse_status = '';
  outputs.gen = '';
  outputs.trace = '';

  if (grammarText.length === 0) {
    return;
  }

  $('#overlay').css({
    'z-index': '1',
    'display': 'block',
    'background-color': 'rgba(0, 0, 0, 0.1)'
  });

  window.setTimeout(() => {

    var grammarJsScanner = "";
    var grammarJsParser = "";
    var MyWriteBufferTo = function(sender, content) {
	    //print("==MyWriteBufferTo==", sender);
	    switch (sender) {
		case "WriteRREBNF":
		    //stdWriteFile("Parser.ebnf", content);
		    break;
		case "WriteScanner":
		    grammarJsScanner = content;
		    break;
		case "WriteParser":
		    grammarJsParser = content;
		    break;
	    }
    };

    var grammaLog = "";
    var myGrammarLog = function() {
      for (var _i = 0; _i < arguments.length; _i++) {
        grammaLog += arguments[_i] + "<br>\n";
      }
    }

    CocoR.CocoParserFrame = CocoR.CocoParserJsFrame;
    CocoR.CocoScannerFrame = CocoR.CocoScannerJsFrame;
    //CocoCopyrightFrame;
    var myscanner = new CocoR.Scanner(grammarText, "grammar");
    var myparser = new CocoR.Parser(myscanner);
    myparser.trace = new CocoR.StringWriter();
    myparser.tab = new CocoR.Tab(myparser);
    if(trace) myparser.tab.SetDDT("AFGIJPSX");
    myparser.tab.genJS = true;
    myparser.dfa = new CocoR.DFA(myparser);
    myparser.pgen = new CocoR.ParserGen(myparser);
    myparser.pgen.writeBufferTo = MyWriteBufferTo;
    myparser.log = myGrammarLog;
    myparser.errors.log = myGrammarLog;
    myparser.Parse();
    grammaLog += "grammar: " + myparser.errors.count +  " error(s) detected\n";
    $grammarInfo.html(grammaLog);
    if (myparser.trace) codeTrace.insert(myparser.trace.ToString());

    if(myparser.errors.count == 0) {
      let newParser = grammarJsScanner + grammarJsParser;
      codeGen.insert(newParser);
      grammaLog = "";
      try {
        eval(newParser);
        var scanner_input = new CocoRJS.Scanner(codeText, "input");
        var parser_input = new CocoRJS.Parser(scanner_input);
        parser_input.log = myGrammarLog;
        parser_input.errors.log = myGrammarLog;
        parser_input.Parse();
        grammaLog += "input: " + parser_input.errors.count +  " error(s) detected\n";
      } catch(error) {
        grammaLog += error;
      }
      $codeInfo.html(grammaLog);
    }

    //squilu_run(grammarText, grammarText.length , codeText, codeText.length);

    $('#overlay').css({
      'z-index': '-1',
      'display': 'none',
      'background-color': 'rgba(1, 1, 1, 1.0)'
    });

    if (result.compile == 0) {
      $grammarValidation.removeClass('validation-invalid').show();

      codeGen.insert(outputs.gen);
      codeTrace.insert(outputs.trace);

      if (result.parse == 0) {
        $codeValidation.removeClass('validation-invalid').show();
      } else {
        $codeValidation.addClass('validation-invalid').show();
      }

      if (outputs.parse_status.length > 0) {
        const errors = textToErrors(outputs.parse_status);
        const html = generateErrorListHTML(errors);
        $codeInfo.html(html);
      }
    } else {
      $grammarValidation.addClass('validation-invalid').show();
    }

    if (outputs.compile_status.length > 0) {
      const errors = textToErrors(outputs.compile_status);
      const html = generateErrorListHTML(errors);
      $grammarInfo.html(html);
    }
  }, 0);
}

// Event handing for text editing
let timer;
function setupTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    updateLocalStorage();
    if ($('#auto-refresh').prop('checked')) {
      parse();
    }
  }, 200);
};
grammar.getSession().on('change', setupTimer);
code.getSession().on('change', setupTimer);

// Event handing in the info area
function makeOnClickInInfo(editor) {
  return function () {
    const el = $(this);
    let line = el.data('ln') - 1;
    let col = el.data('col') - 1;
    editor.navigateTo(line, col);
    editor.scrollToLine(line, true, false, null);
    editor.focus();
  }
};
$('#grammar-info').on('click', 'li[data-ln]', makeOnClickInInfo(grammar));
$('#code-info').on('click', 'li[data-ln]', makeOnClickInInfo(code));

// Event handing in the AST optimization
$('#opt-mode').on('change', setupTimer);
$('#packrat').on('change', setupTimer);
$('#show-trace').on('change', setupTimer);
$('#auto-refresh').on('change', () => {
  updateLocalStorage();
  $('#parse').prop('disabled', $('#auto-refresh').prop('checked'));
  setupTimer();
});
$('#parse').on('click', parse);

// Resize editors to fit their parents
function resizeEditorsToParent() {
  code.resize();
  code.renderer.updateFull();
  codeGen.resize();
  codeGen.renderer.updateFull();
  codeTrace.resize();
  codeTrace.renderer.updateFull();
}

// Show windows
function setupToolWindow(lsKeyName, buttonSel, codeSel, showDefault) {
  let storedValue = localStorage.getItem(lsKeyName);
  if (!storedValue) {
    localStorage.setItem(lsKeyName, showDefault);
    storedValue = localStorage.getItem(lsKeyName);
  }
  let show = storedValue === 'true';
  $(buttonSel).prop('checked', show);
  $(codeSel).css({ 'display': show ? 'block' : 'none' });

  $(buttonSel).on('change', () => {
    show = !show;
    localStorage.setItem(lsKeyName, show);
    $(codeSel).css({ 'display': show ? 'block' : 'none' });
    resizeEditorsToParent();
  });
}

setupToolWindow('show-gen', '#show-gen', '#code-gen', true);
setupToolWindow('show-trace', '#show-trace', '#code-trace', false);

// Show page
$('#main').css({
  'display': 'flex',
});

// used to collect output from C
var outputs = {
  'default': '',
  'compile_status': '',
  'parse_status': '',
  'gen': '',
};

// current output (key in `outputs`)
var output = "default";

// results of the various stages
var result = {
  'compile': 0,
  'parse': 0,
  'gen': 0,
  'trace': 0,
};

// Emscripten
var Module = {

  // intercept stdout (print) and stderr (printErr)
  // note: text received is line based and missing final '\n'

  // called when emscripten runtime is initialized
  'onRuntimeInitialized': function() {
    // Initial parse
    if ($('#auto-refresh').prop('checked')) {
      parse();
    }
  },
};

// vim: sw=2:sts=2
