import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    // Simulate payment gateway delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate fake transaction ID
    const transactionId = "TXN_" + Date.now();

    return NextResponse.json({
      success: true,
      transactionId,
      amount,
      status: "PAID",
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}