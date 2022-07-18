//Start CocoR.js
var CocoR;
(function (CocoR) {
    /*
    //type Mixed = `${number} ${boolean} ${string}`;
    // must follow the format
    //const mixed: Mixed = "1 true friend";
    
    type Specifiers = {
        's': string,
        'd': number,
        'b': boolean,
        'D': Date
    };
    
    type Spec = keyof Specifiers;
    
    type Values<T extends string> =
        T extends `${infer _}%${infer K}${infer Rest}`
        ? K extends Spec
            ? [ Specifiers[K], ...Values<Rest> ]
            : Values<`${K}${Rest}`>
        : [];
    
    type Formatted<T extends string> =
        T extends `${infer Head}%${infer K}${infer Tail}`
        ? K extends Spec
            ? `${Head}${string}${Formatted<Tail>}`
            : `${Head}%${Formatted<`${K}${Tail}`>}`
        : T;
    
    declare function printf<T extends string>(format: T, ...values: Values<T>): Formatted<T>;
    
    const r = printf('this is a %%s and it is %d %wyears old, right?%b %D %i %f', 'Hackle', 20, true, new Date());
    */
    function stringIsNullOrEmpty(s) { return s ? s.length == 0 : true; }
    function CharIsLetter(ch) { return (ch >= 97 /*'a'*/ && ch <= 122 /*'z'*/) || (ch >= 65 /*'A'*/ && ch <= 132 /*'Z'*/); }
    var StringBuilder = /** @class */ (function () {
        function StringBuilder() {
            this.strArray = new Array();
        }
        //constructor(){}
        StringBuilder.prototype.get = function (nIndex) {
            return this.strArray[nIndex];
        };
        StringBuilder.prototype.isEmpty = function () {
            return this.strArray.length === 0;
        };
        StringBuilder.prototype.Append = function (str) {
            if (str.length)
                this.strArray.push(str);
        };
        StringBuilder.prototype.ToString = function () {
            var str = this.strArray.join("");
            return (str);
        };
        StringBuilder.prototype.joinToString = function (delimeter) {
            return this.strArray.join(delimeter);
        };
        StringBuilder.prototype.clear = function () {
            this.strArray.length = 0;
        };
        StringBuilder.prototype.Length = function () { return this.strArray.length; };
        return StringBuilder;
    }());
    CocoR.StringBuilder = StringBuilder;
    var FileMode;
    (function (FileMode) {
        FileMode[FileMode["Open"] = 0] = "Open";
        FileMode[FileMode["Create"] = 1] = "Create";
    })(FileMode || (FileMode = {}));
    ;
    var FileAccess;
    (function (FileAccess) {
        FileAccess[FileAccess["Read"] = 0] = "Read";
    })(FileAccess || (FileAccess = {}));
    ;
    var FileShare;
    (function (FileShare) {
        FileShare[FileShare["Read"] = 0] = "Read";
    })(FileShare || (FileShare = {}));
    ;
    var FileStream = /** @class */ (function () {
        function FileStream(fn, mode, access, share) {
        }
        FileStream.prototype.ReadByte = function () { return 0; };
        return FileStream;
    }());
    var StreamWriter = /** @class */ (function () {
        function StreamWriter(fd) {
        }
        StreamWriter.prototype.Write = function (s) { };
        StreamWriter.prototype.WriteLine = function (s) { };
        StreamWriter.prototype.Close = function () { };
        return StreamWriter;
    }());
    var StringWriter = /** @class */ (function () {
        function StringWriter() {
            this._sb = new StringBuilder();
        }
        StringWriter.prototype.Write = function (s) { this._sb.Append(s); };
        StringWriter.prototype.WriteLine = function (s) { if (s)
            this._sb.Append(s); this._sb.Append("\n"); };
        StringWriter.prototype.Close = function () { };
        StringWriter.prototype.ToString = function () { return this._sb.ToString(); };
        return StringWriter;
    }());
    CocoR.StringWriter = StringWriter;
    /*
    class DictionaryEntry<Key_T,Value_T> {
        key : Key_T;
        value : Value_T;
        constructor(sk : Key_T, sv : Value_T) {
            this.key = sk;
            this.value = sv;
        }
    }
    
    class Hashtable<Key_T,Value_T> {
        _data : {};
    
        [Symbol.iterator]() {
            for (let key in this._data) {
                if (this._data.hasOwnProperty(key)) {
                    yield new DictionaryEntry<Key_T,Value_T>(key, this._data[key]);
                }
            }
        }
    
    }
    */
    function sprintf() {
        var argv = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            argv[_i] = arguments[_i];
        }
        // http://kevin.vanzonneveld.net
        // +   original by: Ash Searle (http://hexmen.com/blog/)
        // + namespaced by: Michael White (http://getsprink.com)
        // +    tweaked by: Jack
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Paulo Freitas
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Dj
        // +   improved by: Allidylls
        // *     example 1: sprintf("%01.2f", 123.1);
        // *     returns 1: 123.10
        // *     example 2: sprintf("[%10s]", 'monkey');
        // *     returns 2: '[    monkey]'
        // *     example 3: sprintf("[%'#10s]", 'monkey');
        // *     returns 3: '[####monkey]'
        // *     example 4: sprintf("%d", 123456789012345);
        // *     returns 4: '123456789012345'
        var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([qscboxXuideEfFgG])/g;
        var a = argv, i = 0, format = a[i++];
        // pad()
        var pad = function (str, len, chr, leftJustify) {
            if (!chr) {
                chr = ' ';
            }
            var padding = (str.length >= len) ? "" : Array(1 + len - str.length >>> 0).join(chr);
            return leftJustify ? str + padding : padding + str;
        };
        // justify()
        var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
            var diff = minWidth - value.length;
            if (diff > 0) {
                if (leftJustify || !zeroPad) {
                    value = pad(value, minWidth, customPadChar, leftJustify);
                }
                else {
                    value = value.slice(0, prefix.length) + pad("", diff, '0', true) + value.slice(prefix.length);
                }
            }
            return value;
        };
        // formatBaseX()
        var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
            // Note: casts negative numbers to positive ones
            var number = value >>> 0;
            var sprefix = prefix && number && {
                '2': '0b',
                '8': '0',
                '16': '0x'
            }[base] || "";
            var rc = prefix + pad(number.toString(base), precision || 0, '0', false);
            return justify(rc, sprefix, leftJustify, minWidth, zeroPad, " ");
        };
        // formatString()
        var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
            if (precision != null) {
                value = value.slice(0, precision);
            }
            return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
        };
        // doFormat()
        var doFormat = function (substring, valueIndex, flags, pminWidth, _, pprecision, type) {
            var number;
            var prefix;
            var method;
            var textTransform;
            var value;
            var minWidth = 0;
            var precision = 0;
            if (substring == '%%') {
                return '%';
            }
            // parse flags
            var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false, customPadChar = ' ';
            var flagsl = flags.length;
            for (var j = 0; flags && j < flagsl; j++) {
                switch (flags.charAt(j)) {
                    case ' ':
                        positivePrefix = ' ';
                        break;
                    case '+':
                        positivePrefix = '+';
                        break;
                    case '-':
                        leftJustify = true;
                        break;
                    case "'":
                        customPadChar = flags.charAt(j + 1);
                        break;
                    case '0':
                        zeroPad = true;
                        break;
                    case '#':
                        prefixBaseX = true;
                        break;
                }
            }
            // parameters may be null, undefined, empty-string or real valued
            // we want to ignore null, undefined and empty-string values
            if (pminWidth) {
                if (pminWidth == '*') {
                    minWidth = +a[i++];
                }
                else if (pminWidth.charAt(0) == '*') {
                    minWidth = +a[pminWidth.slice(1, -1)];
                }
                else {
                    minWidth = +pminWidth;
                }
            }
            // Note: undocumented perl feature:
            if (minWidth < 0) {
                minWidth = -minWidth;
                leftJustify = true;
            }
            if (!isFinite(minWidth)) {
                throw new Error("sprintf: (minimum-)width must be finite");
            }
            if (!pprecision) {
                precision = "fFeE".indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : null;
            }
            else if (pprecision == '*') {
                precision = +a[i++];
            }
            else if (pprecision.charAt(0) == '*') {
                precision = +a[pprecision.slice(1, -1)];
            }
            else {
                precision = +pprecision;
            }
            // grab value using valueIndex if required?
            value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
            switch (type) {
                case 'q':
                    value = "\"" + value.replace("\"", "\"\"") + "\"";
                case 's':
                    return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
                case 'c':
                    return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad, " ");
                case 'b':
                    return formatBaseX(+value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'o':
                    return formatBaseX(+value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'x':
                    return formatBaseX(+value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'X':
                    return formatBaseX(+value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
                case 'u':
                    return formatBaseX(+value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'i':
                case 'd':
                    number = +value || 0;
                    number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
                    prefix = number < 0 ? '-' : positivePrefix;
                    value = prefix + pad(String(Math.abs(number)), precision || 0, '0', false);
                    return justify(value, prefix, leftJustify, minWidth, zeroPad, " ");
                case 'e':
                case 'E':
                case 'f': // Should handle locales (as per setlocale)
                case 'F':
                case 'g':
                case 'G':
                    number = +value;
                    prefix = number < 0 ? '-' : positivePrefix;
                    method = ["toExponential", "toFixed", "toPrecision"]["efg".indexOf(type.toLowerCase())];
                    textTransform = ["toString", "toUpperCase"]["eEfFgG".indexOf(type) % 2];
                    value = prefix + Math.abs(number)[method](precision);
                    return justify(value, prefix, leftJustify, minWidth, zeroPad, " ")[textTransform]();
                default:
                    return substring;
            }
        };
        return format.replace(regex, doFormat);
    }
    CocoR.sprintf = sprintf;
    var BitArray = /** @class */ (function () {
        function BitArray(count, defVal) {
            if (defVal === void 0) { defVal = false; }
            this._bits = new Array(count);
            for (var idx = 0; idx < this._bits.length; ++idx)
                this._bits[idx] = defVal;
        }
        BitArray.prototype.SetAll = function (val) {
            for (var idx = 0; idx < this._bits.length; ++idx)
                this._bits[idx] = val;
        };
        BitArray.prototype.Elements = function () {
            var count = 0;
            for (var _i = 0, _a = this._bits; _i < _a.length; _i++) {
                var elm = _a[_i];
                if (elm)
                    ++count;
            }
            return count;
        };
        BitArray.prototype.checkSameSize = function (ba) {
            if (this._bits.length != ba._bits.length)
                throw ("Bitarray size doesn't match.");
        };
        BitArray.prototype.Equals = function (ba) {
            if (this._bits.length != ba._bits.length)
                return false;
            for (var idx = 0; idx < this._bits.length; ++idx) {
                if (ba._bits[idx] != this._bits[idx])
                    return false;
            }
            return true;
        };
        BitArray.prototype.Intersect = function (ba) {
            this.checkSameSize(ba);
            for (var idx = 0; idx < this._bits.length; ++idx) {
                if (ba._bits[idx] && this._bits[idx])
                    return true;
            }
            return false;
        };
        BitArray.prototype.Get = function (i) { return this._bits[i]; };
        BitArray.prototype.Set = function (i, val) { this._bits[i] = val; };
        BitArray.prototype.Count = function () { return this._bits.length; };
        BitArray.prototype.Or = function (ba) {
            this.checkSameSize(ba);
            for (var idx = 0; idx < this._bits.length; ++idx) {
                this._bits[idx] = ba._bits[idx] || this._bits[idx];
            }
            return this;
        };
        BitArray.prototype.And = function (ba) {
            this.checkSameSize(ba);
            for (var idx = 0; idx < this._bits.length; ++idx) {
                this._bits[idx] = ba._bits[idx] && this._bits[idx];
            }
            return this;
        };
        BitArray.prototype.Not = function () {
            for (var idx = 0; idx < this._bits.length; ++idx) {
                this._bits[idx] = !this._bits[idx];
            }
            return this;
        };
        BitArray.prototype.Clone = function () {
            var ba = new BitArray(0);
            ba._bits = this._bits.slice(0);
            return ba;
        };
        return BitArray;
    }());
    CocoR.BitArray = BitArray;
    var Char_MinValue = 0;
    var Char_MaxValue = 0xFF;
    /*//----End Aux-ts.ts */
    /*//----Start Scanner.ts */
    /*----------------------------------------------------------------------
    Compiler Generator Coco/R,
    Copyright (c) 1990, 2004 Hanspeter Moessenboeck, University of Linz
    extended by M. Loeberbauer & A. Woess, Univ. of Linz
    with improvements by Pat Terry, Rhodes University
    
    This program is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the
    Free Software Foundation; either version 2, or (at your option) any
    later version.
    
    This program is distributed in the hope that it will be useful, but
    WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
    for more details.
    
    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
    
    As an exception, it is allowed to write an extension of Coco/R that is
    used as a plugin in non-free software.
    
    If not otherwise stated, any source code generated by Coco/R (other than
    Coco/R itself) does not fall under the GNU General Public License.
    -----------------------------------------------------------------------*/
    var Token = /** @class */ (function () {
        function Token() {
            this.kind = 0; // token kind
            this.pos = 0; // token position in bytes in the source text (starting at 0)
            this.charPos = 0; // token position in characters in the source text (starting at 0)
            this.col = 1; // token column (starting at 1)
            this.line = 1; // token line (starting at 1)
            this.next = null; // ML 2005-03-11 Tokens are kept in linked list
        }
        return Token;
    }());
    CocoR.Token = Token;
    //-----------------------------------------------------------------------------------
    // StringBuffer
    //-----------------------------------------------------------------------------------
    var Buffer = /** @class */ (function () {
        function Buffer(s) {
            this.buf = s;
            this.bufLen = s.length;
            this.bufStart = this.bufPos = 0;
        }
        Buffer.prototype.Read = function () {
            if (this.bufPos < this.bufLen) {
                return this.buf.charCodeAt(this.bufPos++);
            }
            else {
                return Buffer.EOF;
            }
        };
        Buffer.prototype.Peek = function () {
            var curPos = this.getPos();
            var ch = this.Read();
            this.setPos(curPos);
            return ch;
        };
        // beg .. begin, zero-based, inclusive, in byte
        // end .. end, zero-based, exclusive, in byte
        Buffer.prototype.GetString = function (beg, end) {
            return this.buf.slice(beg, end);
        };
        Buffer.prototype.getPos = function () { return this.bufPos + this.bufStart; };
        Buffer.prototype.setPos = function (value) {
            if (value < 0 || value > this.bufLen) {
                throw "buffer out of bounds access, position: " + value;
            }
            if (value >= this.bufStart && value < this.bufStart + this.bufLen) { // already in buffer
                this.bufPos = value - this.bufStart;
            }
            else {
                // set the position to the end of the file, Pos will return fileLen.
                this.bufPos = this.bufLen - this.bufStart;
            }
        };
        Buffer.EOF = -1;
        return Buffer;
    }());
    CocoR.Buffer = Buffer;
    //-----------------------------------------------------------------------------------
    // Scanner
    //-----------------------------------------------------------------------------------
    var Scanner = /** @class */ (function () {
        function Scanner(str, fileName) {
            this.stateNo = 0; // to user defined states
            this.parseFileName = fileName;
            this.buffer = new Buffer(str); // scanner buffer
            if (Scanner.start.length == 0)
                this.Init0();
            this.Init();
        }
        Scanner.prototype.Init0 = function () {
            Scanner.start = new Array(128);
            for (var i = 0; i < 128; ++i)
                Scanner.start[i] = 0;
            for (var i = 65; i <= 90; ++i)
                Scanner.start[i] = 1;
            for (var i = 95; i <= 95; ++i)
                Scanner.start[i] = 1;
            for (var i = 97; i <= 122; ++i)
                Scanner.start[i] = 1;
            for (var i = 48; i <= 57; ++i)
                Scanner.start[i] = 2;
            Scanner.start[34] = 12;
            Scanner.start[39] = 5;
            Scanner.start[36] = 13;
            Scanner.start[61] = 16;
            Scanner.start[46] = 35;
            Scanner.start[43] = 17;
            Scanner.start[45] = 18;
            Scanner.start[58] = 20;
            Scanner.start[64] = 21;
            Scanner.start[60] = 36;
            Scanner.start[94] = 22;
            Scanner.start[62] = 23;
            Scanner.start[44] = 24;
            Scanner.start[91] = 27;
            Scanner.start[93] = 28;
            Scanner.start[124] = 29;
            Scanner.start[40] = 37;
            Scanner.start[41] = 30;
            Scanner.start[123] = 31;
            Scanner.start[125] = 32;
            //Scanner.start[Buffer.EOF] = -1;
        };
        Scanner.prototype.Init = function () {
            this.pos = -1;
            this.line = 1;
            this.col = 0;
            this.charPos = -1;
            this.oldEols = 0;
            this.NextCh();
            this.pt = this.tokens = new Token(); // first token is a dummy
        };
        Scanner.prototype.NextCh = function () {
            if (this.oldEols > 0) {
                this.ch = Scanner.EOL;
                this.oldEols--;
            }
            else {
                this.pos = this.buffer.getPos();
                // buffer reads unicode chars, if UTF8 has been detected
                this.ch = this.buffer.Read();
                this.col++;
                this.charPos++;
                // replace isolated '\r' by '\n' in order to make
                // eol handling uniform across Windows, Unix and Mac
                if (this.ch == 13 /*'\r'*/ && this.buffer.Peek() != Scanner.EOL /*'\n'*/)
                    this.ch = Scanner.EOL;
                if (this.ch == Scanner.EOL) {
                    this.line++;
                    this.col = 0;
                }
            }
        };
        Scanner.prototype.AddCh = function () {
            if (this.ch != Buffer.EOF) {
                ++this.tlen;
                this.tval += String.fromCharCode(this.ch);
                this.NextCh();
            }
            //this.tval[this.tlen++] = (char) ch;
        };
        Scanner.prototype.Comment0 = function () {
            var level = 1, pos0 = this.pos, line0 = this.line, col0 = this.col, charPos0 = this.charPos;
            this.NextCh();
            if (this.ch == 47 /*'/'*/) {
                this.NextCh();
                for (;;) {
                    if (this.ch == 10) {
                        level--;
                        if (level == 0) {
                            this.oldEols = this.line - line0;
                            this.NextCh();
                            return true;
                        }
                        this.NextCh();
                    }
                    else if (this.ch == Buffer.EOF)
                        return false;
                    else
                        this.NextCh();
                }
            }
            this.buffer.setPos(pos0);
            this.NextCh();
            this.line = line0;
            this.col = col0;
            this.charPos = charPos0;
            return false;
        };
        Scanner.prototype.Comment1 = function () {
            var level = 1, pos0 = this.pos, line0 = this.line, col0 = this.col, charPos0 = this.charPos;
            this.NextCh();
            if (this.ch == 42 /*'*'*/) {
                this.NextCh();
                for (;;) {
                    if (this.ch == 42 /*'*'*/) {
                        this.NextCh();
                        if (this.ch == 47 /*'/'*/) {
                            level--;
                            if (level == 0) { /*this.oldEols = this.line - line0;*/
                                this.NextCh();
                                return true;
                            }
                            this.NextCh();
                        }
                    }
                    else if (this.ch == 47 /*'/'*/) {
                        this.NextCh();
                        if (this.ch == 42 /*'*'*/) {
                            level++;
                            this.NextCh();
                        }
                    }
                    else if (this.ch == Buffer.EOF)
                        return false;
                    else
                        this.NextCh();
                }
            }
            this.buffer.setPos(pos0);
            this.NextCh();
            this.line = line0;
            this.col = col0;
            this.charPos = charPos0;
            return false;
        };
        Scanner.prototype.CheckLiteral = function () {
            switch (this.t.val) {
                case "COMPILER":
                    this.t.kind = 6;
                    break;
                case "IGNORECASE":
                    this.t.kind = 7;
                    break;
                case "TERMINALS":
                    this.t.kind = 8;
                    break;
                case "CHARACTERS":
                    this.t.kind = 9;
                    break;
                case "TOKENS":
                    this.t.kind = 10;
                    break;
                case "PRAGMAS":
                    this.t.kind = 11;
                    break;
                case "COMMENTS":
                    this.t.kind = 12;
                    break;
                case "FROM":
                    this.t.kind = 13;
                    break;
                case "TO":
                    this.t.kind = 14;
                    break;
                case "NESTED":
                    this.t.kind = 15;
                    break;
                case "IGNORE":
                    this.t.kind = 16;
                    break;
                case "SYMBOLTABLES":
                    this.t.kind = 17;
                    break;
                case "PRODUCTIONS":
                    this.t.kind = 18;
                    break;
                case "END":
                    this.t.kind = 21;
                    break;
                case "STRICT":
                    this.t.kind = 22;
                    break;
                case "ANY":
                    this.t.kind = 26;
                    break;
                case "out":
                    this.t.kind = 31;
                    break;
                case "WEAK":
                    this.t.kind = 39;
                    break;
                case "SYNC":
                    this.t.kind = 44;
                    break;
                case "IF":
                    this.t.kind = 45;
                    break;
                case "CONTEXT":
                    this.t.kind = 46;
                    break;
                default: break;
            }
        };
        Scanner.prototype.NextToken = function () {
            for (;;) {
                while (this.ch == 32 /*' '*/ ||
                    this.ch >= 9 && this.ch <= 10 || this.ch == 13)
                    this.NextCh();
                if (this.ch == 47 /*'/'*/ && this.Comment0() || this.ch == 47 /*'/'*/ && this.Comment1())
                    continue;
                break;
            }
            var recKind = Scanner.noSym;
            var recEnd = this.pos;
            this.t = new Token();
            this.t.pos = this.pos;
            this.t.col = this.col;
            this.t.line = this.line;
            this.t.charPos = this.charPos;
            var state = (this.ch == Buffer.EOF) ? -1 : Scanner.start[this.ch];
            this.tlen = 0;
            this.tval = "";
            this.AddCh();
            loop: for (;;) {
                switch (state) {
                    case -1: {
                        this.t.kind = Scanner.eofSym;
                        break loop;
                    } // NextCh already done
                    case 0: {
                        if (recKind != Scanner.noSym) {
                            this.tlen = recEnd - this.t.pos;
                            this.SetScannerBehindT();
                        }
                        this.t.kind = recKind;
                        break loop;
                    } // NextCh already done
                    case 1:
                        recEnd = this.pos;
                        recKind = 1 /* ident */;
                        if (this.ch >= 48 /*'0'*/ && this.ch <= 57 /*'9'*/ || this.ch >= 65 /*'A'*/ && this.ch <= 90 /*'Z'*/ || this.ch == 95 /*'_'*/ || this.ch >= 97 /*'a'*/ && this.ch <= 122 /*'z'*/) {
                            this.AddCh();
                            state = 1;
                            break;
                        }
                        else {
                            this.t.kind = 1 /* ident */;
                            this.t.val = this.tval;
                            this.CheckLiteral();
                            return this.t;
                        }
                    case 2:
                        recEnd = this.pos;
                        recKind = 2 /* number */;
                        if (this.ch >= 48 /*'0'*/ && this.ch <= 57 /*'9'*/) {
                            this.AddCh();
                            state = 2;
                            break;
                        }
                        else {
                            this.t.kind = 2 /* number */;
                            break loop;
                        }
                    case 3:
                        {
                            this.t.kind = 3 /* string */;
                            break loop;
                        }
                    case 4:
                        {
                            this.t.kind = 4 /* badString */;
                            break loop;
                        }
                    case 5:
                        if (this.ch <= 9 || this.ch >= 11 && this.ch <= 12 || this.ch >= 14 && this.ch <= 38 /*'&'*/ || this.ch >= 40 /*'('*/ && this.ch <= 91 /*'['*/ || this.ch >= 93 /*']'*/ && this.ch <= 255) {
                            this.AddCh();
                            state = 6;
                            break;
                        }
                        else if (this.ch == 92) {
                            this.AddCh();
                            state = 7;
                            break;
                        }
                        else {
                            state = 0;
                            break;
                        }
                    case 6:
                        if (this.ch == 39) {
                            this.AddCh();
                            state = 9;
                            break;
                        }
                        else {
                            state = 0;
                            break;
                        }
                    case 7:
                        if (this.ch >= 32 /*' '*/ && this.ch <= 126 /*'~'*/) {
                            this.AddCh();
                            state = 8;
                            break;
                        }
                        else {
                            state = 0;
                            break;
                        }
                    case 8:
                        if (this.ch >= 48 /*'0'*/ && this.ch <= 57 /*'9'*/ || this.ch >= 97 /*'a'*/ && this.ch <= 102 /*'f'*/) {
                            this.AddCh();
                            state = 8;
                            break;
                        }
                        else if (this.ch == 39) {
                            this.AddCh();
                            state = 9;
                            break;
                        }
                        else {
                            state = 0;
                            break;
                        }
                    case 9:
                        {
                            this.t.kind = 5 /* char */;
                            break loop;
                        }
                    case 10:
                        recEnd = this.pos;
                        recKind = 50 /* ddtSym */;
                        if (this.ch >= 48 /*'0'*/ && this.ch <= 57 /*'9'*/ || this.ch >= 65 /*'A'*/ && this.ch <= 90 /*'Z'*/ || this.ch == 95 /*'_'*/ || this.ch >= 97 /*'a'*/ && this.ch <= 122 /*'z'*/) {
                            this.AddCh();
                            state = 10;
                            break;
                        }
                        else {
                            this.t.kind = 50 /* ddtSym */;
                            break loop;
                        }
                    case 11:
                        recEnd = this.pos;
                        recKind = 51 /* optionSym */;
                        if (this.ch >= 45 /*'-'*/ && this.ch <= 46 /*'.'*/ || this.ch >= 48 /*'0'*/ && this.ch <= 58 /*':'*/ || this.ch >= 65 /*'A'*/ && this.ch <= 90 /*'Z'*/ || this.ch == 95 /*'_'*/ || this.ch >= 97 /*'a'*/ && this.ch <= 122 /*'z'*/) {
                            this.AddCh();
                            state = 11;
                            break;
                        }
                        else {
                            this.t.kind = 51 /* optionSym */;
                            break loop;
                        }
                    case 12:
                        if (this.ch <= 9 || this.ch >= 11 && this.ch <= 12 || this.ch >= 14 && this.ch <= 33 /*'!'*/ || this.ch >= 35 /*'#'*/ && this.ch <= 91 /*'['*/ || this.ch >= 93 /*']'*/ && this.ch <= 255) {
                            this.AddCh();
                            state = 12;
                            break;
                        }
                        else if (this.ch == 10 || this.ch == 13) {
                            this.AddCh();
                            state = 4;
                            break;
                        }
                        else if (this.ch == 34 /*'"'*/) {
                            this.AddCh();
                            state = 3;
                            break;
                        }
                        else if (this.ch == 92) {
                            this.AddCh();
                            state = 14;
                            break;
                        }
                        else {
                            state = 0;
                            break;
                        }
                    case 13:
                        recEnd = this.pos;
                        recKind = 50 /* ddtSym */;
                        if (this.ch >= 48 /*'0'*/ && this.ch <= 57 /*'9'*/) {
                            this.AddCh();
                            state = 10;
                            break;
                        }
                        else if (this.ch >= 65 /*'A'*/ && this.ch <= 90 /*'Z'*/ || this.ch == 95 /*'_'*/ || this.ch >= 97 /*'a'*/ && this.ch <= 122 /*'z'*/) {
                            this.AddCh();
                            state = 15;
                            break;
                        }
                        else {
                            this.t.kind = 50 /* ddtSym */;
                            break loop;
                        }
                    case 14:
                        if (this.ch >= 32 /*' '*/ && this.ch <= 126 /*'~'*/) {
                            this.AddCh();
                            state = 12;
                            break;
                        }
                        else {
                            state = 0;
                            break;
                        }
                    case 15:
                        recEnd = this.pos;
                        recKind = 50 /* ddtSym */;
                        if (this.ch >= 48 /*'0'*/ && this.ch <= 57 /*'9'*/) {
                            this.AddCh();
                            state = 10;
                            break;
                        }
                        else if (this.ch >= 65 /*'A'*/ && this.ch <= 90 /*'Z'*/ || this.ch == 95 /*'_'*/ || this.ch >= 97 /*'a'*/ && this.ch <= 122 /*'z'*/) {
                            this.AddCh();
                            state = 15;
                            break;
                        }
                        else if (this.ch == 61 /*'='*/) {
                            this.AddCh();
                            state = 11;
                            break;
                        }
                        else {
                            this.t.kind = 50 /* ddtSym */;
                            break loop;
                        }
                    case 16:
                        {
                            this.t.kind = 19 /* "=" */;
                            break loop;
                        }
                    case 17:
                        {
                            this.t.kind = 23 /* "+" */;
                            break loop;
                        }
                    case 18:
                        {
                            this.t.kind = 24 /* "-" */;
                            break loop;
                        }
                    case 19:
                        {
                            this.t.kind = 25 /* ".." */;
                            break loop;
                        }
                    case 20:
                        {
                            this.t.kind = 27 /* ":" */;
                            break loop;
                        }
                    case 21:
                        {
                            this.t.kind = 28 /* "@" */;
                            break loop;
                        }
                    case 22:
                        {
                            this.t.kind = 30 /* "^" */;
                            break loop;
                        }
                    case 23:
                        {
                            this.t.kind = 32 /* ">" */;
                            break loop;
                        }
                    case 24:
                        {
                            this.t.kind = 33 /* "," */;
                            break loop;
                        }
                    case 25:
                        {
                            this.t.kind = 34 /* "<." */;
                            break loop;
                        }
                    case 26:
                        {
                            this.t.kind = 35 /* ".>" */;
                            break loop;
                        }
                    case 27:
                        {
                            this.t.kind = 36 /* "[" */;
                            break loop;
                        }
                    case 28:
                        {
                            this.t.kind = 37 /* "]" */;
                            break loop;
                        }
                    case 29:
                        {
                            this.t.kind = 38 /* "|" */;
                            break loop;
                        }
                    case 30:
                        {
                            this.t.kind = 41 /* ")" */;
                            break loop;
                        }
                    case 31:
                        {
                            this.t.kind = 42 /* "{" */;
                            break loop;
                        }
                    case 32:
                        {
                            this.t.kind = 43 /* "}" */;
                            break loop;
                        }
                    case 33:
                        {
                            this.t.kind = 47 /* "(." */;
                            break loop;
                        }
                    case 34:
                        {
                            this.t.kind = 48 /* ".)" */;
                            break loop;
                        }
                    case 35:
                        recEnd = this.pos;
                        recKind = 20 /* "." */;
                        if (this.ch == 46 /*'.'*/) {
                            this.AddCh();
                            state = 19;
                            break;
                        }
                        else if (this.ch == 62 /*'>'*/) {
                            this.AddCh();
                            state = 26;
                            break;
                        }
                        else if (this.ch == 41 /*')'*/) {
                            this.AddCh();
                            state = 34;
                            break;
                        }
                        else {
                            this.t.kind = 20 /* "." */;
                            break loop;
                        }
                    case 36:
                        recEnd = this.pos;
                        recKind = 29 /* "<" */;
                        if (this.ch == 46 /*'.'*/) {
                            this.AddCh();
                            state = 25;
                            break;
                        }
                        else {
                            this.t.kind = 29 /* "<" */;
                            break loop;
                        }
                    case 37:
                        recEnd = this.pos;
                        recKind = 40 /* "(" */;
                        if (this.ch == 46 /*'.'*/) {
                            this.AddCh();
                            state = 33;
                            break;
                        }
                        else {
                            this.t.kind = 40 /* "(" */;
                            break loop;
                        }
                }
            }
            this.t.val = this.tval;
            return this.t;
        };
        Scanner.prototype.SetScannerBehindT = function () {
            this.buffer.setPos(this.t.pos);
            this.NextCh();
            this.line = this.t.line;
            this.col = this.t.col;
            this.charPos = this.t.charPos;
            for (var i = 0; i < this.tlen; i++)
                this.NextCh();
        };
        // get the next token (possibly a token already seen during peeking)
        Scanner.prototype.Scan = function () {
            if (this.tokens.next == null) {
                return this.NextToken();
            }
            else {
                this.pt = this.tokens = this.tokens.next;
                return this.tokens;
            }
        };
        // peek for the next token, ignore pragmas
        Scanner.prototype.Peek = function () {
            do {
                if (this.pt.next == null) {
                    this.pt.next = this.NextToken();
                }
                this.pt = this.pt.next;
            } while (this.pt.kind > Scanner.maxT); // skip pragmas
            return this.pt;
        };
        // make sure that peeking starts at the current scan position
        Scanner.prototype.ResetPeek = function () { this.pt = this.tokens; };
        Scanner.EOL = 10 /*'\n'*/;
        Scanner.eofSym = 0; /* pdt */
        Scanner.maxT = 49;
        Scanner.noSym = 49;
        Scanner.start = []; // maps first token character to start state
        return Scanner;
    }()); // end Scanner
    CocoR.Scanner = Scanner;
    /*
    let scanner : Scanner  = new Scanner(`let a : string = "str";`, "test.txt");
    let tok : Token = scanner.Scan()
    while(tok.kind != Scanner.eofSym)
    {
        console.log(tok);
        tok = scanner.Scan();
    }
    */
    /*//----End Scanner.ts */
    /*//----Start Tab.ts */
    /*-------------------------------------------------------------------------
    Tab.cs -- Symbol Table Management
    Compiler Generator Coco/R,
    Copyright (c) 1990, 2004 Hanspeter Moessenboeck, University of Linz
    extended by M. Loeberbauer & A. Woess, Univ. of Linz
    with improvements by Pat Terry, Rhodes University
    
    This program is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the
    Free Software Foundation; either version 2, or (at your option) any
    later version.
    
    This program is distributed in the hope that it will be useful, but
    WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
    for more details.
    
    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
    
    As an exception, it is allowed to write an extension of Coco/R that is
    used as a plugin in non-free software.
    
    If not otherwise stated, any source code generated by Coco/R (other than
    Coco/R itself) does not fall under the GNU General Public License.
    -------------------------------------------------------------------------*/
    //namespace at.jku.ssw.Coco {
    var Position = /** @class */ (function () {
        function Position(beg, end, col, line) {
            this.beg = beg;
            this.end = end;
            this.col = col;
            this.line = line;
        }
        return Position;
    }());
    CocoR.Position = Position;
    var SymInfo = /** @class */ (function () {
        function SymInfo() {
        }
        return SymInfo;
    }());
    CocoR.SymInfo = SymInfo;
    //=====================================================================
    // Symbol
    //=====================================================================
    var Symbol = /** @class */ (function () {
        function Symbol(typ, name, line, col) {
            this.tokenKind = 0; // t:  token kind (fixedToken, classToken, ...)
            this.deletable = false; // nt: true if nonterminal is deletable
            this.eqAttribute = 0; // store an options equality attribute like "@="
            this.typ = typ;
            this.name = name;
            this.line = line;
            this.col = col;
        }
        // token kinds
        Symbol.fixedToken = 0; // e.g. 'a' ('b' | 'c') (structure of literals)
        Symbol.classToken = 1; // e.g. digit {digit}   (at least one char class)
        Symbol.litToken = 2; // e.g. "while"
        Symbol.classLitToken = 3; // e.g. letter {letter} but without literals that have the same structure
        return Symbol;
    }());
    CocoR.Symbol = Symbol;
    //=====================================================================
    // Node
    //=====================================================================
    var Node = /** @class */ (function () {
        function Node(typ, sym, line, col) {
            this.n = 0; // node number
            this.next = null; // to successor node
            this.down = null; // alt: to next alternative
            this.sub = null; // alt, iter, opt: to first node of substructure
            this.up = false; // true: "next" leads to successor in enclosing structure
            this.val = 0; // chr:  ordinal character value
            // clas: index of character class
            this.code = 0; // chr, clas: transition code
            this.pos = null; // nt, t, wt: pos of actual attributes
            this.typ = typ;
            this.sym = sym;
            this.line = line;
            this.col = col;
        }
        // constants for node kinds
        Node.t = 1; // terminal symbol
        Node.pr = 2; // pragma
        Node.nt = 3; // nonterminal symbol
        Node.clas = 4; // character class
        Node.chr = 5; // character
        Node.wt = 6; // weak terminal symbol
        Node.any = 7; //
        Node.eps = 8; // empty
        Node.sync = 9; // synchronization symbol
        Node.sem = 10; // semantic action: (. .)
        Node.alt = 11; // alternative: |
        Node.iter = 12; // iteration: { }
        Node.opt = 13; // option: [ ]
        Node.rslv = 14; // resolver expr
        Node.normalTrans = 0; // transition codes
        Node.contextTrans = 1;
        return Node;
    }());
    CocoR.Node = Node;
    //=====================================================================
    // Graph
    //=====================================================================
    var Graph = /** @class */ (function () {
        function Graph(left, right) {
            if (left === void 0) { left = null; }
            if (right === void 0) { right = null; }
            this.l = left;
            this.r = right == null ? left : right;
        }
        return Graph;
    }());
    CocoR.Graph = Graph;
    //=====================================================================
    // Sets
    //=====================================================================
    var Sets = /** @class */ (function () {
        function Sets() {
        }
        Sets.Elements = function (s) {
            var max = s.Count();
            var n = 0;
            for (var i = 0; i < max; i++)
                if (s.Get(i))
                    n++;
            return n;
        };
        Sets.Equals = function (a, b) {
            var max = a.Count();
            for (var i = 0; i < max; i++)
                if (a.Get(i) != b.Get(i))
                    return false;
            return true;
        };
        Sets.Intersect = function (a, b) {
            var max = a.Count();
            for (var i = 0; i < max; i++)
                if (a.Get(i) && b.Get(i))
                    return true;
            return false;
        };
        Sets.Subtract = function (a, b) {
            var c = b.Clone();
            a.And(c.Not());
        };
        return Sets;
    }());
    CocoR.Sets = Sets;
    //=====================================================================
    // CharClass
    //=====================================================================
    var CharClass = /** @class */ (function () {
        function CharClass(name, s) {
            this.name = name;
            this.set = s;
        }
        return CharClass;
    }());
    CocoR.CharClass = CharClass;
    //=====================================================================
    // SymTab
    //=====================================================================
    var SymTab = /** @class */ (function () {
        function SymTab(name) {
            this.strict = false;
            this.predefined = new Array();
            this.name = name;
        }
        SymTab.prototype.Add = function (name) {
            if (this.predefined.indexOf(name) < 0)
                this.predefined.push(name);
        };
        return SymTab;
    }());
    CocoR.SymTab = SymTab;
    //=====================================================================
    // Tab
    //=====================================================================
    var TabCNode = /** @class */ (function () {
        function TabCNode(l, r) {
            this.left = l;
            this.right = r;
        }
        return TabCNode;
    }());
    CocoR.TabCNode = TabCNode;
    var Tab = /** @class */ (function () {
        function Tab(parser) {
            this.genAST = false; // generate parser tree generation code
            this.genRREBNF = false; //generate EBNF for railroad diagram
            this.genJS = false; //generate Javascript
            this.ignoreErrors = false; // ignore grammar errors for developing purposes
            this.ddt = new Array(10); // debug and test switches
            this.symtabs = new Array();
            this.nsName = null; // namespace for generated files
            this.checkEOF = true; // should coco generate a check for EOF at
            //---------------------------------------------------------------------
            //  Symbol list management
            //---------------------------------------------------------------------
            this.terminals = new Array();
            this.pragmas = new Array();
            this.nonterminals = new Array();
            this.tKind = ["fixedToken", "classToken", "litToken", "classLitToken"];
            //---------------------------------------------------------------------
            //  Syntax graph management
            //---------------------------------------------------------------------
            this.nodes = new Array();
            this.nTyp = ["    ", "t   ", "pr  ", "nt  ", "clas", "chr ", "wt  ", "any ", "eps ",
                "sync", "sem ", "alt ", "iter", "opt ", "rslv"];
            //---------------------------------------------------------------------
            //  Character class management
            //---------------------------------------------------------------------
            this.classes = new Array();
            this.dummyName = 65 /*'A'*/;
            this.parser = parser;
            this.trace = parser.trace;
            this.errors = parser.errors;
            this.eofSy = this.NewSym(Node.t, "EOF", 0, 0);
            this.dummyNode = this.NewNodeSym(Node.eps, null, 0, 0);
            this.literals = {}; //new Hashtable();
        }
        Tab.prototype.NewSym = function (typ, name, line, col) {
            if (name.length == 2 && name.charCodeAt(0) == 34 /*'"'*/) {
                this.parser.SemErr("empty token not allowed");
                name = "???";
            }
            var sym = new Symbol(typ, name, line, col);
            switch (typ) {
                case Node.t:
                    sym.n = this.terminals.length;
                    this.terminals.push(sym);
                    break;
                case Node.pr:
                    this.pragmas.push(sym);
                    break;
                case Node.nt:
                    sym.n = this.nonterminals.length;
                    this.nonterminals.push(sym);
                    break;
            }
            return sym;
        };
        Tab.prototype.FindSym = function (name) {
            for (var _i = 0, _a = this.terminals; _i < _a.length; _i++) {
                var s = _a[_i];
                if (s.name == name)
                    return s;
            }
            for (var _b = 0, _c = this.nonterminals; _b < _c.length; _b++) {
                var s = _c[_b];
                if (s.name == name)
                    return s;
            }
            return null;
        };
        Tab.prototype.FindSymtab = function (name) {
            for (var _i = 0, _a = this.symtabs; _i < _a.length; _i++) {
                var st = _a[_i];
                if (st.name == name)
                    return st;
            }
            return null;
        };
        Tab.prototype.FindLiteral = function (name) {
            if (this.literals.hasOwnProperty(name))
                return this.literals[name];
            return null;
        };
        Tab.prototype.Num = function (p) {
            if (p == null)
                return 0;
            else
                return p.n;
        };
        Tab.prototype.PrintSym = function (sym) {
            this.trace.Write(sprintf("%3d  %-14s %s", sym.n, this.Name(sym.name, 14), this.nTyp[sym.typ]));
            if (sym.attrPos == null)
                this.trace.Write("false ");
            else
                this.trace.Write("true  ");
            if (sym.retVar == null)
                this.trace.Write("false ");
            else
                this.trace.Write("true  ");
            if (sym.typ == Node.nt) {
                this.trace.Write(sprintf("%6d", this.Num(sym.graph)));
                if (sym.deletable)
                    this.trace.Write(" true  ");
                else
                    this.trace.Write(" false ");
            }
            else
                this.trace.Write("            ");
            this.trace.WriteLine(sprintf("%5d %s", sym.line, this.tKind[sym.tokenKind]));
        };
        Tab.prototype.PrintSymbolTable = function () {
            this.trace.WriteLine("Symbol Table:");
            this.trace.WriteLine("------------");
            this.trace.WriteLine();
            this.trace.WriteLine(" nr  name          typ  hasAt hasRet graph del    line tokenKind");
            for (var _i = 0, _a = this.terminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                this.PrintSym(sym);
            }
            for (var _b = 0, _c = this.pragmas; _b < _c.length; _b++) {
                var sym = _c[_b];
                this.PrintSym(sym);
            }
            for (var _d = 0, _e = this.nonterminals; _d < _e.length; _d++) {
                var sym = _e[_d];
                this.PrintSym(sym);
            }
            this.trace.WriteLine();
            this.trace.WriteLine("Literal Tokens:");
            this.trace.WriteLine("--------------");
            for (var k in this.literals) {
                if (this.literals.hasOwnProperty(k))
                    this.trace.WriteLine("_" + this.literals[k].name + " = " + k + ".");
            }
            this.trace.WriteLine();
        };
        Tab.prototype.PrintSet = function (s, indent) {
            var col, len;
            col = indent;
            for (var _i = 0, _a = this.terminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                if (s.Get(sym.n)) {
                    len = sym.name.length;
                    if (col + len >= 80) {
                        this.trace.WriteLine();
                        for (col = 1; col < indent; col++)
                            this.trace.Write(" ");
                    }
                    this.trace.Write(sym.name + " ");
                    col += len + 1;
                }
            }
            if (col == indent)
                this.trace.Write("-- empty set --");
            this.trace.WriteLine();
        };
        Tab.prototype.NewNodeSym = function (typ, sym, line, col) {
            var node = new Node(typ, sym, line, col);
            node.n = this.nodes.length;
            this.nodes.push(node);
            return node;
        };
        Tab.prototype.NewNodeNode = function (typ, sub) {
            var node = this.NewNodeSym(typ, null, sub.line, sub.col);
            node.sub = sub;
            return node;
        };
        Tab.prototype.NewNodeVal = function (typ, val, line, col) {
            var node = this.NewNodeSym(typ, null, line, col);
            node.val = val;
            return node;
        };
        Tab.prototype.MakeFirstAlt = function (g) {
            g.l = this.NewNodeNode(Node.alt, g.l);
            g.r.up = true;
            g.l.next = g.r;
            g.r = g.l;
        };
        // The result will be in g1
        Tab.prototype.MakeAlternative = function (g1, g2) {
            g2.l = this.NewNodeNode(Node.alt, g2.l);
            g2.l.up = true;
            g2.r.up = true;
            var p = g1.l;
            while (p.down != null)
                p = p.down;
            p.down = g2.l;
            p = g1.r;
            while (p.next != null)
                p = p.next;
            // append alternative to g1 end list
            p.next = g2.l;
            // append g2 end list to g1 end list
            g2.l.next = g2.r;
        };
        // The result will be in g1
        Tab.prototype.MakeSequence = function (g1, g2) {
            var p = g1.r.next;
            g1.r.next = g2.l; // link head node
            while (p != null) { // link substructure
                var q = p.next;
                p.next = g2.l;
                p = q;
            }
            g1.r = g2.r;
        };
        Tab.prototype.MakeOptionIter = function (g, typ) {
            g.l = this.NewNodeNode(typ, g.l);
            g.r.up = true;
        };
        Tab.prototype.MakeIteration = function (g) {
            this.MakeOptionIter(g, Node.iter);
            var p = g.r;
            g.r = g.l;
            while (p != null) {
                var q = p.next;
                p.next = g.l;
                p = q;
            }
        };
        Tab.prototype.MakeOption = function (g) {
            this.MakeOptionIter(g, Node.opt);
            g.l.next = g.r;
            g.r = g.l;
        };
        Tab.prototype.Finish = function (g) {
            var p = g.r;
            while (p != null) {
                var q = p.next;
                p.next = null;
                p = q;
            }
        };
        Tab.prototype.DeleteNodes = function () {
            this.nodes = new Array();
            this.dummyNode = this.NewNodeSym(Node.eps, null, 0, 0);
        };
        Tab.prototype.StrToGraph = function (str) {
            var s = this.Unstring(str);
            if (s.length == 0)
                this.parser.SemErr("empty token not allowed");
            var g = new Graph();
            g.r = this.dummyNode;
            for (var i = 0; i < s.length; i++) {
                var p = this.NewNodeVal(Node.chr, s.charCodeAt(i), 0, 0);
                g.r.next = p;
                g.r = p;
            }
            g.l = this.dummyNode.next;
            this.dummyNode.next = null;
            return g;
        };
        Tab.prototype.SetContextTrans = function (p) {
            while (p != null) {
                if (p.typ == Node.chr || p.typ == Node.clas) {
                    p.code = Node.contextTrans;
                }
                else if (p.typ == Node.opt || p.typ == Node.iter) {
                    this.SetContextTrans(p.sub);
                }
                else if (p.typ == Node.alt) {
                    this.SetContextTrans(p.sub);
                    this.SetContextTrans(p.down);
                }
                if (p.up)
                    break;
                p = p.next;
            }
        };
        //------------ graph deletability check -----------------
        Tab.DelGraph = function (p) {
            return p == null || this.DelNode(p) && this.DelGraph(p.next);
        };
        Tab.DelSubGraph = function (p) {
            return p == null || this.DelNode(p) && (p.up || this.DelSubGraph(p.next));
        };
        Tab.DelNode = function (p) {
            if (p.typ == Node.nt)
                return p.sym.deletable;
            else if (p.typ == Node.alt)
                return this.DelSubGraph(p.sub) || p.down != null && this.DelSubGraph(p.down);
            else
                return p.typ == Node.iter || p.typ == Node.opt || p.typ == Node.sem
                    || p.typ == Node.eps || p.typ == Node.rslv || p.typ == Node.sync;
        };
        //----------------- graph printing ----------------------
        Tab.prototype.Ptr = function (p, up) {
            var ptr = (p == null) ? "0" : p.n.toString();
            return (up && (ptr != "0")) ? ("-" + ptr) : ptr;
        };
        Tab.prototype.Pos = function (pos) {
            if (pos == null)
                return "     ";
            else
                return pos.beg.toString(); //StringFormat("{0,5}", pos.beg);
        };
        Tab.prototype.Name = function (name, size) {
            if (size === void 0) { size = 12; }
            return (name + "              ").substr(0, size);
            // found no simpler way to get the first 12 characters of the name
            // padded with blanks on the right
        };
        Tab.prototype.PrintNodes = function () {
            this.trace.WriteLine("Graph nodes:");
            this.trace.WriteLine("----------------------------------------------------------");
            this.trace.WriteLine("   n type name          next  down   sub   pos  line   col");
            this.trace.WriteLine("                               val  code");
            this.trace.WriteLine("----------------------------------------------------------");
            for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
                var p = _a[_i];
                this.trace.Write(sprintf("%4d %s ", p.n, this.nTyp[p.typ]));
                if (p.sym != null)
                    this.trace.Write(sprintf("%12s ", this.Name(p.sym.name)));
                else if (p.typ == Node.clas) {
                    var c = this.classes[p.val];
                    this.trace.Write(sprintf("%12s ", this.Name(c.name)));
                }
                else
                    this.trace.Write("             ");
                this.trace.Write(sprintf("%5s ", this.Ptr(p.next, p.up)));
                switch (p.typ) {
                    case Node.t:
                    case Node.nt:
                    case Node.wt:
                        this.trace.Write(sprintf("             %5d", this.Pos(p.pos)));
                        break;
                    case Node.chr:
                        this.trace.Write(sprintf("%5d %5d       ", p.val, p.code));
                        break;
                    case Node.clas:
                        this.trace.Write(sprintf("      %5d       ", p.code));
                        break;
                    case Node.alt:
                    case Node.iter:
                    case Node.opt:
                        this.trace.Write(sprintf("%5d %5d       ", this.Ptr(p.down, false), this.Ptr(p.sub, false)));
                        break;
                    case Node.sem:
                        this.trace.Write(sprintf("             %5d", this.Pos(p.pos)));
                        break;
                    case Node.eps:
                    case Node.any:
                    case Node.sync:
                    case Node.rslv:
                        this.trace.Write("                  ");
                        break;
                    default:
                        this.trace.Write("                 ?");
                        break;
                }
                this.trace.WriteLine(sprintf("%5d %5d", p.line, p.col));
            }
            this.trace.WriteLine();
        };
        Tab.prototype.NewCharClass = function (name, s) {
            if (name == "#") {
                name = "#" + String.fromCharCode(this.dummyName);
                ++this.dummyName;
            }
            var c = new CharClass(name, s);
            c.n = this.classes.length;
            this.classes.push(c);
            return c;
        };
        Tab.prototype.FindCharClassByName = function (name) {
            for (var _i = 0, _a = this.classes; _i < _a.length; _i++) {
                var c = _a[_i];
                if (c.name == name)
                    return c;
            }
            return null;
        };
        Tab.prototype.FindCharClass = function (s) {
            for (var _i = 0, _a = this.classes; _i < _a.length; _i++) {
                var c = _a[_i];
                if (s.Equals(c.set))
                    return c;
            }
            return null;
        };
        Tab.prototype.CharClassSet = function (i) {
            return this.classes[i].set;
        };
        //----------- character class printing
        Tab.prototype.Ch = function (ch) {
            if (ch < 32 /*' '*/ || ch >= 127 || ch == 92 /*'\''*/ || ch == 92 /*'\\'*/)
                return ch.toString();
            else
                return "'".concat(String.fromCharCode(ch), "'"); //StringFormat("'{0}'", ch);
        };
        Tab.prototype.WriteCharSet = function (s) {
            for (var r = s.head; r != null; r = r.next)
                if (r.rfrom < r.rto) {
                    this.trace.Write(this.Ch(r.rfrom) + ".." + this.Ch(r.rto) + " ");
                }
                else {
                    this.trace.Write(this.Ch(r.rfrom) + " ");
                }
        };
        Tab.prototype.WriteCharClasses = function () {
            for (var _i = 0, _a = this.classes; _i < _a.length; _i++) {
                var c = _a[_i];
                this.trace.Write(sprintf("%-10s: ", c.name));
                this.WriteCharSet(c.set);
                this.trace.WriteLine();
            }
            this.trace.WriteLine();
        };
        //---------------------------------------------------------------------
        //  Symbol set computations
        //---------------------------------------------------------------------
        /* Computes the first set for the graph rooted at p */
        Tab.prototype.First0 = function (p, mark) {
            var fs = new BitArray(this.terminals.length);
            while (p != null && !mark.Get(p.n)) {
                mark.Set(p.n, true);
                switch (p.typ) {
                    case Node.nt: {
                        if (p.sym.firstReady)
                            fs.Or(p.sym.first);
                        else
                            fs.Or(this.First0(p.sym.graph, mark));
                        break;
                    }
                    case Node.t:
                    case Node.wt: {
                        fs.Set(p.sym.n, true);
                        break;
                    }
                    case Node.any: {
                        fs.Or(p.set);
                        break;
                    }
                    case Node.alt: {
                        fs.Or(this.First0(p.sub, mark));
                        fs.Or(this.First0(p.down, mark));
                        break;
                    }
                    case Node.iter:
                    case Node.opt: {
                        fs.Or(this.First0(p.sub, mark));
                        break;
                    }
                }
                if (!Tab.DelNode(p))
                    break;
                p = p.next;
            }
            return fs;
        };
        Tab.prototype.First = function (p) {
            var fs = this.First0(p, new BitArray(this.nodes.length));
            if (this.ddt[3]) {
                this.trace.WriteLine();
                if (p != null)
                    this.trace.Write(sprintf("First: node = %d\tline = %d\tcol = %d\ttype = %s\t%s\n", p.n, p.line, p.col, this.nTyp[p.typ], (p.sym != null) ? p.sym.name : ""));
                else
                    this.trace.WriteLine("First: node = null");
                this.trace.Write("         ");
                this.PrintSet(fs, 10);
            }
            return fs;
        };
        Tab.prototype.CompFirstSets = function () {
            for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                sym.first = new BitArray(this.terminals.length);
                sym.firstReady = false;
            }
            var doTrace = this.ddt[3];
            if (doTrace)
                this.trace.WriteLine("Computing First Sets: " + this.nonterminals.length);
            for (var _b = 0, _c = this.nonterminals; _b < _c.length; _b++) {
                var sym = _c[_b];
                if (doTrace)
                    this.trace.Write(sprintf("\nSymbol: %s %d:%d", sym.name, sym.line, sym.col));
                sym.first = this.First(sym.graph);
                sym.firstReady = true;
            }
        };
        Tab.prototype.CompFollow = function (p) {
            while (p != null && !this.visited.Get(p.n)) {
                this.visited.Set(p.n, true);
                if (p.typ == Node.nt) {
                    var s = this.First(p.next);
                    p.sym.follow.Or(s);
                    if (Tab.DelGraph(p.next))
                        p.sym.nts.Set(this.curSy.n, true);
                }
                else if (p.typ == Node.opt || p.typ == Node.iter) {
                    this.CompFollow(p.sub);
                }
                else if (p.typ == Node.alt) {
                    this.CompFollow(p.sub);
                    this.CompFollow(p.down);
                }
                p = p.next;
            }
        };
        Tab.prototype.Complete = function (sym) {
            if (!this.visited.Get(sym.n)) {
                this.visited.Set(sym.n, true);
                for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                    var s = _a[_i];
                    if (sym.nts.Get(s.n)) {
                        this.Complete(s);
                        sym.follow.Or(s.follow);
                        if (sym == this.curSy)
                            sym.nts.Set(s.n, false);
                    }
                }
            }
        };
        Tab.prototype.CompFollowSets = function () {
            for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                sym.follow = new BitArray(this.terminals.length);
                sym.nts = new BitArray(this.nonterminals.length);
            }
            this.gramSy.follow.Set(this.eofSy.n, true);
            this.visited = new BitArray(this.nodes.length);
            for (var _b = 0, _c = this.nonterminals; _b < _c.length; _b++) { // get direct successors of nonterminals
                var sym = _c[_b];
                this.curSy = sym;
                this.CompFollow(sym.graph);
            }
            for (var _d = 0, _e = this.nonterminals; _d < _e.length; _d++) { // add indirect successors to followers
                var sym = _e[_d];
                this.visited = new BitArray(this.nonterminals.length);
                this.curSy = sym;
                this.Complete(sym);
            }
        };
        Tab.prototype.LeadingAny = function (p) {
            if (p == null)
                return null;
            var a = null;
            if (p.typ == Node.any)
                a = p;
            else if (p.typ == Node.alt) {
                a = this.LeadingAny(p.sub);
                if (a == null)
                    a = this.LeadingAny(p.down);
            }
            else if (p.typ == Node.opt || p.typ == Node.iter)
                a = this.LeadingAny(p.sub);
            if (a == null && Tab.DelNode(p) && !p.up)
                a = this.LeadingAny(p.next);
            return a;
        };
        Tab.prototype.FindAS = function (p) {
            var a;
            while (p != null) {
                if (p.typ == Node.opt || p.typ == Node.iter) {
                    this.FindAS(p.sub);
                    a = this.LeadingAny(p.sub);
                    if (a != null)
                        Sets.Subtract(a.set, this.First(p.next));
                }
                else if (p.typ == Node.alt) {
                    var s1 = new BitArray(this.terminals.length);
                    var q = p;
                    while (q != null) {
                        this.FindAS(q.sub);
                        a = this.LeadingAny(q.sub);
                        if (a != null)
                            Sets.Subtract(a.set, this.First(q.down).Or(s1));
                        else
                            s1.Or(this.First(q.sub));
                        q = q.down;
                    }
                }
                // Remove alternative terminals before ANY, in the following
                // examples a and b must be removed from the ANY set:
                // [a] ANY, or {a|b} ANY, or [a][b] ANY, or (a|) ANY, or
                // A = [a]. A ANY
                if (Tab.DelNode(p)) {
                    a = this.LeadingAny(p.next);
                    if (a != null) {
                        var q = (p.typ == Node.nt) ? p.sym.graph : p.sub;
                        Sets.Subtract(a.set, this.First(q));
                    }
                }
                if (p.up)
                    break;
                p = p.next;
            }
        };
        Tab.prototype.CompAnySets = function () {
            for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                this.FindAS(sym.graph);
            }
        };
        Tab.prototype.Expected = function (p, curSy) {
            var s = this.First(p);
            if (Tab.DelGraph(p))
                s.Or(curSy.follow);
            return s;
        };
        // does not look behind resolvers; only called during LL(1) test and in CheckRes
        Tab.prototype.Expected0 = function (p, curSy) {
            if (p.typ == Node.rslv)
                return new BitArray(this.terminals.length);
            else
                return this.Expected(p, curSy);
        };
        Tab.prototype.CompSync = function (p) {
            while (p != null && !this.visited.Get(p.n)) {
                this.visited.Set(p.n, true);
                if (p.typ == Node.sync) {
                    var s = this.Expected(p.next, this.curSy);
                    s.Set(this.eofSy.n, true);
                    this.allSyncSets.Or(s);
                    p.set = s;
                }
                else if (p.typ == Node.alt) {
                    this.CompSync(p.sub);
                    this.CompSync(p.down);
                }
                else if (p.typ == Node.opt || p.typ == Node.iter)
                    this.CompSync(p.sub);
                p = p.next;
            }
        };
        Tab.prototype.CompSyncSets = function () {
            this.allSyncSets = new BitArray(this.terminals.length);
            this.allSyncSets.Set(this.eofSy.n, true);
            this.visited = new BitArray(this.nodes.length);
            for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                this.curSy = sym;
                this.CompSync(this.curSy.graph);
            }
        };
        Tab.prototype.SetupAnys = function () {
            for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
                var p = _a[_i];
                if (p.typ == Node.any) {
                    p.set = new BitArray(this.terminals.length, true);
                    p.set.Set(this.eofSy.n, false);
                }
            }
        };
        Tab.prototype.CompDeletableSymbols = function () {
            var changed;
            do {
                changed = false;
                for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                    var sym = _a[_i];
                    if (!sym.deletable && sym.graph != null && Tab.DelGraph(sym.graph)) {
                        sym.deletable = true;
                        changed = true;
                    }
                }
            } while (changed);
            for (var _b = 0, _c = this.nonterminals; _b < _c.length; _b++) {
                var sym = _c[_b];
                if (sym.deletable)
                    this.errors.WarningStr(sprintf("  at:%d:%d %s deletable", sym.line, sym.col, sym.name));
            }
        };
        Tab.prototype.RenumberPragmas = function () {
            var n = this.terminals.length;
            for (var _i = 0, _a = this.pragmas; _i < _a.length; _i++) {
                var sym = _a[_i];
                sym.n = n++;
            }
        };
        Tab.prototype.CompSymbolSets = function () {
            this.CompDeletableSymbols();
            this.CompFirstSets();
            this.CompAnySets();
            this.CompFollowSets();
            this.CompSyncSets();
            if (this.ddt[1]) {
                this.trace.WriteLine();
                this.trace.WriteLine("First & follow symbols:");
                this.trace.WriteLine("----------------------");
                this.trace.WriteLine();
                for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                    var sym = _a[_i];
                    this.trace.WriteLine(sprintf("%s -> line: %d", sym.name, sym.line));
                    this.trace.Write("first:   ");
                    this.PrintSet(sym.first, 10);
                    this.trace.Write("follow:  ");
                    this.PrintSet(sym.follow, 10);
                    this.trace.WriteLine();
                }
            }
            if (this.ddt[4]) {
                this.trace.WriteLine();
                this.trace.WriteLine("ANY and SYNC sets:");
                this.trace.WriteLine("-----------------");
                for (var _b = 0, _c = this.nodes; _b < _c.length; _b++) {
                    var p = _c[_b];
                    if (p.typ == Node.any || p.typ == Node.sync) {
                        this.trace.WriteLine(sprintf("Node: %4d %4s: Line: %4d", p.n, this.nTyp[p.typ], p.line));
                        this.trace.Write("         ");
                        this.PrintSet(p.set, 10);
                    }
                }
            }
        };
        //---------------------------------------------------------------------
        //  String handling
        //---------------------------------------------------------------------
        Tab.prototype.Hex2Char = function (s) {
            var val = 0;
            for (var i = 0; i < s.length; i++) {
                var ch = s.charCodeAt(i);
                if (48 /*'0'*/ <= ch && ch <= 57 /*'9'*/)
                    val = 16 * val + (ch - 48 /*'0'*/);
                else if (97 /*'a'*/ <= ch && ch <= 102 /*'f'*/)
                    val = 16 * val + (10 + ch - 97 /*'a'*/);
                else if (65 /*'A'*/ <= ch && ch <= 70 /*'F'*/)
                    val = 16 * val + (10 + ch - 65 /*'A'*/);
                else
                    this.parser.SemErr("bad escape sequence in string or character");
            }
            if (val > Char_MaxValue) /* pdt */
                this.parser.SemErr("bad escape sequence in string or character");
            return val;
        };
        Tab.prototype.Char2Hex = function (ch) {
            // let w : StringWriter = new StringWriter();
            //w.Write("\\u{0:x4}", (int)ch);
            return "\\u".concat(ch.toString(16)); //w.ToString();
        };
        Tab.prototype.Unstring = function (s) {
            if (s == null || s.length < 2)
                return s;
            return this.Unescape(s.substr(1, s.length - 2));
        };
        Tab.prototype.Unescape = function (s) {
            /* replaces escape sequences in s by their Unicode values. */
            var buf = new StringBuilder();
            var i = 0;
            while (i < s.length) {
                if (s.charCodeAt(i) == 92 /*'\\'*/) {
                    switch (s.charCodeAt(i + 1)) {
                        case 92 /*'\\'*/:
                            buf.Append("\\" /*'\\'*/);
                            i += 2;
                            break;
                        case 39 /*'\''*/:
                            buf.Append("'" /*'\''*/);
                            i += 2;
                            break;
                        case 34 /*'\"'*/:
                            buf.Append("\"" /*'\"'*/);
                            i += 2;
                            break;
                        case 114 /*'r'*/:
                            buf.Append("\r" /*'\r'*/);
                            i += 2;
                            break;
                        case 110 /*'n'*/:
                            buf.Append("\n" /*'\n'*/);
                            i += 2;
                            break;
                        case 116 /*'t'*/:
                            buf.Append("\t" /*'\t'*/);
                            i += 2;
                            break;
                        case 48 /*'0'*/:
                            buf.Append("\0" /*'\0'*/);
                            i += 2;
                            break;
                        case 97 /*'a'*/:
                            buf.Append("\a" /*'\a'*/);
                            i += 2;
                            break;
                        case 98 /*'b'*/:
                            buf.Append("\b" /*'\b'*/);
                            i += 2;
                            break;
                        case 102 /*'f'*/:
                            buf.Append("\f" /*'\f'*/);
                            i += 2;
                            break;
                        case 118 /*'v'*/:
                            buf.Append("\v" /*'\v'*/);
                            i += 2;
                            break;
                        case 117 /*'u'*/:
                        case 120 /*'x'*/:
                            if (i + 6 <= s.length) {
                                buf.Append(String.fromCharCode(this.Hex2Char(s.substr(i + 2, 4))));
                                i += 6;
                                break;
                            }
                            else {
                                this.parser.SemErr("bad escape sequence in string or character");
                                i = s.length;
                                break;
                            }
                        default:
                            this.parser.SemErr("bad escape sequence in string or character");
                            i += 2;
                            break;
                    }
                }
                else {
                    buf.Append(s[i]);
                    i++;
                }
            }
            return buf.ToString();
        };
        Tab.prototype.Quoted = function (s) {
            if (s == null)
                return "null";
            return "\"" + this.Escape(s) + "\"";
        };
        Tab.prototype.Escape = function (s) {
            var buf = new StringBuilder();
            for (var _i = 0, s_1 = s; _i < s_1.length; _i++) {
                var ch = s_1[_i];
                switch (ch) {
                    case "\\":
                        buf.Append("\\\\");
                        break;
                    case "'":
                        buf.Append("\\'");
                        break;
                    case "\"":
                        buf.Append("\\\"");
                        break;
                    case "\t":
                        buf.Append("\\t");
                        break;
                    case "\r":
                        buf.Append("\\r");
                        break;
                    case "\n":
                        buf.Append("\\n");
                        break;
                    default:
                        if (ch < " " || ch > "\u007f")
                            buf.Append(this.Char2Hex(ch.charCodeAt(0)));
                        else
                            buf.Append(ch);
                        break;
                }
            }
            return buf.ToString();
        };
        //---------------------------------------------------------------------
        //  Grammar checks
        //---------------------------------------------------------------------
        Tab.prototype.GrammarOk = function () {
            var ok = this.NtsComplete()
                && this.AllNtReached()
                && this.NoCircularProductions()
                && this.AllNtToTerm();
            if (ok) {
                this.CheckResolvers();
                this.CheckLL1();
            }
            return ok;
        };
        Tab.prototype.GrammarCheckAll = function () {
            var errors = 0;
            if (!this.NtsComplete())
                ++errors;
            if (!this.AllNtReached())
                ++errors;
            if (!this.NoCircularProductions())
                throw "CircularProductions found."; //System.Environment.Exit(1);
            if (!this.AllNtToTerm())
                ++errors;
            this.CheckResolvers();
            this.CheckLL1();
            return errors == 0;
        };
        //--------------- check for circular productions ----------------------
        Tab.prototype.GetSingles = function (p, singles) {
            if (p == null)
                return; // end of graph
            if (p.typ == Node.nt) {
                singles.push(p.sym);
            }
            else if (p.typ == Node.alt || p.typ == Node.iter || p.typ == Node.opt) {
                if (p.up || Tab.DelGraph(p.next)) {
                    this.GetSingles(p.sub, singles);
                    if (p.typ == Node.alt)
                        this.GetSingles(p.down, singles);
                }
            }
            if (!p.up && Tab.DelNode(p))
                this.GetSingles(p.next, singles);
        };
        Tab.prototype.NoCircularProductions = function () {
            var ok, changed, onLeftSide, onRightSide;
            var list = new Array();
            for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                var singles = new Array();
                this.GetSingles(sym.graph, singles); // get nonterminals s such that sym-->s
                for (var _b = 0, singles_1 = singles; _b < singles_1.length; _b++) {
                    var s = singles_1[_b];
                    list.push(new TabCNode(sym, s));
                }
            }
            do {
                changed = false;
                for (var i = 0; i < list.length; i++) {
                    var n = list[i];
                    onLeftSide = false;
                    onRightSide = false;
                    for (var _c = 0, list_1 = list; _c < list_1.length; _c++) {
                        var m = list_1[_c];
                        if (n.left == m.right)
                            onRightSide = true;
                        if (n.right == m.left)
                            onLeftSide = true;
                    }
                    if (!onLeftSide || !onRightSide) {
                        list.splice(i, 1);
                        i--;
                        changed = true;
                    }
                }
            } while (changed);
            ok = true;
            for (var _d = 0, list_2 = list; _d < list_2.length; _d++) {
                var n = list_2[_d];
                ok = false;
                this.errors.SemErr(sprintf("  Left recursion from:%d:%d %s --> to:%d:%d %s", n.left.line, n.left.col, n.left.name, n.right.line, n.right.col, n.right.name));
            }
            return ok;
        };
        //--------------- check for LL(1) errors ----------------------
        Tab.prototype.LL1Error = function (cond, sym) {
            var s = "  LL1 warning in " + this.curSy.name + ":" + this.curSy.line + ":" + this.curSy.col + ": ";
            if (sym != null)
                s += sym.name + " is ";
            switch (cond) {
                case 1:
                    s += "start of several alternatives";
                    break;
                case 2:
                    s += "start & successor of deletable structure";
                    break;
                case 3:
                    s += "an ANY node that matches no symbol";
                    break;
                case 4:
                    s += "contents of [...] or {...} must not be deletable";
                    break;
            }
            this.errors.WarningStr(s);
        };
        Tab.prototype.CheckOverlap = function (s1, s2, cond) {
            var overlaped = 0;
            for (var _i = 0, _a = this.terminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                if (s1.Get(sym.n) && s2.Get(sym.n)) {
                    this.LL1Error(cond, sym);
                    ++overlaped;
                }
            }
            return overlaped;
        };
        /* print the path for first set that contains token tok for the graph rooted at p */
        Tab.prototype.PrintFirstPath = function (p, tok, indent, depth) {
            if (indent === void 0) { indent = "\t"; }
            if (depth === void 0) { depth = 0; }
            //if(p && p.sym) Console.WriteLine("{0}==> {1}:{2}:{3}: {4}", indent, p.sym.name, p.sym.line, p.sym.col, depth);
            //else Console.WriteLine("{0}==> xxx:{0}", indent, depth);
            while (p != null) {
                //if(p.sym) Console.WriteLine("{0}----> {1}:{2}:{3}: {4}", indent, p.sym.name, p.sym.line, p.sym.col, depth);
                switch (p.typ) {
                    case Node.nt:
                        {
                            if (p.sym.firstReady) {
                                if (p.sym.first.Get(tok)) {
                                    if (indent.length == 1)
                                        this.parser.log("".concat(indent, "=> ").concat(p.sym.name, ":").concat(p.line, ":").concat(p.col, ":"));
                                    this.parser.log("".concat(indent, "-> ").concat(p.sym.name, ":").concat(p.sym.line, ":").concat(p.sym.col, ":"));
                                    if (p.sym.graph != null)
                                        this.PrintFirstPath(p.sym.graph, tok, indent + "  ", depth + 1);
                                    return;
                                }
                            }
                            break;
                        }
                    case Node.t:
                    case Node.wt:
                        {
                            if (p.sym.n == tok)
                                this.parser.log("".concat(indent, "= ").concat(p.sym.name, ":").concat(p.line, ":").concat(p.col, ":"));
                            break;
                        }
                    case Node.any:
                        {
                            break;
                        }
                    case Node.alt:
                        {
                            this.PrintFirstPath(p.sub, tok, indent, depth + 1);
                            this.PrintFirstPath(p.down, tok, indent, depth + 1);
                            break;
                        }
                    case Node.iter:
                    case Node.opt:
                        {
                            if (!Tab.DelNode(p.sub)) //prevent endless loop with some ill grammars
                                this.PrintFirstPath(p.sub, tok, indent, depth + 1);
                            break;
                        }
                }
                if (!Tab.DelNode(p))
                    break;
                p = p.next;
            }
        };
        Tab.prototype.CheckAlts = function (p) {
            var s1, s2;
            var rc = 0;
            while (p != null) {
                if (p.typ == Node.alt) {
                    var q = p;
                    s1 = new BitArray(this.terminals.length);
                    while (q != null) { // for all alternatives
                        s2 = this.Expected0(q.sub, this.curSy);
                        var overlaped = this.CheckOverlap(s1, s2, 1);
                        if (overlaped > 0) {
                            var overlapToken = 0;
                            /* Find the first overlap token */
                            for (var _i = 0, _a = this.terminals; _i < _a.length; _i++) {
                                var sym = _a[_i];
                                if (s1.Get(sym.n) && s2.Get(sym.n)) {
                                    overlapToken = sym.n;
                                    break;
                                }
                            }
                            //Console.WriteLine("\t-> {0}:{1}: {2}", first_overlap.sub.sym.name, first_overlap.sub.sym.line, overlaped);
                            this.PrintFirstPath(p, overlapToken);
                            rc += overlaped;
                        }
                        s1.Or(s2);
                        this.CheckAlts(q.sub);
                        q = q.down;
                    }
                }
                else if (p.typ == Node.opt || p.typ == Node.iter) {
                    if (Tab.DelSubGraph(p.sub))
                        this.LL1Error(4, null); // e.g. [[...]]
                    else {
                        s1 = this.Expected0(p.sub, this.curSy);
                        s2 = this.Expected(p.next, this.curSy);
                        var overlaped = this.CheckOverlap(s1, s2, 2);
                        if (overlaped > 0) {
                            var overlapToken = 0;
                            /* Find the first overlap token */
                            for (var _b = 0, _c = this.terminals; _b < _c.length; _b++) {
                                var sym = _c[_b];
                                if (s1.Get(sym.n) && s2.Get(sym.n)) {
                                    overlapToken = sym.n;
                                    break;
                                }
                            }
                            //Console.WriteLine(format("\t=>:{0}: {1}", p.line, overlaped));
                            this.PrintFirstPath(p, overlapToken);
                            rc += overlaped;
                        }
                    }
                    this.CheckAlts(p.sub);
                }
                else if (p.typ == Node.any) {
                    if (Sets.Elements(p.set) == 0)
                        this.LL1Error(3, null);
                    // e.g. {ANY} ANY or [ANY] ANY or ( ANY | ANY )
                }
                if (p.up)
                    break;
                p = p.next;
            }
            return rc;
        };
        Tab.prototype.CheckLL1 = function () {
            for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                this.curSy = sym;
                this.CheckAlts(this.curSy.graph);
            }
        };
        //------------- check if resolvers are legal  --------------------
        Tab.prototype.ResErr = function (p, msg) {
            this.errors.Warning(p.line, p.col, msg);
        };
        Tab.prototype.CheckRes = function (p, rslvAllowed) {
            while (p != null) {
                switch (p.typ) {
                    case Node.alt:
                        var expected = new BitArray(this.terminals.length);
                        for (var q = p; q != null; q = q.down)
                            expected.Or(this.Expected0(q.sub, this.curSy));
                        var soFar = new BitArray(this.terminals.length);
                        for (var q = p; q != null; q = q.down) {
                            if (q.sub.typ == Node.rslv) {
                                var fs = this.Expected(q.sub.next, this.curSy);
                                if (Sets.Intersect(fs, soFar))
                                    this.ResErr(q.sub, "Warning: Resolver will never be evaluated. " +
                                        "Place it at previous conflicting alternative.");
                                if (!Sets.Intersect(fs, expected))
                                    this.ResErr(q.sub, "Warning: Misplaced resolver: no LL(1) conflict.");
                            }
                            else
                                soFar.Or(this.Expected(q.sub, this.curSy));
                            this.CheckRes(q.sub, true);
                        }
                        break;
                    case Node.iter:
                    case Node.opt:
                        if (p.sub.typ == Node.rslv) {
                            var fs = this.First(p.sub.next);
                            var fsNext = this.Expected(p.next, this.curSy);
                            if (!Sets.Intersect(fs, fsNext))
                                this.ResErr(p.sub, "Warning: Misplaced resolver: no LL(1) conflict.");
                        }
                        this.CheckRes(p.sub, true);
                        break;
                    case Node.rslv:
                        if (!rslvAllowed)
                            this.ResErr(p, "Warning: Misplaced resolver: no alternative.");
                        break;
                }
                if (p.up)
                    break;
                p = p.next;
                rslvAllowed = false;
            }
        };
        Tab.prototype.CheckResolvers = function () {
            for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                this.curSy = sym;
                this.CheckRes(this.curSy.graph, false);
            }
        };
        //------------- check if every nts has a production --------------------
        Tab.prototype.NtsComplete = function () {
            var complete = true;
            for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                if (sym.graph == null) {
                    complete = false;
                    this.errors.SemErr(sprintf("  at:%d:%d No production for %s", sym.line, sym.col, sym.name));
                }
            }
            return complete;
        };
        //-------------- check if every nts can be reached  -----------------
        Tab.prototype.MarkReachedNts = function (p) {
            while (p != null) {
                if (p.typ == Node.nt && !this.visited.Get(p.sym.n)) { // new nt reached
                    this.visited.Set(p.sym.n, true);
                    this.MarkReachedNts(p.sym.graph);
                }
                else if (p.typ == Node.alt || p.typ == Node.iter || p.typ == Node.opt) {
                    this.MarkReachedNts(p.sub);
                    if (p.typ == Node.alt)
                        this.MarkReachedNts(p.down);
                }
                if (p.up)
                    break;
                p = p.next;
            }
        };
        Tab.prototype.AllNtReached = function () {
            var ok = true;
            this.visited = new BitArray(this.nonterminals.length);
            this.visited.Set(this.gramSy.n, true);
            this.MarkReachedNts(this.gramSy.graph);
            for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                if (!this.visited.Get(sym.n)) {
                    ok = false;
                    this.errors.WarningStr(sprintf("  at:%d:%d %s cannot be reached", sym.line, sym.col, sym.name));
                }
            }
            return ok;
        };
        //--------- check if every nts can be derived to terminals  ------------
        Tab.prototype.IsTerm = function (p, mark) {
            while (p != null) {
                if (p.typ == Node.nt && !mark.Get(p.sym.n))
                    return false;
                if (p.typ == Node.alt && !this.IsTerm(p.sub, mark)
                    && (p.down == null || !this.IsTerm(p.down, mark)))
                    return false;
                if (p.up)
                    break;
                p = p.next;
            }
            return true;
        };
        Tab.prototype.AllNtToTerm = function () {
            var changed, ok = true;
            var mark = new BitArray(this.nonterminals.length);
            // a nonterminal is marked if it can be derived to terminal symbols
            do {
                changed = false;
                for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                    var sym = _a[_i];
                    if (!mark.Get(sym.n) && this.IsTerm(sym.graph, mark)) {
                        mark.Set(sym.n, true);
                        changed = true;
                    }
                }
            } while (changed);
            for (var _b = 0, _c = this.nonterminals; _b < _c.length; _b++) {
                var sym = _c[_b];
                if (!mark.Get(sym.n)) {
                    ok = false;
                    this.errors.SemErr("  " + sym.name + " cannot be derived to terminals");
                }
            }
            return ok;
        };
        //---------------------------------------------------------------------
        //  Cross reference list
        //---------------------------------------------------------------------
        Tab.prototype.XRef = function () {
            var xref = {}; //let xref : SortedList = new SortedList(new SymbolComp());
            var xref_sorted = [];
            // collect lines where symbols have been defined
            for (var _i = 0, _a = this.nonterminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                var list = xref[sym.name];
                if (list == null) {
                    list = new Array();
                    xref_sorted.push(sym);
                    xref[sym.name] = list;
                }
                list.push(-sym.line);
            }
            // collect lines where symbols have been referenced
            for (var _b = 0, _c = this.nodes; _b < _c.length; _b++) {
                var n = _c[_b];
                if (n.typ == Node.t || n.typ == Node.wt || n.typ == Node.nt) {
                    var list = xref[n.sym.name];
                    if (list == null) {
                        list = new Array();
                        xref_sorted.push(n.sym);
                        xref[n.sym.name] = list;
                    }
                    list.push(n.line);
                }
            }
            xref_sorted.sort(function (a, b) {
                //var nameA = a.name.toLowerCase(); // ignore upper and lowercase
                //var nameB = b.name.toLowerCase(); // ignore upper and lowercase
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                // names must be equal
                return 0;
            });
            // print cross reference list
            this.trace.WriteLine();
            this.trace.WriteLine("Cross reference list:");
            this.trace.WriteLine("--------------------");
            this.trace.WriteLine();
            for (var _d = 0, xref_sorted_1 = xref_sorted; _d < xref_sorted_1.length; _d++) {
                var sym = xref_sorted_1[_d];
                this.trace.Write(sprintf("  %12s", this.Name(sym.name)));
                var list = xref[sym.name];
                var col = 14;
                for (var _e = 0, list_3 = list; _e < list_3.length; _e++) {
                    var line = list_3[_e];
                    if (col + 5 > 80) {
                        this.trace.WriteLine();
                        for (col = 1; col <= 14; col++)
                            this.trace.Write(" ");
                    }
                    this.trace.Write(sprintf("%5d", line));
                    col += 5;
                }
                this.trace.WriteLine();
            }
            this.trace.WriteLine();
            this.trace.WriteLine();
        };
        Tab.prototype.SetDDT = function (s) {
            s = s.toUpperCase();
            for (var _i = 0, s_2 = s; _i < s_2.length; _i++) {
                var ch = s_2[_i];
                if ("0" <= ch && ch <= "9")
                    this.ddt[Number(ch)] = true;
                else
                    switch (ch) {
                        case "A":
                            this.ddt[0] = true;
                            break; // trace automaton
                        case "F":
                            this.ddt[1] = true;
                            break; // list first/follow sets
                        case "G":
                            this.ddt[2] = true;
                            break; // print syntax graph
                        case "I":
                            this.ddt[3] = true;
                            break; // trace computation of first sets
                        case "J":
                            this.ddt[4] = true;
                            break; // print ANY and SYNC sets
                        case "P":
                            this.ddt[8] = true;
                            break; // print statistics
                        case "S":
                            this.ddt[6] = true;
                            break; // list symbol table
                        case "X":
                            this.ddt[7] = true;
                            break; // list cross reference table
                        default: break;
                    }
            }
        };
        Tab.prototype.SetOption = function (s) {
            var option = s.split("=", 2);
            var name = option[0], value = option[1];
            if ("$namespace" == name) {
                if (this.nsName == null)
                    this.nsName = value;
            }
            else if ("$checkEOF" == name) {
                this.checkEOF = "true" == value;
            }
        };
        return Tab;
    }()); // end Tab
    CocoR.Tab = Tab;
    var ParserGen = /** @class */ (function () {
        function ParserGen(parser) {
            this.symSet = new Array();
            this.writeBufferTo = null;
            this.tab = parser.tab;
            this.errors = parser.errors;
            this.trace = parser.trace;
            this.buffer = parser.scanner.buffer;
            this.dfa = parser.dfa;
            this.errorNr = -1;
            this.usingPos = null;
            this.langGen = this.tab.genJS ? "js" : "ts";
        }
        ParserGen.prototype.Indent = function (n) {
            for (var i = 1; i <= n; i++)
                this.gen.Write("\t");
        };
        ParserGen.prototype.Overlaps = function (s1, s2) {
            var len = s1.Count();
            for (var i = 0; i < len; ++i) {
                if (s1.Get(i) && s2.Get(i)) {
                    return true;
                }
            }
            return false;
        };
        ParserGen.prototype.WriteSymbolOrCode = function (sym) {
            if (!CharIsLetter(sym.name.charCodeAt(0))) {
                this.gen.Write(sym.n + " /* " + sym.name + " */");
            }
            else {
                this.gen.Write("Parser._" + sym.name);
            }
        };
        // use a switch if more than 5 alternatives and none starts with a resolver, and no LL1 warning
        ParserGen.prototype.UseSwitch = function (p) {
            var s1, s2;
            if (p.typ != Node.alt)
                return false;
            var nAlts = 0;
            s1 = new BitArray(this.tab.terminals.length);
            var p2 = p;
            while (p2 != null) {
                s2 = this.tab.Expected0(p2.sub, this.curSy);
                // must not optimize with switch statement, if there are ll1 warnings
                if (this.Overlaps(s1, s2)) {
                    return false;
                }
                s1.Or(s2);
                ++nAlts;
                // must not optimize with switch-statement, if alt uses a resolver expression
                if (p2.sub.typ == Node.rslv)
                    return false;
                p2 = p2.down;
            }
            return nAlts > 5;
        };
        ParserGen.prototype.CopySourcePart = function (pos, indent) {
            // Copy text described by pos from atg to gen
            var ch, i;
            if (pos != null) {
                this.buffer.setPos(pos.beg);
                ch = this.buffer.Read();
                if (this.tab.emitLines) {
                    this.gen.WriteLine();
                    this.gen.WriteLine("//line " + pos.line + " \"" + this.tab.srcName + "\"");
                }
                this.Indent(indent);
                var done = false;
                while (this.buffer.getPos() <= pos.end) {
                    while (ch == ParserGen.CR || ch == ParserGen.LF) { // eol is either CR or CRLF or LF
                        this.gen.WriteLine();
                        this.Indent(indent);
                        if (ch == ParserGen.CR)
                            ch = this.buffer.Read(); // skip CR
                        if (ch == ParserGen.LF)
                            ch = this.buffer.Read(); // skip LF
                        for (i = 1; i <= pos.col && (ch == 32 /*' '*/ || ch == 9 /*'\t'*/); i++) {
                            // skip blanks at beginning of line
                            ch = this.buffer.Read();
                        }
                        if (this.buffer.getPos() > pos.end) {
                            done = true;
                            break;
                        }
                    }
                    if (done)
                        break;
                    this.gen.Write(String.fromCharCode(ch));
                    ch = this.buffer.Read();
                }
                if (indent > 0)
                    this.gen.WriteLine();
            }
        };
        /* TODO better interface for CopySourcePart */
        ParserGen.prototype.CopySourcePartPPG = function (parser, gen, pos, indent) {
            // Copy text described by pos from atg to gen
            var oldPos = parser.pgen.buffer.getPos(); // Pos is modified by CopySourcePart
            var prevGen = parser.pgen.gen;
            parser.pgen.gen = this.gen;
            parser.pgen.CopySourcePart(pos, 0);
            parser.pgen.gen = prevGen;
            parser.pgen.buffer.setPos(oldPos);
        };
        ParserGen.prototype.GenErrorMsg = function (errTyp, sym) {
            this.errorNr++;
            this.err.Write("\t\t\tcase " + this.errorNr + ": s = \"");
            switch (errTyp) {
                case ParserGen.tErr:
                    if (sym.name.charCodeAt(0) == 34 /*'"'*/)
                        this.err.Write(this.tab.Escape(sym.name) + " expected");
                    else
                        this.err.Write(sym.name + " expected");
                    break;
                case ParserGen.altErr:
                    this.err.Write("invalid " + sym.name);
                    break;
                case ParserGen.syncErr:
                    this.err.Write("this symbol not expected in " + sym.name);
                    break;
            }
            this.err.WriteLine("\"; break;");
        };
        ParserGen.prototype.NewCondSet = function (s) {
            for (var i = 1; i < this.symSet.length; i++) // skip symSet[0] (reserved for union of SYNC sets)
                if (Sets.Equals(s, this.symSet[i]))
                    return i;
            this.symSet.push(s.Clone());
            return this.symSet.length - 1;
        };
        ParserGen.prototype.GenCond = function (s, p) {
            if (p.typ == Node.rslv)
                this.CopySourcePart(p.pos, 0);
            else {
                var n = Sets.Elements(s);
                if (n == 0)
                    this.gen.Write("false"); // happens if an ANY set matches no symbol
                else if (n <= ParserGen.maxTerm)
                    for (var _i = 0, _a = this.tab.terminals; _i < _a.length; _i++) {
                        var sym = _a[_i];
                        if (s.Get(sym.n)) {
                            this.gen.Write("this.isKind(this.la, ");
                            this.WriteSymbolOrCode(sym);
                            this.gen.Write(")");
                            --n;
                            if (n > 0)
                                this.gen.Write(" || ");
                        }
                    }
                else
                    this.gen.Write("this.StartOf(" + this.NewCondSet(s) +
                        " /* " + this.tab.nTyp[p.typ] + " " +
                        (p.typ == Node.nt ? p.sym.name : "") + " */)");
            }
        };
        ParserGen.prototype.PutCaseLabels = function (s0) {
            var s = this.DerivationsOf(s0);
            for (var _i = 0, _a = this.tab.terminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                if (s.Get(sym.n)) {
                    this.gen.Write("case ");
                    this.WriteSymbolOrCode(sym);
                    this.gen.Write(": ");
                }
            }
        };
        ParserGen.prototype.DerivationsOf = function (s0) {
            var s = s0.Clone();
            var done = false;
            while (!done) {
                done = true;
                for (var _i = 0, _a = this.tab.terminals; _i < _a.length; _i++) {
                    var sym = _a[_i];
                    if (s.Get(sym.n)) {
                        for (var _b = 0, _c = this.tab.terminals; _b < _c.length; _b++) {
                            var baseSym = _c[_b];
                            if (baseSym.inherits == sym && !s.Get(baseSym.n)) {
                                s.Set(baseSym.n, true);
                                done = false;
                            }
                        }
                    }
                }
            }
            return s;
        };
        ParserGen.prototype.GenSymboltableCheck = function (p, indent) {
            if (!stringIsNullOrEmpty(p.declares)) {
                this.Indent(indent);
                this.gen.WriteLine("if (!" + p.declares + ".Add(this.la)) SemErr(string.Format(DuplicateSymbol, " + this.tab.Quoted(p.sym.name) + ", this.la.val, " + p.declares + ".name));");
                this.Indent(indent);
            }
            else if (!stringIsNullOrEmpty(p.declared)) {
                this.Indent(indent);
                this.gen.WriteLine("if (!" + p.declared + ".Use(this.la)) SemErr(string.Format(MissingSymbol, " + this.tab.Quoted(p.sym.name) + ", this.la.val, " + p.declared + ".name));");
            }
        };
        ParserGen.prototype.GenCode = function (p, indent, isChecked) {
            var p2;
            var s1, s2;
            while (p != null) {
                switch (p.typ) {
                    case Node.nt: {
                        this.Indent(indent);
                        if (p.retVar != null)
                            this.gen.Write(p.retVar + " = ");
                        this.gen.Write("this." + p.sym.name + "_NT(");
                        this.CopySourcePart(p.pos, 0);
                        this.gen.WriteLine(");");
                        break;
                    }
                    case Node.t: {
                        this.GenSymboltableCheck(p, indent);
                        this.Indent(indent);
                        // assert: if isChecked[p.sym.n] is true, then isChecked contains only p.sym.n
                        if (isChecked.Get(p.sym.n)) {
                            this.gen.WriteLine("this.Get();");
                        }
                        else {
                            this.gen.Write("this.Expect(");
                            this.WriteSymbolOrCode(p.sym);
                            this.gen.WriteLine(");");
                        }
                        if (this.tab.genAST) {
                            this.gen.WriteLine("#if PARSER_WITH_AST");
                            this.gen.WriteLine("\tthis.AstAddTerminal();");
                            this.gen.WriteLine("#endif");
                        }
                        break;
                    }
                    case Node.wt: {
                        this.Indent(indent);
                        s1 = this.tab.Expected(p.next, this.curSy);
                        s1.Or(this.tab.allSyncSets);
                        this.gen.Write("this.ExpectWeak(");
                        this.WriteSymbolOrCode(p.sym);
                        this.gen.WriteLine(", " + this.NewCondSet(s1) + ");");
                        break;
                    }
                    case Node.any: {
                        this.Indent(indent);
                        var acc = Sets.Elements(p.set);
                        if (this.tab.terminals.length == (acc + 1) || (acc > 0 && Sets.Equals(p.set, isChecked))) {
                            // either this ANY accepts any terminal (the + 1 = end of file), or exactly what115 /*'s allowed here
                            this.gen.WriteLine("this.Get();");
                        }
                        else {
                            this.GenErrorMsg(ParserGen.altErr, this.curSy);
                            if (acc > 0) {
                                this.gen.Write("if (");
                                this.GenCond(p.set, p);
                                this.gen.WriteLine(") this.Get(); else this.SynErr(" + this.errorNr + ");");
                            }
                            else
                                this.gen.WriteLine("this.SynErr(" + this.errorNr + "); // ANY node that matches no symbol");
                        }
                        break;
                    }
                    case Node.eps: break; // nothing
                    case Node.rslv: break; // nothing
                    case Node.sem: {
                        this.CopySourcePart(p.pos, indent);
                        break;
                    }
                    case Node.sync: {
                        this.Indent(indent);
                        this.GenErrorMsg(ParserGen.syncErr, this.curSy);
                        s1 = p.set.Clone();
                        this.gen.Write("while (!(");
                        this.GenCond(s1, p);
                        this.gen.Write(")) {");
                        this.gen.Write("this.SynErr(" + this.errorNr + "); this.Get();");
                        this.gen.WriteLine("}");
                        break;
                    }
                    case Node.alt: {
                        s1 = this.tab.First(p);
                        var equal = Sets.Equals(s1, isChecked);
                        var useSwitch = this.UseSwitch(p);
                        if (useSwitch) {
                            this.Indent(indent);
                            this.gen.WriteLine("switch (this.la.kind) {");
                        }
                        p2 = p;
                        while (p2 != null) {
                            s1 = this.tab.Expected(p2.sub, this.curSy);
                            this.Indent(indent);
                            if (useSwitch) {
                                this.PutCaseLabels(s1);
                                this.gen.WriteLine("{");
                            }
                            else if (p2 == p) {
                                this.gen.Write("if (");
                                this.GenCond(s1, p2.sub);
                                this.gen.WriteLine(") {");
                            }
                            else if (p2.down == null && equal) {
                                this.gen.WriteLine("} else {");
                            }
                            else {
                                this.gen.Write("} else if (");
                                this.GenCond(s1, p2.sub);
                                this.gen.WriteLine(") {");
                            }
                            this.GenCode(p2.sub, indent + 1, s1);
                            if (useSwitch) {
                                this.Indent(indent);
                                this.gen.WriteLine("\tbreak;");
                                this.Indent(indent);
                                this.gen.WriteLine("}");
                            }
                            p2 = p2.down;
                        }
                        this.Indent(indent);
                        if (equal) {
                            this.gen.WriteLine("}");
                        }
                        else {
                            this.GenErrorMsg(ParserGen.altErr, this.curSy);
                            if (useSwitch) {
                                this.gen.WriteLine("default: this.SynErr(" + this.errorNr + "); break;");
                                this.Indent(indent);
                                this.gen.WriteLine("}");
                            }
                            else {
                                this.gen.Write("} ");
                                this.gen.WriteLine("else this.SynErr(" + this.errorNr + ");");
                            }
                        }
                        break;
                    }
                    case Node.iter: {
                        this.Indent(indent);
                        p2 = p.sub;
                        this.gen.Write("while (");
                        if (p2.typ == Node.wt) {
                            s1 = this.tab.Expected(p2.next, this.curSy);
                            s2 = this.tab.Expected(p.next, this.curSy);
                            this.gen.Write("this.WeakSeparator(");
                            this.WriteSymbolOrCode(p2.sym);
                            this.gen.Write("," + this.NewCondSet(s1) + "," + this.NewCondSet(s2) + ") ");
                            s1 = new BitArray(this.tab.terminals.length); // for inner structure
                            if (p2.up || p2.next == null)
                                p2 = null;
                            else
                                p2 = p2.next;
                        }
                        else {
                            s1 = this.tab.First(p2);
                            this.GenCond(s1, p2);
                        }
                        this.gen.WriteLine(") {");
                        this.GenCode(p2, indent + 1, s1);
                        this.Indent(indent);
                        this.gen.WriteLine("}");
                        break;
                    }
                    case Node.opt:
                        s1 = this.tab.First(p.sub);
                        this.Indent(indent);
                        this.gen.Write("if (");
                        this.GenCond(s1, p.sub);
                        this.gen.WriteLine(") {");
                        this.GenCode(p.sub, indent + 1, s1);
                        this.Indent(indent);
                        this.gen.WriteLine("}");
                        break;
                }
                if (p.typ != Node.eps && p.typ != Node.sem && p.typ != Node.sync)
                    isChecked.SetAll(false); // = new BitArray(tab.terminals.Count);
                if (p.up)
                    break;
                p = p.next;
            }
        };
        ParserGen.prototype.GenTokenBase = function () {
            var idx = 0;
            for (var _i = 0, _a = this.tab.terminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                if ((idx++ % 20) == 0)
                    this.gen.Write("\n\t\t");
                if (sym.inherits == null)
                    this.gen.Write("-1,"); // not inherited
                else
                    this.gen.Write(sym.inherits.n + ",");
            }
        };
        ParserGen.prototype.GenTokens = function () {
            this.gen.WriteLine("\t//non terminals");
            var prefix, suffix;
            if (this.langGen == "js") {
                prefix = "\tParser.";
                suffix = " = ";
            }
            else {
                prefix = "\tpublic static readonly ";
                suffix = " : int = ";
            }
            for (var _i = 0, _a = this.tab.nonterminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                this.gen.WriteLine(prefix + "_NT_" + sym.name + suffix + sym.n + ";");
            }
            this.gen.WriteLine(prefix + "maxNT" + suffix + (this.tab.nonterminals.length - 1) + ";");
            this.gen.WriteLine("\t//terminals");
            for (var _b = 0, _c = this.tab.terminals; _b < _c.length; _b++) {
                var sym = _c[_b];
                if (CharIsLetter(sym.name.charCodeAt(0)))
                    this.gen.Write(prefix + "_" + sym.name + suffix + sym.n + ";");
                else
                    this.gen.Write("//" + prefix + "_(" + sym.name + ")" + suffix + sym.n + ";");
                if (sym.inherits != null)
                    this.gen.Write(" // INHERITS -> " + sym.inherits.name);
                this.gen.WriteLine();
            }
        };
        ParserGen.prototype.GenPragmas = function () {
            var prefix, suffix;
            if (this.langGen == "js") {
                prefix = "\tParser._";
                suffix = " = ";
            }
            else {
                prefix = "\tpublic static readonly _";
                suffix = " : int = ";
            }
            for (var _i = 0, _a = this.tab.pragmas; _i < _a.length; _i++) {
                var sym = _a[_i];
                this.gen.WriteLine(prefix + sym.name + suffix + sym.n + ";");
            }
        };
        ParserGen.prototype.GenCodePragmas = function () {
            for (var _i = 0, _a = this.tab.pragmas; _i < _a.length; _i++) {
                var sym = _a[_i];
                this.gen.Write("\t\t\tif (this.la.kind == ");
                this.WriteSymbolOrCode(sym);
                this.gen.WriteLine(") {");
                this.CopySourcePart(sym.semPos, 4);
                this.gen.WriteLine("\t\t\t}");
            }
        };
        ParserGen.prototype.GenProductions = function () {
            var idx = 0;
            for (var _i = 0, _a = this.tab.nonterminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                this.curSy = sym;
                if (this.langGen == "js")
                    this.gen.Write("\tParser.prototype." + sym.name + "_NT = function(");
                else
                    this.gen.Write("\tprivate " + sym.name + "_NT(");
                this.CopySourcePart(sym.attrPos, 0);
                this.gen.Write(")");
                if (!this.tab.genJS) {
                    this.gen.Write(" : ");
                    if (sym.retType == null)
                        this.gen.Write("void");
                    else
                        this.gen.Write(sym.retType);
                }
                this.gen.WriteLine(" {");
                if (sym.retVar != null) {
                    this.gen.WriteLine("\t\t" +
                        (this.tab.genJS ? "var " : "let ") + sym.retVar +
                        (this.tab.genJS ? "" : " : " + sym.retType) + ";");
                }
                this.CopySourcePart(sym.semPos, 2);
                if (this.tab.genAST) {
                    this.gen.WriteLine("#if PARSER_WITH_AST");
                    if (idx == 0)
                        this.gen.WriteLine("\tToken rt = new Token(); rt.kind = _NT_" + sym.name + "; rt.val = \"" + sym.name + "\";ast_root = new SynTree( rt ); ast_stack = new Stack(); ast_stack.Push(ast_root);");
                    else
                        this.gen.WriteLine("\tbool ntAdded = AstAddNonTerminal(_NT_" + sym.name + ", \"" + sym.name + "\", la.line);");
                    this.gen.WriteLine("#endif");
                }
                this.GenCode(sym.graph, 2, new BitArray(this.tab.terminals.length));
                if (this.tab.genAST) {
                    this.gen.WriteLine("#if PARSER_WITH_AST");
                    if (idx == 0)
                        this.gen.WriteLine("\tAstPopNonTerminal();");
                    else
                        this.gen.WriteLine("\tif(ntAdded) AstPopNonTerminal();");
                    this.gen.WriteLine("#endif");
                }
                if (sym.retVar != null)
                    this.gen.WriteLine("\t\treturn " + sym.retVar + ";");
                this.gen.WriteLine("\t}");
                this.gen.WriteLine();
                ++idx;
            }
        };
        ParserGen.prototype.InitSets = function () {
            for (var i = 0; i < this.symSet.length; i++) {
                var s = this.DerivationsOf(this.symSet[i]);
                this.gen.Write("\t\t[");
                var j = 0;
                for (var _i = 0, _a = this.tab.terminals; _i < _a.length; _i++) {
                    var sym = _a[_i];
                    if (s.Get(sym.n))
                        this.gen.Write("true,");
                    else
                        this.gen.Write("false,");
                    ++j;
                    if (j % 4 == 0)
                        this.gen.Write(" ");
                }
                if (i == this.symSet.length - 1)
                    this.gen.WriteLine("false]");
                else
                    this.gen.WriteLine("false],");
            }
        };
        ParserGen.toTF = function (b) {
            return b ? "true" : "false";
        };
        ParserGen.prototype.GenSymbolTables = function (declare) {
            for (var _i = 0, _a = this.tab.symtabs; _i < _a.length; _i++) {
                var st = _a[_i];
                if (declare)
                    this.gen.WriteLine("\tpublic readonly " + st.name + " : Symboltable | null;");
                else {
                    this.gen.WriteLine("\t\t" + st.name + " = new Symboltable(\"" + st.name + "\", " + ParserGen.toTF(this.dfa.ignoreCase) + ", " + ParserGen.toTF(st.strict) + ");");
                    for (var _b = 0, _c = st.predefined; _b < _c.length; _b++) {
                        var s = _c[_b];
                        this.gen.WriteLine("\t\tthis." + st.name + ".Add(" + this.tab.Quoted(s) + ");");
                    }
                }
            }
            if (declare) {
                if (this.langGen == "js")
                    this.gen.WriteLine("\tParser.prototype.symbols = function(name) {");
                else
                    this.gen.WriteLine("\tpublic symbols(name : string) : Symboltable | null {");
                for (var _d = 0, _e = this.tab.symtabs; _d < _e.length; _d++) {
                    var st = _e[_d];
                    this.gen.WriteLine("\t\tif (name == " + this.tab.Quoted(st.name) + ") return this." + st.name + ";");
                }
                this.gen.WriteLine("\t\treturn null;");
                this.gen.WriteLine("\t}");
            }
        };
        ParserGen.prototype.WriteParser = function () {
            var g = new Generator(this.tab);
            var oldPos = this.buffer.getPos(); // Pos is modified by CopySourcePart
            this.symSet.push(this.tab.allSyncSets);
            this.fram = g.OpenFrame(CocoR.CocoParserFrame);
            this.gen = g.OpenGen("Parser.cs");
            this.err = new StringWriter();
            for (var _i = 0, _a = this.tab.terminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                this.GenErrorMsg(ParserGen.tErr, sym);
            }
            g.GenCopyright();
            g.SkipFramePart("-->begin");
            if (this.usingPos != null) {
                this.CopySourcePart(this.usingPos, 0);
                this.gen.WriteLine();
            }
            g.CopyFramePart("-->namespace");
            /* AW open namespace, if it exists */
            if (this.tab.nsName != null && this.tab.nsName.length > 0 && (this.langGen != "js")) {
                this.gen.WriteLine("namespace " + this.tab.nsName + " {");
                this.gen.WriteLine();
            }
            g.CopyFramePart("-->constants");
            this.GenTokens(); /* ML 2002/09/07 write the token kinds */
            if (this.langGen == "js")
                this.gen.WriteLine("\tParser.maxT = " + (this.tab.terminals.length - 1) + ";");
            else
                this.gen.WriteLine("\tpublic static readonly maxT : int = " + (this.tab.terminals.length - 1) + ";");
            this.GenPragmas(); /* ML 2005/09/23 write the pragma kinds */
            g.CopyFramePart("-->declarations");
            this.CopySourcePart(this.tab.semDeclPos, 0);
            this.GenSymbolTables(true);
            g.CopyFramePart("-->constructor");
            this.GenSymbolTables(false);
            g.CopyFramePart("-->pragmas");
            this.GenCodePragmas();
            g.CopyFramePart("-->productions");
            this.GenProductions();
            g.CopyFramePart("-->parseRoot");
            this.gen.WriteLine("\t\tthis." + this.tab.gramSy.name + "_NT();");
            if (this.tab.checkEOF)
                this.gen.WriteLine("\t\tthis.Expect(0);");
            g.CopyFramePart("-->tbase");
            this.GenTokenBase(); // write all tokens base types
            g.CopyFramePart("-->initialization");
            this.InitSets();
            g.CopyFramePart("-->errors");
            this.gen.Write(this.err.ToString());
            g.CopyFramePart(null);
            /* AW 2002-12-20 close namespace, if it exists */
            if (this.tab.nsName != null && this.tab.nsName.length > 0 && (this.langGen != "js"))
                this.gen.WriteLine("}");
            var parserSource = this.gen.ToString();
            if (this.langGen == "js") {
                //hack to remove parameters types from function definitions
                parserSource = parserSource.replace(/_NT = function\(([^)]+)\)/gm, function (match, p1) {
                    return "_NT = function(" + p1.replace(/\s*(\w+)(\s*:\s*[^,]+(,)?)*/gm, "$1$3") + ")";
                });
            }
            if (this.writeBufferTo)
                this.writeBufferTo("WriteParser", parserSource);
            else
                console.log(parserSource);
            this.gen.Close();
            this.buffer.setPos(oldPos);
        };
        ParserGen.prototype.GenCodeRREBNF = function (p, depth) {
            var rc = 0, loop_count = 0;
            var p2;
            while (p != null) {
                switch (p.typ) {
                    case Node.nt:
                    case Node.t: {
                        this.gen.Write(" ");
                        this.gen.Write(p.sym.name);
                        ++rc;
                        break;
                    }
                    case Node.wt: {
                        break;
                    }
                    case Node.any: {
                        this.gen.Write(" ANY");
                        ++rc;
                        break;
                    }
                    case Node.eps: break; // nothing
                    case Node.rslv: break; // nothing
                    case Node.sem: {
                        break;
                    }
                    case Node.sync: {
                        break;
                    }
                    case Node.alt: {
                        var need_close_alt = false;
                        if (depth > 0 || loop_count > 0 || p.next != null) {
                            this.gen.Write(" (");
                            need_close_alt = true;
                        }
                        p2 = p;
                        while (p2 != null) {
                            rc += this.GenCodeRREBNF(p2.sub, depth + 1);
                            p2 = p2.down;
                            if (p2 != null)
                                this.gen.Write(" |");
                        }
                        if (need_close_alt)
                            this.gen.Write(" )");
                        break;
                    }
                    case Node.iter: {
                        if (!p.sub.up)
                            this.gen.Write(" (");
                        rc += this.GenCodeRREBNF(p.sub, depth + 1);
                        if (!p.sub.up)
                            this.gen.Write(" )");
                        this.gen.Write("*");
                        break;
                    }
                    case Node.opt:
                        if (!p.sub.up)
                            this.gen.Write(" (");
                        rc += this.GenCodeRREBNF(p.sub, depth + 1);
                        if (!p.sub.up)
                            this.gen.Write(" )");
                        this.gen.Write("?");
                        break;
                }
                if (p.up)
                    break;
                p = p.next;
                ++loop_count;
            }
            return rc;
        };
        ParserGen.prototype.WriteRREBNF = function () {
            var g = new Generator(this.tab);
            this.gen = new StringWriter(); //g.OpenGen("Parser.ebnf");
            this.gen.Write("//\n// EBNF generated by CocoR parser generator to be viewed with https://www.bottlecaps.de/rr/ui\n//\n");
            this.gen.Write("\n//\n// productions\n//\n\n");
            for (var _i = 0, _a = this.tab.nonterminals; _i < _a.length; _i++) {
                var sym = _a[_i];
                this.gen.Write(sym.name + " ::= ");
                if (this.GenCodeRREBNF(sym.graph, 0) == 0) {
                    this.gen.Write("\"??()??\"");
                }
                this.gen.Write("\n");
            }
            this.gen.Write("\n//\n// tokens\n//\n\n");
            for (var _b = 0, _c = this.tab.terminals; _b < _c.length; _b++) {
                var sym = _c[_b];
                if (CharIsLetter(sym.name.charCodeAt(0))) { // real name value is stored in Tab.literals
                    for (var k in this.tab.literals) {
                        if (this.tab.literals.hasOwnProperty(k) && this.tab.literals[k] == sym) {
                            this.gen.Write(sym.name + " ::= " + k + "\n");
                            break;
                        }
                    }
                }
                else {
                    //gen.Write("{0} /* {1} */", sym.n, sym.name);
                }
            }
            if (this.writeBufferTo)
                this.writeBufferTo("WriteRREBNF", this.gen.ToString());
            else
                console.log(this.gen.ToString());
            this.gen.Close();
        };
        ParserGen.prototype.WriteStatistics = function () {
            this.trace.WriteLine();
            this.trace.WriteLine(this.tab.terminals.length + " terminals");
            this.trace.WriteLine((this.tab.terminals.length + this.tab.pragmas.length +
                this.tab.nonterminals.length) + " symbols");
            this.trace.WriteLine(this.tab.nodes.length + " nodes");
            this.trace.WriteLine(this.symSet.length + " sets");
        };
        ParserGen.maxTerm = 3; // sets of size < maxTerm are enumerated
        ParserGen.CR = 13 /*'\r'*/;
        ParserGen.LF = 10 /*'\n'*/;
        ParserGen.EOF = -1;
        ParserGen.tErr = 0; // error codes
        ParserGen.altErr = 1;
        ParserGen.syncErr = 2;
        return ParserGen;
    }()); // end ParserGen
    CocoR.ParserGen = ParserGen;
    //} // end namespace
    /*//----End ParserGen.ts */
    /*//----Start Parser.frame */
    CocoR.CocoParserFrame = "\n/*----------------------------------------------------------------------\nCompiler Generator Coco/R,\nCopyright (c) 1990, 2004 Hanspeter Moessenboeck, University of Linz\nextended by M. Loeberbauer & A. Woess, Univ. of Linz\nwith improvements by Pat Terry, Rhodes University\n\nThis program is free software; you can redistribute it and/or modify it\nunder the terms of the GNU General Public License as published by the\nFree Software Foundation; either version 2, or (at your option) any\nlater version.\n\nThis program is distributed in the hope that it will be useful, but\nWITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY\nor FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License\nfor more details.\n\nYou should have received a copy of the GNU General Public License along\nwith this program; if not, write to the Free Software Foundation, Inc.,\n59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.\n\nAs an exception, it is allowed to write an extension of Coco/R that is\nused as a plugin in non-free software.\n\nIf not otherwise stated, any source code generated by Coco/R (other than\nCoco/R itself) does not fall under the GNU General Public License.\n----------------------------------------------------------------------*/\n-->begin\n\n-->namespace\n\nexport class Parser {\n-->constants\n    static readonly  minErrDist : int = 2;\n\n    public  scanner : Scanner;\n    public   errors : Errors;\n    public  log : (...data : any[]) => void = console.log;\n\n    public  t : Token;    // last recognized token\n    public  la : Token;   // lookahead token\n    private errDist : int = Parser.minErrDist;\n\n-->declarations\n\n    constructor( scanner : Scanner) {\n        this.scanner = scanner;\n        this.errors = new Errors(this.scanner.parseFileName);\n-->constructor\n\t}\n\n    private  SynErr ( n : int) : void {\n        if (this.errDist >= Parser.minErrDist) this.errors.SynErr(this.la.line, this.la.col, n);\n        this.errDist = 0;\n    }\n\n    public  SemErr ( msg : string) : void {\n        if (this.errDist >= Parser.minErrDist) this.errors.SemErrLineColStr(this.t.line, this.t.col, msg);\n        this.errDist = 0;\n    }\n\n    private  Get () : void {\n        for (;;) {\n            //this.log(this.t, this.la);\n            this.t = this.la;\n            this.la = this.scanner.Scan();\n            if (this.la.kind <= Parser.maxT) { ++this.errDist; break; }\n-->pragmas\n            this.la = this.t;\n        }\n    }\n\n    private  isKind( t : Token,  n : int) : bool {\n        let k : int = t.kind;\n        while(k >= 0) {\n            if (k == n) return true;\n            k = Parser.tBase[k];\n        }\n        return false;\n    }\n\n    private  Expect ( n : int) : void {\n        if (this.isKind(this.la, n)) this.Get(); else { this.SynErr(n); }\n    }\n\n    private  StartOf ( s : int) : bool {\n        return Parser.set[s][this.la.kind];\n    }\n\n    private  ExpectWeak ( n : int,  follow : int) : void {\n        if (this.isKind(this.la, n)) this.Get();\n        else {\n            this.SynErr(n);\n            while (!this.StartOf(follow)) this.Get();\n        }\n    }\n\n\n    private  WeakSeparator( n : int,  syFol : int,  repFol : int) : bool {\n        let kind : int = this.la.kind;\n        if (this.isKind(this.la, n)) {this.Get(); return true;}\n        else if (this.StartOf(repFol)) {return false;}\n        else {\n            this.SynErr(n);\n            while (!(Parser.set[syFol][kind] || Parser.set[repFol][kind] || Parser.set[0][kind])) {\n                this.Get();\n                kind = this.la.kind;\n            }\n            return this.StartOf(syFol);\n        }\n    }\n\n\tprivate SkipNested(leftKind: int, rightKind: int) : void {\n\t\t// manage nested braces\n\t\tif(this.la.kind != rightKind) {\n\t\t\tfor (let nested : int = 1; nested > 0;) {\n\t\t\t\t//print(\"==\", this.la.line, nested, this.la.kind, this.la.val);\n\t\t\t\tif(this.la.kind == leftKind) ++nested;\n\t\t\t\tthis.Get();\n\t\t\t\tif(this.la.kind == rightKind) --nested;\n\t\t\t\telse if(this.la.kind == Parser._EOF) break;\n\t\t\t}\n\t\t}\n\t}\n\n\tprivate SkipTill(endKind : int) : void {\n\t\twhile(this.la.kind != endKind || this.la.kind != Parser._EOF) {\n\t\t\tthis.Get();\n\t\t}\n\t}\n\n\tprivate SkipTillEOL() : void {\n\t\tlet currLine : int = this.la.line;\n\t\twhile(this.la.line == currLine || this.la.kind != Parser._EOF) {\n\t\t\tthis.Get();\n\t\t}\n\t}\n\n-->productions\n\n\tpublic Parse() : void {\n\t\tthis.la = new Token();\n\t\tthis.la.val = \"\";\n\t\tthis.Get();\n-->parseRoot\n\t}\n\n\t// a token's base type\n\tpublic static readonly tBase : int[] = [\n-->tbase\n    ];\n\n\tstatic readonly set : bool[][] = [\n-->initialization\n    ];\n/*\n\tpublic void CheckDeclared(errors : Errors) {\n\t\tlet list : Array<Token>  = undeclaredTokens.Peek();\n\t\tfor(Token t of list) {\n\t\t\tlet msg : string  = string.Format(Parser.MissingSymbol, Parser.tName[this.t.kind], this.t.val, this.name);\n\t\t\terrors.SemErr(this.t.line, this.t.col, msg);\n\t\t}\n\t}\n*/\n\n/*#if PARSER_WITH_AST\n\tpublic ast_root : SynTree;\n\tprivate ast_stack : Stack ;\n\n\tpublic AstAddTerminal() : void {\n        let st : SynTree = new SynTree( this.t );\n        ((SynTree)(this.ast_stack.Peek())).children.Add(st);\n\t}\n\n\tpublic AstAddNonTerminal(kind : int, nt_name : string, line : int) : bool {\n        let ntTok : Token  = new Token();\n        ntTok.kind = kind;\n        ntTok.line = line;\n        ntTok.val = nt_name;\n        let st : SynTree = new SynTree( ntTok );\n        ((SynTree)(this.ast_stack.Peek())).children.Add(st);\n        this.ast_stack.Push(st);\n        return true;\n\t}\n\n\tpublic AstPopNonTerminal() : void {\n        this.ast_stack.Pop();\n\t}\n//#endif*/\n\n} // end Parser\n\n\nexport class Errors {\n    public  count : int = 0;                                    // number of errors detected\n    //public  errorStream : StreamWriter; //.IO.TextWriter = Console.Out;   // error messages go to this stream\n    public  errMsgFormat : string = \"-- line {0} col {1}: {2}\"; // 0=line, 1=column, 2=text\n    public  fileName : string = \"grammar\"; // 0=line, 1=column, 2=text\n\n    constructor(fileName : string) {\n        this.fileName = fileName;\n    }\n\n\tpublic /*virtual*/  SynErr ( line : int,  col : int,  n : int) : void {\n\t\tlet s : string;\n\t\tswitch (n) {\n-->errors\n\t\t\tdefault: s = \"error \" + n; break;\n\t\t}\n\t\t//errorStream.WriteLine(errMsgFormat, line, col, s);\n\t\tthis.log(this.errMsgFormat, line, col, s);\n\t\t++this.count;\n\t}\n\n    public /*virtual*/  SemErrLineColStr ( line : int,  col : int,  s : string) : void {\n        //this.errorStream.WriteLine(this.errMsgFormat, line, col, s);\n        this.log(this.errMsgFormat, line, col, s);\n        ++this.count;\n    }\n\n    public /*virtual*/  SemErr ( s : string) : void {\n        //this.errorStream.WriteLine(s);\n        this.log(s);\n        ++this.count;\n    }\n\n    public /*virtual*/  Warning ( line : int,  col : int,  s : string) : void {\n        //this.errorStream.WriteLine(this.errMsgFormat, line, col, s);\n        this.log(this.errMsgFormat, line, col, s);\n    }\n\n    public /*virtual*/  WarningStr( s : string) : void {\n        //this.errorStream.WriteLine(s);\n        this.log(s);\n    }\n} // Errors\n\n\nexport class FatalError /*extends Exception*/ {\n    constructor( m : string)  {throw(m);}\n}\n\nexport class Symboltable {\n\tpublic name : string ;\n\tpublic strict : bool ;\n\tpublic ignoreCase : bool ;\n\tpublic predefined : {};\n\n\tconstructor(name : string, ignoreCase : bool, strict : bool) {\n\t\tthis.name = name;\n\t\tthis.ignoreCase = ignoreCase;\n\t\tthis.strict = strict;\n\t}\n\n\tpublic Add(t : Token) : bool {\n\t\tif(!this.predefined.hasOwnProperty(t.val)) {\n\t\t\tthis.predefined[t.val] = true;\n\t\t\treturn true;\n\t\t}\n\t\treturn false;\n\t}\n\n\tpublic Use(t : Token) : bool {\n\t\treturn this.predefined.hasOwnProperty(t.val);\n\t}\n}\n\n";
    /*//----End Parser.frame */
    /*//----Start Scanner.frame */
    CocoR.CocoScannerFrame = "\n/*----------------------------------------------------------------------\nCompiler Generator Coco/R,\nCopyright (c) 1990, 2004 Hanspeter Moessenboeck, University of Linz\nextended by M. Loeberbauer & A. Woess, Univ. of Linz\nwith improvements by Pat Terry, Rhodes University\n\nThis program is free software; you can redistribute it and/or modify it\nunder the terms of the GNU General Public License as published by the\nFree Software Foundation; either version 2, or (at your option) any\nlater version.\n\nThis program is distributed in the hope that it will be useful, but\nWITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY\nor FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License\nfor more details.\n\nYou should have received a copy of the GNU General Public License along\nwith this program; if not, write to the Free Software Foundation, Inc.,\n59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.\n\nAs an exception, it is allowed to write an extension of Coco/R that is\nused as a plugin in non-free software.\n\nIf not otherwise stated, any source code generated by Coco/R (other than\nCoco/R itself) does not fall under the GNU General Public License.\n-----------------------------------------------------------------------*/\n-->begin\n\n-->namespace\n\nexport class Token {\n    public  kind : int = 0;    // token kind\n    public  pos : int = 0;     // token position in bytes in the source text (starting at 0)\n    public  charPos : int = 0;  // token position in characters in the source text (starting at 0)\n    public  col : int = 1;     // token column (starting at 1)\n    public  line : int = 1;    // token line (starting at 1)\n    public  val : string;  // token value\n    public  next : Token | null = null;  // ML 2005-03-11 Tokens are kept in linked list\n}\n\n//-----------------------------------------------------------------------------------\n// StringBuffer\n//-----------------------------------------------------------------------------------\nexport class Buffer {\n\n    public static readonly EOF : int = -1;\n    buf : string;         // input buffer\n    bufStart : int;       // position of first byte in buffer relative to input stream\n    bufLen : int;         // length of buffer\n    bufPos : int;         // current position in buffer\n\n    public constructor (s : string) {\n        this.buf = s;\n        this.bufLen = s.length;\n        this.bufStart = this.bufPos = 0;\n    }\n\n    public /*virtual*/ Read () : int {\n        if (this.bufPos < this.bufLen) {\n            return this.buf.charCodeAt(this.bufPos++);\n        } else {\n            return Buffer.EOF;\n        }\n    }\n\n    public Peek () : int {\n        const curPos : int = this.getPos();\n        const ch : int = this.Read();\n        this.setPos(curPos);\n        return ch;\n    }\n\n    // beg .. begin, zero-based, inclusive, in byte\n    // end .. end, zero-based, exclusive, in byte\n    public GetString (beg : int, end : int) : string {\n        return this.buf.slice(beg, end);\n    }\n\n    public getPos() : int { return this.bufPos + this.bufStart; }\n    public setPos(value : int) : void {\n        if (value < 0 || value > this.bufLen) {\n            throw \"buffer out of bounds access, position: \" + value;\n        }\n\n        if (value >= this.bufStart && value < this.bufStart + this.bufLen) { // already in buffer\n            this.bufPos = value - this.bufStart;\n        } else {\n            // set the position to the end of the file, Pos will return fileLen.\n            this.bufPos = this.bufLen - this.bufStart;\n        }\n    }\n\n}\n\n//-----------------------------------------------------------------------------------\n// Scanner\n//-----------------------------------------------------------------------------------\nexport class Scanner {\n    static readonly  EOL : char = 10 /*'\\n'*/;\n    static readonly  eofSym : int = 0; /* pdt */\n-->declarations\n\n    public  buffer : Buffer; // scanner buffer\n\n    private t : Token;          // current token\n    private ch : int;           // current input character\n    private pos : int;          // byte position of current character\n    private charPos : int;      // position by unicode characters starting with 0\n    private col : int;          // column number of current character\n    private line : int;         // line number of current character\n    private oldEols : int;      // EOLs that appeared in a comment;\n    static  start : Array<int> = []; // maps first token character to start state\n\n    private tokens : Token;     // list of tokens already peeked (first token is a dummy)\n    private pt : Token;         // current peek token\n\n    private tval : string; // text of current token\n    private tlen : int;         // length of current token\n\n    public parseFileName : string;\n    public stateNo : int = 0;\t// to user defined states\n\n    private Init0() : void {\n        Scanner.start = new Array<int>(128);\n        for (let i=0; i<128; ++i) Scanner.start[i] = 0;\n-->initialization\n\t}\n\n    constructor(str : string , fileName : string) {\n        this.parseFileName = fileName;\n        this.buffer = new Buffer(str); // scanner buffer\n        if(Scanner.start.length == 0) this.Init0();\n        this.Init();\n    }\n\n    private  Init() : void {\n        this.pos = -1; this.line = 1; this.col = 0; this.charPos = -1;\n        this.oldEols = 0;\n        this.NextCh();\n        this.pt = this.tokens = new Token();  // first token is a dummy\n    }\n\n    private  NextCh() : void {\n        if (this.oldEols > 0) { this.ch = Scanner.EOL; this.oldEols--; }\n        else {\n            this.pos = this.buffer.getPos();\n            // buffer reads unicode chars, if UTF8 has been detected\n            this.ch = this.buffer.Read(); this.col++; this.charPos++;\n            // replace isolated '\\r' by '\\n' in order to make\n            // eol handling uniform across Windows, Unix and Mac\n            if (this.ch == 13 /*'\\r'*/ && this.buffer.Peek() != Scanner.EOL /*'\\n'*/) this.ch = Scanner.EOL;\n            if (this.ch == Scanner.EOL) { this.line++; this.col = 0; }\n        }\n-->casing1\n\t}\n\n    private AddCh() : void {\n        if (this.ch != Buffer.EOF) {\n            ++this.tlen;\n            this.tval += String.fromCharCode(this.ch);\n            this.NextCh();\n        }\n-->casing2\n\t}\n\n\n-->comments\n\n    private  CheckLiteral() : void {\n-->literals\n\t}\n\n\tpublic NextToken() : Token {\n\t\tfor(;;) {\n\t\t\twhile (this.ch == 32 /*' '*/ ||\n-->scan1\n\t\t\t)  this.NextCh();\n-->scan2\n\t\t\tbreak;\n\t\t}\n-->scan22\n        let recKind : int = Scanner.noSym;\n        let recEnd : int = this.pos;\n        this.t = new Token();\n        this.t.pos = this.pos; this.t.col = this.col; this.t.line = this.line; this.t.charPos = this.charPos;\n        let state : int = (this.ch == Buffer.EOF) ? -1 : Scanner.start[this.ch];\n        this.tlen = 0; this.tval = \"\"; this.AddCh();\n\n        loop: for (; ;) {\n\t\tswitch (state) {\n\t\t\tcase -1: { this.t.kind = Scanner.eofSym; break loop; } // NextCh already done\n\t\t\tcase 0: {\n\t\t\t\tif (recKind != Scanner.noSym) {\n\t\t\t\t\tthis.tlen = recEnd - this.t.pos;\n\t\t\t\t\tthis.SetScannerBehindT();\n\t\t\t\t}\n\t\t\t\tthis.t.kind = recKind; break loop;\n\t\t\t} // NextCh already done\n-->scan3\n\t\t}\n        }\n        this.t.val = this.tval;\n        return this.t;\n    }\n\n    private  SetScannerBehindT() : void {\n        this.buffer.setPos(this.t.pos);\n        this.NextCh();\n        this.line = this.t.line; this.col = this.t.col; this.charPos = this.t.charPos;\n        for ( let i : int = 0; i < this.tlen; i++) this.NextCh();\n    }\n\n    // get the next token (possibly a token already seen during peeking)\n    public  Scan () : Token {\n        if (this.tokens.next == null) {\n            return this.NextToken();\n        } else {\n            this.pt = this.tokens = this.tokens.next;\n            return this.tokens;\n        }\n    }\n\n    // peek for the next token, ignore pragmas\n    public  Peek () : Token {\n        do {\n            if (this.pt.next == null) {\n                this.pt.next = this.NextToken();\n            }\n            this.pt = this.pt.next;\n        } while (this.pt.kind > Scanner.maxT); // skip pragmas\n\n        return this.pt;\n    }\n\n    // make sure that peeking starts at the current scan position\n    public  ResetPeek () : void { this.pt = this.tokens; }\n\n} // end Scanner\n\n/*\nlet scanner : Scanner  = new Scanner(`let a : string = \"str\";`, \"test.txt\");\nlet tok : Token = scanner.Scan()\nwhile(tok.kind != Scanner.eofSym)\n{\n\tconsole.log(tok);\n\ttok = scanner.Scan();\n}\n*/\n";
    /*//----End Scanner.frame */
    /*//----Start Copyright.frame */
    CocoR.CocoCopyrightFrame = "\n/*----------------------------------------------------------------------\nCompiler Generator Coco/R,\nCopyright (c) 1990, 2004 Hanspeter Moessenboeck, University of Linz\nextended by M. Loeberbauer & A. Woess, Univ. of Linz\nwith improvements by Pat Terry, Rhodes University\n\nThis program is free software; you can redistribute it and/or modify it\nunder the terms of the GNU General Public License as published by the\nFree Software Foundation; either version 2, or (at your option) any\nlater version.\n\nThis program is distributed in the hope that it will be useful, but\nWITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY\nor FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License\nfor more details.\n\nYou should have received a copy of the GNU General Public License along\nwith this program; if not, write to the Free Software Foundation, Inc.,\n59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.\n\nAs an exception, it is allowed to write an extension of Coco/R that is\nused as a plugin in non-free software.\n\nIf not otherwise stated, any source code generated by Coco/R (other than\nCoco/R itself) does not fall under the GNU General Public License.\n-----------------------------------------------------------------------*/\n";
    /*//----End Copyright.frame */
    /*//----Start Parser-js.frame */
    CocoR.CocoParserJsFrame = "\n/*----------------------------------------------------------------------\nCompiler Generator Coco/R,\nCopyright (c) 1990, 2004 Hanspeter Moessenboeck, University of Linz\nextended by M. Loeberbauer & A. Woess, Univ. of Linz\nwith improvements by Pat Terry, Rhodes University\n\nThis program is free software; you can redistribute it and/or modify it\nunder the terms of the GNU General Public License as published by the\nFree Software Foundation; either version 2, or (at your option) any\nlater version.\n\nThis program is distributed in the hope that it will be useful, but\nWITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY\nor FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License\nfor more details.\n\nYou should have received a copy of the GNU General Public License along\nwith this program; if not, write to the Free Software Foundation, Inc.,\n59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.\n\nAs an exception, it is allowed to write an extension of Coco/R that is\nused as a plugin in non-free software.\n\nIf not otherwise stated, any source code generated by Coco/R (other than\nCoco/R itself) does not fall under the GNU General Public License.\n-----------------------------------------------------------------------*/\n-->begin\n\n-->namespace //For Javascript we do not emmit any namespace and use a fixed one\nvar CocoRJS;\n(function (CocoRJS) {\n    Object.assign(this, CocoRJS); //concatenate then\n\nvar Parser = /** @class */ (function () {\n\n-->constants\n\n    Parser.minErrDist = 2;\n\n-->declarations\n\n    function Parser(scanner) {\n        this.errDist = Parser.minErrDist;\n        this.scanner = scanner;\n        this.errors = new Errors(this.scanner.parseFileName);\n        this.log = console.log;\n-->constructor\n    }\n\n    Parser.prototype.SynErr = function (n) {\n        if (this.errDist >= Parser.minErrDist)\n            this.errors.SynErr(this.la.line, this.la.col, n);\n        this.errDist = 0;\n    };\n    Parser.prototype.SemErr = function (msg) {\n        if (this.errDist >= Parser.minErrDist)\n            this.errors.SemErrLineColStr(this.t.line, this.t.col, msg);\n        this.errDist = 0;\n    };\n    Parser.prototype.Get = function () {\n        for (;;) {\n            //this.log(this.t, this.la);\n            this.t = this.la;\n            this.la = this.scanner.Scan();\n            if (this.la.kind <= Parser.maxT) {\n                ++this.errDist;\n                break;\n            }\n-->pragmas\n            this.la = this.t;\n        }\n    };\n    Parser.prototype.isKind = function (t, n) {\n        var k = t.kind;\n        while (k >= 0) {\n            if (k == n)\n                return true;\n            k = Parser.tBase[k];\n        }\n        return false;\n    };\n    Parser.prototype.Expect = function (n) {\n        if (this.isKind(this.la, n))\n            this.Get();\n        else {\n            this.SynErr(n);\n        }\n    };\n    Parser.prototype.StartOf = function (s) {\n        return Parser.set[s][this.la.kind];\n    };\n    Parser.prototype.ExpectWeak = function (n, follow) {\n        if (this.isKind(this.la, n))\n            this.Get();\n        else {\n            this.SynErr(n);\n            while (!this.StartOf(follow))\n                this.Get();\n        }\n    };\n    Parser.prototype.WeakSeparator = function (n, syFol, repFol) {\n        var kind = this.la.kind;\n        if (this.isKind(this.la, n)) {\n            this.Get();\n            return true;\n        }\n        else if (this.StartOf(repFol)) {\n            return false;\n        }\n        else {\n            this.SynErr(n);\n            while (!(Parser.set[syFol][kind] || Parser.set[repFol][kind] || Parser.set[0][kind])) {\n                this.Get();\n                kind = this.la.kind;\n            }\n            return this.StartOf(syFol);\n        }\n    };\n    Parser.prototype.SkipNested = function (leftKind, rightKind) {\n        // manage nested braces\n        if (this.la.kind != rightKind) {\n            for (var nested = 1; nested > 0;) {\n                //print(\"==\", this.la.line, nested, this.la.kind, this.la.val);\n                if (this.la.kind == leftKind)\n                    ++nested;\n                this.Get();\n                if (this.la.kind == rightKind)\n                    --nested;\n                else if (this.la.kind == Parser._EOF)\n                    break;\n            }\n        }\n    };\n    Parser.prototype.SkipTill = function (endKind) {\n        while (this.la.kind != endKind || this.la.kind != Parser._EOF) {\n            this.Get();\n        }\n    };\n    Parser.prototype.SkipTillEOL = function () {\n        var currLine = this.la.line;\n        while (this.la.line == currLine || this.la.kind != Parser._EOF) {\n            this.Get();\n        }\n    };\n\n-->productions\n\n    Parser.prototype.Parse = function () {\n        this.la = new Token();\n        this.la.val = \"\";\n        this.Get();\n-->parseRoot\n    };\n    // a token's base type\n    Parser.tBase = [\n-->tbase\n    ];\n    Parser.set = [\n-->initialization    ];\n    return Parser;\n}()); // end Parser\nCocoRJS.Parser = Parser;\nvar Errors = /** @class */ (function () {\n    function Errors(fileName) {\n        this.log = console.log;\n        this.count = 0; // number of errors detected\n        //public  errorStream : StreamWriter; //.IO.TextWriter = Console.Out;   // error messages go to this stream\n        //public  errMsgFormat : string = \"-- line {0} col {1}: {2}\"; // 0=line, 1=column, 2=text\n        this.errMsgFormat = \"%s:%d:%d %s %s\"; // 0=line, 1=column, 2=text\n        this.fileName = \"grammar\"; // 0=line, 1=column, 2=text\n        this.fileName = fileName;\n    }\n    Errors.prototype.SynErr = function (line, col, n) {\n        var s;\n        switch (n) {\n-->errors\n            default:\n                s = \"error \" + n;\n                break;\n        }\n        //errorStream.WriteLine(errMsgFormat, line, col, s);\n        this.log(this.fileName + \":\" + line + \":\" + col + \" SynErr \" + s);\n        ++this.count;\n    };\n    Errors.prototype.SemErrLineColStr = function (line, col, s) {\n        //this.errorStream.WriteLine(this.errMsgFormat, line, col, s);\n        this.log(this.fileName + \":\" + line + \":\" + col + \" SemErr \" + s);\n        ++this.count;\n    };\n    Errors.prototype.SemErr = function (s) {\n        //this.errorStream.WriteLine(s);\n        this.log(s);\n        ++this.count;\n    };\n    Errors.prototype.Warning = function (line, col, s) {\n        //this.errorStream.WriteLine(this.errMsgFormat, line, col, s);\n        this.log(this.fileName + \":\" + line + \":\" + col + \" Warning \" + s);\n    };\n    Errors.prototype.WarningStr = function (s) {\n        //this.errorStream.WriteLine(s);\n        this.log(s);\n    };\n    return Errors;\n}()); // Errors\nCocoRJS.Errors = Errors;\nvar FatalError /*extends Exception*/ = /** @class */ (function () {\n    function FatalError(m) {\n        throw (m);\n    }\n    return FatalError;\n}());\nCocoRJS.FatalError = FatalError;\nvar Symboltable = /** @class */ (function () {\n    function Symboltable(name, ignoreCase, strict) {\n        this.name = name;\n        this.ignoreCase = ignoreCase;\n        this.strict = strict;\n    }\n    Symboltable.prototype.Add = function (t) {\n        if (!this.predefined.hasOwnProperty(t.val)) {\n            this.predefined[t.val] = true;\n            return true;\n        }\n        return false;\n    };\n    Symboltable.prototype.Use = function (t) {\n        return this.predefined.hasOwnProperty(t.val);\n    };\n    return Symboltable;\n}());\nCocoRJS.Symboltable = Symboltable;\n})(CocoRJS || (CocoRJS = {}));\n\n";
    /*//----End Parser-js.frame */
    /*//----Start Scanner-js.frame */
    CocoR.CocoScannerJsFrame = "\n/*----------------------------------------------------------------------\nCompiler Generator Coco/R,\nCopyright (c) 1990, 2004 Hanspeter Moessenboeck, University of Linz\nextended by M. Loeberbauer & A. Woess, Univ. of Linz\nwith improvements by Pat Terry, Rhodes University\n\nThis program is free software; you can redistribute it and/or modify it\nunder the terms of the GNU General Public License as published by the\nFree Software Foundation; either version 2, or (at your option) any\nlater version.\n\nThis program is distributed in the hope that it will be useful, but\nWITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY\nor FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License\nfor more details.\n\nYou should have received a copy of the GNU General Public License along\nwith this program; if not, write to the Free Software Foundation, Inc.,\n59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.\n\nAs an exception, it is allowed to write an extension of Coco/R that is\nused as a plugin in non-free software.\n\nIf not otherwise stated, any source code generated by Coco/R (other than\nCoco/R itself) does not fall under the GNU General Public License.\n-----------------------------------------------------------------------*/\n\n-->begin\n\n-->namespace //For Javascript we do not emmit any namespace and use a fixed one\nvar CocoRJS;\n(function (CocoRJS) {\nObject.assign(this, CocoRJS); //concatenate then\nvar Token = /** @class */ (function () {\n    function Token() {\n        this.kind = 0; // token kind\n        this.pos = 0; // token position in bytes in the source text (starting at 0)\n        this.charPos = 0; // token position in characters in the source text (starting at 0)\n        this.col = 1; // token column (starting at 1)\n        this.line = 1; // token line (starting at 1)\n        this.next = null; // ML 2005-03-11 Tokens are kept in linked list\n    }\n    return Token;\n}());\nCocoRJS.Token = Token;\n//-----------------------------------------------------------------------------------\n// StringBuffer\n//-----------------------------------------------------------------------------------\nvar Buffer = /** @class */ (function () {\n    function Buffer(s) {\n        this.buf = s;\n        this.bufLen = s.length;\n        this.bufStart = this.bufPos = 0;\n    }\n    Buffer.prototype.Read = function () {\n        if (this.bufPos < this.bufLen) {\n            return this.buf.charCodeAt(this.bufPos++);\n        }\n        else {\n            return Buffer.EOF;\n        }\n    };\n    Buffer.prototype.Peek = function () {\n        var curPos = this.getPos();\n        var ch = this.Read();\n        this.setPos(curPos);\n        return ch;\n    };\n    // beg .. begin, zero-based, inclusive, in byte\n    // end .. end, zero-based, exclusive, in byte\n    Buffer.prototype.GetString = function (beg, end) {\n        return this.buf.slice(beg, end);\n    };\n    Buffer.prototype.getPos = function () { return this.bufPos + this.bufStart; };\n    Buffer.prototype.setPos = function (value) {\n        if (value < 0 || value > this.bufLen) {\n            throw \"buffer out of bounds access, position: \" + value;\n        }\n        if (value >= this.bufStart && value < this.bufStart + this.bufLen) { // already in buffer\n            this.bufPos = value - this.bufStart;\n        }\n        else {\n            // set the position to the end of the file, Pos will return fileLen.\n            this.bufPos = this.bufLen - this.bufStart;\n        }\n    };\n    Buffer.EOF = -1;\n    return Buffer;\n}());\nCocoRJS.Buffer = Buffer;\n//-----------------------------------------------------------------------------------\n// Scanner\n//-----------------------------------------------------------------------------------\nvar Scanner = /** @class */ (function () {\n    function Scanner(str, fileName) {\n        this.stateNo = 0; // to user defined states\n        this.parseFileName = fileName;\n        this.buffer = new Buffer(str); // scanner buffer\n        if (Scanner.start.length == 0)\n            this.Init0();\n        this.Init();\n    }\n\n    Scanner.EOL = 10 /*'\\n'*/;\n    Scanner.eofSym = 0; /* pdt */\n    Scanner.start = []; // maps first token character to start state\n    -->declarations\n\n    Scanner.prototype.Init0 = function () {\n        Scanner.start = new Array(128);\n        for (var i = 0; i < 128; ++i)\n            Scanner.start[i] = 0;\n-->initialization\n    };\n    Scanner.prototype.Init = function () {\n        this.pos = -1;\n        this.line = 1;\n        this.col = 0;\n        this.charPos = -1;\n        this.oldEols = 0;\n        this.NextCh();\n        this.pt = this.tokens = new Token(); // first token is a dummy\n    };\n    Scanner.prototype.NextCh = function () {\n        if (this.oldEols > 0) {\n            this.ch = Scanner.EOL;\n            this.oldEols--;\n        }\n        else {\n            this.pos = this.buffer.getPos();\n            // buffer reads unicode chars, if UTF8 has been detected\n            this.ch = this.buffer.Read();\n            this.col++;\n            this.charPos++;\n            // replace isolated '\\r' by '\\n' in order to make\n            // eol handling uniform across Windows, Unix and Mac\n            if (this.ch == 13 /*'\\r'*/ && this.buffer.Peek() != Scanner.EOL /*'\\n'*/)\n                this.ch = Scanner.EOL;\n            if (this.ch == Scanner.EOL) {\n                this.line++;\n                this.col = 0;\n            }\n        }\n-->casing1\n    };\n    Scanner.prototype.AddCh = function () {\n        if (this.ch != Buffer.EOF) {\n            ++this.tlen;\n            this.tval += String.fromCharCode(this.ch);\n            this.NextCh();\n        }\n-->casing2\n    };\n\n-->comments\n\n    Scanner.prototype.CheckLiteral = function () {\n-->literals\n    };\n    Scanner.prototype.NextToken = function () {\n        for (;;) {\n            while (this.ch == 32 /*' '*/ ||\n-->scan1\n                )  this.NextCh();\n-->scan2\n            break;\n        }\n-->scan22\n        var recKind = Scanner.noSym;\n        var recEnd = this.pos;\n        this.t = new Token();\n        this.t.pos = this.pos;\n        this.t.col = this.col;\n        this.t.line = this.line;\n        this.t.charPos = this.charPos;\n        var state = (this.ch == Buffer.EOF) ? -1 : Scanner.start[this.ch];\n        this.tlen = 0;\n        this.tval = \"\";\n        this.AddCh();\n        loop: for (; ;) {\n            switch (state) {\n                case -1: {\n                    this.t.kind = Scanner.eofSym;\n                    break loop;\n                } // NextCh already done\n                case 0: {\n                    if (recKind != Scanner.noSym) {\n                        this.tlen = recEnd - this.t.pos;\n                        this.SetScannerBehindT();\n                    }\n                    this.t.kind = recKind;\n                    break loop;\n                } // NextCh already done\n-->scan3\n            }\n        }\n        this.t.val = this.tval;\n        return this.t;\n    };\n    Scanner.prototype.SetScannerBehindT = function () {\n        this.buffer.setPos(this.t.pos);\n        this.NextCh();\n        this.line = this.t.line;\n        this.col = this.t.col;\n        this.charPos = this.t.charPos;\n        for (var i = 0; i < this.tlen; i++)\n            this.NextCh();\n    };\n    // get the next token (possibly a token already seen during peeking)\n    Scanner.prototype.Scan = function () {\n        if (this.tokens.next == null) {\n            return this.NextToken();\n        }\n        else {\n            this.pt = this.tokens = this.tokens.next;\n            return this.tokens;\n        }\n    };\n    // peek for the next token, ignore pragmas\n    Scanner.prototype.Peek = function () {\n        do {\n            if (this.pt.next == null) {\n                this.pt.next = this.NextToken();\n            }\n            this.pt = this.pt.next;\n        } while (this.pt.kind > Scanner.maxT); // skip pragmas\n        return this.pt;\n    };\n    // make sure that peeking starts at the current scan position\n    Scanner.prototype.ResetPeek = function () { this.pt = this.tokens; };\n    return Scanner;\n}()); // end Scanner\nCocoRJS.Scanner = Scanner;\n/*\nlet scanner : Scanner  = new Scanner(`let a : string = \"str\";`, \"test.txt\");\nlet tok : Token = scanner.Scan()\nwhile(tok.kind != Scanner.eofSym)\n{\n    console.log(tok);\n    tok = scanner.Scan();\n}\n*/\n})(CocoRJS || (CocoRJS = {}));\n\n";
    /*//----End Scanner-js.frame */
    /*//----Start DFA.cs */
    /*-------------------------------------------------------------------------
    DFA.cs -- Generation of the Scanner Automaton
    Compiler Generator Coco/R,
    Copyright (c) 1990, 2004 Hanspeter Moessenboeck, University of Linz
    extended by M. Loeberbauer & A. Woess, Univ. of Linz
    with improvements by Pat Terry, Rhodes University
    
    This program is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the
    Free Software Foundation; either version 2, or (at your option) any
    later version.
    
    This program is distributed in the hope that it will be useful, but
    WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
    for more details.
    
    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
    
    As an exception, it is allowed to write an extension of Coco/R that is
    used as a plugin in non-free software.
    
    If not otherwise stated, any source code generated by Coco/R (other than
    Coco/R itself) does not fall under the GNU General Public License.
    -------------------------------------------------------------------------*/
    //namespace at.jku.ssw.Coco {
    //-----------------------------------------------------------------------------
    //  State
    //-----------------------------------------------------------------------------
    var State = /** @class */ (function () {
        function State() {
        }
        State.prototype.AddAction = function (act) {
            var lasta, a = this.firstAction;
            while (a != null && act.typ >= a.typ) {
                lasta = a;
                a = a.next;
            }
            // collecting classes at the beginning gives better performance
            act.next = a;
            if (a == this.firstAction)
                this.firstAction = act;
            else
                lasta.next = act;
        };
        State.prototype.DetachAction = function (act) {
            var lasta, a = this.firstAction;
            while (a != null && a != act) {
                lasta = a;
                a = a.next;
            }
            if (a != null)
                if (a == this.firstAction)
                    this.firstAction = a.next;
                else
                    lasta.next = a.next;
        };
        State.prototype.MeltWith = function (s) {
            for (var action = s.firstAction; action != null; action = action.next) {
                var a = new Action(action.typ, action.sym, action.tc);
                a.AddTargets(action);
                this.AddAction(a);
            }
        };
        return State;
    }());
    CocoR.State = State;
    //-----------------------------------------------------------------------------
    //  Action
    //-----------------------------------------------------------------------------
    var Action = /** @class */ (function () {
        function Action(typ, sym, tc) {
            this.typ = typ;
            this.sym = sym;
            this.tc = tc;
        }
        Action.prototype.AddTarget = function (t) {
            var last;
            var p = this.target;
            while (p != null && t.state.nr >= p.state.nr) {
                if (t.state == p.state)
                    return;
                last = p;
                p = p.next;
            }
            t.next = p;
            if (p == this.target)
                this.target = t;
            else
                last.next = t;
        };
        Action.prototype.AddTargets = function (a) {
            for (var p = a.target; p != null; p = p.next) {
                var t = new Target(p.state);
                this.AddTarget(t);
            }
            if (a.tc == Node.contextTrans)
                this.tc = Node.contextTrans;
        };
        Action.prototype.Symbols = function (tab) {
            var s;
            if (this.typ == Node.clas)
                s = tab.CharClassSet(this.sym).Clone();
            else {
                s = new CharSet();
                s.Set(this.sym);
            }
            return s;
        };
        Action.prototype.ShiftWith = function (s, tab) {
            if (s.Elements() == 1) {
                this.typ = Node.chr;
                this.sym = s.First();
            }
            else {
                var c = tab.FindCharClass(s);
                if (c == null)
                    c = tab.NewCharClass("#", s); // class with dummy name
                this.typ = Node.clas;
                this.sym = c.n;
            }
        };
        return Action;
    }());
    CocoR.Action = Action;
    //-----------------------------------------------------------------------------
    //  Target
    //-----------------------------------------------------------------------------
    var Target = /** @class */ (function () {
        function Target(s) {
            this.state = s;
        }
        return Target;
    }());
    CocoR.Target = Target;
    //-----------------------------------------------------------------------------
    //  Melted
    //-----------------------------------------------------------------------------
    var Melted = /** @class */ (function () {
        function Melted(set, state) {
            this.set = set;
            this.state = state;
        }
        return Melted;
    }());
    CocoR.Melted = Melted;
    //-----------------------------------------------------------------------------
    //  Comment
    //-----------------------------------------------------------------------------
    var Comment = /** @class */ (function () {
        function Comment(start, stop, nested) {
            this.start = start;
            this.stop = stop;
            this.nested = nested;
        }
        return Comment;
    }());
    CocoR.Comment = Comment;
    //-----------------------------------------------------------------------------
    //  CharSet
    //-----------------------------------------------------------------------------
    var CharSetRange = /** @class */ (function () {
        function CharSetRange(rfrom, rto) {
            this.rfrom = rfrom;
            this.rto = rto;
        }
        CharSetRange.prototype.ToString = function () {
            if (this.rfrom == this.rto)
                return this.rfrom.toString(16);
            if (this.rfrom <= 256 && this.rto <= 256)
                return "".concat(this.rfrom.toString(16), "-").concat(this.rto.toString(16));
            return "".concat(this.rfrom.toString(16), "-").concat(this.rto.toString(16));
        };
        return CharSetRange;
    }());
    CocoR.CharSetRange = CharSetRange;
    var CharSet = /** @class */ (function () {
        function CharSet() {
        }
        CharSet.prototype.ToString = function () {
            if (this.head == null)
                return "[]";
            var sb = new StringBuilder();
            sb.Append("[");
            for (var cur = this.head; cur != null; cur = cur.next) {
                if (cur != this.head)
                    sb.Append("|");
                sb.Append(cur.toString());
            }
            sb.Append("]");
            return sb.ToString();
        };
        CharSet.prototype.Get = function (i) {
            for (var p = this.head; p != null; p = p.next)
                if (i < p.rfrom)
                    return false;
                else if (i <= p.rto)
                    return true; // p.rfrom <= i <= p.rto
            return false;
        };
        CharSet.prototype.Set = function (i) {
            var cur = this.head, prev = null;
            while (cur != null && i >= cur.rfrom - 1) {
                if (i <= cur.rto + 1) { // (cur.rfrom-1) <= i <= (cur.rto+1)
                    if (i == cur.rfrom - 1)
                        cur.rfrom--;
                    else if (i == cur.rto + 1) {
                        cur.rto++;
                        var next = cur.next;
                        if (next != null && cur.rto == next.rfrom - 1) {
                            cur.rto = next.rto;
                            cur.next = next.next;
                        }
                        ;
                    }
                    return;
                }
                prev = cur;
                cur = cur.next;
            }
            var n = new CharSetRange(i, i);
            n.next = cur;
            if (prev == null)
                this.head = n;
            else
                prev.next = n;
        };
        CharSet.prototype.Clone = function () {
            var s = new CharSet();
            var prev = null;
            for (var cur = this.head; cur != null; cur = cur.next) {
                var r = new CharSetRange(cur.rfrom, cur.rto);
                if (prev == null)
                    s.head = r;
                else
                    prev.next = r;
                prev = r;
            }
            return s;
        };
        CharSet.prototype.Equals = function (s) {
            var p = this.head, q = s.head;
            while (p != null && q != null) {
                if (p.rfrom != q.rfrom || p.rto != q.rto)
                    return false;
                p = p.next;
                q = q.next;
            }
            return p == q;
        };
        CharSet.prototype.Elements = function () {
            var n = 0;
            for (var p = this.head; p != null; p = p.next)
                n += p.rto - p.rfrom + 1;
            return n;
        };
        CharSet.prototype.First = function () {
            if (this.head != null)
                return this.head.rfrom;
            return -1;
        };
        CharSet.prototype.Or = function (s) {
            for (var p = s.head; p != null; p = p.next)
                for (var i = p.rfrom; i <= p.rto; i++)
                    this.Set(i);
        };
        CharSet.prototype.And = function (s) {
            var x = new CharSet();
            for (var p = this.head; p != null; p = p.next)
                for (var i = p.rfrom; i <= p.rto; i++)
                    if (s.Get(i))
                        x.Set(i);
            this.head = x.head;
        };
        CharSet.prototype.Subtract = function (s) {
            var x = new CharSet();
            for (var p = this.head; p != null; p = p.next)
                for (var i = p.rfrom; i <= p.rto; i++)
                    if (!s.Get(i))
                        x.Set(i);
            this.head = x.head;
        };
        CharSet.prototype.Includes = function (s) {
            for (var p = s.head; p != null; p = p.next)
                for (var i = p.rfrom; i <= p.rto; i++)
                    if (!this.Get(i))
                        return false;
            return true;
        };
        CharSet.prototype.Intersects = function (s) {
            for (var p = s.head; p != null; p = p.next)
                for (var i = p.rfrom; i <= p.rto; i++)
                    if (this.Get(i))
                        return true;
            return false;
        };
        CharSet.prototype.Fill = function () {
            this.head = new CharSetRange(Char_MinValue, Char_MaxValue);
        };
        return CharSet;
    }());
    CocoR.CharSet = CharSet;
    //-----------------------------------------------------------------------------
    //  Generator
    //-----------------------------------------------------------------------------
    var Generator = /** @class */ (function () {
        function Generator(tab) {
            this.tab = tab;
        }
        Generator.prototype.OpenFrame = function (frame) {
            this.fram = new Buffer(frame);
            return this.fram;
        };
        Generator.prototype.OpenGen = function (target) {
            this.gen = new StringWriter(); /* pdt */
            return this.gen;
        };
        Generator.prototype.GenCopyright = function () {
            try {
                var scannerFram = this.fram;
                this.fram = new Buffer(CocoR.CocoCopyrightFrame);
                this.CopyFramePart(null);
                this.fram = scannerFram;
            }
            catch (_a) {
                throw new FatalError("Cannot open Copyright.frame");
            }
        };
        Generator.prototype.SkipFramePart = function (stop) {
            this.CopyFramePart2(stop, false);
        };
        Generator.prototype.CopyFramePart = function (stop) {
            this.CopyFramePart2(stop, true);
        };
        // if stop == null, copies until end of file
        Generator.prototype.CopyFramePart2 = function (stop, generateOutput) {
            var startCh = 0;
            var endOfStopString = 0;
            if (stop != null) {
                startCh = stop.charCodeAt(0);
                endOfStopString = stop.length - 1;
            }
            var ch = this.framRead();
            while (ch != Buffer.EOF) {
                if (stop != null && ch == startCh) {
                    var i = 0;
                    do {
                        if (i == endOfStopString)
                            return; // stop[0..i] found
                        ch = this.framRead();
                        i++;
                    } while (ch == stop.charCodeAt(i));
                    // stop[0..i-1] found; continue with last read character
                    if (generateOutput)
                        this.gen.Write(stop.substr(0, i));
                }
                else {
                    if (generateOutput)
                        this.gen.Write(String.fromCharCode(ch));
                    ch = this.framRead();
                }
            }
            if (stop != null)
                throw new FatalError("Incomplete or corrupt frame file: " + this.frameFile);
        };
        Generator.prototype.framRead = function () {
            try {
                return this.fram.Read();
            }
            catch (_a) {
                throw new FatalError("Error reading frame file: " + this.frameFile);
            }
        };
        return Generator;
    }());
    CocoR.Generator = Generator;
    var LangGen = /** @class */ (function () {
        function LangGen(langSet, sprefix) {
            this.static_prefix = "public static readonly";
            this.func_prefix = "private ";
            this.type_int_suffix = " : int";
            this.type_str_suffix = " : string";
            this.lang = langSet;
            if (this.lang == "js") {
                this.static_prefix = sprefix + ".";
                this.func_prefix = sprefix + ".prototype.";
                this.type_int_suffix = "";
                this.type_str_suffix = "";
            }
        }
        return LangGen;
    }());
    CocoR.LangGen = LangGen;
    //-----------------------------------------------------------------------------
    //  DFA
    //-----------------------------------------------------------------------------
    var TargetSymBool = /** @class */ (function () {
        function TargetSymBool(targets, endOf, ctx) {
            this.targets = targets;
            this.ctx = ctx;
            this.endOf = endOf;
        }
        return TargetSymBool;
    }());
    CocoR.TargetSymBool = TargetSymBool;
    var DFA = /** @class */ (function () {
        function DFA(parser) {
            this.parser = parser;
            this.tab = parser.tab;
            this.errors = parser.errors;
            this.trace = parser.trace;
            this.firstState = null;
            this.lastState = null;
            this.lastStateNr = -1;
            this.firstState = this.NewState();
            this.firstMelted = null;
            this.firstComment = null;
            this.ignoreCase = false;
            this.dirtyDFA = false;
            this.hasCtxMoves = false;
            this.langGen = this.tab.genJS ? "js" : "ts";
        }
        //---------- Output primitives
        DFA.prototype.ChStrNull = function (ch) {
            if (ch < 32 /*' '*/ || ch >= 127 || ch == 39 /*'\''*/ || ch == 92 /*'\\'*/)
                return null;
            else
                return "'".concat(String.fromCharCode(ch), "'");
        };
        DFA.prototype.ChChar = function (ch) {
            if (ch < 32 /*' '*/ || ch >= 127 || ch == 39 /*'\''*/ || ch == 92 /*'\\'*/)
                return ch.toString();
            else
                return "'".concat(String.fromCharCode(ch), "'");
        };
        DFA.prototype.Ch = function (ch) {
            if (ch < 32 /*' '*/ || ch >= 127 || ch == 39 /*'\''*/ || ch == 92 /*'\\'*/)
                return ch.toString();
            else
                return ch.toString();
        };
        DFA.prototype.ChCom = function (ch) {
            if (ch < 32 /*' '*/ || ch >= 127 || ch == 39 /*'\''*/ || ch == 92 /*'\\'*/)
                return ch.toString();
            else
                return ch.toString() + " /*'".concat(String.fromCharCode(ch), "'*/");
        };
        DFA.prototype.ChCond = function (ch) {
            var str = this.ChStrNull(ch);
            return "this.ch == " + this.Ch(ch) + (str == null ? "" : " /*" + str + "*/");
        };
        DFA.prototype.ChCondAs = function (ch) {
            var str = this.ChStrNull(ch);
            return "(this.ch as int) == " + this.Ch(ch) + (str == null ? "" : " /*" + str + "*/");
        };
        DFA.prototype.ValChCond = function (ch) {
            return "this.valCh == " + this.Ch(ch);
        };
        DFA.prototype.PutRange = function (s, asValCh) {
            if (asValCh === void 0) { asValCh = false; }
            var ch_str = asValCh ? "this.valCh" : "this.ch";
            for (var r = s.head; r != null; r = r.next) {
                if (r.rfrom == r.rto) {
                    this.gen.Write(ch_str + " == " + this.ChCom(r.rfrom));
                }
                else if (r.rfrom == 0) {
                    this.gen.Write(ch_str + " <= " + this.ChCom(r.rto));
                }
                else {
                    this.gen.Write(ch_str + " >= " + this.ChCom(r.rfrom) + " && " + ch_str + " <= " + this.ChCom(r.rto));
                }
                if (r.next != null)
                    this.gen.Write(" || ");
            }
        };
        //---------- State handling
        DFA.prototype.NewState = function () {
            var s = new State();
            s.nr = ++this.lastStateNr;
            if (this.firstState == null)
                this.firstState = s;
            else
                this.lastState.next = s;
            this.lastState = s;
            return s;
        };
        DFA.prototype.NewTransition = function (rfrom, to, typ, sym, tc) {
            var t = new Target(to);
            var a = new Action(typ, sym, tc);
            a.target = t;
            rfrom.AddAction(a);
            if (typ == Node.clas)
                this.curSy.tokenKind = Symbol.classToken;
        };
        DFA.prototype.CombineShifts = function () {
            var state;
            var a, b, c;
            var seta, setb;
            for (state = this.firstState; state != null; state = state.next) {
                for (a = state.firstAction; a != null; a = a.next) {
                    b = a.next;
                    while (b != null)
                        if (a.target.state == b.target.state && a.tc == b.tc) {
                            seta = a.Symbols(this.tab);
                            setb = b.Symbols(this.tab);
                            seta.Or(setb);
                            a.ShiftWith(seta, this.tab);
                            c = b;
                            b = b.next;
                            state.DetachAction(c);
                        }
                        else
                            b = b.next;
                }
            }
        };
        DFA.prototype.FindUsedStates = function (state, used) {
            if (used.Get(state.nr))
                return;
            used.Set(state.nr, true);
            for (var a = state.firstAction; a != null; a = a.next)
                this.FindUsedStates(a.target.state, used);
        };
        DFA.prototype.DeleteRedundantStates = function () {
            var newState = new Array(this.lastStateNr + 1);
            var used = new BitArray(this.lastStateNr + 1);
            this.FindUsedStates(this.firstState, used);
            // combine equal final states
            for (var s1 = this.firstState.next; s1 != null; s1 = s1.next) // firstState cannot be final
                if (used.Get(s1.nr) && s1.endOf != null && s1.firstAction == null && !s1.ctx)
                    for (var s2 = s1.next; s2 != null; s2 = s2.next)
                        if (used.Get(s2.nr) && s1.endOf == s2.endOf && s2.firstAction == null && !s2.ctx) {
                            used.Set(s2.nr, false);
                            newState[s2.nr] = s1;
                        }
            for (var state = this.firstState; state != null; state = state.next)
                if (used.Get(state.nr))
                    for (var a = state.firstAction; a != null; a = a.next)
                        if (!used.Get(a.target.state.nr))
                            a.target.state = newState[a.target.state.nr];
            // delete unused states
            this.lastState = this.firstState;
            this.lastStateNr = 0; // firstState has number 0
            for (var state = this.firstState.next; state != null; state = state.next)
                if (used.Get(state.nr)) {
                    state.nr = ++this.lastStateNr;
                    this.lastState = state;
                }
                else
                    this.lastState.next = state.next;
        };
        DFA.prototype.TheState = function (p) {
            var state;
            if (p == null) {
                state = this.NewState();
                state.endOf = this.curSy;
                return state;
            }
            else
                return p.state;
        };
        DFA.prototype.Step = function (sfrom, p, stepped) {
            if (p == null)
                return;
            stepped.Set(p.n, true);
            switch (p.typ) {
                case Node.clas:
                case Node.chr: {
                    this.NewTransition(sfrom, this.TheState(p.next), p.typ, p.val, p.code);
                    break;
                }
                case Node.alt: {
                    this.Step(sfrom, p.sub, stepped);
                    this.Step(sfrom, p.down, stepped);
                    break;
                }
                case Node.iter: {
                    if (Tab.DelSubGraph(p.sub)) {
                        this.parser.SemErr("contents of {...} must not be deletable");
                        return;
                    }
                    if (p.next != null && !stepped.Get(p.next.n))
                        this.Step(sfrom, p.next, stepped);
                    this.Step(sfrom, p.sub, stepped);
                    if (p.state != sfrom) {
                        this.Step(p.state, p, new BitArray(this.tab.nodes.length));
                    }
                    break;
                }
                case Node.opt: {
                    if (p.next != null && !stepped.Get(p.next.n))
                        this.Step(sfrom, p.next, stepped);
                    this.Step(sfrom, p.sub, stepped);
                    break;
                }
            }
        };
        // Assigns a state n.state to every node n. There will be a transition from
        // n.state to n.next.state triggered by n.val. All nodes in an alternative
        // chain are represented by the same state.
        // Numbering scheme:
        //  - any node after a chr, clas, opt, or alt, must get a new number
        //  - if a nested structure starts with an iteration the iter node must get a new number
        //  - if an iteration follows an iteration, it must get a new number
        DFA.prototype.NumberNodes = function (p, state, renumIter) {
            if (p == null)
                return;
            if (p.state != null)
                return; // already visited;
            if (state == null || (p.typ == Node.iter && renumIter))
                state = this.NewState();
            p.state = state;
            if (Tab.DelGraph(p))
                state.endOf = this.curSy;
            switch (p.typ) {
                case Node.clas:
                case Node.chr: {
                    this.NumberNodes(p.next, null, false);
                    break;
                }
                case Node.opt: {
                    this.NumberNodes(p.next, null, false);
                    this.NumberNodes(p.sub, state, true);
                    break;
                }
                case Node.iter: {
                    this.NumberNodes(p.next, state, true);
                    this.NumberNodes(p.sub, state, true);
                    break;
                }
                case Node.alt: {
                    this.NumberNodes(p.next, null, false);
                    this.NumberNodes(p.sub, state, true);
                    this.NumberNodes(p.down, state, renumIter);
                    break;
                }
            }
        };
        DFA.prototype.FindTrans = function (p, start, marked) {
            if (p == null || marked.Get(p.n))
                return;
            marked.Set(p.n, true);
            if (start)
                this.Step(p.state, p, new BitArray(this.tab.nodes.length)); // start of group of equally numbered nodes
            switch (p.typ) {
                case Node.clas:
                case Node.chr: {
                    this.FindTrans(p.next, true, marked);
                    break;
                }
                case Node.opt: {
                    this.FindTrans(p.next, true, marked);
                    this.FindTrans(p.sub, false, marked);
                    break;
                }
                case Node.iter: {
                    this.FindTrans(p.next, false, marked);
                    this.FindTrans(p.sub, false, marked);
                    break;
                }
                case Node.alt: {
                    this.FindTrans(p.sub, false, marked);
                    this.FindTrans(p.down, false, marked);
                    break;
                }
            }
        };
        DFA.prototype.ConvertToStates = function (p, sym) {
            this.curSy = sym;
            if (Tab.DelGraph(p)) {
                this.parser.SemErr("token might be empty");
                return;
            }
            this.NumberNodes(p, this.firstState, true);
            this.FindTrans(p, true, new BitArray(this.tab.nodes.length));
            if (p.typ == Node.iter) {
                this.Step(this.firstState, p, new BitArray(this.tab.nodes.length));
            }
        };
        // match string against current automaton; store it either as a fixedToken or as a litToken
        DFA.prototype.MatchLiteral = function (s, sym) {
            s = this.tab.Unescape(s.substr(1, s.length - 2));
            var i, len = s.length;
            var state = this.firstState;
            var a = null;
            for (i = 0; i < len; i++) { // try to match s against existing DFA
                a = this.FindAction(state, s.charCodeAt(i));
                if (a == null)
                    break;
                state = a.target.state;
            }
            // if s was not totally consumed or leads to a non-final state => make new DFA from it
            if (i != len || state.endOf == null) {
                state = this.firstState;
                i = 0;
                a = null;
                this.dirtyDFA = true;
            }
            for (; i < len; i++) { // make new DFA for s[i..len-1], ML: i is either 0 or len
                var to = this.NewState();
                this.NewTransition(state, to, Node.chr, s.charCodeAt(i), Node.normalTrans);
                state = to;
            }
            var matchedSym = state.endOf;
            if (matchedSym == null) {
                state.endOf = sym;
            }
            else if (matchedSym.tokenKind == Symbol.fixedToken || (a != null && a.tc == Node.contextTrans)) {
                // s matched a token with a fixed definition or a token with an appendix that will be cut off
                this.parser.SemErr("tokens " + sym.name + " and " + matchedSym.name + " cannot be distinguished");
            }
            else { // matchedSym == classToken || classLitToken
                matchedSym.tokenKind = Symbol.classLitToken;
                sym.tokenKind = Symbol.litToken;
            }
        };
        DFA.prototype.SplitActions = function (state, a, b) {
            var c;
            var seta, setb, setc;
            seta = a.Symbols(this.tab);
            setb = b.Symbols(this.tab);
            if (seta.Equals(setb)) {
                a.AddTargets(b);
                state.DetachAction(b);
            }
            else if (seta.Includes(setb)) {
                setc = seta.Clone();
                setc.Subtract(setb);
                b.AddTargets(a);
                a.ShiftWith(setc, this.tab);
            }
            else if (setb.Includes(seta)) {
                setc = setb.Clone();
                setc.Subtract(seta);
                a.AddTargets(b);
                b.ShiftWith(setc, this.tab);
            }
            else {
                setc = seta.Clone();
                setc.And(setb);
                seta.Subtract(setc);
                setb.Subtract(setc);
                a.ShiftWith(seta, this.tab);
                b.ShiftWith(setb, this.tab);
                c = new Action(0, 0, Node.normalTrans); // typ and sym are set in ShiftWith
                c.AddTargets(a);
                c.AddTargets(b);
                c.ShiftWith(setc, this.tab);
                state.AddAction(c);
            }
        };
        DFA.prototype.Overlap = function (a, b) {
            var seta, setb;
            if (a.typ == Node.chr)
                if (b.typ == Node.chr)
                    return a.sym == b.sym;
                else {
                    setb = this.tab.CharClassSet(b.sym);
                    return setb.Get(a.sym);
                }
            else {
                seta = this.tab.CharClassSet(a.sym);
                if (b.typ == Node.chr)
                    return seta.Get(b.sym);
                else {
                    setb = this.tab.CharClassSet(b.sym);
                    return seta.Intersects(setb);
                }
            }
        };
        DFA.prototype.MakeUnique = function (state) {
            var changed;
            do {
                changed = false;
                for (var a = state.firstAction; a != null; a = a.next)
                    for (var b = a.next; b != null; b = b.next)
                        if (this.Overlap(a, b)) {
                            this.SplitActions(state, a, b);
                            changed = true;
                        }
            } while (changed);
        };
        DFA.prototype.MeltStates = function (state) {
            var tsb;
            for (var action = state.firstAction; action != null; action = action.next) {
                if (action.target.next != null) {
                    tsb = this.GetTargetStates(action);
                    var melt = this.StateWithSet(tsb.targets);
                    if (melt == null) {
                        var s = this.NewState();
                        s.endOf = tsb.endOf;
                        s.ctx = tsb.ctx;
                        for (var targ = action.target; targ != null; targ = targ.next)
                            s.MeltWith(targ.state);
                        this.MakeUnique(s);
                        melt = this.NewMelted(tsb.targets, s);
                    }
                    action.target.next = null;
                    action.target.state = melt.state;
                }
            }
        };
        DFA.prototype.FindCtxStates = function () {
            for (var state = this.firstState; state != null; state = state.next)
                for (var a = state.firstAction; a != null; a = a.next)
                    if (a.tc == Node.contextTrans)
                        a.target.state.ctx = true;
        };
        DFA.prototype.MakeDeterministic = function () {
            var state;
            this.lastSimState = this.lastState.nr;
            this.maxStates = 2 * this.lastSimState; // heuristic for set size in Melted.set
            this.FindCtxStates();
            for (state = this.firstState; state != null; state = state.next)
                this.MakeUnique(state);
            for (state = this.firstState; state != null; state = state.next)
                this.MeltStates(state);
            this.DeleteRedundantStates();
            this.CombineShifts();
        };
        DFA.prototype.PrintStates = function () {
            this.trace.WriteLine();
            this.trace.WriteLine("---------- states ----------");
            for (var state = this.firstState; state != null; state = state.next) {
                var first = true;
                if (state.endOf == null)
                    this.trace.Write("               ");
                else
                    this.trace.Write(sprintf("E(%12s)", this.tab.Name(state.endOf.name)));
                this.trace.Write(sprintf("%3d:", state.nr));
                if (state.firstAction == null)
                    this.trace.WriteLine();
                for (var action = state.firstAction; action != null; action = action.next) {
                    if (first) {
                        this.trace.Write(" ");
                        first = false;
                    }
                    else
                        this.trace.Write("                    ");
                    if (action.typ == Node.clas)
                        this.trace.Write((this.tab.classes[action.sym]).name);
                    else
                        this.trace.Write(sprintf("%3s", this.ChChar(action.sym)));
                    for (var targ = action.target; targ != null; targ = targ.next)
                        this.trace.Write(sprintf(" %3d", targ.state.nr));
                    if (action.tc == Node.contextTrans)
                        this.trace.WriteLine(" context");
                    else
                        this.trace.WriteLine();
                }
            }
            this.trace.WriteLine();
            this.trace.WriteLine("---------- character classes ----------");
            this.tab.WriteCharClasses();
        };
        //---------------------------- actions --------------------------------
        DFA.prototype.FindAction = function (state, ch) {
            for (var a = state.firstAction; a != null; a = a.next)
                if (a.typ == Node.chr && ch == a.sym)
                    return a;
                else if (a.typ == Node.clas) {
                    var s = this.tab.CharClassSet(a.sym);
                    if (s.Get(ch))
                        return a;
                }
            return null;
        };
        DFA.prototype.GetTargetStates = function (a) {
            var tsb;
            // compute the set of target states
            tsb = new TargetSymBool(new BitArray(this.maxStates), null, false);
            for (var t = a.target; t != null; t = t.next) {
                var stateNr = t.state.nr;
                if (stateNr <= this.lastSimState)
                    tsb.targets.Set(stateNr, true);
                else
                    tsb.targets.Or(this.MeltedSet(stateNr));
                if (t.state.endOf != null)
                    if (tsb.endOf == null || tsb.endOf == t.state.endOf)
                        tsb.endOf = t.state.endOf;
                    else
                        this.errors.SemErr("Tokens " + tsb.endOf.name + " and " + t.state.endOf.name + " cannot be distinguished");
                if (t.state.ctx) {
                    tsb.ctx = true;
                    // The following check seems to be unnecessary. It reported an error
                    // if a symbol + context was the prefix of another symbol, e.g.
                    //   s1 = "a" "b" "c".
                    //   s2 = "a" CONTEXT("b").
                    // But this is ok.
                    // if (t.state.endOf != null) {
                    //   Console.WriteLine("Ambiguous context clause");
                    //	 errors.count++;
                    // }
                }
            }
            return tsb;
        };
        DFA.prototype.NewMelted = function (set, state) {
            var m = new Melted(set, state);
            m.next = this.firstMelted;
            this.firstMelted = m;
            return m;
        };
        DFA.prototype.MeltedSet = function (nr) {
            var m = this.firstMelted;
            while (m != null) {
                if (m.state.nr == nr)
                    return m.set;
                else
                    m = m.next;
            }
            throw new FatalError("compiler error in Melted.Set");
        };
        DFA.prototype.StateWithSet = function (s) {
            for (var m = this.firstMelted; m != null; m = m.next)
                if (Sets.Equals(s, m.set))
                    return m;
            return null;
        };
        DFA.prototype.CommentStr = function (p) {
            var s = new StringBuilder();
            while (p != null) {
                if (p.typ == Node.chr) {
                    s.Append(String.fromCharCode(p.val));
                }
                else if (p.typ == Node.clas) {
                    var set = this.tab.CharClassSet(p.val);
                    if (set.Elements() != 1)
                        this.parser.SemErr("character set contains more than 1 character");
                    s.Append(String.fromCharCode(set.First()));
                }
                else
                    this.parser.SemErr("comment delimiters may not be structured");
                p = p.next;
            }
            if (s.Length() == 0 || s.Length() > 8) {
                this.parser.SemErr("comment delimiters must be between 1 to 8 characters long");
                return "?";
            }
            return s.ToString();
        };
        DFA.prototype.NewComment = function (nfrom, to, nested) {
            var c = new Comment(this.CommentStr(nfrom), this.CommentStr(to), nested);
            c.next = this.firstComment;
            this.firstComment = c;
        };
        //------------------------ scanner generation ----------------------
        DFA.prototype.GenCommentIndented = function (n, s) {
            for (var i = 1; i < n; ++i)
                this.gen.Write("\t");
            this.gen.Write(s);
        };
        DFA.prototype.GenComBody = function (com) {
            var imax = com.start.length - 1;
            var condStr = (this.langGen == "js") ? this.ChCond(com.stop.charCodeAt(0)) : this.ChCondAs(com.stop.charCodeAt(0));
            this.gen.WriteLine("\t\t\tfor(;;) {");
            this.gen.Write("\t\t\t\tif (" + condStr + ") ");
            this.gen.WriteLine("{");
            if (com.stop.length == 1) {
                this.gen.WriteLine("\t\t\t\t\tlevel--;");
                this.gen.WriteLine("\t\t\t\t\tif (level == 0) { this.oldEols = this.line - line0; this.NextCh(); return true; }");
                this.gen.WriteLine("\t\t\t\t\tthis.NextCh();");
            }
            else {
                var imaxStop = com.stop.length - 1;
                for (var sidx = 1; sidx <= imaxStop; ++sidx) {
                    condStr = (this.langGen == "js") ? this.ChCond(com.stop.charCodeAt(sidx)) : this.ChCondAs(com.stop.charCodeAt(sidx));
                    this.gen.WriteLine("\t\t\t\t\tthis.NextCh();");
                    this.gen.WriteLine("\t\t\t\t\tif (" + condStr + ") {");
                }
                this.gen.WriteLine("\t\t\t\t\t\tlevel--;");
                this.gen.WriteLine("\t\t\t\t\t\tif (level == 0) { /*this.oldEols = this.line - line0;*/ this.NextCh(); return true; }");
                this.gen.WriteLine("\t\t\t\t\t\tthis.NextCh();");
                for (var sidx = imaxStop; sidx > 0; --sidx) {
                    this.gen.WriteLine("\t\t\t\t\t}");
                }
            }
            if (com.nested) {
                condStr = (this.langGen == "js") ? this.ChCond(com.start.charCodeAt(0)) : this.ChCondAs(com.start.charCodeAt(0));
                this.gen.WriteLine("\t\t\t\t}");
                this.gen.Write(" else if (" + condStr + ") {");
                if (com.start.length == 1)
                    this.gen.WriteLine("\t\t\t\t\tlevel++; this.NextCh();");
                else {
                    var imaxN = com.start.length - 1;
                    for (var sidx = 1; sidx <= imaxN; ++sidx) {
                        this.gen.WriteLine("\t\t\t\t\tthis.NextCh();");
                        condStr = (this.langGen == "js") ? this.ChCond(com.start.charCodeAt(sidx)) : this.ChCondAs(com.start.charCodeAt(sidx));
                        this.gen.WriteLine("\t\t\t\t\tif (" + condStr + ") {");
                    }
                    this.gen.WriteLine("\t\t\t\t\t\tlevel++; this.NextCh();");
                    for (var sidx = imaxN; sidx > 0; --sidx) {
                        this.gen.WriteLine("\t\t\t\t\t}");
                    }
                }
            }
            this.gen.WriteLine("\t\t\t\t} else if (this.ch == Buffer.EOF) return false;");
            this.gen.WriteLine("\t\t\t\telse this.NextCh();");
            this.gen.WriteLine("\t\t\t}");
        };
        DFA.prototype.GenComment = function (com, i) {
            this.gen.WriteLine();
            if (this.langGen == "js") {
                this.gen.WriteLine("\tScanner.prototype.Comment" + i + " = function() {");
                this.gen.WriteLine("\t\tlet level = 1, pos0 = this.pos, line0 = this.line, col0 = this.col, charPos0 = this.charPos;");
            }
            else {
                this.gen.WriteLine("\tComment" + i + "() : bool {");
                this.gen.WriteLine("\t\tlet level : int = 1, pos0 = this.pos, line0 = this.line, col0 = this.col, charPos0 = this.charPos;");
            }
            this.gen.WriteLine("\t\tthis.NextCh();");
            if (com.start.length == 1) {
                this.GenComBody(com);
            }
            else {
                var imax = com.start.length - 1;
                for (var sidx = 1; sidx <= imax; ++sidx) {
                    var condStr = (this.langGen == "js") ? this.ChCond(com.start.charCodeAt(sidx)) : this.ChCondAs(com.start.charCodeAt(sidx));
                    this.gen.WriteLine("\t\tif (" + condStr + ") {");
                    this.gen.WriteLine("\t\t\tthis.NextCh();");
                }
                this.GenComBody(com);
                for (var sidx = imax; sidx > 0; --sidx) {
                    this.gen.WriteLine("\t\t}");
                }
                this.gen.WriteLine("\t\tthis.buffer.setPos(pos0); this.NextCh(); this.line = line0; this.col = col0; this.charPos = charPos0;");
                this.gen.WriteLine("\t\treturn false;");
            }
            this.gen.WriteLine("\t}");
        };
        DFA.prototype.SymName = function (sym) {
            if (CharIsLetter(sym.name.charCodeAt(0))) { // real name value is stored in Tab.literals
                for (var k in this.tab.literals)
                    if (this.tab.literals.hasOwnProperty(k) && this.tab.literals[k] == sym)
                        return k;
            }
            return sym.name;
        };
        DFA.prototype.GenLiterals = function () {
            if (this.ignoreCase) {
                this.gen.WriteLine("\t\tswitch (this.t.val.toLowerCase()) {");
            }
            else {
                this.gen.WriteLine("\t\tswitch (this.t.val) {");
            }
            for (var _i = 0, _a = [this.tab.terminals, this.tab.pragmas]; _i < _a.length; _i++) {
                var ts = _a[_i];
                for (var _b = 0, ts_1 = ts; _b < ts_1.length; _b++) {
                    var sym = ts_1[_b];
                    if (sym.tokenKind == Symbol.litToken) {
                        var name_1 = this.SymName(sym);
                        if (this.ignoreCase)
                            name_1 = name_1.toLowerCase();
                        // sym.name stores literals with quotes, e.g. "\"Literal\""
                        this.gen.WriteLine("\t\t\tcase " + name_1 + ": this.t.kind = " + sym.n + "; break;");
                    }
                }
            }
            this.gen.WriteLine("\t\t\tdefault: break;");
            this.gen.Write("\t\t}");
        };
        DFA.prototype.hasEqAttribute = function (action, attr) {
            var rc = false;
            var tgt = action.target;
            if (tgt != null) {
                var st = tgt.state;
                while (st != null) {
                    var sy = st.endOf;
                    if (sy != null) {
                        rc = sy.eqAttribute == attr;
                        break;
                    }
                    else
                        st = st.next;
                }
            }
            return rc;
        };
        DFA.prototype.WriteState = function (state) {
            var endOf = state.endOf;
            this.gen.WriteLine("\t\t\tcase " + state.nr + ":");
            if (endOf != null && state.firstAction != null) {
                this.gen.WriteLine("\t\t\t\trecEnd = this.pos; recKind = " + endOf.n + " /* " + endOf.name + " */;");
            }
            var ctxEnd = state.ctx;
            for (var action = state.firstAction; action != null; action = action.next) {
                var asValCh = this.hasEqAttribute(action, 64 /*'@'*/);
                if (action == state.firstAction)
                    this.gen.Write("\t\t\t\tif (");
                else
                    this.gen.Write("\t\t\t\telse if (");
                if (action.typ == Node.chr)
                    this.gen.Write(asValCh ? this.ValChCond(action.sym) : this.ChCond(action.sym));
                else
                    this.PutRange(this.tab.CharClassSet(action.sym), asValCh);
                this.gen.Write(") {");
                if (action.tc == Node.contextTrans) {
                    this.gen.Write("apx++; ");
                    ctxEnd = false;
                }
                else if (state.ctx)
                    this.gen.Write("apx = 0; ");
                this.gen.Write("this.AddCh(); state = " + action.target.state.nr + "; break;");
                this.gen.WriteLine("}");
            }
            if (state.firstAction == null)
                this.gen.Write("\t\t\t\t{");
            else
                this.gen.Write("\t\t\t\telse {");
            if (ctxEnd) { // final context state: cut appendix
                this.gen.WriteLine();
                this.gen.WriteLine("\t\t\t\t\tthis.tlen -= apx;");
                this.gen.WriteLine("\t\t\t\t\tthis.SetScannerBehindT();");
                this.gen.Write("\t\t\t\t\t");
            }
            if (endOf == null) {
                this.gen.WriteLine("state = 0; break;}");
            }
            else {
                this.gen.Write("this.t.kind = " + endOf.n + " /* " + endOf.name + " */; ");
                if (endOf.semPos != null && endOf.typ == Node.t) {
                    this.gen.Write(" {");
                    this.parser.pgen.CopySourcePartPPG(this.parser, this.gen, endOf.semPos, 0);
                    this.gen.Write("};");
                }
                if (endOf.tokenKind == Symbol.classLitToken) {
                    this.gen.WriteLine("this.t.val = this.tval; this.CheckLiteral(); return this.t;}");
                }
                else {
                    this.gen.WriteLine("break loop;}");
                }
            }
        };
        DFA.prototype.WriteStartTab = function () {
            for (var action = this.firstState.firstAction; action != null; action = action.next) {
                var targetState = action.target.state.nr;
                if (action.typ == Node.chr) {
                    this.gen.WriteLine("\t\tScanner.start[" + action.sym + "] = " + targetState + "; ");
                }
                else {
                    var s = this.tab.CharClassSet(action.sym);
                    var prefix = "\t\tfor (" + (this.langGen == "js" ? "var i" : "let i : int") + " = ";
                    for (var r = s.head; r != null; r = r.next) {
                        this.gen.WriteLine(prefix + r.rfrom + "; i <= " + r.rto + "; ++i) Scanner.start[i] = " + targetState + ";");
                    }
                }
            }
            this.gen.WriteLine("\t\t//Scanner.start[Buffer.EOF] = -1;");
        };
        DFA.prototype.WriteScanner = function () {
            var g = new Generator(this.tab);
            this.fram = g.OpenFrame(CocoR.CocoScannerFrame);
            this.gen = g.OpenGen("Scanner.cs");
            if (this.dirtyDFA)
                this.MakeDeterministic();
            g.GenCopyright();
            g.SkipFramePart("-->begin");
            g.CopyFramePart("-->namespace");
            if (this.tab.nsName != null && this.tab.nsName.length > 0) {
                this.gen.Write("namespace ");
                this.gen.Write(this.tab.nsName);
                this.gen.Write(" {");
            }
            g.CopyFramePart("-->declarations");
            if (this.langGen == "js") {
                this.gen.WriteLine("\tScanner.maxT = " + (this.tab.terminals.length - 1) + ";");
                this.gen.WriteLine("\tScanner.noSym = " + this.tab.noSym.n + ";");
            }
            else {
                this.gen.WriteLine("\tpublic static readonly maxT : int = " + (this.tab.terminals.length - 1) + ";");
                this.gen.WriteLine("\tpublic static readonly noSym : int = " + this.tab.noSym.n + ";");
            }
            if (this.ignoreCase)
                this.gen.Write("\tlet valCh : char;       // current input character (for token.val)");
            g.CopyFramePart("-->initialization");
            this.WriteStartTab();
            g.CopyFramePart("-->casing1");
            if (this.ignoreCase) {
                this.gen.WriteLine("\t\tif (this.ch != Buffer.EOF) {");
                this.gen.WriteLine("\t\t\tthis.valCh = (char) this.ch;");
                this.gen.WriteLine("\t\t\tch = char.toLowerCase((char) this.ch);");
                this.gen.WriteLine("\t\t}");
            }
            g.CopyFramePart("-->casing2");
            this.gen.Write("\t\t\t//this.tval[this.tlen++] = ");
            if (this.ignoreCase)
                this.gen.Write("this.valCh;");
            else
                this.gen.Write("(char) ch;");
            g.CopyFramePart("-->comments");
            var com = this.firstComment;
            var comIdx = 0;
            while (com != null) {
                this.GenComment(com, comIdx);
                com = com.next;
                comIdx++;
            }
            g.CopyFramePart("-->literals");
            this.GenLiterals();
            g.CopyFramePart("-->scan1");
            this.gen.Write("\t\t\t\t");
            if (this.tab.ignored.Elements() > 0) {
                this.PutRange(this.tab.ignored);
            }
            else {
                this.gen.Write("false");
            }
            g.CopyFramePart("-->scan2");
            if (this.firstComment != null) {
                this.gen.Write("\t\t\tif (");
                com = this.firstComment;
                comIdx = 0;
                while (com != null) {
                    this.gen.Write(this.ChCond(com.start.charCodeAt(0)));
                    this.gen.Write(" && this.Comment" + comIdx + "()");
                    if (com.next != null)
                        this.gen.Write(" ||");
                    com = com.next;
                    comIdx++;
                }
                this.gen.Write(") continue;");
            }
            g.CopyFramePart("-->scan22");
            if (this.hasCtxMoves) {
                this.gen.WriteLine();
                if (this.langGen == "js")
                    this.gen.Write("\t\tvar apx = 0;");
                else
                    this.gen.Write("\t\tlet apx : int = 0;");
            } /* pdt */
            g.CopyFramePart("-->scan3");
            for (var state = this.firstState.next; state != null; state = state.next)
                this.WriteState(state);
            g.CopyFramePart(null);
            if (this.tab.nsName != null && this.tab.nsName.length > 0)
                this.gen.Write("}");
            if (this.parser.pgen.writeBufferTo)
                this.parser.pgen.writeBufferTo("WriteScanner", this.gen.ToString());
            else
                console.log(this.gen.ToString());
            this.gen.Close();
        };
        return DFA;
    }()); // end DFA
    CocoR.DFA = DFA;
    //} // end namespace
    /*//----End DFA.ts */
    /*//----Start Parser.ts */
    /*----------------------------------------------------------------------
    Compiler Generator Coco/R,
    Copyright (c) 1990, 2004 Hanspeter Moessenboeck, University of Linz
    extended by M. Loeberbauer & A. Woess, Univ. of Linz
    with improvements by Pat Terry, Rhodes University
    
    This program is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the
    Free Software Foundation; either version 2, or (at your option) any
    later version.
    
    This program is distributed in the hope that it will be useful, but
    WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
    for more details.
    
    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
    
    As an exception, it is allowed to write an extension of Coco/R that is
    used as a plugin in non-free software.
    
    If not otherwise stated, any source code generated by Coco/R (other than
    Coco/R itself) does not fall under the GNU General Public License.
    -----------------------------------------------------------------------*/
    var Parser = /** @class */ (function () {
        function Parser(scanner) {
            this.errDist = Parser.minErrDist;
            this.log = console.log;
            this.genScanner = false;
            this.tokenString = null; // used in declarations of literal tokens
            this.noString = "-none-"; // used in declarations of literal tokens
            this.gramName = null; // grammar name
            this.scanner = scanner;
            this.errors = new Errors(this.scanner.parseFileName);
        }
        /*-------------------------------------------------------------------------*/
        Parser.prototype.symbols = function (name) {
            return null;
        };
        Parser.prototype.SynErr = function (n) {
            if (this.errDist >= Parser.minErrDist)
                this.errors.SynErr(this.la.line, this.la.col, n);
            this.errDist = 0;
        };
        Parser.prototype.SemErr = function (msg) {
            if (this.errDist >= Parser.minErrDist)
                this.errors.SemErrLineColStr(this.t.line, this.t.col, msg);
            this.errDist = 0;
        };
        Parser.prototype.Get = function () {
            for (;;) {
                //this.log(this.t, this.la);
                this.t = this.la;
                this.la = this.scanner.Scan();
                if (this.la.kind <= Parser.maxT) {
                    ++this.errDist;
                    break;
                }
                if (this.la.kind == Parser._ddtSym) {
                    this.tab.SetDDT(this.la.val);
                }
                if (this.la.kind == Parser._optionSym) {
                    this.tab.SetOption(this.la.val);
                }
                this.la = this.t;
            }
        };
        Parser.prototype.isKind = function (t, n) {
            var k = t.kind;
            while (k >= 0) {
                if (k == n)
                    return true;
                k = Parser.tBase[k];
            }
            return false;
        };
        Parser.prototype.Expect = function (n) {
            if (this.isKind(this.la, n))
                this.Get();
            else {
                this.SynErr(n);
            }
        };
        Parser.prototype.StartOf = function (s) {
            return Parser.set[s][this.la.kind];
        };
        Parser.prototype.ExpectWeak = function (n, follow) {
            if (this.isKind(this.la, n))
                this.Get();
            else {
                this.SynErr(n);
                while (!this.StartOf(follow))
                    this.Get();
            }
        };
        Parser.prototype.WeakSeparator = function (n, syFol, repFol) {
            var kind = this.la.kind;
            if (this.isKind(this.la, n)) {
                this.Get();
                return true;
            }
            else if (this.StartOf(repFol)) {
                return false;
            }
            else {
                this.SynErr(n);
                while (!(Parser.set[syFol][kind] || Parser.set[repFol][kind] || Parser.set[0][kind])) {
                    this.Get();
                    kind = this.la.kind;
                }
                return this.StartOf(syFol);
            }
        };
        Parser.prototype.SkipNested = function (leftKind, rightKind) {
            // manage nested braces
            if (this.la.kind != rightKind) {
                for (var nested = 1; nested > 0;) {
                    //print("==", this.la.line, nested, this.la.kind, this.la.val);
                    if (this.la.kind == leftKind)
                        ++nested;
                    this.Get();
                    if (this.la.kind == rightKind)
                        --nested;
                    else if (this.la.kind == Parser._EOF)
                        break;
                }
            }
        };
        Parser.prototype.SkipTill = function (endKind) {
            while (this.la.kind != endKind || this.la.kind != Parser._EOF) {
                this.Get();
            }
        };
        Parser.prototype.SkipTillEOL = function () {
            var currLine = this.la.line;
            while (this.la.line == currLine || this.la.kind != Parser._EOF) {
                this.Get();
            }
        };
        Parser.prototype.Coco_NT = function () {
            var sym;
            var g, g1, g2;
            var s;
            var beg, line;
            if (this.StartOf(1 /* any   */)) {
                this.Get();
                beg = this.t.pos;
                line = this.t.line;
                while (this.StartOf(1 /* any   */)) {
                    this.Get();
                }
                this.pgen.usingPos = new Position(beg, this.la.pos, 0, line);
            }
            this.Expect(6 /* "COMPILER" */);
            this.genScanner = true;
            this.tab.ignored = new CharSet();
            this.Expect(Parser._ident);
            this.gramName = this.t.val;
            beg = this.la.pos;
            line = this.la.line;
            while (this.StartOf(2 /* any   */)) {
                this.Get();
            }
            this.tab.semDeclPos = new Position(beg, this.la.pos, 0, line);
            if (this.isKind(this.la, 7 /* "IGNORECASE" */)) {
                this.Get();
                this.dfa.ignoreCase = true;
            }
            if (this.isKind(this.la, 8 /* "TERMINALS" */)) {
                this.Get();
                while (this.isKind(this.la, Parser._ident)) {
                    this.Get();
                    sym = this.tab.FindSym(this.t.val);
                    if (sym != null)
                        this.SemErr("name declared twice");
                    else {
                        sym = this.tab.NewSym(Node.t, this.t.val, this.t.line, this.t.col);
                        sym.tokenKind = Symbol.fixedToken;
                    }
                }
            }
            if (this.isKind(this.la, 9 /* "CHARACTERS" */)) {
                this.Get();
                while (this.isKind(this.la, Parser._ident)) {
                    this.SetDecl_NT();
                }
            }
            if (this.isKind(this.la, 10 /* "TOKENS" */)) {
                this.Get();
                while (this.isKind(this.la, Parser._ident) || this.isKind(this.la, Parser._string) || this.isKind(this.la, Parser._char)) {
                    this.TokenDecl_NT(Node.t);
                }
            }
            if (this.isKind(this.la, 11 /* "PRAGMAS" */)) {
                this.Get();
                while (this.isKind(this.la, Parser._ident) || this.isKind(this.la, Parser._string) || this.isKind(this.la, Parser._char)) {
                    this.TokenDecl_NT(Node.pr);
                }
            }
            while (this.isKind(this.la, 12 /* "COMMENTS" */)) {
                this.Get();
                var nested = false;
                this.Expect(13 /* "FROM" */);
                g1 = this.TokenExpr_NT();
                this.Expect(14 /* "TO" */);
                g2 = this.TokenExpr_NT();
                if (this.isKind(this.la, 15 /* "NESTED" */)) {
                    this.Get();
                    nested = true;
                }
                this.dfa.NewComment(g1.l, g2.l, nested);
            }
            while (this.isKind(this.la, 16 /* "IGNORE" */)) {
                this.Get();
                s = this.Set_NT();
                this.tab.ignored.Or(s);
            }
            if (this.isKind(this.la, 17 /* "SYMBOLTABLES" */)) {
                this.Get();
                while (this.isKind(this.la, Parser._ident)) {
                    this.SymboltableDecl_NT();
                }
            }
            while (!(this.isKind(this.la, Parser._EOF) || this.isKind(this.la, 18 /* "PRODUCTIONS" */))) {
                this.SynErr(50);
                this.Get();
            }
            this.Expect(18 /* "PRODUCTIONS" */);
            if (this.genScanner)
                this.dfa.MakeDeterministic();
            this.tab.DeleteNodes();
            while (this.isKind(this.la, Parser._ident)) {
                this.Get();
                sym = this.tab.FindSym(this.t.val);
                var undef = sym == null;
                if (undef)
                    sym = this.tab.NewSym(Node.nt, this.t.val, this.t.line, this.t.col);
                else {
                    if (sym.typ == Node.nt) {
                        if (sym.graph != null)
                            this.SemErr("name declared twice");
                    }
                    else
                        this.SemErr("this symbol kind not allowed on left side of production");
                    sym.line = this.t.line;
                    sym.col = this.t.col;
                }
                var noAttrs = sym.attrPos == null;
                sym.attrPos = null;
                var noRet = sym.retVar == null;
                sym.retVar = null;
                if (this.isKind(this.la, 29 /* "<" */) || this.isKind(this.la, 34 /* "<." */)) {
                    this.AttrDecl_NT(sym);
                }
                if (!undef)
                    if (noAttrs != (sym.attrPos == null)
                        || noRet != (sym.retVar == null))
                        this.SemErr("attribute mismatch between declaration and use of this symbol");
                if (this.isKind(this.la, 47 /* "(." */)) {
                    sym.semPos = this.SemText_NT();
                }
                this.ExpectWeak(19 /* "=" */, 3);
                g = this.Expression_NT();
                sym.graph = g.l;
                this.tab.Finish(g);
                this.ExpectWeak(20 /* "." */, 4);
            }
            this.Expect(21 /* "END" */);
            this.Expect(Parser._ident);
            if (this.gramName != this.t.val)
                this.SemErr("name does not match grammar name");
            this.tab.gramSy = this.tab.FindSym(this.gramName);
            if (this.tab.gramSy == null)
                this.SemErr("missing production for grammar name");
            else {
                sym = this.tab.gramSy;
                if (sym.attrPos != null)
                    this.SemErr("grammar symbol must not have attributes");
            }
            this.tab.noSym = this.tab.NewSym(Node.t, "???", 0, 0); // noSym gets highest number
            this.tab.SetupAnys();
            this.tab.RenumberPragmas();
            if (this.tab.ddt[2])
                this.tab.PrintNodes();
            if (this.errors.count == 0) {
                this.log("checking");
                this.tab.CompSymbolSets();
                if (this.tab.ddt[7])
                    this.tab.XRef();
                var doGenCode = false;
                if (this.tab.ignoreErrors) {
                    doGenCode = true;
                    this.tab.GrammarCheckAll();
                }
                else
                    doGenCode = this.tab.GrammarOk();
                if (this.tab.genRREBNF && doGenCode) {
                    this.pgen.WriteRREBNF();
                }
                if (doGenCode) {
                    this.log("parser");
                    this.pgen.WriteParser();
                    if (this.genScanner) {
                        this.log(" + scanner");
                        this.dfa.WriteScanner();
                        if (this.tab.ddt[0])
                            this.dfa.PrintStates();
                    }
                    this.log(" generated");
                    if (this.tab.ddt[8])
                        this.pgen.WriteStatistics();
                }
            }
            if (this.tab.ddt[6])
                this.tab.PrintSymbolTable();
            this.Expect(20 /* "." */);
        };
        Parser.prototype.SetDecl_NT = function () {
            var s;
            this.Expect(Parser._ident);
            var name = this.t.val;
            var c = this.tab.FindCharClassByName(name);
            if (c != null)
                this.SemErr("name declared twice");
            this.Expect(19 /* "=" */);
            s = this.Set_NT();
            if (s.Elements() == 0)
                this.SemErr("character set must not be empty");
            this.tab.NewCharClass(name, s);
            this.Expect(20 /* "." */);
        };
        Parser.prototype.TokenDecl_NT = function (typ) {
            var s, sym, g;
            var inherits, inheritsSym;
            s = this.Sym_NT();
            sym = this.tab.FindSym(s.name);
            if (sym != null)
                this.SemErr("name declared twice");
            else {
                sym = this.tab.NewSym(typ, s.name, this.t.line, this.t.col);
                sym.tokenKind = Symbol.fixedToken;
            }
            this.tokenString = null;
            if (this.isKind(this.la, 27 /* ":" */)) {
                this.Get();
                inherits = this.Sym_NT();
                inheritsSym = this.tab.FindSym(inherits.name);
                if (inheritsSym == null)
                    this.SemErr("token '" + sym.name + "' can't inherit from '" + inherits.name + "', name not declared");
                else if (inheritsSym == sym)
                    this.SemErr("token '" + sym.name + "' must not inherit from self");
                else if (inheritsSym.typ != typ)
                    this.SemErr("token '" + sym.name + "' can't inherit from '" + inheritsSym.name + "'");
                else
                    sym.inherits = inheritsSym;
            }
            while (!(this.StartOf(5 /* sync  */))) {
                this.SynErr(51);
                this.Get();
            }
            if (this.isKind(this.la, 19 /* "=" */) || this.isKind(this.la, 28 /* "@" */)) {
                if (this.isKind(this.la, 28 /* "@" */)) {
                    this.Get();
                    sym.eqAttribute = this.t.val.charCodeAt(0);
                }
                this.Expect(19 /* "=" */);
                g = this.TokenExpr_NT();
                this.Expect(20 /* "." */);
                if (s.kind == Parser.str)
                    this.SemErr("a literal must not be declared with a structure");
                this.tab.Finish(g);
                if (this.tokenString == null || this.tokenString == this.noString)
                    this.dfa.ConvertToStates(g.l, sym);
                else { // TokenExpr is a single string
                    if (this.tab.FindLiteral(this.tokenString) != null)
                        this.SemErr("token string declared twice");
                    this.tab.literals[this.tokenString] = sym;
                    this.dfa.MatchLiteral(this.tokenString, sym);
                }
            }
            else if (this.StartOf(6 /* sem   */)) {
                if (s.kind == Parser.id)
                    this.genScanner = false;
                else
                    this.dfa.MatchLiteral(sym.name, sym);
            }
            else
                this.SynErr(52);
            if (this.isKind(this.la, 47 /* "(." */)) {
                sym.semPos = this.SemText_NT();
                if (typ == Node.t)
                    this.errors.WarningStr("Warning semantic action on token declarations require a custom Scanner");
            }
        };
        Parser.prototype.TokenExpr_NT = function () {
            var g;
            var g2;
            g = this.TokenTerm_NT();
            var first = true;
            while (this.WeakSeparator(38 /* "|" */, 7, 8)) {
                g2 = this.TokenTerm_NT();
                if (first) {
                    this.tab.MakeFirstAlt(g);
                    first = false;
                }
                this.tab.MakeAlternative(g, g2);
            }
            return g;
        };
        Parser.prototype.Set_NT = function () {
            var s;
            var s2;
            s = this.SimSet_NT();
            while (this.isKind(this.la, 23 /* "+" */) || this.isKind(this.la, 24 /* "-" */)) {
                if (this.isKind(this.la, 23 /* "+" */)) {
                    this.Get();
                    s2 = this.SimSet_NT();
                    s.Or(s2);
                }
                else {
                    this.Get();
                    s2 = this.SimSet_NT();
                    s.Subtract(s2);
                }
            }
            return s;
        };
        Parser.prototype.SymboltableDecl_NT = function () {
            var st;
            this.Expect(Parser._ident);
            var name = this.t.val.toLowerCase();
            if (this.tab.FindSymtab(name) != null)
                this.SemErr("symbol table name declared twice");
            st = new SymTab(name);
            this.tab.symtabs.push(st);
            if (this.isKind(this.la, 22 /* "STRICT" */)) {
                this.Get();
                st.strict = true;
            }
            while (this.isKind(this.la, Parser._string)) {
                this.Get();
                var predef = this.tab.Unstring(this.t.val);
                if (this.dfa.ignoreCase)
                    predef = predef.toLowerCase();
                st.Add(predef);
            }
            this.Expect(20 /* "." */);
        };
        Parser.prototype.AttrDecl_NT = function (sym) {
            var beg, col, line;
            if (this.isKind(this.la, 29 /* "<" */)) {
                this.Get();
                if (this.isKind(this.la, 30 /* "^" */) || this.isKind(this.la, 31 /* "out" */)) {
                    if (this.isKind(this.la, 30 /* "^" */)) {
                        this.Get();
                    }
                    else {
                        this.Get();
                    }
                    this.Expect(Parser._ident);
                    sym.retVar = this.t.val;
                    this.Expect(27 /* ":" */);
                    beg = this.la.pos;
                    this.TypeName_NT();
                    sym.retType = this.scanner.buffer.GetString(beg, this.la.pos);
                    if (this.isKind(this.la, 32 /* ">" */)) {
                        this.Get();
                    }
                    else if (this.isKind(this.la, 33 /* "," */)) {
                        this.Get();
                        beg = this.la.pos;
                        col = this.la.col;
                        line = this.la.line;
                        while (this.StartOf(9 /* any   */)) {
                            this.Get();
                        }
                        this.Expect(32 /* ">" */);
                        if (this.t.pos > beg)
                            sym.attrPos = new Position(beg, this.t.pos, col, line);
                    }
                    else
                        this.SynErr(53);
                }
                else if (this.StartOf(10 /* sem   */)) {
                    beg = this.la.pos;
                    col = this.la.col;
                    line = this.la.line;
                    if (this.StartOf(11 /* any   */)) {
                        this.Get();
                        while (this.StartOf(9 /* any   */)) {
                            this.Get();
                        }
                    }
                    this.Expect(32 /* ">" */);
                    if (this.t.pos > beg)
                        sym.attrPos = new Position(beg, this.t.pos, col, line);
                }
                else
                    this.SynErr(54);
            }
            else if (this.isKind(this.la, 34 /* "<." */)) {
                this.Get();
                if (this.isKind(this.la, 30 /* "^" */) || this.isKind(this.la, 31 /* "out" */)) {
                    if (this.isKind(this.la, 30 /* "^" */)) {
                        this.Get();
                    }
                    else {
                        this.Get();
                    }
                    this.Expect(Parser._ident);
                    sym.retVar = this.t.val;
                    this.Expect(27 /* ":" */);
                    beg = this.la.pos;
                    this.TypeName_NT();
                    sym.retType = this.scanner.buffer.GetString(beg, this.la.pos);
                    if (this.isKind(this.la, 35 /* ".>" */)) {
                        this.Get();
                    }
                    else if (this.isKind(this.la, 33 /* "," */)) {
                        this.Get();
                        beg = this.la.pos;
                        col = this.la.col;
                        line = this.la.line;
                        while (this.StartOf(12 /* any   */)) {
                            this.Get();
                        }
                        this.Expect(35 /* ".>" */);
                        if (this.t.pos > beg)
                            sym.attrPos = new Position(beg, this.t.pos, col, line);
                    }
                    else
                        this.SynErr(55);
                }
                else if (this.StartOf(10 /* sem   */)) {
                    beg = this.la.pos;
                    col = this.la.col;
                    line = this.la.line;
                    if (this.StartOf(13 /* any   */)) {
                        this.Get();
                        while (this.StartOf(12 /* any   */)) {
                            this.Get();
                        }
                    }
                    this.Expect(35 /* ".>" */);
                    if (this.t.pos > beg)
                        sym.attrPos = new Position(beg, this.t.pos, col, line);
                }
                else
                    this.SynErr(56);
            }
            else
                this.SynErr(57);
        };
        Parser.prototype.SemText_NT = function () {
            var pos;
            this.Expect(47 /* "(." */);
            var beg = this.la.pos, col = this.la.col, line = this.la.line;
            while (this.StartOf(14 /* alt   */)) {
                if (this.StartOf(15 /* any   */)) {
                    this.Get();
                }
                else if (this.isKind(this.la, Parser._badString)) {
                    this.Get();
                    this.SemErr("bad string in semantic action");
                }
                else {
                    this.Get();
                    this.SemErr("missing end of previous semantic action");
                }
            }
            this.Expect(48 /* ".)" */);
            pos = new Position(beg, this.t.pos, col, line);
            return pos;
        };
        Parser.prototype.Expression_NT = function () {
            var g;
            var g2;
            g = this.Term_NT();
            var first = true;
            while (this.WeakSeparator(38 /* "|" */, 16, 17)) {
                g2 = this.Term_NT();
                if (first) {
                    this.tab.MakeFirstAlt(g);
                    first = false;
                }
                this.tab.MakeAlternative(g, g2);
            }
            return g;
        };
        Parser.prototype.SimSet_NT = function () {
            var s;
            var n1, n2;
            s = new CharSet();
            if (this.isKind(this.la, Parser._ident)) {
                this.Get();
                var c = this.tab.FindCharClassByName(this.t.val);
                if (c == null)
                    this.SemErr("undefined name");
                else
                    s.Or(c.set);
            }
            else if (this.isKind(this.la, Parser._string)) {
                this.Get();
                var name_3 = this.tab.Unstring(this.t.val);
                for (var _i = 0, name_2 = name_3; _i < name_2.length; _i++) {
                    var ch = name_2[_i];
                    if (this.dfa.ignoreCase)
                        s.Set(ch.toLowerCase().charCodeAt(0));
                    else
                        s.Set(ch.charCodeAt(0));
                }
            }
            else if (this.isKind(this.la, Parser._char)) {
                n1 = this.Char_NT();
                s.Set(n1);
                if (this.isKind(this.la, 25 /* ".." */)) {
                    this.Get();
                    n2 = this.Char_NT();
                    for (var i = n1; i <= n2; i++)
                        s.Set(i);
                }
            }
            else if (this.isKind(this.la, 26 /* "ANY" */)) {
                this.Get();
                s = new CharSet();
                s.Fill();
            }
            else
                this.SynErr(58);
            return s;
        };
        Parser.prototype.Char_NT = function () {
            var n;
            this.Expect(Parser._char);
            var name = this.tab.Unstring(this.t.val);
            n = 0;
            if (name.length == 1)
                n = name.charCodeAt(0);
            else
                this.SemErr("unacceptable character value");
            if (this.dfa.ignoreCase && n >= 65 /*'A'*/ && n <= 90 /*'Z'*/)
                n += 32;
            return n;
        };
        Parser.prototype.Sym_NT = function () {
            var s;
            s = new SymInfo();
            s.name = "???";
            s.kind = Parser.id;
            if (this.isKind(this.la, Parser._ident)) {
                this.Get();
                s.kind = Parser.id;
                s.name = this.t.val;
            }
            else if (this.isKind(this.la, Parser._string) || this.isKind(this.la, Parser._char)) {
                if (this.isKind(this.la, Parser._string)) {
                    this.Get();
                    s.name = this.t.val;
                }
                else {
                    this.Get();
                    s.name = "\"" + this.t.val.substr(1, this.t.val.length - 2) + "\"";
                }
                s.kind = Parser.str;
                if (this.dfa.ignoreCase)
                    s.name = s.name.toLowerCase();
                if (s.name.indexOf(' ') >= 0)
                    this.SemErr("literal tokens must not contain blanks");
            }
            else
                this.SynErr(59);
            return s;
        };
        Parser.prototype.TypeName_NT = function () {
            this.Expect(Parser._ident);
            while (this.isKind(this.la, 20 /* "." */) || this.isKind(this.la, 29 /* "<" */) || this.isKind(this.la, 36 /* "[" */)) {
                if (this.isKind(this.la, 20 /* "." */)) {
                    this.Get();
                    this.Expect(Parser._ident);
                }
                else if (this.isKind(this.la, 36 /* "[" */)) {
                    this.Get();
                    this.Expect(37 /* "]" */);
                }
                else {
                    this.Get();
                    this.TypeName_NT();
                    while (this.isKind(this.la, 33 /* "," */)) {
                        this.Get();
                        this.TypeName_NT();
                    }
                    this.Expect(32 /* ">" */);
                }
            }
        };
        Parser.prototype.Term_NT = function () {
            var g;
            var g2, rslv = null;
            g = null;
            if (this.StartOf(18 /* opt   */)) {
                if (this.isKind(this.la, 45 /* "IF" */)) {
                    rslv = this.tab.NewNodeSym(Node.rslv, null, this.la.line, this.la.col);
                    rslv.pos = this.Resolver_NT();
                    g = new Graph(rslv);
                }
                g2 = this.Factor_NT();
                if (rslv != null)
                    this.tab.MakeSequence(g, g2);
                else
                    g = g2;
                while (this.StartOf(19 /* nt   Factor */)) {
                    g2 = this.Factor_NT();
                    this.tab.MakeSequence(g, g2);
                }
            }
            else if (this.StartOf(20 /* sem   */)) {
                g = new Graph(this.tab.NewNodeSym(Node.eps, null, this.t.line, this.t.col));
            }
            else
                this.SynErr(60);
            if (g == null) // invalid start of Term
                g = new Graph(this.tab.NewNodeSym(Node.eps, null, this.t.line, this.t.col));
            return g;
        };
        Parser.prototype.Resolver_NT = function () {
            var pos;
            this.Expect(45 /* "IF" */);
            this.Expect(40 /* "(" */);
            var beg = this.la.pos, col = this.la.col, line = this.la.line;
            this.Condition_NT();
            pos = new Position(beg, this.t.pos, col, line);
            return pos;
        };
        Parser.prototype.Factor_NT = function () {
            var g;
            var s, pos, weak = false;
            g = null;
            switch (this.la.kind) {
                case Parser._ident:
                case Parser._string:
                case Parser._char:
                case 39 /* "WEAK" */: {
                    if (this.isKind(this.la, 39 /* "WEAK" */)) {
                        this.Get();
                        weak = true;
                    }
                    s = this.Sym_NT();
                    var sym = this.tab.FindSym(s.name);
                    if (sym == null && s.kind == Parser.str)
                        sym = this.tab.FindLiteral(s.name);
                    var undef = sym == null;
                    if (undef) {
                        if (s.kind == Parser.id)
                            sym = this.tab.NewSym(Node.nt, s.name, this.t.line, this.t.col); // forward nt
                        else if (this.genScanner) {
                            sym = this.tab.NewSym(Node.t, s.name, this.t.line, this.t.col);
                            this.dfa.MatchLiteral(sym.name, sym);
                        }
                        else { // undefined string in production
                            this.SemErr("undefined string in production");
                            sym = this.tab.eofSy; // dummy
                        }
                    }
                    var typ = sym.typ;
                    if (typ != Node.t && typ != Node.nt)
                        this.SemErr("this symbol kind is not allowed in a production");
                    if (weak)
                        if (typ == Node.t)
                            typ = Node.wt;
                        else
                            this.SemErr("only terminals may be weak");
                    var p = this.tab.NewNodeSym(typ, sym, this.t.line, this.t.col);
                    g = new Graph(p);
                    if (this.StartOf(21 /* alt   */)) {
                        if (this.isKind(this.la, 29 /* "<" */) || this.isKind(this.la, 34 /* "<." */)) {
                            this.Attribs_NT(p);
                            if (s.kind != Parser.id)
                                this.SemErr("a literal must not have attributes");
                        }
                        else if (this.isKind(this.la, 32 /* ">" */)) {
                            this.Get();
                            this.Expect(Parser._ident);
                            if (typ != Node.t && typ != Node.wt)
                                this.SemErr("only terminals or weak terminals can declare a name in a symbol table");
                            p.declares = this.t.val; //.toLowerCase();
                            if (null == this.tab.FindSymtab(p.declares))
                                this.SemErr("undeclared symbol table '" + p.declares + "'");
                        }
                        else {
                            this.Get();
                            this.Expect(Parser._ident);
                            if (typ != Node.t && typ != Node.wt)
                                this.SemErr("only terminals or weak terminals can lookup a name in a symbol table");
                            p.declared = this.t.val; //.toLowerCase();
                            if (null == this.tab.FindSymtab(p.declared))
                                this.SemErr("undeclared symbol table '" + p.declared + "'");
                        }
                    }
                    if (undef) {
                        sym.attrPos = p.pos; // dummy
                        sym.retVar = p.retVar; // AH - dummy
                    }
                    else if ((p.pos == null) != (sym.attrPos == null)
                        || (p.retVar == null) != (sym.retVar == null))
                        this.SemErr("attribute mismatch between declaration and use of this symbol");
                    break;
                }
                case 40 /* "(" */: {
                    this.Get();
                    g = this.Expression_NT();
                    this.Expect(41 /* ")" */);
                    break;
                }
                case 36 /* "[" */: {
                    this.Get();
                    g = this.Expression_NT();
                    this.Expect(37 /* "]" */);
                    this.tab.MakeOption(g);
                    break;
                }
                case 42 /* "{" */: {
                    this.Get();
                    g = this.Expression_NT();
                    this.Expect(43 /* "}" */);
                    this.tab.MakeIteration(g);
                    break;
                }
                case 47 /* "(." */: {
                    pos = this.SemText_NT();
                    var p = this.tab.NewNodeSym(Node.sem, null, this.t.line, this.t.col);
                    p.pos = pos;
                    g = new Graph(p);
                    break;
                }
                case 26 /* "ANY" */: {
                    this.Get();
                    var p = this.tab.NewNodeSym(Node.any, null, this.t.line, this.t.col); // p.set is set in tab.SetupAnys
                    g = new Graph(p);
                    break;
                }
                case 44 /* "SYNC" */: {
                    this.Get();
                    var p = this.tab.NewNodeSym(Node.sync, null, this.t.line, this.t.col);
                    g = new Graph(p);
                    break;
                }
                default:
                    this.SynErr(61);
                    break;
            }
            if (g == null) // invalid start of Factor
                g = new Graph(this.tab.NewNodeSym(Node.eps, null, this.t.line, this.t.col));
            return g;
        };
        Parser.prototype.Attribs_NT = function (n) {
            var beg, col, line;
            if (this.isKind(this.la, 29 /* "<" */)) {
                this.Get();
                if (this.isKind(this.la, 30 /* "^" */) || this.isKind(this.la, 31 /* "out" */)) {
                    if (this.isKind(this.la, 30 /* "^" */)) {
                        this.Get();
                    }
                    else {
                        this.Get();
                    }
                    beg = this.la.pos;
                    while (this.StartOf(22 /* alt   */)) {
                        if (this.StartOf(23 /* any   */)) {
                            this.Get();
                        }
                        else if (this.isKind(this.la, 36 /* "[" */) || this.isKind(this.la, 40 /* "(" */)) {
                            this.Bracketed_NT();
                        }
                        else {
                            this.Get();
                            this.SemErr("bad string in attributes");
                        }
                    }
                    n.retVar = this.scanner.buffer.GetString(beg, this.la.pos);
                    if (this.isKind(this.la, 32 /* ">" */)) {
                        this.Get();
                    }
                    else if (this.isKind(this.la, 33 /* "," */)) {
                        this.Get();
                        beg = this.la.pos;
                        col = this.la.col;
                        line = this.la.line;
                        while (this.StartOf(9 /* alt   */)) {
                            if (this.StartOf(24 /* any   */)) {
                                this.Get();
                            }
                            else {
                                this.Get();
                                this.SemErr("bad string in attributes");
                            }
                        }
                        this.Expect(32 /* ">" */);
                        if (this.t.pos > beg)
                            n.pos = new Position(beg, this.t.pos, col, line);
                    }
                    else
                        this.SynErr(62);
                }
                else if (this.StartOf(10 /* sem   */)) {
                    beg = this.la.pos;
                    col = this.la.col;
                    line = this.la.line;
                    if (this.StartOf(11 /* alt   */)) {
                        if (this.StartOf(25 /* any   */)) {
                            this.Get();
                        }
                        else {
                            this.Get();
                            this.SemErr("bad string in attributes");
                        }
                        while (this.StartOf(9 /* alt   */)) {
                            if (this.StartOf(24 /* any   */)) {
                                this.Get();
                            }
                            else {
                                this.Get();
                                this.SemErr("bad string in attributes");
                            }
                        }
                    }
                    this.Expect(32 /* ">" */);
                    if (this.t.pos > beg)
                        n.pos = new Position(beg, this.t.pos, col, line);
                }
                else
                    this.SynErr(63);
            }
            else if (this.isKind(this.la, 34 /* "<." */)) {
                this.Get();
                if (this.isKind(this.la, 30 /* "^" */) || this.isKind(this.la, 31 /* "out" */)) {
                    if (this.isKind(this.la, 30 /* "^" */)) {
                        this.Get();
                    }
                    else {
                        this.Get();
                    }
                    beg = this.la.pos;
                    while (this.StartOf(26 /* alt   */)) {
                        if (this.StartOf(27 /* any   */)) {
                            this.Get();
                        }
                        else if (this.isKind(this.la, 36 /* "[" */) || this.isKind(this.la, 40 /* "(" */)) {
                            this.Bracketed_NT();
                        }
                        else {
                            this.Get();
                            this.SemErr("bad string in attributes");
                        }
                    }
                    n.retVar = this.scanner.buffer.GetString(beg, this.la.pos);
                    if (this.isKind(this.la, 35 /* ".>" */)) {
                        this.Get();
                    }
                    else if (this.isKind(this.la, 33 /* "," */)) {
                        this.Get();
                        beg = this.la.pos;
                        col = this.la.col;
                        line = this.la.line;
                        while (this.StartOf(12 /* alt   */)) {
                            if (this.StartOf(28 /* any   */)) {
                                this.Get();
                            }
                            else {
                                this.Get();
                                this.SemErr("bad string in attributes");
                            }
                        }
                        this.Expect(35 /* ".>" */);
                        if (this.t.pos > beg)
                            n.pos = new Position(beg, this.t.pos, col, line);
                    }
                    else
                        this.SynErr(64);
                }
                else if (this.StartOf(10 /* sem   */)) {
                    beg = this.la.pos;
                    col = this.la.col;
                    line = this.la.line;
                    if (this.StartOf(13 /* alt   */)) {
                        if (this.StartOf(29 /* any   */)) {
                            this.Get();
                        }
                        else {
                            this.Get();
                            this.SemErr("bad string in attributes");
                        }
                        while (this.StartOf(12 /* alt   */)) {
                            if (this.StartOf(28 /* any   */)) {
                                this.Get();
                            }
                            else {
                                this.Get();
                                this.SemErr("bad string in attributes");
                            }
                        }
                    }
                    this.Expect(35 /* ".>" */);
                    if (this.t.pos > beg)
                        n.pos = new Position(beg, this.t.pos, col, line);
                }
                else
                    this.SynErr(65);
            }
            else
                this.SynErr(66);
        };
        Parser.prototype.Condition_NT = function () {
            while (this.StartOf(30 /* alt   */)) {
                if (this.isKind(this.la, 40 /* "(" */)) {
                    this.Get();
                    this.Condition_NT();
                }
                else {
                    this.Get();
                }
            }
            this.Expect(41 /* ")" */);
        };
        Parser.prototype.TokenTerm_NT = function () {
            var g;
            var g2;
            g = this.TokenFactor_NT();
            while (this.StartOf(7 /* nt   TokenFactor */)) {
                g2 = this.TokenFactor_NT();
                this.tab.MakeSequence(g, g2);
            }
            if (this.isKind(this.la, 46 /* "CONTEXT" */)) {
                this.Get();
                this.Expect(40 /* "(" */);
                g2 = this.TokenExpr_NT();
                this.tab.SetContextTrans(g2.l);
                this.dfa.hasCtxMoves = true;
                this.tab.MakeSequence(g, g2);
                this.Expect(41 /* ")" */);
            }
            return g;
        };
        Parser.prototype.TokenFactor_NT = function () {
            var g;
            var s;
            g = null;
            if (this.isKind(this.la, Parser._ident) || this.isKind(this.la, Parser._string) || this.isKind(this.la, Parser._char)) {
                s = this.Sym_NT();
                if (s.kind == Parser.id) {
                    var c = this.tab.FindCharClassByName(this.t.val);
                    if (c == null) {
                        this.SemErr("undefined name: " + s.name);
                        c = this.tab.NewCharClass(s.name, new CharSet());
                    }
                    var p = this.tab.NewNodeSym(Node.clas, null, this.t.line, this.t.col);
                    p.val = c.n;
                    g = new Graph(p);
                    this.tokenString = this.noString;
                }
                else { // str
                    g = this.tab.StrToGraph(s.name);
                    if (this.tokenString == null)
                        this.tokenString = s.name;
                    else
                        this.tokenString = this.noString;
                }
            }
            else if (this.isKind(this.la, 40 /* "(" */)) {
                this.Get();
                g = this.TokenExpr_NT();
                this.Expect(41 /* ")" */);
            }
            else if (this.isKind(this.la, 36 /* "[" */)) {
                this.Get();
                g = this.TokenExpr_NT();
                this.Expect(37 /* "]" */);
                this.tab.MakeOption(g);
                this.tokenString = this.noString;
            }
            else if (this.isKind(this.la, 42 /* "{" */)) {
                this.Get();
                g = this.TokenExpr_NT();
                this.Expect(43 /* "}" */);
                this.tab.MakeIteration(g);
                this.tokenString = this.noString;
            }
            else
                this.SynErr(67);
            if (g == null) // invalid start of TokenFactor
                g = new Graph(this.tab.NewNodeSym(Node.eps, null, this.t.line, this.t.col));
            return g;
        };
        Parser.prototype.Bracketed_NT = function () {
            if (this.isKind(this.la, 40 /* "(" */)) {
                this.Get();
                while (this.StartOf(30 /* alt   */)) {
                    if (this.isKind(this.la, 36 /* "[" */) || this.isKind(this.la, 40 /* "(" */)) {
                        this.Bracketed_NT();
                    }
                    else {
                        this.Get();
                    }
                }
                this.Expect(41 /* ")" */);
            }
            else if (this.isKind(this.la, 36 /* "[" */)) {
                this.Get();
                while (this.StartOf(31 /* alt   */)) {
                    if (this.isKind(this.la, 36 /* "[" */) || this.isKind(this.la, 40 /* "(" */)) {
                        this.Bracketed_NT();
                    }
                    else {
                        this.Get();
                    }
                }
                this.Expect(37 /* "]" */);
            }
            else
                this.SynErr(68);
        };
        Parser.prototype.Parse = function () {
            this.la = new Token();
            this.la.val = "";
            this.Get();
            this.Coco_NT();
            this.Expect(0);
        };
        //non terminals
        Parser._NT_Coco = 0;
        Parser._NT_SetDecl = 1;
        Parser._NT_TokenDecl = 2;
        Parser._NT_TokenExpr = 3;
        Parser._NT_Set = 4;
        Parser._NT_SymboltableDecl = 5;
        Parser._NT_AttrDecl = 6;
        Parser._NT_SemText = 7;
        Parser._NT_Expression = 8;
        Parser._NT_SimSet = 9;
        Parser._NT_Char = 10;
        Parser._NT_Sym = 11;
        Parser._NT_TypeName = 12;
        Parser._NT_Term = 13;
        Parser._NT_Resolver = 14;
        Parser._NT_Factor = 15;
        Parser._NT_Attribs = 16;
        Parser._NT_Condition = 17;
        Parser._NT_TokenTerm = 18;
        Parser._NT_TokenFactor = 19;
        Parser._NT_Bracketed = 20;
        Parser.maxNT = 20;
        //terminals
        Parser._EOF = 0;
        Parser._ident = 1;
        Parser._number = 2;
        Parser._string = 3;
        Parser._badString = 4;
        Parser._char = 5;
        //	public static readonly _("COMPILER") : int = 6;
        //	public static readonly _("IGNORECASE") : int = 7;
        //	public static readonly _("TERMINALS") : int = 8;
        //	public static readonly _("CHARACTERS") : int = 9;
        //	public static readonly _("TOKENS") : int = 10;
        //	public static readonly _("PRAGMAS") : int = 11;
        //	public static readonly _("COMMENTS") : int = 12;
        //	public static readonly _("FROM") : int = 13;
        //	public static readonly _("TO") : int = 14;
        //	public static readonly _("NESTED") : int = 15;
        //	public static readonly _("IGNORE") : int = 16;
        //	public static readonly _("SYMBOLTABLES") : int = 17;
        //	public static readonly _("PRODUCTIONS") : int = 18;
        //	public static readonly _("=") : int = 19;
        //	public static readonly _(".") : int = 20;
        //	public static readonly _("END") : int = 21;
        //	public static readonly _("STRICT") : int = 22;
        //	public static readonly _("+") : int = 23;
        //	public static readonly _("-") : int = 24;
        //	public static readonly _("..") : int = 25;
        //	public static readonly _("ANY") : int = 26;
        //	public static readonly _(":") : int = 27;
        //	public static readonly _("@") : int = 28;
        //	public static readonly _("<") : int = 29;
        //	public static readonly _("^") : int = 30;
        //	public static readonly _("out") : int = 31;
        //	public static readonly _(">") : int = 32;
        //	public static readonly _(",") : int = 33;
        //	public static readonly _("<.") : int = 34;
        //	public static readonly _(".>") : int = 35;
        //	public static readonly _("[") : int = 36;
        //	public static readonly _("]") : int = 37;
        //	public static readonly _("|") : int = 38;
        //	public static readonly _("WEAK") : int = 39;
        //	public static readonly _("(") : int = 40;
        //	public static readonly _(")") : int = 41;
        //	public static readonly _("{") : int = 42;
        //	public static readonly _("}") : int = 43;
        //	public static readonly _("SYNC") : int = 44;
        //	public static readonly _("IF") : int = 45;
        //	public static readonly _("CONTEXT") : int = 46;
        //	public static readonly _("(.") : int = 47;
        //	public static readonly _(".)") : int = 48;
        //	public static readonly _(???) : int = 49;
        Parser.maxT = 49;
        Parser._ddtSym = 50;
        Parser._optionSym = 51;
        Parser.minErrDist = 2;
        Parser.id = 0;
        Parser.str = 1;
        // a token's base type
        Parser.tBase = [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        ];
        Parser.set = [
            [true, true, false, true, false, true, false, false, false, false, false, true, true, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
            [false, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
            [true, true, false, true, false, true, false, false, false, false, false, true, true, false, false, false, true, true, true, true, true, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false, true, false, true, true, true, false, true, false, true, true, false, true, false, false, false],
            [true, true, false, true, false, true, false, false, false, false, false, true, true, false, false, false, true, true, true, true, false, true, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
            [true, true, false, true, false, true, false, false, false, false, false, true, true, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
            [false, true, false, true, false, true, false, false, false, false, false, true, true, false, false, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
            [false, true, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, true, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, false, true, false, true, true, true, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, true, false, false, false, false, false, false, false],
            [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, false],
            [false, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, false],
            [false, true, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, true, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, true, false, false, false, false, false, false, false],
            [false, true, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, true, false, false, true, true, false, true, false, true, true, false, true, false, false, false],
            [false, true, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, true, false, false, true, true, false, true, false, true, false, false, true, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, true, false, true, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, true, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, false, true, true, true, false, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, false, false, true, true, true, false, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, false],
            [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, false]
        ];
        return Parser;
    }()); // end Parser
    CocoR.Parser = Parser;
    var Errors = /** @class */ (function () {
        function Errors(fileName) {
            this.log = console.log;
            this.count = 0; // number of errors detected
            //public  errorStream : StreamWriter; //.IO.TextWriter = Console.Out;   // error messages go to this stream
            //public  errMsgFormat : string = "-- line {0} col {1}: {2}"; // 0=line, 1=column, 2=text
            this.errMsgFormat = "%s:%d:%d %s %s"; // 0=line, 1=column, 2=text
            this.fileName = "grammar"; // 0=line, 1=column, 2=text
            this.fileName = fileName;
        }
        Errors.prototype.SynErr = function (line, col, n) {
            var s;
            switch (n) {
                case 0:
                    s = "EOF expected";
                    break;
                case 1:
                    s = "ident expected";
                    break;
                case 2:
                    s = "number expected";
                    break;
                case 3:
                    s = "string expected";
                    break;
                case 4:
                    s = "badString expected";
                    break;
                case 5:
                    s = "char expected";
                    break;
                case 6:
                    s = "\"COMPILER\" expected";
                    break;
                case 7:
                    s = "\"IGNORECASE\" expected";
                    break;
                case 8:
                    s = "\"TERMINALS\" expected";
                    break;
                case 9:
                    s = "\"CHARACTERS\" expected";
                    break;
                case 10:
                    s = "\"TOKENS\" expected";
                    break;
                case 11:
                    s = "\"PRAGMAS\" expected";
                    break;
                case 12:
                    s = "\"COMMENTS\" expected";
                    break;
                case 13:
                    s = "\"FROM\" expected";
                    break;
                case 14:
                    s = "\"TO\" expected";
                    break;
                case 15:
                    s = "\"NESTED\" expected";
                    break;
                case 16:
                    s = "\"IGNORE\" expected";
                    break;
                case 17:
                    s = "\"SYMBOLTABLES\" expected";
                    break;
                case 18:
                    s = "\"PRODUCTIONS\" expected";
                    break;
                case 19:
                    s = "\"=\" expected";
                    break;
                case 20:
                    s = "\".\" expected";
                    break;
                case 21:
                    s = "\"END\" expected";
                    break;
                case 22:
                    s = "\"STRICT\" expected";
                    break;
                case 23:
                    s = "\"+\" expected";
                    break;
                case 24:
                    s = "\"-\" expected";
                    break;
                case 25:
                    s = "\"..\" expected";
                    break;
                case 26:
                    s = "\"ANY\" expected";
                    break;
                case 27:
                    s = "\":\" expected";
                    break;
                case 28:
                    s = "\"@\" expected";
                    break;
                case 29:
                    s = "\"<\" expected";
                    break;
                case 30:
                    s = "\"^\" expected";
                    break;
                case 31:
                    s = "\"out\" expected";
                    break;
                case 32:
                    s = "\">\" expected";
                    break;
                case 33:
                    s = "\",\" expected";
                    break;
                case 34:
                    s = "\"<.\" expected";
                    break;
                case 35:
                    s = "\".>\" expected";
                    break;
                case 36:
                    s = "\"[\" expected";
                    break;
                case 37:
                    s = "\"]\" expected";
                    break;
                case 38:
                    s = "\"|\" expected";
                    break;
                case 39:
                    s = "\"WEAK\" expected";
                    break;
                case 40:
                    s = "\"(\" expected";
                    break;
                case 41:
                    s = "\")\" expected";
                    break;
                case 42:
                    s = "\"{\" expected";
                    break;
                case 43:
                    s = "\"}\" expected";
                    break;
                case 44:
                    s = "\"SYNC\" expected";
                    break;
                case 45:
                    s = "\"IF\" expected";
                    break;
                case 46:
                    s = "\"CONTEXT\" expected";
                    break;
                case 47:
                    s = "\"(.\" expected";
                    break;
                case 48:
                    s = "\".)\" expected";
                    break;
                case 49:
                    s = "??? expected";
                    break;
                case 50:
                    s = "this symbol not expected in Coco";
                    break;
                case 51:
                    s = "this symbol not expected in TokenDecl";
                    break;
                case 52:
                    s = "invalid TokenDecl";
                    break;
                case 53:
                    s = "invalid AttrDecl";
                    break;
                case 54:
                    s = "invalid AttrDecl";
                    break;
                case 55:
                    s = "invalid AttrDecl";
                    break;
                case 56:
                    s = "invalid AttrDecl";
                    break;
                case 57:
                    s = "invalid AttrDecl";
                    break;
                case 58:
                    s = "invalid SimSet";
                    break;
                case 59:
                    s = "invalid Sym";
                    break;
                case 60:
                    s = "invalid Term";
                    break;
                case 61:
                    s = "invalid Factor";
                    break;
                case 62:
                    s = "invalid Attribs";
                    break;
                case 63:
                    s = "invalid Attribs";
                    break;
                case 64:
                    s = "invalid Attribs";
                    break;
                case 65:
                    s = "invalid Attribs";
                    break;
                case 66:
                    s = "invalid Attribs";
                    break;
                case 67:
                    s = "invalid TokenFactor";
                    break;
                case 68:
                    s = "invalid Bracketed";
                    break;
                default:
                    s = "error " + n;
                    break;
            }
            //errorStream.WriteLine(errMsgFormat, line, col, s);
            this.log(sprintf(this.errMsgFormat, this.fileName, line, col, "SynErr", s));
            ++this.count;
        };
        Errors.prototype.SemErrLineColStr = function (line, col, s) {
            //this.errorStream.WriteLine(this.errMsgFormat, line, col, s);
            this.log(sprintf(this.errMsgFormat, this.fileName, line, col, "SemErr", s));
            ++this.count;
        };
        Errors.prototype.SemErr = function (s) {
            //this.errorStream.WriteLine(s);
            this.log(s);
            ++this.count;
        };
        Errors.prototype.Warning = function (line, col, s) {
            //this.errorStream.WriteLine(this.errMsgFormat, line, col, s);
            this.log(sprintf(this.errMsgFormat, this.fileName, line, col, "Warning", s));
        };
        Errors.prototype.WarningStr = function (s) {
            //this.errorStream.WriteLine(s);
            this.log(s);
        };
        return Errors;
    }()); // Errors
    CocoR.Errors = Errors;
    var FatalError /*extends Exception*/ = /** @class */ (function () {
        function FatalError(m) {
            throw (m);
        }
        return FatalError;
    }());
    CocoR.FatalError = FatalError;
    var Symboltable = /** @class */ (function () {
        function Symboltable(name, ignoreCase, strict) {
            this.name = name;
            this.ignoreCase = ignoreCase;
            this.strict = strict;
        }
        Symboltable.prototype.Add = function (t) {
            if (!this.predefined.hasOwnProperty(t.val)) {
                this.predefined[t.val] = true;
                return true;
            }
            return false;
        };
        Symboltable.prototype.Use = function (t) {
            return this.predefined.hasOwnProperty(t.val);
        };
        return Symboltable;
    }());
    CocoR.Symboltable = Symboltable;
    /*//----End Parser.ts */
})(CocoR || (CocoR = {})); //end namespace CocoR
//End CocoR.js
