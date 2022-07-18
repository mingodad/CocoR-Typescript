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
[ "CocoAll.js" -nt "docs/CocoR.js" ] && awk '/\/\/Start CocoR\.js/,/\/\/End CocoR\.js/' CocoAll.js > docs/CocoR.js

csSource="examples/Parser.cs"

#$tsc_cmd examples/ParserCSharp2.ts
#node examples/ParserCSharp2.js $csSource

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

#cSource="examples/test.c"
#outfn="cparser-test.ts"
#node CocoAll.js examples/C-ts.atg
#cvt_ts2js $outfn CParser
#node ${outfn%.*}.js $cSource

atgSource="Coco-ts.atg"
outfn="coco-atg-extract-test.ts"
node CocoAll.js examples/Coco-extract-atg.atg
cvt_ts2js $outfn
node ${outfn%.*}.js $atgSource

outfn="coco-atg-extract-test-js.js"
node CocoAll.js examples/Coco-extract-atg-js.atg  -genJS
join_js $outfn CocoRJS
node $outfn $atgSource

sqlSource="examples/test.sql"
outfn="squirell-sql.js"
node CocoAll.js examples/squirrel-sql.atg  -genJS
join_js $outfn CocoRJS
node $outfn $sqlSource

v3Source="examples/Eval.v3"
outfn="virgil.js"
node CocoAll.js examples/virgil.atg  -genJS
join_js $outfn CocoRJS
node $outfn $v3Source

luaSource="examples/lpregex.lua"
outfn="lua.js"
node CocoAll.js examples/lua.atg  -genJS
join_js $outfn CocoRJS
node $outfn $luaSource

gmplSource="examples/allocate-patients.mod"
outfn="gmpl.js"
node CocoAll.js examples/gmpl.atg  -genJS
join_js $outfn CocoRJS
node $outfn $gmplSource
