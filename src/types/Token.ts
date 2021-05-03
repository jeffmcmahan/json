export interface Token {
	token: string
	type: (
		'string' | 'number' | 'null' | 'leftBracket' | 'rightBracket' |
		'leftBrace' | 'rightBrace' | 'comma' | 'colon'
	)
}