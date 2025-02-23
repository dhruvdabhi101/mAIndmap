import { dodopayments } from "@/lib/dodopayments";
import { CountryCode } from "dodopayments/resources/misc/supported-countries.mjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type CheckoutRequestBody = {
  street: string;
  city: string;
  country: string;
  state: string;
  zipcode: string;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const body: CheckoutRequestBody = await request.json();
    const { street, city, country, state, zipcode, quantity } = body;

    if (!street || !city || !country || !state || !zipcode || !quantity) {
      return NextResponse.json(
        { error: "All billing fields are required" },
        { status: 400 }
      );
    }

    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const productWithQuantity = {
      product_id: productId,
      quantity: quantity,
    };

    const response = await dodopayments.payments.create({
      billing: {
        city,
        country: country as CountryCode,
        state,
        street,
        zipcode,
      },
      customer: {
        email: session.user.email!,
        name: session.user.name!,
      },
      payment_link: true,
      product_cart: [productWithQuantity],
      metadata: {
        userId: session.user.id,
        quantity: quantity.toString(),
      },
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
