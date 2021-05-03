import {State} from '../types/State.ts'
import {AstNode} from '../types/AstNode.ts'

export const parseNumber = (state: State) => {
	if (state.tokens[state.pos].type === 'number') {
		const numNode = new AstNode('number', state.host)
		numNode.value = state.tokens[state.pos].token
		state.pos++ // Step past the number literal.
	}
}