/*//----Start Aux-ts.ts */
/*
/usr/bin/time qjs "CocoAll-5.js" > /dev/null
0.11user 0.00system 0:00.11elapsed 99%CPU (0avgtext+0avgdata 5988maxresident)k
0inputs+0outputs (0major+930minor)pagefaults 0swaps

/usr/bin/time node "CocoAll-5.js" > /dev/null
0.12user 0.02system 0:00.10elapsed 140%CPU (0avgtext+0avgdata 46036maxresident)k
0inputs+0outputs (0major+5347minor)pagefaults 0swaps
*/

declare function require(s : string) : {[key: string]: any};
declare var global: {[key: string]: any} | undefined;
declare var std: {[key: string]: any} | undefined;
declare var process: {[key: string]: any} | undefined;
declare var scriptArgs: Array<string> | undefined;
declare var stdScriptArgs: Array<string> | undefined;
declare var stdWriteFile: any | undefined;

if(typeof std == "undefined") {
    (function(){
        var fs = require('fs');
        global.std = {
            "loadFile" : function(fname : string) {
                return fs.readFileSync(fname, 'utf8')
            },
            "open" : function(fname : string, mode : string) {
                var fp = {
                    "fd" : fs.openSync(fname, mode),
                    "close" : function() {
                        fs.closeSync(this.fd);
                    },
                    "write" : function(data : string, fptr : any) {
                        fs.writeSync(this.fd, data);
                    }
    
                };
                return fp
            }
        };
        global.stdWriteFile = function(fname : string, data : string) {
            fs.writeFileSync(fname, data, 'utf8');
        };
        global.stdScriptArgs = process.argv.slice(1);
    })();
} else {
    let qjsThis : {[key : string] : any} = this || {};
    qjsThis.stdScriptArgs = scriptArgs;
    qjsThis.stdWriteFile = function(fname, data) {
        var fd = std.open(fname, "w");
        fd.puts(data);
        fd.close();
    }
}

type int = number;
type char = number;
type byte = number;
type bool = boolean;

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

function stringIsNullOrEmpty(s : string | null) : bool { return s ? s.length == 0 : true;}
function CharIsLetter(ch : char) : bool {return (ch >= 97 /*'a'*/ && ch <= 122 /*'z'*/) || (ch >= 65 /*'A'*/ && ch <= 132 /*'Z'*/); }

class StringBuilder {
    strArray: Array<string> = new Array<string>();
    //constructor(){}

    get(nIndex:number): string | null {
        return this.strArray[nIndex];
    }
    isEmpty(): boolean {
       return this.strArray.length === 0;
    }
    Append(str: string): void {
        if(str.length)
           this.strArray.push(str);
    }
    ToString(): string {
        let str:string = this.strArray.join("");
        return(str);
    }

    joinToString(delimeter: string): string {
        return this.strArray.join(delimeter);
    }

    clear() : void {
        this.strArray.length = 0;
    }

    Length() : int {return this.strArray.length;}
}

enum FileMode {Open, Create};
enum FileAccess {Read};
enum FileShare {Read};

class FileStream {
    ReadByte() : int {return 0;}
    constructor(fn: string, mode : FileMode, access? : FileAccess, share? : FileShare) {}
}

class StreamWriter {
    Write(s : string) : void {}
    WriteLine(s? : string) : void {}
    Close() : void {}
    constructor(fd : FileStream) {}
}

class StringWriter {
    private _sb : StringBuilder = new StringBuilder();
    Write(s : string) : void {this._sb.Append(s);}
    WriteLine(s? : string) : void {if(s) this._sb.Append(s); this._sb.Append("\n");}
    Close() : void {}
    ToString() : string {return this._sb.ToString();}
}

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

function sprintf (...argv : any) {
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
    let regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([qscboxXuideEfFgG])/g;
    let a = argv,
        i = 0,
        format = a[i++];

    // pad()
    let pad = function (str : string, len : number, chr : string, leftJustify : boolean) : string {
        if (!chr) {
            chr = ' ';
        }
        let padding = (str.length >= len) ? "" : Array(1 + len - str.length >>> 0).join(chr);
        return leftJustify ? str + padding : padding + str;
    };

    // justify()
    let justify = function (value : string, prefix : string, leftJustify : boolean, minWidth : number, zeroPad : boolean, customPadChar : string) : string {
        let diff = minWidth - value.length;
        if (diff > 0) {
            if (leftJustify || !zeroPad) {
                value = pad(value, minWidth, customPadChar, leftJustify);
            } else {
                value = value.slice(0, prefix.length) + pad("", diff, '0', true) + value.slice(prefix.length);
            }
        }
        return value;
    };

    // formatBaseX()
    let formatBaseX = function (value : number, base : number, prefix : boolean, leftJustify : boolean, minWidth : number, precision : number | null, zeroPad : boolean) : string {
        // Note: casts negative numbers to positive ones
        let number = value >>> 0;
        let sprefix = prefix && number && {
            '2': '0b',
            '8': '0',
            '16': '0x'
        }[base] || "";
        let rc : string = prefix + pad(number.toString(base), precision || 0, '0', false);
        return justify(rc, sprefix, leftJustify, minWidth, zeroPad, " ");
    };

    // formatString()
    let formatString = function (value : string, leftJustify : boolean, minWidth : number, precision : number | null, zeroPad : boolean, customPadChar : string) : string {
        if (precision != null) {
            value = value.slice(0, precision);
        }
        return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
    };

    // doFormat()
    let doFormat = function (substring : string, valueIndex : string, flags : string, pminWidth : string, _ : any, pprecision : string, type : string) : string {
        let number : number;
        let prefix : string;
        let method : string;
        let textTransform : string;
        let value : string;
        let minWidth : number = 0;
        let precision : number | null = 0;

        if (substring == '%%') {
            return '%';
        }

        // parse flags
        var leftJustify = false,
            positivePrefix = '',
            zeroPad = false,
            prefixBaseX = false,
            customPadChar = ' ';
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
        if(pminWidth) {
            if (pminWidth == '*') {
                minWidth = +a[i++];
            } else if (pminWidth.charAt(0) == '*') {
                minWidth = +a[pminWidth.slice(1, -1)];
            } else {
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
        } else if (pprecision == '*') {
            precision = +a[i++];
        } else if (pprecision.charAt(0) == '*') {
            precision = +a[pprecision.slice(1, -1)];
        } else {
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

class BitArray {
	_bits : Array<bool>;
	constructor(count : int, defVal : bool =false) {
		this._bits = new Array<bool>(count);
        for(let idx = 0; idx < this._bits.length; ++idx) this._bits[idx] = defVal;
	}

	public SetAll(val : bool) : void {
		for(let idx in this._bits) this._bits[idx] = val;
	}

	public Elements() : int {
		let count : int = 0;
		for(let elm of this._bits) if(elm) ++count;
		return count;
	}

	public checkSameSize(ba : BitArray ) : void {
		if(this._bits.length != ba._bits.length) throw("Bitarray size doesn't match.");
	}

	public Equals(ba : BitArray) : bool {
		if(this._bits.length != ba._bits.length) return false;
		for(let idx in ba._bits) {
			if(ba._bits[idx] != this._bits[idx]) return false;
		}
		return true;
	}

	public Intersect(ba : BitArray) : bool {
		this.checkSameSize(ba);
		for(let idx in ba._bits) if(ba._bits[idx] && this._bits[idx]) return true;
		return false;
	}

	public Get(i : int) : bool { return this._bits[i];}
	public Set(i : int, val : bool) : void { this._bits[i] = val;}
	public Count() : int {return this._bits.length;}

	public Or(ba : BitArray) : BitArray {
		this.checkSameSize(ba);
		for(let idx in ba._bits) {
			this._bits[idx] = ba._bits[idx] || this._bits[idx];
		}
		return this;
	}
	public And(ba : BitArray) : BitArray {
		this.checkSameSize(ba);
		for(let idx in ba._bits) {
			this._bits[idx] = ba._bits[idx] && this._bits[idx];
		}
		return this;
	}

	public Not() : BitArray {
		for(let idx in this._bits) this._bits[idx] = !this._bits[idx];
		return this;
	}
	public Clone() : BitArray {
		let ba : BitArray = new BitArray(0);
		ba._bits = this._bits.slice(0);
		return ba;
	}
}

const Char_MinValue : int = 0;
const Char_MaxValue : int = 0xFF;
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

class Token {
    public  kind : int = 0;    // token kind
    public  pos : int = 0;     // token position in bytes in the source text (starting at 0)
    public  charPos : int = 0;  // token position in characters in the source text (starting at 0)
    public  col : int = 1;     // token column (starting at 1)
    public  line : int = 1;    // token line (starting at 1)
    public  val : string;  // token value
    public  next : Token | null = null;  // ML 2005-03-11 Tokens are kept in linked list
}

//-----------------------------------------------------------------------------------
// StringBuffer
//-----------------------------------------------------------------------------------
class Buffer {

    public static readonly EOF : int = -1;
    buf : string;         // input buffer
    bufStart : int;       // position of first byte in buffer relative to input stream
    bufLen : int;         // length of buffer
    bufPos : int;         // current position in buffer

    public constructor (s : string) {
        this.buf = s;
        this.bufLen = s.length;
        this.bufStart = this.bufPos = 0;
    }

    public /*virtual*/ Read () : int {
        if (this.bufPos < this.bufLen) {
            return this.buf.charCodeAt(this.bufPos++);
        } else {
            return Buffer.EOF;
        }
    }

    public Peek () : int {
        const curPos : int = this.getPos();
        const ch : int = this.Read();
        this.setPos(curPos);
        return ch;
    }

    // beg .. begin, zero-based, inclusive, in byte
    // end .. end, zero-based, exclusive, in byte
    public GetString (beg : int, end : int) : string {
        return this.buf.slice(beg, end);
    }

    public getPos() : int { return this.bufPos + this.bufStart; }
    public setPos(value : int) : void {
        if (value < 0 || value > this.bufLen) {
            throw "buffer out of bounds access, position: " + value;
        }

        if (value >= this.bufStart && value < this.bufStart + this.bufLen) { // already in buffer
            this.bufPos = value - this.bufStart;
        } else {
            // set the position to the end of the file, Pos will return fileLen.
            this.bufPos = this.bufLen - this.bufStart;
        }
    }

}

//-----------------------------------------------------------------------------------
// Scanner
//-----------------------------------------------------------------------------------
class Scanner {
    static readonly  EOL : char = 10 /*'\n'*/;
    static readonly  eofSym : int = 0; /* pdt */
	static readonly maxT : int = 49;
	static readonly noSym : int = 49;


    public  buffer : Buffer; // scanner buffer

    private t : Token;          // current token
    private ch : int;           // current input character
    private pos : int;          // byte position of current character
    private charPos : int;      // position by unicode characters starting with 0
    private col : int;          // column number of current character
    private line : int;         // line number of current character
    private oldEols : int;      // EOLs that appeared in a comment;
    static  start : Array<int> = []; // maps first token character to start state

    private tokens : Token;     // list of tokens already peeked (first token is a dummy)
    private pt : Token;         // current peek token

    private tval : string; // text of current token
    private tlen : int;         // length of current token

    public parseFileName : string;
    public stateNo : int = 0;	// to user defined states

    private Init0() : void {
        Scanner.start = new Array<int>(128);
        for (let i=0; i<128; ++i) Scanner.start[i] = 0;
		for (let i : int = 65; i <= 90; ++i) Scanner.start[i] = 1;
		for (let i : int = 95; i <= 95; ++i) Scanner.start[i] = 1;
		for (let i : int = 97; i <= 122; ++i) Scanner.start[i] = 1;
		for (let i : int = 48; i <= 57; ++i) Scanner.start[i] = 2;
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

	}

    constructor(str : string , fileName : string) {
        this.parseFileName = fileName;
        this.buffer = new Buffer(str); // scanner buffer
        if(Scanner.start.length == 0) this.Init0();
        this.Init();
    }

    private  Init() : void {
        this.pos = -1; this.line = 1; this.col = 0; this.charPos = -1;
        this.oldEols = 0;
        this.NextCh();
        this.pt = this.tokens = new Token();  // first token is a dummy
    }

    private  NextCh() : void {
        if (this.oldEols > 0) { this.ch = Scanner.EOL; this.oldEols--; }
        else {
            this.pos = this.buffer.getPos();
            // buffer reads unicode chars, if UTF8 has been detected
            this.ch = this.buffer.Read(); this.col++; this.charPos++;
            // replace isolated '\r' by '\n' in order to make
            // eol handling uniform across Windows, Unix and Mac
            if (this.ch == 13 /*'\r'*/ && this.buffer.Peek() != Scanner.EOL /*'\n'*/) this.ch = Scanner.EOL;
            if (this.ch == Scanner.EOL) { this.line++; this.col = 0; }
        }

	}

    private AddCh() : void {
        if (this.ch != Buffer.EOF) {
            ++this.tlen;
            this.tval += String.fromCharCode(this.ch);
            this.NextCh();
        }
			//this.tval[this.tlen++] = (char) ch;
	}



	Comment0() : bool {
		let level : int = 1, pos0 = this.pos, line0 = this.line, col0 = this.col, charPos0 = this.charPos;
		this.NextCh();
		if ((this.ch as int) == 47 /*'/'*/) {
			this.NextCh();
			for(;;) {
				if ((this.ch as int) == 10) {
					level--;
					if (level == 0) { this.oldEols = this.line - line0; this.NextCh(); return true; }
					this.NextCh();
				} else if (this.ch == Buffer.EOF) return false;
				else this.NextCh();
			}
		}
		this.buffer.setPos(pos0); this.NextCh(); this.line = line0; this.col = col0; this.charPos = charPos0;
		return false;
	}

	Comment1() : bool {
		let level : int = 1, pos0 = this.pos, line0 = this.line, col0 = this.col, charPos0 = this.charPos;
		this.NextCh();
		if ((this.ch as int) == 42 /*'*'*/) {
			this.NextCh();
			for(;;) {
				if ((this.ch as int) == 42 /*'*'*/) {
					this.NextCh();
					if ((this.ch as int) == 47 /*'/'*/) {
						level--;
						if (level == 0) { /*this.oldEols = this.line - line0;*/ this.NextCh(); return true; }
						this.NextCh();
					}
				} else if ((this.ch as int) == 47 /*'/'*/) {
					this.NextCh();
					if ((this.ch as int) == 42 /*'*'*/) {
						level++; this.NextCh();
					}
				} else if (this.ch == Buffer.EOF) return false;
				else this.NextCh();
			}
		}
		this.buffer.setPos(pos0); this.NextCh(); this.line = line0; this.col = col0; this.charPos = charPos0;
		return false;
	}


    private  CheckLiteral() : void {
		switch (this.t.val) {
			case "COMPILER": this.t.kind = 6; break;
			case "IGNORECASE": this.t.kind = 7; break;
			case "TERMINALS": this.t.kind = 8; break;
			case "CHARACTERS": this.t.kind = 9; break;
			case "TOKENS": this.t.kind = 10; break;
			case "PRAGMAS": this.t.kind = 11; break;
			case "COMMENTS": this.t.kind = 12; break;
			case "FROM": this.t.kind = 13; break;
			case "TO": this.t.kind = 14; break;
			case "NESTED": this.t.kind = 15; break;
			case "IGNORE": this.t.kind = 16; break;
			case "SYMBOLTABLES": this.t.kind = 17; break;
			case "PRODUCTIONS": this.t.kind = 18; break;
			case "END": this.t.kind = 21; break;
			case "STRICT": this.t.kind = 22; break;
			case "ANY": this.t.kind = 26; break;
			case "out": this.t.kind = 31; break;
			case "WEAK": this.t.kind = 39; break;
			case "SYNC": this.t.kind = 44; break;
			case "IF": this.t.kind = 45; break;
			case "CONTEXT": this.t.kind = 46; break;
			default: break;
		}
	}

	public NextToken() : Token {
		for(;;) {
			while (this.ch == 32 /*' '*/ ||
				this.ch >= 9 && this.ch <= 10 || this.ch == 13
			)  this.NextCh();
			if (this.ch == 47 /*'/'*/ && this.Comment0() ||this.ch == 47 /*'/'*/ && this.Comment1()) continue;
			break;
		}

        let recKind : int = Scanner.noSym;
        let recEnd : int = this.pos;
        this.t = new Token();
        this.t.pos = this.pos; this.t.col = this.col; this.t.line = this.line; this.t.charPos = this.charPos;
        let state : int = (this.ch == Buffer.EOF) ? -1 : Scanner.start[this.ch];
        this.tlen = 0; this.tval = ""; this.AddCh();

        let loopState : bool = true;
        while(loopState) {
		switch (state) {
			case -1: { this.t.kind = Scanner.eofSym; loopState = false; break; } // NextCh already done
			case 0: {
				if (recKind != Scanner.noSym) {
					this.tlen = recEnd - this.t.pos;
					this.SetScannerBehindT();
				}
				this.t.kind = recKind; loopState = false; break;
			} // NextCh already done
			case 1:
				recEnd = this.pos; recKind = 1 /* ident */;
				if (this.ch >= 48 /*'0'*/ && this.ch <= 57 /*'9'*/ || this.ch >= 65 /*'A'*/ && this.ch <= 90 /*'Z'*/ || this.ch == 95 /*'_'*/ || this.ch >= 97 /*'a'*/ && this.ch <= 122 /*'z'*/) {this.AddCh(); state = 1; break;}
				else {this.t.kind = 1 /* ident */; this.t.val = this.tval; this.CheckLiteral(); return this.t;}
			case 2:
				recEnd = this.pos; recKind = 2 /* number */;
				if (this.ch >= 48 /*'0'*/ && this.ch <= 57 /*'9'*/) {this.AddCh(); state = 2; break;}
				else {this.t.kind = 2 /* number */; loopState = false; break;}
			case 3:
				{this.t.kind = 3 /* string */; loopState = false; break;}
			case 4:
				{this.t.kind = 4 /* badString */; loopState = false; break;}
			case 5:
				if (this.ch <= 9 || this.ch >= 11 && this.ch <= 12 || this.ch >= 14 && this.ch <= 38 /*'&'*/ || this.ch >= 40 /*'('*/ && this.ch <= 91 /*'['*/ || this.ch >= 93 /*']'*/ && this.ch <= 255) {this.AddCh(); state = 6; break;}
				else if (this.ch == 92) {this.AddCh(); state = 7; break;}
				else {state = 0; break;}
			case 6:
				if (this.ch == 39) {this.AddCh(); state = 9; break;}
				else {state = 0; break;}
			case 7:
				if (this.ch >= 32 /*' '*/ && this.ch <= 126 /*'~'*/) {this.AddCh(); state = 8; break;}
				else {state = 0; break;}
			case 8:
				if (this.ch >= 48 /*'0'*/ && this.ch <= 57 /*'9'*/ || this.ch >= 97 /*'a'*/ && this.ch <= 102 /*'f'*/) {this.AddCh(); state = 8; break;}
				else if (this.ch == 39) {this.AddCh(); state = 9; break;}
				else {state = 0; break;}
			case 9:
				{this.t.kind = 5 /* char */; loopState = false; break;}
			case 10:
				recEnd = this.pos; recKind = 50 /* ddtSym */;
				if (this.ch >= 48 /*'0'*/ && this.ch <= 57 /*'9'*/ || this.ch >= 65 /*'A'*/ && this.ch <= 90 /*'Z'*/ || this.ch == 95 /*'_'*/ || this.ch >= 97 /*'a'*/ && this.ch <= 122 /*'z'*/) {this.AddCh(); state = 10; break;}
				else {this.t.kind = 50 /* ddtSym */; loopState = false; break;}
			case 11:
				recEnd = this.pos; recKind = 51 /* optionSym */;
				if (this.ch >= 45 /*'-'*/ && this.ch <= 46 /*'.'*/ || this.ch >= 48 /*'0'*/ && this.ch <= 58 /*':'*/ || this.ch >= 65 /*'A'*/ && this.ch <= 90 /*'Z'*/ || this.ch == 95 /*'_'*/ || this.ch >= 97 /*'a'*/ && this.ch <= 122 /*'z'*/) {this.AddCh(); state = 11; break;}
				else {this.t.kind = 51 /* optionSym */; loopState = false; break;}
			case 12:
				if (this.ch <= 9 || this.ch >= 11 && this.ch <= 12 || this.ch >= 14 && this.ch <= 33 /*'!'*/ || this.ch >= 35 /*'#'*/ && this.ch <= 91 /*'['*/ || this.ch >= 93 /*']'*/ && this.ch <= 255) {this.AddCh(); state = 12; break;}
				else if (this.ch == 10 || this.ch == 13) {this.AddCh(); state = 4; break;}
				else if (this.ch == 34 /*'"'*/) {this.AddCh(); state = 3; break;}
				else if (this.ch == 92) {this.AddCh(); state = 14; break;}
				else {state = 0; break;}
			case 13:
				recEnd = this.pos; recKind = 50 /* ddtSym */;
				if (this.ch >= 48 /*'0'*/ && this.ch <= 57 /*'9'*/) {this.AddCh(); state = 10; break;}
				else if (this.ch >= 65 /*'A'*/ && this.ch <= 90 /*'Z'*/ || this.ch == 95 /*'_'*/ || this.ch >= 97 /*'a'*/ && this.ch <= 122 /*'z'*/) {this.AddCh(); state = 15; break;}
				else {this.t.kind = 50 /* ddtSym */; loopState = false; break;}
			case 14:
				if (this.ch >= 32 /*' '*/ && this.ch <= 126 /*'~'*/) {this.AddCh(); state = 12; break;}
				else {state = 0; break;}
			case 15:
				recEnd = this.pos; recKind = 50 /* ddtSym */;
				if (this.ch >= 48 /*'0'*/ && this.ch <= 57 /*'9'*/) {this.AddCh(); state = 10; break;}
				else if (this.ch >= 65 /*'A'*/ && this.ch <= 90 /*'Z'*/ || this.ch == 95 /*'_'*/ || this.ch >= 97 /*'a'*/ && this.ch <= 122 /*'z'*/) {this.AddCh(); state = 15; break;}
				else if (this.ch == 61 /*'='*/) {this.AddCh(); state = 11; break;}
				else {this.t.kind = 50 /* ddtSym */; loopState = false; break;}
			case 16:
				{this.t.kind = 19 /* "=" */; loopState = false; break;}
			case 17:
				{this.t.kind = 23 /* "+" */; loopState = false; break;}
			case 18:
				{this.t.kind = 24 /* "-" */; loopState = false; break;}
			case 19:
				{this.t.kind = 25 /* ".." */; loopState = false; break;}
			case 20:
				{this.t.kind = 27 /* ":" */; loopState = false; break;}
			case 21:
				{this.t.kind = 28 /* "@" */; loopState = false; break;}
			case 22:
				{this.t.kind = 30 /* "^" */; loopState = false; break;}
			case 23:
				{this.t.kind = 32 /* ">" */; loopState = false; break;}
			case 24:
				{this.t.kind = 33 /* "," */; loopState = false; break;}
			case 25:
				{this.t.kind = 34 /* "<." */; loopState = false; break;}
			case 26:
				{this.t.kind = 35 /* ".>" */; loopState = false; break;}
			case 27:
				{this.t.kind = 36 /* "[" */; loopState = false; break;}
			case 28:
				{this.t.kind = 37 /* "]" */; loopState = false; break;}
			case 29:
				{this.t.kind = 38 /* "|" */; loopState = false; break;}
			case 30:
				{this.t.kind = 41 /* ")" */; loopState = false; break;}
			case 31:
				{this.t.kind = 42 /* "{" */; loopState = false; break;}
			case 32:
				{this.t.kind = 43 /* "}" */; loopState = false; break;}
			case 33:
				{this.t.kind = 47 /* "(." */; loopState = false; break;}
			case 34:
				{this.t.kind = 48 /* ".)" */; loopState = false; break;}
			case 35:
				recEnd = this.pos; recKind = 20 /* "." */;
				if (this.ch == 46 /*'.'*/) {this.AddCh(); state = 19; break;}
				else if (this.ch == 62 /*'>'*/) {this.AddCh(); state = 26; break;}
				else if (this.ch == 41 /*')'*/) {this.AddCh(); state = 34; break;}
				else {this.t.kind = 20 /* "." */; loopState = false; break;}
			case 36:
				recEnd = this.pos; recKind = 29 /* "<" */;
				if (this.ch == 46 /*'.'*/) {this.AddCh(); state = 25; break;}
				else {this.t.kind = 29 /* "<" */; loopState = false; break;}
			case 37:
				recEnd = this.pos; recKind = 40 /* "(" */;
				if (this.ch == 46 /*'.'*/) {this.AddCh(); state = 33; break;}
				else {this.t.kind = 40 /* "(" */; loopState = false; break;}

		}
        }
        this.t.val = this.tval;
        return this.t;
    }

    private  SetScannerBehindT() : void {
        this.buffer.setPos(this.t.pos);
        this.NextCh();
        this.line = this.t.line; this.col = this.t.col; this.charPos = this.t.charPos;
        for ( let i : int = 0; i < this.tlen; i++) this.NextCh();
    }

    // get the next token (possibly a token already seen during peeking)
    public  Scan () : Token {
        if (this.tokens.next == null) {
            return this.NextToken();
        } else {
            this.pt = this.tokens = this.tokens.next;
            return this.tokens;
        }
    }

    // peek for the next token, ignore pragmas
    public  Peek () : Token {
        do {
            if (this.pt.next == null) {
                this.pt.next = this.NextToken();
            }
            this.pt = this.pt.next;
        } while (this.pt.kind > Scanner.maxT); // skip pragmas

        return this.pt;
    }

    // make sure that peeking starts at the current scan position
    public  ResetPeek () : void { this.pt = this.tokens; }

} // end Scanner

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

    class Position {  // position of source code stretch (e.g. semantic action, resolver expressions)
        public readonly  beg : int;      // start relative to the beginning of the file
        public readonly  end : int;      // end of stretch
        public readonly  col : int;      // column number of start position
        public readonly  line : int;     // line number of start position

         constructor( beg : int,  end : int,  col : int,  line : int) {
            this.beg = beg; this.end = end; this.col = col; this.line = line;
        }
    }

    class SymInfo { // output attribute of symbols in the ATG
        name : string;
        kind : int;		// 0 = ident, 1 = string
    }
    
    //=====================================================================
    // Symbol
    //=====================================================================

    class Symbol {

        // token kinds
        public static readonly  fixedToken : int    = 0; // e.g. 'a' ('b' | 'c') (structure of literals)
        public static readonly  classToken : int    = 1;	// e.g. digit {digit}   (at least one char class)
        public static readonly  litToken : int      = 2; // e.g. "while"
        public static readonly  classLitToken : int = 3; // e.g. letter {letter} but without literals that have the same structure

        public       n : int;           // symbol number
        public       typ : int;         // t, nt, pr, unknown, rslv /* ML 29_11_2002 slv added */ /* AW slv --> rslv */
        public    name : string;        // symbol name
        public      graph : Node;       // nt: to first node of syntax graph
        public       tokenKind : int = 0;   // t:  token kind (fixedToken, classToken, ...)
        public      deletable : bool = false;   // nt: true if nonterminal is deletable
        public      firstReady : bool;  // nt: true if terminal start symbols have already been computed
        public  first : BitArray;       // nt: terminal start symbols
        public  follow : BitArray;      // nt: terminal followers
        public  nts : BitArray;         // nt: nonterminals whose followers have to be added to this sym
        public       line : int;        // source text line number of item in this node
        public  col : int;              // source text line column number of item in this node
        public  attrPos : Position | null;     // nt: position of attributes in source text (or null)
        public  semPos : Position | null;      // pr: pos of semantic action in source text (or null)
                                               // nt: pos of local declarations in source text (or null)
        public retType : string | null;        // AH - nt: Type of output attribute (or null)
        public retVar : string | null;         // AH - nt: Name of output attribute (or null)
                                 
        public  	inherits : Symbol;    // optional, token from which this token derives
        public      eqAttribute : int=0;  // store an options equality attribute like "@="

         constructor( typ : int,  name : string,  line : int,  col : int) {
            this.typ = typ; this.name = name; this.line = line; this.col = col;
        }
    }


    //=====================================================================
    // Node
    //=====================================================================

    class Node {
        // constants for node kinds
        public static readonly  t : int    =  1;  // terminal symbol
        public static readonly  pr : int   =  2;  // pragma
        public static readonly  nt : int   =  3;  // nonterminal symbol
        public static readonly  clas : int =  4;  // character class
        public static readonly  chr : int  =  5;  // character
        public static readonly  wt : int   =  6;  // weak terminal symbol
        public static readonly  any : int  =  7;  //
        public static readonly  eps : int  =  8;  // empty
        public static readonly  sync : int =  9;  // synchronization symbol
        public static readonly  sem : int  = 10;  // semantic action: (. .)
        public static readonly  alt : int  = 11;  // alternative: |
        public static readonly  iter : int = 12;  // iteration: { }
        public static readonly  opt : int  = 13;  // option: [ ]
        public static readonly  rslv : int = 14;  // resolver expr

        public static readonly  normalTrans : int  = 0;		// transition codes
        public static readonly  contextTrans : int = 1;

        public       n : int = 0;			// node number
        public       typ : int;		// t, nt, wt, chr, clas, any, eps, sem, sync, alt, iter, opt, rslv
        public      next : Node | null = null;		// to successor node
        public      down : Node | null = null;		// alt: to next alternative
        public      sub : Node | null = null;		// alt, iter, opt: to first node of substructure
        public      up : bool = false;			// true: "next" leads to successor in enclosing structure
        public    sym : Symbol | null;		// nt, t, wt: symbol represented by this node
        public       val : int = 0;		// chr:  ordinal character value
                                                        // clas: index of character class
        public       code : int = 0;		// chr, clas: transition code
        public  set : BitArray;		// any, sync: the set represented by this node
        public  pos : Position | null = null;		// nt, t, wt: pos of actual attributes
                                        // sem:       pos of semantic action in source text
                                        // rslv:       pos of resolver in source text
        public       line : int;           // source text line number of item in this node
        public       col : int;            // source text line column number of item in this node
        public     state : State;          // DFA state corresponding to this node
                                                        // (only used in DFA.ConvertToStates)
	    public  retVar : string | null;			// AH 20040206 - nt: name of output attribute (or null)
        public    declares : string;       // t, wt: the symbol declares a new entry to the symboltable with this name
        public    declared : string;       // t, wt: the symbol has to be declared in the symboltable with this name

         constructor( typ : int,  sym : Symbol | null,  line : int,  col : int) {
            this.typ = typ; this.sym = sym; this.line = line; this.col = col;
        }
    }

    //=====================================================================
    // Graph
    //=====================================================================

    class Graph {
        public  l : Node | null;	// left end of graph = head
        public  r : Node | null;	// right end of graph = list of nodes to be linked to successor graph

         constructor( left : Node | null = null,  right : Node | null = null) {
            this.l = left; this.r = right == null ? left : right;
        }

    }

    //=====================================================================
    // Sets
    //=====================================================================

    class Sets {

        public static  Elements( s : BitArray) : int {
             let max : int = s.Count();
             let n : int = 0;
            for ( let i : int=0; i<max; i++)
                if (s.Get(i)) n++;
            return n;
        }

        public static  Equals( a : BitArray,  b : BitArray) : bool {
             let max : int = a.Count();
            for ( let i : int=0; i<max; i++)
                if (a.Get(i) != b.Get(i)) return false;
            return true;
        }

        public static  Intersect( a : BitArray,  b : BitArray) : bool { // a * b != {}
             let max : int = a.Count();
            for ( let i : int=0; i<max; i++)
                if (a.Get(i) && b.Get(i)) return true;
            return false;
        }

        public static  Subtract( a : BitArray,  b : BitArray) : void { // a = a - b
             let c : BitArray = b.Clone();
            a.And(c.Not());
        }

    }

    //=====================================================================
    // CharClass
    //=====================================================================

    class CharClass {
        public  n : int;       	// class number
        public  name : string;		// class name
        public  set : CharSet;	// set representing the class

         constructor( name : string,  s : CharSet) {
            this.name = name; this.set = s;
        }
    }

    //=====================================================================
    // SymTab
    //=====================================================================

    class SymTab {
        public  name : string;
        public  strict : bool = false;
        public predefined : Array<string> = new Array<string>();

         constructor( name : string) { this.name = name; }

        public  Add( name : string) : void {
            if (this.predefined.indexOf(name) < 0) this.predefined.push(name);
        }
    }

    //=====================================================================
    // Tab
    //=====================================================================

    class TabCNode {	// node of list for finding circular productions
        public  left : Symbol;
        public right : Symbol;

        constructor ( l : Symbol,  r : Symbol) {
            this.left = l; this.right = r;
        }
    }


    class Tab {
        public  semDeclPos : Position;       // position of global semantic declarations
        public  ignored : CharSet;           // characters ignored by the scanner
        public  genAST : bool = false;       // generate parser tree generation code
        public  genRREBNF : bool = false;	  //generate EBNF for railroad diagram
        public  ignoreErrors : bool = false; // ignore grammar errors for developing purposes
        public  ddt : Array<bool> = new Array<bool>(10); // debug and test switches
        public  gramSy : Symbol | null;             // root nonterminal; filled by ATG
        public  eofSy : Symbol;              // end of file symbol
        public  noSym : Symbol;              // used in case of an error
        public  allSyncSets : BitArray;      // union of all synchronisation sets
        public  literals : {[key: string]: Symbol};        // symbols that are used as literals
        public  symtabs : Array<SymTab> = new Array<SymTab>();
        public  srcName : string;            // name of the atg file (including path)
        public  srcDir : string;             // directory path of the atg file
        public  nsName : string;             // namespace for generated files
        public  frameDir : string;           // directory containing the frame files
        public  outDir : string;             // directory for generated files
        public  checkEOF : bool = true;      // should coco generate a check for EOF at
                                          //   the end of Parser.Parse():
        public  emitLines : bool;            // emit #line pragmas for semantic actions
                                          //   in the generated parser

         private visited : BitArray;                 // mark list for graph traversals
         private curSy : Symbol;                     // current symbol in computation of sets

         private parser : Parser;                    // other Coco objects
         private trace : StringWriter;
         private errors : Errors;

         constructor( parser : Parser) {
            this.parser = parser;
            this.trace = parser.trace;
            this.errors = parser.errors;
            this.eofSy = this.NewSym(Node.t, "EOF", 0, 0);
            this.dummyNode = this.NewNodeSym(Node.eps, null, 0, 0);
            this.literals = {}; //new Hashtable();
        }

        //---------------------------------------------------------------------
        //  Symbol list management
        //---------------------------------------------------------------------

        public  terminals : Array<Symbol> = new Array<Symbol>();
        public  pragmas : Array<Symbol> = new Array<Symbol>();
        public  nonterminals : Array<Symbol> = new Array<Symbol>();

        private tKind : string[] = ["fixedToken", "classToken", "litToken", "classLitToken"];

        public  NewSym( typ : int,  name : string,  line : int,  col : int) : Symbol {
            if (name.length == 2 && name.charCodeAt(0) == 34 /*'"'*/) {
                this.parser.SemErr("empty token not allowed"); name = "???";
            }
            let sym : Symbol = new Symbol(typ, name, line, col);
            switch (typ) {
                case Node.t:  sym.n = this.terminals.length; this.terminals.push(sym); break;
                case Node.pr: this.pragmas.push(sym); break;
                case Node.nt: sym.n = this.nonterminals.length; this.nonterminals.push(sym); break;
            }
            return sym;
        }

        public  FindSym( name : string) : Symbol | null {
            for ( let s of this.terminals)
                if (s.name == name) return s;
            for ( let s of this.nonterminals)
                if (s.name == name) return s;
            return null;
        }

        public  FindSymtab( name : string) : SymTab | null {
            for ( let st of this.symtabs)
                if (st.name == name) return st;
            return null;
        }

        public  FindLiteral( name : string) : Symbol | null {
            if(this.literals.hasOwnProperty(name))
                return this.literals[name];
            return null;
        }

        private  Num( p : Node) : int {
            if (p == null) return 0; else return p.n;
        }

        private  PrintSym( sym : Symbol) : void {
            this.trace.Write(sprintf("%3d  %-14s %s", sym.n, this.Name(sym.name, 14), this.nTyp[sym.typ]));
            if (sym.attrPos==null) this.trace.Write("false "); else this.trace.Write("true  ");
            if (sym.retVar==null) this.trace.Write("false "); else this.trace.Write("true  ");
            if (sym.typ == Node.nt) {
                this.trace.Write(sprintf("%6d", this.Num(sym.graph)));
                if (sym.deletable) this.trace.Write(" true  "); else this.trace.Write(" false ");
            } else
                this.trace.Write("            ");
            this.trace.WriteLine(sprintf("%5d %s", sym.line, this.tKind[sym.tokenKind]));
        }

        public  PrintSymbolTable() : void {
            this.trace.WriteLine("Symbol Table:");
            this.trace.WriteLine("------------"); this.trace.WriteLine();
            this.trace.WriteLine(" nr  name          typ  hasAt hasRet graph del    line tokenKind");
            for ( let sym of this.terminals) this.PrintSym(sym);
            for ( let sym of this.pragmas) this.PrintSym(sym);
            for ( let sym of this.nonterminals) this.PrintSym(sym);
            this.trace.WriteLine();
            this.trace.WriteLine("Literal Tokens:");
            this.trace.WriteLine("--------------");
            for ( const k in this.literals) {
                if(this.literals.hasOwnProperty(k))
                    this.trace.WriteLine("_" + this.literals[k].name + " = " + k + ".");
            }
            this.trace.WriteLine();
        }

        public  PrintSet( s : BitArray,  indent : int) : void {
            let col : int, len : int;
            col = indent;
            for ( let sym of this.terminals) {
                if (s.Get(sym.n)) {
                    len = sym.name.length;
                    if (col + len >= 80) {
                        this.trace.WriteLine();
                        for (col = 1; col < indent; col++) this.trace.Write(" ");
                    }
                    this.trace.Write(sym.name + " ");
                    col += len + 1;
                }
            }
            if (col == indent) this.trace.Write("-- empty set --");
            this.trace.WriteLine();
        }

        //---------------------------------------------------------------------
        //  Syntax graph management
        //---------------------------------------------------------------------

        public  nodes : Array<Node> = new Array<Node>();
        public nTyp : string[] =
            ["    ", "t   ", "pr  ", "nt  ", "clas", "chr ", "wt  ", "any ", "eps ",
             "sync", "sem ", "alt ", "iter", "opt ", "rslv"];
        private dummyNode : Node;

        public  NewNodeSym( typ : int,  sym : Symbol | null,  line : int,  col : int) : Node {
            let node : Node = new Node(typ, sym, line, col);
            node.n = this.nodes.length;
            this.nodes.push(node);
            return node;
        }

        public  NewNodeNode( typ : int,  sub : Node) : Node {
            let node : Node = this.NewNodeSym(typ, null, sub.line, sub.col);
            node.sub = sub;
            return node;
        }

        public  NewNodeVal( typ : int,  val : int,  line : int,  col : int) : Node {
             let node : Node = this.NewNodeSym(typ, null, line, col);
            node.val = val;
            return node;
        }

        public  MakeFirstAlt( g : Graph) : void {
            g.l = this.NewNodeNode(Node.alt, g.l!);
            g.r!.up = true;
            g.l.next = g.r;
            g.r = g.l;
        }

        // The result will be in g1
        public  MakeAlternative( g1 : Graph,  g2 : Graph) : void {
            g2.l = this.NewNodeNode(Node.alt, g2.l!);
            g2.l.up = true;
            g2.r!.up = true;
            let p : Node = g1.l!; while (p.down != null) p = p.down;
            p.down = g2.l;
            p = g1.r!; while (p.next != null) p = p.next;
            // append alternative to g1 end list
            p.next = g2.l;
            // append g2 end list to g1 end list
            g2.l.next = g2.r;
        }

        // The result will be in g1
        public  MakeSequence( g1 : Graph,  g2 : Graph) : void {
            let p : Node | null = g1.r!.next; g1.r!.next = g2.l; // link head node
            while (p != null) {  // link substructure
                let q : Node | null = p.next; p.next = g2.l;
                p = q;
            }
            g1.r = g2.r;
        }

        public  MakeOptionIter( g : Graph, typ : int) : void {
            g.l = this.NewNodeNode(typ, g.l!);
            g.r!.up = true;
        }

        public  MakeIteration( g : Graph) : void {
            this.MakeOptionIter(g, Node.iter);
            let p : Node | null = g.r;
            g.r = g.l;
            while (p != null) {
                let q : Node | null = p.next; p.next = g.l;
                p = q;
            }
        }

        public  MakeOption( g : Graph) : void {
            this.MakeOptionIter(g, Node.opt);
            g.l.next = g.r;
            g.r = g.l;
        }

        public  Finish( g : Graph) : void {
            let p : Node | null = g.r;
            while (p != null) {
                let q : Node | null = p.next; p.next = null;
                p = q;
            }
        }

        public  DeleteNodes() : void {
            this.nodes = new Array<Node>();
            this.dummyNode = this.NewNodeSym(Node.eps, null, 0, 0);
        }

        public  StrToGraph( str : string) : Graph {
             let s : string = this.Unstring(str);
            if (s.length == 0) this.parser.SemErr("empty token not allowed");
             let g : Graph = new Graph();
            g.r = this.dummyNode;
            for ( let i : int = 0; i < s.length; i++) {
                 let p : Node = this.NewNodeVal(Node.chr, s.charCodeAt(i), 0, 0);
                g.r.next = p; g.r = p;
            }
            g.l = this.dummyNode.next; this.dummyNode.next = null;
            return g;
        }

      public  SetContextTrans( p : Node | null) : void { // set transition code in the graph rooted at p
        while (p != null) {
          if (p.typ == Node.chr || p.typ == Node.clas) {
            p.code = Node.contextTrans;
          } else if (p.typ == Node.opt || p.typ == Node.iter) {
            this.SetContextTrans(p.sub);
          } else if (p.typ == Node.alt) {
            this.SetContextTrans(p.sub); this.SetContextTrans(p.down);
          }
          if (p.up) break;
          p = p.next;
        }
      }

        //------------ graph deletability check -----------------

        public static  DelGraph( p : Node | null) : bool {
            return p == null || this.DelNode(p) && this.DelGraph(p.next);
        }

        public static  DelSubGraph( p : Node | null) : bool {
            return p == null || this.DelNode(p) && (p.up || this.DelSubGraph(p.next));
        }

        public static  DelNode( p : Node) : bool {
            if (p.typ == Node.nt) return p.sym!.deletable;
            else if (p.typ == Node.alt) return this.DelSubGraph(p.sub) || p.down != null && this.DelSubGraph(p.down);
            else return p.typ == Node.iter || p.typ == Node.opt || p.typ == Node.sem
                || p.typ == Node.eps || p.typ == Node.rslv || p.typ == Node.sync;
        }

        //----------------- graph printing ----------------------

        private  Ptr( p : Node | null,  up : bool) : string {
            let ptr : string = (p == null) ? "0" : p.n.toString();
            return (up && (ptr != "0")) ? ("-" + ptr) : ptr;
        }

        private  Pos( pos : Position | null) : string {
            if (pos == null) return "     "; else return pos.beg.toString();//StringFormat("{0,5}", pos.beg);
        }

        public  Name( name : string, size : int = 12) : string {
            return (name + "              ").substr(0, size);
            // found no simpler way to get the first 12 characters of the name
            // padded with blanks on the right
        }

        public  PrintNodes() : void {
            this.trace.WriteLine("Graph nodes:");
            this.trace.WriteLine("----------------------------------------------------------");
            this.trace.WriteLine("   n type name          next  down   sub   pos  line   col");
            this.trace.WriteLine("                               val  code");
            this.trace.WriteLine("----------------------------------------------------------");
            for ( let p of this.nodes) {
                this.trace.Write(sprintf("%4d %s ", p.n, this.nTyp[p.typ]));
                if (p.sym != null)
                    this.trace.Write(sprintf("%12s ", this.Name(p.sym.name)));
                else if (p.typ == Node.clas) {
                     let c : CharClass = this.classes[p.val];
                    this.trace.Write(sprintf("%12s ", this.Name(c.name)));
                } else this.trace.Write("             ");
                this.trace.Write(sprintf("%5s ", this.Ptr(p.next, p.up)));
                switch (p.typ) {
                    case Node.t: case Node.nt: case Node.wt:
                        this.trace.Write(sprintf("             %5d", this.Pos(p.pos))); break;
                    case Node.chr:
                        this.trace.Write(sprintf("%5d %5d       ", p.val, p.code)); break;
                    case Node.clas:
                        this.trace.Write(sprintf("      %5d       ", p.code)); break;
                    case Node.alt: case Node.iter: case Node.opt:
                        this.trace.Write(sprintf("%5d %5d       ", this.Ptr(p.down, false), this.Ptr(p.sub, false))); break;
                    case Node.sem:
                        this.trace.Write(sprintf("             %5d", this.Pos(p.pos))); break;
                    case Node.eps: case Node.any: case Node.sync: case Node.rslv:
                        this.trace.Write("                  "); break;
                    default:
                        this.trace.Write("                 ?"); break;
                }
                this.trace.WriteLine(sprintf("%5d %5d", p.line, p.col));
            }
            this.trace.WriteLine();
        }


        //---------------------------------------------------------------------
        //  Character class management
        //---------------------------------------------------------------------

        public  classes : Array<CharClass> = new Array<CharClass>();
        public  dummyName : int = 65 /*'A'*/;

        public  NewCharClass( name : string,  s : CharSet) : CharClass {
            if (name == "#") {name = "#" + String.fromCharCode(this.dummyName);++this.dummyName;}
             let c : CharClass = new CharClass(name, s);
            c.n = this.classes.length;
            this.classes.push(c);
            return c;
        }

        public  FindCharClassByName( name : string) : CharClass | null {
            for ( let c of this.classes)
                if (c.name == name) return c;
            return null;
        }

        public  FindCharClass( s : CharSet) : CharClass | null {
            for ( let c of this.classes)
                if (s.Equals(c.set)) return c;
            return null;
        }

        public  CharClassSet( i : int) : CharSet {
            return this.classes[i].set;
        }

        //----------- character class printing

        private  Ch( ch : int) : string {
            if (ch < 32 /*' '*/ || ch >= 127 || ch == 92 /*'\''*/ || ch == 92 /*'\\'*/) return ch.toString();
            else return `'${String.fromCharCode(ch)}'`; //StringFormat("'{0}'", ch);
        }

        private  WriteCharSet( s : CharSet) : void {
            for (let r : CharSetRange | null = s.head; r != null; r = r.next)
                if (r.rfrom < r.rto) { this.trace.Write(this.Ch(r.rfrom) + ".." + this.Ch(r.rto) + " "); }
                else { this.trace.Write(this.Ch(r.rfrom) + " "); }
        }

        public  WriteCharClasses () : void {
            for ( let c of this.classes) {
                this.trace.Write(sprintf("%-10s: ", c.name));
                this.WriteCharSet(c.set);
                this.trace.WriteLine();
            }
            this.trace.WriteLine();
        }


        //---------------------------------------------------------------------
        //  Symbol set computations
        //---------------------------------------------------------------------

        /* Computes the first set for the graph rooted at p */
        private  First0( p : Node | null,  mark : BitArray) : BitArray {
            let fs : BitArray = new BitArray(this.terminals.length);
            while (p != null && !mark.Get(p.n)) {
                mark.Set(p.n, true);
                switch (p.typ) {
                    case Node.nt: {
                        if (p.sym!.firstReady) fs.Or(p.sym!.first);
                        else fs.Or(this.First0(p.sym!.graph, mark));
                        break;
                    }
                    case Node.t: case Node.wt: {
                        fs.Set(p.sym!.n, true); break;
                    }
                    case Node.any: {
                        fs.Or(p.set); break;
                    }
                    case Node.alt: {
                        fs.Or(this.First0(p.sub, mark));
                        fs.Or(this.First0(p.down, mark));
                        break;
                    }
                    case Node.iter: case Node.opt: {
                        fs.Or(this.First0(p.sub, mark));
                        break;
                    }
                }
                if (!Tab.DelNode(p)) break;
                p = p.next;
            }
            return fs;
        }

        public  First( p : Node | null) : BitArray {
            let fs : BitArray = this.First0(p, new BitArray(this.nodes.length));
            if (this.ddt[3]) {
                this.trace.WriteLine();
                if (p != null) this.trace.Write(sprintf("First: node = %d\tline = %d\tcol = %d\ttype = %s\t%s\n", p.n,
				    p.line, p.col, this.nTyp[p.typ], (p.sym != null) ? p.sym.name : ""));
                else this.trace.WriteLine("First: node = null");
                this.trace.Write("         "); this.PrintSet(fs, 10);
            }
            return fs;
        }

        private  CompFirstSets() : void {
            for ( let sym of this.nonterminals) {
                sym.first = new BitArray(this.terminals.length);
                sym.firstReady = false;
            }
            this.trace.WriteLine("Computing First Sets: " + this.nonterminals.length);
            for ( let sym of this.nonterminals) {
                this.trace.Write(sprintf("\nSymbol: %s %d:%d", sym.name, sym.line, sym.col));
                sym.first = this.First(sym.graph);
                sym.firstReady = true;
            }
        }

        private  CompFollow( p : Node | null) : void {
            while (p != null && !this.visited.Get(p.n)) {
                this.visited.Set(p.n, true);
                if (p.typ == Node.nt) {
                     let s : BitArray = this.First(p.next);
                    p.sym!.follow.Or(s);
                    if (Tab.DelGraph(p.next))
                        p.sym!.nts.Set(this.curSy.n, true);
                } else if (p.typ == Node.opt || p.typ == Node.iter) {
                    this.CompFollow(p.sub);
                } else if (p.typ == Node.alt) {
                    this.CompFollow(p.sub); this.CompFollow(p.down);
                }
                p = p.next;
            }
        }

        private  Complete( sym : Symbol) : void {
            if (!this.visited.Get(sym.n)) {
                this.visited.Set(sym.n, true);
                for ( let s of this.nonterminals) {
                    if (sym.nts.Get(s.n)) {
                        this.Complete(s);
                        sym.follow.Or(s.follow);
                        if (sym == this.curSy) sym.nts.Set(s.n, false);
                    }
                }
            }
        }

        private  CompFollowSets() : void {
            for ( let sym of this.nonterminals) {
                sym.follow = new BitArray(this.terminals.length);
                sym.nts = new BitArray(this.nonterminals.length);
            }
            this.gramSy!.follow.Set(this.eofSy.n, true);
            this.visited = new BitArray(this.nodes.length);
            for ( let sym of this.nonterminals) { // get direct successors of nonterminals
                this.curSy = sym;
                this.CompFollow(sym.graph);
            }
            for ( let sym of this.nonterminals) { // add indirect successors to followers
                this.visited = new BitArray(this.nonterminals.length);
                this.curSy = sym;
                this.Complete(sym);
            }
        }

        private  LeadingAny( p : Node | null) : Node | null {
            if (p == null) return null;
            let a : Node | null = null;
            if (p.typ == Node.any) a = p;
            else if (p.typ == Node.alt) {
                a = this.LeadingAny(p.sub);
                if (a == null) a = this.LeadingAny(p.down);
            }
            else if (p.typ == Node.opt || p.typ == Node.iter) a = this.LeadingAny(p.sub);
            if (a == null && Tab.DelNode(p) && !p.up) a = this.LeadingAny(p.next);
            return a;
        }

        private  FindAS( p : Node | null) : void { // find ANY sets
            let a : Node | null;
            while (p != null) {
                if (p.typ == Node.opt || p.typ == Node.iter) {
                    this.FindAS(p.sub);
                    a = this.LeadingAny(p.sub);
                    if (a != null) Sets.Subtract(a.set, this.First(p.next));
                } else if (p.typ == Node.alt) {
                     let s1 : BitArray = new BitArray(this.terminals.length);
                     let q : Node | null = p;
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
                        let q : Node | null = (p.typ == Node.nt) ? p.sym!.graph : p.sub;
                        Sets.Subtract(a.set, this.First(q));
                    }
                }

                if (p.up) break;
                p = p.next;
            }
        }

        private  CompAnySets() : void {
            for ( let sym of this.nonterminals) this.FindAS(sym.graph);
        }

        public  Expected( p : Node,  curSy : Symbol) : BitArray {
            let s : BitArray = this.First(p);
            if (Tab.DelGraph(p)) s.Or(curSy.follow);
            return s;
        }

        // does not look behind resolvers; only called during LL(1) test and in CheckRes
        public  Expected0( p : Node,  curSy : Symbol) : BitArray {
            if (p.typ == Node.rslv) return new BitArray(this.terminals.length);
            else return this.Expected(p, curSy);
        }

        private  CompSync( p : Node | null) : void {
            while (p != null && !this.visited.Get(p.n)) {
                this.visited.Set(p.n, true);
                if (p.typ == Node.sync) {
                     let s : BitArray = this.Expected(p.next!, this.curSy);
                    s.Set(this.eofSy.n, true);
                    this.allSyncSets.Or(s);
                    p.set = s;
                } else if (p.typ == Node.alt) {
                    this.CompSync(p.sub); this.CompSync(p.down);
                } else if (p.typ == Node.opt || p.typ == Node.iter)
                    this.CompSync(p.sub);
                p = p.next;
            }
        }

        private  CompSyncSets() : void {
            this.allSyncSets = new BitArray(this.terminals.length);
            this.allSyncSets.Set(this.eofSy.n, true);
            this.visited = new BitArray(this.nodes.length);
            for ( let sym of this.nonterminals) {
                this.curSy = sym;
                this.CompSync(this.curSy.graph);
            }
        }

        public  SetupAnys() : void {
            for ( let p of this.nodes)
                if (p.typ == Node.any) {
                    p.set = new BitArray(this.terminals.length, true);
                    p.set.Set(this.eofSy.n, false);
                }
        }

        public  CompDeletableSymbols() : void {
             let changed : bool;
            do {
                changed = false;
                for ( let sym of this.nonterminals)
                    if (!sym.deletable && sym.graph != null && Tab.DelGraph(sym.graph)) {
                        sym.deletable = true; changed = true;
                    }
            } while (changed);
            for ( let sym of this.nonterminals)
                if (sym.deletable) this.errors.WarningStr("  " + sym.name + " deletable");
        }

        public  RenumberPragmas() : void {
             let n : int = this.terminals.length;
            for ( let sym of this.pragmas) sym.n = n++;
        }

        public  CompSymbolSets() : void {
            this.CompDeletableSymbols();
            this.CompFirstSets();
            this.CompAnySets();
            this.CompFollowSets();
            this.CompSyncSets();
            if (this.ddt[1]) {
                this.trace.WriteLine();
                this.trace.WriteLine("First & follow symbols:");
                this.trace.WriteLine("----------------------"); this.trace.WriteLine();
                for ( let sym of this.nonterminals) {
                    this.trace.WriteLine(sprintf("%s -> line: %d", sym.name, sym.line));
                    this.trace.Write("first:   "); this.PrintSet(sym.first, 10);
                    this.trace.Write("follow:  "); this.PrintSet(sym.follow, 10);
                    this.trace.WriteLine();
                }
            }
            if (this.ddt[4]) {
                this.trace.WriteLine();
                this.trace.WriteLine("ANY and SYNC sets:");
                this.trace.WriteLine("-----------------");
                for ( let p of this.nodes)
                    if (p.typ == Node.any || p.typ == Node.sync) {
                        this.trace.WriteLine(sprintf("Node: %4d %4s: Line: %4d", p.n, this.nTyp[p.typ], p.line));
                        this.trace.Write("         "); this.PrintSet(p.set, 10);
                    }
            }
        }

        //---------------------------------------------------------------------
        //  String handling
        //---------------------------------------------------------------------

        private  Hex2Char( s : string) : char {
             let val : int = 0;
            for ( let i : int = 0; i < s.length; i++) {
                 let ch : char = s.charCodeAt(i);
                if (48 /*'0'*/ <= ch && ch <= 57 /*'9'*/) val = 16 * val + (ch - 48 /*'0'*/);
                else if (97 /*'a'*/ <= ch && ch <= 102 /*'f'*/) val = 16 * val + (10 + ch - 97 /*'a'*/);
                else if (65 /*'A'*/ <= ch && ch <= 70 /*'F'*/) val = 16 * val + (10 + ch - 65 /*'A'*/);
                else this.parser.SemErr("bad escape sequence in string or character");
            }
            if (val > Char_MaxValue) /* pdt */
                this.parser.SemErr("bad escape sequence in string or character");
            return val;
        }

        private  Char2Hex( ch : char) : string {
            // let w : StringWriter = new StringWriter();
            //w.Write("\\u{0:x4}", (int)ch);
            return `\\u${ch.toString(16)}`; //w.ToString();
        }

        public  Unstring( s : string) : string {
            if (s == null || s.length < 2) return s;
            return this.Unescape(s.substr(1, s.length - 2));
        }

        public  Unescape ( s : string) : string {
            /* replaces escape sequences in s by their Unicode values. */
             let buf : StringBuilder = new StringBuilder();
             let i : int = 0;
            while (i < s.length) {
                if (s.charCodeAt(i) == 92 /*'\\'*/) {
                    switch (s.charCodeAt(i+1)) {
                        case 92 /*'\\'*/: buf.Append("\\" /*'\\'*/); i += 2; break;
                        case 39 /*'\''*/: buf.Append("'" /*'\''*/); i += 2; break;
                        case 34 /*'\"'*/: buf.Append("\"" /*'\"'*/); i += 2; break;
                        case 114 /*'r'*/: buf.Append("\r" /*'\r'*/); i += 2; break;
                        case 110 /*'n'*/: buf.Append("\n" /*'\n'*/); i += 2; break;
                        case 116 /*'t'*/: buf.Append("\t" /*'\t'*/); i += 2; break;
                        case 48 /*'0'*/: buf.Append("\0" /*'\0'*/); i += 2; break;
                        case 97 /*'a'*/: buf.Append("\a" /*'\a'*/); i += 2; break;
                        case 98 /*'b'*/: buf.Append("\b" /*'\b'*/); i += 2; break;
                        case 102 /*'f'*/: buf.Append("\f" /*'\f'*/); i += 2; break;
                        case 118 /*'v'*/: buf.Append("\v" /*'\v'*/); i += 2; break;
                        case 117 /*'u'*/: case 120 /*'x'*/:
                            if (i + 6 <= s.length) {
                                buf.Append(String.fromCharCode(this.Hex2Char(s.substr(i+2, 4)))); i += 6; break;
                            } else {
                                this.parser.SemErr("bad escape sequence in string or character"); i = s.length; break;
                            }
                        default: this.parser.SemErr("bad escape sequence in string or character"); i += 2; break;
                    }
                } else {
                    buf.Append(s[i]);
                    i++;
                }
            }
            return buf.ToString();
        }

        public  Quoted ( s : string) : string {
            if (s == null) return "null";
            return "\"" + this.Escape(s) + "\"";
        }

        public  Escape ( s : string) : string {
            let buf : StringBuilder = new StringBuilder();
            for ( let ch of s) {
                switch(ch) {
                    case "\\": buf.Append("\\\\"); break;
                    case "'": buf.Append("\\'"); break;
                    case "\"": buf.Append("\\\""); break;
                    case "\t": buf.Append("\\t"); break;
                    case "\r": buf.Append("\\r"); break;
                    case "\n": buf.Append("\\n"); break;
                    default:
                        if (ch < " " || ch > "\u007f") buf.Append(this.Char2Hex(ch.charCodeAt(0)));
                        else buf.Append(ch);
                        break;
                }
            }
            return buf.ToString();
        }

        //---------------------------------------------------------------------
        //  Grammar checks
        //---------------------------------------------------------------------

        public  GrammarOk() : bool {
             let ok : bool = this.NtsComplete()
                && this.AllNtReached()
                && this.NoCircularProductions()
                && this.AllNtToTerm();
            if (ok) { this.CheckResolvers(); this.CheckLL1(); }
            return ok;
        }

        public  GrammarCheckAll() : bool {
            let errors : int = 0;
            if(!this.NtsComplete()) ++errors;
            if(!this.AllNtReached()) ++errors;
            if(!this.NoCircularProductions()) throw "CircularProductions found."; //System.Environment.Exit(1);
            if(!this.AllNtToTerm()) ++errors;
            this.CheckResolvers(); this.CheckLL1();
            return errors == 0;
        }

        //--------------- check for circular productions ----------------------

        private  GetSingles( p : Node | null,  singles : Array<Symbol>) : void {
            if (p == null) return;  // end of graph
            if (p.typ == Node.nt) {
                singles.push(p.sym!);
            } else if (p.typ == Node.alt || p.typ == Node.iter || p.typ == Node.opt) {
                if (p.up || Tab.DelGraph(p.next)) {
                    this.GetSingles(p.sub, singles);
                    if (p.typ == Node.alt) this.GetSingles(p.down, singles);
                }
            }
            if (!p.up && Tab.DelNode(p)) this.GetSingles(p.next, singles);
        }

        public  NoCircularProductions() : bool {
            let ok : bool, changed : bool, onLeftSide : bool, onRightSide : bool;
            let list : Array<TabCNode> = new Array<TabCNode>();
            for ( let sym of this.nonterminals) {
                let singles : Array<Symbol> = new Array<Symbol>();
                this.GetSingles(sym.graph, singles); // get nonterminals s such that sym-->s
                for ( let s of singles) list.push(new TabCNode(sym, s));
            }
            do {
                changed = false;
                for ( let i : int = 0; i < list.length; i++) {
                    let n : TabCNode = list[i];
                    onLeftSide = false; onRightSide = false;
                    for ( let m of list) {
                        if (n.left == m.right) onRightSide = true;
                        if (n.right == m.left) onLeftSide = true;
                    }
                    if (!onLeftSide || !onRightSide) {
                        list.splice(i, 1); i--; changed = true;
                    }
                }
            } while(changed);
            ok = true;
            for ( let n of list) {
                ok = false;
                this.errors.SemErr("  " + n.left.name + ":" + n.left.line + " --> " + n.right.name + ":" + n.right.line);
            }
            return ok;
        }

        //--------------- check for LL(1) errors ----------------------

        private  LL1Error( cond : int,  sym : Symbol | null) : void {
             let s : string = "  LL1 warning in " + this.curSy.name + ":" + this.curSy.line + ":" + this.curSy.col + ": ";
                 if (sym != null) s += sym.name + " is ";
            switch (cond) {
                case 1: s += "start of several alternatives"; break;
                case 2: s += "start & successor of deletable structure"; break;
                case 3: s += "an ANY node that matches no symbol"; break;
                case 4: s += "contents of [...] or {...} must not be deletable"; break;
            }
            this.errors.WarningStr(s);
        }

        private  CheckOverlap( s1 : BitArray,  s2 : BitArray,  cond : int) : int {
             let overlaped : int = 0;
            for ( let sym of this.terminals) {
                    if (s1.Get(sym.n) && s2.Get(sym.n)) { this.LL1Error(cond, sym); ++overlaped; }
            }
            return overlaped;
            }

        /* print the path for first set that contains token tok for the graph rooted at p */
        private  PrintFirstPath( p : Node | null,  tok : int,  indent : string = "\t",  depth : int = 0) : void
        {
            //if(p && p.sym) Console.WriteLine("{0}==> {1}:{2}:{3}: {4}", indent, p.sym.name, p.sym.line, p.sym.col, depth);
            //else Console.WriteLine("{0}==> xxx:{0}", indent, depth);
            while (p != null)
            {
                //if(p.sym) Console.WriteLine("{0}----> {1}:{2}:{3}: {4}", indent, p.sym.name, p.sym.line, p.sym.col, depth);
                switch (p.typ)
                {
                case Node.nt:
                {
                    if (p.sym!.firstReady)
                    {
                        if (p.sym!.first.Get(tok))
                        {
                            if (indent.length == 1) console.log(`${indent}=> ${p.sym!.name}:${p.line}:${p.col}:`);
                            console.log(`${indent}-> ${p.sym.name}:${p.sym.line}:${p.sym.col}:`);
                            if (p.sym!.graph != null) this.PrintFirstPath(p.sym!.graph, tok, indent + "  ", depth + 1);
                            return;
                        }
                    }
                    break;
                }
                case Node.t:
                case Node.wt:
                {
                    if (p.sym!.n == tok) console.log(`${indent}= ${p.sym!.name}:${p.line}:${p.col}:`);
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
                    if (!Tab.DelNode(p.sub!)) //prevent endless loop with some ill grammars
                        this.PrintFirstPath(p.sub, tok, indent, depth + 1);
                    break;
                }
                }
                if (!Tab.DelNode(p)) break;
                p = p.next;
            }
        }

        private  CheckAlts( p : Node | null) : int {
             let s1 : BitArray, s2 : BitArray;
             let rc : int = 0;
            while (p != null) {
                if (p.typ == Node.alt) {
                     let q : Node | null = p;
                    s1 = new BitArray(this.terminals.length);
                    while (q != null) { // for all alternatives
                        s2 = this.Expected0(q.sub!, this.curSy);
                         let overlaped : int = this.CheckOverlap(s1, s2, 1);
                        if (overlaped > 0)
                        {
                             let overlapToken : int = 0;
                            /* Find the first overlap token */
                            for ( let sym of this.terminals)
                            {
                                if (s1.Get(sym.n) && s2.Get(sym.n)) { overlapToken = sym.n; break; }
                            }
                            //Console.WriteLine("\t-> {0}:{1}: {2}", first_overlap.sub.sym.name, first_overlap.sub.sym.line, overlaped);
                            this.PrintFirstPath(p, overlapToken);
                            rc += overlaped;
                        }
                        s1.Or(s2);
                        this.CheckAlts(q.sub);
                        q = q.down;
                    }
                } else if (p.typ == Node.opt || p.typ == Node.iter) {
                    if (Tab.DelSubGraph(p.sub)) this.LL1Error(4, null); // e.g. [[...]]
                    else {
                        s1 = this.Expected0(p.sub!, this.curSy);
                        s2 = this.Expected(p.next!, this.curSy);
                         let overlaped : int = this.CheckOverlap(s1, s2, 2);
                        if (overlaped > 0)
                        {
                             let overlapToken : int = 0;
                            /* Find the first overlap token */
                            for ( let sym of this.terminals)
                            {
                                if (s1.Get(sym.n) && s2.Get(sym.n)) { overlapToken = sym.n; break; }
                            }
                            //Console.WriteLine(format("\t=>:{0}: {1}", p.line, overlaped));
                            this.PrintFirstPath(p, overlapToken);
                            rc += overlaped;
                        }
                    }
                    this.CheckAlts(p.sub);
                } else if (p.typ == Node.any) {
                    if (Sets.Elements(p.set) == 0) this.LL1Error(3, null);
                    // e.g. {ANY} ANY or [ANY] ANY or ( ANY | ANY )
                }
                if (p.up) break;
                p = p.next;
            }
            return rc;
        }

        public  CheckLL1() : void {
            for ( let sym of this.nonterminals) {
                this.curSy = sym;
                this.CheckAlts(this.curSy.graph);
            }
        }

        //------------- check if resolvers are legal  --------------------

        private  ResErr( p : Node,  msg : string) : void {
            this.errors.Warning(p.line, p.col, msg);
        }

        private  CheckRes( p : Node | null,  rslvAllowed : bool) : void {
            while (p != null) {
                switch (p.typ) {
                    case Node.alt:
                         let expected : BitArray = new BitArray(this.terminals.length);
                        for ( let q : Node | null = p; q != null; q = q.down)
                            expected.Or(this.Expected0(q.sub!, this.curSy));
                         let soFar : BitArray = new BitArray(this.terminals.length);
                        for ( let q : Node | null = p; q != null; q = q.down) {
                            if (q.sub!.typ == Node.rslv) {
                               let fs : BitArray = this.Expected(q.sub!.next!, this.curSy);
                                if (Sets.Intersect(fs, soFar))
                                    this.ResErr(q.sub!, "Warning: Resolver will never be evaluated. " +
                                    "Place it at previous conflicting alternative.");
                                if (!Sets.Intersect(fs, expected))
                                    this.ResErr(q.sub!, "Warning: Misplaced resolver: no LL(1) conflict.");
                            } else soFar.Or(this.Expected(q.sub!, this.curSy));
                            this.CheckRes(q.sub, true);
                        }
                        break;
                    case Node.iter: case Node.opt:
                        if (p.sub!.typ == Node.rslv) {
                             let fs : BitArray = this.First(p.sub!.next);
                             let fsNext : BitArray = this.Expected(p.next!, this.curSy);
                            if (!Sets.Intersect(fs, fsNext))
                                this.ResErr(p.sub!, "Warning: Misplaced resolver: no LL(1) conflict.");
                        }
                        this.CheckRes(p.sub, true);
                        break;
                    case Node.rslv:
                        if (!rslvAllowed)
                            this.ResErr(p, "Warning: Misplaced resolver: no alternative.");
                        break;
                }
                if (p.up) break;
                p = p.next;
                rslvAllowed = false;
            }
        }

        public  CheckResolvers() : void {
            for ( let sym of this.nonterminals) {
                this.curSy = sym;
                this.CheckRes(this.curSy.graph, false);
            }
        }

        //------------- check if every nts has a production --------------------

        public  NtsComplete() : bool {
             let complete : bool = true;
            for ( let sym of this.nonterminals) {
                if (sym.graph == null) {
                    complete = false;
                    this.errors.SemErr("  No production for " + sym.name);
                }
            }
            return complete;
        }

        //-------------- check if every nts can be reached  -----------------

        private  MarkReachedNts( p : Node | null) : void {
            while (p != null) {
                if (p.typ == Node.nt && !this.visited.Get(p.sym!.n)) { // new nt reached
                    this.visited.Set(p.sym!.n, true);
                    this.MarkReachedNts(p.sym!.graph);
                } else if (p.typ == Node.alt || p.typ == Node.iter || p.typ == Node.opt) {
                    this.MarkReachedNts(p.sub);
                    if (p.typ == Node.alt) this.MarkReachedNts(p.down);
                }
                if (p.up) break;
                p = p.next;
            }
        }

        public  AllNtReached() : bool {
             let ok : bool = true;
            this.visited = new BitArray(this.nonterminals.length);
            this.visited.Set(this.gramSy!.n, true);
            this.MarkReachedNts(this.gramSy!.graph);
            for ( let sym of this.nonterminals) {
                if (!this.visited.Get(sym.n)) {
                    ok = false;
                    this.errors.WarningStr("  " + sym.name + " cannot be reached");
                }
            }
            return ok;
        }

        //--------- check if every nts can be derived to terminals  ------------

        private  IsTerm( p : Node | null,  mark : BitArray) : bool { // true if graph can be derived to terminals
            while (p != null) {
                if (p.typ == Node.nt && !mark.Get(p.sym!.n)) return false;
                if (p.typ == Node.alt && !this.IsTerm(p.sub, mark)
                && (p.down == null || !this.IsTerm(p.down, mark))) return false;
                if (p.up) break;
                p = p.next;
            }
            return true;
        }

        public  AllNtToTerm() : bool {
             let changed : bool, ok : bool = true;
             let mark : BitArray = new BitArray(this.nonterminals.length);
            // a nonterminal is marked if it can be derived to terminal symbols
            do {
                changed = false;
                for ( let sym of this.nonterminals)
                    if (!mark.Get(sym.n) && this.IsTerm(sym.graph, mark)) {
                        mark.Set(sym.n, true); changed = true;
                    }
            } while (changed);
            for ( let sym of this.nonterminals)
                if (!mark.Get(sym.n)) {
                    ok = false;
                    this.errors.SemErr("  " + sym.name + " cannot be derived to terminals");
                }
            return ok;
        }

        //---------------------------------------------------------------------
        //  Cross reference list
        //---------------------------------------------------------------------

        public  XRef() : void {
            let xref : {[key : string] : Array<int>} = {}; //let xref : SortedList = new SortedList(new SymbolComp());
            let xref_sorted : Array<Symbol> = [];
            // collect lines where symbols have been defined
            for ( let sym of this.nonterminals) {
                let list : Array<int> = xref[sym.name];
                if (list == null) {list = new Array<int>(); xref_sorted.push(sym); xref[sym.name] = list;}
                list.push(- sym.line);
            }
            // collect lines where symbols have been referenced
            for ( let n of this.nodes) {
                if (n.typ == Node.t || n.typ == Node.wt || n.typ == Node.nt) {
                    let list : Array<int> = xref[n.sym!.name];
                    if (list == null) {list = new Array<int>(); xref_sorted.push(n.sym!); xref[n.sym!.name] = list;}
                    list.push(n.line);
                }
            }
            xref_sorted.sort(function(a : Symbol, b : Symbol) {
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
            this.trace.WriteLine("--------------------"); this.trace.WriteLine();
            for ( let sym of xref_sorted) {
                this.trace.Write(sprintf("  %12s", this.Name(sym.name)));
                let list : Array<int> = xref[sym.name];
                let col : int = 14;
                for ( let line of list) {
                    if (col + 5 > 80) {
                        this.trace.WriteLine();
                        for (col = 1; col <= 14; col++) this.trace.Write(" ");
                    }
                    this.trace.Write(sprintf("%5d", line)); col += 5;
                }
                this.trace.WriteLine();   
            }
            this.trace.WriteLine(); this.trace.WriteLine();
        }

        public  SetDDT( s : string) : void {
            s = s.toUpperCase();
            for ( let ch of s) {
                if ("0" <= ch && ch <= "9") this.ddt[Number(ch)] = true;
                else switch (ch) {
                    case "A" : this.ddt[0] = true; break; // trace automaton
                    case "F" : this.ddt[1] = true; break; // list first/follow sets
                    case "G" : this.ddt[2] = true; break; // print syntax graph
                    case "I" : this.ddt[3] = true; break; // trace computation of first sets
                    case "J" : this.ddt[4] = true; break; // print ANY and SYNC sets
                    case "P" : this.ddt[8] = true; break; // print statistics
                    case "S" : this.ddt[6] = true; break; // list symbol table
                    case "X" : this.ddt[7] = true; break; // list cross reference table
                    default : break;
                }
            }
        }

        public  SetOption( s : string) : void {
            let option : string[] = s.split("=", 2);
            let name : string = option[0], value : string = option[1];
            if ("$namespace" == name) {
                if (this.nsName == null) this.nsName = value;
            } else if ("$checkEOF" == name) {
                this.checkEOF = "true" == value;
            }
        }

    } // end Tab

//} // end namespace

/*//----End Tab.ts */

/*//----Start ParserGen.ts */
/*-------------------------------------------------------------------------
ParserGen.cs -- Generation of the Recursive Descent Parser
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

    type WriteToHandler = (sender: string, constent : string) => void;
    class ParserGen {

        static readonly  maxTerm : int = 3;		// sets of size < maxTerm are enumerated
        static readonly  CR : char  = 13 /*'\r'*/;
        static readonly  LF : char  = 10 /*'\n'*/;
        static readonly  EOF : int = -1;

        static readonly  tErr : int = 0;			// error codes
        static readonly  altErr : int = 1;
        static readonly  syncErr : int = 2;

        public  usingPos : Position | null; // "using" definitions from the attributed grammar
        private readonly  dfa : DFA;

         private errorNr : int;      // highest parser error number
         private curSy : Symbol;     // symbol whose production is currently generated
         private fram : Buffer; //FileStream;  // parser frame file
         private gen : StringWriter; //StreamWriter; // generated parser source file
         private err : StringWriter; // generated parser error messages
         private symSet : Array<BitArray> = new Array<BitArray>();

         private tab : Tab;          // other Coco objects
         private trace : StringWriter;
         private errors : Errors;
         private buffer : Buffer;
         public writeBufferTo : WriteToHandler | null = null;

        private  Indent ( n : int) : void {
            for ( let i : int = 1; i <= n; i++) this.gen.Write("\t");
        }


        private  Overlaps( s1 : BitArray,  s2 : BitArray) : bool {
             let len : int = s1.Count();
            for ( let i : int = 0; i < len; ++i) {
                if (s1.Get(i) && s2.Get(i)) {
                    return true;
                }
            }
            return false;
        }

        private  WriteSymbolOrCode( sym : Symbol) : void {
            if (!CharIsLetter(sym.name.charCodeAt(0))) {
                this.gen.Write(sym.n + " /* " + sym.name + " */");
            } else {
                this.gen.Write("Parser._" + sym.name);
            }
        }

        // use a switch if more than 5 alternatives and none starts with a resolver, and no LL1 warning
        private  UseSwitch ( p : Node ) : bool {
            let s1 : BitArray, s2 : BitArray;
            if (p.typ != Node.alt) return false;
            let nAlts : int = 0;
            s1 = new BitArray(this.tab.terminals.length);
            let p2 : Node | null = p;
            while (p2 != null) {
                s2 = this.tab.Expected0(p2.sub!, this.curSy);
                // must not optimize with switch statement, if there are ll1 warnings
                if (this.Overlaps(s1, s2)) { return false; }
                s1.Or(s2);
                ++nAlts;
                // must not optimize with switch-statement, if alt uses a resolver expression
                if (p2.sub!.typ == Node.rslv) return false;
                p2 = p2.down;
            }
            return nAlts > 5;
        }

        protected  CopySourcePart ( pos : Position | null,  indent : int) : void {
            // Copy text described by pos from atg to gen
             let ch : int, i : int;
            if (pos != null) {
                this.buffer.setPos(pos.beg); ch = this.buffer.Read();
                if (this.tab.emitLines) {
                    this.gen.WriteLine();
                    this.gen.WriteLine("#line " + pos.line + " \"" + this.tab.srcName + "\"");
                }
                this.Indent(indent);
                let done : bool = false;
                while (this.buffer.getPos() <= pos.end) {
                    while (ch == ParserGen.CR || ch == ParserGen.LF) {  // eol is either CR or CRLF or LF
                        this.gen.WriteLine(); this.Indent(indent);
                        if (ch == ParserGen.CR) ch = this.buffer.Read(); // skip CR
                        if (ch == ParserGen.LF) ch = this.buffer.Read(); // skip LF
                        for (i = 1; i <= pos.col && (ch == 32 /*' '*/ || ch == 9 /*'\t'*/); i++) {
                            // skip blanks at beginning of line
                            ch = this.buffer.Read();
                        }
                        if (this.buffer.getPos() > pos.end) {done = true; break;}
                    }
                    if(done) break;
                    this.gen.Write(String.fromCharCode(ch));
                    ch = this.buffer.Read();
                }
                if (indent > 0) this.gen.WriteLine();
            }
        }

        /* TODO better interface for CopySourcePart */
        public  CopySourcePartPPG ( parser : Parser,  gen : StreamWriter,  pos : Position,  indent : int) : void {
            // Copy text described by pos from atg to gen
            let oldPos : int = parser.pgen.buffer.getPos();  // Pos is modified by CopySourcePart
            let prevGen : StringWriter = parser.pgen.gen;
            parser.pgen.gen = this.gen;
            parser.pgen.CopySourcePart(pos, 0);
            parser.pgen.gen = prevGen;
            parser.pgen.buffer.setPos(oldPos);
        }

        private  GenErrorMsg ( errTyp : int,  sym : Symbol) : void {
            this.errorNr++;
            this.err.Write("\t\t\tcase " + this.errorNr + ": s = \"");
            switch (errTyp) {
                case ParserGen.tErr:
                    if (sym.name.charCodeAt(0) == 34 /*'"'*/) this.err.Write(this.tab.Escape(sym.name) + " expected");
                    else this.err.Write(sym.name + " expected");
                    break;
                case ParserGen.altErr: this.err.Write("invalid " + sym.name); break;
                case ParserGen.syncErr: this.err.Write("this symbol not expected in " + sym.name); break;
            }
            this.err.WriteLine("\"; break;");
        }

        private  NewCondSet ( s : BitArray) : int {
            for ( let i : int = 1; i < this.symSet.length; i++) // skip symSet[0] (reserved for union of SYNC sets)
                if (Sets.Equals(s, this.symSet[i])) return i;
            this.symSet.push(s.Clone());
            return this.symSet.length - 1;
        }

        private  GenCond ( s : BitArray,  p : Node) : void {
            if (p.typ == Node.rslv) this.CopySourcePart(p.pos, 0);
            else {
                 let n : int = Sets.Elements(s);
                if (n == 0) this.gen.Write("false"); // happens if an ANY set matches no symbol
                else if (n <= ParserGen.maxTerm)
                    for ( let sym of this.tab.terminals) {
                        if (s.Get(sym.n)) {
                            this.gen.Write("this.isKind(this.la, ");
                            this.WriteSymbolOrCode(sym);
                            this.gen.Write(")");
                            --n;
                            if (n > 0) this.gen.Write(" || ");
                        }
                    }
                else
                    this.gen.Write("this.StartOf(" + this.NewCondSet(s) + 
                        " /* " + this.tab.nTyp[p.typ] + " " + 
                        (p.typ == Node.nt ? p.sym!.name : "") + " */)",
                        );
            }
        }

        private  PutCaseLabels ( s0 : BitArray) : void {
             let s : BitArray = this.DerivationsOf(s0);
            for ( let sym of this.tab.terminals)
                if (s.Get(sym.n)) {
                    this.gen.Write("case ");
                    this.WriteSymbolOrCode(sym);
                    this.gen.Write(": ");
                }
        }

        private  DerivationsOf( s0 : BitArray) : BitArray {
             let s : BitArray = s0.Clone();
             let done : bool = false;
            while (!done) {
                done = true;
                for ( let sym of this.tab.terminals) {
                    if (s.Get(sym.n)) {
                        for ( let baseSym of this.tab.terminals) {
                            if (baseSym.inherits == sym && !s.Get(baseSym.n)) {
                                s.Set(baseSym.n, true);
                                done = false;
                            }
                        }
                    }
                }
            }
            return s;
        }

        private  GenSymboltableCheck( p : Node,  indent : int) : void {
            if (!stringIsNullOrEmpty(p.declares)) {
                this.Indent(indent);
                this.gen.WriteLine("if (!" + p.declares + ".Add(this.la)) SemErr(string.Format(DuplicateSymbol, " + this.tab.Quoted(p.sym!.name) + ", this.la.val, " + p.declares + ".name));");
                this.Indent(indent);
            } else if (!stringIsNullOrEmpty(p.declared)) {
                this.Indent(indent);
                this.gen.WriteLine("if (!" + p.declared + ".Use(this.la)) SemErr(string.Format(MissingSymbol, " + this.tab.Quoted(p.sym!.name) + ", this.la.val, " + p.declared + ".name));");
            }
        }

        private  GenCode ( p : Node | null,  indent : int,  isChecked : BitArray) : void {
            let p2 : Node | null;
            let s1 : BitArray, s2 : BitArray;
            while (p != null) {
                switch (p.typ) {
                    case Node.nt: {
                        this.Indent(indent);
                        if (p.retVar != null) this.gen.Write(p.retVar + " = ");
                        this.gen.Write("this." + p.sym!.name + "_NT(");
                        this.CopySourcePart(p.pos, 0);
                        this.gen.WriteLine(");");
                        break;
                    }
                    case Node.t: {
                        this.GenSymboltableCheck(p, indent);
                        this.Indent(indent);
                        // assert: if isChecked[p.sym.n] is true, then isChecked contains only p.sym.n
                        if (isChecked.Get(p.sym!.n)) {
                            this.gen.WriteLine("this.Get();");
                        }
                        else {
                            this.gen.Write("this.Expect(");
                            this.WriteSymbolOrCode(p.sym!);
                            this.gen.WriteLine(");");
                        }
                        if(this.tab.genAST) {
                            this.gen.WriteLine("#if PARSER_WITH_AST");
                            this.gen.WriteLine("\tthis.AstAddTerminal();");
                            this.gen.WriteLine("#endif");
                        }
                        break;
                    }
                    case Node.wt: {
                        this.Indent(indent);
                        s1 = this.tab.Expected(p.next!, this.curSy);
                        s1.Or(this.tab.allSyncSets);
                        this.gen.Write("this.ExpectWeak(");
                        this.WriteSymbolOrCode(p.sym!);
                        this.gen.WriteLine(", " + this.NewCondSet(s1) + ");");
                        break;
                    }
                    case Node.any: {
                        this.Indent(indent);
                         let acc : int = Sets.Elements(p.set);
                        if (this.tab.terminals.length == (acc + 1) || (acc > 0 && Sets.Equals(p.set, isChecked))) {
                            // either this ANY accepts any terminal (the + 1 = end of file), or exactly what115 /*'s allowed here
                            this.gen.WriteLine("this.Get();");
                        } else {
                            this.GenErrorMsg(ParserGen.altErr, this.curSy);
                            if (acc > 0) {
                                this.gen.Write("if ("); this.GenCond(p.set, p); this.gen.WriteLine(") this.Get(); else this.SynErr(" + this.errorNr + ");", );
                            } else this.gen.WriteLine("this.SynErr(" + this.errorNr + "); // ANY node that matches no symbol");
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
                        this.gen.Write("while (!("); this.GenCond(s1, p); this.gen.Write(")) {");
                        this.gen.Write("this.SynErr(" + this.errorNr + "); this.Get();"); this.gen.WriteLine("}");
                        break;
                    }
                    case Node.alt: {
                        s1 = this.tab.First(p);
                         let equal : bool = Sets.Equals(s1, isChecked);
                         let useSwitch : bool = this.UseSwitch(p);
                        if (useSwitch) { this.Indent(indent); this.gen.WriteLine("switch (this.la.kind) {"); }
                        p2 = p;
                        while (p2 != null) {
                            s1 = this.tab.Expected(p2.sub!, this.curSy);
                            this.Indent(indent);
                            if (useSwitch) {
                                this.PutCaseLabels(s1); this.gen.WriteLine("{");
                            } else if (p2 == p) {
                                this.gen.Write("if ("); this.GenCond(s1, p2.sub!); this.gen.WriteLine(") {");
                            } else if (p2.down == null && equal) { this.gen.WriteLine("} else {");
                            } else {
                                this.gen.Write("} else if (");  this.GenCond(s1, p2.sub!); this.gen.WriteLine(") {");
                            }
                            this.GenCode(p2.sub, indent + 1, s1);
                            if (useSwitch) {
                                this.Indent(indent); this.gen.WriteLine("\tbreak;");
                                this.Indent(indent); this.gen.WriteLine("}");
                            }
                            p2 = p2.down;
                        }
                        this.Indent(indent);
                        if (equal) {
                            this.gen.WriteLine("}");
                        } else {
                            this.GenErrorMsg(ParserGen.altErr, this.curSy);
                            if (useSwitch) {
                                this.gen.WriteLine("default: this.SynErr(" + this.errorNr + "); break;");
                                this.Indent(indent); this.gen.WriteLine("}");
                            } else {
                                this.gen.Write("} "); this.gen.WriteLine("else this.SynErr(" + this.errorNr + ");");
                            }
                        }
                        break;
                    }
                    case Node.iter: {
                        this.Indent(indent);
                        p2 = p.sub!;
                        this.gen.Write("while (");
                        if (p2.typ == Node.wt) {
                            s1 = this.tab.Expected(p2.next!, this.curSy);
                            s2 = this.tab.Expected(p.next!, this.curSy);
                            this.gen.Write("this.WeakSeparator(");
                            this.WriteSymbolOrCode(p2.sym!);
                            this.gen.Write("," + this.NewCondSet(s1) + "," + this.NewCondSet(s2) + ") ");
                            s1 = new BitArray(this.tab.terminals.length);  // for inner structure
                            if (p2.up || p2.next == null) p2 = null; else p2 = p2.next;
                        } else {
                            s1 = this.tab.First(p2);
                            this.GenCond(s1, p2);
                        }
                        this.gen.WriteLine(") {");
                        this.GenCode(p2, indent + 1, s1);
                        this.Indent(indent); this.gen.WriteLine("}");
                        break;
                    }
                    case Node.opt:
                        s1 = this.tab.First(p.sub);
                        this.Indent(indent);
                        this.gen.Write("if ("); this.GenCond(s1, p.sub!); this.gen.WriteLine(") {");
                        this.GenCode(p.sub, indent + 1, s1);
                        this.Indent(indent); this.gen.WriteLine("}");
                        break;
                }
                if (p.typ != Node.eps && p.typ != Node.sem && p.typ != Node.sync)
                    isChecked.SetAll(false);  // = new BitArray(tab.terminals.Count);
                if (p.up) break;
                p = p.next;
            }
        }

        private  GenTokenBase() : void {
             let idx : int = 0;
            for ( let sym of this.tab.terminals) {
                if((idx++ % 20) == 0) this.gen.Write("\n\t\t");
                if (sym.inherits == null)
                    this.gen.Write("-1,"); // not inherited
                else
                    this.gen.Write(sym.inherits.n + ",");
            }
        }

        private  GenTokens() : void {
            this.gen.WriteLine("\t//non terminals");
            for ( let sym of this.tab.nonterminals) {
                this.gen.WriteLine("\tpublic static readonly _NT_" + sym.name + " : int = " + sym.n + ";");
            }
            this.gen.WriteLine("\tpublic static readonly maxNT : int = " + (this.tab.nonterminals.length-1) + ";");
            this.gen.WriteLine("\t//terminals");
            for ( let sym of this.tab.terminals) {
                if (CharIsLetter(sym.name.charCodeAt(0)))
                    this.gen.Write("\tpublic static readonly _" + sym.name + " : int = " + sym.n + ";");
                else
                    this.gen.Write("//\tpublic static readonly _(" + sym.name + ") : int = " + sym.n + ";");
                if(sym.inherits != null)
                    this.gen.Write(" // INHERITS -> " + sym.inherits.name);
                this.gen.WriteLine();
            }
        }

        private  GenPragmas() : void {
            for ( let sym of this.tab.pragmas) {
                this.gen.WriteLine("\tpublic static readonly _" + sym.name + " : int = " + sym.n + ";");
            }
        }

        private  GenCodePragmas() : void {
            for ( let sym of this.tab.pragmas) {
                this.gen.Write("\t\t\tif (this.la.kind == ");
                this.WriteSymbolOrCode(sym);
                this.gen.WriteLine(") {");
                this.CopySourcePart(sym.semPos!, 4);
                this.gen.WriteLine("\t\t\t}");
            }
        }

        private  GenProductions() : void {
             let idx : int = 0;
            for ( let sym of this.tab.nonterminals) {
                this.curSy = sym;
                this.gen.Write("\tprivate " + sym.name + "_NT(");
                this.CopySourcePart(sym.attrPos!, 0);
                this.gen.Write(") : ");
                if (sym.retType == null) this.gen.Write("void"); else this.gen.Write(sym.retType);
                this.gen.WriteLine(" {");
                if (sym.retVar != null) this.gen.WriteLine("\t\tlet " + sym.retVar + " : " + sym.retType + ";");
                this.CopySourcePart(sym.semPos!, 2);
                if(this.tab.genAST) {
                    this.gen.WriteLine("#if PARSER_WITH_AST");
                    if(idx == 0) this.gen.WriteLine("\tToken rt = new Token(); rt.kind = _NT_" + sym.name + "; rt.val = \"" + sym.name + "\";ast_root = new SynTree( rt ); ast_stack = new Stack(); ast_stack.Push(ast_root);");
                    else this.gen.WriteLine("\tbool ntAdded = AstAddNonTerminal(_NT_" + sym.name + ", \"" + sym.name + "\", la.line);");
                    this.gen.WriteLine("#endif");
                }
                this.GenCode(sym.graph, 2, new BitArray(this.tab.terminals.length));
                if(this.tab.genAST) {
                    this.gen.WriteLine("#if PARSER_WITH_AST");
                    if(idx == 0) this.gen.WriteLine("\tAstPopNonTerminal();");
                    else this.gen.WriteLine("\tif(ntAdded) AstPopNonTerminal();");
                    this.gen.WriteLine("#endif");
                }
                if (sym.retVar != null) this.gen.WriteLine("\t\treturn " + sym.retVar + ";");
                this.gen.WriteLine("\t}"); this.gen.WriteLine();
                ++idx;
            }
        }

        private  InitSets() : void {
            for ( let i : int = 0; i < this.symSet.length; i++) {
                 let s : BitArray = this.DerivationsOf(this.symSet[i]);
                this.gen.Write("\t\t[");
                 let j : int = 0;
                for ( let sym of this.tab.terminals) {
                    if (s.Get(sym.n)) this.gen.Write("true,"); else this.gen.Write("false,");
                    ++j;
                    if (j%4 == 0) this.gen.Write(" ");
                }
                if (i == this.symSet.length-1) this.gen.WriteLine("false]"); else this.gen.WriteLine("false],");
            }
        }

        static  toTF( b : bool) : string {
            return b ? "true" : "false";
        }

        private  GenSymbolTables( declare : bool) : void {
            for ( let st of this.tab.symtabs)
            {
                if (declare)
                    this.gen.WriteLine("\tpublic readonly " + st.name + " : Symboltable | null;");
                else {
                    this.gen.WriteLine("\t\t" + st.name + " = new Symboltable(\"" + st.name + "\", " + ParserGen.toTF(this.dfa.ignoreCase) + ", " + ParserGen.toTF(st.strict) + ");");
                    for( let s of st.predefined)
                        this.gen.WriteLine("\t\tthis." + st.name + ".Add(" + this.tab.Quoted(s) + ");");
                }
            }
            if (declare) {
                this.gen.WriteLine("\tpublic symbols(name : string) : Symboltable | null {");
                for ( let st of this.tab.symtabs)
                    this.gen.WriteLine("\t\tif (name == " + this.tab.Quoted(st.name) + ") return this." + st.name + ";");
                this.gen.WriteLine("\t\treturn null;");
                this.gen.WriteLine("\t}");
            }
        }

        public  WriteParser () : void {
             let g : Generator = new Generator(this.tab);
             let oldPos : int = this.buffer.getPos();  // Pos is modified by CopySourcePart
            this.symSet.push(this.tab.allSyncSets);

            this.fram = g.OpenFrame(CocoParserFrame);
            this.gen = g.OpenGen("Parser.cs");
            this.err = new StringWriter();
            for ( let sym of this.tab.terminals) this.GenErrorMsg(ParserGen.tErr, sym);

            g.GenCopyright();
            g.SkipFramePart("-->begin");

            if (this.usingPos != null) { this.CopySourcePart(this.usingPos, 0); this.gen.WriteLine(); }
            g.CopyFramePart("-->namespace");
            /* AW open namespace, if it exists */
            if (this.tab.nsName != null && this.tab.nsName.length > 0) {
                this.gen.WriteLine("namespace " + this.tab.nsName + " {");
                this.gen.WriteLine();
            }
            g.CopyFramePart("-->constants");
            this.GenTokens(); /* ML 2002/09/07 write the token kinds */
            this.gen.WriteLine("\tpublic static readonly maxT : int = " + (this.tab.terminals.length-1) + ";");
            this.GenPragmas(); /* ML 2005/09/23 write the pragma kinds */
            g.CopyFramePart("-->declarations"); this.CopySourcePart(this.tab.semDeclPos, 0);
            this.GenSymbolTables(true);
            g.CopyFramePart("-->constructor");
            this.GenSymbolTables(false);
            g.CopyFramePart("-->pragmas"); this.GenCodePragmas();
            g.CopyFramePart("-->productions"); this.GenProductions();
            g.CopyFramePart("-->parseRoot"); this.gen.WriteLine("\t\tthis." + this.tab.gramSy!.name + "_NT();"); if (this.tab.checkEOF) this.gen.WriteLine("\t\tthis.Expect(0);");
            g.CopyFramePart("-->tbase"); this.GenTokenBase(); // write all tokens base types
            g.CopyFramePart("-->initialization"); this.InitSets();
            g.CopyFramePart("-->errors"); this.gen.Write(this.err.ToString());
            g.CopyFramePart(null);
            /* AW 2002-12-20 close namespace, if it exists */
            if (this.tab.nsName != null && this.tab.nsName.length > 0) this.gen.Write("}");
            if(this.writeBufferTo) this.writeBufferTo("WriteParser", this.gen.ToString());
            else console.log(this.gen.ToString());this.gen.Close();
            this.buffer.setPos(oldPos);
        }

        public  GenCodeRREBNF ( p : Node | null,  depth : int) : int {
             let rc : int = 0, loop_count : int = 0;
             let p2 : Node | null;
            while (p != null) {
                switch (p.typ) {
                    case Node.nt:
                    case Node.t: {
                        this.gen.Write(" ");
                        this.gen.Write(p.sym!.name);
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
                         let need_close_alt : bool = false;
                        if(depth > 0 || loop_count > 0 || p.next != null) {
                            this.gen.Write(" (");
                            need_close_alt = true;
                        }
                        p2 = p;
                        while (p2 != null) {
                            rc += this.GenCodeRREBNF(p2.sub, depth+1);
                            p2 = p2.down;
                            if(p2 != null) this.gen.Write(" |");
                        }
                        if(need_close_alt) this.gen.Write(" )");
                        break;
                    }
                    case Node.iter: {
                        if(!p.sub!.up) this.gen.Write(" (");
                        rc += this.GenCodeRREBNF(p.sub, depth+1);
                        if(!p.sub!.up) this.gen.Write(" )");
                        this.gen.Write("*");
                        break;
                    }
                    case Node.opt:
                        if(!p.sub!.up) this.gen.Write(" (");
                        rc += this.GenCodeRREBNF(p.sub, depth+1);
                        if(!p.sub!.up) this.gen.Write(" )");
                        this.gen.Write("?");
                        break;
                }
                if (p.up) break;
                p = p.next;
                ++loop_count;
            }
            return rc;
        }

        public  WriteRREBNF () : void {
            let g : Generator = new Generator(this.tab);
            this.gen = new StringWriter(); //g.OpenGen("Parser.ebnf");

            this.gen.Write("//\n// EBNF generated by CocoR parser generator to be viewed with https://www.bottlecaps.de/rr/ui\n//\n");
            this.gen.Write("\n//\n// productions\n//\n\n");
            for ( let sym of this.tab.nonterminals) {
                this.gen.Write(sym.name + " ::= ");
                if(this.GenCodeRREBNF(sym.graph, 0) == 0) {
                    this.gen.Write("\"??()??\"");
                }
                this.gen.Write("\n");
            }
            this.gen.Write("\n//\n// tokens\n//\n\n");
            for ( let sym of this.tab.terminals) {
                if (CharIsLetter(sym.name.charCodeAt(0))) { // real name value is stored in Tab.literals
                    for ( let k in this.tab.literals) {
                        if (this.tab.literals.hasOwnProperty(k) && this.tab.literals[k] == sym) {
                            this.gen.Write(sym.name + " ::= " + k + "\n");
                            break;
                        }
                    }
                } else {
                    //gen.Write("{0} /* {1} */", sym.n, sym.name);
                }
            }
            if(this.writeBufferTo) this.writeBufferTo("WriteRREBNF", this.gen.ToString());
            else console.log(this.gen.ToString());this.gen.Close();
        }

        public  WriteStatistics () : void {
            this.trace.WriteLine();
            this.trace.WriteLine(this.tab.terminals.length + " terminals");
            this.trace.WriteLine((this.tab.terminals.length + this.tab.pragmas.length +
                this.tab.nonterminals.length) + " symbols");
            this.trace.WriteLine(this.tab.nodes.length + " nodes");
            this.trace.WriteLine(this.symSet.length + " sets");
        }

         constructor ( parser : Parser) {
            this.tab = parser.tab;
            this.errors = parser.errors;
            this.trace = parser.trace;
            this.buffer = parser.scanner.buffer;
            this.dfa = parser.dfa;
            this.errorNr = -1;
            this.usingPos = null;
        }

    } // end ParserGen

//} // end namespace

/*//----End ParserGen.ts */

/*//----Start Parser.frame */
let CocoParserFrame : string = `
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
----------------------------------------------------------------------*/
-->begin

-->namespace

class Parser {
-->constants
    static readonly  minErrDist : int = 2;

    public  scanner : Scanner;
    public   errors : Errors;

    public  t : Token;    // last recognized token
    public  la : Token;   // lookahead token
    private errDist : int = Parser.minErrDist;

-->declarations

    constructor( scanner : Scanner) {
        this.scanner = scanner;
        this.errors = new Errors(this.scanner.parseFileName);
-->constructor
	}

    private  SynErr ( n : int) : void {
        if (this.errDist >= Parser.minErrDist) this.errors.SynErr(this.la.line, this.la.col, n);
        this.errDist = 0;
    }

    public  SemErr ( msg : string) : void {
        if (this.errDist >= Parser.minErrDist) this.errors.SemErrLineColStr(this.t.line, this.t.col, msg);
        this.errDist = 0;
    }

    private  Get () : void {
        for (;;) {
            //console.log(this.t, this.la);
            this.t = this.la;
            this.la = this.scanner.Scan();
            if (this.la.kind <= Parser.maxT) { ++this.errDist; break; }
-->pragmas
            this.la = this.t;
        }
    }

    private  isKind( t : Token,  n : int) : bool {
        let k : int = t.kind;
        while(k >= 0) {
            if (k == n) return true;
            k = Parser.tBase[k];
        }
        return false;
    }

    private  Expect ( n : int) : void {
        if (this.isKind(this.la, n)) this.Get(); else { this.SynErr(n); }
    }

    private  StartOf ( s : int) : bool {
        return Parser.set[s][this.la.kind];
    }

    private  ExpectWeak ( n : int,  follow : int) : void {
        if (this.isKind(this.la, n)) this.Get();
        else {
            this.SynErr(n);
            while (!this.StartOf(follow)) this.Get();
        }
    }


    private  WeakSeparator( n : int,  syFol : int,  repFol : int) : bool {
        let kind : int = this.la.kind;
        if (this.isKind(this.la, n)) {this.Get(); return true;}
        else if (this.StartOf(repFol)) {return false;}
        else {
            this.SynErr(n);
            while (!(Parser.set[syFol][kind] || Parser.set[repFol][kind] || Parser.set[0][kind])) {
                this.Get();
                kind = this.la.kind;
            }
            return this.StartOf(syFol);
        }
    }

	private SkipNested(leftKind: int, rightKind: int) : void {
		// manage nested braces
		if(this.la.kind != rightKind) {
			for (let nested : int = 1; nested > 0;) {
				//print("==", this.la.line, nested, this.la.kind, this.la.val);
				if(this.la.kind == leftKind) ++nested;
				this.Get();
				if(this.la.kind == rightKind) --nested;
				else if(this.la.kind == Parser._EOF) break;
			}
		}
	}

	private SkipTill(endKind : int) : void {
		while(this.la.kind != endKind || this.la.kind != Parser._EOF) {
			this.Get();
		}
	}

	private SkipTillEOL() : void {
		let currLine : int = this.la.line;
		while(this.la.line == currLine || this.la.kind != Parser._EOF) {
			this.Get();
		}
	}

-->productions

	public Parse() : void {
		this.la = new Token();
		this.la.val = "";
		this.Get();
-->parseRoot
	}

	// a token's base type
	public static readonly tBase : int[] = [
-->tbase
    ];

	static readonly set : bool[][] = [
-->initialization
    ];
/*
	public void CheckDeclared(errors : Errors) {
		let list : Array<Token>  = undeclaredTokens.Peek();
		for(Token t of list) {
			let msg : string  = string.Format(Parser.MissingSymbol, Parser.tName[this.t.kind], this.t.val, this.name);
			errors.SemErr(this.t.line, this.t.col, msg);
		}
	}
*/

/*#if PARSER_WITH_AST
	public ast_root : SynTree;
	private ast_stack : Stack ;

	public AstAddTerminal() : void {
        let st : SynTree = new SynTree( this.t );
        ((SynTree)(this.ast_stack.Peek())).children.Add(st);
	}

	public AstAddNonTerminal(kind : int, nt_name : string, line : int) : bool {
        let ntTok : Token  = new Token();
        ntTok.kind = kind;
        ntTok.line = line;
        ntTok.val = nt_name;
        let st : SynTree = new SynTree( ntTok );
        ((SynTree)(this.ast_stack.Peek())).children.Add(st);
        this.ast_stack.Push(st);
        return true;
	}

	public AstPopNonTerminal() : void {
        this.ast_stack.Pop();
	}
//#endif*/

} // end Parser


class Errors {
    public  count : int = 0;                                    // number of errors detected
    //public  errorStream : StreamWriter; //.IO.TextWriter = Console.Out;   // error messages go to this stream
    public  errMsgFormat : string = "-- line {0} col {1}: {2}"; // 0=line, 1=column, 2=text
    public  fileName : string = "grammar"; // 0=line, 1=column, 2=text

    constructor(fileName : string) {
        this.fileName = fileName;
    }

	public /*virtual*/  SynErr ( line : int,  col : int,  n : int) : void {
		let s : string;
		switch (n) {
-->errors
			default: s = "error " + n; break;
		}
		//errorStream.WriteLine(errMsgFormat, line, col, s);
		console.log(this.errMsgFormat, line, col, s);
		++this.count;
	}

    public /*virtual*/  SemErrLineColStr ( line : int,  col : int,  s : string) : void {
        //this.errorStream.WriteLine(this.errMsgFormat, line, col, s);
        console.log(this.errMsgFormat, line, col, s);
        ++this.count;
    }

    public /*virtual*/  SemErr ( s : string) : void {
        //this.errorStream.WriteLine(s);
        console.log(s);
        ++this.count;
    }

    public /*virtual*/  Warning ( line : int,  col : int,  s : string) : void {
        //this.errorStream.WriteLine(this.errMsgFormat, line, col, s);
        console.log(this.errMsgFormat, line, col, s);
    }

    public /*virtual*/  WarningStr( s : string) : void {
        //this.errorStream.WriteLine(s);
        console.log(s);
    }
} // Errors


class FatalError /*extends Exception*/ {
    constructor( m : string)  {throw(m);}
}

class Symboltable {
	public name : string ;
	public strict : bool ;
	public ignoreCase : bool ;
	public predefined : {};

	constructor(name : string, ignoreCase : bool, strict : bool) {
		this.name = name;
		this.ignoreCase = ignoreCase;
		this.strict = strict;
	}

	public Add(t : Token) : bool {
		if(!this.predefined.hasOwnProperty(t.val)) {
			this.predefined[t.val] = true;
			return true;
		}
		return false;
	}

	public Use(t : Token) : bool {
		return this.predefined.hasOwnProperty(t.val);
	}
}

`;
/*//----End Parser.frame */

/*//----Start Scanner.frame */
let CocoScannerFrame : string = `
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
-->begin

-->namespace

class Token {
    public  kind : int = 0;    // token kind
    public  pos : int = 0;     // token position in bytes in the source text (starting at 0)
    public  charPos : int = 0;  // token position in characters in the source text (starting at 0)
    public  col : int = 1;     // token column (starting at 1)
    public  line : int = 1;    // token line (starting at 1)
    public  val : string;  // token value
    public  next : Token | null = null;  // ML 2005-03-11 Tokens are kept in linked list
}

//-----------------------------------------------------------------------------------
// StringBuffer
//-----------------------------------------------------------------------------------
class Buffer {

    public static readonly EOF : int = -1;
    buf : string;         // input buffer
    bufStart : int;       // position of first byte in buffer relative to input stream
    bufLen : int;         // length of buffer
    bufPos : int;         // current position in buffer

    public constructor (s : string) {
        this.buf = s;
        this.bufLen = s.length;
        this.bufStart = this.bufPos = 0;
    }

    public /*virtual*/ Read () : int {
        if (this.bufPos < this.bufLen) {
            return this.buf.charCodeAt(this.bufPos++);
        } else {
            return Buffer.EOF;
        }
    }

    public Peek () : int {
        const curPos : int = this.getPos();
        const ch : int = this.Read();
        this.setPos(curPos);
        return ch;
    }

    // beg .. begin, zero-based, inclusive, in byte
    // end .. end, zero-based, exclusive, in byte
    public GetString (beg : int, end : int) : string {
        return this.buf.slice(beg, end);
    }

    public getPos() : int { return this.bufPos + this.bufStart; }
    public setPos(value : int) : void {
        if (value < 0 || value > this.bufLen) {
            throw "buffer out of bounds access, position: " + value;
        }

        if (value >= this.bufStart && value < this.bufStart + this.bufLen) { // already in buffer
            this.bufPos = value - this.bufStart;
        } else {
            // set the position to the end of the file, Pos will return fileLen.
            this.bufPos = this.bufLen - this.bufStart;
        }
    }

}

//-----------------------------------------------------------------------------------
// Scanner
//-----------------------------------------------------------------------------------
class Scanner {
    static readonly  EOL : char = 10 /*'\\n'*/;
    static readonly  eofSym : int = 0; /* pdt */
-->declarations

    public  buffer : Buffer; // scanner buffer

    private t : Token;          // current token
    private ch : int;           // current input character
    private pos : int;          // byte position of current character
    private charPos : int;      // position by unicode characters starting with 0
    private col : int;          // column number of current character
    private line : int;         // line number of current character
    private oldEols : int;      // EOLs that appeared in a comment;
    static  start : Array<int> = []; // maps first token character to start state

    private tokens : Token;     // list of tokens already peeked (first token is a dummy)
    private pt : Token;         // current peek token

    private tval : string; // text of current token
    private tlen : int;         // length of current token

    public parseFileName : string;
    public stateNo : int = 0;	// to user defined states

    private Init0() : void {
        Scanner.start = new Array<int>(128);
        for (let i=0; i<128; ++i) Scanner.start[i] = 0;
-->initialization
	}

    constructor(str : string , fileName : string) {
        this.parseFileName = fileName;
        this.buffer = new Buffer(str); // scanner buffer
        if(Scanner.start.length == 0) this.Init0();
        this.Init();
    }

    private  Init() : void {
        this.pos = -1; this.line = 1; this.col = 0; this.charPos = -1;
        this.oldEols = 0;
        this.NextCh();
        this.pt = this.tokens = new Token();  // first token is a dummy
    }

    private  NextCh() : void {
        if (this.oldEols > 0) { this.ch = Scanner.EOL; this.oldEols--; }
        else {
            this.pos = this.buffer.getPos();
            // buffer reads unicode chars, if UTF8 has been detected
            this.ch = this.buffer.Read(); this.col++; this.charPos++;
            // replace isolated '\\r' by '\\n' in order to make
            // eol handling uniform across Windows, Unix and Mac
            if (this.ch == 13 /*'\\r'*/ && this.buffer.Peek() != Scanner.EOL /*'\\n'*/) this.ch = Scanner.EOL;
            if (this.ch == Scanner.EOL) { this.line++; this.col = 0; }
        }
-->casing1
	}

    private AddCh() : void {
        if (this.ch != Buffer.EOF) {
            ++this.tlen;
            this.tval += String.fromCharCode(this.ch);
            this.NextCh();
        }
-->casing2
	}


-->comments

    private  CheckLiteral() : void {
-->literals
	}

	public NextToken() : Token {
		for(;;) {
			while (this.ch == 32 /*' '*/ ||
-->scan1
			)  this.NextCh();
-->scan2
			break;
		}
-->scan22
        let recKind : int = Scanner.noSym;
        let recEnd : int = this.pos;
        this.t = new Token();
        this.t.pos = this.pos; this.t.col = this.col; this.t.line = this.line; this.t.charPos = this.charPos;
        let state : int = (this.ch == Buffer.EOF) ? -1 : Scanner.start[this.ch];
        this.tlen = 0; this.tval = ""; this.AddCh();

        let loopState : bool = true;
        while(loopState) {
		switch (state) {
			case -1: { this.t.kind = Scanner.eofSym; loopState = false; break; } // NextCh already done
			case 0: {
				if (recKind != Scanner.noSym) {
					this.tlen = recEnd - this.t.pos;
					this.SetScannerBehindT();
				}
				this.t.kind = recKind; loopState = false; break;
			} // NextCh already done
-->scan3
		}
        }
        this.t.val = this.tval;
        return this.t;
    }

    private  SetScannerBehindT() : void {
        this.buffer.setPos(this.t.pos);
        this.NextCh();
        this.line = this.t.line; this.col = this.t.col; this.charPos = this.t.charPos;
        for ( let i : int = 0; i < this.tlen; i++) this.NextCh();
    }

    // get the next token (possibly a token already seen during peeking)
    public  Scan () : Token {
        if (this.tokens.next == null) {
            return this.NextToken();
        } else {
            this.pt = this.tokens = this.tokens.next;
            return this.tokens;
        }
    }

    // peek for the next token, ignore pragmas
    public  Peek () : Token {
        do {
            if (this.pt.next == null) {
                this.pt.next = this.NextToken();
            }
            this.pt = this.pt.next;
        } while (this.pt.kind > Scanner.maxT); // skip pragmas

        return this.pt;
    }

    // make sure that peeking starts at the current scan position
    public  ResetPeek () : void { this.pt = this.tokens; }

} // end Scanner

/*
let scanner : Scanner  = new Scanner(\`let a : string = "str";\`, "test.txt");
let tok : Token = scanner.Scan()
while(tok.kind != Scanner.eofSym)
{
	console.log(tok);
	tok = scanner.Scan();
}
*/
`;
/*//----End Scanner.frame */

/*//----Start Copyright.frame */
let CocoCopyrightFrame : string = `
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
`;
/*//----End Copyright.frame */

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

    class State {				// state of finite automaton
        public  nr : int;						// state number
        public  firstAction : Action | null;// to first action of this state
        public  endOf : Symbol | null;			// recognized token if state is final
        public  ctx : bool;					// true if state is reached via contextTrans
        public  next : State | null;

        public  AddAction( act : Action) : void {
            let lasta : Action, a : Action | null = this.firstAction;
            while (a != null && act.typ >= a.typ) {lasta = a; a = a.next;}
            // collecting classes at the beginning gives better performance
            act.next = a;
            if (a==this.firstAction) this.firstAction = act; else lasta!.next = act;
        }

        public  DetachAction( act : Action) : void {
            let lasta : Action, a : Action | null = this.firstAction;
            while (a != null && a != act) {lasta = a; a = a.next;}
            if (a != null)
                if (a == this.firstAction) this.firstAction = a.next; else lasta!.next = a.next;
        }

        public  MeltWith( s : State) : void { // copy actions of s to state
            for ( let action : Action | null = s.firstAction; action != null; action = action.next) {
                 let a : Action = new Action(action.typ, action.sym, action.tc);
                a.AddTargets(action);
                this.AddAction(a);
            }
        }

    }

    //-----------------------------------------------------------------------------
    //  Action
    //-----------------------------------------------------------------------------

    class Action {			// action of finite automaton
        public  typ : int;					// type of action symbol: clas, chr
        public  sym : int;					// action symbol
        public  tc : int;					// transition code: normalTrans, contextTrans
        public  target : Target;		// states reached from this action
        public  next : Action | null;

         constructor( typ : int,  sym : int,  tc : int) {
            this.typ = typ; this.sym = sym; this.tc = tc;
        }

        public  AddTarget( t : Target) : void { // add t to the action.targets
             let last : Target;
             let p : Target | null = this.target;
            while (p != null && t.state.nr >= p.state.nr) {
                if (t.state == p.state) return;
                last = p; p = p.next;
            }
            t.next = p;
            if (p == this.target) this.target = t; else last!.next = t;
        }

        public  AddTargets( a : Action) : void { // add copy of a.targets to action.targets
            for ( let p : Target | null = a.target; p != null; p = p.next) {
                 let t : Target = new Target(p.state);
                this.AddTarget(t);
            }
            if (a.tc == Node.contextTrans) this.tc = Node.contextTrans;
        }

        public  Symbols( tab : Tab) : CharSet {
             let s : CharSet;
            if (this.typ == Node.clas)
                s = tab.CharClassSet(this.sym).Clone();
            else {
                s = new CharSet(); s.Set(this.sym);
            }
            return s;
        }

        public  ShiftWith( s : CharSet,  tab : Tab) : void {
            if (s.Elements() == 1) {
                this.typ = Node.chr; this.sym = s.First();
            } else {
                 let c : CharClass | null = tab.FindCharClass(s);
                if (c == null) c = tab.NewCharClass("#", s); // class with dummy name
                this.typ = Node.clas; this.sym = c.n;
            }
        }

    }

    //-----------------------------------------------------------------------------
    //  Target
    //-----------------------------------------------------------------------------

    class Target {				// set of states that are reached by an action
        public  state : State;				// target state
        public  next : Target | null;

         constructor ( s : State) {
            this.state = s;
        }
    }

    //-----------------------------------------------------------------------------
    //  Melted
    //-----------------------------------------------------------------------------

    class Melted {					// info about melted states
        public  set : BitArray;				// set of old states
        public  state : State;					// new state
        public  next : Melted | null;

         constructor( set : BitArray,  state : State) {
            this.set = set; this.state = state;
        }
    }

    //-----------------------------------------------------------------------------
    //  Comment
    //-----------------------------------------------------------------------------

    class Comment {					// info about comment syntax
        public  start : string;
        public  stop : string;
        public  nested : bool;
        public  next : Comment | null;

         constructor( start : string,  stop : string,  nested : bool) {
            this.start = start; this.stop = stop; this.nested = nested;
        }

    }

    //-----------------------------------------------------------------------------
    //  CharSet
    //-----------------------------------------------------------------------------

    class CharSetRange {
        public  rfrom : int;
        public  rto : int;
        public  next : CharSetRange | null;
         constructor( rfrom : int,  rto : int) { this.rfrom = rfrom; this.rto = rto; }

        public /*override*/  ToString() : string {
            if (this.rfrom == this.rto)
                return this.rfrom.toString(16);
            if (this.rfrom <= 256 && this.rto <= 256)
                return `${this.rfrom.toString(16)}-${this.rto.toString(16)}`;
            return `${this.rfrom.toString(16)}-${this.rto.toString(16)}`;
        }
    }

    class CharSet {


        public  head : CharSetRange;

        public /*override*/  ToString() : string {
            if (this.head == null) return "[]";
             let sb : StringBuilder = new StringBuilder();
            sb.Append("[");
            for ( let cur : CharSetRange | null = this.head; cur != null; cur = cur.next) {
                if (cur != this.head) sb.Append("|");
                sb.Append(cur.toString());
            }
            sb.Append("]");
            return sb.ToString();
        }

        public Get( i : int) : bool  {
            for ( let p : CharSetRange | null = this.head; p != null; p = p.next)
                if (i < p.rfrom) return false;
                else if (i <= p.rto) return true; // p.rfrom <= i <= p.rto

            return false;
        }

        public  Set( i : int) : void {
             let cur : CharSetRange | null = this.head, prev : CharSetRange | null = null;
            while (cur != null && i >= cur.rfrom-1) {
                if (i <= cur.rto + 1) { // (cur.rfrom-1) <= i <= (cur.rto+1)
                    if (i == cur.rfrom - 1) cur.rfrom--;
                    else if (i == cur.rto + 1) {
                        cur.rto++;
                         let next : CharSetRange | null = cur.next;
                        if (next != null && cur.rto == next.rfrom - 1) { cur.rto = next.rto; cur.next = next.next; };
                    }
                    return;
                }
                prev = cur; cur = cur.next;
            }
            let n : CharSetRange = new CharSetRange(i, i);
            n.next = cur;
            if (prev == null) this.head = n; else prev.next = n;
        }

        public  Clone() : CharSet {
            let s : CharSet = new CharSet();
            let prev : CharSetRange | null = null;
            for ( let cur : CharSetRange | null = this.head; cur != null; cur = cur.next) {
                 let r : CharSetRange = new CharSetRange(cur.rfrom, cur.rto);
                if (prev == null) s.head = r; else prev.next = r;
                prev = r;
            }
            return s;
        }

        public  Equals( s : CharSet) : bool {
            let p : CharSetRange | null = this.head, q : CharSetRange | null = s.head;
            while (p != null && q != null) {
                if (p.rfrom != q.rfrom || p.rto != q.rto) return false;
                p = p.next; q = q.next;
            }
            return p == q;
        }

        public  Elements() : int {
             let n : int = 0;
            for ( let p : CharSetRange | null = this.head; p != null; p = p.next) n += p.rto - p.rfrom + 1;
            return n;
        }

        public  First() : int {
            if (this.head != null) return this.head.rfrom;
            return -1;
        }

        public  Or( s : CharSet) : void {
            for ( let p : CharSetRange | null = s.head; p != null; p = p.next)
                for ( let i : int = p.rfrom; i <= p.rto; i++) this.Set(i);
        }

        public  And( s : CharSet) : void {
             let x : CharSet = new CharSet();
            for ( let p : CharSetRange | null = this.head; p != null; p = p.next)
                for ( let i : int = p.rfrom; i <= p.rto; i++)
                    if (s.Get(i)) x.Set(i);
            this.head = x.head;
        }

        public  Subtract( s : CharSet) : void {
             let x : CharSet = new CharSet();
            for ( let p : CharSetRange | null = this.head; p != null; p = p.next)
                for ( let i : int = p.rfrom; i <= p.rto; i++)
                    if (!s.Get(i)) x.Set(i);
            this.head = x.head;
        }

        public  Includes( s : CharSet) : bool {
            for ( let p : CharSetRange | null = s.head; p != null; p = p.next)
                for ( let i : int = p.rfrom; i <= p.rto; i++)
                    if (!this.Get(i)) return false;
            return true;
        }

        public  Intersects( s : CharSet) : bool {
            for ( let p : CharSetRange | null = s.head; p != null; p = p.next)
                for ( let i : int = p.rfrom; i <= p.rto; i++)
                    if (this.Get(i)) return true;
            return false;
        }

        public  Fill() : void {
            this.head = new CharSetRange(Char_MinValue, Char_MaxValue);
        }
    }


    //-----------------------------------------------------------------------------
    //  Generator
    //-----------------------------------------------------------------------------
    class Generator {
        //private static readonly  EOF : int = -1;

        private  fram : Buffer;
        private  gen : StringWriter;
        private readonly  tab : Tab;
        private  frameFile : string;

        constructor( tab : Tab) {
            this.tab = tab;
        }

        public  OpenFrame( frame : string) : Buffer {
            this.fram = new Buffer(frame);
            return this.fram;
        }


        public  OpenGen( target : string) : StringWriter {
            this.gen = new StringWriter(); /* pdt */
            return this.gen;
        }


        public  GenCopyright() : void {
            try {
                let scannerFram : Buffer = this.fram;
                this.fram = new Buffer(CocoCopyrightFrame);
                this.CopyFramePart(null);
                this.fram = scannerFram;
            } catch {
                throw new FatalError("Cannot open Copyright.frame");
            }
        }

        public  SkipFramePart( stop : String) : void {
            this.CopyFramePart2(stop, false);
        }


        public  CopyFramePart( stop : String | null) : void {
            this.CopyFramePart2(stop, true);
        }

        // if stop == null, copies until end of file
        private  CopyFramePart2( stop : String | null,  generateOutput : bool) : void {
             let startCh : char =  0;
             let endOfStopString : int = 0;

            if (stop != null) {
                startCh = stop.charCodeAt(0);
                endOfStopString = stop.length - 1;
            }

            let ch : int = this.framRead();
            while (ch != Buffer.EOF) {
                if (stop != null && ch == startCh) {
                     let i : int = 0;
                    do {
                        if (i == endOfStopString) return; // stop[0..i] found
                        ch = this.framRead(); i++;
                    } while (ch == stop.charCodeAt(i));
                    // stop[0..i-1] found; continue with last read character
                    if (generateOutput) this.gen.Write(stop.substr(0, i));
                } else {
                    if (generateOutput) this.gen.Write(String.fromCharCode(ch));
                    ch = this.framRead();
                }
            }

            if (stop != null) throw new FatalError("Incomplete or corrupt frame file: " + this.frameFile);
        }

        private  framRead() : int {
            try {
                return this.fram.Read();
            } catch {
                throw new FatalError("Error reading frame file: " + this.frameFile);
            }
        }
    }

    //-----------------------------------------------------------------------------
    //  DFA
    //-----------------------------------------------------------------------------

    class TargetSymBool {
        targets : BitArray;
        endOf : Symbol | null;
        ctx : bool;
        constructor(targets: BitArray, endOf : Symbol | null, ctx : bool) {
            this.targets = targets; this.ctx = ctx; this.endOf = endOf;
        }
    }

    class DFA {
        private  maxStates : int;
        private  lastStateNr : int;   // highest state number
        private  firstState : State | null;
        private  lastState : State | null;   // last allocated state
        private  lastSimState : int;  // last non melted state
        private  fram : Buffer; //FileStream;   // scanner frame input
        private  gen : StringWriter; //StreamWriter;  // generated scanner file
        private  curSy : Symbol;      // current token to be recognized (in FindTrans)
        private  dirtyDFA : bool;     // DFA may become nondeterministic in MatchLiteral

        public  ignoreCase : bool;   // true if input should be treated case-insensitively
        public  hasCtxMoves : bool;  // DFA has context transitions

        // other Coco objects
        private      parser : Parser;
        private         tab : Tab;
        private      errors : Errors;
        private  trace : StringWriter;

        //---------- Output primitives
        private  ChStrNull( ch : int) : string | null {
            if (ch < 32 /*' '*/ || ch >= 127 || ch == 39 /*'\''*/ || ch == 92 /*'\\'*/) return null;
            else return `'${String.fromCharCode(ch)}'`;
        }

        private  ChChar( ch : int) : string {
            if (ch < 32 /*' '*/ || ch >= 127 || ch == 39 /*'\''*/ || ch == 92 /*'\\'*/) return ch.toString();
            else return `'${String.fromCharCode(ch)}'`;
        }

        private  Ch( ch : int) : string {
            if (ch < 32 /*' '*/ || ch >= 127 || ch == 39 /*'\''*/ || ch == 92 /*'\\'*/) return ch.toString();
            else return ch.toString();
        }

        private  ChCom( ch : int) : string {
            if (ch < 32 /*' '*/ || ch >= 127 || ch == 39 /*'\''*/ || ch == 92 /*'\\'*/) return ch.toString();
            else return ch.toString() + ` /*'${String.fromCharCode(ch)}'*/`;
        }

        private  ChCond( ch : char) : string {
            let str : string = this.ChStrNull(ch);
            return "this.ch == " + this.Ch(ch) + (str == null ? "" : " /*" + str + "*/");
        }

        private  ChCondAs( ch : char) : string {
            let str : string = this.ChStrNull(ch);
            return "(this.ch as int) == " + this.Ch(ch) + (str == null ? "" : " /*" + str + "*/");
        }

        private  ValChCond( ch : char) : string {
            return "this.valCh == " + this.Ch(ch);
        }

        private  PutRange( s : CharSet,  asValCh : bool=false) : void {
             let ch_str : string = asValCh ? "this.valCh" : "this.ch";
            for (let r : CharSetRange | null = s.head; r != null; r = r.next) {
                if (r.rfrom == r.rto) { this.gen.Write(ch_str + " == " + this.ChCom(r.rfrom)); }
                else if (r.rfrom == 0) { this.gen.Write(ch_str + " <= " + this.ChCom(r.rto)); }
                else { this.gen.Write(ch_str + " >= " + this.ChCom(r.rfrom) + " && " + ch_str + " <= " + this.ChCom(r.rto)); }
                if (r.next != null) this.gen.Write(" || ");
            }
        }

        //---------- State handling

        private  NewState() : State {
            let s : State = new State(); s.nr = ++this.lastStateNr;
            if (this.firstState == null) this.firstState = s; else this.lastState!.next = s;
            this.lastState = s;
            return s;
        }

        private  NewTransition( rfrom : State,  to : State,  typ : int,  sym : int,  tc : int) : void {
             let t : Target = new Target(to);
             let a : Action = new Action(typ, sym, tc); a.target = t;
            rfrom.AddAction(a);
            if (typ == Node.clas) this.curSy.tokenKind = Symbol.classToken;
        }

        private  CombineShifts() : void {
             let state : State | null;
             let a : Action | null, b : Action | null, c : Action;
             let seta : CharSet, setb : CharSet;
            for (state = this.firstState; state != null; state = state.next) {
                for (a = state.firstAction; a != null; a = a.next) {
                    b = a.next;
                    while (b != null)
                        if (a.target.state == b.target.state && a.tc == b.tc) {
                            seta = a.Symbols(this.tab); setb = b.Symbols(this.tab);
                            seta.Or(setb);
                            a.ShiftWith(seta, this.tab);
                            c = b; b = b.next; state.DetachAction(c);
                        } else b = b.next;
                }
            }
        }

        private  FindUsedStates( state : State,  used : BitArray) : void {
            if (used.Get(state.nr)) return;
            used.Set(state.nr, true);
            for ( let a : Action | null = state.firstAction; a != null; a = a.next)
                this.FindUsedStates(a.target.state, used);
        }

        private  DeleteRedundantStates() : void {
            let newState : Array<State> = new Array<State>(this.lastStateNr + 1);
             let used : BitArray = new BitArray(this.lastStateNr + 1);
            this.FindUsedStates(this.firstState!, used);
            // combine equal final states
            for ( let s1 : State | null = this.firstState!.next; s1 != null; s1 = s1.next) // firstState cannot be final
                if (used.Get(s1.nr) && s1.endOf != null && s1.firstAction == null && !s1.ctx)
                    for ( let s2 : State | null = s1.next; s2 != null; s2 = s2.next)
                        if (used.Get(s2.nr) && s1.endOf == s2.endOf && s2.firstAction == null && !s2.ctx) {
                            used.Set(s2.nr, false); newState[s2.nr] = s1;
                        }
            for ( let state : State | null = this.firstState; state != null; state = state.next)
                if (used.Get(state.nr))
                    for ( let a : Action | null = state.firstAction; a != null; a = a.next)
                        if (!used.Get(a.target.state.nr))
                            a.target.state = newState[a.target.state.nr];
            // delete unused states
            this.lastState = this.firstState; this.lastStateNr = 0; // firstState has number 0
            for ( let state : State | null = this.firstState!.next; state != null; state = state.next)
                if (used.Get(state.nr)) {state.nr = ++this.lastStateNr; this.lastState = state;}
                else this.lastState!.next = state.next;
        }

        private  TheState( p : Node | null) : State {
             let state : State;
            if (p == null) {state = this.NewState(); state.endOf = this.curSy; return state;}
            else return p.state;
        }

        private  Step( sfrom : State,  p : Node | null,  stepped : BitArray) : void {
            if (p == null) return;
            stepped.Set(p.n, true);
            switch (p.typ) {
                case Node.clas: case Node.chr: {
                    this.NewTransition(sfrom, this.TheState(p.next), p.typ, p.val, p.code);
                    break;
                }
                case Node.alt: {
                    this.Step(sfrom, p.sub, stepped); this.Step(sfrom, p.down, stepped);
                    break;
                }
                case Node.iter: {
                    if (Tab.DelSubGraph(p.sub)) {
                        this.parser.SemErr("contents of {...} must not be deletable");
                        return;
                    }
                    if (p.next != null && !stepped.Get(p.next.n)) this.Step(sfrom, p.next, stepped);
                    this.Step(sfrom, p.sub, stepped);
                    if (p.state != sfrom) {
                        this.Step(p.state, p, new BitArray(this.tab.nodes.length));
                    }
                    break;
                }
                case Node.opt: {
                    if (p.next != null && !stepped.Get(p.next.n)) this.Step(sfrom, p.next, stepped);
                    this.Step(sfrom, p.sub, stepped);
                    break;
                }
            }
        }

        // Assigns a state n.state to every node n. There will be a transition from
        // n.state to n.next.state triggered by n.val. All nodes in an alternative
        // chain are represented by the same state.
        // Numbering scheme:
        //  - any node after a chr, clas, opt, or alt, must get a new number
        //  - if a nested structure starts with an iteration the iter node must get a new number
        //  - if an iteration follows an iteration, it must get a new number
        private  NumberNodes( p : Node | null,  state : State | null,  renumIter : bool) : void {
            if (p == null) return;
            if (p.state != null) return; // already visited;
            if (state == null || (p.typ == Node.iter && renumIter)) state = this.NewState();
            p.state = state;
            if (Tab.DelGraph(p)) state.endOf = this.curSy;
            switch (p.typ) {
                case Node.clas: case Node.chr: {
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
        }

        private  FindTrans ( p : Node | null,  start : bool,  marked : BitArray) : void {
            if (p == null || marked.Get(p.n)) return;
            marked.Set(p.n, true);
            if (start) this.Step(p.state, p, new BitArray(this.tab.nodes.length)); // start of group of equally numbered nodes
            switch (p.typ) {
                case Node.clas: case Node.chr: {
                    this.FindTrans(p.next, true, marked);
                    break;
                }
                case Node.opt: {
                    this.FindTrans(p.next, true, marked); this.FindTrans(p.sub, false, marked);
                    break;
                }
                case Node.iter: {
                    this.FindTrans(p.next, false, marked); this.FindTrans(p.sub, false, marked);
                    break;
                }
                case Node.alt: {
                    this.FindTrans(p.sub, false, marked); this.FindTrans(p.down, false, marked);
                    break;
                }
            }
        }

        public  ConvertToStates( p : Node,  sym : Symbol) : void {
            this.curSy = sym;
            if (Tab.DelGraph(p)) {
                this.parser.SemErr("token might be empty");
                return;
            }
            this.NumberNodes(p, this.firstState, true);
            this.FindTrans(p, true, new BitArray(this.tab.nodes.length));
            if (p.typ == Node.iter) {
                this.Step(this.firstState!, p, new BitArray(this.tab.nodes.length));
            }
        }

        // match string against current automaton; store it either as a fixedToken or as a litToken
        public  MatchLiteral( s : string,  sym : Symbol) : void {
            s = this.tab.Unescape(s.substr(1, s.length-2));
             let i : int, len : int = s.length;
             let state : State = this.firstState!;
             let a : Action | null = null;
            for (i = 0; i < len; i++) { // try to match s against existing DFA
                a = this.FindAction(state, s.charCodeAt(i));
                if (a == null) break;
                state = a.target.state;
            }
            // if s was not totally consumed or leads to a non-final state => make new DFA from it
            if (i != len || state.endOf == null) {
                state = this.firstState!; i = 0; a = null;
                this.dirtyDFA = true;
            }
            for (; i < len; i++) { // make new DFA for s[i..len-1], ML: i is either 0 or len
                 let to : State = this.NewState();
                this.NewTransition(state, to, Node.chr, s.charCodeAt(i), Node.normalTrans);
                state = to;
            }
            let matchedSym : Symbol | null = state.endOf;
            if (matchedSym == null) {
                state.endOf = sym;
            } else if (matchedSym.tokenKind == Symbol.fixedToken || (a != null && a.tc == Node.contextTrans)) {
                // s matched a token with a fixed definition or a token with an appendix that will be cut off
                this.parser.SemErr("tokens " + sym.name + " and " + matchedSym.name + " cannot be distinguished");
            } else { // matchedSym == classToken || classLitToken
                matchedSym.tokenKind = Symbol.classLitToken;
                sym.tokenKind = Symbol.litToken;
            }
        }

        private  SplitActions( state : State,  a : Action,  b : Action) : void {
             let c : Action;  let seta : CharSet, setb : CharSet, setc : CharSet;
            seta = a.Symbols(this.tab); setb = b.Symbols(this.tab);
            if (seta.Equals(setb)) {
                a.AddTargets(b);
                state.DetachAction(b);
            } else if (seta.Includes(setb)) {
                setc = seta.Clone(); setc.Subtract(setb);
                b.AddTargets(a);
                a.ShiftWith(setc, this.tab);
            } else if (setb.Includes(seta)) {
                setc = setb.Clone(); setc.Subtract(seta);
                a.AddTargets(b);
                b.ShiftWith(setc, this.tab);
            } else {
                setc = seta.Clone(); setc.And(setb);
                seta.Subtract(setc);
                setb.Subtract(setc);
                a.ShiftWith(seta, this.tab);
                b.ShiftWith(setb, this.tab);
                c = new Action(0, 0, Node.normalTrans);  // typ and sym are set in ShiftWith
                c.AddTargets(a);
                c.AddTargets(b);
                c.ShiftWith(setc, this.tab);
                state.AddAction(c);
            }
        }

        private  Overlap( a : Action,  b : Action) : bool {
             let seta : CharSet, setb : CharSet;
            if (a.typ == Node.chr)
                if (b.typ == Node.chr) return a.sym == b.sym;
                else {setb = this.tab.CharClassSet(b.sym); return setb.Get(a.sym);}
            else {
                seta = this.tab.CharClassSet(a.sym);
                if (b.typ == Node.chr) return seta.Get(b.sym);
                else {setb = this.tab.CharClassSet(b.sym); return seta.Intersects(setb);}
            }
        }

        private  MakeUnique( state : State) : void {
             let changed : bool;
            do {
                changed = false;
                for ( let a : Action | null = state.firstAction; a != null; a = a.next)
                    for ( let b : Action | null = a.next; b != null; b = b.next)
                        if (this.Overlap(a, b)) { this.SplitActions(state, a, b); changed = true; }
            } while (changed);
        }

        private  MeltStates( state : State) : void {
            let tsb : TargetSymBool;
            for ( let action : Action | null = state.firstAction; action != null; action = action.next) {
                if (action.target.next != null) {
                    tsb = this.GetTargetStates(action);
                     let melt : Melted | null = this.StateWithSet(tsb.targets);
                    if (melt == null) {
                         let s : State = this.NewState(); s.endOf = tsb.endOf; s.ctx = tsb.ctx;
                        for ( let targ : Target | null = action.target; targ != null; targ = targ.next)
                            s.MeltWith(targ.state);
                        this.MakeUnique(s);
                        melt = this.NewMelted(tsb.targets, s);
                    }
                    action.target.next = null;
                    action.target.state = melt.state;
                }
            }
        }

        private  FindCtxStates() : void {
            for ( let state : State | null = this.firstState; state != null; state = state.next)
                for ( let a : Action | null = state.firstAction; a != null; a = a.next)
                    if (a.tc == Node.contextTrans) a.target.state.ctx = true;
        }

        public  MakeDeterministic() : void {
            let state : State | null;
            this.lastSimState = this.lastState!.nr;
            this.maxStates = 2 * this.lastSimState; // heuristic for set size in Melted.set
            this.FindCtxStates();
            for (state = this.firstState; state != null; state = state.next)
                this.MakeUnique(state);
            for (state = this.firstState; state != null; state = state.next)
                this.MeltStates(state);
            this.DeleteRedundantStates();
            this.CombineShifts();
        }

        public  PrintStates() : void {
            this.trace.WriteLine();
            this.trace.WriteLine("---------- states ----------");
            for ( let state : State | null = this.firstState; state != null; state = state.next) {
                 let first : bool = true;
                if (state.endOf == null) this.trace.Write("               ");
                else this.trace.Write(sprintf("E(%12s)", this.tab.Name(state.endOf.name)));
                this.trace.Write(sprintf("%3d:", state.nr));
                if (state.firstAction == null) this.trace.WriteLine();
                for ( let action : Action | null = state.firstAction; action != null; action = action.next) {
                    if (first) {this.trace.Write(" "); first = false;} else this.trace.Write("                    ");
                    if (action.typ == Node.clas) this.trace.Write((this.tab.classes[action.sym]).name);
                    else this.trace.Write(sprintf("%3s", this.ChChar(action.sym)));
                    for ( let targ : Target | null = action.target; targ != null; targ = targ.next)
                        this.trace.Write(sprintf(" %3d", targ.state.nr));
                    if (action.tc == Node.contextTrans) this.trace.WriteLine(" context"); else this.trace.WriteLine();
                }
            }
            this.trace.WriteLine();
            this.trace.WriteLine("---------- character classes ----------");
            this.tab.WriteCharClasses();
        }

    //---------------------------- actions --------------------------------

        public  FindAction( state : State,  ch : char) : Action | null {
            for ( let a : Action | null = state.firstAction; a != null; a = a.next)
                if (a.typ == Node.chr && ch == a.sym) return a;
                else if (a.typ == Node.clas) {
                     let s : CharSet = this.tab.CharClassSet(a.sym);
                    if (s.Get(ch)) return a;
                }
            return null;
        }

        public  GetTargetStates( a : Action) : TargetSymBool {
            let tsb : TargetSymBool;
            // compute the set of target states
            tsb = new TargetSymBool(new BitArray(this.maxStates), null, false);
            for ( let t : Target | null = a.target; t != null; t = t.next) {
                 let stateNr : int = t.state.nr;
                if (stateNr <= this.lastSimState) tsb.targets.Set(stateNr, true);
                else tsb.targets.Or(this.MeltedSet(stateNr));
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
        }

    //------------------------- melted states ------------------------------

         private firstMelted : Melted | null;	// head of melted state list

        private  NewMelted( set : BitArray,  state : State) : Melted {
             let m : Melted = new Melted(set, state);
            m.next = this.firstMelted; this.firstMelted = m;
            return m;
        }

        private  MeltedSet( nr : int) : BitArray {
             let m : Melted | null = this.firstMelted;
            while (m != null) {
                if (m.state.nr == nr) return m.set; else m = m.next;
            }
            throw new FatalError("compiler error in Melted.Set");
        }

        private  StateWithSet( s : BitArray) : Melted | null {
            for ( let m : Melted | null = this.firstMelted; m != null; m = m.next)
                if (Sets.Equals(s, m.set)) return m;
            return null;
        }

    //------------------------ comments --------------------------------

        public  firstComment : Comment | null;	// list of comments

        private  CommentStr( p : Node | null) : string {
             let s : StringBuilder = new StringBuilder();
            while (p != null) {
                if (p.typ == Node.chr) {
                    s.Append(String.fromCharCode(p.val));
                } else if (p.typ == Node.clas) {
                     let set : CharSet = this.tab.CharClassSet(p.val);
                    if (set.Elements() != 1) this.parser.SemErr("character set contains more than 1 character");
                    s.Append(String.fromCharCode(set.First()));
                } else this.parser.SemErr("comment delimiters may not be structured");
                p = p.next;
            }
            if (s.Length() == 0 || s.Length() > 8) {
                this.parser.SemErr("comment delimiters must be between 1 to 8 characters long");
                return "?";
            }
            return s.ToString();
        }

        public  NewComment( nfrom : Node,  to : Node,  nested : bool) : void {
            let c : Comment = new Comment(this.CommentStr(nfrom), this.CommentStr(to), nested);
            c.next = this.firstComment; this.firstComment = c;
        }


    //------------------------ scanner generation ----------------------

        private  GenCommentIndented( n : int,  s : string) : void {
            for( let i : int= 1; i < n; ++i) this.gen.Write("\t");
            this.gen.Write(s);
        }

        private  GenComBody( com : Comment) : void {
            let imax : int = com.start.length-1;
            this.gen.WriteLine(  "\t\t\tfor(;;) {");
            this.gen.Write    (  "\t\t\t\tif (" + this.ChCondAs(com.stop.charCodeAt(0)) + ") "); this.gen.WriteLine("{");
            if (com.stop.length == 1) {
                this.gen.WriteLine("\t\t\t\t\tlevel--;");
                this.gen.WriteLine("\t\t\t\t\tif (level == 0) { this.oldEols = this.line - line0; this.NextCh(); return true; }");
                this.gen.WriteLine("\t\t\t\t\tthis.NextCh();");
            } else {
                 let imaxStop : int = com.stop.length-1;
                for( let sidx : int = 1; sidx <= imaxStop; ++sidx) {
                    this.gen.WriteLine("\t\t\t\t\tthis.NextCh();");
                    this.gen.WriteLine("\t\t\t\t\tif (" + this.ChCondAs(com.stop.charCodeAt(sidx)) + ") {");
                }
                this.gen.WriteLine("\t\t\t\t\t\tlevel--;");
                this.gen.WriteLine("\t\t\t\t\t\tif (level == 0) { /*this.oldEols = this.line - line0;*/ this.NextCh(); return true; }");
                this.gen.WriteLine("\t\t\t\t\t\tthis.NextCh();");
                for( let sidx : int = imaxStop; sidx > 0; --sidx) {
                    this.gen.WriteLine("\t\t\t\t\t}");
                }
            }
            if (com.nested) {
                this.gen.Write    ("\t\t\t\t}"); this.gen.Write(" else if (" + this.ChCondAs(com.start.charCodeAt(0)) + ") "); this.gen.WriteLine("{");
                if (com.start.length == 1)
                    this.gen.WriteLine("\t\t\t\t\tlevel++; this.NextCh();");
                else {
                     let imaxN : int = com.start.length-1;
                    for( let sidx : int = 1; sidx <= imaxN; ++sidx) {
                        this.gen.WriteLine("\t\t\t\t\tthis.NextCh();");
                        this.gen.Write    ("\t\t\t\t\tif (" + this.ChCondAs(com.start.charCodeAt(sidx)) + ") "); this.gen.WriteLine("{");
                    }
                    this.gen.WriteLine("\t\t\t\t\t\tlevel++; this.NextCh();");
                    for( let sidx : int = imaxN; sidx > 0; --sidx) {
                        this.gen.WriteLine("\t\t\t\t\t}");
                    }
                }
            }
            this.gen.WriteLine(    "\t\t\t\t} else if (this.ch == Buffer.EOF) return false;");
            this.gen.WriteLine(    "\t\t\t\telse this.NextCh();");
            this.gen.WriteLine(    "\t\t\t}");
        }

        private  GenComment( com : Comment,  i : int) : void {
            this.gen.WriteLine();
            this.gen.Write    ("\tComment" + i + "() : bool "); this.gen.WriteLine("{");
            this.gen.WriteLine("\t\tlet level : int = 1, pos0 = this.pos, line0 = this.line, col0 = this.col, charPos0 = this.charPos;");
            this.gen.WriteLine("\t\tthis.NextCh();");
            if (com.start.length == 1) {
                this.GenComBody(com);
            } else {
                 let imax : int = com.start.length-1;
                for( let sidx : int = 1; sidx <= imax; ++sidx) {
                    this.gen.Write    ("\t\tif (" + this.ChCondAs(com.start.charCodeAt(sidx)) + ") "); this.gen.WriteLine("{");
                    this.gen.WriteLine("\t\t\tthis.NextCh();");
                }
                this.GenComBody(com);
                for( let sidx : int = imax; sidx > 0; --sidx) {
                    this.gen.WriteLine("\t\t}");
                }
                this.gen.WriteLine("\t\tthis.buffer.setPos(pos0); this.NextCh(); this.line = line0; this.col = col0; this.charPos = charPos0;");
                this.gen.WriteLine("\t\treturn false;");
            }
            this.gen.WriteLine("\t}");
        }

        private  SymName( sym : Symbol) : string {
            if (CharIsLetter(sym.name.charCodeAt(0))) { // real name value is stored in Tab.literals
                for ( let k in this.tab.literals)
                    if (this.tab.literals.hasOwnProperty(k) && this.tab.literals[k] == sym) return k;
            }
            return sym.name;
        }

        private  GenLiterals () : void {
            if (this.ignoreCase) {
                this.gen.WriteLine("\t\tswitch (this.t.val.toLowerCase()) {");
            } else {
                this.gen.WriteLine("\t\tswitch (this.t.val) {");
            }
            for ( let ts of [ this.tab.terminals, this.tab.pragmas ]) {
                for ( let sym of ts) {
                    if (sym.tokenKind == Symbol.litToken) {
                        let name : string = this.SymName(sym);
                        if (this.ignoreCase) name = name.toLowerCase();
                        // sym.name stores literals with quotes, e.g. "\"Literal\""
                        this.gen.WriteLine("\t\t\tcase " + name + ": this.t.kind = " + sym.n + "; break;");
                    }
                }
            }
            this.gen.WriteLine("\t\t\tdefault: break;");
            this.gen.Write("\t\t}");
        }

        private  hasEqAttribute( action : Action,  attr : int) : bool {
             let rc : bool = false;
             let tgt : Target = action.target;
            if(tgt != null) {
                 let st : State | null = tgt.state;
                while(st != null) {
                     let sy : Symbol | null = st.endOf;
                    if(sy != null) {
                        rc = sy.eqAttribute == attr;
                        break;
                    }
                    else st = st.next;
                }
            }
            return rc;
        }

        private  WriteState( state : State) : void {
             let endOf : Symbol | null = state.endOf;
            this.gen.WriteLine("\t\t\tcase " + state.nr + ":");
            if (endOf != null && state.firstAction != null) {
                this.gen.WriteLine("\t\t\t\trecEnd = this.pos; recKind = " + endOf.n + " /* " + endOf.name + " */;");
            }
             let ctxEnd : bool = state.ctx;
            for ( let action : Action | null = state.firstAction; action != null; action = action.next) {
                 let asValCh : bool = this.hasEqAttribute(action, 64 /*'@'*/);
                if (action == state.firstAction) this.gen.Write("\t\t\t\tif (");
                else this.gen.Write("\t\t\t\telse if (");
                if (action.typ == Node.chr) this.gen.Write(asValCh ? this.ValChCond(action.sym) : this.ChCond(action.sym));
                else this.PutRange(this.tab.CharClassSet(action.sym), asValCh);
                this.gen.Write(") {");
                if (action.tc == Node.contextTrans) {
                    this.gen.Write("apx++; "); ctxEnd = false;
                } else if (state.ctx)
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
            } else {
                this.gen.Write("this.t.kind = " + endOf.n + " /* " + endOf.name + " */; ");
                if(endOf.semPos != null && endOf.typ == Node.t) {
                    this.gen.Write(" {");
                    this.parser.pgen.CopySourcePartPPG(this.parser, this.gen, endOf.semPos, 0);
                    this.gen.Write("};");
                }
                if (endOf.tokenKind == Symbol.classLitToken) {
                    this.gen.WriteLine("this.t.val = this.tval; this.CheckLiteral(); return this.t;}");
                } else {
                    this.gen.WriteLine("loopState = false; break;}");
                }
            }
        }

        private  WriteStartTab() : void {
            for ( let action : Action | null = this.firstState!.firstAction; action != null; action = action.next) {
                 let targetState : int = action.target.state.nr;
                if (action.typ == Node.chr) {
                    this.gen.WriteLine("\t\tScanner.start[" + action.sym + "] = " + targetState + "; ");
                } else {
                     let s : CharSet = this.tab.CharClassSet(action.sym);
                    for (let r : CharSetRange | null = s.head; r != null; r = r.next) {
                        this.gen.WriteLine("\t\tfor (let i : int = " + r.rfrom + "; i <= " + r.rto + "; ++i) Scanner.start[i] = " + targetState + ";");
                    }
                }
            }
            this.gen.WriteLine("\t\t//Scanner.start[Buffer.EOF] = -1;");
        }

        public  WriteScanner() : void {
            let g : Generator = new Generator(this.tab);
            this.fram = g.OpenFrame(CocoScannerFrame);
            this.gen = g.OpenGen("Scanner.cs");
            if (this.dirtyDFA) this.MakeDeterministic();

            g.GenCopyright();
            g.SkipFramePart("-->begin");

            g.CopyFramePart("-->namespace");
            if (this.tab.nsName != null && this.tab.nsName.length > 0) {
                this.gen.Write("namespace ");
                this.gen.Write(this.tab.nsName);
                this.gen.Write(" {");
            }
            g.CopyFramePart("-->declarations");
            this.gen.WriteLine("\tstatic readonly maxT : int = " + (this.tab.terminals.length - 1) + ";");
            this.gen.WriteLine("\tstatic readonly noSym : int = " + this.tab.noSym.n + ";");
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
            if (this.ignoreCase) this.gen.Write("this.valCh;"); else this.gen.Write("(char) ch;");
            g.CopyFramePart("-->comments");
            let com : Comment | null = this.firstComment;
            let comIdx : int = 0;
            while (com != null) {
                this.GenComment(com, comIdx);
                com = com.next; comIdx++;
            }
            g.CopyFramePart("-->literals"); this.GenLiterals();
            g.CopyFramePart("-->scan1");
            this.gen.Write("\t\t\t\t");
            if (this.tab.ignored.Elements() > 0) { this.PutRange(this.tab.ignored); } else { this.gen.Write("false"); }
            g.CopyFramePart("-->scan2");
            if (this.firstComment != null) {
                this.gen.Write("\t\t\tif (");
                com = this.firstComment; comIdx = 0;
                while (com != null) {
                    this.gen.Write(this.ChCond(com.start.charCodeAt(0)));
                    this.gen.Write(" && this.Comment" + comIdx + "()");
                    if (com.next != null) this.gen.Write(" ||");
                    com = com.next; comIdx++;
                }
                this.gen.Write(") continue;");
            }
            g.CopyFramePart("-->scan22");
            if (this.hasCtxMoves) { this.gen.WriteLine(); this.gen.Write("\t\tlet apx : int = 0;"); } /* pdt */
            g.CopyFramePart("-->scan3");
            for ( let state : State | null = this.firstState!.next; state != null; state = state.next)
                this.WriteState(state);
            g.CopyFramePart(null);
            if (this.tab.nsName != null && this.tab.nsName.length > 0) this.gen.Write("}");
            if(this.parser.pgen.writeBufferTo) this.parser.pgen.writeBufferTo("WriteScanner", this.gen.ToString());
            else console.log(this.gen.ToString());this.gen.Close();
        }

         constructor ( parser : Parser) {
            this.parser = parser;
            this.tab = parser.tab;
            this.errors = parser.errors;
            this.trace = parser.trace;
            this.firstState = null; this.lastState = null; this.lastStateNr = -1;
            this.firstState = this.NewState();
            this.firstMelted = null; this.firstComment = null;
            this.ignoreCase = false;
            this.dirtyDFA = false;
            this.hasCtxMoves = false;
        }

    } // end DFA

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

class Parser {
	//non terminals
	public static readonly _NT_Coco : int = 0;
	public static readonly _NT_SetDecl : int = 1;
	public static readonly _NT_TokenDecl : int = 2;
	public static readonly _NT_TokenExpr : int = 3;
	public static readonly _NT_Set : int = 4;
	public static readonly _NT_SymboltableDecl : int = 5;
	public static readonly _NT_AttrDecl : int = 6;
	public static readonly _NT_SemText : int = 7;
	public static readonly _NT_Expression : int = 8;
	public static readonly _NT_SimSet : int = 9;
	public static readonly _NT_Char : int = 10;
	public static readonly _NT_Sym : int = 11;
	public static readonly _NT_TypeName : int = 12;
	public static readonly _NT_Term : int = 13;
	public static readonly _NT_Resolver : int = 14;
	public static readonly _NT_Factor : int = 15;
	public static readonly _NT_Attribs : int = 16;
	public static readonly _NT_Condition : int = 17;
	public static readonly _NT_TokenTerm : int = 18;
	public static readonly _NT_TokenFactor : int = 19;
	public static readonly _NT_Bracketed : int = 20;
	public static readonly maxNT : int = 20;
	//terminals
	public static readonly _EOF : int = 0;
	public static readonly _ident : int = 1;
	public static readonly _number : int = 2;
	public static readonly _string : int = 3;
	public static readonly _badString : int = 4;
	public static readonly _char : int = 5;
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
	public static readonly maxT : int = 49;
	public static readonly _ddtSym : int = 50;
	public static readonly _optionSym : int = 51;

    static readonly  minErrDist : int = 2;

    public  scanner : Scanner;
    public   errors : Errors;

    public  t : Token;    // last recognized token
    public  la : Token;   // lookahead token
    private errDist : int = Parser.minErrDist;

static readonly id : int = 0;
	static readonly str : int = 1;

	public  trace : StringWriter;    // other Coco objects referenced in this ATG
    public  tab : Tab;
    public  dfa : DFA;
    public  pgen : ParserGen;

    private genScanner : bool = false;
    private tokenString : string | null = null;         // used in declarations of literal tokens
    private noString : string = "-none-"; // used in declarations of literal tokens
    private gramName : string | null = null; // grammar name

/*-------------------------------------------------------------------------*/

	public symbols(name : string) : Symboltable | null {
		return null;
	}


    constructor( scanner : Scanner) {
        this.scanner = scanner;
        this.errors = new Errors(this.scanner.parseFileName);

	}

    private  SynErr ( n : int) : void {
        if (this.errDist >= Parser.minErrDist) this.errors.SynErr(this.la.line, this.la.col, n);
        this.errDist = 0;
    }

    public  SemErr ( msg : string) : void {
        if (this.errDist >= Parser.minErrDist) this.errors.SemErrLineColStr(this.t.line, this.t.col, msg);
        this.errDist = 0;
    }

    private  Get () : void {
        for (;;) {
            //console.log(this.t, this.la);
            this.t = this.la;
            this.la = this.scanner.Scan();
            if (this.la.kind <= Parser.maxT) { ++this.errDist; break; }
			if (this.la.kind == Parser._ddtSym) {
				this.tab.SetDDT(this.la.val); 
			}
			if (this.la.kind == Parser._optionSym) {
				this.tab.SetOption(this.la.val); 
			}

            this.la = this.t;
        }
    }

    private  isKind( t : Token,  n : int) : bool {
        let k : int = t.kind;
        while(k >= 0) {
            if (k == n) return true;
            k = Parser.tBase[k];
        }
        return false;
    }

    private  Expect ( n : int) : void {
        if (this.isKind(this.la, n)) this.Get(); else { this.SynErr(n); }
    }

    private  StartOf ( s : int) : bool {
        return Parser.set[s][this.la.kind];
    }

    private  ExpectWeak ( n : int,  follow : int) : void {
        if (this.isKind(this.la, n)) this.Get();
        else {
            this.SynErr(n);
            while (!this.StartOf(follow)) this.Get();
        }
    }


    private  WeakSeparator( n : int,  syFol : int,  repFol : int) : bool {
        let kind : int = this.la.kind;
        if (this.isKind(this.la, n)) {this.Get(); return true;}
        else if (this.StartOf(repFol)) {return false;}
        else {
            this.SynErr(n);
            while (!(Parser.set[syFol][kind] || Parser.set[repFol][kind] || Parser.set[0][kind])) {
                this.Get();
                kind = this.la.kind;
            }
            return this.StartOf(syFol);
        }
    }

	private SkipNested(leftKind: int, rightKind: int) : void {
		// manage nested braces
		if(this.la.kind != rightKind) {
			for (let nested : int = 1; nested > 0;) {
				//print("==", this.la.line, nested, this.la.kind, this.la.val);
				if(this.la.kind == leftKind) ++nested;
				this.Get();
				if(this.la.kind == rightKind) --nested;
				else if(this.la.kind == Parser._EOF) break;
			}
		}
	}

	private SkipTill(endKind : int) : void {
		while(this.la.kind != endKind || this.la.kind != Parser._EOF) {
			this.Get();
		}
	}

	private SkipTillEOL() : void {
		let currLine : int = this.la.line;
		while(this.la.line == currLine || this.la.kind != Parser._EOF) {
			this.Get();
		}
	}

	private Coco_NT() : void {
		let sym : Symbol | null;  let g : Graph, g1 : Graph, g2 : Graph;  let s : CharSet;  let beg : int, line : int; 
		if (this.StartOf(1 /* any   */)) {
			this.Get();
			beg =  this.t.pos; line = this.t.line; 
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
		beg = this.la.pos; line = this.la.line;
		
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
				if (sym != null) this.SemErr("name declared twice");
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
			let nested : bool = false; 
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
		while (!(this.isKind(this.la, Parser._EOF) || this.isKind(this.la, 18 /* "PRODUCTIONS" */))) {this.SynErr(50); this.Get();}
		this.Expect(18 /* "PRODUCTIONS" */);
		if (this.genScanner) this.dfa.MakeDeterministic();
		this.tab.DeleteNodes();
		
		while (this.isKind(this.la, Parser._ident)) {
			this.Get();
			sym = this.tab.FindSym(this.t.val);
			let undef : bool = sym == null;
			if (undef) sym = this.tab.NewSym(Node.nt, this.t.val, this.t.line, this.t.col);
			else {
			 if (sym.typ == Node.nt) {
			   if (sym.graph != null) this.SemErr("name declared twice");
			 } else this.SemErr("this symbol kind not allowed on left side of production");
			 sym.line = this.t.line;
			 sym.col = this.t.col;
			}
			let noAttrs : bool = sym.attrPos == null;
			sym.attrPos = null;
			let noRet : boolean = sym.retVar==null;
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
		if (this.tab.ddt[2]) this.tab.PrintNodes();
		if (this.errors.count == 0) {
		 console.log("checking");
		 this.tab.CompSymbolSets();
		 if (this.tab.ddt[7]) this.tab.XRef();
		 let doGenCode : bool = false;
		 if(this.tab.ignoreErrors) {
		   doGenCode = true;
		   this.tab.GrammarCheckAll();
		 }
		 else doGenCode = this.tab.GrammarOk();
		 if(this.tab.genRREBNF && doGenCode) {
		    this.pgen.WriteRREBNF();
		 }
		 if (doGenCode) {
		   console.log("parser");
		   this.pgen.WriteParser();
		   if (this.genScanner) {
		     console.log(" + scanner");
		     this.dfa.WriteScanner();
		     if (this.tab.ddt[0]) this.dfa.PrintStates();
		   }
		   console.log(" generated");
		   if (this.tab.ddt[8]) this.pgen.WriteStatistics();
		 }
		}
		if (this.tab.ddt[6]) this.tab.PrintSymbolTable();
		
		this.Expect(20 /* "." */);
	}

	private SetDecl_NT() : void {
		let s : CharSet; 
		this.Expect(Parser._ident);
		let name : string = this.t.val;
		let c : CharClass | null = this.tab.FindCharClassByName(name);
		if (c != null) this.SemErr("name declared twice");
		
		this.Expect(19 /* "=" */);
		s = this.Set_NT();
		if (s.Elements() == 0) this.SemErr("character set must not be empty");
		this.tab.NewCharClass(name, s);
		
		this.Expect(20 /* "." */);
	}

	private TokenDecl_NT(typ : int) : void {
		let s : SymInfo, sym : Symbol, g : Graph;
		             let inherits : SymInfo, inheritsSym : Symbol;
		
		s = this.Sym_NT();
		sym = this.tab.FindSym(s.name);
		if (sym != null) this.SemErr("name declared twice");
		else {
		sym = this.tab.NewSym(typ, s.name, this.t.line, this.t.col);
		sym.tokenKind = Symbol.fixedToken;
		}
		this.tokenString = null;
		
		if (this.isKind(this.la, 27 /* ":" */)) {
			this.Get();
			inherits = this.Sym_NT();
			inheritsSym = this.tab.FindSym(inherits.name);
			if (inheritsSym == null) this.SemErr("token '" + sym.name + "' can't inherit from '" + inherits.name + "', name not declared");
			else if (inheritsSym == sym) this.SemErr("token '" + sym.name + "' must not inherit from self");
			else if (inheritsSym.typ != typ) this.SemErr("token '" + sym.name + "' can't inherit from '" + inheritsSym.name + "'");
			else sym.inherits = inheritsSym;
			
		}
		while (!(this.StartOf(5 /* sync  */))) {this.SynErr(51); this.Get();}
		if (this.isKind(this.la, 19 /* "=" */) || this.isKind(this.la, 28 /* "@" */)) {
			if (this.isKind(this.la, 28 /* "@" */)) {
				this.Get();
				sym.eqAttribute = this.t.val.charCodeAt(0); 
			}
			this.Expect(19 /* "=" */);
			g = this.TokenExpr_NT();
			this.Expect(20 /* "." */);
			if (s.kind == Parser.str) this.SemErr("a literal must not be declared with a structure");
			this.tab.Finish(g);
			if (this.tokenString == null || this.tokenString == this.noString)
			this.dfa.ConvertToStates(g.l, sym);
			else { // TokenExpr is a single string
			 if (this.tab.FindLiteral(this.tokenString) != null)
			 this.SemErr("token string declared twice");
			 this.tab.literals[this.tokenString] = sym;
			 this.dfa.MatchLiteral(this.tokenString, sym);
			}
			
		} else if (this.StartOf(6 /* sem   */)) {
			if (s.kind == Parser.id) this.genScanner = false;
			else this.dfa.MatchLiteral(sym.name, sym);
			
		} else this.SynErr(52);
		if (this.isKind(this.la, 47 /* "(." */)) {
			sym.semPos = this.SemText_NT();
			if (typ == Node.t) this.errors.WarningStr("Warning semantic action on token declarations require a custom Scanner"); 
		}
	}

	private TokenExpr_NT() : Graph {
		let g : Graph;
		let g2 : Graph; 
		g = this.TokenTerm_NT();
		let first : bool = true; 
		while (this.WeakSeparator(38 /* "|" */,7,8) ) {
			g2 = this.TokenTerm_NT();
			if (first) { this.tab.MakeFirstAlt(g); first = false; }
			this.tab.MakeAlternative(g, g2);
			
		}
		return g;
	}

	private Set_NT() : CharSet {
		let s : CharSet;
		let s2 : CharSet; 
		s = this.SimSet_NT();
		while (this.isKind(this.la, 23 /* "+" */) || this.isKind(this.la, 24 /* "-" */)) {
			if (this.isKind(this.la, 23 /* "+" */)) {
				this.Get();
				s2 = this.SimSet_NT();
				s.Or(s2); 
			} else {
				this.Get();
				s2 = this.SimSet_NT();
				s.Subtract(s2); 
			}
		}
		return s;
	}

	private SymboltableDecl_NT() : void {
		let st : SymTab; 
		this.Expect(Parser._ident);
		let name : string = this.t.val.toLowerCase();
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
			let predef : string = this.tab.Unstring(this.t.val);
			if (this.dfa.ignoreCase) predef = predef.toLowerCase();
			st.Add(predef);
			
		}
		this.Expect(20 /* "." */);
	}

	private AttrDecl_NT(sym : Symbol) : void {
		let beg : int, col : int, line : int; 
		if (this.isKind(this.la, 29 /* "<" */)) {
			this.Get();
			if (this.isKind(this.la, 30 /* "^" */) || this.isKind(this.la, 31 /* "out" */)) {
				if (this.isKind(this.la, 30 /* "^" */)) {
					this.Get();
				} else {
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
				} else if (this.isKind(this.la, 33 /* "," */)) {
					this.Get();
					beg = this.la.pos; col = this.la.col; line = this.la.line; 
					while (this.StartOf(9 /* any   */)) {
						this.Get();
					}
					this.Expect(32 /* ">" */);
					if (this.t.pos > beg)
					 sym.attrPos = new Position(beg, this.t.pos, col, line); 
				} else this.SynErr(53);
			} else if (this.StartOf(10 /* sem   */)) {
				beg = this.la.pos; col = this.la.col; line = this.la.line; 
				if (this.StartOf(11 /* any   */)) {
					this.Get();
					while (this.StartOf(9 /* any   */)) {
						this.Get();
					}
				}
				this.Expect(32 /* ">" */);
				if (this.t.pos > beg)
				 sym.attrPos = new Position(beg, this.t.pos, col, line); 
			} else this.SynErr(54);
		} else if (this.isKind(this.la, 34 /* "<." */)) {
			this.Get();
			if (this.isKind(this.la, 30 /* "^" */) || this.isKind(this.la, 31 /* "out" */)) {
				if (this.isKind(this.la, 30 /* "^" */)) {
					this.Get();
				} else {
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
				} else if (this.isKind(this.la, 33 /* "," */)) {
					this.Get();
					beg = this.la.pos; col = this.la.col; line = this.la.line; 
					while (this.StartOf(12 /* any   */)) {
						this.Get();
					}
					this.Expect(35 /* ".>" */);
					if (this.t.pos > beg)
					 sym.attrPos = new Position(beg, this.t.pos, col, line); 
				} else this.SynErr(55);
			} else if (this.StartOf(10 /* sem   */)) {
				beg = this.la.pos; col = this.la.col; line = this.la.line; 
				if (this.StartOf(13 /* any   */)) {
					this.Get();
					while (this.StartOf(12 /* any   */)) {
						this.Get();
					}
				}
				this.Expect(35 /* ".>" */);
				if (this.t.pos > beg)
				 sym.attrPos = new Position(beg, this.t.pos, col, line); 
			} else this.SynErr(56);
		} else this.SynErr(57);
	}

	private SemText_NT() : Position {
		let pos : Position;
		this.Expect(47 /* "(." */);
		let beg : int = this.la.pos, col : int = this.la.col, line : int = this.la.line; 
		while (this.StartOf(14 /* alt   */)) {
			if (this.StartOf(15 /* any   */)) {
				this.Get();
			} else if (this.isKind(this.la, Parser._badString)) {
				this.Get();
				this.SemErr("bad string in semantic action"); 
			} else {
				this.Get();
				this.SemErr("missing end of previous semantic action"); 
			}
		}
		this.Expect(48 /* ".)" */);
		pos = new Position(beg, this.t.pos, col, line); 
		return pos;
	}

	private Expression_NT() : Graph {
		let g : Graph;
		let g2 : Graph; 
		g = this.Term_NT();
		let first : bool = true; 
		while (this.WeakSeparator(38 /* "|" */,16,17) ) {
			g2 = this.Term_NT();
			if (first) { this.tab.MakeFirstAlt(g); first = false; }
			this.tab.MakeAlternative(g, g2);
			
		}
		return g;
	}

	private SimSet_NT() : CharSet {
		let s : CharSet;
		let n1 : int, n2 : int; 
		s = new CharSet(); 
		if (this.isKind(this.la, Parser._ident)) {
			this.Get();
			let c : CharClass | null = this.tab.FindCharClassByName(this.t.val);
			if (c == null) this.SemErr("undefined name"); else s.Or(c.set);
			
		} else if (this.isKind(this.la, Parser._string)) {
			this.Get();
			let name : string = this.tab.Unstring(this.t.val);
			for (let ch of name)
			 if (this.dfa.ignoreCase) s.Set(ch.toLowerCase().charCodeAt(0));
			 else s.Set(ch.charCodeAt(0)); 
		} else if (this.isKind(this.la, Parser._char)) {
			n1 = this.Char_NT();
			s.Set(n1); 
			if (this.isKind(this.la, 25 /* ".." */)) {
				this.Get();
				n2 = this.Char_NT();
				for (let i : int = n1; i <= n2; i++) s.Set(i); 
			}
		} else if (this.isKind(this.la, 26 /* "ANY" */)) {
			this.Get();
			s = new CharSet(); s.Fill(); 
		} else this.SynErr(58);
		return s;
	}

	private Char_NT() : int {
		let n : int;
		this.Expect(Parser._char);
		let name : string = this.tab.Unstring(this.t.val); n = 0;
		if (name.length == 1) n = name.charCodeAt(0);
		else this.SemErr("unacceptable character value");
		if (this.dfa.ignoreCase && n >= 65 /*'A'*/ && n <= 90 /*'Z'*/) n += 32;
		
		return n;
	}

	private Sym_NT() : SymInfo {
		let s : SymInfo;
		s = new SymInfo(); s.name = "???"; s.kind = Parser.id; 
		if (this.isKind(this.la, Parser._ident)) {
			this.Get();
			s.kind = Parser.id; s.name = this.t.val; 
		} else if (this.isKind(this.la, Parser._string) || this.isKind(this.la, Parser._char)) {
			if (this.isKind(this.la, Parser._string)) {
				this.Get();
				s.name = this.t.val; 
			} else {
				this.Get();
				s.name = "\"" + this.t.val.substr(1, this.t.val.length-2) + "\""; 
			}
			s.kind = Parser.str;
			if (this.dfa.ignoreCase) s.name = s.name.toLowerCase();
			if (s.name.indexOf(' ') >= 0)
			this.SemErr("literal tokens must not contain blanks"); 
		} else this.SynErr(59);
		return s;
	}

	private TypeName_NT() : void {
		this.Expect(Parser._ident);
		while (this.isKind(this.la, 20 /* "." */) || this.isKind(this.la, 29 /* "<" */) || this.isKind(this.la, 36 /* "[" */)) {
			if (this.isKind(this.la, 20 /* "." */)) {
				this.Get();
				this.Expect(Parser._ident);
			} else if (this.isKind(this.la, 36 /* "[" */)) {
				this.Get();
				this.Expect(37 /* "]" */);
			} else {
				this.Get();
				this.TypeName_NT();
				while (this.isKind(this.la, 33 /* "," */)) {
					this.Get();
					this.TypeName_NT();
				}
				this.Expect(32 /* ">" */);
			}
		}
	}

	private Term_NT() : Graph {
		let g : Graph;
		let g2 : Graph, rslv : Node | null = null; g = null; 
		if (this.StartOf(18 /* opt   */)) {
			if (this.isKind(this.la, 45 /* "IF" */)) {
				rslv = this.tab.NewNodeSym(Node.rslv, null, this.la.line, this.la.col); 
				rslv.pos = this.Resolver_NT();
				g = new Graph(rslv); 
			}
			g2 = this.Factor_NT();
			if (rslv != null) this.tab.MakeSequence(g, g2);
			else g = g2;
			
			while (this.StartOf(19 /* nt   Factor */)) {
				g2 = this.Factor_NT();
				this.tab.MakeSequence(g, g2); 
			}
		} else if (this.StartOf(20 /* sem   */)) {
			g = new Graph(this.tab.NewNodeSym(Node.eps, null, this.t.line, this.t.col)); 
		} else this.SynErr(60);
		if (g == null) // invalid start of Term
		 g = new Graph(this.tab.NewNodeSym(Node.eps, null, this.t.line, this.t.col));
		
		return g;
	}

	private Resolver_NT() : Position {
		let pos : Position;
		this.Expect(45 /* "IF" */);
		this.Expect(40 /* "(" */);
		let beg : int = this.la.pos, col : int = this.la.col, line : int = this.la.line; 
		this.Condition_NT();
		pos = new Position(beg, this.t.pos, col, line); 
		return pos;
	}

	private Factor_NT() : Graph {
		let g : Graph;
		let s : SymInfo, pos : Position, weak : bool = false;
		g = null;
		
		switch (this.la.kind) {
		case Parser._ident: case Parser._string: case Parser._char: case 39 /* "WEAK" */: {
			if (this.isKind(this.la, 39 /* "WEAK" */)) {
				this.Get();
				weak = true; 
			}
			s = this.Sym_NT();
			let sym : Symbol | null = this.tab.FindSym(s.name);
			if (sym == null && s.kind == Parser.str)
			 sym = this.tab.FindLiteral(s.name);
			let undef : bool = sym == null;
			if (undef) {
			 if (s.kind == Parser.id)
			   sym = this.tab.NewSym(Node.nt, s.name, this.t.line, this.t.col);  // forward nt
			 else if (this.genScanner) {
			   sym = this.tab.NewSym(Node.t, s.name, this.t.line, this.t.col);
			   this.dfa.MatchLiteral(sym.name, sym);
			 } else {  // undefined string in production
			    this.SemErr("undefined string in production");
			   sym = this.tab.eofSy;  // dummy
			 }
			}
			let typ : int = sym.typ;
			if (typ != Node.t && typ != Node.nt)
			this.SemErr("this symbol kind is not allowed in a production");
			if (weak)
			 if (typ == Node.t) typ = Node.wt;
			 else this.SemErr("only terminals may be weak");
			let p : Node = this.tab.NewNodeSym(typ, sym, this.t.line, this.t.col);
			g = new Graph(p);
			
			if (this.StartOf(21 /* alt   */)) {
				if (this.isKind(this.la, 29 /* "<" */) || this.isKind(this.la, 34 /* "<." */)) {
					this.Attribs_NT(p);
					if (s.kind != Parser.id) this.SemErr("a literal must not have attributes"); 
				} else if (this.isKind(this.la, 32 /* ">" */)) {
					this.Get();
					this.Expect(Parser._ident);
					if (typ != Node.t && typ != Node.wt) this.SemErr("only terminals or weak terminals can declare a name in a symbol table");
					p.declares = this.t.val; //.toLowerCase();
					if (null == this.tab.FindSymtab(p.declares)) this.SemErr("undeclared symbol table '" + p.declares + "'");
					
				} else {
					this.Get();
					this.Expect(Parser._ident);
					if (typ != Node.t && typ != Node.wt) this.SemErr("only terminals or weak terminals can lookup a name in a symbol table");
					p.declared = this.t.val; //.toLowerCase();
					if (null == this.tab.FindSymtab(p.declared)) this.SemErr("undeclared symbol table '" + p.declared + "'");
					
				}
			}
			if (undef) {
			 sym.attrPos = p.pos;  // dummy
			 sym.retVar = p.retVar;  // AH - dummy
			} else if ((p.pos == null) != (sym.attrPos == null)
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
			let p : Node = this.tab.NewNodeSym(Node.sem, null, this.t.line, this.t.col);
			p.pos = pos;
			g = new Graph(p);
			
			break;
		}
		case 26 /* "ANY" */: {
			this.Get();
			let p : Node = this.tab.NewNodeSym(Node.any, null, this.t.line, this.t.col);  // p.set is set in tab.SetupAnys
			g = new Graph(p);
			
			break;
		}
		case 44 /* "SYNC" */: {
			this.Get();
			let p : Node = this.tab.NewNodeSym(Node.sync, null, this.t.line, this.t.col);
			g = new Graph(p);
			
			break;
		}
		default: this.SynErr(61); break;
		}
		if (g == null) // invalid start of Factor
		 g = new Graph(this.tab.NewNodeSym(Node.eps, null, this.t.line, this.t.col));
		
		return g;
	}

	private Attribs_NT(n : Node) : void {
		let beg : int, col : int, line : int; 
		if (this.isKind(this.la, 29 /* "<" */)) {
			this.Get();
			if (this.isKind(this.la, 30 /* "^" */) || this.isKind(this.la, 31 /* "out" */)) {
				if (this.isKind(this.la, 30 /* "^" */)) {
					this.Get();
				} else {
					this.Get();
				}
				beg = this.la.pos; 
				while (this.StartOf(22 /* alt   */)) {
					if (this.StartOf(23 /* any   */)) {
						this.Get();
					} else if (this.isKind(this.la, 36 /* "[" */) || this.isKind(this.la, 40 /* "(" */)) {
						this.Bracketed_NT();
					} else {
						this.Get();
						this.SemErr("bad string in attributes"); 
					}
				}
				n.retVar = this.scanner.buffer.GetString(beg, this.la.pos); 
				if (this.isKind(this.la, 32 /* ">" */)) {
					this.Get();
				} else if (this.isKind(this.la, 33 /* "," */)) {
					this.Get();
					beg = this.la.pos; col = this.la.col; line = this.la.line; 
					while (this.StartOf(9 /* alt   */)) {
						if (this.StartOf(24 /* any   */)) {
							this.Get();
						} else {
							this.Get();
							this.SemErr("bad string in attributes"); 
						}
					}
					this.Expect(32 /* ">" */);
					if (this.t.pos > beg) n.pos = new Position(beg, this.t.pos, col, line); 
				} else this.SynErr(62);
			} else if (this.StartOf(10 /* sem   */)) {
				beg = this.la.pos; col = this.la.col; line = this.la.line; 
				if (this.StartOf(11 /* alt   */)) {
					if (this.StartOf(25 /* any   */)) {
						this.Get();
					} else {
						this.Get();
						this.SemErr("bad string in attributes"); 
					}
					while (this.StartOf(9 /* alt   */)) {
						if (this.StartOf(24 /* any   */)) {
							this.Get();
						} else {
							this.Get();
							this.SemErr("bad string in attributes"); 
						}
					}
				}
				this.Expect(32 /* ">" */);
				if (this.t.pos > beg) n.pos = new Position(beg, this.t.pos, col, line); 
			} else this.SynErr(63);
		} else if (this.isKind(this.la, 34 /* "<." */)) {
			this.Get();
			if (this.isKind(this.la, 30 /* "^" */) || this.isKind(this.la, 31 /* "out" */)) {
				if (this.isKind(this.la, 30 /* "^" */)) {
					this.Get();
				} else {
					this.Get();
				}
				beg = this.la.pos; 
				while (this.StartOf(26 /* alt   */)) {
					if (this.StartOf(27 /* any   */)) {
						this.Get();
					} else if (this.isKind(this.la, 36 /* "[" */) || this.isKind(this.la, 40 /* "(" */)) {
						this.Bracketed_NT();
					} else {
						this.Get();
						this.SemErr("bad string in attributes"); 
					}
				}
				n.retVar = this.scanner.buffer.GetString(beg, this.la.pos); 
				if (this.isKind(this.la, 35 /* ".>" */)) {
					this.Get();
				} else if (this.isKind(this.la, 33 /* "," */)) {
					this.Get();
					beg = this.la.pos; col = this.la.col; line = this.la.line; 
					while (this.StartOf(12 /* alt   */)) {
						if (this.StartOf(28 /* any   */)) {
							this.Get();
						} else {
							this.Get();
							this.SemErr("bad string in attributes"); 
						}
					}
					this.Expect(35 /* ".>" */);
					if (this.t.pos > beg) n.pos = new Position(beg, this.t.pos, col, line); 
				} else this.SynErr(64);
			} else if (this.StartOf(10 /* sem   */)) {
				beg = this.la.pos; col = this.la.col; line = this.la.line; 
				if (this.StartOf(13 /* alt   */)) {
					if (this.StartOf(29 /* any   */)) {
						this.Get();
					} else {
						this.Get();
						this.SemErr("bad string in attributes"); 
					}
					while (this.StartOf(12 /* alt   */)) {
						if (this.StartOf(28 /* any   */)) {
							this.Get();
						} else {
							this.Get();
							this.SemErr("bad string in attributes"); 
						}
					}
				}
				this.Expect(35 /* ".>" */);
				if (this.t.pos > beg) n.pos = new Position(beg, this.t.pos, col, line); 
			} else this.SynErr(65);
		} else this.SynErr(66);
	}

	private Condition_NT() : void {
		while (this.StartOf(30 /* alt   */)) {
			if (this.isKind(this.la, 40 /* "(" */)) {
				this.Get();
				this.Condition_NT();
			} else {
				this.Get();
			}
		}
		this.Expect(41 /* ")" */);
	}

	private TokenTerm_NT() : Graph {
		let g : Graph;
		let g2 : Graph; 
		g = this.TokenFactor_NT();
		while (this.StartOf(7 /* nt   TokenFactor */)) {
			g2 = this.TokenFactor_NT();
			this.tab.MakeSequence(g, g2); 
		}
		if (this.isKind(this.la, 46 /* "CONTEXT" */)) {
			this.Get();
			this.Expect(40 /* "(" */);
			g2 = this.TokenExpr_NT();
			this.tab.SetContextTrans(g2.l); this.dfa.hasCtxMoves = true;
			this.tab.MakeSequence(g, g2); 
			this.Expect(41 /* ")" */);
		}
		return g;
	}

	private TokenFactor_NT() : Graph {
		let g : Graph;
		let s : SymInfo; 
		g = null; 
		if (this.isKind(this.la, Parser._ident) || this.isKind(this.la, Parser._string) || this.isKind(this.la, Parser._char)) {
			s = this.Sym_NT();
			if (s.kind == Parser.id) {
			 let c : CharClass | null = this.tab.FindCharClassByName(this.t.val);
			 if (c == null) {
			    this.SemErr("undefined name: " + s.name);
			   c = this.tab.NewCharClass(s.name, new CharSet());
			 }
			 let p : Node = this.tab.NewNodeSym(Node.clas, null, this.t.line, this.t.col); p.val = c.n;
			 g = new Graph(p);
			 this.tokenString = this.noString;
			} else { // str
			 g = this.tab.StrToGraph(s.name);
			 if (this.tokenString == null) this.tokenString = s.name;
			 else this.tokenString = this.noString;
			}
			
		} else if (this.isKind(this.la, 40 /* "(" */)) {
			this.Get();
			g = this.TokenExpr_NT();
			this.Expect(41 /* ")" */);
		} else if (this.isKind(this.la, 36 /* "[" */)) {
			this.Get();
			g = this.TokenExpr_NT();
			this.Expect(37 /* "]" */);
			this.tab.MakeOption(g); this.tokenString = this.noString; 
		} else if (this.isKind(this.la, 42 /* "{" */)) {
			this.Get();
			g = this.TokenExpr_NT();
			this.Expect(43 /* "}" */);
			this.tab.MakeIteration(g); this.tokenString = this.noString; 
		} else this.SynErr(67);
		if (g == null) // invalid start of TokenFactor
		 g = new Graph(this.tab.NewNodeSym(Node.eps, null, this.t.line, this.t.col)); 
		return g;
	}

	private Bracketed_NT() : void {
		if (this.isKind(this.la, 40 /* "(" */)) {
			this.Get();
			while (this.StartOf(30 /* alt   */)) {
				if (this.isKind(this.la, 36 /* "[" */) || this.isKind(this.la, 40 /* "(" */)) {
					this.Bracketed_NT();
				} else {
					this.Get();
				}
			}
			this.Expect(41 /* ")" */);
		} else if (this.isKind(this.la, 36 /* "[" */)) {
			this.Get();
			while (this.StartOf(31 /* alt   */)) {
				if (this.isKind(this.la, 36 /* "[" */) || this.isKind(this.la, 40 /* "(" */)) {
					this.Bracketed_NT();
				} else {
					this.Get();
				}
			}
			this.Expect(37 /* "]" */);
		} else this.SynErr(68);
	}



	public Parse() : void {
		this.la = new Token();
		this.la.val = "";
		this.Get();
		this.Coco_NT();
		this.Expect(0);

	}

	// a token's base type
	public static readonly tBase : int[] = [

		-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
		-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
		-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    ];

	static readonly set : bool[][] = [
		[true,true,false,true, false,true,false,false, false,false,false,true, true,false,false,false, true,true,true,true, false,false,false,false, false,false,false,false, true,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,true, false,false,false],
		[false,true,true,true, true,true,false,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, true,true,true,false, false,false,false,false, false,true,true,true, false,false,false,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false],
		[true,true,false,true, false,true,false,false, false,false,false,true, true,false,false,false, true,true,true,true, true,false,false,false, false,false,true,false, true,false,false,false, false,false,false,false, true,false,true,true, true,false,true,false, true,true,false,true, false,false,false],
		[true,true,false,true, false,true,false,false, false,false,false,true, true,false,false,false, true,true,true,true, false,true,false,false, false,false,false,false, true,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,true, false,false,false],
		[true,true,false,true, false,true,false,false, false,false,false,true, true,false,false,false, true,true,true,true, false,false,false,false, false,false,false,false, true,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,true, false,false,false],
		[false,true,false,true, false,true,false,false, false,false,false,true, true,false,false,false, true,true,true,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,true, false,false,false],
		[false,true,false,true, false,true,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, true,false,false,false, true,false,true,false, false,false,false,false, false,false,false],
		[false,false,false,false, false,false,false,false, false,false,false,false, true,false,true,true, true,true,true,false, true,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,true,false,false, false,true,false,true, false,false,false,false, false,false,false],
		[false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false,false, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false,false, false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,false, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false,false, true,true,true,false, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, false,true,false],
		[false,true,true,true, false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,false, false,true,false],
		[false,true,false,true, false,true,false,false, false,false,false,false, false,false,false,false, false,false,false,false, true,false,false,false, false,false,true,false, false,false,false,false, false,false,false,false, true,true,true,true, true,true,true,true, true,true,false,true, false,false,false],
		[false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, true,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,true,false,false, false,true,false,true, false,false,false,false, false,false,false],
		[false,true,false,true, false,true,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,true,false, false,false,false,false, false,false,false,false, true,false,false,true, true,false,true,false, true,true,false,true, false,false,false],
		[false,true,false,true, false,true,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,true,false, false,false,false,false, false,false,false,false, true,false,false,true, true,false,true,false, true,false,false,true, false,false,false],
		[false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, true,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,true,true,false, false,true,false,true, false,false,false,false, false,false,false],
		[false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,true, false,true,false,false, true,false,true,false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false],
		[false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, false,false,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, false,false,true,true, false,true,true,true, false,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false,false, false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,false,true,false, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,false,true,false, false,true,true,true, false,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,false, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false,false, true,true,true,false, true,true,true,true, true,true,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,false,true,true, true,true,true,true, true,true,false],
		[false,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true, true,false,true,true, true,true,true,true, true,true,true,true, true,true,false]

    ];
/*
	public void CheckDeclared(errors : Errors) {
		let list : Array<Token>  = undeclaredTokens.Peek();
		for(Token t of list) {
			let msg : string  = string.Format(Parser.MissingSymbol, Parser.tName[this.t.kind], this.t.val, this.name);
			errors.SemErr(this.t.line, this.t.col, msg);
		}
	}
*/

/*#if PARSER_WITH_AST
	public ast_root : SynTree;
	private ast_stack : Stack ;

	public AstAddTerminal() : void {
        let st : SynTree = new SynTree( this.t );
        ((SynTree)(this.ast_stack.Peek())).children.Add(st);
	}

	public AstAddNonTerminal(kind : int, nt_name : string, line : int) : bool {
        let ntTok : Token  = new Token();
        ntTok.kind = kind;
        ntTok.line = line;
        ntTok.val = nt_name;
        let st : SynTree = new SynTree( ntTok );
        ((SynTree)(this.ast_stack.Peek())).children.Add(st);
        this.ast_stack.Push(st);
        return true;
	}

	public AstPopNonTerminal() : void {
        this.ast_stack.Pop();
	}
//#endif*/

} // end Parser


class Errors {
    public  count : int = 0;                                    // number of errors detected
    //public  errorStream : StreamWriter; //.IO.TextWriter = Console.Out;   // error messages go to this stream
    //public  errMsgFormat : string = "-- line {0} col {1}: {2}"; // 0=line, 1=column, 2=text
    public  errMsgFormat : string = "%s:%d:%d %s %s"; // 0=line, 1=column, 2=text
    public  fileName : string = "grammar"; // 0=line, 1=column, 2=text

    constructor(fileName : string) {
        this.fileName = fileName;
    }

	public /*virtual*/  SynErr ( line : int,  col : int,  n : int) : void {
		let s : string;
		switch (n) {
			case 0: s = "EOF expected"; break;
			case 1: s = "ident expected"; break;
			case 2: s = "number expected"; break;
			case 3: s = "string expected"; break;
			case 4: s = "badString expected"; break;
			case 5: s = "char expected"; break;
			case 6: s = "\"COMPILER\" expected"; break;
			case 7: s = "\"IGNORECASE\" expected"; break;
			case 8: s = "\"TERMINALS\" expected"; break;
			case 9: s = "\"CHARACTERS\" expected"; break;
			case 10: s = "\"TOKENS\" expected"; break;
			case 11: s = "\"PRAGMAS\" expected"; break;
			case 12: s = "\"COMMENTS\" expected"; break;
			case 13: s = "\"FROM\" expected"; break;
			case 14: s = "\"TO\" expected"; break;
			case 15: s = "\"NESTED\" expected"; break;
			case 16: s = "\"IGNORE\" expected"; break;
			case 17: s = "\"SYMBOLTABLES\" expected"; break;
			case 18: s = "\"PRODUCTIONS\" expected"; break;
			case 19: s = "\"=\" expected"; break;
			case 20: s = "\".\" expected"; break;
			case 21: s = "\"END\" expected"; break;
			case 22: s = "\"STRICT\" expected"; break;
			case 23: s = "\"+\" expected"; break;
			case 24: s = "\"-\" expected"; break;
			case 25: s = "\"..\" expected"; break;
			case 26: s = "\"ANY\" expected"; break;
			case 27: s = "\":\" expected"; break;
			case 28: s = "\"@\" expected"; break;
			case 29: s = "\"<\" expected"; break;
			case 30: s = "\"^\" expected"; break;
			case 31: s = "\"out\" expected"; break;
			case 32: s = "\">\" expected"; break;
			case 33: s = "\",\" expected"; break;
			case 34: s = "\"<.\" expected"; break;
			case 35: s = "\".>\" expected"; break;
			case 36: s = "\"[\" expected"; break;
			case 37: s = "\"]\" expected"; break;
			case 38: s = "\"|\" expected"; break;
			case 39: s = "\"WEAK\" expected"; break;
			case 40: s = "\"(\" expected"; break;
			case 41: s = "\")\" expected"; break;
			case 42: s = "\"{\" expected"; break;
			case 43: s = "\"}\" expected"; break;
			case 44: s = "\"SYNC\" expected"; break;
			case 45: s = "\"IF\" expected"; break;
			case 46: s = "\"CONTEXT\" expected"; break;
			case 47: s = "\"(.\" expected"; break;
			case 48: s = "\".)\" expected"; break;
			case 49: s = "??? expected"; break;
			case 50: s = "this symbol not expected in Coco"; break;
			case 51: s = "this symbol not expected in TokenDecl"; break;
			case 52: s = "invalid TokenDecl"; break;
			case 53: s = "invalid AttrDecl"; break;
			case 54: s = "invalid AttrDecl"; break;
			case 55: s = "invalid AttrDecl"; break;
			case 56: s = "invalid AttrDecl"; break;
			case 57: s = "invalid AttrDecl"; break;
			case 58: s = "invalid SimSet"; break;
			case 59: s = "invalid Sym"; break;
			case 60: s = "invalid Term"; break;
			case 61: s = "invalid Factor"; break;
			case 62: s = "invalid Attribs"; break;
			case 63: s = "invalid Attribs"; break;
			case 64: s = "invalid Attribs"; break;
			case 65: s = "invalid Attribs"; break;
			case 66: s = "invalid Attribs"; break;
			case 67: s = "invalid TokenFactor"; break;
			case 68: s = "invalid Bracketed"; break;

			default: s = "error " + n; break;
		}
		//errorStream.WriteLine(errMsgFormat, line, col, s);
		console.log(sprintf(this.errMsgFormat, this.fileName, line, col, "SynErr", s));
		++this.count;
	}

    public /*virtual*/  SemErrLineColStr ( line : int,  col : int,  s : string) : void {
        //this.errorStream.WriteLine(this.errMsgFormat, line, col, s);
        console.log(sprintf(this.errMsgFormat, this.fileName, line, col, "SemErr", s));
        ++this.count;
    }

    public /*virtual*/  SemErr ( s : string) : void {
        //this.errorStream.WriteLine(s);
        console.log(s);
        ++this.count;
    }

    public /*virtual*/  Warning ( line : int,  col : int,  s : string) : void {
        //this.errorStream.WriteLine(this.errMsgFormat, line, col, s);
        console.log(sprintf(this.errMsgFormat, this.fileName, line, col, "Warning", s));
    }

    public /*virtual*/  WarningStr( s : string) : void {
        //this.errorStream.WriteLine(s);
        console.log(s);
    }
} // Errors


class FatalError /*extends Exception*/ {
    constructor( m : string)  {throw(m);}
}

class Symboltable {
	public name : string ;
	public strict : bool ;
	public ignoreCase : bool ;
	public predefined : {};

	constructor(name : string, ignoreCase : bool, strict : bool) {
		this.name = name;
		this.ignoreCase = ignoreCase;
		this.strict = strict;
	}

	public Add(t : Token) : bool {
		if(!this.predefined.hasOwnProperty(t.val)) {
			this.predefined[t.val] = true;
			return true;
		}
		return false;
	}

	public Use(t : Token) : bool {
		return this.predefined.hasOwnProperty(t.val);
	}
}

/*//----End Parser.ts */

/*//----Start Coco-ts.ts */
/*
let scanner = new Scanner("int a = 3;\nint32_t b,c,d=0;", "dummy.c");

let tok = scanner.Scan()
while(tok.kind != Scanner.eofSym)
{
	console.log(tok, tok.kind, tok.pos, tok.charPos, tok.col, tok.line, tok.val);
	tok = scanner.Scan();
}
*/
let grammar = `/*-------------------------------------------------------------------------
Coco.ATG -- Attributed Grammar
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
/*-------------------------------------------------------------------------
 compile with:
   Coco Coco.ATG -namespace at.jku.ssw.Coco
-------------------------------------------------------------------------*/
//$namespace=at.jku.ssw.Coco

COMPILER Coco

	static readonly id : int = 0;
	static readonly str : int = 1;

	public  trace : StringWriter;    // other Coco objects referenced in this ATG
    public  tab : Tab;
    public  dfa : DFA;
    public  pgen : ParserGen;

    private genScanner : bool = false;
    private tokenString : string | null = null;         // used in declarations of literal tokens
    private noString : string = "-none-"; // used in declarations of literal tokens
    private gramName : string | null = null; // grammar name

/*-------------------------------------------------------------------------*/

CHARACTERS
	letter    = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_".
	digit     = "0123456789".
	cr        = '\\r'.
	lf        = '\\n'.
	tab       = '\\t'.
	stringCh  = ANY - '"' - '\\\\' - cr - lf.
	charCh    = ANY - '\\'' - '\\\\' - cr - lf.
	printable = '\\u0020' .. '\\u007e'.
	hex       = "0123456789abcdef".

TOKENS
	ident     = letter { letter | digit }.
	number    = digit { digit }.
	string    = '"' { stringCh | '\\\\' printable } '"'.
	badString = '"' { stringCh | '\\\\' printable } (cr | lf).
	char      = '\\'' ( charCh | '\\\\' printable { hex } ) '\\''.

PRAGMAS
	ddtSym    = '$' { digit | letter }.  (. this.tab.SetDDT(this.la.val); .)

	optionSym = '$' letter { letter } '='
	            { digit | letter
	            | '-' | '.' | ':'
	            }.                       (. this.tab.SetOption(this.la.val); .)


COMMENTS FROM "/*" TO "*/" NESTED
COMMENTS FROM "//" TO lf

IGNORE cr + lf + tab

/*-------------------------------------------------------------------------*/

PRODUCTIONS

Coco                            (. let sym : Symbol | null;  let g : Graph, g1 : Graph, g2 : Graph;  let s : CharSet;  let beg : int, line : int; .)
=
  [ // using statements
    ANY                          (. beg =  this.t.pos; line = this.t.line; .)
    { ANY }                      (. this.pgen.usingPos = new Position(beg, this.la.pos, 0, line); .)
  ]

  "COMPILER"                    (. this.genScanner = true;
                                   this.tab.ignored = new CharSet(); .)
  ident                         (. this.gramName = this.t.val;
                                   beg = this.la.pos; line = this.la.line;
                                 .)
  { ANY }                       (. this.tab.semDeclPos = new Position(beg, this.la.pos, 0, line); .)
  [ "IGNORECASE"                (. this.dfa.ignoreCase = true; .) ]   /* pdt */
  [ "TERMINALS" { ident 	(.sym = this.tab.FindSym(this.t.val);
				if (sym != null) this.SemErr("name declared twice");
				else {
					sym = this.tab.NewSym(Node.t, this.t.val, this.t.line, this.t.col);
					sym.tokenKind = Symbol.fixedToken;
				}.)
	} ] /*from cocoxml*/
  [ "CHARACTERS" { SetDecl }]
  [ "TOKENS"  { TokenDecl<Node.t> }]
  [ "PRAGMAS" { TokenDecl<Node.pr> }]
  { "COMMENTS"                  (. let nested : bool = false; .)
    "FROM" TokenExpr<out g1>
    "TO" TokenExpr<out g2>
    [ "NESTED"                  (. nested = true; .)
    ]                           (. this.dfa.NewComment(g1.l, g2.l, nested); .)
  }
  { "IGNORE" Set<out s>         (. this.tab.ignored.Or(s); .)
  }

  [ "SYMBOLTABLES" { SymboltableDecl } ]

  SYNC
  "PRODUCTIONS"                 (. if (this.genScanner) this.dfa.MakeDeterministic();
                                   this.tab.DeleteNodes();
                                 .)
  { ident                       (. sym = this.tab.FindSym(this.t.val);
                                   let undef : bool = sym == null;
                                   if (undef) sym = this.tab.NewSym(Node.nt, this.t.val, this.t.line, this.t.col);
                                   else {
                                     if (sym.typ == Node.nt) {
                                       if (sym.graph != null) this.SemErr("name declared twice");
                                     } else this.SemErr("this symbol kind not allowed on left side of production");
                                     sym.line = this.t.line;
                                     sym.col = this.t.col;
                                   }
                                   let noAttrs : bool = sym.attrPos == null;
                                   sym.attrPos = null;
                                   let noRet : boolean = sym.retVar==null;
                                   sym.retVar = null;
                                 .)
    [ AttrDecl<sym> ]           (. if (!undef)
                                     if (noAttrs != (sym.attrPos == null)
                                        || noRet != (sym.retVar == null))
                                     this.SemErr("attribute mismatch between declaration and use of this symbol");
                                 .)
    [ SemText<out sym.semPos> ] WEAK
    '='
    Expression<out g>           (. sym.graph = g.l;
                                   this.tab.Finish(g);
                                 .)
                                WEAK
    '.'
  }
  "END" ident                   (. if (this.gramName != this.t.val)
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
                                   if (this.tab.ddt[2]) this.tab.PrintNodes();
                                   if (this.errors.count == 0) {
                                     console.log("checking");
                                     this.tab.CompSymbolSets();
                                     if (this.tab.ddt[7]) this.tab.XRef();
                                     let doGenCode : bool = false;
                                     if(this.tab.ignoreErrors) {
                                       doGenCode = true;
                                       this.tab.GrammarCheckAll();
                                     }
                                     else doGenCode = this.tab.GrammarOk();
                                     if(this.tab.genRREBNF && doGenCode) {
                                        this.pgen.WriteRREBNF();
                                     }
                                     if (doGenCode) {
                                       console.log("parser");
                                       this.pgen.WriteParser();
                                       if (this.genScanner) {
                                         console.log(" + scanner");
                                         this.dfa.WriteScanner();
                                         if (this.tab.ddt[0]) this.dfa.PrintStates();
                                       }
                                       console.log(" generated");
                                       if (this.tab.ddt[8]) this.pgen.WriteStatistics();
                                     }
                                   }
                                   if (this.tab.ddt[6]) this.tab.PrintSymbolTable();
                                 .)
  '.'
.

/*------------------------------------------------------------------------------------*/

SymboltableDecl                 (. let st : SymTab; .)
=
  ident                         (. let name : string = this.t.val.toLowerCase();
                                   if (this.tab.FindSymtab(name) != null)
                                   this.SemErr("symbol table name declared twice");
                                   st = new SymTab(name);
                                   this.tab.symtabs.push(st);
                                 .)
  [ "STRICT"                    (. st.strict = true; .)
  ]
  { string                      (. let predef : string = this.tab.Unstring(this.t.val);
                                   if (this.dfa.ignoreCase) predef = predef.toLowerCase();
                                   st.Add(predef);
                                 .)
  }
  '.'
.

/*------------------------------------------------------------------------------------*/

SetDecl                         (. let s : CharSet; .)
=
  ident                         (. let name : string = this.t.val;
                                   let c : CharClass | null = this.tab.FindCharClassByName(name);
                                   if (c != null) this.SemErr("name declared twice");
                                 .)
  '=' Set<out s>                (. if (s.Elements() == 0) this.SemErr("character set must not be empty");
                                   this.tab.NewCharClass(name, s);
                                 .)
  '.'
.

/*------------------------------------------------------------------------------------*/

Set<out s : CharSet>              (. let s2 : CharSet; .)
=
  SimSet<out s>
  { '+' SimSet<out s2>          (. s.Or(s2); .)
  | '-' SimSet<out s2>          (. s.Subtract(s2); .)
  }
.

/*------------------------------------------------------------------------------------*/

SimSet<out s : CharSet>           (. let n1 : int, n2 : int; .)
=                               (. s = new CharSet(); .)
( ident                         (. let c : CharClass | null = this.tab.FindCharClassByName(this.t.val);
                                   if (c == null) this.SemErr("undefined name"); else s.Or(c.set);
                                 .)
| string                        (. let name : string = this.tab.Unstring(this.t.val);
                                   for (let ch of name)
                                     if (this.dfa.ignoreCase) s.Set(ch.toLowerCase().charCodeAt(0));
                                     else s.Set(ch.charCodeAt(0)); .)
| Char<out n1>                  (. s.Set(n1); .)
  [ ".." Char<out n2>           (. for (let i : int = n1; i <= n2; i++) s.Set(i); .)
  ]
| "ANY"                         (. s = new CharSet(); s.Fill(); .)
)
.

/*--------------------------------------------------------------------------------------*/

Char<out n : int>
=
  char                          (. let name : string = this.tab.Unstring(this.t.val); n = 0;
                                   if (name.length == 1) n = name.charCodeAt(0);
                                   else this.SemErr("unacceptable character value");
                                   if (this.dfa.ignoreCase && n >= 65 /*'A'*/ && n <= 90 /*'Z'*/) n += 32;
                                 .)
.

/*------------------------------------------------------------------------------------*/

TokenDecl<typ : int>              (. let s : SymInfo, sym : Symbol, g : Graph;
                                                   let inherits : SymInfo, inheritsSym : Symbol;
						.)
=
  Sym<out s>                      (. sym = this.tab.FindSym(s.name);
                                   if (sym != null) this.SemErr("name declared twice");
                                   else {
                                     sym = this.tab.NewSym(typ, s.name, this.t.line, this.t.col);
                                     sym.tokenKind = Symbol.fixedToken;
                                   }
                                   this.tokenString = null;
                                 .)
  [ ':' Sym<out inherits>
                                (. inheritsSym = this.tab.FindSym(inherits.name);
                                   if (inheritsSym == null) this.SemErr("token '" + sym.name + "' can't inherit from '" + inherits.name + "', name not declared");
                                   else if (inheritsSym == sym) this.SemErr("token '" + sym.name + "' must not inherit from self");
                                   else if (inheritsSym.typ != typ) this.SemErr("token '" + sym.name + "' can't inherit from '" + inheritsSym.name + "'");
                                   else sym.inherits = inheritsSym;
                                 .)
  ]
  SYNC
  ( [
       '@'                                    (. sym.eqAttribute = this.t.val.charCodeAt(0); .)
    ]
    '=' TokenExpr<out g> '.'    (. if (s.kind == Parser.str) this.SemErr("a literal must not be declared with a structure");
    this.tab.Finish(g);
                                   if (this.tokenString == null || this.tokenString == this.noString)
                                   this.dfa.ConvertToStates(g.l, sym);
                                   else { // TokenExpr is a single string
                                     if (this.tab.FindLiteral(this.tokenString) != null)
                                     this.SemErr("token string declared twice");
                                     this.tab.literals[this.tokenString] = sym;
                                     this.dfa.MatchLiteral(this.tokenString, sym);
                                   }
                                 .)
  |                             (. if (s.kind == Parser.id) this.genScanner = false;
                                   else this.dfa.MatchLiteral(sym.name, sym);
                                 .)
  )
  [ SemText<out sym.semPos>     (. if (typ == Node.t) this.errors.WarningStr("Warning semantic action on token declarations require a custom Scanner"); .) //(. if (typ != Node.pr) this.SemErr("semantic action not allowed here"); .)
  ]
.

/*------------------------------------------------------------------------------------*/

AttrDecl<sym : Symbol>            (. let beg : int, col : int, line : int; .)
=
  '<'                           // attributes denoted by < ... >
  ( ('^' | "out")
  ident                       (. sym.retVar = this.t.val; .)
  ":"                         (. beg = this.la.pos; .)
  TypeName                    (. sym.retType = this.scanner.buffer.GetString(beg, this.la.pos); .)
  ( '>'
    | ','                       (. beg = this.la.pos; col = this.la.col; line = this.la.line; .)
      { ANY } '>'               (. if (this.t.pos > beg)
                                     sym.attrPos = new Position(beg, this.t.pos, col, line); .)
    )
  |                             (. beg = this.la.pos; col = this.la.col; line = this.la.line; .)
    [ ANY { ANY } ] '>'         (. if (this.t.pos > beg)
                                     sym.attrPos = new Position(beg, this.t.pos, col, line); .)
  )
|
  "<."                          // attributes denoted by <. ... .>
  ( ('^' | "out")
    ident                       (. sym.retVar = this.t.val; .)
    ":"                         (. beg = this.la.pos; .)
    TypeName                    (. sym.retType = this.scanner.buffer.GetString(beg, this.la.pos); .)
    ( ".>"
    | ','                       (. beg = this.la.pos; col = this.la.col; line = this.la.line; .)
      { ANY } ".>"              (. if (this.t.pos > beg)
                                     sym.attrPos = new Position(beg, this.t.pos, col, line); .)
    )
  |                             (. beg = this.la.pos; col = this.la.col; line = this.la.line; .)
    [ ANY { ANY } ] ".>"        (. if (this.t.pos > beg)
                                     sym.attrPos = new Position(beg, this.t.pos, col, line); .)
  ).

/*------------------------------------------------------------------------------------*/
// type names may contain angle brackets for generics
TypeName
= ident {'.' ident | '[' ']' | '<' TypeName {',' TypeName} '>'}.

/*------------------------------------------------------------------------------------*/

Expression<out g : Graph>         (. let g2 : Graph; .)
=
  Term<out g>                   (. let first : bool = true; .)
  {                             WEAK
    '|'
    Term<out g2>                (. if (first) { this.tab.MakeFirstAlt(g); first = false; }
                                   this.tab.MakeAlternative(g, g2);
                                 .)
  }
.

/*------------------------------------------------------------------------------------*/

Term<out g : Graph>               (. let g2 : Graph, rslv : Node | null = null; g = null; .)
=
( [                             (. rslv = this.tab.NewNodeSym(Node.rslv, null, this.la.line, this.la.col); .)
    Resolver<out rslv.pos>      (. g = new Graph(rslv); .)
  ]
  Factor<out g2>                (. if (rslv != null) this.tab.MakeSequence(g, g2);
                                   else g = g2;
                                 .)
  { Factor<out g2>              (. this.tab.MakeSequence(g, g2); .)
  }
|                               (. g = new Graph(this.tab.NewNodeSym(Node.eps, null, this.t.line, this.t.col)); .)
)                               (. if (g == null) // invalid start of Term
                                     g = new Graph(this.tab.NewNodeSym(Node.eps, null, this.t.line, this.t.col));
                                 .)
.

/*------------------------------------------------------------------------------------*/

Factor<out g : Graph>             (. let s : SymInfo, pos : Position, weak : bool = false;
                                   g = null;
                                 .)
=
( [ "WEAK"                      (. weak = true; .)
  ]
  Sym<out s>                    (. let sym : Symbol | null = this.tab.FindSym(s.name);
                                   if (sym == null && s.kind == Parser.str)
                                     sym = this.tab.FindLiteral(s.name);
                                   let undef : bool = sym == null;
                                   if (undef) {
                                     if (s.kind == Parser.id)
                                       sym = this.tab.NewSym(Node.nt, s.name, this.t.line, this.t.col);  // forward nt
                                     else if (this.genScanner) {
                                       sym = this.tab.NewSym(Node.t, s.name, this.t.line, this.t.col);
                                       this.dfa.MatchLiteral(sym.name, sym);
                                     } else {  // undefined string in production
                                        this.SemErr("undefined string in production");
                                       sym = this.tab.eofSy;  // dummy
                                     }
                                   }
                                   let typ : int = sym.typ;
                                   if (typ != Node.t && typ != Node.nt)
                                   this.SemErr("this symbol kind is not allowed in a production");
                                   if (weak)
                                     if (typ == Node.t) typ = Node.wt;
                                     else this.SemErr("only terminals may be weak");
                                   let p : Node = this.tab.NewNodeSym(typ, sym, this.t.line, this.t.col);
                                   g = new Graph(p);
                                 .)
  [ Attribs<p>                  (. if (s.kind != Parser.id) this.SemErr("a literal must not have attributes"); .)
  | ">" ident                   (.
                                   if (typ != Node.t && typ != Node.wt) this.SemErr("only terminals or weak terminals can declare a name in a symbol table");
                                   p.declares = this.t.val.toLowerCase();
                                   if (null == this.tab.FindSymtab(p.declares)) this.SemErr("undeclared symbol table '" + p.declares + "'");
                                 .)
  | ":" ident                   (.
                                   if (typ != Node.t && typ != Node.wt) this.SemErr("only terminals or weak terminals can lookup a name in a symbol table");
                                   p.declared = this.t.val.toLowerCase();
                                   if (null == this.tab.FindSymtab(p.declared)) this.SemErr("undeclared symbol table '" + p.declared + "'");
                                 .)
  ]                             (. if (undef) {
                                     sym.attrPos = p.pos;  // dummy
                                     sym.retVar = p.retVar;  // AH - dummy
                                   } else if ((p.pos == null) != (sym.attrPos == null)
                                             || (p.retVar == null) != (sym.retVar == null))
                                   this.SemErr("attribute mismatch between declaration and use of this symbol");
                                 .)
| '(' Expression<out g> ')'
| '[' Expression<out g> ']'     (. this.tab.MakeOption(g); .)
| '{' Expression<out g> '}'     (. this.tab.MakeIteration(g); .)
| SemText<out pos>              (. let p : Node = this.tab.NewNodeSym(Node.sem, null, this.t.line, this.t.col);
                                   p.pos = pos;
                                   g = new Graph(p);
                                 .)
| "ANY"                         (. let p : Node = this.tab.NewNodeSym(Node.any, null, this.t.line, this.t.col);  // p.set is set in tab.SetupAnys
                                   g = new Graph(p);
                                 .)
| "SYNC"                        (. let p : Node = this.tab.NewNodeSym(Node.sync, null, this.t.line, this.t.col);
                                   g = new Graph(p);
                                 .)
)                               (. if (g == null) // invalid start of Factor
                                     g = new Graph(this.tab.NewNodeSym(Node.eps, null, this.t.line, this.t.col));
                                 .)
.

/*------------------------------------------------------------------------------------*/

Resolver<out pos : Position>
=
  "IF" "("                       (. let beg : int = this.la.pos, col : int = this.la.col, line : int = this.la.line; .)
  Condition                      (. pos = new Position(beg, this.t.pos, col, line); .)
.

/*------------------------------------------------------------------------------------*/

Condition = { "(" Condition | ANY } ")" .

/*------------------------------------------------------------------------------------*/

TokenExpr<out g : Graph>          (. let g2 : Graph; .)
=
  TokenTerm<out g>              (. let first : bool = true; .)
  {                             WEAK
    '|'
    TokenTerm<out g2>           (. if (first) { this.tab.MakeFirstAlt(g); first = false; }
                                   this.tab.MakeAlternative(g, g2);
                                 .)
  }
.

/*------------------------------------------------------------------------------------*/

TokenTerm<out g : Graph>          (. let g2 : Graph; .)
=
  TokenFactor<out g>
  { TokenFactor<out g2>         (. this.tab.MakeSequence(g, g2); .)
  }
  [ "CONTEXT"
    '(' TokenExpr<out g2>       (. this.tab.SetContextTrans(g2.l); this.dfa.hasCtxMoves = true;
                                   this.tab.MakeSequence(g, g2); .)
    ')'
  ]
.

/*------------------------------------------------------------------------------------*/

TokenFactor<out g : Graph>        (. let s : SymInfo; .)
=
                                (. g = null; .)
( Sym<out s>                    (. if (s.kind == Parser.id) {
                                     let c : CharClass | null = this.tab.FindCharClassByName(this.t.val);
                                     if (c == null) {
                                        this.SemErr("undefined name: " + s.name);
                                       c = this.tab.NewCharClass(s.name, new CharSet());
                                     }
                                     let p : Node = this.tab.NewNodeSym(Node.clas, null, this.t.line, this.t.col); p.val = c.n;
                                     g = new Graph(p);
                                     this.tokenString = this.noString;
                                   } else { // str
                                     g = this.tab.StrToGraph(s.name);
                                     if (this.tokenString == null) this.tokenString = s.name;
                                     else this.tokenString = this.noString;
                                   }
                                 .)
| '(' TokenExpr<out g> ')'
| '[' TokenExpr<out g> ']'      (. this.tab.MakeOption(g); this.tokenString = this.noString; .)
| '{' TokenExpr<out g> '}'      (. this.tab.MakeIteration(g); this.tokenString = this.noString; .)
)                               (. if (g == null) // invalid start of TokenFactor
                                     g = new Graph(this.tab.NewNodeSym(Node.eps, null, this.t.line, this.t.col)); .)
.

/*------------------------------------------------------------------------------------*/

Sym<out s : SymInfo>
=                               (. s = new SymInfo(); s.name = "???"; s.kind = Parser.id; .)
( ident                         (. s.kind = Parser.id; s.name = this.t.val; .)
| (string                       (. s.name = this.t.val; .)
  | char                        (. s.name = "\\"" + this.t.val.substr(1, this.t.val.length-2) + "\\""; .)
  )                             (. s.kind = Parser.str;
                                   if (this.dfa.ignoreCase) s.name = s.name.toLowerCase();
                                   if (s.name.indexOf(' ') >= 0)
                                   this.SemErr("literal tokens must not contain blanks"); .)
)
.

/*------------------------------------------------------------------------------------*/

Attribs<n : Node>                 (. let beg : int, col : int, line : int; .)
=
  '<'                           // attributes denoted by < ... >
  ( ('^' | "out")               (. beg = this.la.pos; .)
    { ANY
    | Bracketed
    | badString                 (. this.SemErr("bad string in attributes"); .)
    }                           (. n.retVar = this.scanner.buffer.GetString(beg, this.la.pos); .)
    ( '>'
    | ','                       (. beg = this.la.pos; col = this.la.col; line = this.la.line; .)
      {  ANY
       | badString              (. this.SemErr("bad string in attributes"); .)
      } '>'                     (. if (this.t.pos > beg) n.pos = new Position(beg, this.t.pos, col, line); .)
    )
  |                             (. beg = this.la.pos; col = this.la.col; line = this.la.line; .)
    [ ( ANY
	  | badString               (. this.SemErr("bad string in attributes"); .)
	  )
      {  ANY
      | badString               (. this.SemErr("bad string in attributes"); .)
      }
    ] '>'                       (. if (this.t.pos > beg) n.pos = new Position(beg, this.t.pos, col, line); .)
  )
|
	"<."                          // attributes denoted by <. ... .>
  ( ('^' | "out")               (. beg = this.la.pos; .)
    { ANY
    | Bracketed
    | badString                 (. this.SemErr("bad string in attributes"); .)
    }                           (. n.retVar = this.scanner.buffer.GetString(beg, this.la.pos); .)
    ( ".>"
    | ','                       (. beg = this.la.pos; col = this.la.col; line = this.la.line; .)
      {  ANY
       | badString              (. this.SemErr("bad string in attributes"); .)
      } ".>"                    (. if (this.t.pos > beg) n.pos = new Position(beg, this.t.pos, col, line); .)
    )
  |                             (. beg = this.la.pos; col = this.la.col; line = this.la.line; .)
    [ ( ANY
	  | badString               (. this.SemErr("bad string in attributes"); .)
	  )
      {  ANY
      | badString               (. this.SemErr("bad string in attributes"); .)
      }
    ] ".>"                      (. if (this.t.pos > beg) n.pos = new Position(beg, this.t.pos, col, line); .)
  )
.

/*------------------------------------------------------------------------------------*/
// skip commas in brackets such as in <out a[i, j], b> or <out a[foo(x, y)], z>
Bracketed
= '(' {Bracketed | ANY} ')' | '[' {Bracketed | ANY} ']'.


/*------------------------------------------------------------------------------------*/

SemText<out pos : Position>
=
  "(."                          (. let beg : int = this.la.pos, col : int = this.la.col, line : int = this.la.line; .)
  { ANY
  | badString                   (. this.SemErr("bad string in semantic action"); .)
  | "(."                        (. this.SemErr("missing end of previous semantic action"); .)
  }
  ".)"                          (. pos = new Position(beg, this.t.pos, col, line); .)
.

END Coco.
`;
//console.log("====", grammar, "=====");

function MyWriteBufferTo(sender : string, content : string){
	//print("==MyWriteBufferTo==", sender);
	switch(sender) {
		case "WriteRREBNF": stdWriteFile("Parser.ebnf", content); break;
		case "WriteScanner": stdWriteFile("Scanner-ts.txt", content); break;
		case "WriteParser": stdWriteFile("Parser-ts.txt", content); break;
	}
};
let grammar_fname = "Coco-ts.atg";

if(stdScriptArgs.length > 1) {
    grammar_fname = stdScriptArgs[1];
    //console.log(grammar_fname, stdScriptArgs);
    grammar = std.loadFile(grammar_fname);

    //console.log("====", grammar, "=====");
    CocoParserFrame = std.loadFile("Parser-ts.frame");
    CocoScannerFrame = std.loadFile("Scanner-ts.frame");
    CocoCopyrightFrame = std.loadFile("Copyright.frame");
    //console.log("====", CocoParserFrame, "=====");
    //console.log("====", CocoScannerFrame, "=====");
    //console.log("====", CocoCopyrightFrame, "=====");

    let scanner = new Scanner(grammar, grammar_fname);
    /*
    tok = scanner.Scan()
    while(tok.kind != Scanner.eofSym)
    {
        console.log(tok, tok.kind, tok.pos, tok.charPos, tok.col, tok.line, tok.val);
        tok = scanner.Scan();
    }
    */

    let parser = new Parser(scanner);
    parser.trace = new StringWriter();
    parser.tab = new Tab(parser);
    parser.tab.SetDDT("AFGIJPSX");
    //parser.tab.outDir = "tmp";
    //parser.tab.genAST = true;
    //parser.tab.genAstRaw = true;
    parser.tab.genRREBNF = true;
    //parser.tab.genSQL = true;
    parser.dfa = new DFA(parser);
    parser.pgen = new ParserGen(parser);
    parser.pgen.writeBufferTo = MyWriteBufferTo;
    parser.Parse();
    if(parser.trace) stdWriteFile("trace.txt", parser.trace.ToString());
} else {
    console.log(`
    Coco/R Typescript (July 12, 2022)
    Usage: node Coco Grammar.ATG {Option}
    Options:
      -namespace <namespaceName>
      -frames    <frameFilesDirectory>
      -trace     <traceString>
      -o         <outputDirectory>
      -lines
      -genRREBNF
      -genAST
      -ignoreErrors ignore grammar errors for developing purposes
    Valid characters in the trace string:
      A  trace automaton
      F  list first/follow sets
      G  print syntax graph
      I  trace computation of first sets
      J  list ANY and SYNC sets
      P  print statistics
      S  list symbol table
      X  list cross reference table
    Scanner.frame and Parser.frame files needed in ATG directory
    or in a directory specified in the -frames option.
    
    `);
}
/*//----End Coco-ts.ts */

export {};
