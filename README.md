# CocoR-Typescript LL(1) parser generator
Port of CocoR to Typescript/Javascript

See also:
- https://github.com/SSW-CocoR/CocoR-CPP
- https://github.com/mingodad/CocoR-Java
- https://github.com/mingodad/CocoR-CPP
- https://github.com/mingodad/CocoR-CSharp
- https://github.com/Lercher/CocoR

To create the Javascript from the Typescript source do:
```
tsc -target es5 CocoAll.ts
```
To generate a Scanner and Parser from a grammar do:
```
node CocoAll.js examples/CSharp2-ts.atg
```
The above command will generate `Scanner-ts.txt`, `Parser-ts.txt`, `Parser.ebnf` and `trace.txt` .

See `examples/ParserCSharp2.ts` for an example that started wirh the converted
`Scanner.cs` and `Parser.cs` from `CSharp2.ATG` and joined and edited manually
to get a functional (to some extent) CSharp to Typescript transpiler.

To use the CSharp to Typescript transpiler do:
```
tsc -target es5 examples/ParserCSharp2.ts
node examples/ParserCSharp2.js some_source.cs > some_source.cs.ts
```
Then manually check and fix/convert missing pieces.
