const API_BASE_URL = 'http://localhost:5500/api/v1';

export enum ApiEndpoint {
  QUERY_DOCUMENT = API_BASE_URL + '/store/query-document',
  CREATE_DOCUMENT_SELECTION = API_BASE_URL + '/store/create-document-selection',
  SEARCH_GOOGLE= API_BASE_URL + '/store/search-query',
  MANUAL_DOCUMENT_UPLOAD = API_BASE_URL + '/store/manual-document-upload',
}

export enum DocumentId {
  SAMPLE_DOCUMENT_ID = '3a55090b8e8d40f7bc5017367e9c2c3f'
}