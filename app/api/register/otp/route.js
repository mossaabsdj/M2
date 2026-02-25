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
  try {
    const body = await req.json();
    const { email } = body;

    // Check for required fields
    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email " }), {
        status: 400,
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpHash = await hashOTP(otp);

    // Save OTP in DB
    await prisma.verificationToken.create({
      data: {
        email,
        tokenHash: otpHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Send OTP email
    await sendEmail(email, otp);

    return new Response(JSON.stringify({ message: "OTP sent successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("POST /send-otp error:", error);

    // Return detailed error
    return new Response(
      JSON.stringify({
        error: "Failed to send OTP",
        details: error.message || error,
      }),
      { status: 500 },
    );
  }
}

export { POST };
