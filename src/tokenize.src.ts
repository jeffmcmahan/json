import {Token} from './types/Token.ts'

/** Fast, simple src string segmentation. */
export const tokenize = (src: string): Token[] => {
	let pos = 0
	const tokens: Token[] = []
	while (pos < src.length) {
		const token = src[pos]

		// Step past whitespace.
		if ([' ', '\t', '\n'].includes(token)) {
			pos++
			continue
		}

		if (token === 'n' && src.slice(pos, pos + 4) === 'null') {
			tokens.push({
				token: 'null',
				type: 'null'
			})
			pos += 4
			continue
		}

		if (token === '{') {
			tokens.push({
				token, 
				type: 'leftBrace'
			})
			pos++
			continue
		}

		if (token === '}') {
			tokens.push({
				token, 
				type: 'rightBrace'
			})
			pos++
			continue
		}

		if (token === ',') {
			tokens.push({
				token, 
				type: 'comma'
			})
			pos++
			continue
		}

		if (token === ':') {
			tokens.push({
				token, 
				type: 'colon'
			})
			pos++
			continue
		}

		if (token === '[') {
			tokens.push({
				token,
				type: 'leftBracket'
			})
			pos++
			continue
		}

		if (token === ']') {
			tokens.push({
				token,
				type: 'rightBracket'
			})
			pos++
			continue
		}

		if (token === '"') {
			const onset = pos
			let offset = pos
			do {
				offset++
			} while (src[offset] !== '"' && src[offset - 1] !== '\\')

			tokens.push({
				token: src.slice(onset, offset + 1),
				type: 'string'
			})

			pos = (offset + 1)
			continue
		}

		if ('0123456789'.includes(token)) {
			const onset = pos
			let offset = pos
			while ('0123456789.'.includes(src[offset])) {
				offset++
			}
			const token = src.slice(onset, offset)
			tokens.push({token, type: 'number'})
			if (!token.match(/^\d+(.\d+)?$/)) {
				throw new SyntaxError(`Invalid number: ${token}`)
			}
			pos = offset
			continue
		}
	}

	return tokens
}