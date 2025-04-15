import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

export const sendVerificationCode = async (
  phoneNumber: string
): Promise<string> => {
  try {
    const verification = await client.verify.v2
      .services(verifyServiceSid as string)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    return verification.status;
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw new Error("Failed to send verification code");
  }
};

export const verifyCode = async (
  phoneNumber: string,
  code: string
): Promise<boolean> => {
  try {
    const verification_check = await client.verify.v2
      .services(verifyServiceSid as string)
      .verificationChecks.create({ to: phoneNumber, code });

    return verification_check.status === "approved";
  } catch (error) {
    console.error("Error verifying code:", error);
    throw new Error("Failed to verify code");
  }
};
