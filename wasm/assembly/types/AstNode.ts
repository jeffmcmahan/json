type NodeTypeName = (
	'root' | 'null' | 'string' | 'number' | 'array' | 'object' | 
	'property' | 'propertyName' | 'propertyValue'
)

export class AstNode {

	type: NodeTypeName
	value: string
	children: AstNode[]
	parent: AstNode

	constructor(type: NodeTypeName, parent?: AstNode) {
		this.type = type
		this.value = ''
		this.children = []
		this.parent = (parent ?? this)
		if (parent) {
			parent.children.push(this)
		}
	}

	/** Traverses the tree to retrieve the value at the given path.  */
	static lookup(ast: AstNode, path: string): AstNode {
		
		const segments: string[]  = path.split('.')
		let host = ast
		while (segments.length) {

			// Collect the object and property nodes
			const propNodes: AstNode[] = []
			host.children.forEach((astNode: AstNode) => {
				if (astNode.type === 'property') {
					propNodes.push(astNode)
				}
				if (astNode.type === 'object') {
					propNodes.push(...astNode.children)
				}
			})

			// propNodes.forEach(node => console.log(AstNode.print(node)))

			// Get the current path segment.
			const segment: string = (segments.shift() ?? '')

			// Grab the property node with the matching name.
			const foundNode = propNodes.find((astNode: AstNode) => {
				return astNode.children[0].value === `"${segment}"`
			})

			// Hard fail on a bad path.
			if (!foundNode) {
				throw new TypeError(`Path "${path}" lookup failed at: .${segment}`)
			}

			host = foundNode.children[1].children[0] // Update the host node context.
		}

		return host
	}

	/** Recursively serializes the AST structure. */
	private static _print(ast: AstNode, depth: number): string {
		const indent = '\n' + ''.padStart((depth * 2), ' ')
		return (
			indent + '- ' +
			ast.type + ': ' +
			ast.value + // <- Often empty.
			ast.children.map((child: AstNode) => AstNode._print(child, depth + 1)).join('')
		)
	}

	/** Adapts the _print method for public exposure. */
	public static print(ast: AstNode): string {
		return AstNode._print(ast, 0)
	}
}