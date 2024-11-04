import urljoin from 'url-join';

const API_BASE_URL = process.env.NEXT_PUBLIC_IS_LOCAL === 'true'
  ? process.env.NEXT_PUBLIC_LOCAL_API_URL
  : process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined. Check your environment variables.');
}


export const ApiEndpoint = {
  // Document Creation and Management
  CREATE_WORKER: urljoin(API_BASE_URL, 'api', 'v2', 'store', 'create-document'),
  CREATE_DOCUMENT_MANUALLY: urljoin(API_BASE_URL, 'api', 'v1', 'store', 'create-document-manually'),
  UPDATE_DOCUMENT_INFO: urljoin(API_BASE_URL, 'api', 'v1', 'store', 'update-document-info'),
  DELETE_DOCUMENT: urljoin(API_BASE_URL, 'api', 'v1', 'store', 'delete-document'),
  DELETE_ARTIFACTS_FROM_DOCUMENT: urljoin(API_BASE_URL, 'api', 'v1', 'store', 'delete-artifacts-from-document'),

  // Document Querying and Search
  SEARCH_GOOGLE: urljoin(API_BASE_URL, 'api', 'v1', 'store', 'search-query'),
  QUERY_DOCUMENT: urljoin(API_BASE_URL, 'api', 'v2', 'store', 'query-document'),
  QUERY_DOCUMENT_QUICK: urljoin(API_BASE_URL, 'api', 'v1', 'store', 'query-document-quick'),

  // Handwritten Document Capture
  CAPTURE_DOCUMENT: urljoin(API_BASE_URL, 'api', 'v1', 'store', 'capture-document'),
  UPDATE_CAPTURED_DOCUMENT: urljoin(API_BASE_URL, 'api', 'v1', 'store', 'update-captured-document'),
  DELETE_CAPTURED_FILE: urljoin(API_BASE_URL, 'api', 'v1', 'store', 'delete-captured-file'),
  DELETE_CAPTURED_DOCUMENT: urljoin(API_BASE_URL, 'api', 'v1', 'store', 'delete-captured-document'),
  CREATE_WORKER_FROM_CAPTURED_DOCUMENT: urljoin(API_BASE_URL, 'api', 'v1', 'store', 'create-document-from-captured-document'),

  // Document Sharing and Access Control
  SHARE_DOCUMENT: urljoin(API_BASE_URL, 'api', 'v1', 'handle', 'share-document'),
  ACCEPT_SHARED_DOCUMENT: urljoin(API_BASE_URL, 'api', 'v1', 'handle', 'accept-shared-document'),
  CHANGE_DOCUMENT_VALIDITY: urljoin(API_BASE_URL, 'api', 'v1', 'handle', 'change-document-validity'),
  CHANGE_DOCUMENT_VALIDITY_FOR_USER: urljoin(API_BASE_URL, 'api', 'v1', 'handle', 'change-document-validity-for-user'),
  BLOCK_DOCUMENT_ACCESS: urljoin(API_BASE_URL, 'api', 'v1', 'handle', 'block-document-access'),
  BLOCK_DOCUMENT_ACCESS_FOR_USER: urljoin(API_BASE_URL, 'api', 'v1', 'handle', 'block-document-access-for-user'),
  REMOVE_SHARE_STATE: urljoin(API_BASE_URL, 'api', 'v1', 'handle', 'remove-share-state'),
  REMOVE_SHARED_DOCUMENT_BY_USER: urljoin(API_BASE_URL, 'api', 'v1', 'handle', 'remove-shared-document-by-sharee'),
  ADD_NEW_ACCESSOR: urljoin(API_BASE_URL, 'api', 'v1', 'handle', 'add-new-accessor'),
  SHARE_DOCUMENT_TO_PUBLIC: urljoin(API_BASE_URL, 'api', 'v1', 'handle', 'allow-public-access'),
  REMOVE_ALL_EXPIRED_DOCUMENTS: urljoin(API_BASE_URL, 'api', 'v1', 'handle', 'remove-all-expired-documents'),

  // API Key Management
  CREATE_API_KEY: urljoin(API_BASE_URL, 'api', 'v1', 'api-keys', 'create-api-key'),
  VALIDATE_API_KEY: urljoin(API_BASE_URL, 'api', 'v1', 'api-keys', 'validate-api-key'),

  // User Management
  CREATE_USER: urljoin(API_BASE_URL, 'api', 'v1', 'user', 'create'),
  GET_USER_ARTIFACTS: urljoin(API_BASE_URL, 'api', 'v1', 'user', 'get-user-artifacts'),
  GET_SHARED_DOCUMENT_STATE: urljoin(API_BASE_URL, 'api', 'v1', 'user', 'get-shared-document-state')
} as const;

export type ApiEndpoint = typeof ApiEndpoint[keyof typeof ApiEndpoint];