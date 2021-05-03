import {State} from '../types/State.ts'
import {AstNode} from '../types/AstNode.ts'

export const parseNull = (state: State) => {
	if (state.tokens[state.pos].token === 'null') {
		const stringNode = new AstNode('null', state.host)
		stringNode.value = 'null'
		state.pos++ // Step past null.
	}
}