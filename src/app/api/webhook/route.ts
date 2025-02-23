import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";
import { dodopayments } from "@/lib/dodopayments";
import prisma from "@/lib/prisma";

// const webhook = new Webhook("whsec_tRx4aH09lCwuw4ueiMhTJu73");
const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!); // Replace with your secret key generated from the Dodo Payments Dashboard

export async function POST(request: Request) {
  const headersList = await headers();

  try {
    const rawBody = await request.text();
    console.log(rawBody);
    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };
    await webhook.verify(rawBody, webhookHeaders);
    const payload = JSON.parse(rawBody);

    if (payload.data.payload_type === "Subscription") {
      switch (payload.type) {
        case "subscription.active":
          const subscription = await dodopayments.subscriptions.retrieve(
            payload.data.subscription_id
          );
          console.log("-------SUBSCRIPTION DATA START ---------");
          console.log(subscription);
          console.log("-------SUBSCRIPTION DATA END ---------");
          break;
        case "subscription.failed":
          break;
        case "subscription.cancelled":
          break;
        case "subscription.renewed":
          break;
        case "subscription.on_hold":
          break;
        default:
          break;
      }
    } else if (payload.data.payload_type === "Payment") {
      switch (payload.type) {
        case "payment.succeeded":
          const paymentData = await dodopayments.payments.retrieve(
            payload.data.payment_id
          );
          console.log("-------PAYMENT DATA START ---------");
          console.log(paymentData);

          // Get the user ID and quantity from metadata
          const quantity = paymentData.metadata?.quantity;

          await prisma.user.update({
            where: { email: paymentData.customer.email },
            data: {
              limit: {
                increment: parseInt(quantity) * 5, // Assuming each purchase adds 5 mindmaps per quantity
              },
            },
          });
          break;
        default:
          break;
      }
    }
    return Response.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  }
}
