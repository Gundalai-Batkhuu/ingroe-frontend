import { CoreMessage } from 'ai';

export interface Message {
	id: string;
	role: 'user' | 'assistant' | 'system';
	content: string | { answer: string };
	context?: Context[];
	chunkid?: string[];
}

export interface Chat extends Record<string, any> {
	id: string;
	title: string;
	createdAt: Date;
	userId: string;
	path: string;
	messages: Message[];
	sharePath?: string;
}

export type ServerActionResult<Result> = Promise<
	| Result
	| {
			error: string;
	  }
>;

export interface Session {
	user: {
		id: string;
		email: string;
	};
}

export interface AuthResult {
	type: string;
	message: string;
}

export interface User extends Record<string, any> {
	id: string;
	email: string;
	password: string;
	salt: string;
}

export interface CapturedFile {
	file_url: string;
	file_name: string;
}

export interface CapturedDocument {
	doc_id: string;
	captured_document_id: string;
	query_ready: boolean;
	captured_files: CapturedFile[];
}

export interface Artefact {
	document_id: string;
	document_name: string;
	vanilla_links: string[];
	file_links: string[];
	files: string[];
	description: string;
	instruction: string;
	captured_documents: CapturedDocument[];
}

export interface UserArtifactsResponse {
	user_id: string;
	artefact_tree: Artefact[];
	shared_documents_owned: SharedDocumentOwned[];
	shared_artifacts_loaned: SharedDocumentLoaned[];
}

export interface SharedDocumentOwned {
	document_id: string;
	validity: string | null;
	accessor: number;
	public_access: boolean;
	access_open: boolean;
	shared_at: string;
}

export interface SharedDocumentLoaned {
	document_id: string;
	document_alias: string;
	description: string;
	validity: boolean;
}

export interface MarketArtifact {
	id: number;
	title: string;
	description: string;
	category: string;
	engagement: number;
	featured: boolean;
	image: string;
	resources: Resource[];
}

export interface Resource {
	name: string;
	sources: string;
}

export type CountryShortName = string; // Assuming CountryShortName is a string type

export interface SearchQuery {
	query: string;
	country?: CountryShortName;
	country_specific_search: boolean;
	search_type: 'strict' | 'medium' | 'open';
	file_type?: 'pdf' | 'docx';
	mix: boolean;
	results: number;
	before?: number;
	after?: number;
	site?: string;
}

export interface SearchResult {
	title: string;
	thumbnail: string;
	snippet: string;
	html_snippet: string;
	link: string;
}

export interface CreateWorker {
	user_id: string;
	document_id?: string;
	links?: string[];
	file?: File[];
	document_alias: string;
	description: string;
	config?: Record<string, any>[];
}

export type ManualDocumentFormData = {
	file: File | null;
	link: string;
	document_id: string;
	user_id: string;
	document_alias: string;
	description: string;
};

export interface QueryDocument {
	query: string;
	document_id: string;
	user_id: string;
	tag?: string;
}

export interface User {
	name: string;
	email: string;
	user_id: string;
}

export interface DeleteWorker {
	document_id: string;
	user_id: string;
}

export interface DeleteCapturedFile {
	captured_document_id: string;
	file_ids: string[];
}

export interface DeleteCapturedDocument {
	document_id: string;
	captured_document_id: string;
}

export interface CaptureHandwrittenDocumentResponse {
	message: string;
	user_id: string;
	document_id: string;
	captured_document_id: string;
	file_id: string;
	file_map: any; // You might want to define a more specific type for file_map
}

export interface CreateDocumentCapture extends CreateWorker {
	document_id: string;
}

export interface DocumentInfo {
	user_id: string;
	document_id: string;
	document_alias: string;
	description: string;
	instruction: string;
}

export interface ShareDocument {
	user_id: string;
	document_id: string;
	open_access: boolean;
	validity?: Date;
	accessor_emails?: string[];
}

export interface AcceptSharedDocument {
	email: string;
	share_id: string;
	user_id: string;
	verification_token: string;
	accept_time: Date;
}

export interface ValidityUpdate {
	user_id: string;
	document_id: string;
	updated_validity: Date;
	down_propagate: boolean;
}

export interface ScopedValidityUpdate extends ValidityUpdate {
	user_email: string;
}

export interface Access {
	document_id: string;
	user_id: string;
	access_change_reason: string;
	block_access: boolean;
}

export interface ScopedAccess extends Access {
	share_id: string;
	emails: string[];
}

export interface DocumentStatus {
	document_id: string;
	user_id: string;
}

export interface DocumentSharingRemoval {
	document_id: string;
	user_id: string;
	current_timestamp: Date;
}

export interface AccessorUpdate {
	share_id: string;
	document_id: string;
	user_id: string;
	accessor_email: string;
}

export interface SwitchShareType {
	share_id: string;
	document_id: string;
	user_id: string;
	current_timestamp: Date;
	validity?: Date;
}

export interface SharedDocumentSelection {
	user_id: string;
	current_timestamp: Date;
}

export interface Context {
	id: string | null;
	metadata: {
		chunkid: string;
		document_id: string;
		file_name: string;
		page: number;
		source: string;
		type: string;
		user_id: string;
	};
	page_content: string;
	type: string;
}
