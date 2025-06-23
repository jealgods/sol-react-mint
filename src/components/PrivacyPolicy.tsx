"use client";

import { useState } from "react";

type Props = {
  onAccept: () => void;
};

const PrivacyPolicy = ({ onAccept }: Props) => {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleAccept = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setPrivacyAccepted(isChecked);
  };

  const handleNext = () => {
    if (privacyAccepted) {
      onAccept();
    }
  };

  return (
    <div className="space-y-4">
      {/* Privacy Policy Scrollable Content */}
      <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-xl border border-neutral-700 overflow-hidden">
        <div className="h-[300px] overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-fuchsia-500 scrollbar-track-neutral-800">
          <div className="space-y-3">
            {/* Introduction */}
            <div>
              <h1 className="text-xl font-bold mb-1 bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                Introduction
              </h1>
              <p className="text-neutral-300 leading-relaxed text-sm">
                Welcome to LongLifeCoin. Your privacy is important to us, and we
                are committed to protecting your personal information. This
                Privacy Policy explains how we collect, use, and safeguard your
                information when you use our website, applications, or services
                (collectively, the &quot;Services&quot;). By accessing or using
                our Services, you agree to the terms of this Privacy Policy.
              </p>
            </div>

            {/* Terms of Use */}
            <div>
              <h2 className="text-lg font-semibold mb-1 text-fuchsia-400">
                Terms of Use
              </h2>
              <p className="text-neutral-300 leading-relaxed text-sm">
                If you didn&apos;t read this document carefully, then, you
                cannot sue this website for privacy and policy. It&apos;s you
                who decide to use Hua Tuo&apos;s method, so, everything is your
                choice in Longlifecoin. It just gives you some medical
                knowledge, using Longlifecoin is your choice, all responsibility
                depends on you. Hua Tuo is only known to Chinese people, and no
                one else knows him, so I must introduce him to you. Hua Tuo is
                best famous doctor in china more than thousand years we call Hua
                Tuo is Miracle Doctor. and his method has 1000 years of history.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-lg font-semibold mb-1 text-fuchsia-400">
                Information We Collect
              </h2>
              <p className="text-neutral-300 mb-1 text-sm">
                We may collect the following types of information to provide and
                improve our Services: After we complete the transaction, we
                delete all the buyer&apos;s information.
              </p>

              <div className="space-y-1">
                {/* Personal Information */}
                <div>
                  <h3 className="text-base font-medium mb-0.5 text-blue-400">
                    1. Personal Information
                  </h3>
                  <p className="text-neutral-300 mb-0.5 text-sm">
                    When you register for an account, purchase tokens, or
                    interact with our Services, we may collect personal
                    information such as:
                  </p>
                  <ul className="list-disc pl-3 text-neutral-300 space-y-0.5 text-sm">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Wallet address</li>
                    <li>Payment information</li>
                  </ul>
                </div>

                {/* Non-Personal Information */}
                <div>
                  <h3 className="text-base font-medium mb-0.5 text-blue-400">
                    2. Non-Personal Information
                  </h3>
                  <p className="text-neutral-300 mb-0.5 text-sm">
                    We automatically collect certain non-personal information
                    when you use our Services, such as:
                  </p>
                  <ul className="list-disc pl-3 text-neutral-300 space-y-0.5 text-sm">
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>IP address</li>
                    <li>Device information</li>
                    <li>
                      Usage data, including pages visited, actions taken, and
                      time spent on the site
                    </li>
                  </ul>
                </div>

                {/* Blockchain Data */}
                <div>
                  <h3 className="text-base font-medium mb-0.5 text-blue-400">
                    3. Blockchain Data
                  </h3>
                  <p className="text-neutral-300 text-sm">
                    Transactions made through the LongLifeCoin blockchain are
                    publicly recorded on the blockchain ledger. This data may
                    include your wallet address, transaction history, and
                    amounts transacted. Blockchain data is immutable and not
                    under our control.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-base font-semibold mb-1 text-fuchsia-400">
                How We Use Your Information
              </h2>
              <p className="text-neutral-300 mb-1 text-xs">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc pl-3 text-neutral-300 space-y-0.5 text-xs">
                <li>
                  <span className="font-semibold">To Provide Services:</span> To
                  process transactions, manage your account, and deliver
                  customer support.
                </li>
                <li>
                  <span className="font-semibold">To Improve Services:</span> To
                  analyze usage trends, develop new features, and enhance user
                  experience.
                </li>
                <li>
                  <span className="font-semibold">For Security:</span> To
                  prevent fraud, detect unauthorized activities, and ensure the
                  safety of our users.
                </li>
                <li>
                  <span className="font-semibold">To Communicate:</span> To send
                  updates, promotional materials, and important notifications
                  about your account or our Services.
                </li>
              </ul>
            </div>

            {/* How We Share Your Information */}
            <div>
              <h2 className="text-base font-semibold mb-1 text-fuchsia-400">
                How We Share Your Information
              </h2>
              <p className="text-neutral-300 mb-1 text-xs">
                We do not sell or rent your personal information. However, we
                may share your information under the following circumstances:
              </p>
              <ul className="list-disc pl-3 text-neutral-300 space-y-0.5 text-xs">
                <li>
                  <span className="font-semibold">With Service Providers:</span>{" "}
                  Third-party vendors who assist us in delivering Services, such
                  as payment processors and cloud storage providers.
                </li>
                <li>
                  <span className="font-semibold">For Legal Compliance:</span>{" "}
                  When required by law, subpoena, or court order.
                </li>
                <li>
                  <span className="font-semibold">
                    In Business Transactions:
                  </span>{" "}
                  If LongLifeCoin undergoes a merger, acquisition, or sale of
                  assets, your information may be transferred as part of the
                  transaction.
                </li>
                <li>
                  <span className="font-semibold">To Protect Rights:</span> When
                  necessary to enforce our Terms of Service, protect our rights,
                  or ensure the safety of our users.
                </li>
              </ul>
            </div>

            {/* Cookies and Tracking Technologies */}
            <div>
              <h2 className="text-base font-semibold mb-1 text-fuchsia-400">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-neutral-300 text-xs">
                We use cookies and similar tracking technologies to collect
                information about your interactions with our Services. This
                helps us improve functionality, remember user preferences, and
                provide targeted advertising. You can manage your cookie
                preferences through your browser settings.
              </p>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-base font-semibold mb-1 text-fuchsia-400">
                Data Security
              </h2>
              <p className="text-neutral-300 text-xs">
                We employ industry-standard security measures to protect your
                information. However, no system can guarantee absolute security.
                You are responsible for safeguarding your account credentials
                and promptly notifying us of any unauthorized access.
              </p>
            </div>

            {/* Third-Party Links */}
            <div>
              <h2 className="text-base font-semibold mb-1 text-fuchsia-400">
                Third-Party Links
              </h2>
              <p className="text-neutral-300 text-xs">
                Our Services may contain links to third-party websites or
                services. We are not responsible for their privacy practices. We
                encourage you to review their privacy policies before sharing
                any personal information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Consent Checkbox */}
      <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-xl p-4 border border-neutral-700">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative w-5 h-5 flex-shrink-0">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-lg border-2 border-neutral-600 checked:border-fuchsia-500 checked:bg-fuchsia-500 appearance-none transition-all duration-200 cursor-pointer group-hover:border-fuchsia-400"
              onChange={handleAccept}
              checked={privacyAccepted}
            />
            {privacyAccepted && (
              <div className="absolute inset-[2px] bg-fuchsia-500 rounded-md border-2 border-white" />
            )}
          </div>
          <span className="text-neutral-300 font-medium">
            I have read and agree to the Privacy Policy and Terms of Use
          </span>
        </label>
      </div>

      {/* Next Button */}
      {privacyAccepted && (
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-fuchsia-500 to-blue-500 hover:from-fuchsia-600 hover:to-blue-600 text-white shadow-2xl transition-all duration-200 transform hover:scale-105"
          >
            Continue to Trading
          </button>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicy;
