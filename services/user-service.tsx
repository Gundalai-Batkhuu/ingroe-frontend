import urljoin from 'url-join';

const API_URL = process.env.NEXT_PUBLIC_IS_LOCAL === 'true'
  ? process.env.NEXT_PUBLIC_LOCAL_API_URL
  : process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('API_URL is not defined. Check your environment variables.');
}

const USER_API_BASE_URL = urljoin(API_URL, 'api', 'v1', 'user');

interface User {
  name: string;
  email: string;
  user_id: string;
}

interface DocumentStatus {
  user_id: string;
  document_id: string;
}

export const userService = {

  async createUser(userId: string, email: string): Promise<any> {
    try {
      const user: User = {
        name: 'user',
        email: email,
        user_id: userId
      };
      const response = await fetch(`${USER_API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating user in backend database:', error);
      throw error;
    }
  },

  async getUserArtifacts(userId: string): Promise<any> {
    try {
      const response = await fetch(`${USER_API_BASE_URL}/get-user-artifacts?user_id=${encodeURIComponent(userId)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting user artifacts:', error);
      throw error;
    }
  },

  async getSharedDocumentState(payload: DocumentStatus): Promise<any> {
    try {
      const params = new URLSearchParams({
        user_id: payload.user_id,
        document_id: payload.document_id,
      });
      const response = await fetch(`${USER_API_BASE_URL}/get-shared-document-state?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting shared document state:', error);
      throw error;
    }
  }


};

export default userService;