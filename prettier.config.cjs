/** @type {import('prettier').Config} */
module.exports = {
	endOfLine: 'lf',
	semi: true,
	useTabs: true,
	singleQuote: true,
	arrowParens: 'avoid',
	tabWidth: 4,
	trailingComma: 'none',
	importOrder: [
		'^(react/(.*)$)|^(react$)',
		'^(next/(.*)$)|^(next$)',
		'<THIRD_PARTY_MODULES>',
		'',
		'^types$',
		'^@/types/(.*)$',
		'^@/config/(.*)$',
		'^@/lib/(.*)$',
		'^@/hooks/(.*)$',
		'^@/components/ui/(.*)$',
		'^@/components/(.*)$',
		'^@/registry/(.*)$',
		'^@/styles/(.*)$',
		'^@/app/(.*)$',
		'',
		'^[./]'
	],
	importOrderSeparation: false,
	importOrderSortSpecifiers: true,
	importOrderBuiltinModulesToTop: true,
	importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
	importOrderMergeDuplicateImports: true,
	importOrderCombineTypeAndValueImports: true,
	plugins: ['prettier-plugin-tailwindcss']
}
