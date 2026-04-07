import type { DatabaseProvider } from '../data-service'

export class GasProvider implements DatabaseProvider {
  constructor(private gasUrl: string) {}

  private async request(method: 'GET' | 'POST', params: any, body?: any) {
    if (!this.gasUrl) throw new Error('GAS_WEBAPP_URL is not defined')
    
    const url = new URL(this.gasUrl)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    
    const options: RequestInit = {
      method,
      mode: 'cors',
      credentials: 'omit'
    }
    
    if (body) {
      options.body = JSON.stringify(body)
      options.headers = { 'Content-Type': 'application/json' }
    }

    const response = await fetch(url.toString(), options)
    if (!response.ok) throw new Error(`GAS request failed with status ${response.status}`)
    return await response.json()
  }

  // Helper to convert Appwrite Query to GAS filter params
  private parseQueries(queries: any[] = []) {
    const params: Record<string, string> = {}
    queries.forEach(q => {
      // Appwrite query looks like "equal('field', 'value')" or object
      // This is a naive implementation that supports basic equal()
      if (typeof q === 'string') {
          const match = q.match(/equal\("([^"]+)",\s*(?:"([^"]+)"|'([^']+)'|(\d+)|(true|false))\)/)
          if (match) {
            const field = match[1]
            const value = match[2] || match[3] || match[4] || match[5]
            params[`filter_${field}`] = String(value)
          }
      } else if (q && q.method === 'equal') {
          const field = q.attribute
          const value = Array.isArray(q.values) ? q.values[0] : q.values
          params[`filter_${field}`] = String(value)
      }
    })
    return params
  }

  async listDocuments(databaseId: string, collectionId: string, queries?: any[]) {
    const params = { action: 'list', collection: collectionId, ...this.parseQueries(queries) }
    return await this.request('GET', params)
  }

  async getDocument(databaseId: string, collectionId: string, documentId: string) {
    const params = { action: 'get', collection: collectionId, id: documentId }
    return await this.request('GET', params)
  }

  async createDocument(databaseId: string, collectionId: string, documentId: string, data: any) {
    const body = { action: 'create', collection: collectionId, id: documentId, data }
    return await this.request('POST', {}, body)
  }

  async updateDocument(databaseId: string, collectionId: string, documentId: string, data: any) {
    const body = { action: 'update', collection: collectionId, id: documentId, data }
    return await this.request('POST', {}, body)
  }

  async deleteDocument(databaseId: string, collectionId: string, documentId: string) {
    const body = { action: 'delete', collection: collectionId, id: documentId }
    return await this.request('POST', {}, body)
  }

  // Auth Methods
  async authenticate(email: string, password: string) {
    const body = { action: 'AUTH', data: { email, password } }
    return await this.request('POST', {}, body)
  }

  async registerUser(userId: string, email: string, password: string, name: string) {
    const body = { action: 'SIGNUP', data: { userId, email, password, name } }
    return await this.request('POST', {}, body)
  }
}
