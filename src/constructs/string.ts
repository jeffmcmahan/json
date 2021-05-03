import {State} from '../types/State.ts'
import {AstNode} from '../types/AstNode.ts'

export const parseString = (state: State) => {
	if (state.tokens[state.pos].type === 'string') {
		const stringNode = new AstNode('string', state.host)
		stringNode.value = state.tokens[state.pos].token
		state.pos++ // Step past the string literal.
	}
}