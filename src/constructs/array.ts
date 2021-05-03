import {State} from '../types/State.ts'
import {AstNode} from '../types/AstNode.ts'
import {parseString} from './string.ts'
import {parseNumber} from './number.ts'
import {parseObject} from './object.ts'
import {parseNull} from './null.ts'

/** Parses: `<object|array|string|number>, ...` */
const parseElement = (state: State) => {

	if (state.tokens[state.pos].type !== 'rightBracket') {
		const nextTokenType = state.tokens[state.pos].type
		if (nextTokenType === 'leftBrace') {
			parseObject(state)
		} else if (nextTokenType === 'leftBracket') {
			parseArray(state)
		} else if (nextTokenType === 'string') {
			parseString(state)
		} else if (nextTokenType === 'number') {
			parseNumber(state)
		} else if (nextTokenType === 'null') {
			parseNull(state)
		}

		// If next token is a comma, recur.
		if (state.tokens[state.pos].type === 'comma') {
			state.pos++ // Step past the comma.
			parseElement(state)
		}
	}
}

export const parseArray = (state: State) => {

	if (state.tokens[state.pos].type === 'leftBracket') {
		const arrayNode = new AstNode('array', state.host)
		state.host = arrayNode
		state.pos++ // Step past the opening bracket.

		// Iterate until the parser stops handling tokens.
		while (state.tokens[state.pos].type !== 'rightBracket') {
			parseElement(state)
		}
		
		state.host = arrayNode.parent
		state.pos++ // Step past closing bracket.
	}
}