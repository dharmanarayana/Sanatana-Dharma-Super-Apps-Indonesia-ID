import { Client, Databases, Query } from 'node-appwrite';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  // 1. Verify Midtrans Signature
  const { order_id, status_code, gross_amount, signature_key, transaction_status } = body;
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  
  const hash = crypto.createHash('sha512')
    .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    .digest('hex');

  if (hash !== signature_key) {
    console.warn('Invalid Midtrans Signature');
    return { status: 'error', message: 'Invalid signature' };
  }

  // 2. Initialize Appwrite
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const DB_ID = 'sanatana-dharma-db';
  const COLL_DONATIONS = 'punia_donations';
  const COLL_CAMPAIGNS = 'punia_campaigns';

  try {
    // 3. Find the donation record
    const donationRes = await databases.listDocuments(DB_ID, COLL_DONATIONS, [
      Query.equal('order_id', order_id)
    ]);

    if (donationRes.total === 0) {
      return { status: 'error', message: 'Donation not found' };
    }

    const donation = donationRes.documents[0];
    let newStatus = 'pending';

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      newStatus = 'success';
    } else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
      newStatus = 'failed';
    }

    // 4. Update status if changed
    if (donation.status !== newStatus) {
      await databases.updateDocument(DB_ID, COLL_DONATIONS, donation.$id, {
        status: newStatus
      });

      // 5. If success, increment campaign amount
      if (newStatus === 'success') {
        const campaign = await databases.getDocument(DB_ID, COLL_CAMPAIGNS, donation.campaign_id);
        const updatedAmount = (campaign.current_amount || 0) + donation.amount;
        
        await databases.updateDocument(DB_ID, COLL_CAMPAIGNS, campaign.$id, {
          current_amount: updatedAmount
        });
      }
    }

    return { status: 'ok' };
  } catch (error: any) {
    console.error('Midtrans Webhook Error:', error);
    return { status: 'error', message: error.message };
  }
});
