import { Client, Databases, Query } from 'node-appwrite';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const q = (query.q as string || '').trim();
  
  if (!q || q.length < 2) {
    return { results: [] };
  }

  const config = useRuntimeConfig();
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint as string)
    .setProject(config.public.appwriteProjectId as string)
    .setKey(process.env.APPWRITE_API_KEY as string);

  const databases = new Databases(client);
  const DB_ID = 'sanatana-dharma-db';

  try {
    const searchPromises = [
      // 1. Berita & Informasi
      databases.listDocuments(DB_ID, 'news', [
        Query.or([
          Query.search('title', q),
          Query.search('content', q)
        ]),
        Query.limit(5)
      ]).then(res => res.documents.map(doc => ({
        id: doc.$id,
        title: doc.title,
        subtitle: doc.category || 'Berita',
        type: 'news',
        icon: '📰',
        link: `/berita/${doc.$id}`,
        image: doc.image
      }))).catch(err => {
        console.error('Search News Error:', err.message);
        return [];
      }),

      // 2. Dana Punia / Campaigns
      databases.listDocuments(DB_ID, 'campaigns', [
        Query.or([
          Query.search('name', q),
          Query.search('description', q)
        ]),
        Query.limit(5)
      ]).then(res => res.documents.map(doc => ({
        id: doc.$id,
        title: doc.name,
        subtitle: doc.category || 'Punia',
        type: 'punia',
        icon: '🙏',
        link: `/punia/${doc.$id}`,
        image: doc.image
      }))).catch(err => {
        console.error('Search Campaigns Error:', err.message);
        return [];
      }),

      // 3. Doa & Mantra
      databases.listDocuments(DB_ID, 'prayers', [
        Query.search('title', q),
        Query.limit(5)
      ]).then(res => res.documents.map(doc => ({
        id: doc.$id,
        title: doc.title,
        subtitle: doc.category_name || 'Doa & Mantra',
        type: 'doa',
        icon: '📜',
        link: `/doa-mantra/${doc.slug || doc.$id}`,
        image: null
      }))).catch(err => {
        console.error('Search Prayers Error:', err.message);
        return [];
      }),

      // 4. Pura & Tempat Suci
      databases.listDocuments(DB_ID, 'temples', [
        Query.or([
          Query.search('name', q),
          Query.search('city', q),
          Query.search('province', q)
        ]),
        Query.limit(5)
      ]).then(res => res.documents.map(doc => ({
        id: doc.$id,
        title: doc.name,
        subtitle: `${doc.city || ''}, ${doc.province || ''}`.replace(/^, /, ''),
        type: 'pura',
        icon: '🛕',
        link: `/pura/${doc.slug || doc.$id}`,
        image: doc.image
      }))).catch(err => {
        console.error('Search Temples Error:', err.message);
        return [];
      })
    ];

    const results = await Promise.all(searchPromises);
    const flattenedResults = results.flat();

    return {
      query: q,
      total: flattenedResults.length,
      results: flattenedResults
    };
  } catch (error: any) {
    console.error('Global Search API Error:', error);
    return {
      success: false,
      error: error.message,
      results: []
    };
  }
});
