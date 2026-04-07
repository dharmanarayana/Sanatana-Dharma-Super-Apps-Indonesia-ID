import type { DatabaseProvider } from '../data-service'

export class FailoverProvider implements DatabaseProvider {
  private isFailoverMode = false
  private retryAfter = 60000 // 1 minute
  private lastFailTime = 0

  constructor(
    private primary: DatabaseProvider,
    private secondary: DatabaseProvider
  ) {}

  private async execute<T>(fn: (provider: DatabaseProvider) => Promise<T>, label: string): Promise<T> {
    const now = Date.now()
    
    // Check if we should try primary again
    if (this.isFailoverMode && now - this.lastFailTime > this.retryAfter) {
      console.log('🔄 Attempting to switch back to Primary database...')
      this.isFailoverMode = false
    }

    if (!this.isFailoverMode) {
      try {
        return await fn(this.primary)
      } catch (err: any) {
          // Detect if error is a connection failure or server error (500+)
          const status = err.code || err.status
          const isNetwork = err.message?.includes('fetch') || err.message?.includes('Network') || err.message?.includes('timeout')
          
          if (isNetwork || (status >= 500)) {
            console.warn(`🚨 Primary Database [${label}] Error:`, err.message)
            console.warn('⚠️ Switching to Failover Database (Google Sheets)...')
            this.isFailoverMode = true
            this.lastFailTime = Date.now()
            return await fn(this.secondary)
          }
          // For other errors (400, 401, 403, 404), rethrow as they are logic/auth errors
          throw err
      }
    }

    // Already in failover mode
    try {
      return await fn(this.secondary)
    } catch (err: any) {
      console.error(`❌ Failover Database [${label}] Error:`, err.message)
      throw err
    }
  }

  async listDocuments(databaseId: string, collectionId: string, queries?: any[]) {
    return this.execute(p => p.listDocuments(databaseId, collectionId, queries), 'listDocuments')
  }

  async getDocument(databaseId: string, collectionId: string, documentId: string) {
    return this.execute(p => p.getDocument(databaseId, collectionId, documentId), 'getDocument')
  }

  async createDocument(databaseId: string, collectionId: string, documentId: string, data: any) {
    return this.execute(p => p.createDocument(databaseId, collectionId, documentId, data), 'createDocument')
  }

  async updateDocument(databaseId: string, collectionId: string, documentId: string, data: any) {
    return this.execute(p => p.updateDocument(databaseId, collectionId, documentId, data), 'updateDocument')
  }

  async deleteDocument(databaseId: string, collectionId: string, documentId: string) {
    return this.execute(p => p.deleteDocument(databaseId, collectionId, documentId), 'deleteDocument')
  }

  // Auth Methods
  async authenticate(email: string, password: string) {
    return this.execute(p => p.authenticate(email, password), 'authenticate')
  }

  async registerUser(userId: string, email: string, password: string, name: string) {
    return this.execute(p => p.registerUser(userId, email, password, name), 'registerUser')
  }
}
