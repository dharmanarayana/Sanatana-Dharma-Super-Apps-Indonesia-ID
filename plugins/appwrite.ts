import { Client, Account, Databases, Storage, Functions, Messaging } from 'appwrite'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Appwrite Web SDK (universal-ready in newer versions)
  // On the server, this will work for basic data fetching for SEO
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint as string)
    .setProject(config.public.appwriteProjectId as string)

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
