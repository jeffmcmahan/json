import {tokenize} from './tokenize.ts'
import {Token} from './types/Token.ts'
import {State} from './types/State.ts'
import {AstNode} from './types/AstNode.ts'
import {parseObject} from './constructs/object.ts'
import {parseArray} from './constructs/array.ts'
import {parseString} from './constructs/string.ts'
import {parseNumber} from './constructs/number.ts'
import {parseNull} from './constructs/null.ts'

const parseTokens = (tokens: Token[]): AstNode => {
	
	const root = new AstNode('root')
	const state: State = {
		tokens,
		pos: 0,
		ast: root,
		host: root
	}

	// The root-level context is special; it tolerates a lone value
	// of any datatype.

	while (state.pos < tokens.length) {
		
		const start = state.pos

		parseNumber(state)
		if (state.pos > start) {
			break // If top-level number, we're done.
		}
		
		parseString(state)
		if (state.pos > start) {
			break // If top-level string, we're done.
		}

		parseNull(state)
		if (state.pos > start) {
			break // If top-level null, we're done.
		}

		parseArray(state)
		if (state.pos > start) {
			break
		}

		parseObject(state)
		if (state.pos > start) {
			break
		}
	}

	return state.ast
}

/** Consumes JSON source and produces a syntax tree. */
export const parse = (src: string): AstNode => {
	const tokens: Token[] = tokenize(' ' + src + ' ')
	const tree: AstNode = parseTokens(tokens)
	return tree
}