const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) return;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

loadEnvFile();

const PORT = Number(process.env.PORT || 5500);
const HOST = process.env.HOST || "127.0.0.1";
const ADMIN_PASSWORD = process.env.STONEHORN_ADMIN_PASSWORD || "stonehorn-admin";
const ADMIN_LOGIN_EMAIL = (process.env.STONEHORN_ADMIN_EMAIL || "admin@stonehorn.local").toLowerCase();
const WORKER_PASSWORD = process.env.STONEHORN_WORKER_PASSWORD || "stonehorn-worker";
const WORKER_LOGIN_EMAIL = (process.env.STONEHORN_WORKER_EMAIL || "worker@stonehorn.local").toLowerCase();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const ORDER_EMAIL_FROM = process.env.ORDER_EMAIL_FROM || "";
const ORDER_EMAIL_REPLY_TO = process.env.ORDER_EMAIL_REPLY_TO || "";
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || `http://${HOST}:${PORT}`;
const EMAIL_LOGO_URL = process.env.EMAIL_LOGO_URL || `${PUBLIC_BASE_URL}/archive-6.png`;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const UPLOAD_DIR = path.join(ROOT, "uploads");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const DROP_SUBSCRIBERS_FILE = path.join(DATA_DIR, "drop-subscribers.json");
const INVENTORY_FILE = path.join(DATA_DIR, "inventory.json");
const PRICES_FILE = path.join(DATA_DIR, "prices.json");

const PRODUCT_CATALOG = [
  "Black Leather Patch Hat",
  "Embroidered Text Hat",
  "Black Ibex Logo Hat",
  "Blue Rope Hat",
  "Cream Badge Hat",
  "Black Gold Ibex Hat",
  "Cream Backcountry Patch Hat",
  "Black Forest Hoodie",
  "Green Brush Hoodie",
  "Earth Tone Hoodie",
  "Black Quilted Jacket",
  "Bragging Board Entry",
];

const DEFAULT_PRICES = {
  "Black Leather Patch Hat": 42,
  "Embroidered Text Hat": 42,
  "Black Ibex Logo Hat": 42,
  "Blue Rope Hat": 42,
  "Cream Badge Hat": 42,
  "Black Gold Ibex Hat": 42,
  "Cream Backcountry Patch Hat": 42,
  "Black Forest Hoodie": 68,
  "Green Brush Hoodie": 68,
  "Earth Tone Hoodie": 68,
  "Black Quilted Jacket": 92,
  "Bragging Board Entry": 25,
};

ensureDir(DATA_DIR);
ensureDir(UPLOAD_DIR);
ensureJsonFile(SUBMISSIONS_FILE, []);
ensureJsonFile(SESSIONS_FILE, {});
ensureJsonFile(ORDERS_FILE, []);
ensureJsonFile(USERS_FILE, []);
ensureJsonFile(DROP_SUBSCRIBERS_FILE, []);
ensureJsonFile(INVENTORY_FILE, {});
ensureJsonFile(PRICES_FILE, {});

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function ensureJsonFile(filePath, fallbackData) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallbackData, null, 2));
  }
}

function readJson(filePath, fallbackData) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallbackData;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(String(password || "")).digest("hex");
}

function sanitizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getEmailLogoSrc() {
  return EMAIL_LOGO_URL;
}

function getSoldCountsByItem() {
  const orders = readJson(ORDERS_FILE, []);
  const sold = {};
  orders
    .filter((order) => order.status === "paid")
    .forEach((order) => {
      if (Array.isArray(order.cartItems) && order.cartItems.length) {
        order.cartItems.forEach((entry) => {
          const item = String(entry.item || "").trim();
          const quantity = Math.max(1, Number(entry.quantity || 1));
          if (!item) return;
          sold[item] = (sold[item] || 0) + quantity;
        });
        return;
      }
      const item = String(order.item || "").trim();
      const quantity = Math.max(1, Number(order.quantity || 1));
      if (!item) return;
      sold[item] = (sold[item] || 0) + quantity;
    });
  return sold;
}

function getInventorySnapshot() {
  const raw = readJson(INVENTORY_FILE, {});
  const sold = getSoldCountsByItem();
  const allItems = Array.from(new Set([...PRODUCT_CATALOG, ...Object.keys(raw || {}), ...Object.keys(sold || {})]));
  return allItems.map((item) => {
    const stockRaw = raw?.[item]?.stock;
    const stock = Number.isFinite(stockRaw) ? Math.max(0, Math.floor(stockRaw)) : null;
    const soldQty = Math.max(0, Math.floor(Number(sold[item] || 0)));
    const remaining = stock === null ? null : Math.max(0, stock - soldQty);
    return {
      item,
      stock,
      sold: soldQty,
      remaining,
      inStock: stock === null ? true : remaining > 0,
      lowStock: stock !== null && remaining > 0 && remaining <= 5,
    };
  });
}

function getPriceMap() {
  const raw = readJson(PRICES_FILE, {});
  const merged = { ...DEFAULT_PRICES };
  Object.entries(raw || {}).forEach(([item, value]) => {
    const price = Number(value);
    if (Number.isFinite(price) && price > 0) {
      merged[String(item)] = Number(price.toFixed(2));
    }
  });
  return merged;
}

function parseCookies(header = "") {
  const cookies = {};
  header.split(";").forEach((part) => {
    const [k, ...v] = part.trim().split("=");
    if (!k) return;
    cookies[k] = decodeURIComponent(v.join("="));
  });
  return cookies;
}

function json(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function text(res, status, message) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(message);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 10 * 1024 * 1024) {
        reject(new Error("Request too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function parseStripeSignature(header = "") {
  const parts = header.split(",").map((p) => p.trim());
  const out = { t: "", v1: "" };
  parts.forEach((part) => {
    const [k, v] = part.split("=");
    if (k === "t") out.t = v || "";
    if (k === "v1") out.v1 = v || "";
  });
  return out;
}

function verifyStripeWebhookSignature(payload, signatureHeader, secret) {
  if (!secret) return false;
  const { t, v1 } = parseStripeSignature(signatureHeader);
  if (!t || !v1) return false;
  const signedPayload = `${t}.${payload}`;
  const digest = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  const a = Buffer.from(digest, "utf8");
  const b = Buffer.from(v1, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

async function stripeRequest(method, pathname, params) {
  if (!STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY.");
  }
  const url = `https://api.stripe.com${pathname}`;
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
    },
  };
  if (params) {
    options.headers["Content-Type"] = "application/x-www-form-urlencoded";
    options.body = new URLSearchParams(params).toString();
  }
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || "Stripe API request failed");
  }
  return data;
}

async function sendOrderConfirmationEmail({ to, item, amountTotalCents, orderId, braggingEntryUrl = "" }) {
  if (!RESEND_API_KEY || !ORDER_EMAIL_FROM || !to) {
    return { sent: false, skipped: true, reason: "Email provider not configured." };
  }

  const amount = (Number(amountTotalCents || 0) / 100).toFixed(2);
  const subject = `Stonehorn Order Confirmed - ${item}`;
  const logoUrl = getEmailLogoSrc();
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.45;color:#1a1a1a">
      <p style="margin:0 0 14px">
        <img src="${logoUrl}" alt="Stonehorn" style="width:96px;height:96px;object-fit:contain;display:block" />
      </p>
      <h2 style="margin:0 0 10px">Thank you for your order.</h2>
      <p>Your Stonehorn payment was confirmed.</p>
      <p><strong>Item:</strong> ${item}</p>
      <p><strong>Total:</strong> $${amount}</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      ${
        braggingEntryUrl
          ? `<p><a href="${braggingEntryUrl}" style="color:#111;font-weight:700">Submit your Bragging Board entry</a></p>`
          : ""
      }
      <p>We will send shipping updates as soon as your order is packed.</p>
    </div>
  `;

  const payload = {
    from: ORDER_EMAIL_FROM,
    to: [to],
    subject,
    html,
  };
  if (ORDER_EMAIL_REPLY_TO) {
    payload.reply_to = ORDER_EMAIL_REPLY_TO;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { sent: false, skipped: false, error: data?.message || "Email API failed." };
  }
  return { sent: true, id: data.id || "" };
}

async function sendDropUpdateEmail({ to, subject, message, imageUrl = "" }) {
  if (!RESEND_API_KEY || !ORDER_EMAIL_FROM || !to) {
    return { sent: false, skipped: true, reason: "Email provider not configured." };
  }

  const logoUrl = getEmailLogoSrc();
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.45;color:#1a1a1a">
      <p style="margin:0 0 14px">
        <img src="${logoUrl}" alt="Stonehorn" style="width:96px;height:96px;object-fit:contain;display:block" />
      </p>
      <h2 style="margin:0 0 10px">Stonehorn Product Drop</h2>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      ${
        imageUrl
          ? `<p style="margin:14px 0"><img src="${imageUrl}" alt="Stonehorn product drop" style="max-width:100%;height:auto;border:1px solid #ddd" /></p>`
          : ""
      }
      <p><a href="${PUBLIC_BASE_URL}" style="color:#111;font-weight:700">Shop the latest Stonehorn drop</a></p>
    </div>
  `;

  const payload = {
    from: ORDER_EMAIL_FROM,
    to: [to],
    subject,
    html,
  };
  if (ORDER_EMAIL_REPLY_TO) {
    payload.reply_to = ORDER_EMAIL_REPLY_TO;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { sent: false, error: data?.message || "Email API failed." };
  }
  return { sent: true, id: data.id || "" };
}

async function sendShippingUpdateEmail({ to, item, orderId, carrier, trackingNumber }) {
  if (!RESEND_API_KEY || !ORDER_EMAIL_FROM || !to) {
    return { sent: false, skipped: true, reason: "Email provider not configured." };
  }

  const trackingUrl = trackingNumber
    ? `https://www.google.com/search?q=${encodeURIComponent(`${carrier} ${trackingNumber}`)}`
    : "";
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.45;color:#1a1a1a">
      <h2 style="margin:0 0 10px">Your Stonehorn order has shipped.</h2>
      <p><strong>Item:</strong> ${escapeHtml(item || "Stonehorn Item")}</p>
      <p><strong>Order ID:</strong> ${escapeHtml(orderId || "")}</p>
      <p><strong>Carrier:</strong> ${escapeHtml(carrier || "N/A")}</p>
      <p><strong>Tracking:</strong> ${escapeHtml(trackingNumber || "N/A")}</p>
      ${trackingUrl ? `<p><a href="${trackingUrl}" style="color:#111;font-weight:700">Track your shipment</a></p>` : ""}
    </div>
  `;

  const payload = {
    from: ORDER_EMAIL_FROM,
    to: [to],
    subject: `Stonehorn Shipping Update - ${item || "Order"}`,
    html,
  };
  if (ORDER_EMAIL_REPLY_TO) {
    payload.reply_to = ORDER_EMAIL_REPLY_TO;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { sent: false, error: data?.message || "Email API failed." };
  }
  return { sent: true, id: data.id || "" };
}

function getSession(req, res) {
  const cookies = parseCookies(req.headers.cookie || "");
  const sessions = readJson(SESSIONS_FILE, {});
  let sid = cookies.sh_session;

  if (!sid || !sessions[sid]) {
    sid = crypto.randomBytes(16).toString("hex");
    sessions[sid] = {
      verified: false,
      lastSubmissionId: null,
      createdAt: new Date().toISOString(),
      role: "guest",
      userId: null,
      name: "",
      email: "",
    };
    writeJson(SESSIONS_FILE, sessions);
    res.setHeader(
      "Set-Cookie",
      `sh_session=${encodeURIComponent(sid)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
    );
  }

  const existing = sessions[sid];
  if (existing && typeof existing.role === "undefined") {
    existing.role = "guest";
    existing.userId = null;
    existing.name = existing.name || "";
    existing.email = existing.email || "";
    sessions[sid] = existing;
    writeJson(SESSIONS_FILE, sessions);
  }

  return { sid, sessions, session: sessions[sid] };
}

function isAdminSession(session) {
  return session && session.role === "admin";
}

function canFulfillSession(session) {
  return session && (session.role === "admin" || session.role === "worker");
}

function getFileTypeFromDataUrl(dataUrl) {
  const match = /^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/i.exec(dataUrl || "");
  if (!match) return null;
  const mime = match[1].toLowerCase();
  const raw = match[3];
  let ext = "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
  if (mime.includes("webp")) ext = "webp";
  return { mime, raw, ext };
}

function sendStatic(reqPath, res) {
  let filePath = path.join(ROOT, reqPath === "/" ? "index.html" : reqPath.slice(1));
  filePath = path.normalize(filePath);
  if (!filePath.startsWith(ROOT)) {
    text(res, 403, "Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    text(res, 404, "Not found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".json": "application/json; charset=utf-8",
  };

  res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

async function handleApi(req, res, urlObj) {
  if (req.method === "POST" && urlObj.pathname === "/api/stripe/webhook") {
    const payload = await readBody(req);
    const sig = req.headers["stripe-signature"] || "";
    if (!verifyStripeWebhookSignature(payload, sig, STRIPE_WEBHOOK_SECRET)) {
      return text(res, 400, "Invalid Stripe signature");
    }
    const event = JSON.parse(payload);
    if (event.type === "checkout.session.completed") {
      const sessionObj = event.data.object;
      const orders = readJson(ORDERS_FILE, []);
      const existing = orders.find((o) => o.stripeSessionId === sessionObj.id);
      if (existing) {
        existing.status = "paid";
        existing.paidAt = new Date().toISOString();
        existing.amountTotal = sessionObj.amount_total || existing.amountTotal || 0;
        existing.customerEmail = sessionObj.customer_details?.email || existing.customerEmail || "";
      } else {
        orders.push({
          stripeSessionId: sessionObj.id,
          status: "paid",
          paidAt: new Date().toISOString(),
          item: sessionObj?.metadata?.item || "Stonehorn Item",
          amountTotal: sessionObj.amount_total || 0,
          customerEmail: sessionObj.customer_details?.email || "",
        });
      }

      const order = orders.find((o) => o.stripeSessionId === sessionObj.id);
      if (order && !order.emailSentAt) {
        const entryToken = order?.braggingEntry?.token || "";
        const entryPath = encodeURIComponent(order?.braggingEntry?.entryPath || "Buying a hat");
        const braggingEntryUrl = entryToken
          ? `${PUBLIC_BASE_URL}/bragging-board.html?from_checkout=1&entry_token=${encodeURIComponent(entryToken)}&entry_path=${entryPath}`
          : "";
        const emailResult = await sendOrderConfirmationEmail({
          to: order.customerEmail || "",
          item: order.item || "Stonehorn Item",
          amountTotalCents: order.amountTotal || sessionObj.amount_total || 0,
          orderId: order.stripeSessionId,
          braggingEntryUrl,
        });
        if (emailResult.sent) {
          order.emailSentAt = new Date().toISOString();
          order.emailProviderId = emailResult.id || "";
        } else {
          order.emailError = emailResult.reason || emailResult.error || "Not sent";
        }
      }
      writeJson(ORDERS_FILE, orders);
    }
    return text(res, 200, "ok");
  }

  const { sid, sessions, session } = getSession(req, res);
  const submissions = readJson(SUBMISSIONS_FILE, []);
  const users = readJson(USERS_FILE, []);

  if (req.method === "POST" && urlObj.pathname === "/api/auth/signup") {
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "Invalid JSON body" });
    }
    const name = String(data.name || "").trim().slice(0, 80);
    const email = sanitizeEmail(data.email);
    const password = String(data.password || "");
    if (!name || !email || !password) {
      return json(res, 400, { error: "Name, email, and password are required." });
    }
    if (password.length < 6) {
      return json(res, 400, { error: "Password must be at least 6 characters." });
    }
    if (email === ADMIN_LOGIN_EMAIL || email === WORKER_LOGIN_EMAIL) {
      return json(res, 400, { error: "This email is reserved." });
    }
    if (users.some((u) => sanitizeEmail(u.email) === email)) {
      return json(res, 409, { error: "Email already exists." });
    }

    const newUser = {
      id: crypto.randomBytes(8).toString("hex"),
      name,
      email,
      passwordHash: hashPassword(password),
      role: "user",
      checkoutProfile: {},
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeJson(USERS_FILE, users);

    session.role = "user";
    session.userId = newUser.id;
    session.name = newUser.name;
    session.email = newUser.email;
    sessions[sid] = session;
    writeJson(SESSIONS_FILE, sessions);

    return json(res, 200, { ok: true, role: "user", name: newUser.name, email: newUser.email });
  }

  if (req.method === "POST" && urlObj.pathname === "/api/auth/login") {
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "Invalid JSON body" });
    }
    const email = sanitizeEmail(data.email);
    const password = String(data.password || "");
    if (!email || !password) {
      return json(res, 400, { error: "Email and password are required." });
    }

    if (email === ADMIN_LOGIN_EMAIL && password === ADMIN_PASSWORD) {
      session.role = "admin";
      session.userId = "admin";
      session.name = "Stonehorn Admin";
      session.email = ADMIN_LOGIN_EMAIL;
      sessions[sid] = session;
      writeJson(SESSIONS_FILE, sessions);
      return json(res, 200, { ok: true, role: "admin", name: session.name, email: session.email });
    }

    if (email === WORKER_LOGIN_EMAIL && password === WORKER_PASSWORD) {
      session.role = "worker";
      session.userId = "worker";
      session.name = "Stonehorn Worker";
      session.email = WORKER_LOGIN_EMAIL;
      sessions[sid] = session;
      writeJson(SESSIONS_FILE, sessions);
      return json(res, 200, { ok: true, role: "worker", name: session.name, email: session.email });
    }

    const user = users.find((u) => sanitizeEmail(u.email) === email);
    if (!user || user.passwordHash !== hashPassword(password)) {
      return json(res, 401, { error: "Invalid email or password." });
    }

    session.role = "user";
    session.userId = user.id;
    session.name = user.name;
    session.email = user.email;
    sessions[sid] = session;
    writeJson(SESSIONS_FILE, sessions);
    return json(res, 200, { ok: true, role: "user", name: user.name, email: user.email });
  }

  if (req.method === "POST" && urlObj.pathname === "/api/auth/logout") {
    session.role = "guest";
    session.userId = null;
    session.name = "";
    session.email = "";
    sessions[sid] = session;
    writeJson(SESSIONS_FILE, sessions);
    return json(res, 200, { ok: true });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/auth/me") {
    return json(res, 200, {
      loggedIn: session.role === "user" || session.role === "admin" || session.role === "worker",
      role: session.role || "guest",
      name: session.name || "",
      email: session.email || "",
    });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/profile/checkout") {
    if (session.role !== "user" && session.role !== "admin") {
      return json(res, 401, { error: "Login required." });
    }
    if (session.role === "admin") {
      return json(res, 200, { profile: {} });
    }
    const user = users.find((u) => u.id === session.userId);
    if (!user) {
      return json(res, 404, { error: "User not found." });
    }
    return json(res, 200, { profile: user.checkoutProfile || {} });
  }

  if (req.method === "POST" && urlObj.pathname === "/api/profile/checkout") {
    if (session.role !== "user") {
      return json(res, 401, { error: "User login required." });
    }
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "Invalid JSON body" });
    }
    const user = users.find((u) => u.id === session.userId);
    if (!user) {
      return json(res, 404, { error: "User not found." });
    }
    user.checkoutProfile = {
      fullName: String(data.fullName || "").slice(0, 120),
      email: sanitizeEmail(data.email || user.email),
      address1: String(data.address1 || "").slice(0, 120),
      address2: String(data.address2 || "").slice(0, 120),
      city: String(data.city || "").slice(0, 80),
      state: String(data.state || "").slice(0, 80),
      zip: String(data.zip || "").slice(0, 20),
      country: String(data.country || "").slice(0, 2).toUpperCase() || "US",
      updatedAt: new Date().toISOString(),
    };
    writeJson(USERS_FILE, users);
    return json(res, 200, { ok: true, profile: user.checkoutProfile });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/me") {
    const pending = submissions.some((s) => s.sessionId === sid && s.status === "pending");
    const approved = submissions.some((s) => s.sessionId === sid && s.status === "approved");
    if (approved && !session.verified) {
      session.verified = true;
      sessions[sid] = session;
      writeJson(SESSIONS_FILE, sessions);
    }
    return json(res, 200, { verified: !!session.verified, pending });
  }

  if (req.method === "POST" && urlObj.pathname === "/api/bragging/submit") {
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "Invalid JSON body" });
    }

    const image = getFileTypeFromDataUrl(data.imageDataUrl);
    if (!image) {
      return json(res, 400, { error: "A valid trophy photo is required." });
    }

    const entryToken = String(data.entryToken || "").trim();
    if (!entryToken) {
      return json(res, 400, { error: "A valid purchase token is required for entry." });
    }

    const orders = readJson(ORDERS_FILE, []);
    const order = orders.find((o) => o?.braggingEntry?.token === entryToken);
    if (!order) {
      return json(res, 400, { error: "Entry token not found." });
    }
    if (order.status !== "paid") {
      return json(res, 400, { error: "Payment must be completed before entry submission." });
    }
    if (!order.braggingEntry?.eligible || order.braggingEntry?.used) {
      return json(res, 400, { error: "This purchase token has already been used." });
    }

    const buffer = Buffer.from(image.raw, "base64");
    if (buffer.length < 1 || buffer.length > 8 * 1024 * 1024) {
      return json(res, 400, { error: "Photo size must be between 1B and 8MB." });
    }

    const id = crypto.randomBytes(8).toString("hex");
    const filename = `${id}.${image.ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);

    const submission = {
      id,
      status: "pending",
      sessionId: sid,
      name: String(data.name || "").trim(),
      trophyType: String(data.trophyType || "").trim(),
      story: String(data.story || "").trim(),
      entryPath: String(data.entryPath || "").trim(),
      imagePath: `/uploads/${filename}`,
      createdAt: new Date().toISOString(),
      reviewedAt: null,
      orderId: order.stripeSessionId,
      entryToken,
    };

    submissions.unshift(submission);
    writeJson(SUBMISSIONS_FILE, submissions);

    order.braggingEntry.used = true;
    order.braggingEntry.usedAt = new Date().toISOString();
    order.braggingEntry.submissionId = id;
    writeJson(ORDERS_FILE, orders);

    session.lastSubmissionId = id;
    sessions[sid] = session;
    writeJson(SESSIONS_FILE, sessions);

    return json(res, 200, { ok: true, status: "pending", id });
  }

  if (req.method === "POST" && urlObj.pathname === "/api/drops/subscribe") {
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "Invalid JSON body" });
    }
    const email = sanitizeEmail(data.email || "");
    if (!isValidEmail(email)) {
      return json(res, 400, { error: "Valid email required." });
    }
    const subscribers = readJson(DROP_SUBSCRIBERS_FILE, []);
    const existing = subscribers.find((entry) => sanitizeEmail(entry.email) === email);
    if (existing) {
      existing.active = true;
      existing.updatedAt = new Date().toISOString();
      writeJson(DROP_SUBSCRIBERS_FILE, subscribers);
      return json(res, 200, { ok: true, alreadySubscribed: true });
    }
    subscribers.unshift({
      id: crypto.randomBytes(8).toString("hex"),
      email,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      source: "join-form",
    });
    writeJson(DROP_SUBSCRIBERS_FILE, subscribers);
    return json(res, 200, { ok: true, alreadySubscribed: false });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/bragging/entry-access") {
    const token = String(urlObj.searchParams.get("token") || "").trim();
    if (!token) {
      return json(res, 400, { error: "Entry token is required." });
    }
    const orders = readJson(ORDERS_FILE, []);
    const order = orders.find((o) => o?.braggingEntry?.token === token);
    if (!order) {
      return json(res, 404, { allowed: false, reason: "Entry token not found." });
    }
    if (order.status !== "paid") {
      return json(res, 200, { allowed: false, reason: "Payment not completed yet." });
    }
    if (!order.braggingEntry?.eligible) {
      return json(res, 200, { allowed: false, reason: "Entry not enabled for this purchase." });
    }
    if (order.braggingEntry?.used) {
      return json(res, 200, { allowed: false, used: true, reason: "Entry already submitted for this purchase." });
    }
    return json(res, 200, {
      allowed: true,
      used: false,
      entryPath: order.braggingEntry.entryPath || "Buying a hat",
      item: order.item || "Stonehorn Item",
    });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/bragging/recent") {
    const approved = submissions
      .filter((s) => s.status === "approved")
      .slice(0, 12)
      .map((s) => ({
        id: s.id,
        name: s.name || "",
        trophyType: s.trophyType || "Trophy Entry",
        story: s.story || "",
        imagePath: s.imagePath,
        createdAt: s.createdAt,
      }));
    return json(res, 200, { items: approved });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/inventory/public") {
    const items = getInventorySnapshot();
    return json(res, 200, {
      items: items.map((entry) => ({
        item: entry.item,
        remaining: entry.remaining,
        inStock: entry.inStock,
        lowStock: entry.lowStock,
      })),
    });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/pricing/public") {
    const prices = getPriceMap();
    const items = Object.keys(prices)
      .sort((a, b) => a.localeCompare(b))
      .map((item) => ({ item, price: prices[item] }));
    return json(res, 200, { items });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/shop/hat-checkout") {
    if (!session.verified) {
      return json(res, 403, { error: "Hunter verification required." });
    }
    return json(res, 200, {
      ok: true,
      message: "Hunter verified. Checkout unlocked.",
      checkoutUrl: "/index.html#join",
    });
  }

  if (req.method === "POST" && urlObj.pathname === "/api/create-checkout-session") {
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "Invalid JSON body" });
    }
    const item = String(data.item || "Stonehorn Hat").slice(0, 120);
    const quantity = Math.max(1, Math.min(10, Number(data.quantity || 1)));
    const requestedUnitPrice = Number(data.unitPrice || 42);
    const priceMap = getPriceMap();
    const cartItemsRaw = Array.isArray(data.cartItems) ? data.cartItems : [];
    const normalizedItems = cartItemsRaw.length
      ? cartItemsRaw
          .map((entry) => ({
            item: String(entry.item || "").slice(0, 120),
            quantity: Math.max(1, Math.min(10, Number(entry.quantity || 1))),
            unitPrice: Number.isFinite(priceMap[String(entry.item || "").slice(0, 120)])
              ? Number(priceMap[String(entry.item || "").slice(0, 120)])
              : Number(entry.unitPrice || 0),
          }))
          .filter((entry) => entry.item && Number.isFinite(entry.unitPrice) && entry.unitPrice > 0)
      : [
          {
            item,
            quantity,
            unitPrice: Number.isFinite(priceMap[item]) ? Number(priceMap[item]) : requestedUnitPrice,
          },
        ];
    if (!normalizedItems.length) {
      return json(res, 400, { error: "No valid items in checkout." });
    }
    const invalidItem = normalizedItems.find((entry) => !Number.isFinite(entry.unitPrice) || entry.unitPrice <= 0);
    if (invalidItem) {
      return json(res, 400, { error: "Invalid price." });
    }
    const inventory = getInventorySnapshot();
    const byItem = Object.fromEntries(inventory.map((entry) => [entry.item, entry]));
    for (const entry of normalizedItems) {
      const stockEntry = byItem[entry.item];
      if (!stockEntry || stockEntry.remaining === null) continue;
      if (stockEntry.remaining <= 0) {
        return json(res, 400, { error: `${entry.item} is sold out.` });
      }
      if (entry.quantity > stockEntry.remaining) {
        return json(res, 400, {
          error: `Only ${stockEntry.remaining} left for ${entry.item}. Please reduce quantity.`,
        });
      }
    }
    const orderLabel = normalizedItems.length === 1 ? normalizedItems[0].item : `${normalizedItems.length} items`;
    const totalQuantity = normalizedItems.reduce((sum, entry) => sum + entry.quantity, 0);
    const totalAmountCents = normalizedItems.reduce((sum, entry) => sum + Math.round(entry.unitPrice * 100) * entry.quantity, 0);
    const origin = `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`;
    const returnTo = String(data.returnTo || "").trim();
    const entryPath = String(data.entryPath || "").trim().slice(0, 80);
    const customerEmail = sanitizeEmail(data.customerEmail || session.email);
    const customerName = String(data.customerName || "").slice(0, 120);
    const shippingAddress = {
      address1: String(data.address1 || "").slice(0, 120),
      address2: String(data.address2 || "").slice(0, 120),
      city: String(data.city || "").slice(0, 80),
      state: String(data.state || "").slice(0, 80),
      zip: String(data.zip || "").slice(0, 20),
      country: String(data.country || "US").slice(0, 2).toUpperCase(),
    };

    try {
      const entryToken = crypto.randomBytes(16).toString("hex");
      const successUrl = new URL("/success.html", origin);
      successUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
      if (returnTo === "bragging-board") {
        successUrl.searchParams.set("return_to", "bragging-board");
      }
      successUrl.searchParams.set("entry_token", entryToken);
      successUrl.searchParams.set("entry_path", entryPath || "Buying a hat");

      const stripeParams = {
        mode: "payment",
        "success_url": successUrl.toString(),
        "cancel_url": `${origin}/cancel.html`,
        "billing_address_collection": "required",
        "shipping_address_collection[allowed_countries][0]": "US",
        "shipping_address_collection[allowed_countries][1]": "CA",
        "phone_number_collection[enabled]": "true",
        "metadata[item]": orderLabel,
        "metadata[sessionOwner]": sid,
        "metadata[customerName]": customerName,
        "metadata[address1]": shippingAddress.address1,
        "metadata[address2]": shippingAddress.address2,
        "metadata[city]": shippingAddress.city,
        "metadata[state]": shippingAddress.state,
        "metadata[zip]": shippingAddress.zip,
        "metadata[country]": shippingAddress.country,
      };
      normalizedItems.forEach((entry, index) => {
        stripeParams[`line_items[${index}][quantity]`] = String(entry.quantity);
        stripeParams[`line_items[${index}][price_data][currency]`] = "usd";
        stripeParams[`line_items[${index}][price_data][unit_amount]`] = String(Math.round(entry.unitPrice * 100));
        stripeParams[`line_items[${index}][price_data][product_data][name]`] = entry.item;
      });
      if (customerEmail) {
        stripeParams.customer_email = customerEmail;
      }
      const stripeSession = await stripeRequest("POST", "/v1/checkout/sessions", stripeParams);

      const orders = readJson(ORDERS_FILE, []);
      orders.push({
        stripeSessionId: stripeSession.id,
        status: "created",
        createdAt: new Date().toISOString(),
        sessionId: sid,
        item: orderLabel,
        unitAmount: totalAmountCents,
        quantity: totalQuantity,
        cartItems: normalizedItems.map((entry) => ({
          item: entry.item,
          quantity: entry.quantity,
          unitAmount: Math.round(entry.unitPrice * 100),
          unitPrice: entry.unitPrice,
        })),
        customerEmail,
        customerName,
        shippingAddress,
        braggingEntry: {
          token: entryToken,
          eligible: true,
          used: false,
          entryPath: entryPath || "Buying a hat",
          usedAt: null,
          submissionId: null,
        },
      });
      writeJson(ORDERS_FILE, orders);

      return json(res, 200, { ok: true, url: stripeSession.url, id: stripeSession.id });
    } catch (error) {
      return json(res, 500, { error: error.message });
    }
  }

  if (req.method === "GET" && urlObj.pathname === "/api/checkout/session-status") {
    const sessionId = urlObj.searchParams.get("session_id");
    if (!sessionId) {
      return json(res, 400, { error: "session_id is required" });
    }
    try {
      const stripeSession = await stripeRequest("GET", `/v1/checkout/sessions/${sessionId}`);
      const paid = stripeSession.payment_status === "paid";
      const orders = readJson(ORDERS_FILE, []);
      const order = orders.find((o) => o.stripeSessionId === sessionId);
      return json(res, 200, {
        id: stripeSession.id,
        paymentStatus: stripeSession.payment_status,
        status: stripeSession.status,
        customerEmail: stripeSession.customer_details?.email || "",
        paid,
        braggingEntryToken: order?.braggingEntry?.token || "",
        braggingEntryEligible: Boolean(order?.braggingEntry?.eligible && !order?.braggingEntry?.used),
        braggingEntryUsed: Boolean(order?.braggingEntry?.used),
        braggingEntryPath: order?.braggingEntry?.entryPath || "Buying a hat",
      });
    } catch (error) {
      return json(res, 500, { error: error.message });
    }
  }

  if (req.method === "GET" && urlObj.pathname === "/api/worker/orders") {
    if (!canFulfillSession(session)) {
      return json(res, 401, { error: "Worker or admin auth required" });
    }
    const statusFilter = String(urlObj.searchParams.get("status") || "open").trim().toLowerCase();
    const validStatuses = new Set(["created", "paid", "packed", "shipped", "cancelled", "open", "all"]);
    const selected = validStatuses.has(statusFilter) ? statusFilter : "open";
    let orders = readJson(ORDERS_FILE, []);
    if (selected === "open") {
      orders = orders.filter((o) => o.status === "paid" || o.status === "packed");
    } else if (selected !== "all") {
      orders = orders.filter((o) => String(o.status || "").toLowerCase() === selected);
    }
    orders = orders
      .slice()
      .sort((a, b) => new Date(b.createdAt || b.paidAt || 0) - new Date(a.createdAt || a.paidAt || 0));
    return json(res, 200, { items: orders });
  }

  const workerPackMatch = /^\/api\/worker\/orders\/([^/]+)\/pack$/.exec(urlObj.pathname);
  if (req.method === "POST" && workerPackMatch) {
    if (!canFulfillSession(session)) {
      return json(res, 401, { error: "Worker or admin auth required" });
    }
    const orderId = decodeURIComponent(workerPackMatch[1] || "");
    const orders = readJson(ORDERS_FILE, []);
    const order = orders.find((o) => o.stripeSessionId === orderId);
    if (!order) return json(res, 404, { error: "Order not found." });
    if (order.status !== "paid") {
      return json(res, 400, { error: "Only paid orders can be marked packed." });
    }
    order.status = "packed";
    order.packedAt = new Date().toISOString();
    order.fulfilledBy = session.email || session.name || "worker";
    writeJson(ORDERS_FILE, orders);
    return json(res, 200, { ok: true, order });
  }

  const workerShipMatch = /^\/api\/worker\/orders\/([^/]+)\/ship$/.exec(urlObj.pathname);
  if (req.method === "POST" && workerShipMatch) {
    if (!canFulfillSession(session)) {
      return json(res, 401, { error: "Worker or admin auth required" });
    }
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "Invalid JSON body" });
    }
    const orderId = decodeURIComponent(workerShipMatch[1] || "");
    const carrier = String(data.carrier || "").trim().slice(0, 80);
    const trackingNumber = String(data.trackingNumber || "").trim().slice(0, 120);
    const fulfillmentNotes = String(data.fulfillmentNotes || "").trim().slice(0, 300);
    if (!carrier || !trackingNumber) {
      return json(res, 400, { error: "Carrier and tracking number are required." });
    }
    const orders = readJson(ORDERS_FILE, []);
    const order = orders.find((o) => o.stripeSessionId === orderId);
    if (!order) return json(res, 404, { error: "Order not found." });
    if (order.status !== "paid" && order.status !== "packed") {
      return json(res, 400, { error: "Only paid or packed orders can be shipped." });
    }
    order.status = "shipped";
    order.shippedAt = new Date().toISOString();
    order.carrier = carrier;
    order.trackingNumber = trackingNumber;
    order.fulfillmentNotes = fulfillmentNotes;
    order.fulfilledBy = session.email || session.name || "worker";

    if (!order.shippingEmailSentAt && order.customerEmail) {
      const emailResult = await sendShippingUpdateEmail({
        to: order.customerEmail,
        item: order.item || "Stonehorn Item",
        orderId: order.stripeSessionId,
        carrier,
        trackingNumber,
      });
      if (emailResult.sent) {
        order.shippingEmailSentAt = new Date().toISOString();
        order.shippingEmailProviderId = emailResult.id || "";
      } else {
        order.shippingEmailError = emailResult.reason || emailResult.error || "Not sent";
      }
    }
    writeJson(ORDERS_FILE, orders);
    return json(res, 200, { ok: true, order });
  }

  if (!isAdminSession(session)) {
    return json(res, 401, { error: "Admin auth required" });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/admin/submissions") {
    return json(res, 200, { items: submissions });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/admin/orders") {
    const orders = readJson(ORDERS_FILE, [])
      .slice()
      .sort((a, b) => new Date(b.createdAt || b.paidAt || 0) - new Date(a.createdAt || a.paidAt || 0));
    return json(res, 200, { items: orders });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/admin/inventory") {
    return json(res, 200, { items: getInventorySnapshot() });
  }

  if (req.method === "POST" && urlObj.pathname === "/api/admin/inventory") {
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "Invalid JSON body" });
    }
    if (!Array.isArray(data.items)) {
      return json(res, 400, { error: "items array is required." });
    }
    const raw = readJson(INVENTORY_FILE, {});
    data.items.forEach((entry) => {
      const item = String(entry.item || "").trim().slice(0, 120);
      if (!item) return;
      const stockRaw = entry.stock;
      if (stockRaw === null || stockRaw === "" || typeof stockRaw === "undefined") {
        raw[item] = { stock: null, updatedAt: new Date().toISOString() };
        return;
      }
      const stock = Math.max(0, Math.floor(Number(stockRaw)));
      if (!Number.isFinite(stock)) return;
      raw[item] = { stock, updatedAt: new Date().toISOString() };
    });
    writeJson(INVENTORY_FILE, raw);
    return json(res, 200, { ok: true, items: getInventorySnapshot() });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/admin/pricing") {
    const prices = getPriceMap();
    const items = Object.keys(prices)
      .sort((a, b) => a.localeCompare(b))
      .map((item) => ({ item, price: prices[item] }));
    return json(res, 200, { items });
  }

  if (req.method === "POST" && urlObj.pathname === "/api/admin/pricing") {
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "Invalid JSON body" });
    }
    if (!Array.isArray(data.items)) {
      return json(res, 400, { error: "items array is required." });
    }
    const raw = readJson(PRICES_FILE, {});
    data.items.forEach((entry) => {
      const item = String(entry.item || "").trim().slice(0, 120);
      if (!item) return;
      const price = Number(entry.price);
      if (!Number.isFinite(price) || price <= 0) return;
      raw[item] = Number(price.toFixed(2));
    });
    writeJson(PRICES_FILE, raw);
    const prices = getPriceMap();
    const items = Object.keys(prices)
      .sort((a, b) => a.localeCompare(b))
      .map((item) => ({ item, price: prices[item] }));
    return json(res, 200, { ok: true, items });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/admin/drops/subscribers") {
    const subscribers = readJson(DROP_SUBSCRIBERS_FILE, []);
    const active = subscribers.filter((entry) => entry.active !== false);
    return json(res, 200, {
      count: active.length,
      items: active.map((entry) => ({
        id: entry.id,
        email: entry.email,
        createdAt: entry.createdAt,
      })),
    });
  }

  if (req.method === "POST" && urlObj.pathname === "/api/admin/drops/send-update") {
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "Invalid JSON body" });
    }
    const subject = String(data.subject || "").trim().slice(0, 120);
    const message = String(data.message || "").trim().slice(0, 5000);
    let imageUrl = "";
    if (!subject || !message) {
      return json(res, 400, { error: "Subject and message are required." });
    }
    if (data.imageDataUrl) {
      const image = getFileTypeFromDataUrl(data.imageDataUrl);
      if (!image) {
        return json(res, 400, { error: "Invalid drop photo format." });
      }
      const buffer = Buffer.from(image.raw, "base64");
      if (buffer.length < 1 || buffer.length > 8 * 1024 * 1024) {
        return json(res, 400, { error: "Drop photo size must be between 1B and 8MB." });
      }
      const filename = `drop-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${image.ext}`;
      fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
      imageUrl = `${PUBLIC_BASE_URL}/uploads/${filename}`;
    }
    const subscribers = readJson(DROP_SUBSCRIBERS_FILE, []).filter((entry) => entry.active !== false);
    if (!subscribers.length) {
      return json(res, 400, { error: "No subscribers found." });
    }
    let sent = 0;
    let failed = 0;
    for (const subscriber of subscribers) {
      const result = await sendDropUpdateEmail({
        to: sanitizeEmail(subscriber.email || ""),
        subject,
        message,
        imageUrl,
      });
      if (result.sent) sent += 1;
      else failed += 1;
    }
    return json(res, 200, { ok: true, sent, failed, total: subscribers.length });
  }

  const approveMatch = /^\/api\/admin\/submissions\/([a-f0-9]+)\/(approve|reject)$/.exec(urlObj.pathname);
  if (req.method === "POST" && approveMatch) {
    const [, id, action] = approveMatch;
    const target = submissions.find((s) => s.id === id);
    if (!target) {
      return json(res, 404, { error: "Submission not found" });
    }
    target.status = action === "approve" ? "approved" : "rejected";
    target.reviewedAt = new Date().toISOString();
    writeJson(SUBMISSIONS_FILE, submissions);

    if (action === "approve") {
      const allSessions = readJson(SESSIONS_FILE, {});
      if (allSessions[target.sessionId]) {
        allSessions[target.sessionId].verified = true;
        writeJson(SESSIONS_FILE, allSessions);
      }
    }
    return json(res, 200, { ok: true });
  }

  const editDeleteMatch = /^\/api\/admin\/submissions\/([a-f0-9]+)$/.exec(urlObj.pathname);
  if (editDeleteMatch && req.method === "PUT") {
    const [, id] = editDeleteMatch;
    const target = submissions.find((s) => s.id === id);
    if (!target) {
      return json(res, 404, { error: "Submission not found" });
    }
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "Invalid JSON body" });
    }
    target.name = String(data.name || "").trim().slice(0, 80);
    target.trophyType = String(data.trophyType || "").trim().slice(0, 80);
    target.story = String(data.story || "").trim().slice(0, 600);
    target.updatedAt = new Date().toISOString();
    writeJson(SUBMISSIONS_FILE, submissions);
    return json(res, 200, { ok: true, item: target });
  }

  if (editDeleteMatch && req.method === "DELETE") {
    const [, id] = editDeleteMatch;
    const idx = submissions.findIndex((s) => s.id === id);
    if (idx < 0) {
      return json(res, 404, { error: "Submission not found" });
    }
    const [removed] = submissions.splice(idx, 1);
    writeJson(SUBMISSIONS_FILE, submissions);

    const imagePath = String(removed.imagePath || "");
    if (imagePath.startsWith("/uploads/")) {
      const uploadPath = path.join(UPLOAD_DIR, path.basename(imagePath));
      try {
        if (fs.existsSync(uploadPath)) fs.unlinkSync(uploadPath);
      } catch {
        // Keep delete resilient if the file is already missing.
      }
    }

    const orders = readJson(ORDERS_FILE, []);
    const order = orders.find((o) => o?.braggingEntry?.submissionId === id);
    if (order?.braggingEntry) {
      order.braggingEntry.used = false;
      order.braggingEntry.usedAt = null;
      order.braggingEntry.submissionId = null;
      writeJson(ORDERS_FILE, orders);
    }

    return json(res, 200, { ok: true });
  }

  return json(res, 404, { error: "Not found" });
}

const server = http.createServer(async (req, res) => {
  try {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);

    if (urlObj.pathname.startsWith("/api/")) {
      return await handleApi(req, res, urlObj);
    }

    if (urlObj.pathname.startsWith("/uploads/")) {
      return sendStatic(urlObj.pathname, res);
    }

    return sendStatic(urlObj.pathname, res);
  } catch (error) {
    return json(res, 500, { error: "Server error", detail: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Stonehorn server running on http://${HOST}:${PORT}`);
  console.log("Admin password:", ADMIN_PASSWORD);
  console.log("Worker password:", WORKER_PASSWORD);
});
