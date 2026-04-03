// ─── REGISTRATION LINK — UPDATE THIS WHEN READY ─────────────────────────────
const REGISTRATION_LINK = "https://forms.gle/mkUuNRE9isp16ATa9";
// ─────────────────────────────────────────────────────────────────────────────

// ─── CONTACT DETAILS ─────────────────────────────────────────────────────────
const CONTACTS = [
  { name: "Devarajan S", role: "Chairman", phone: "+91 93633 88354", tel: "tel:+919363388354" },
  { name: "Dhanashri S", role: "Vice Chairman", phone: "+91 63817 47455", tel: "tel:+916381747455" },
];
// ─────────────────────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  {
    id: "registration",
    title: "Registration Form",
    description: "Register now for CyberFest 2026",
    // Registration link is defined above for easy updating
    href: REGISTRATION_LINK,
    ocid: "involve.item.1",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16"
        aria-label="Registration form icon"
        role="img"
      >
        <title>Registration Form</title>
        <rect
          x="8"
          y="4"
          width="32"
          height="40"
          rx="4"
          stroke="#e50914"
          strokeWidth="3"
          fill="none"
        />
        <line
          x1="16"
          y1="14"
          x2="32"
          y2="14"
          stroke="#e50914"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="20"
          x2="32"
          y2="20"
          stroke="#e50914"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="26"
          x2="28"
          y2="26"
          stroke="#e50914"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="32"
          x2="24"
          y2="32"
          stroke="#e50914"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "instagram",
    title: "Instagram",
    description: "Follow us for updates, memes & announcements",
    href: "https://www.instagram.com/cit_cyberfest_2k26?utm_source=qr&igsh=MTlyZWppOXJkZHNidA==",
    ocid: "involve.item.2",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16"
        aria-label="Instagram icon"
        role="img"
      >
        <title>Instagram</title>
        <rect
          x="6"
          y="6"
          width="36"
          height="36"
          rx="10"
          stroke="#e50914"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="24"
          cy="24"
          r="8"
          stroke="#e50914"
          strokeWidth="3"
          fill="none"
        />
        <circle cx="35" cy="13" r="2" fill="#e50914" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Join our WhatsApp community",
    href: "https://chat.whatsapp.com/IPr0ktuLYq0D4Gtxp8Trj5?mode=gi_t",
    ocid: "involve.item.3",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16"
        aria-label="WhatsApp icon"
        role="img"
      >
        <title>WhatsApp</title>
        {/* Outer circle */}
        <circle
          cx="24"
          cy="23"
          r="17"
          stroke="#e50914"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Speech bubble tail */}
        <path
          d="M17 36 l2.5-5"
          stroke="#e50914"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Phone handset */}
        <path
          d="M18.5 17.5 c0-1 .8-1.8 1.8-1.8h1.4c.4 0 .7.3.8.6l.9 2.6c.1.4 0 .8-.3 1l-1.3 1c.7 1.6 1.8 3 3.2 4.2l1.1-1.2c.3-.3.7-.3 1.1-.2l2.6.8c.4.1.6.5.6.9v1.3c0 1-.8 1.8-1.8 1.8h-.5C22 28.5 18.5 23.5 18.5 18v-.5z"
          stroke="#e50914"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function GetInvolvedSection() {
  return (
    <section
      id="registerSection"
      data-ocid="involve.section"
      className="px-6 md:px-12 py-14"
      style={{ scrollMarginTop: "80px" }}
    >
      {/* Section header */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white tracking-widest uppercase">
          GET INVOLVED
        </h2>
        <p className="mt-1 text-sm text-[#808080] italic font-mono-tech">
          Connect. Register. Follow.
        </p>
      </div>

      {/* Horizontal scroll row */}
      <div className="netflix-scroll-row">
        {SOCIAL_LINKS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid={item.ocid}
            className="flex-shrink-0 social-card-glow rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "#141414",
              width: "280px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
              textDecoration: "none",
            }}
          >
            {/* Icon area */}
            <div
              className="flex items-center justify-center"
              style={{
                height: "200px",
                backgroundColor: "#090707",
                position: "relative",
              }}
            >
              {item.icon}

              {/* Play button */}
              <div
                className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold text-base"
                style={{ fontSize: "16px" }}
              >
                ▶
              </div>
            </div>

            {/* Card info */}
            <div className="p-4">
              <h3 className="text-base font-bold text-white mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-[#aaa] leading-relaxed">
                {item.description}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Contact Details */}
      <div className="mt-12">
        <h3 className="text-xl font-black text-white tracking-widest uppercase mb-6">
          CONTACT US
        </h3>
        <div className="flex flex-wrap gap-6">
          {CONTACTS.map((contact, idx) => (
            <a
              key={idx}
              href={contact.tel}
              className="social-card-glow rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "#141414",
                padding: "24px",
                minWidth: "280px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <h4 className="text-base font-bold text-white mb-2">
                {contact.name}
              </h4>
              <p className="text-xs text-[#e50914] font-mono-tech mb-2 uppercase">
                {contact.role}
              </p>
              <p className="text-sm text-[#aaa] font-mono-tech">
                {contact.phone}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
