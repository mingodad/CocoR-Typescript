/*//----Start Aux2-ts.js */
if (stdScriptArgs.length > 1) {
    var input_fname = stdScriptArgs[1];
    var input_source = std.loadFile(input_fname);
    var scanner = new Scanner(input_source, input_fname);
    /*
    tok = scanner.Scan()
    while(tok.kind != Scanner.eofSym)
    {
        console.log(tok, tok.kind, tok.pos, tok.charPos, tok.col, tok.line, tok.val);
        tok = scanner.Scan();
    }
    */
    var parser = new Parser(scanner);
    parser.Parse();
    console.log("\n" + input_fname + ": " + parser.errors.count +  " error(s) detected\n");
}
else {
    console.log("\n  usage: parser input_filename\n");
}
/*//----End Auxe-ts.js */
