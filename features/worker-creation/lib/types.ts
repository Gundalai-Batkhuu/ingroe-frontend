export type ResourceItem =
	| { id: string; type: 'file' | 'note'; content: File; displayName: string }
	| { id: string; type: 'link'; content: string; displayName: string };
