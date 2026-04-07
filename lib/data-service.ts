/**
 * Common interface for Database Providers.
 * This allows the app to switch between Appwrite and Google Sheets seamlessly.
 */
export interface DatabaseProvider {
  listDocuments(databaseId: string, collectionId: string, queries?: any[]): Promise<any>;
  getDocument(databaseId: string, collectionId: string, documentId: string): Promise<any>;
  createDocument(databaseId: string, collectionId: string, documentId: string, data: any): Promise<any>;
  updateDocument(databaseId: string, collectionId: string, documentId: string, data: any): Promise<any>;
  deleteDocument(databaseId: string, collectionId: string, documentId: string): Promise<any>;
  
  // Auth Failover Methods
  authenticate(email: string, password: string): Promise<any>;
  registerUser(userId: string, email: string, password: string, name: string): Promise<any>;
}

export type DataService = DatabaseProvider;
