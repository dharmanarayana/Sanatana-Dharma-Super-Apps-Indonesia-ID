import { Client, Account, Databases, Storage, Functions, Messaging } from 'appwrite'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (import.meta.client) {
    console.log('--- 🔧 Appwrite Client Configuration Check ---')
    console.log('Endpoint:', config.public.appwriteEndpoint)
    console.log('Project ID:', config.public.appwriteProjectId || 'MISSING ❌')
    
    if (!config.public.appwriteProjectId) {
      console.error('CRITICAL: Appwrite Project ID is not set in environment variables! Login will fail.')
    }
  }

  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)

  const account = new Account(client)
  const databases = new Databases(client)
  const storage = new Storage(client)
  const functions = new Functions(client)
  const messaging = new Messaging(client)

  return {
    provide: {
      appwrite: { client, account, databases, storage, functions, messaging }
    }
  }
})
