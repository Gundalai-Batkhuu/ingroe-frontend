const API_BASE_URL = 'http://localhost:5500/api/v1';

export enum ApiEndpoint {
  // Document Creation and Management
  CREATE_DOCUMENT_SELECTION = API_BASE_URL + '/store/create-document-selection',
  CREATE_DOCUMENT_MANUALLY = API_BASE_URL + '/store/create-document-manually',
  UPDATE_DOCUMENT_INFO = API_BASE_URL + '/store/update-document-info',
  DELETE_DOCUMENT = API_BASE_URL + '/store/delete-document',

  // Document Querying and Search
  SEARCH_GOOGLE = API_BASE_URL + '/store/search-query',
  QUERY_DOCUMENT = API_BASE_URL + '/store/query-document',
  QUERY_DOCUMENT_QUICK = API_BASE_URL + '/store/query-document-quick',

  // Handwritten Document Capture
  CAPTURE_HANDWRITTEN_DOCUMENT = API_BASE_URL + '/store/capture-document',
  UPDATE_CAPTURED_DOCUMENT = API_BASE_URL + '/store/update-captured-document',
  DELETE_CAPTURED_FILE = API_BASE_URL + '/store/delete-captured-file',
  DELETE_CAPTURED_DOCUMENT = API_BASE_URL + '/store/delete-captured-document',
  CREATE_DOCUMENT_FROM_CAPTURED_DOCUMENT = API_BASE_URL + '/store/create-document-from-captured-document',

  // Document Sharing and Access Control
  SHARE_DOCUMENT = API_BASE_URL + '/handle/share-document',
  ACCEPT_SHARED_DOCUMENT = API_BASE_URL + '/handle/accept-shared-document',
  CHANGE_DOCUMENT_VALIDITY = API_BASE_URL + '/handle/change-document-validity',
  CHANGE_DOCUMENT_VALIDITY_FOR_USER = API_BASE_URL + '/handle/change-document-validity-for-user',
  BLOCK_DOCUMENT_ACCESS = API_BASE_URL + '/handle/block-document-access',
  BLOCK_DOCUMENT_ACCESS_FOR_USER = API_BASE_URL + '/handle/block-document-access-for-user',
  REMOVE_SHARE_STATE = API_BASE_URL + '/handle/remove-share-state',
  REMOVE_SHARED_DOCUMENT_BY_USER = API_BASE_URL + '/handle/remove-shared-document-by-sharee',
  ADD_NEW_ACCESSOR = API_BASE_URL + '/handle/add-new-accessor',
  SHARE_DOCUMENT_TO_PUBLIC = API_BASE_URL + '/handle/allow-public-access',
  REMOVE_ALL_EXPIRED_DOCUMENTS = API_BASE_URL + '/handle/remove-all-expired-documents',

  // API Key Management
  CREATE_API_KEY = API_BASE_URL + '/api-keys/create-api-key',
  VALIDATE_API_KEY = API_BASE_URL + '/api-keys/validate-api-key',

  // User Management
  CREATE_USER = API_BASE_URL + '/user/create',
  GET_USER_ARTIFACTS = API_BASE_URL + '/user/get-user-artifacts',
  GET_SHARED_DOCUMENT_STATE = API_BASE_URL + '/user/get-shared-document-state'
}