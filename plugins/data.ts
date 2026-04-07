import { AppwriteProvider } from '../lib/providers/appwrite-provider'
import { GasProvider } from '../lib/providers/gas-provider'
import { FailoverProvider } from '../lib/providers/failover-provider'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const { $appwrite } = nuxtApp as any

  // 1. Initialize Providers
  const appwriteProvider = new AppwriteProvider($appwrite.databases, $appwrite.account)
  const gasProvider = new GasProvider((config.public as any).appwriteGasUrl)

  // 2. Initialize Failover Manager
  const db = new FailoverProvider(appwriteProvider, gasProvider)

  return {
    provide: {
      db
    }
  }
})
