#!/bin/sh

cvt_ts2js() {
	cat Aux-ts-head.ts > $1
	cat Scanner-ts.txt >> $1
	cat Parser-ts.txt >> $1
	cat Aux-ts-tail.ts >> $1
	tsc -target es5 $1
}

join_js() {
	cat Aux-ts-head.js > $1
	cat Scanner-ts.txt >> $1
	cat Parser-ts.txt >> $1
	cat Aux-ts-tail.js >> $1
}

[ "CocoAll.ts" -nt "CocoAll.js" ] && tsc -target es5 CocoAll.ts

csSource="examples/Parser.cs"

tsc -target es5  examples/ParserCSharp2.ts
node examples/ParserCSharp2.js $csSource

outfn="csparser-test.ts"
node CocoAll.js examples/CSharp2-ts.atg
cvt_ts2js $outfn
node ${outfn%.*}.js $csSource

outfn="csparser-test-js.ts"
node CocoAll.js examples/CSharp2-js.atg -genJS
join_js  ${outfn%.*}.js
node  ${outfn%.*}.js $csSource

jsonSource="examples/Parser.json"
outfn="jsonparser-test.ts"
node CocoAll.js examples/Json.atg
cvt_ts2js $outfn
node ${outfn%.*}.js $jsonSource

outfn="jsonparser-test-js.js"
node CocoAll.js examples/Json.atg -genJS
join_js $outfn
node $outfn $jsonSource
