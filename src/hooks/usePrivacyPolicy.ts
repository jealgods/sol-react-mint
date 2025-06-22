import { useState, useEffect } from "react";

export const usePrivacyPolicy = () => {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if privacy policy was accepted (stored in localStorage)
    const accepted = localStorage.getItem("privacyPolicyAccepted");
    if (accepted === "true") {
      setPrivacyAccepted(true);
    }
    setIsLoading(false);
  }, []);

  const acceptPrivacyPolicy = () => {
    localStorage.setItem("privacyPolicyAccepted", "true");
    setPrivacyAccepted(true);
  };

  return {
    privacyAccepted,
    isLoading,
    acceptPrivacyPolicy,
  };
};
