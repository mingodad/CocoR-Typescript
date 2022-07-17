#!/bin/sh

#tsc_cmd="tsc -target es5 -module es2015"
tsc_cmd="tsc -target es5"

cvt_ts2js() {
	cat Aux-ts-head.ts > $1
	cat Scanner-ts.txt >> $1
	cat Parser-ts.txt >> $1
	if [ "$2" = "" ]
	then
		cat Aux-ts-tail.ts >> $1
	else
		sed "s/Parser/$2.Parser/g; s/Scanner/$2.Scanner/g" Aux-ts-tail.ts >> $1
	fi
	$tsc_cmd $1
}

join_js() {
	cat Aux-ts-head.js > $1
	cat Scanner-ts.txt >> $1
	cat Parser-ts.txt >> $1
	if [ "$2" = "" ]
	then
		cat Aux-ts-tail.js >> $1
	else
		sed "s/Parser/$2.Parser/g; s/Scanner/$2.Scanner/g" Aux-ts-tail.js >> $1
	fi
}

[ "CocoAll.ts" -nt "CocoAll.js" ] && $tsc_cmd CocoAll.ts

csSource="examples/Parser.cs"

$tsc_cmd examples/ParserCSharp2.ts
node examples/ParserCSharp2.js $csSource

outfn="csparser-test.ts"
node CocoAll.js examples/CSharp2-ts.atg
cvt_ts2js $outfn
node ${outfn%.*}.js $csSource

outfn="csparser-test-js.ts"
node CocoAll.js examples/CSharp2-js.atg -genJS
join_js  ${outfn%.*}.js CocoRJS
node  ${outfn%.*}.js $csSource

jsonSource="examples/Parser.json"
outfn="jsonparser-test.ts"
node CocoAll.js examples/Json.atg
cvt_ts2js $outfn
node ${outfn%.*}.js $jsonSource

outfn="jsonparser-test-js.js"
node CocoAll.js examples/Json.atg -genJS
join_js $outfn CocoRJS
node $outfn $jsonSource

cSource="examples/test.c"
outfn="cparser-test.ts"
node CocoAll.js examples/C-ts.atg
cvt_ts2js $outfn CParser
node ${outfn%.*}.js $cSource

atgSource="Coco-ts.atg"
outfn="coco-atg-extract-test.ts"
node CocoAll.js examples/Coco-extract-atg.atg
cvt_ts2js $outfn
node ${outfn%.*}.js $atgSource
