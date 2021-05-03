import {AstNode} from './types/AstNode.ts'
import {parse} from './main.src.ts'
export {parse} from './main.src.ts'

/** AstNode.print() provides a simple serialization of the syntax tree which
	allows for easy verification of the structure of the tree, which is way
	less verbose than the actual object tree. So we test that. */

const stringsMatch = (str1: string, str2: string) => {
	return str1.replace(/\s/g, '') === str2.replace(/\s/g, '')
}

console.assert(
	stringsMatch(AstNode.print(parse(`"foo"`)), '-root: -string:"foo"'),
	'Lone string should work.'
)

console.assert(
	stringsMatch(AstNode.print(parse('500')), '-root: -number: 500'),
	'Lone number should work.'
)

console.assert(
	stringsMatch(AstNode.print(parse('null')), '-root: -null: null'),
	'Lone null should work.'
)

console.assert(
	stringsMatch(AstNode.print(parse('{}')), '-root: -object:'),
	'Lone empty object should work.'
)

console.assert(
	stringsMatch(AstNode.print(parse('[]')), '-root: -array:'),
	'Lone empty array should work.'
)

console.assert(
	stringsMatch(AstNode.print(parse('{"foo": 1}')), `
		-root: -object: -property: 
							-propertyName:"foo"
							-propertyValue:-number:1`
	),
	'Basic object should work.'
)

console.assert(
	stringsMatch(AstNode.print(parse('[1, 2, "three", null]')), `
		-root:	-array:	-number:1
						-number:2
						-string:"three"
						-null:null`
	),
	'Basic array should work.'
)

// Complex object
const complexTree = parse(`{
	"foo": null
	"bar": ["bar", 3, 4],
	"baz": {"fizz": "buzz"},
	"bop": 543,
	"bub": 543.5443
}`)

console.assert(
	stringsMatch(AstNode.print(complexTree),
		`- root: 
			- object: 
				- property: 
					- propertyName: "foo"
					- propertyValue: 
						- null: null
				- property: 
					- propertyName: "bar"
					- propertyValue: 
						- array: 
							- string: "bar"
							- number: 3
							- number: 4
				- property: 
					- propertyName: "baz"
					- propertyValue: 
						- object: 
							- property: 
								- propertyName: "fizz"
								- propertyValue: 
									- string: "buzz"
				- property: 
					- propertyName: "bop"
					- propertyValue: 
						- number: 543
				- property: 
					- propertyName: "bub"
					- propertyValue: 
						- number: 543.5443`
	),
	'Complex object should work.'
)

const lookupNode = AstNode.lookup(parse('{"foo": 1}'), 'foo')
console.assert(
	lookupNode.type === 'number',
	'.foo lookup should be a number.'
)
console.assert(
	lookupNode.value === '1',
	'.foo lookup should have value "1".'
)

const deepLookupNode = AstNode.lookup(complexTree, 'baz.fizz')
console.assert(
	deepLookupNode.type === 'string',
	'.baz.fizz lookup should be a string'
)
console.assert(
	deepLookupNode.value === '"buzz"',
	'baz.fizz lookup should have value "buzz".'
)