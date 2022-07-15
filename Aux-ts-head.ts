/*//----Start Aux-ts.js */
type int = number;
type char = number;
type bool = boolean;

declare function require(s : string) : {[key: string]: any};
declare var global: {[key: string]: any} | undefined;
declare var std: {[key: string]: any} | undefined;
declare var process: {[key: string]: any} | undefined;
declare var scriptArgs: Array<string> | undefined;
declare var stdScriptArgs: Array<string> | undefined;
declare var stdWriteFile: any | undefined;
declare function stdWriteToStdout(s : string) : void;

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
        global.stdWriteToStdout = function(data : string) {
            process.stdout.write(data);
        };
        global.stdScriptArgs = process.argv.slice(1);
    })();
} else {
    let qjsThis : {[key : string] : any} = this || {};
    qjsThis.stdScriptArgs = scriptArgs;
    qjsThis.stdWriteFile = function(fname : string, data : string) {
        var fd = std.open(fname, "w");
        fd.puts(data);
        fd.close();
    }
    qjsThis.stdWriteToStdout = function(data : string) {
        std.printf("%s", data);
    }
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
/*//----End Aux-ts.js */
