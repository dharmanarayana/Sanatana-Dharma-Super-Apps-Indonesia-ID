import midtransClient from 'midtrans-client';
import { Client, Databases, ID } from 'node-appwrite';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { campaignId, amount, userName, userEmail } = body;

  const config = useRuntimeConfig();
  
  // 1. Initialize Midtrans Snap
  const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
  });

  // 2. Initialize Appwrite
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const DB_ID = 'sanatana-dharma-db';
  const COLL_DONATIONS = 'punia_donations';

  const orderId = `PUNIA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    // 3. Create pending donation record in Appwrite
    const donation = await databases.createDocument(
      DB_ID,
      COLL_DONATIONS,
      ID.unique(),
      {
        campaign_id: campaignId,
        user_name: userName || 'Hamba Tuhan',
        amount: parseInt(amount),
        status: 'pending',
        order_id: orderId
      }
    );

    // 4. Create Midtrans Transaction
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: parseInt(amount)
      },
      customer_details: {
        first_name: userName || 'Hamba Tuhan',
        email: userEmail || ''
      },
      item_details: [{
        id: campaignId,
        price: parseInt(amount),
        quantity: 1,
        name: 'Dana Punia'
      }]
    };

    const transaction = await snap.createTransaction(parameter);
    
    // 5. Update donation with snap token
    await databases.updateDocument(DB_ID, COLL_DONATIONS, donation.$id, {
      snap_token: transaction.token
    });

    return {
      token: transaction.token,
      orderId: orderId
    };
  } catch (error: any) {
    console.error('Midtrans Snap Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create payment token'
    });
  }
});
