import { CoreMessage } from 'ai'

export type Message = CoreMessage & {
  id: string
}

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
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

export interface Artifact {
  document_id: string;
  document_name: string;
  vanilla_links: string[];
  file_links: string[];
  files: string[];
  description: string;
  captured_documents: CapturedDocument[];
}

export interface UserArtifactsResponse {
  user_id: string;
  artefact_tree: Artifact[];
}
