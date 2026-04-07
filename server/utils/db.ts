import { Client, Databases } from 'node-appwrite'
import { AppwriteProvider } from '../../lib/providers/appwrite-provider'
import { GasProvider } from '../../lib/providers/gas-provider'
import { FailoverProvider } from '../../lib/providers/failover-provider'
import type { DatabaseProvider } from '../../lib/data-service'

let serverDbInstance: DatabaseProvider | null = null

export const useServerDb = () => {
  if (serverDbInstance) return serverDbInstance

  const config = useRuntimeConfig()
  
  // Appwrite Setup (Server-Side with API Key)
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint as string)
    .setProject(config.public.appwriteProjectId as string)
    .setKey(process.env.APPWRITE_API_KEY as string)

  const databases = new Databases(client)
  const appwriteProvider = new AppwriteProvider(databases as any)

  // GAS Setup
  const gasUrl = config.public.appwriteGasUrl as string
  const gasProvider = new GasProvider(gasUrl)

  // Failover Setup
  serverDbInstance = new FailoverProvider(appwriteProvider, gasProvider)
  
  return serverDbInstance
}
