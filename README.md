# json

A JSON parser written in TypeScript/AssemblyScript, compiled to wasm for use in the browser, Node.js, and Deno. The idea is provide three APIs for parsing JSON, that works and performs well anywhere: a plaino synchronous API (like JSON.parse), a streaming API, and path-constrained streaming API for working with large files, or for situations where the size of the input, or the frequency of access, are unknown.

The path-constrained API will parse into the data (using the streaming API) just far enough to find and parse the data at the indicated path, using an appropriate algorithm to avoid parsing into branches of the data that are not relevant.

```ts
import {incremental as json} from '@jeffmcmahan/json'

const jsonDataStr = `{
	"foo": {"fizz": "buzz"},
	"bar": {"baz": 1},
	"bop": 2
}`

json(jsonDataStr).bar.baz.then(console.log) // 1
```

Here the incremental parser will parse into the top-level of the object until spotting "bar"; it'd never see the object containing "fizz" (it will bracket-match its way to the next property name). It would likewise never see "bop". And because this is achieved using the streaming API, it'll be memory efficient with large files, at the expense of execution speed, which will be disk I/O constrained.

## API

json returns an AstNode instance (for now), and that can be inspected using the `print` method. The `jsonDataStr` about would produce something roughly like this:

```
root: 
  object: 
    property: 
      propertyName: "foo"
      propertyValue: 
        string: "some text"
    property: 
      propertyName: "bar"
      propertyValue: 
        number: 509484
    property: 
      propertyName: "baz"
      propertyValue: 
        object: 
          property: 
            propertyName: "prop"
            propertyValue: 
              string: "val"
```

@todo - Compile step invoked by `AstNode.lookup()` to move from an AST fragment to a JS object value.