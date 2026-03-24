// composables/usePunia.ts
export const usePunia = () => {
    const { $appwrite } = useNuxtApp()
    const DB_ID = 'sanatana-dharma-db'
    const COLL_CAMPAIGNS = 'punia_campaigns'
    const COLL_DONATIONS = 'punia_donations'
    
    const campaigns = useState<any[]>('punia-campaigns', () => [])
    const loading = useState<boolean>('punia-loading', () => false)
    
    let unsubscribe: (() => void) | null = null

    const fetchCampaigns = async () => {
        loading.value = true
        try {
            const res = await $appwrite.databases.listDocuments(DB_ID, COLL_CAMPAIGNS)
            campaigns.value = res.documents
        } catch (e: any) {
            console.error('Error fetching dana punia campaigns:', e.message)
        } finally {
            loading.value = false
        }
    }

    const fetchCampaignById = async (id: string) => {
        try {
            return await $appwrite.databases.getDocument(DB_ID, COLL_CAMPAIGNS, id)
        } catch (e: any) {
            console.error(`Error fetching campaign ${id}:`, e.message)
            return null
        }
    }

    const subscribe = () => {
        if (unsubscribe) return

        const channel = `databases.${DB_ID}.collections.${COLL_CAMPAIGNS}.documents`
        
        unsubscribe = $appwrite.client.subscribe(channel, (response: any) => {
            const events = response.events || []
            const payload = response.payload
            
            if (events.some((e: string) => e.includes('.create'))) {
                campaigns.value = [payload, ...campaigns.value]
            } else if (events.some((e: string) => e.includes('.update'))) {
                const idx = campaigns.value.findIndex(v => v.$id === payload.$id)
                if (idx !== -1) {
                    campaigns.value[idx] = payload
                }
            } else if (events.some((e: string) => e.includes('.delete'))) {
                campaigns.value = campaigns.value.filter(v => v.$id !== payload.$id)
            }
        })
    }

    const fetchRecentDonations = async (campaignId: string, limit = 5) => {
        try {
            const res = await $appwrite.databases.listDocuments(DB_ID, COLL_DONATIONS, [
                useAppwriteQuery().equal('campaign_id', campaignId),
                useAppwriteQuery().equal('status', 'success'),
                useAppwriteQuery().orderDesc('$createdAt'),
                useAppwriteQuery().limit(limit)
            ])
            return res.documents
        } catch (e: any) {
            console.error('Error fetching donations:', e.message)
            return []
        }
    }

    const stop = () => {
        if (unsubscribe) {
            unsubscribe()
            unsubscribe = null
        }
    }

    return {
        campaigns,
        loading,
        fetchCampaigns,
        fetchCampaignById,
        fetchRecentDonations,
        subscribe,
        stop
    }
}
