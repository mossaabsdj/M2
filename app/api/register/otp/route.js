import bcrypt from "bcryptjs";
import sendEmail from "@/lib/sendEmail";

import prisma from "@/lib/prisma";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

async function hashOTP(otp) {
  return await bcrypt.hash(otp, 10);
}

async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  const otp = generateOTP();
  const otpHash = await hashOTP(otp);

  await prisma.verificationToken.create({
    data: {
      email,
      tokenHash: otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  await sendEmail(email, otp);

  return new Response(JSON.stringify({ message: "OTP sent" }));
}

module.exports = { POST };
