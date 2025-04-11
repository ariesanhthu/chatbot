import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Log the entire event for debugging
  console.log("Received Clerk webhook event:", JSON.stringify(evt, null, 2));

  // Only process if event type is "user.created" (or the type you expect)
  if (evt.type !== "user.created") {
    console.log(`Ignoring event type: ${evt.type}`);
    return new Response("Event type ignored", { status: 200 });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data
  const eventType = evt.type
  
  if (eventType === 'user.created') 
  {
    console.log('userId:', evt.data.id)
    
    const firstName = evt.data.first_name || "";
    const lastName = evt.data.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    // Log extracted fields for debugging
    console.log("Extracted Clerk data:", { fullName });

    console.log(evt.data.email_addresses[0].email_address);

    const { error: upsertError } = await supabase
    .from('users')
    .upsert(
      [
        {
          name: fullName,
          email: evt.data.email_addresses[0].email_address,
          status: "tốt",
        }
      ],
      { onConflict: 'id' }
    );
    if (upsertError) {
        console.error("Error upserting user:", upsertError);
        return new Response("Error upserting user", { status: 500 });
    }

  }
  
  return new Response('Webhook received', { status: 200 })
}