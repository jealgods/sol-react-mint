import twilio from "twilio";

interface TwilioError extends Error {
  code?: number;
  status?: number;
  moreInfo?: string;
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifyServiceSid) {
  throw new Error("Twilio credentials are not properly configured");
}

const client = twilio(accountSid, authToken);

export const sendVerificationCode = async (
  phoneNumber: string
): Promise<string> => {
  try {
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    return verification.status;
  } catch (error) {
    const twilioError = error as TwilioError;
    console.error("Error sending verification code:", twilioError);
    throw new Error(twilioError.message || "Failed to send verification code");
  }
};

export const verifyCode = async (
  phoneNumber: string,
  code: string
): Promise<boolean> => {
  try {
    const verification_check = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phoneNumber, code });

    return verification_check.status === "approved";
  } catch (error) {
    const twilioError = error as TwilioError;
    console.error("Error verifying code:", twilioError);
    throw new Error(twilioError.message || "Failed to verify code");
  }
};
