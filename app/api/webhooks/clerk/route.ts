// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

const webhookSecret: string = process.env.CLERK_WEBHOOK_SECRET || "";

async function handler(request: Request) {
  // Parse the request body as JSON
  const payload = await request.json();

  // Get the headers from the incoming request.
  const headersList = await headers();
  const heads = {
    "svix-id": headersList.get("svix-id") ?? "",
    "svix-timestamp": headersList.get("svix-timestamp") ?? "",
    "svix-signature": headersList.get("svix-signature") ?? "",
  };

  // Initialize Svix webhook verifier
  const wh = new Webhook(webhookSecret);
  let evt: any;
  try {
    // Verify the webhook signature and parse the payload
    evt = wh.verify(JSON.stringify(payload), heads);
  } catch (err: any) {
    console.error("Webhook verification failed:", err.message);
    return new Response("Error occurred", { status: 400 });
  }

  // Extract event type and data from the verified payload
  const eventType: string = evt.type;
  const { id, email_addresses, ...otherData } = evt.data || {};

  // --- Handle 'user.created' event ---
  if (eventType === "user.created") {
    // Validate essential data for user creation
    if (
      !id ||
      !Array.isArray(email_addresses) ||
      email_addresses.length === 0
    ) {
      console.error(
        "Error: Missing user ID or email addresses for user.created event."
      );
      return new Response("Error: Missing user ID or email addresses", {
        status: 400,
      });
    }
    // Find the primary email address
    const primaryEmail = email_addresses.find(
      (e: { id: string; email_address: string }) =>
        e.id === evt.data.primary_email_address_id
    )?.email_address;
    if (!primaryEmail) {
      console.error("Error: Primary email not found for user.created event.");
      return new Response("Error: Primary email not found", { status: 400 });
    }

    try {
      await prisma.user.create({
        data: {
          id: id as string, // clerk ID is used as the user ID
          email: primaryEmail,
          name: evt.data.first_name
            ? `${evt.data.first_name} ${evt.data.last_name || ""}`.trim()
            : undefined,
        },
      });
      console.log(`User ${id} created in DB.`);
    } catch (error: any) {
      if (error.code === "P2002") {
        // Handle unique constraint violation (user already exists)
        console.warn(
          `User with Clerk ID ${id} or email ${primaryEmail} likely already exists (P2002).`
        );
      } else {
        // Log other database errors
        console.error("Error creating user in DB:", error);
        return new Response("Error processing webhook", { status: 500 });
      }
    }
  }

  // --- Handle 'user.updated' event ---
  if (eventType === "user.updated") {
    if (!id) {
      console.error("Error: Missing user ID for user.updated event.");
      return new Response("Error: Missing user ID", { status: 400 });
    }
    // Find the primary email address, ensuring `email_addresses` is an array
    const primaryEmail = Array.isArray(email_addresses)
      ? email_addresses.find(
          (e: { id: string; email_address: string }) =>
            e.id === evt.data.primary_email_address_id
        )?.email_address
      : undefined;

    try {
      // Prepare data for update, only including fields that are present
      const dataToUpdate: any = {
        ...(primaryEmail && { email: primaryEmail }),
        // Update name if first_name is present in the event data
        ...(evt.data.first_name && {
          name: `${evt.data.first_name} ${evt.data.last_name || ""}`.trim(),
        }),
      };

      // If no relevant fields to update, return 200 OK
      if (Object.keys(dataToUpdate).length === 0) {
        console.log(`No relevant fields to update for Clerk ID ${id}.`);
        return new Response("", { status: 200 });
      }

      // Update user in Prisma
      await prisma.user.update({
        where: { id: id as string },
        data: dataToUpdate,
      });
      console.log(`User with Clerk ID ${id} updated in DB.`);
    } catch (error: any) {
      if (error.code === "P2025") {
        // Handle record not found error (P2025)
        console.warn(
          `User with Clerk ID ${id} not found in DB for update (P2025).`
        );
      } else {
        // Log other database errors
        console.error("Error updating user in DB:", error);
      }
    }
  }

  // --- Handle 'user.deleted' event ---
  if (eventType === "user.deleted") {
    // Validate essential data for user deletion
    if (!id) {
      console.error("Error: Missing user ID for user.deleted event.");
      return new Response("Error: Missing user ID", { status: 400 });
    }
    try {
      // Delete user from Prisma
      await prisma.user.delete({
        where: { id: id as string }, // Cast id to string for the 'where' clause
      });
      console.log(`User with Clerk ID ${id} deleted from DB.`);
    } catch (error: any) {
      if (error.code === "P2025") {
        // Handle record not found error (P2025)
        console.warn(
          `User with Clerk ID ${id} not found in DB for deletion (P2025).`
        );
      } else {
        // Log other database errors
        console.error("Error deleting user in DB:", error);
      }
    }
  }

  // Return a success response for all handled events
  return new Response("", { status: 200 });
}

// Export the handler for different HTTP methods as required by Next.js App Router
export const POST = handler;
export const GET = handler;
export const PUT = handler;
