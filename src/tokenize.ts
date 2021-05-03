import {tokenize} from './tokenize.src.ts'
export {tokenize} from './tokenize.src.ts'

const tokens = tokenize(`[
	11,
	"2",
	{"three": null},
]`)

console.assert(
	tokens[0].type === 'leftBracket',
	'Should spot opening array bracket.'
)

console.assert(
	tokens[1].type === 'number',
	'Should spot the first array element (11).'
)

console.assert(
	tokens[1].token === '11',
	'Should have the number 11 as a string in .value.'
)

console.assert(
	tokens[2].type === 'comma',
	'Should register the comma delimeter.'
)

console.assert(
	tokens[3].type === 'string',
	'Should spot the string: "2".'
)

console.assert(
	tokens[3].token === '"2"',
	'Should have the string value in including the quotes.'
)

console.assert(
	tokens[5].type === 'leftBrace',
	'Should spot the opening brace for the embedded object.'
)

console.assert(
	tokens[7].type === 'colon',
	'Should spot the property assignment colon.'
)

console.assert(
	tokens[8].type === 'null',
	'Should spot the null value at array[2].three.'
)

console.assert(
	tokens[9].type === 'rightBrace',
	'Should spot the closing brace.'
)

console.assert(
	tokens[11].type === 'rightBracket',
	'Should spot the closing bracket.'
)