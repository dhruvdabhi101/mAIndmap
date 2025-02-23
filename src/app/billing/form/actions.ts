import { billingSchema } from "@/lib/validations";

export async function createPaymentLink(formData: FormData) {
  try {
    const validatedFields = billingSchema.safeParse({
      street: formData.get("street"),
      city: formData.get("city"),
      country: formData.get("country"),
      state: formData.get("state"),
      zipcode: formData.get("zipcode"),
      quantity: parseInt(formData.get("quantity") as string),
    });

    if (!validatedFields.success) {
      return { error: "Please check your billing information and try again." };
    }

    // change product id if needed
    const response = await fetch(
      "/api/checkout?productId=pdt_WSFV4ePTzIxD4FWanDwTL",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedFields.data),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to create payment" };
    }

    return {
      success: true,
      paymentUrl: data.payment_link,
      data: validatedFields.data,
    };
  } catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }
}
