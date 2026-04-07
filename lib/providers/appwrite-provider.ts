import type { Databases, Account } from 'appwrite'
import type { DatabaseProvider } from '../data-service'

export class AppwriteProvider implements DatabaseProvider {
  constructor(private databases: Databases, private account: Account) {}

  async listDocuments(databaseId: string, collectionId: string, queries?: any[]) {
    return await this.databases.listDocuments(databaseId, collectionId, queries)
  }

  async getDocument(databaseId: string, collectionId: string, documentId: string) {
    return await this.databases.getDocument(databaseId, collectionId, documentId)
  }

  async createDocument(databaseId: string, collectionId: string, documentId: string, data: any) {
    return await this.databases.createDocument(databaseId, collectionId, documentId, data)
  }

  async updateDocument(databaseId: string, collectionId: string, documentId: string, data: any) {
    return await this.databases.updateDocument(databaseId, collectionId, documentId, data)
  }

  async deleteDocument(databaseId: string, collectionId: string, documentId: string) {
    return await this.databases.deleteDocument(databaseId, collectionId, documentId)
  }

  // Auth Methods
  async authenticate(email: string, password: string) {
    await this.account.createEmailPasswordSession(email, password)
    return await this.account.get()
  }

  async registerUser(userId: string, email: string, password: string, name: string) {
    return await this.account.create(userId, email, password, name)
  }
}
