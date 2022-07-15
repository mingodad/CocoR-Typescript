/*//----Start Aux-ts.js */
if (typeof std == "undefined") {
    (function () {
        var fs = require('fs');
        global.std = {
            "loadFile": function (fname) {
                return fs.readFileSync(fname, 'utf8');
            },
            "open": function (fname, mode) {
                var fp = {
                    "fd": fs.openSync(fname, mode),
                    "close": function () {
                        fs.closeSync(this.fd);
                    },
                    "write": function (data, fptr) {
                        fs.writeSync(this.fd, data);
                    }
                };
                return fp;
            }
        };
        global.stdWriteFile = function (fname, data) {
            fs.writeFileSync(fname, data, 'utf8');
        };
        global.stdWriteToStdout = function (data) {
            process.stdout.write(data);
        };
        global.stdScriptArgs = process.argv.slice(1);
    })();
}
else {
    var qjsThis = this || {};
    qjsThis.stdScriptArgs = scriptArgs;
    qjsThis.stdWriteFile = function (fname, data) {
        var fd = std.open(fname, "w");
        fd.puts(data);
        fd.close();
    };
    qjsThis.stdWriteToStdout = function (data) {
        std.printf("%s", data);
    };
}
var BitArray = /** @class */ (function () {
    function BitArray(count, defVal) {
        if (defVal === void 0) { defVal = false; }
        this._bits = new Array(count);
        for (var idx = 0; idx < this._bits.length; ++idx)
            this._bits[idx] = defVal;
    }
    BitArray.prototype.SetAll = function (val) {
        for (var idx in this._bits)
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
        for (var idx in ba._bits) {
            if (ba._bits[idx] != this._bits[idx])
                return false;
        }
        return true;
    };
    BitArray.prototype.Intersect = function (ba) {
        this.checkSameSize(ba);
        for (var idx in ba._bits)
            if (ba._bits[idx] && this._bits[idx])
                return true;
        return false;
    };
    BitArray.prototype.Get = function (i) { return this._bits[i]; };
    BitArray.prototype.Set = function (i, val) { this._bits[i] = val; };
    BitArray.prototype.Count = function () { return this._bits.length; };
    BitArray.prototype.Or = function (ba) {
        this.checkSameSize(ba);
        for (var idx in ba._bits) {
            this._bits[idx] = ba._bits[idx] || this._bits[idx];
        }
        return this;
    };
    BitArray.prototype.And = function (ba) {
        this.checkSameSize(ba);
        for (var idx in ba._bits) {
            this._bits[idx] = ba._bits[idx] && this._bits[idx];
        }
        return this;
    };
    BitArray.prototype.Not = function () {
        for (var idx in this._bits)
            this._bits[idx] = !this._bits[idx];
        return this;
    };
    BitArray.prototype.Clone = function () {
        var ba = new BitArray(0);
        ba._bits = this._bits.slice(0);
        return ba;
    };
    return BitArray;
}());
/*//----End Aux-ts.js */
