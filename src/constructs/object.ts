import {State} from '../types/State.ts'
import {AstNode} from '../types/AstNode.ts'
import {parseString} from './string.ts'
import {parseNumber} from './number.ts'
import {parseArray} from './array.ts'
import {parseNull} from './null.ts'

/** Parses: `"propName": <object|array|string|number>,` */
const parseProperty = (state: State) => {

	if (state.tokens[state.pos].type === 'string') {
		
		// Create the property node and then the name and value nodes.
		const propNode = new AstNode('property', state.host)
		const propNameNode = new AstNode('propertyName', propNode)
		const propValueNode = new AstNode('propertyValue', propNode)
		propNameNode.value = state.tokens[state.pos].token
		state.pos++ // Step past the property name.
		state.pos++ // Step past the assignment colon.

		// Get the value of the property.
		state.host = propValueNode
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

		// Step out of the property node context, back to the object node.
		state.host = propNode.parent

		// If next token is a comma, recur.
		if (state.tokens[state.pos].type === 'comma') {
			state.pos++ // Step past the comma.
			parseProperty(state)
		}
	}
}

export const parseObject = (state: State) => {

	if (state.tokens[state.pos].type === 'leftBrace') {
		const objNode = new AstNode('object', state.host)
		state.host = objNode
		state.pos++ // Step past the opening brace.

		while (state.tokens[state.pos].type !== 'rightBrace') {
			parseProperty(state)
		}

		state.host = objNode.parent
		state.pos++ // Step past closing brace.
	}
}