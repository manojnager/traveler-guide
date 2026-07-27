import "./LegalPage.css";

const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    content: [
      "This Privacy Policy explains how TravelerGuide (\"we\", \"us\", \"our\") collects, uses, discloses, and protects your personal information when you use our website and booking services. We are committed to handling your data responsibly and transparently."
    ]
  },
  {
    id: "information-collected",
    title: "Information We Collect",
    content: [
      "We collect information you provide directly to us, as well as information collected automatically when you use our Services."
    ],
    list: [
      "Contact details — name, email address, phone number",
      "Booking information — travel dates, destination preferences, number of guests",
      "Payment information — processed securely at checkout (we do not store full card details)",
      "Account information — for registered users, encrypted login credentials",
      "Technical data — IP address, browser type, device information, and pages visited"
    ]
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: ["We use the information we collect to:"],
    list: [
      "Process and manage your bookings and payments",
      "Communicate trip confirmations, updates, and support responses",
      "Improve our website, services, and customer experience",
      "Send occasional offers or updates, where you have opted in",
      "Detect and prevent fraud or misuse of our Services"
    ]
  },
  {
    id: "guest-accounts",
    title: "Guest Accounts",
    content: [
      "When you book as a guest without registering, we automatically create a lightweight account using the contact details you provide, so your booking can be tracked and managed. This account is not publicly visible and is used solely to support your travel history with us."
    ]
  },
  {
    id: "data-sharing",
    title: "How We Share Your Information",
    content: [
      "We share the minimum necessary information with trusted third parties strictly to fulfill your booking, including:"
    ],
    list: [
      "Hotels, resorts, and accommodation providers",
      "Transportation and transfer operators",
      "Local tour guides and activity providers",
      "Payment processors, to complete transactions securely"
    ],
    contentAfter: [
      "We do not sell your personal information to third parties, and we do not share your data for third-party marketing purposes without your explicit consent."
    ]
  },
  {
    id: "cookies",
    title: "Cookies & Tracking Technologies",
    content: [
      "Our website uses cookies and similar tracking technologies to improve your browsing experience, understand site usage, and remember your preferences."
    ],
    list: [
      "Essential cookies — required for core site functionality",
      "Performance cookies — help us understand how visitors use our site",
      "Preference cookies — remember your settings and choices"
    ],
    contentAfter: [
      "You can control or disable cookies through your browser settings, though some features of our site may not function properly without them."
    ]
  },
  {
    id: "data-security",
    title: "Data Security",
    content: [
      "We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction, including encrypted password storage and secure payment processing. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security."
    ]
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: [
      "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, including maintaining booking records for legal, accounting, or customer service purposes, after which it is securely deleted or anonymized."
    ]
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: ["Depending on your location, you may have the right to:"],
    list: [
      "Access the personal data we hold about you",
      "Request correction of inaccurate or incomplete data",
      "Request deletion of your personal data",
      "Withdraw consent for marketing communications at any time",
      "Request a copy of your data in a portable format"
    ],
    contentAfter: [
      "To exercise any of these rights, please contact us using the details below."
    ]
  },
  {
    id: "childrens-privacy",
    title: "Children's Privacy",
    content: [
      "Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can remove it."
    ]
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. The \"Last Updated\" date at the top of this page indicates when this policy was most recently revised. Continued use of our Services after changes are posted constitutes acceptance of the revised policy."
    ]
  },
  {
    id: "contact",
    title: "Contact Us",
    content: [
      "For any questions or requests regarding this Privacy Policy or your personal data, please reach out to us using the details below."
    ],
    contact: true
  }
];

function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <span>Legal</span>
          <h1>Privacy Policy</h1>
          <div className="legal-hero-meta">
            <span>Last Updated: July 20, 2026</span>
            <span>Effective Date: July 20, 2026</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container legal-layout">
          <aside className="legal-toc">
            <h4>On This Page</h4>
            <ul>
              {SECTIONS.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{index + 1}. {section.title}</a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="legal-container">
            <p className="legal-intro">
              Your privacy matters to us. This Privacy Policy describes what information we collect,
              how we use it, and the choices you have regarding your personal data when using
              TravelerGuide.
            </p>

            {SECTIONS.map((section, index) => (
              <div className="legal-section" id={section.id} key={section.id}>
                <span className="legal-section-number">Section {index + 1}</span>
                <h2>{section.title}</h2>

                {section.content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}

                {section.list && (
                  <ul>
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.contentAfter && section.contentAfter.map((paragraph, i) => (
                  <p key={`after-${i}`}>{paragraph}</p>
                ))}

                {section.contact && (
                  <div className="legal-contact-box">
                    <p><strong>Email:</strong> <a href="mailto:hello@travelerguide.com">hello@travelerguide.com</a></p>
                    <p><strong>Phone:</strong> +91 98765 43210</p>
                    <p><strong>Address:</strong> Jaipur, Rajasthan, India</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default PrivacyPolicy;