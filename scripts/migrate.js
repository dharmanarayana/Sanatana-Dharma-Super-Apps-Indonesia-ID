import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client()
    .setEndpoint(process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

// Update this with your DB ID or it will create a new one
const DATABASE_ID = 'sanatana-dharma-db'; 

async function setup() {
    try {
        console.log('🚀 Starting Appwrite Migration (ESM)...');

        // 1. Create Database
        try {
            await databases.create(DATABASE_ID, 'Sanatana Dharma Digital');
            console.log('✅ Database created');
        } catch (e) {
            console.log('ℹ️ Database already exists');
        }

        // 2. Rituals Collection (Streak & History)
        await createCollection('rituals', 'Ritual History', [
            { key: 'userId', type: 'string', size: 255, required: true },
            { key: 'type', type: 'string', size: 50, required: true },
            { key: 'completedAt', type: 'datetime', required: true },
            { key: 'streak', type: 'integer', required: false, min: 0 }
        ], [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
        ]);

        // 3. Prayers Collection
        await createCollection('prayers', 'Prayers & Mantras', [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'slug', type: 'string', size: 255, required: false },
            { key: 'category', type: 'string', size: 50, required: true },
            { key: 'content', type: 'string', size: 5000, required: true },
            { key: 'transliteration', type: 'string', size: 5000, required: false },
            { key: 'audioUrl', type: 'string', size: 255, required: false }
        ], [Permission.read(Role.any())]);

        // 4. Holy Books Collection
        await createCollection('holy_books', 'Holy Books', [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'category', type: 'string', size: 50, required: true },
            { key: 'description', type: 'string', size: 1000, required: false },
            { key: 'coverImage', type: 'string', size: 255, required: false }
        ], [Permission.read(Role.any())]);

        // 5. Donations Collection
        await createCollection('donations', 'Donation Programs', [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'category', type: 'string', size: 50, required: true },
            { key: 'target', type: 'integer', required: true },
            { key: 'collected', type: 'integer', required: true, default: 0 },
            { key: 'image', type: 'string', size: 255, required: false },
            { key: 'qrisImage', type: 'string', size: 255, required: false },
            { key: 'bank1', type: 'string', size: 100, required: false },
            { key: 'accountName1', type: 'string', size: 255, required: false },
            { key: 'accountNumber1', type: 'string', size: 100, required: false },
            { key: 'bank2', type: 'string', size: 100, required: false },
            { key: 'accountName2', type: 'string', size: 255, required: false },
            { key: 'accountNumber2', type: 'string', size: 100, required: false },
            { key: 'bank3', type: 'string', size: 100, required: false },
            { key: 'accountName3', type: 'string', size: 255, required: false },
            { key: 'accountNumber3', type: 'string', size: 100, required: false }
        ]);

        // 6. User Profiles Collection (for theme prefs, etc.)
        await createCollection('users_profile', 'User Profiles', [
            { key: 'userId', type: 'string', size: 255, required: true },
            { key: 'preferred_theme', type: 'string', size: 20, required: false, default: 'system' },
            { key: 'points', type: 'integer', required: false, default: 0 },
            { key: 'avatarId', type: 'string', size: 255, required: false }
        ], [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
        ]);

        // 7. Forum Posts Collection
        await createCollection('posts', 'Forum Posts', [
            { key: 'userId', type: 'string', size: 255, required: true },
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'content', type: 'string', size: 10000, required: true },
            { key: 'category', type: 'string', size: 50, required: true },
            { key: 'createdAt', type: 'datetime', required: true }
        ]);

        // 8. Videos Collection
        await createCollection('videos', 'Videos', [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'url', type: 'string', size: 255, required: true },
            { key: 'slug', type: 'string', size: 255, required: true },
            { key: 'thumbnail', type: 'string', size: 255, required: false },
            { key: 'category', type: 'string', size: 50, required: true },
            { key: 'description', type: 'string', size: 1000, required: false }
        ], [Permission.read(Role.any())]);

        // 9. E-Library Collection
        await createCollection('elibrary', 'E-Library', [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'author', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 1000, required: false },
            { key: 'fileUrl', type: 'string', size: 255, required: true },
            { key: 'coverImage', type: 'string', size: 255, required: false },
            { key: 'category', type: 'string', size: 50, required: true }
        ]);

        // 10. News Collection
        await createCollection('news', 'Berita', [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'content', type: 'string', size: 10000, required: true },
            { key: 'author', type: 'string', size: 255, required: true },
            { key: 'image', type: 'string', size: 255, required: false },
            { key: 'category', type: 'string', size: 50, required: true },
            { key: 'publishedAt', type: 'datetime', required: true }
        ], [Permission.read(Role.any())]);

        // 11. Temples Collection
        await createCollection('temples', 'Direktori Pura', [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'address', type: 'string', size: 500, required: false },
            { key: 'city', type: 'string', size: 255, required: false },
            { key: 'province', type: 'string', size: 255, required: false },
            { key: 'description', type: 'string', size: 2000, required: false },
            { key: 'image', type: 'string', size: 255, required: false },
            { key: 'history', type: 'string', size: 5000, required: false }
        ], [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]);

        // 12. Tri Sandhya Collection
        await createCollection('trisandhya', 'Tri Sandhya Content', [
            { key: 'verse', type: 'integer', required: true },
            { key: 'content', type: 'string', size: 1000, required: true },
            { key: 'translation', type: 'string', size: 1000, required: true },
            { key: 'audioUrl', type: 'string', size: 255, required: false }
        ], [Permission.read(Role.any())]);

        // 13. Sarana Upacara Collection
        await createCollection('sarana_upacara', 'Sarana Upacara', [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'category', type: 'string', size: 50, required: true },
            { key: 'price', type: 'integer', required: true },
            { key: 'location', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 5000, required: true },
            { key: 'image', type: 'string', size: 255, required: false },
            { key: 'icon', type: 'string', size: 50, required: false }
        ], [Permission.read(Role.any())]);

        console.log('🏁 Migration Completed Successfully!');
    } catch (error) {
        console.error('❌ Migration Failed:', error.message);
    }
}

async function createCollection(id, name, attributes, permissions = []) {
    try {
        await databases.createCollection(DATABASE_ID, id, name, permissions);
        console.log(`✅ Collection "${name}" created with permissions`);

        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(DATABASE_ID, id, attr.key, attr.size, attr.required, attr.default);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(DATABASE_ID, id, attr.key, attr.required, attr.min, attr.max, attr.default);
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(DATABASE_ID, id, attr.key, attr.required, attr.default);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(DATABASE_ID, id, attr.key, attr.required, attr.default);
                }
                console.log(`   🔸 Attribute "${attr.key}" added`);
            } catch (err) {
                console.log(`   ⚠️ Attribute "${attr.key}" skip/error: ${err.message}`);
            }
        }
    } catch (e) {
        console.log(`ℹ️ Collection "${name}" already exists, updating permissions...`);
        try {
            await databases.updateCollection(DATABASE_ID, id, name, permissions);
            console.log(`   ✅ Permissions updated for "${name}"`);
        } catch (updateErr) {
            console.warn(`   ⚠️ Could not update permissions for "${name}": ${updateErr.message}`);
        }
    }
}

setup();
