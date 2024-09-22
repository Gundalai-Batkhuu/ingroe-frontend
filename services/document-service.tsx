import { ApiEndpoint } from '@/services/api_endpoints'
import {
  AcceptSharedDocument,
  Access,
  AccessorUpdate,
  CreateDocument,
  CreateDocumentCapture,
  DeleteCapturedDocument,
  DeleteCapturedFile,
  DeleteDocument,
  DocumentInfo,
  DocumentSharingRemoval,
  DocumentStatus,
  QueryDocument,
  ScopedAccess,
  ScopedValidityUpdate,
  SearchQuery,
  SharedDocumentSelection,
  ShareDocument,
  SwitchShareType,
  ValidityUpdate
} from '@/lib/types'

export const documentService = {
  // Document Creation and Management
  async createDocumentSelection(document: CreateDocument): Promise<any> {
    return await fetchApi(
      ApiEndpoint.CREATE_DOCUMENT_SELECTION,
      'POST',
      document
    )
  },

  async createDocumentManually(formData: FormData): Promise<any> {
    return await fetchApi(
      ApiEndpoint.CREATE_DOCUMENT_MANUALLY,
      'POST',
      formData,
      false
    )
  },

  async updateDocumentInfo(payload: DocumentInfo): Promise<any> {
    return await fetchApi(ApiEndpoint.UPDATE_DOCUMENT_INFO, 'PATCH', payload)
  },

  async deleteDocument(payload: DeleteDocument): Promise<any> {
    return await fetchApi(ApiEndpoint.DELETE_DOCUMENT, 'DELETE', payload)
  },

  async searchDocuments(query: SearchQuery): Promise<any> {
    try {
      const response = await fetch(ApiEndpoint.SEARCH_GOOGLE, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return await response.json()
    } catch (error) {
      console.error('Error during search:', error)
    }
  },

  async queryDocument(query: QueryDocument): Promise<any> {
    return await fetchApi(ApiEndpoint.QUERY_DOCUMENT, 'POST', query)
  },

  async queryDocumentQuick(query: QueryDocument): Promise<any> {
    return await fetchApi(ApiEndpoint.QUERY_DOCUMENT_QUICK, 'POST', query)
  },

  // Handwritten Document Capture
  async captureHandwrittenDocument(formData: FormData): Promise<any> {
    const response = await fetch(ApiEndpoint.CAPTURE_HANDWRITTEN_DOCUMENT, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.detail || 'An error occurred while uploading the document'
      )
    }

    return response.json()
  },

  async updateCaptureDocument(formData: FormData): Promise<any> {
    return await fetchApi(
      ApiEndpoint.UPDATE_CAPTURED_DOCUMENT,
      'PATCH',
      formData,
      false
    )
  },

  async deleteCapturedFile(payload: DeleteCapturedFile): Promise<any> {
    return await fetchApi(ApiEndpoint.DELETE_CAPTURED_FILE, 'DELETE', payload)
  },

  async deleteCapturedDocument(payload: DeleteCapturedDocument): Promise<any> {
    return await fetchApi(
      ApiEndpoint.DELETE_CAPTURED_DOCUMENT,
      'DELETE',
      payload
    )
  },

  async createDocumentFromCapturedDocument(
    payload: CreateDocumentCapture
  ): Promise<any> {
    return await fetchApi(
      ApiEndpoint.CREATE_DOCUMENT_FROM_CAPTURED_DOCUMENT,
      'POST',
      payload
    )
  },

  // Document Sharing and Access Control
  async shareDocument(payload: ShareDocument): Promise<any> {
    return await fetchApi(ApiEndpoint.SHARE_DOCUMENT, 'POST', payload)
  },

  async acceptSharedDocument(payload: AcceptSharedDocument): Promise<any> {
    return await fetchApi(ApiEndpoint.ACCEPT_SHARED_DOCUMENT, 'POST', payload)
  },

  async changeDocumentValidity(payload: ValidityUpdate): Promise<any> {
    return await fetchApi(
      ApiEndpoint.CHANGE_DOCUMENT_VALIDITY,
      'PATCH',
      payload
    )
  },

  async changeDocumentValidityForUser(
    payload: ScopedValidityUpdate
  ): Promise<any> {
    return await fetchApi(
      ApiEndpoint.CHANGE_DOCUMENT_VALIDITY_FOR_USER,
      'PATCH',
      payload
    )
  },

  async blockDocumentAccess(payload: Access): Promise<any> {
    return await fetchApi(ApiEndpoint.BLOCK_DOCUMENT_ACCESS, 'PATCH', payload)
  },

  async blockDocumentAccessForUser(payload: ScopedAccess): Promise<any> {
    return await fetchApi(
      ApiEndpoint.BLOCK_DOCUMENT_ACCESS_FOR_USER,
      'PATCH',
      payload
    )
  },

  async removeShareState(payload: DocumentSharingRemoval): Promise<any> {
    return await fetchApi(ApiEndpoint.REMOVE_SHARE_STATE, 'DELETE', payload)
  },

  async removeSharedDocumentByUser(payload: DocumentStatus): Promise<any> {
    return await fetchApi(
      ApiEndpoint.REMOVE_SHARED_DOCUMENT_BY_USER,
      'DELETE',
      payload
    )
  },

  async addNewAccessor(payload: AccessorUpdate): Promise<any> {
    return await fetchApi(ApiEndpoint.ADD_NEW_ACCESSOR, 'POST', payload)
  },

  async shareDocumentToPublic(payload: SwitchShareType): Promise<any> {
    return await fetchApi(
      ApiEndpoint.SHARE_DOCUMENT_TO_PUBLIC,
      'PATCH',
      payload
    )
  },

  async removeAllExpiredDocuments(
    payload: SharedDocumentSelection
  ): Promise<any> {
    return await fetchApi(
      ApiEndpoint.REMOVE_ALL_EXPIRED_DOCUMENTS,
      'DELETE',
      payload
    )
  }
}

async function fetchApi(
  url: string,
  method: string,
  data: any,
  isJson: boolean = true
): Promise<any> {
  try {
    const headers: HeadersInit = {
      Accept: 'application/json'
    }

    if (isJson) {
      headers['Content-Type'] = 'application/json'
    }

    const body = isJson ? JSON.stringify(data) : data

    console.log('Fetching API:', url, method, body)

    const response = await fetch(url, {
      method,
      headers,
      body
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return await response.json()
  } catch (error) {
    console.error(`Error during API call to ${url}:`, error)
    throw error
  }
}
