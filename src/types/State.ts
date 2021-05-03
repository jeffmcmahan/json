import {Token} from './Token.ts'
import {AstNode} from './AstNode.ts'

export interface State {
	tokens: Token[]
	pos: number
	host: AstNode
	ast: AstNode
}