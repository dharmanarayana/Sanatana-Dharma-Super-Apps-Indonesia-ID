import { Client, Databases, Query } from 'node-appwrite';
import videoData from '../../data/video-data.json';
import prayerData from '../../data/prayers.json';
import templeData from '../../data/temples.json';

export default defineEventHandler(async (event: any) => {
  const query = getQuery(event);
  const q = (query.q as string || '').toLowerCase().trim();
  
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
    // 1. Search Local JSON (Very useful for development and static content)
    const localResults: any[] = [];

    // Search Videos
    const matchedVideos = (videoData as any[]).filter(v => 
      v.title.toLowerCase().includes(q) || 
      (v.category && v.category.toLowerCase().includes(q))
    ).slice(0, 5).map(v => ({
      id: v.slug,
      title: v.title,
      subtitle: v.category || 'Video Dharma',
      type: 'video',
      icon: '🎬',
      link: `/video/${v.slug}`,
      image: v.thumbnail || v.image
    }));
    localResults.push(...matchedVideos);

    // Search Prayers
    const matchedPrayers = (prayerData as any[]).filter(p => 
      p.title.toLowerCase().includes(q)
    ).slice(0, 5).map(p => ({
      id: p.slug || p.id || p.title,
      title: p.title,
      subtitle: p.category_name || 'Doa & Mantra',
      type: 'doa',
      icon: '📜',
      link: `/doa-mantra/${p.slug || p.id || p.title}`,
      image: null
    }));
    localResults.push(...matchedPrayers);

    // Search Temples
    const matchedTemples = (templeData as any[]).filter(t => 
      t.name.toLowerCase().includes(q) || 
      (t.city && t.city.toLowerCase().includes(q)) ||
      (t.province && t.province.toLowerCase().includes(q))
    ).slice(0, 5).map(t => ({
      id: t.slug || t.id || t.name,
      title: t.name,
      subtitle: `${t.city || ''}, ${t.province || ''}`.replace(/^, /, ''),
      type: 'pura',
      icon: '🛕',
      link: `/pura/${t.slug || t.id || t.name}`,
      image: t.image
    }));
    localResults.push(...matchedTemples);

    // 2. Search Appwrite (Remote / Dynamic Content)
    const searchPromises = [
      // Berita
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
      }))).catch(() => []),

      // Dana Punia
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
      }))).catch(() => [])
    ];

    const remoteResults = await Promise.all(searchPromises);
    const flattenedRemoteResults = remoteResults.flat();

    // Combine results and remove duplicates if any (by link)
    const combinedResults = [...localResults, ...flattenedRemoteResults];
    const uniqueResults = combinedResults.filter((v, i, a) => a.findIndex(t => t.link === v.link) === i);

    return {
      query: q,
      total: uniqueResults.length,
      results: uniqueResults
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
