import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  const { amount, invoiceId } = await req.json();

  const merchantCode = process.env.ESEWA_MERCHANT_CODE;
  const secret = process.env.ESEWA_SECRET_KEY;

  const data = `total_amount=${amount},transaction_uuid=${invoiceId},product_code=${merchantCode}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64");

  return NextResponse.json({
    qrData: {
      amount,
      invoiceId,
      merchantCode,
      signature,
    },
  });
}
