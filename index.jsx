import { useState, useEffect, useRef } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_CUSTOMERS = [
  { id: 1, name: "Emily Carter", email: "emily@example.com", phone: "407-555-0192", city: "Orlando", address: "214 Oak Blossom Lane, Orlando, FL 32801", deliveryOption: "home", householdSize: 3, eligibility: "home_delivery", joined: "2025-05-01", password: "pass" },
  { id: 2, name: "Marcus Reed", email: "marcus@example.com", phone: "305-555-0148", city: "Miami", address: "88 Brickell Ave, Miami, FL 33131", deliveryOption: "kiosk", householdSize: 2, eligibility: "kiosk_pickup", joined: "2025-05-03", password: "pass" },
  { id: 3, name: "Sofia Alvarez", email: "sofia@example.com", phone: "407-555-0287", city: "Orlando", address: "900 Lake Eola Dr, Orlando, FL 32803", deliveryOption: "drone", householdSize: 4, eligibility: "drone_waitlist", joined: "2025-05-05", password: "pass" },
  { id: 4, name: "Daniel Brooks", email: "daniel@example.com", phone: "305-555-0399", city: "Miami", address: "2000 NW 57th Ave, Miami, FL 33142", deliveryOption: "home", householdSize: 1, eligibility: "outside_radius", joined: "2025-05-06", password: "pass" },
];

const MOCK_ORDERS = [
  { id: "EGG-1001", customerId: 1, customer: "Emily Carter", city: "Orlando", product: "18-Count Family Pack", quantity: 2, method: "truck", status: "out_for_delivery", date: "2025-05-10", freshness: "May 8", amount: 28.00, driverId: "D-04", qrCode: null },
  { id: "EGG-1002", customerId: 2, customer: "Marcus Reed", city: "Miami", product: "12-Count Farm Fresh", quantity: 1, method: "kiosk", status: "qr_ready", date: "2025-05-11", freshness: "May 9", amount: 14.99, driverId: null, qrCode: "QR-MCK-7742" },
  { id: "EGG-1003", customerId: 3, customer: "Sofia Alvarez", city: "Orlando", product: "30-Count Weekly Crate", quantity: 1, method: "drone", status: "awaiting_approval", date: "2025-05-12", freshness: "May 10", amount: 34.99, driverId: null, qrCode: null },
  { id: "EGG-1004", customerId: 1, customer: "Emily Carter", city: "Orlando", product: "12-Count Farm Fresh", quantity: 3, method: "truck", status: "delivered", date: "2025-05-05", freshness: "May 3", amount: 44.97, driverId: "D-02", qrCode: null },
  { id: "EGG-1005", customerId: 2, customer: "Marcus Reed", city: "Miami", product: "18-Count Family Pack", quantity: 1, method: "kiosk", status: "delivered", date: "2025-05-01", freshness: "Apr 29", amount: 14.00, driverId: null, qrCode: "QR-MCK-5510" },
];

const MOCK_ZONES = [
  { id: 1, name: "Orlando Farm Hub", radius: "5-mile radius", hub: "2200 Farmstead Blvd, Orlando, FL", type: "delivery" },
  { id: 2, name: "Miami Beta Hub", radius: "3-mile radius", hub: "100 NE 1st Ave, Miami, FL", type: "delivery" },
  { id: 3, name: "Smart Locker – Orlando Downtown", address: "150 E Church St, Orlando, FL 32801", type: "kiosk" },
  { id: 4, name: "Smart Locker – Miami Brickell", address: "801 Brickell Bay Dr, Miami, FL 33131", type: "kiosk" },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "email", event: "beta_signup", title: "Welcome to FreshNest Beta!", body: "You're officially on the waitlist! We'll notify you when delivery opens in your area. Your farm-fresh eggs are coming soon.", time: "May 1, 9:00 AM" },
  { id: 2, type: "email", event: "order_confirm", title: "Order Confirmed – #EGG-1001", body: "Your farm-fresh eggs are confirmed. Eggs were packed today and are under 10 days old. Estimated delivery: May 12.", time: "May 10, 11:05 AM" },
  { id: 3, type: "sms", event: "delivery_scheduled", title: "Delivery Scheduled", body: "Your FreshNest delivery is scheduled for tomorrow between 9–11 AM. Eggs packed: May 8. Freshness: guaranteed under 10 days.", time: "May 11, 8:00 AM" },
  { id: 4, type: "sms", event: "out_for_delivery", title: "Your Eggs Are On The Way!", body: "Your delivery is out for delivery. Driver: James (D-04) is heading your way. Track at freshnest.farm/track.", time: "May 12, 9:30 AM" },
  { id: 5, type: "email", event: "delivered", title: "Delivered! How fresh were they?", body: "Your eggs have been delivered. Leave a review and earn 50 Egg Points. Thanks for being a FreshNest beta customer!", time: "May 12, 11:45 AM" },
  { id: 6, type: "sms", event: "qr_ready", title: "QR Code Ready for Pickup", body: "Your QR code is ready for kiosk pickup at Smart Locker – Miami Brickell. Code: QR-MCK-7742. Expires in 48 hours.", time: "May 11, 2:00 PM" },
  { id: 7, type: "email", event: "eggscape", title: "You joined The Great Eggscape!", body: "Thanks for joining The Great Eggscape! You've earned 100 Egg Points. Keep playing and uploading to unlock beta perks.", time: "May 5, 3:00 PM" },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Jess M.", city: "Orlando", points: 1420, reward: "Free Month", avatar: "JM" },
  { rank: 2, name: "Carlos V.", city: "Miami", points: 1100, reward: "50% Off Order", avatar: "CV" },
  { rank: 3, name: "Priya K.", city: "Orlando", points: 980, reward: "Early Access", avatar: "PK" },
  { rank: 4, name: "Tamara W.", city: "Miami", points: 870, reward: "Early Access", avatar: "TW" },
  { rank: 5, name: "Liam O.", city: "Orlando", points: 760, reward: "10% Off", avatar: "LO" },
  { rank: 6, name: "Sofia A.", city: "Orlando", points: 640, reward: "10% Off", avatar: "SA" },
];

const MOCK_UGC = [
  { id: 1, user: "Jess M.", city: "Orlando", handle: "@jessybreakfast", caption: "Sunday scrambled eggs from the freshest pack I've ever cracked 🍳", approved: true, date: "May 4" },
  { id: 2, user: "Carlos V.", city: "Miami", handle: "@carlos.eats", caption: "These eggs honestly changed my omelette game. Zero comparison to store eggs.", approved: true, date: "May 6" },
  { id: 3, user: "Priya K.", city: "Orlando", handle: "@priyakitchen", caption: "My kids can taste the difference. Golden yolks every single time!", approved: false, date: "May 7" },
  { id: 4, user: "Tamara W.", city: "Miami", handle: "@tamcooks", caption: "Fresh is an understatement. This is farm magic in a carton.", approved: true, date: "May 8" },
];

const PRODUCTS = [
  { id: "12ct", name: "12-Count Farm Fresh Eggs", price: 14.99, desc: "Perfect for households of 1–2. Premium free-range, packed the same day.", badge: "Popular" },
  { id: "18ct", name: "18-Count Family Pack", price: 21.99, desc: "Ideal for families of 3–4. Our best-seller with golden yolks.", badge: "Best Value" },
  { id: "30ct", name: "30-Count Weekly Crate", price: 34.99, desc: "The full weekly supply for busy households. Deep savings per egg.", badge: "Max Fresh" },
];

const DELIVERY_METHODS = [
  { id: "truck", label: "Home Delivery – Truck", icon: "🚚", note: "Delivered by 11 AM in your window" },
  { id: "kiosk", label: "Smart Locker Kiosk Pickup", icon: "📦", note: "Scan QR code at nearest locker" },
  { id: "drone", label: "Drone Delivery (Beta)", icon: "🚁", note: "Manual admin approval required" },
];

const SLOTS = ["Mon May 13, 9–11 AM", "Mon May 13, 2–4 PM", "Tue May 14, 9–11 AM", "Tue May 14, 2–4 PM", "Wed May 15, 9–11 AM"];

const STATUS_MAP = {
  out_for_delivery: { label: "Out for Delivery", color: "#e67e22", bg: "#fef3e2" },
  qr_ready: { label: "QR Ready", color: "#2980b9", bg: "#eaf4fb" },
  awaiting_approval: { label: "Awaiting Approval", color: "#8e44ad", bg: "#f4eafb" },
  delivered: { label: "Delivered", color: "#27ae60", bg: "#e8f8ef" },
  confirmed: { label: "Confirmed", color: "#16a085", bg: "#e8f8f5" },
  packed: { label: "Packed", color: "#2ecc71", bg: "#e9faf1" },
};

const METHOD_MAP = {
  truck: "🚚 Truck Delivery",
  kiosk: "📦 Kiosk Pickup",
  drone: "🚁 Drone (Beta)",
};

// ============================================================
// COMPONENTS
// ============================================================

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || { label: status, color: "#666", bg: "#f0f0f0" };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

const Avatar = ({ name, size = 40, color = "#5a7a3a" }) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #f0ece6", ...style }}>
    {children}
  </div>
);

// ============================================================
// NAV
// ============================================================
const Nav = ({ page, setPage, user, setUser, adminMode, setAdminMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ background: "#fff", borderBottom: "1px solid #f0ece6", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
      <div onClick={() => setPage("landing")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 28 }}>🥚</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#2d5016", letterSpacing: "-0.5px" }}>FreshNest</div>
          <div style={{ fontSize: 10, color: "#7a9a5a", fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", marginTop: -2 }}>Farm to Door</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {user ? (
          <>
            <button onClick={() => setPage("dashboard")} style={{ ...btnStyle, background: page === "dashboard" ? "#e8f0da" : "transparent", color: "#3a6020" }}>Dashboard</button>
            <button onClick={() => setPage("order")} style={{ ...btnStyle, background: "#3a6020", color: "#fff", borderColor: "#3a6020" }}>Order Eggs</button>
            {adminMode && <button onClick={() => setPage("admin")} style={{ ...btnStyle, background: "#f5e6d0", color: "#8b5e2a", borderColor: "#d4a96a" }}>Admin</button>}
            <button onClick={() => { setUser(null); setPage("landing"); }} style={{ ...btnStyle, color: "#888" }}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => setPage("landing")} style={{ ...btnStyle, color: "#555" }}>Home</button>
            <button onClick={() => setPage("eggscape")} style={{ ...btnStyle, color: "#c0392b" }}>🎮 Eggscape</button>
            <button onClick={() => setPage("login")} style={{ ...btnStyle, background: "#3a6020", color: "#fff", borderColor: "#3a6020" }}>Login / Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

const btnStyle = { padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer", fontSize: 14, fontWeight: 500, background: "transparent", transition: "all 0.15s" };

// ============================================================
// LANDING PAGE
// ============================================================
const LandingPage = ({ setPage }) => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Orlando");
  const [eligResult, setEligResult] = useState(null);

  const checkEligibility = () => {
    const a = address.toLowerCase();
    if (!address.trim()) return;
    if (a.includes("32801") || a.includes("oak blossom") || a.includes("eola") || city === "Orlando") {
      setEligResult({ status: "home", msg: "✅ Eligible for Home Delivery!", detail: "You're within the 5-mile Orlando Farm Hub radius." });
    } else if (a.includes("33131") || a.includes("brickell") || city === "Miami") {
      setEligResult({ status: "kiosk", msg: "📦 Eligible for Kiosk Pickup!", detail: "You're near the Miami Beta Hub smart locker on Brickell Ave." });
    } else {
      setEligResult({ status: "soon", msg: "⏳ Coming Soon to Your Area", detail: "We're expanding fast! Join the waitlist and be first to know." });
    }
  };

  const testimonials = [
    { name: "Jennifer L.", city: "Orlando", text: "I cracked the egg and the yolk was SO orange. I didn't know eggs could taste like this. My grocery eggs taste like water now.", stars: 5 },
    { name: "David M.", city: "Miami", text: "The freshness score is real. Got my order 6 days after packing. You can literally smell the difference from the carton.", stars: 5 },
    { name: "Amanda T.", city: "Orlando", text: "My kids ask for eggs every morning now. That's never happened before. The drone beta sign-up was seamless too!", stars: 5 },
  ];

  return (
    <div style={{ fontFamily: "'Georgia', serif", color: "#2c2c2c" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #f7f0e4 0%, #e8f0da 60%, #d4e8b8 100%)", padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 20, right: 60, fontSize: 80, opacity: 0.15 }}>🐓</div>
        <div style={{ position: "absolute", bottom: 10, left: 40, fontSize: 60, opacity: 0.12 }}>🥚</div>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ background: "#3a6020", color: "#fff", display: "inline-block", padding: "6px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20, letterSpacing: 0.5 }}>🌾 Beta Launch — Orlando & Miami</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 900, color: "#1a3a08", lineHeight: 1.15, margin: "0 0 20px", letterSpacing: "-1px" }}>
            Eggs so fresh,<br />the hen still remembers.
          </h1>
          <p style={{ fontSize: 20, color: "#4a6030", maxWidth: 580, margin: "0 auto 16px", lineHeight: 1.65, fontFamily: "sans-serif" }}>
            Ultra-fresh eggs delivered in under <strong>10 days</strong> from our family farm to your doorstep. Most grocery store eggs are <strong style={{ color: "#c0392b" }}>60–90 days old</strong> by the time you crack them.
          </p>
          <p style={{ fontSize: 15, color: "#6a8050", fontFamily: "sans-serif", marginBottom: 36 }}>That's not food. That's a storage experiment. We're changing that.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("signup")} style={{ background: "#3a6020", color: "#fff", border: "none", padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(58,96,32,0.3)" }}>
              🌿 Join the Orlando Beta
            </button>
            <button onClick={() => setPage("signup")} style={{ background: "#c0392b", color: "#fff", border: "none", padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(192,57,43,0.3)" }}>
              🌊 Join the Miami Beta
            </button>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div style={{ background: "#fff", padding: "60px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, color: "#1a3a08", marginBottom: 12, fontWeight: 800 }}>The 90-Day Grocery Egg Problem</h2>
          <p style={{ textAlign: "center", color: "#666", fontSize: 16, fontFamily: "sans-serif", marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>
            USDA regulations allow eggs to sit 30 days in a facility before refrigeration, then up to 45 days in retail. Your "fresh" eggs could be 90 days old.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {[
              { icon: "📅", label: "Grocery Store Eggs", days: "60–90 days old", color: "#c0392b", bg: "#fdf2f0" },
              { icon: "🏪", label: "Farmers Market Eggs", days: "14–21 days old", color: "#e67e22", bg: "#fef9f0" },
              { icon: "🥚", label: "FreshNest Eggs", days: "Under 10 days old", color: "#27ae60", bg: "#f0faf3" },
            ].map(item => (
              <div key={item.label} style={{ background: item.bg, borderRadius: 16, padding: 28, textAlign: "center", border: `2px solid ${item.color}22` }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, color: "#333", marginBottom: 8, fontFamily: "sans-serif" }}>{item.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.days}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div style={{ background: "#f7f4ef", padding: "60px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, color: "#1a3a08", marginBottom: 48, fontWeight: 800 }}>How FreshNest Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
            {[
              { step: "1", icon: "📋", title: "Join the Beta", desc: "Sign up in under 2 minutes. Tell us your area and delivery preference." },
              { step: "2", icon: "🛒", title: "Place Your Order", desc: "Choose your pack size, delivery window, and method." },
              { step: "3", icon: "🐔", title: "Eggs Are Packed", desc: "Your order triggers same-day packing at our family farm." },
              { step: "4", icon: "🚚", title: "Delivered Fresh", desc: "Truck, smart locker, or drone — under 10 days guaranteed." },
            ].map(item => (
              <div key={item.step} style={{ background: "#fff", borderRadius: 16, padding: 24, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#3a6020", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, margin: "0 auto 12px" }}>{item.step}</div>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, color: "#1a3a08", marginBottom: 8, fontFamily: "sans-serif" }}>{item.title}</div>
                <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6, fontFamily: "sans-serif" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Eligibility Checker */}
      <div style={{ background: "#e8f0da", padding: "60px 24px" }}>
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, color: "#1a3a08", marginBottom: 8, fontWeight: 800 }}>Check Your Delivery Zone</h2>
          <p style={{ textAlign: "center", color: "#5a7a3a", marginBottom: 28, fontFamily: "sans-serif" }}>Enter your address to see if you're eligible for delivery, kiosk pickup, or the drone beta.</p>
          <Card>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              {["Orlando", "Miami"].map(c => (
                <button key={c} onClick={() => setCity(c)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `2px solid ${city === c ? "#3a6020" : "#ddd"}`, background: city === c ? "#3a6020" : "#fff", color: city === c ? "#fff" : "#555", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>{c}</button>
              ))}
            </div>
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your full address..." style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #d0c8bc", fontSize: 15, boxSizing: "border-box", marginBottom: 12, fontFamily: "sans-serif" }} />
            <button onClick={checkEligibility} style={{ width: "100%", background: "#3a6020", color: "#fff", border: "none", padding: "14px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Check Eligibility →</button>
            {eligResult && (
              <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 10, background: eligResult.status === "soon" ? "#fef9f0" : "#f0faf3", border: `1.5px solid ${eligResult.status === "soon" ? "#f0ad4e" : "#2ecc71"}` }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{eligResult.msg}</div>
                <div style={{ fontSize: 13, color: "#666", fontFamily: "sans-serif" }}>{eligResult.detail}</div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Delivery Zones */}
      <div style={{ background: "#fff", padding: "60px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, color: "#1a3a08", marginBottom: 48, fontWeight: 800 }}>Beta Delivery Areas</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {MOCK_ZONES.map(z => (
              <Card key={z.id} style={{ borderLeft: `4px solid ${z.type === "kiosk" ? "#2980b9" : "#3a6020"}` }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{z.type === "kiosk" ? "📦" : "🌾"}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a3a08", marginBottom: 4, fontFamily: "sans-serif" }}>{z.name}</div>
                <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif" }}>{z.radius || z.address}</div>
                <div style={{ marginTop: 10 }}>
                  <span style={{ background: z.type === "kiosk" ? "#eaf4fb" : "#e8f0da", color: z.type === "kiosk" ? "#2980b9" : "#3a6020", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {z.type === "kiosk" ? "Smart Locker" : "Home Delivery"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ background: "#f7f4ef", padding: "60px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, color: "#1a3a08", marginBottom: 48, fontWeight: 800 }}>What Beta Customers Say</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {testimonials.map((t, i) => (
              <Card key={i}>
                <div style={{ fontSize: 20, marginBottom: 12 }}>{"⭐".repeat(t.stars)}</div>
                <p style={{ fontSize: 15, color: "#444", lineHeight: 1.7, fontStyle: "italic", fontFamily: "Georgia, serif", marginBottom: 16 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={t.name} size={36} color="#5a7a3a" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "sans-serif" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif" }}>{t.city} Beta Customer</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ background: "#1a3a08", padding: "70px 24px", textAlign: "center" }}>
        <h2 style={{ color: "#fff", fontSize: 34, marginBottom: 12, fontWeight: 800 }}>Ready to taste the difference?</h2>
        <p style={{ color: "#a8d080", fontSize: 17, fontFamily: "sans-serif", marginBottom: 36 }}>Join hundreds of families already on the beta waitlist.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("signup")} style={{ background: "#6abf40", color: "#fff", border: "none", padding: "16px 36px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Join the Beta Waitlist →</button>
          <button onClick={() => setPage("eggscape")} style={{ background: "transparent", color: "#fff", border: "2px solid #6abf40", padding: "16px 36px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Play The Great Eggscape 🎮</button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SIGNUP
// ============================================================
const SignupPage = ({ setPage }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "Orlando", address: "", delivery: "home", household: "2" });
  const [submitted, setSubmitted] = useState(false);
  const update = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  if (submitted) return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f4ef", padding: 24 }}>
      <Card style={{ maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: "#1a3a08", fontSize: 26, marginBottom: 12 }}>You're on the list!</h2>
        <p style={{ color: "#666", fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: 20 }}>
          Thanks, <strong>{form.name}</strong>! You've joined the FreshNest beta waitlist for <strong>{form.city}</strong>. We'll email you at <strong>{form.email}</strong> when delivery opens in your area.
        </p>
        <div style={{ background: "#e8f0da", borderRadius: 10, padding: "14px 20px", marginBottom: 20 }}>
          <div style={{ fontWeight: 700, color: "#3a6020", fontSize: 15, marginBottom: 4 }}>✅ Beta Confirmation Sent</div>
          <div style={{ fontSize: 13, color: "#5a7a3a", fontFamily: "sans-serif" }}>Check your inbox for your welcome email + Eggscape invite.</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setPage("login")} style={{ flex: 1, background: "#3a6020", color: "#fff", border: "none", padding: "12px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Login to Dashboard</button>
          <button onClick={() => setPage("eggscape")} style={{ flex: 1, background: "#f7f4ef", color: "#c0392b", border: "2px solid #c0392b", padding: "12px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Play Eggscape 🎮</button>
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{ background: "#f7f4ef", minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: 540, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌾</div>
          <h1 style={{ fontSize: 28, color: "#1a3a08", marginBottom: 8 }}>Join the Beta Waitlist</h1>
          <p style={{ color: "#666", fontFamily: "sans-serif" }}>Be among the first to receive ultra-fresh eggs in Orlando or Miami.</p>
        </div>
        <Card>
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={labelStyle}>Full Name</label><input value={form.name} onChange={update("name")} style={inputStyle} placeholder="Jane Smith" /></div>
              <div><label style={labelStyle}>Phone</label><input value={form.phone} onChange={update("phone")} style={inputStyle} placeholder="407-555-0100" /></div>
            </div>
            <div><label style={labelStyle}>Email Address</label><input value={form.email} onChange={update("email")} style={inputStyle} placeholder="jane@example.com" /></div>
            <div><label style={labelStyle}>City</label>
              <select value={form.city} onChange={update("city")} style={inputStyle}>
                <option>Orlando</option><option>Miami</option>
              </select>
            </div>
            <div><label style={labelStyle}>Delivery Address</label><input value={form.address} onChange={update("address")} style={inputStyle} placeholder="123 Main St, Orlando, FL 32801" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={labelStyle}>Preferred Delivery</label>
                <select value={form.delivery} onChange={update("delivery")} style={inputStyle}>
                  <option value="home">Home Delivery</option>
                  <option value="kiosk">Kiosk Pickup</option>
                  <option value="drone">Drone Beta</option>
                </select>
              </div>
              <div><label style={labelStyle}>Household Size</label>
                <select value={form.household} onChange={update("household")} style={inputStyle}>
                  {["1","2","3","4","5+"].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => setSubmitted(true)} style={{ background: "#3a6020", color: "#fff", border: "none", padding: "14px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
              Join Beta Waitlist 🌿
            </button>
          </div>
        </Card>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#888", fontFamily: "sans-serif" }}>
          Already have an account? <span onClick={() => setPage("login")} style={{ color: "#3a6020", cursor: "pointer", fontWeight: 600 }}>Log in</span>
        </p>
      </div>
    </div>
  );
};

const labelStyle = { display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#444", fontFamily: "sans-serif" };
const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 8, border: "1.5px solid #d0c8bc", fontSize: 14, boxSizing: "border-box", fontFamily: "sans-serif", background: "#faf9f7" };

// ============================================================
// LOGIN
// ============================================================
const LoginPage = ({ setUser, setPage, setAdminMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = () => {
    const u = MOCK_CUSTOMERS.find(c => c.email === email && c.password === password);
    if (u) {
      setUser(u);
      setAdminMode(u.id === 1);
      setPage("dashboard");
    } else {
      setError("Invalid email or password. Try emily@example.com / pass");
    }
  };

  return (
    <div style={{ background: "#f7f4ef", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🥚</div>
          <h1 style={{ fontSize: 26, color: "#1a3a08", marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: "#888", fontFamily: "sans-serif", fontSize: 14 }}>Sign in to your FreshNest account</p>
        </div>
        <Card>
          <div style={{ display: "grid", gap: 14 }}>
            <div><label style={labelStyle}>Email</label><input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="emily@example.com" /></div>
            <div><label style={labelStyle}>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" /></div>
            {error && <div style={{ color: "#c0392b", fontSize: 13, fontFamily: "sans-serif", background: "#fdf2f0", padding: "10px 14px", borderRadius: 8 }}>{error}</div>}
            <button onClick={login} style={{ background: "#3a6020", color: "#fff", border: "none", padding: "14px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Login</button>
            <div style={{ textAlign: "center", fontSize: 13, color: "#888", fontFamily: "sans-serif" }}>
              <div>Demo accounts: emily@example.com / pass</div>
              <div>marcus@example.com / pass</div>
            </div>
          </div>
        </Card>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#888", fontFamily: "sans-serif" }}>
          New customer? <span onClick={() => setPage("signup")} style={{ color: "#3a6020", cursor: "pointer", fontWeight: 600 }}>Join the beta</span>
        </p>
      </div>
    </div>
  );
};

// ============================================================
// CUSTOMER DASHBOARD
// ============================================================
const DashboardPage = ({ user, setPage, orders, setOrders }) => {
  const myOrders = orders.filter(o => o.customerId === user.id);
  const activeOrder = myOrders.find(o => !["delivered"].includes(o.status));

  const ELIG_MAP = {
    home_delivery: { label: "Home Delivery Eligible", color: "#27ae60", bg: "#e8f8ef" },
    kiosk_pickup: { label: "Kiosk Pickup Eligible", color: "#2980b9", bg: "#eaf4fb" },
    drone_waitlist: { label: "Drone Beta Waitlist", color: "#8e44ad", bg: "#f4eafb" },
    outside_radius: { label: "Outside Radius", color: "#c0392b", bg: "#fdf2f0" },
  };
  const elig = ELIG_MAP[user.eligibility];

  return (
    <div style={{ background: "#f7f4ef", minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Avatar name={user.name} size={52} color="#3a6020" />
            <div>
              <h1 style={{ fontSize: 22, color: "#1a3a08", marginBottom: 2 }}>Welcome back, {user.name.split(" ")[0]}! 👋</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif" }}>{user.city} Beta Member</span>
                <span style={{ background: elig.bg, color: elig.color, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{elig.label}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setPage("order")} style={{ background: "#3a6020", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>+ Order Eggs</button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Orders", value: myOrders.length },
            { label: "Freshness Score", value: "9.8/10 🥚" },
            { label: "Eggs Ordered", value: myOrders.reduce((a, o) => a + (parseInt(o.product) || 12) * o.quantity, 0) + "+" },
            { label: "Member Since", value: user.joined },
          ].map(s => (
            <Card key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1a3a08", fontFamily: "sans-serif" }}>{s.value}</div>
            </Card>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, marginBottom: 24 }}>
          {/* Active Order */}
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a3a08", marginBottom: 16, fontFamily: "sans-serif" }}>Active Order</h3>
            {activeOrder ? (
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#333", marginBottom: 8, fontFamily: "sans-serif" }}>#{activeOrder.id}</div>
                <div style={{ fontSize: 13, color: "#666", fontFamily: "sans-serif", marginBottom: 4 }}>{activeOrder.product} × {activeOrder.quantity}</div>
                <div style={{ fontSize: 13, color: "#666", fontFamily: "sans-serif", marginBottom: 4 }}>Method: {METHOD_MAP[activeOrder.method]}</div>
                <div style={{ fontSize: 13, color: "#666", fontFamily: "sans-serif", marginBottom: 12 }}>Freshness date: {activeOrder.freshness}</div>
                <StatusBadge status={activeOrder.status} />
                {activeOrder.status === "qr_ready" && (
                  <div style={{ marginTop: 12 }}>
                    <button onClick={() => setPage("kiosk")} style={{ background: "#2980b9", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>View QR Code →</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#aaa", fontFamily: "sans-serif", fontSize: 14 }}>
                No active orders.<br />
                <span onClick={() => setPage("order")} style={{ color: "#3a6020", cursor: "pointer", fontWeight: 600 }}>Place your first order →</span>
              </div>
            )}
          </Card>

          {/* Profile */}
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a3a08", marginBottom: 16, fontFamily: "sans-serif" }}>My Profile</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                ["📧 Email", user.email],
                ["📱 Phone", user.phone],
                ["📍 Address", user.address],
                ["🏠 Household", `${user.householdSize} people`],
                ["🚚 Preferred Delivery", user.deliveryOption],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0ece6" }}>
                  <span style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif" }}>{k}</span>
                  <span style={{ fontSize: 13, color: "#333", fontFamily: "sans-serif", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Order History */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a3a08", marginBottom: 16, fontFamily: "sans-serif" }}>Order History</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "sans-serif" }}>
              <thead>
                <tr style={{ background: "#f7f4ef" }}>
                  {["Order ID", "Product", "Method", "Order Date", "Freshness", "Status", "Amount"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#555", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myOrders.map(o => (
                  <tr key={o.id} style={{ borderBottom: "1px solid #f0ece6" }}>
                    <td style={{ padding: "12px" }}><span style={{ fontWeight: 700, color: "#3a6020" }}>#{o.id}</span></td>
                    <td style={{ padding: "12px" }}>{o.product}</td>
                    <td style={{ padding: "12px" }}>{METHOD_MAP[o.method]}</td>
                    <td style={{ padding: "12px" }}>{o.date}</td>
                    <td style={{ padding: "12px" }}>{o.freshness}</td>
                    <td style={{ padding: "12px" }}><StatusBadge status={o.status} /></td>
                    <td style={{ padding: "12px", fontWeight: 700 }}>${o.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================================
// ORDER FLOW
// ============================================================
const OrderPage = ({ user, setPage, orders, setOrders }) => {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState(null);
  const [slot, setSlot] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const total = product ? product.price * qty : 0;

  const placeOrder = () => {
    const newOrder = {
      id: `EGG-100${orders.length + 2}`,
      customerId: user.id,
      customer: user.name,
      city: user.city,
      product: product.name,
      quantity: qty,
      method: method.id,
      status: method.id === "drone" ? "awaiting_approval" : method.id === "kiosk" ? "qr_ready" : "confirmed",
      date: new Date().toISOString().slice(0, 10),
      freshness: new Date().toISOString().slice(5, 10),
      amount: total,
      driverId: null,
      qrCode: method.id === "kiosk" ? `QR-NEW-${Math.floor(Math.random() * 9000 + 1000)}` : null,
    };
    setOrders(prev => [newOrder, ...prev]);
    setConfirmed(true);
  };

  if (confirmed) return (
    <div style={{ background: "#f7f4ef", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Card style={{ maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>✅</div>
        <h2 style={{ color: "#1a3a08", fontSize: 24, marginBottom: 8 }}>Order Confirmed!</h2>
        <p style={{ color: "#666", fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: 20 }}>
          Your eggs were packed fresh today. Freshness guarantee: under 10 days. Estimated delivery: <strong>{slot || "To be confirmed"}</strong>.
        </p>
        <div style={{ background: "#e8f0da", borderRadius: 10, padding: "14px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontFamily: "sans-serif", color: "#3a6020", lineHeight: 1.8 }}>
            <div>📦 {product?.name} × {qty}</div>
            <div>{method && METHOD_MAP[method.id]}</div>
            <div>💰 Total: ${total.toFixed(2)}</div>
          </div>
        </div>
        {method?.id === "drone" && (
          <div style={{ background: "#f4eafb", borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 13, color: "#8e44ad", fontFamily: "sans-serif" }}>
            🚁 Drone delivery is in manual review. An admin will approve your batch within 4 hours.
          </div>
        )}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setPage("dashboard")} style={{ flex: 1, background: "#3a6020", color: "#fff", border: "none", padding: 12, borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>View Dashboard</button>
          {method?.id === "kiosk" && <button onClick={() => setPage("kiosk")} style={{ flex: 1, background: "#2980b9", color: "#fff", border: "none", padding: 12, borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Get QR Code</button>}
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{ background: "#f7f4ef", minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, color: "#1a3a08", marginBottom: 6 }}>Order Ultra-Fresh Eggs</h1>
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {[1, 2, 3, 4].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= s ? "#3a6020" : "#ddd", color: step >= s ? "#fff" : "#aaa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>{s}</div>
                {s < 4 && <div style={{ width: 40, height: 2, background: step > s ? "#3a6020" : "#ddd" }} />}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 18, color: "#1a3a08", marginBottom: 16, fontFamily: "sans-serif" }}>Choose Your Pack</h2>
            <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
              {PRODUCTS.map(p => (
                <div key={p.id} onClick={() => setProduct(p)} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", cursor: "pointer", border: `2px solid ${product?.id === p.id ? "#3a6020" : "#f0ece6"}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#1a3a08", marginBottom: 4, fontFamily: "sans-serif" }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif" }}>{p.desc}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 20, color: "#3a6020" }}>${p.price}</div>
                    <span style={{ background: "#e8f0da", color: "#3a6020", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{p.badge}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 14, color: "#555", fontFamily: "sans-serif" }}>Quantity:</span>
              {[1, 2, 3].map(n => <button key={n} onClick={() => setQty(n)} style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${qty === n ? "#3a6020" : "#ddd"}`, background: qty === n ? "#3a6020" : "#fff", color: qty === n ? "#fff" : "#555", fontWeight: 700, cursor: "pointer" }}>{n}</button>)}
            </div>
            <button disabled={!product} onClick={() => setStep(2)} style={{ width: "100%", background: product ? "#3a6020" : "#ccc", color: "#fff", border: "none", padding: 14, borderRadius: 10, fontWeight: 700, cursor: product ? "pointer" : "not-allowed", fontSize: 15 }}>Next: Choose Delivery →</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 18, color: "#1a3a08", marginBottom: 16, fontFamily: "sans-serif" }}>Choose Delivery Method</h2>
            <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
              {DELIVERY_METHODS.map(m => (
                <div key={m.id} onClick={() => setMethod(m)} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", cursor: "pointer", border: `2px solid ${method?.id === m.id ? "#3a6020" : "#f0ece6"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "#1a3a08", fontFamily: "sans-serif" }}>{m.icon} {m.label}</div>
                      <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginTop: 4 }}>{m.note}</div>
                    </div>
                    {m.id === "drone" && <span style={{ background: "#f4eafb", color: "#8e44ad", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>Beta</span>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: "#fff", color: "#555", border: "1.5px solid #ddd", padding: 12, borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>← Back</button>
              <button disabled={!method} onClick={() => setStep(3)} style={{ flex: 2, background: method ? "#3a6020" : "#ccc", color: "#fff", border: "none", padding: 12, borderRadius: 10, fontWeight: 700, cursor: method ? "pointer" : "not-allowed", fontSize: 14 }}>Next: Schedule →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 18, color: "#1a3a08", marginBottom: 16, fontFamily: "sans-serif" }}>Choose Delivery Slot</h2>
            <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
              {SLOTS.map(s => (
                <div key={s} onClick={() => setSlot(s)} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", cursor: "pointer", border: `2px solid ${slot === s ? "#3a6020" : "#f0ece6"}`, fontFamily: "sans-serif", fontWeight: slot === s ? 700 : 400, color: slot === s ? "#3a6020" : "#333", fontSize: 14 }}>
                  📅 {s}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, background: "#fff", color: "#555", border: "1.5px solid #ddd", padding: 12, borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <button disabled={!slot} onClick={() => setStep(4)} style={{ flex: 2, background: slot ? "#3a6020" : "#ccc", color: "#fff", border: "none", padding: 12, borderRadius: 10, fontWeight: 700, cursor: slot ? "pointer" : "not-allowed" }}>Next: Review →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 18, color: "#1a3a08", marginBottom: 16, fontFamily: "sans-serif" }}>Review & Confirm</h2>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ display: "grid", gap: 10, fontFamily: "sans-serif" }}>
                {[
                  ["Product", `${product?.name} × ${qty}`],
                  ["Delivery Method", method && METHOD_MAP[method.id]],
                  ["Slot", slot],
                  ["Delivery Address", user.address],
                  ["Freshness Guarantee", "Under 10 days from pack date ✅"],
                  ["Total", `$${total.toFixed(2)}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f0ece6", paddingBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "#888" }}>{k}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>
            <div style={{ background: "#f7f4ef", borderRadius: 10, padding: "14px 18px", marginBottom: 16, fontSize: 13, color: "#888", fontFamily: "sans-serif" }}>
              💳 Payment placeholder — in production this connects to Stripe or Square. For beta, orders are pre-authorized.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(3)} style={{ flex: 1, background: "#fff", color: "#555", border: "1.5px solid #ddd", padding: 12, borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <button onClick={placeOrder} style={{ flex: 2, background: "#3a6020", color: "#fff", border: "none", padding: 12, borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Place Order 🥚</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// KIOSK QR FLOW
// ============================================================
const KioskPage = ({ user, orders, setOrders }) => {
  const kioskOrder = orders.find(o => o.customerId === user.id && o.method === "kiosk" && o.status === "qr_ready");
  const [redeemed, setRedeemed] = useState(false);

  const redeem = () => {
    setOrders(prev => prev.map(o => o.id === kioskOrder?.id ? { ...o, status: "delivered" } : o));
    setRedeemed(true);
  };

  if (!kioskOrder && !redeemed) return (
    <div style={{ background: "#f7f4ef", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Card style={{ maxWidth: 400, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
        <h2 style={{ color: "#1a3a08" }}>No Kiosk Orders Ready</h2>
        <p style={{ color: "#888", fontFamily: "sans-serif" }}>You have no kiosk pickup orders with a QR code ready. Place a kiosk pickup order first.</p>
      </Card>
    </div>
  );

  if (redeemed) return (
    <div style={{ background: "#f7f4ef", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Card style={{ maxWidth: 400, textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>✅</div>
        <h2 style={{ color: "#1a3a08" }}>Picked Up Successfully!</h2>
        <p style={{ color: "#666", fontFamily: "sans-serif", lineHeight: 1.7 }}>Your order has been marked as picked up. Enjoy your ultra-fresh eggs!</p>
        <div style={{ marginTop: 16, background: "#e8f0da", borderRadius: 10, padding: 14, fontSize: 14, color: "#3a6020", fontFamily: "sans-serif" }}>
          Freshness: guaranteed under 10 days from pack date 🥚
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{ background: "#f7f4ef", minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, color: "#1a3a08", textAlign: "center", marginBottom: 24 }}>Kiosk Pickup</h1>
        <Card style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: "#888", fontFamily: "sans-serif", marginBottom: 8 }}>Order #{kioskOrder.id}</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#1a3a08", marginBottom: 4 }}>{kioskOrder.product}</div>
          <StatusBadge status="qr_ready" />

          {/* Fake QR Code visual */}
          <div style={{ margin: "20px auto", width: 160, height: 160, background: "#fff", border: "3px solid #1a3a08", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, padding: 8 }}>
              {Array.from({ length: 49 }).map((_, i) => {
                const code = kioskOrder.qrCode || "QR";
                const on = (i + code.charCodeAt(i % code.length)) % 3 !== 0;
                return <div key={i} style={{ width: 10, height: 10, background: on ? "#1a3a08" : "#fff", borderRadius: 1 }} />;
              })}
            </div>
            <div style={{ position: "absolute", bottom: -24, fontSize: 12, fontWeight: 700, color: "#2980b9", fontFamily: "monospace", letterSpacing: 1 }}>{kioskOrder.qrCode}</div>
          </div>

          <div style={{ marginTop: 32, background: "#eaf4fb", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: "#2980b9", marginBottom: 6, fontSize: 14 }}>📍 Pickup Location</div>
            <div style={{ fontSize: 13, color: "#555", fontFamily: "sans-serif" }}>Smart Locker – {kioskOrder.city === "Miami" ? "Miami Brickell" : "Orlando Downtown"}</div>
            <div style={{ fontSize: 13, color: "#555", fontFamily: "sans-serif" }}>{kioskOrder.city === "Miami" ? "801 Brickell Bay Dr, Miami, FL" : "150 E Church St, Orlando, FL"}</div>
          </div>

          <div style={{ background: "#fef9f0", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: "#e67e22", fontFamily: "sans-serif" }}>
            ⏰ QR code expires in 48 hours from issuance
          </div>

          <button onClick={redeem} style={{ width: "100%", background: "#3a6020", color: "#fff", border: "none", padding: 14, borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
            Scan & Redeem QR Code
          </button>
        </Card>

        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1a3a08", marginBottom: 12, fontFamily: "sans-serif" }}>Pickup Instructions</h3>
          {["Go to the smart locker location", "Tap 'Scan QR Code' on the kiosk screen", "Hold your phone QR code up to the reader", "Locker D-14 will open automatically", "Retrieve your egg carton — goodbye grocery eggs!"].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#3a6020", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 13, color: "#555", fontFamily: "sans-serif", lineHeight: 1.5 }}>{step}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ============================================================
// ADMIN DASHBOARD
// ============================================================
const AdminPage = ({ orders, setOrders }) => {
  const [tab, setTab] = useState("new");
  const [notifications, setNotifications] = useState({});

  const tabs = [
    { id: "new", label: "New Orders" },
    { id: "truck", label: "🚚 Truck Queue" },
    { id: "drone", label: "🚁 Drone Queue" },
    { id: "kiosk", label: "📦 Kiosk Queue" },
    { id: "completed", label: "✅ Completed" },
  ];

  const filterOrders = () => {
    if (tab === "new") return orders.filter(o => ["confirmed", "awaiting_approval"].includes(o.status));
    if (tab === "truck") return orders.filter(o => o.method === "truck" && o.status !== "delivered");
    if (tab === "drone") return orders.filter(o => o.method === "drone");
    if (tab === "kiosk") return orders.filter(o => o.method === "kiosk");
    if (tab === "completed") return orders.filter(o => o.status === "delivered");
    return orders;
  };

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const assignDriver = (id, driver) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, driverId: driver } : o));
  };

  const filtered = filterOrders();

  return (
    <div style={{ background: "#f7f4ef", minHeight: "100vh", padding: "28px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, color: "#1a3a08", marginBottom: 4 }}>Admin – Order Dashboard</h1>
            <p style={{ color: "#888", fontFamily: "sans-serif", fontSize: 14 }}>Manage delivery queues, assign drivers, and track all orders.</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "Total Orders", value: orders.length, color: "#3a6020" },
              { label: "Active", value: orders.filter(o => o.status !== "delivered").length, color: "#e67e22" },
              { label: "Delivered", value: orders.filter(o => o.status === "delivered").length, color: "#27ae60" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 10, padding: "10px 16px", textAlign: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 11, color: "#888", fontFamily: "sans-serif" }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${tab === t.id ? "#3a6020" : "#ddd"}`, background: tab === t.id ? "#3a6020" : "#fff", color: tab === t.id ? "#fff" : "#555", fontWeight: 600, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>{t.label}</button>
          ))}
        </div>

        <Card>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontFamily: "sans-serif" }}>No orders in this queue.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "sans-serif" }}>
                <thead>
                  <tr style={{ background: "#f7f4ef" }}>
                    {["Order ID", "Customer", "City", "Product", "Method", "Status", "Date", "Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#555", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => (
                    <tr key={o.id} style={{ borderBottom: "1px solid #f0ece6" }}>
                      <td style={{ padding: "12px" }}><span style={{ fontWeight: 700, color: "#3a6020" }}>#{o.id}</span></td>
                      <td style={{ padding: "12px" }}>{o.customer}</td>
                      <td style={{ padding: "12px" }}>{o.city}</td>
                      <td style={{ padding: "12px" }}>{o.product}</td>
                      <td style={{ padding: "12px" }}>{METHOD_MAP[o.method]}</td>
                      <td style={{ padding: "12px" }}><StatusBadge status={o.status} /></td>
                      <td style={{ padding: "12px" }}>{o.date}</td>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {o.status === "awaiting_approval" && <button onClick={() => updateStatus(o.id, "confirmed")} style={{ ...miniBtn, background: "#e8f0da", color: "#3a6020" }}>Approve</button>}
                          {["confirmed", "awaiting_approval"].includes(o.status) && o.method === "truck" && <button onClick={() => updateStatus(o.id, "out_for_delivery")} style={{ ...miniBtn, background: "#fef3e2", color: "#e67e22" }}>Dispatch</button>}
                          {o.status === "out_for_delivery" && <button onClick={() => updateStatus(o.id, "delivered")} style={{ ...miniBtn, background: "#e8f8ef", color: "#27ae60" }}>Mark Delivered</button>}
                          {o.method === "truck" && !o.driverId && o.status !== "delivered" && (
                            <select onChange={e => assignDriver(o.id, e.target.value)} style={{ ...miniBtn, cursor: "pointer" }}>
                              <option value="">Assign Driver</option>
                              {["D-01 James", "D-02 Sarah", "D-03 Mike", "D-04 Lisa"].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          )}
                          {o.driverId && <span style={{ fontSize: 11, color: "#888" }}>Driver: {o.driverId}</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Customer Signups */}
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, color: "#1a3a08", marginBottom: 16 }}>Customer Signups</h2>
          <Card>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "sans-serif" }}>
                <thead>
                  <tr style={{ background: "#f7f4ef" }}>
                    {["Customer", "Email", "Phone", "City", "Eligibility", "Joined"].map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#555" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CUSTOMERS.map(c => (
                    <tr key={c.id} style={{ borderBottom: "1px solid #f0ece6" }}>
                      <td style={{ padding: "12px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name={c.name} size={28} color="#3a6020" />{c.name}</div></td>
                      <td style={{ padding: "12px", color: "#2980b9" }}>{c.email}</td>
                      <td style={{ padding: "12px" }}>{c.phone}</td>
                      <td style={{ padding: "12px" }}>{c.city}</td>
                      <td style={{ padding: "12px" }}><StatusBadge status={c.eligibility === "home_delivery" ? "confirmed" : c.eligibility === "kiosk_pickup" ? "qr_ready" : c.eligibility === "drone_waitlist" ? "awaiting_approval" : "outside_radius"} /></td>
                      <td style={{ padding: "12px" }}>{c.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const miniBtn = { padding: "5px 10px", borderRadius: 6, border: "1px solid #ddd", cursor: "pointer", fontSize: 12, fontWeight: 600, background: "#f7f4ef", color: "#555" };

// ============================================================
// NOTIFICATIONS
// ============================================================
const NotificationsPage = () => {
  const ICONS = { email: "📧", sms: "📱" };
  const COLORS = { email: { bg: "#eaf4fb", border: "#b5d4f4", label: "#2980b9" }, sms: { bg: "#fef9f0", border: "#fac775", label: "#c0392b" } };

  return (
    <div style={{ background: "#f7f4ef", minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, color: "#1a3a08", marginBottom: 8 }}>Notification Center</h1>
          <p style={{ color: "#888", fontFamily: "sans-serif" }}>Simulated transactional messages — showing how FreshNest communicates with customers at every step.</p>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          {MOCK_NOTIFICATIONS.map(n => {
            const c = COLORS[n.type];
            return (
              <div key={n.id} style={{ background: c.bg, borderRadius: 14, padding: "18px 20px", border: `1.5px solid ${c.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{ICONS[n.type]}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#1a3a08", fontFamily: "sans-serif" }}>{n.title}</div>
                      <span style={{ background: c.label, color: "#fff", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                        {n.type === "email" ? "Email" : "SMS"}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: "#aaa", fontFamily: "sans-serif", whiteSpace: "nowrap", marginLeft: 12 }}>{n.time}</span>
                </div>
                <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7, fontFamily: "sans-serif", margin: 0 }}>{n.body}</p>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 24, background: "#fff8f0", borderRadius: 12, padding: "16px 20px", border: "1px solid #f0d8b8", fontSize: 13, color: "#8b5e2a", fontFamily: "sans-serif" }}>
          <strong>Production note:</strong> In production, emails connect via SendGrid or Postmark. SMS sends via Twilio. Notification templates are stored in Supabase and triggered by order status webhooks via serverless functions.
        </div>
      </div>
    </div>
  );
};

// ============================================================
// GREAT EGGSCAPE
// ============================================================
const EggscapePage = ({ user, setPage }) => {
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [eggs, setEggs] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const gameRef = useRef(null);
  const timerRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setPlaying(true);
    setGameActive(true);
    spawnEgg();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPlaying(false); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const spawnEgg = () => {
    const id = Date.now();
    const x = Math.random() * 80 + 5;
    const y = Math.random() * 70 + 10;
    setEggs(e => [...e, { id, x, y }]);
    if (playing || timeLeft > 0) setTimeout(spawnEgg, 1200 + Math.random() * 800);
  };

  const catchEgg = (id) => {
    setEggs(e => e.filter(eg => eg.id !== id));
    setScore(s => s + 10);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div style={{ background: "linear-gradient(135deg, #fff8e8, #e8f5da)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #c0392b, #e74c3c)", padding: "50px 24px", textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>🥚🏃</div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 50px)", fontWeight: 900, marginBottom: 12, letterSpacing: "-1px" }}>The Great Eggscape</h1>
        <p style={{ fontSize: 17, opacity: 0.9, maxWidth: 520, margin: "0 auto 28px", fontFamily: "sans-serif" }}>
          Catch runaway eggs, share your breakfast story, and earn points for beta perks, discounts, and early access.
        </p>
        {!user && <button onClick={() => setPage("signup")} style={{ background: "#fff", color: "#c0392b", border: "none", padding: "14px 30px", borderRadius: 12, fontWeight: 800, cursor: "pointer", fontSize: 15 }}>Join to Earn Rewards →</button>}
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        {/* Mini Game */}
        <Card style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, color: "#1a3a08", marginBottom: 8 }}>🎮 Catch the Runaway Eggs!</h2>
          <p style={{ color: "#888", fontFamily: "sans-serif", marginBottom: 16, fontSize: 14 }}>Tap the eggs before they escape. Earn 10 Eggscape Points per catch. Score 100+ to unlock a discount.</p>

          {!gameActive ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <button onClick={startGame} style={{ background: "#c0392b", color: "#fff", border: "none", padding: "14px 32px", borderRadius: 12, fontWeight: 800, cursor: "pointer", fontSize: 16 }}>🥚 Start Game</button>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontFamily: "sans-serif" }}>
                <span style={{ fontWeight: 700, color: "#3a6020" }}>Score: {score} pts</span>
                <span style={{ fontWeight: 700, color: timeLeft < 6 ? "#c0392b" : "#555" }}>⏱ {timeLeft}s</span>
              </div>
              <div ref={gameRef} style={{ position: "relative", background: "linear-gradient(135deg, #e8f0da, #f7f4ef)", borderRadius: 16, height: 200, overflow: "hidden", border: "2px solid #d0e0b8", cursor: "crosshair" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#c8d8a8", fontSize: 12, fontFamily: "sans-serif" }}>
                  {!playing && timeLeft === 0 ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#1a3a08" }}>Game Over! {score} pts</div>
                      {score >= 100 && <div style={{ color: "#c0392b", fontWeight: 700, marginTop: 6 }}>🎉 10% Discount Unlocked!</div>}
                      <button onClick={startGame} style={{ marginTop: 12, background: "#3a6020", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Play Again</button>
                    </div>
                  ) : null}
                </div>
                {playing && eggs.map(egg => (
                  <div key={egg.id} onClick={() => catchEgg(egg.id)} style={{ position: "absolute", left: `${egg.x}%`, top: `${egg.y}%`, fontSize: 28, cursor: "pointer", transition: "all 0.1s", userSelect: "none", animation: "wiggle 0.5s infinite" }}>🥚</div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Earn Points */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { icon: "🎮", action: "Play mini-game", pts: "+10/catch", color: "#c0392b" },
            { icon: "📸", action: "Upload breakfast photo", pts: "+200 pts", color: "#e67e22" },
            { icon: "📖", action: "Share your egg story", pts: "+150 pts", color: "#27ae60" },
            { icon: "👥", action: "Refer a friend", pts: "+500 pts", color: "#2980b9" },
          ].map(item => (
            <Card key={item.action} style={{ textAlign: "center", border: `2px solid ${item.color}22` }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1a3a08", marginBottom: 4, fontFamily: "sans-serif" }}>{item.action}</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: item.color }}>{item.pts}</div>
            </Card>
          ))}
        </div>

        {/* Leaderboard */}
        <Card style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, color: "#1a3a08", marginBottom: 16 }}>🏆 Leaderboard</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {MOCK_LEADERBOARD.map(l => (
              <div key={l.rank} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: l.rank === 1 ? "#fef9f0" : "#fff", borderRadius: 10, border: l.rank === 1 ? "2px solid #f0ad4e" : "1px solid #f0ece6" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: l.rank <= 3 ? ["#f0ad4e", "#ccc", "#cd7f32"][l.rank - 1] : "#e8f0da", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: l.rank <= 3 ? "#fff" : "#3a6020" }}>{l.rank}</div>
                <Avatar name={l.name} size={36} color="#5a7a3a" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "sans-serif" }}>{l.name}</div>
                  <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif" }}>{l.city}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#c0392b" }}>{l.points} pts</div>
                  <div style={{ fontSize: 11, color: "#888", fontFamily: "sans-serif" }}>{l.reward}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* UGC Upload */}
        <UGCUpload />
      </div>
    </div>
  );
};

// ============================================================
// UGC UPLOAD
// ============================================================
const UGCUpload = () => {
  const [ugc, setUgc] = useState(MOCK_UGC);
  const [form, setForm] = useState({ caption: "", city: "Orlando", handle: "" });
  const [submitted, setSubmitted] = useState(false);
  const update = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    if (!form.caption) return;
    setUgc(prev => [{ id: Date.now(), user: "You", city: form.city, handle: form.handle, caption: form.caption, approved: false, date: "Today" }, ...prev]);
    setSubmitted(true);
  };

  const PLACEHOLDER_COLORS = ["#e8f0da", "#fef9f0", "#eaf4fb", "#f4eafb", "#f7f4ef", "#e8f8ef"];

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, color: "#1a3a08", marginBottom: 8 }}>📸 Share Your Breakfast Story</h2>
        <p style={{ color: "#888", fontFamily: "sans-serif", fontSize: 14, marginBottom: 16 }}>Upload a photo and caption to earn 200 Eggscape Points.</p>
        {!submitted ? (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ background: "#f7f4ef", borderRadius: 10, border: "2px dashed #d0c8bc", padding: "28px 20px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
              <div style={{ fontFamily: "sans-serif", color: "#888", fontSize: 14 }}>Click to upload your breakfast photo</div>
              <div style={{ fontFamily: "sans-serif", color: "#aaa", fontSize: 12, marginTop: 4 }}>JPG, PNG up to 10MB (mock upload — no real file transfer)</div>
            </div>
            <textarea value={form.caption} onChange={update("caption")} placeholder="Tell us about your fresh egg experience..." style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>City</label>
                <select value={form.city} onChange={update("city")} style={inputStyle}><option>Orlando</option><option>Miami</option></select>
              </div>
              <div>
                <label style={labelStyle}>Social Handle</label>
                <input value={form.handle} onChange={update("handle")} style={inputStyle} placeholder="@yourhandle" />
              </div>
            </div>
            <button onClick={submit} style={{ background: "#c0392b", color: "#fff", border: "none", padding: 14, borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Submit & Earn 200 Points 🥚</button>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
            <div style={{ fontWeight: 700, color: "#3a6020", fontSize: 16 }}>Submission received! +200 Eggscape Points</div>
            <div style={{ color: "#888", fontFamily: "sans-serif", fontSize: 13, marginTop: 6 }}>Under admin review. Approved entries appear in the gallery.</div>
          </div>
        )}
      </Card>

      {/* Gallery */}
      <h2 style={{ fontSize: 20, color: "#1a3a08", marginBottom: 16 }}>🖼 Community Gallery</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {ugc.filter(u => u.approved).map((u, i) => (
          <Card key={u.id}>
            <div style={{ height: 120, borderRadius: 10, background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, marginBottom: 12 }}>🍳</div>
            <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, fontStyle: "italic", fontFamily: "Georgia, serif", marginBottom: 10 }}>"{u.caption}"</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "sans-serif" }}>{u.user}</div>
                <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif" }}>{u.handle} · {u.city}</div>
              </div>
              <div style={{ fontSize: 11, color: "#aaa", fontFamily: "sans-serif" }}>{u.date}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// ADMIN MARKETING DASHBOARD
// ============================================================
const AdminMarketingPage = () => {
  const [entries, setEntries] = useState(MOCK_UGC);

  const toggle = (id) => setEntries(prev => prev.map(e => e.id === id ? { ...e, approved: !e.approved } : e));

  return (
    <div style={{ background: "#f7f4ef", minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, color: "#1a3a08", marginBottom: 24 }}>Admin – Great Eggscape Dashboard</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total Uploads", value: entries.length, icon: "📸" },
            { label: "Approved", value: entries.filter(e => e.approved).length, icon: "✅" },
            { label: "Pending", value: entries.filter(e => !e.approved).length, icon: "⏳" },
            { label: "Game Plays", value: "142", icon: "🎮" },
            { label: "Referrals", value: "38", icon: "👥" },
            { label: "Beta Signups", value: MOCK_CUSTOMERS.length, icon: "🌾" },
          ].map(s => (
            <Card key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1a3a08", fontFamily: "sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif" }}>{s.label}</div>
            </Card>
          ))}
        </div>

        <Card>
          <h2 style={{ fontSize: 18, color: "#1a3a08", marginBottom: 16 }}>UGC Submissions</h2>
          <div style={{ display: "grid", gap: 14 }}>
            {entries.map(e => (
              <div key={e.id} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: `1.5px solid ${e.approved ? "#b8d8a0" : "#f0ece6"}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <Avatar name={e.user} size={32} color="#5a7a3a" />
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 14, fontFamily: "sans-serif" }}>{e.user}</span>
                      <span style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif", marginLeft: 6 }}>{e.handle} · {e.city} · {e.date}</span>
                    </div>
                    <span style={{ background: e.approved ? "#e8f8ef" : "#fef9f0", color: e.approved ? "#27ae60" : "#e67e22", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                      {e.approved ? "Approved" : "Pending Review"}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "#555", fontStyle: "italic", fontFamily: "Georgia, serif", margin: 0 }}>"{e.caption}"</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => toggle(e.id)} style={{ ...miniBtn, background: e.approved ? "#fdf2f0" : "#e8f8ef", color: e.approved ? "#c0392b" : "#27ae60" }}>
                    {e.approved ? "Reject" : "Approve"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const renderPage = () => {
    if (page === "landing") return <LandingPage setPage={setPage} />;
    if (page === "signup") return <SignupPage setPage={setPage} />;
    if (page === "login") return <LoginPage setUser={setUser} setPage={setPage} setAdminMode={setAdminMode} />;
    if (page === "dashboard") return user ? <DashboardPage user={user} setPage={setPage} orders={orders} setOrders={setOrders} /> : <LoginPage setUser={setUser} setPage={setPage} setAdminMode={setAdminMode} />;
    if (page === "order") return user ? <OrderPage user={user} setPage={setPage} orders={orders} setOrders={setOrders} /> : <LoginPage setUser={setUser} setPage={setPage} setAdminMode={setAdminMode} />;
    if (page === "kiosk") return user ? <KioskPage user={user} orders={orders} setOrders={setOrders} /> : <LoginPage setUser={setUser} setPage={setPage} setAdminMode={setAdminMode} />;
    if (page === "admin") return <AdminPage orders={orders} setOrders={setOrders} />;
    if (page === "notifications") return <NotificationsPage />;
    if (page === "eggscape") return <EggscapePage user={user} setPage={setPage} />;
    if (page === "adminmarketing") return <AdminMarketingPage />;
    return <LandingPage setPage={setPage} />;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4ef", fontFamily: "Georgia, serif" }}>
      <Nav page={page} setPage={setPage} user={user} setUser={setUser} adminMode={adminMode} setAdminMode={setAdminMode} />

      {/* Extra nav for non-auth pages */}
      {!user && (
        <div style={{ background: "#1a3a08", padding: "8px 24px", display: "flex", gap: 16, justifyContent: "center", overflowX: "auto" }}>
          {[
            { id: "landing", label: "Home" },
            { id: "signup", label: "Join Beta" },
            { id: "eggscape", label: "🎮 Eggscape" },
            { id: "notifications", label: "Notifications" },
          ].map(p => (
            <button key={p.id} onClick={() => setPage(p.id)} style={{ background: page === p.id ? "#3a6020" : "transparent", color: "#d0e8a0", border: `1px solid ${page === p.id ? "#5a9040" : "transparent"}`, padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>{p.label}</button>
          ))}
        </div>
      )}

      {user && (
        <div style={{ background: "#1a3a08", padding: "8px 24px", display: "flex", gap: 16, justifyContent: "center", overflowX: "auto" }}>
          {[
            { id: "dashboard", label: "📊 Dashboard" },
            { id: "order", label: "🛒 Order" },
            { id: "kiosk", label: "📦 Kiosk Pickup" },
            { id: "notifications", label: "🔔 Notifications" },
            { id: "eggscape", label: "🎮 Eggscape" },
            ...(adminMode ? [{ id: "admin", label: "⚙️ Admin Orders" }, { id: "adminmarketing", label: "📣 Admin Marketing" }] : []),
          ].map(p => (
            <button key={p.id} onClick={() => setPage(p.id)} style={{ background: page === p.id ? "#3a6020" : "transparent", color: "#d0e8a0", border: `1px solid ${page === p.id ? "#5a9040" : "transparent"}`, padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>{p.label}</button>
          ))}
        </div>
      )}

      <main>{renderPage()}</main>

      <footer style={{ background: "#0f2006", padding: "28px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 24 }}>🥚</span>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>FreshNest Farms</span>
        </div>
        <p style={{ color: "#5a8040", fontFamily: "sans-serif", fontSize: 13, margin: 0 }}>
          Ultra-fresh eggs · Orlando & Miami Beta · Family-owned since 1987
        </p>
        <p style={{ color: "#3a5030", fontFamily: "sans-serif", fontSize: 12, marginTop: 6 }}>
          📍 Production stack: React · Supabase · Twilio · SendGrid · Stripe · Google Maps API · QR library · Drone dispatch API
        </p>
      </footer>
    </div>
  );
}
