import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client()
    .setEndpoint(process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.NUXT_PUBLIC_APPWRITE_DATABASE_ID || 'sanatana-dharma-db';

const publicCollections = [
    'videos', 'news', 'prayers', 'holy_books', 
    'donations', 'elibrary', 'temples', 
    'trisandhya', 'sarana_upacara'
];

const privateCollections = [
    'rituals', 'users_profile', 'posts'
];

async function fixPermissions() {
    console.log('🔧 Fixing Appwrite Collection Permissions...');

    // Fix Public Read Collections
    for (const col of publicCollections) {
        try {
            await databases.updateCollection(DATABASE_ID, col, col.charAt(0).toUpperCase() + col.slice(1), [
                Permission.read(Role.any()),
            ]);
            console.log(`✅ ${col}: Set Public Read`);
        } catch (e) {
            console.error(`❌ ${col}: ${e.message}`);
        }
    }

    // Fix Authenticated Collections
    for (const col of privateCollections) {
        try {
            // For these, we allow users to read/create/update their own or all members depending on requirement
            // For now, let's allow all users (members) to read, but individuals to create/update
            // Actually, simpler for a starter app is member read/create
            await databases.updateCollection(DATABASE_ID, col, col.charAt(0).toUpperCase() + col.slice(1), [
                Permission.read(Role.users()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]);
            console.log(`✅ ${col}: Set Member Read/Write`);
        } catch (e) {
            console.error(`❌ ${col}: ${e.message}`);
        }
    }

    console.log('🏁 Done!');
}

fixPermissions();
