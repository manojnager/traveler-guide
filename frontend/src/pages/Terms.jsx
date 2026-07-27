import "./LegalPage.css";

const SECTIONS = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: [
      "By accessing or using the TravelerGuide website, mobile experience, or booking services (collectively, the \"Services\"), you agree to be bound by these Terms & Conditions (\"Terms\") and our Privacy Policy. If you do not agree with any part of these Terms, please discontinue use of our Services immediately.",
      "These Terms apply to all visitors, registered users, and guests who make a booking through TravelerGuide, regardless of whether an account is created."
    ]
  },
  {
    id: "eligibility",
    title: "Eligibility",
    content: [
      "You must be at least 18 years of age, or the age of legal majority in your jurisdiction, to make a booking through TravelerGuide. By booking, you represent that you have the legal capacity to enter into a binding agreement."
    ]
  },
  {
    id: "bookings",
    title: "Bookings & Reservations",
    content: [
      "All bookings made through TravelerGuide are subject to availability and confirmation. A booking is considered confirmed only once you receive a confirmation reference number.",
      "Prices displayed on our website are per person, in USD, unless otherwise stated, and are subject to change until a booking is fully confirmed and paid for. Displayed prices may not include flights, travel insurance, visa fees, or certain meals unless explicitly listed in the package inclusions."
    ],
    list: [
      "You are responsible for reviewing all trip details, dates, and inclusions before confirming a booking.",
      "Guest bookings (made without a full account) will have a lightweight account created automatically using the details provided, solely for booking management purposes.",
      "TravelerGuide reserves the right to decline or cancel a booking in cases of suspected fraud, pricing errors, or unavailability of the underlying service."
    ]
  },
  {
    id: "payments",
    title: "Payments",
    content: [
      "Full or partial payment, as specified at checkout, is required to confirm a booking. We currently support Credit Card, PayPal, and Bank Transfer as payment methods.",
      "TravelerGuide reserves the right to cancel bookings that remain unpaid beyond any stated payment deadline. All prices are inclusive of applicable service fees unless stated otherwise."
    ]
  },
  {
    id: "cancellations",
    title: "Cancellations & Refunds",
    content: [
      "Cancellation policies vary by destination and are displayed on the destination's booking page prior to confirmation. It is your responsibility to review the applicable cancellation policy before booking.",
      "Refunds, where applicable under the relevant policy, will be processed to the original payment method within a reasonable timeframe following approval. Processing times may vary depending on your payment provider."
    ]
  },
  {
    id: "guest-responsibilities",
    title: "Guest Responsibilities",
    content: [
      "Travelers are solely responsible for ensuring they hold valid travel documentation, including passports, visas, and any required vaccinations or health certificates, for their chosen destination.",
      "TravelerGuide is not liable for denied entry, missed travel, or additional costs incurred due to inadequate or invalid travel documentation."
    ]
  },
  {
    id: "third-parties",
    title: "Third-Party Services",
    content: [
      "TravelerGuide acts as an intermediary connecting travelers with third-party service providers, including hotels, transportation companies, tour operators, and activity providers. While we carefully vet our partners for quality and reliability, the actual provision of services (accommodation, transport, activities) is performed by these independent third parties and is subject to their own terms and conditions."
    ]
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content: [
      "To the fullest extent permitted by law, TravelerGuide shall not be liable for any indirect, incidental, or consequential damages arising from the use of our Services, including but not limited to losses resulting from:"
    ],
    list: [
      "Weather conditions, natural disasters, or other force majeure events",
      "Actions, errors, or omissions of third-party service providers",
      "Flight delays, cancellations, or other transportation disruptions",
      "Illness, injury, or loss of personal property during travel"
    ]
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: [
      "All content on the TravelerGuide website, including text, graphics, logos, images, and software, is the property of TravelerGuide or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without prior written consent."
    ]
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    content: [
      "We may revise these Terms from time to time to reflect changes in our services, legal requirements, or business practices. The \"Last Updated\" date at the top of this page indicates when these Terms were most recently revised. Continued use of our Services after changes are posted constitutes your acceptance of the revised Terms."
    ]
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content: [
      "These Terms shall be governed by and construed in accordance with the laws applicable in the jurisdiction where TravelerGuide is registered, without regard to conflict-of-law principles."
    ]
  },
  {
    id: "contact",
    title: "Contact Us",
    content: [
      "If you have any questions about these Terms & Conditions, please reach out to our team using the details below."
    ],
    contact: true
  }
];

function Terms() {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <span>Legal</span>
          <h1>Terms & Conditions</h1>
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
              These Terms & Conditions govern your use of the TravelerGuide website and booking
              services. Please read them carefully before making a booking. By using our Services,
              you agree to these Terms in full.
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

export default Terms;