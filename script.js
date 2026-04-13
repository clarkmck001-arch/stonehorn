const revealEls = document.querySelectorAll(".reveal");
const counterEls = document.querySelectorAll("[data-counter]");
const chips = document.querySelectorAll(".chip");
const events = document.querySelectorAll(".event");

document.documentElement.classList.add("reveal-ready");

const joinForm = document.querySelector(".join-form");
const addCartButtons = document.querySelectorAll(".add-cart-btn");
const lineupGrid = document.querySelector("#lineup-grid");
const mobileNavToggle = document.querySelector("#mobile-nav-toggle");
const mainNavLinks = document.querySelector("#main-nav-links");
const cartCountEls = document.querySelectorAll("[data-cart-count]");
const cartList = document.querySelector("#cart-list");
const cartTotal = document.querySelector("#cart-total");
const cartStatus = document.querySelector("#cart-status");
const cartClearBtn = document.querySelector("#cart-clear-btn");
const cartCheckoutBtn = document.querySelector("#cart-checkout-btn");
const boardForm = document.querySelector("#bragging-form");
const boardStatus = document.querySelector("#board-status");
const boardOptionTwo = document.querySelector("#board-option-two");
const recentGrid = document.querySelector("#recent-grid");
const recentLoadMoreBtn = document.querySelector("#recent-load-more-btn");

const adminLoginBtn = document.querySelector("#admin-login-btn");
const adminRefreshBtn = document.querySelector("#admin-refresh-btn");
const adminOrdersRefreshBtn = document.querySelector("#admin-orders-refresh-btn");
const dropsRefreshBtn = document.querySelector("#drops-refresh-btn");
const dropsSendBtn = document.querySelector("#drops-send-btn");
const dropsCount = document.querySelector("#drops-count");
const dropsSubject = document.querySelector("#drops-subject");
const dropsMessage = document.querySelector("#drops-message");
const dropsPhoto = document.querySelector("#drops-photo");
const dropsStatus = document.querySelector("#drops-status");
const announcementEnabled = document.querySelector("#announcement-enabled");
const announcementMessage = document.querySelector("#announcement-message");
const announcementSaveBtn = document.querySelector("#announcement-save-btn");
const announcementRefreshBtn = document.querySelector("#announcement-refresh-btn");
const announcementStatus = document.querySelector("#announcement-status");
const inventoryList = document.querySelector("#inventory-list");
const inventoryRefreshBtn = document.querySelector("#inventory-refresh-btn");
const inventorySaveBtn = document.querySelector("#inventory-save-btn");
const inventoryStatus = document.querySelector("#inventory-status");
const adminEmail = document.querySelector("#admin-email");
const adminPassword = document.querySelector("#admin-password");
const adminStatus = document.querySelector("#admin-status");
const adminList = document.querySelector("#admin-list");
const adminOrdersList = document.querySelector("#admin-orders-list");
const adminOrdersSearch = document.querySelector("#admin-orders-search");
const adminAuthBox = document.querySelector("#admin-auth-box");
const workerLoginBtn = document.querySelector("#worker-login-btn");
const workerRefreshBtn = document.querySelector("#worker-refresh-btn");
const workerOrderFilter = document.querySelector("#worker-order-filter");
const workerFilterCount = document.querySelector("#worker-filter-count");
const workerEmail = document.querySelector("#worker-email");
const workerPassword = document.querySelector("#worker-password");
const workerStatus = document.querySelector("#worker-status");
const workerAuthBox = document.querySelector("#worker-auth-box");
const fulfillmentList = document.querySelector("#fulfillment-list");
const staffNotifyBox = document.querySelector("#staff-notify-box");
const staffNotifyCount = document.querySelector("#staff-notify-count");
const staffNotifyList = document.querySelector("#staff-notify-list");
const staffNotifyRefreshBtn = document.querySelector("#staff-notify-refresh-btn");
const staffNotifyMarkReadBtn = document.querySelector("#staff-notify-mark-read-btn");
const staffNotifyClearBtn = document.querySelector("#staff-notify-clear-btn");
const staffNotifyDesktopToggle = document.querySelector("#staff-notify-desktop-toggle");
const staffNotifyDesktopStatus = document.querySelector("#staff-notify-desktop-status");

const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const loginStatus = document.querySelector("#login-status");
const signupStatus = document.querySelector("#signup-status");
const loginSavePref = document.querySelector("#login-save-pref");
const signupSavePref = document.querySelector("#signup-save-pref");

const accountGreeting = document.querySelector("#account-greeting");
const accountRole = document.querySelector("#account-role");
const accountLoginLink = document.querySelector("#account-login-link");
const accountLogoutBtn = document.querySelector("#account-logout-btn");
const staffLinks = document.querySelector("#staff-links");
const adminOnlyLinks = document.querySelector("#admin-only-links");

const checkoutForm = document.querySelector("#checkout-form");
const checkoutItem = document.querySelector("#checkout-item");
const checkoutPrice = document.querySelector("#checkout-price");
const checkoutQty = document.querySelector("#checkout-qty");
const checkoutCartSummary = document.querySelector("#checkout-cart-summary");
const checkoutName = document.querySelector("#checkout-name");
const checkoutEmail = document.querySelector("#checkout-email");
const checkoutAddress1 = document.querySelector("#checkout-address1");
const checkoutAddress2 = document.querySelector("#checkout-address2");
const checkoutCity = document.querySelector("#checkout-city");
const checkoutState = document.querySelector("#checkout-state");
const checkoutZip = document.querySelector("#checkout-zip");
const checkoutCountry = document.querySelector("#checkout-country");
const checkoutStatus = document.querySelector("#checkout-status");
const successBragBtn = document.querySelector("#success-brag-btn");
let siteAnnouncement = document.querySelector("#site-announcement");
let siteAnnouncementText = document.querySelector("#site-announcement-text");
let appToastTimer = null;

const CHECKOUT_PREF_KEY = "stonehorn_save_checkout_pref";
const STAFF_NOTIFY_DESKTOP_KEY = "stonehorn_staff_desktop_notify";
const CART_KEY = "stonehorn_cart";
let adminOrdersCache = [];
let publicInventoryMap = new Map();
let publicPriceMap = new Map();
let adminPriceMap = new Map();
let recentBoardOffset = 0;
let recentBoardTotal = 0;
const RECENT_BOARD_PAGE_SIZE = 12;
let boardAdminMode = false;
let staffNotifyPollTimer = null;
let lastStaffUnreadCount = 0;
let productZoomModal = null;
const PRODUCT_IMAGE_MAP = {
  "Black Leather Patch Hat": "./IMG_7923.PNG",
  "Embroidered Text Hat": "./IMG_7935.jpg",
  "Black Ibex Logo Hat": "./IMG_7928.jpg",
  "Blue Rope Hat": "./hat-blue-rope.jpg",
  "Cream Badge Hat": "./IMG_7934.PNG",
  "Cream Mountain Script Hat": "./IMG_7922.PNG",
  "Black Gold Ibex Hat": "./IMG_7921.PNG",
  "Cream Backcountry Patch Hat": "./IMG_7936.PNG",
  "Black Brush Hoodie": "./archive-2.jpg",
  "Black Forest Hoodie": "./archive-2.jpg",
  "Green Brush Hoodie": "./archive-1.jpg",
  "Earth Tone Hoodie": "./archive-3.jpg",
  "Black Quilted Jacket": "./hoodie-4-jacket.png",
};

const PRODUCT_SKUS = {
  "Black Leather Patch Hat": "SH-HAT-001",
  "Embroidered Text Hat": "SH-HAT-002",
  "Black Ibex Logo Hat": "SH-HAT-005",
  "Blue Rope Hat": "SH-HAT-004",
  "Cream Badge Hat": "SH-HAT-003",
  "Cream Mountain Script Hat": "SH-HAT-006",
  "Black Gold Ibex Hat": "SH-HAT-007",
  "Cream Backcountry Patch Hat": "SH-HAT-008",
  "Black Brush Hoodie": "SH-HOO-001",
  "Black Forest Hoodie": "SH-HOO-001",
  "Green Brush Hoodie": "SH-HOO-002",
  "Earth Tone Hoodie": "SH-HOO-003",
  "Black Quilted Jacket": "SH-JKT-001",
  "Bragging Board Entry": "SH-BRD-001",
};

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.2 }
);

revealEls.forEach((el) => revealObserver.observe(el));

const isPhoneViewport = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(max-width: 640px)").matches;
};

const ensureFirstHatVisibleOnPhone = () => {
  if (!lineupGrid || !isPhoneViewport()) return;
  const hats = Array.from(lineupGrid.querySelectorAll(".hat-shot"));
  hats.forEach((hat) => hat.classList.remove("top-hat-instant"));
  const firstHat = hats[0];
  if (!firstHat) return;
  firstHat.classList.add("top-hat-instant");
  firstHat.classList.add("is-visible");
  const img = firstHat.querySelector("img");
  if (img instanceof HTMLImageElement) {
    img.loading = "eager";
    img.decoding = "async";
    img.setAttribute("fetchpriority", "high");
  }
};

const animateCounter = (el) => {
  const goal = Number(el.dataset.counter) || 0;
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = String(Math.floor(goal * progress));
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = String(goal);
  };
  requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

counterEls.forEach((el) => counterObserver.observe(el));

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const filter = chip.dataset.filter;
    events.forEach((event) => {
      const visible = filter === "all" || event.dataset.kind === filter;
      event.style.display = visible ? "block" : "none";
    });
  });
});

const jsonFetch = async (url, options = {}) => {
  try {
    const timeoutMs = Number(options.timeoutMs || 12000);
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    let timeoutId = null;
    if (controller && timeoutMs > 0) {
      timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
    }
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      signal: controller ? controller.signal : undefined,
      ...options,
    });
    if (timeoutId) window.clearTimeout(timeoutId);
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: "Cannot reach Stonehorn server. Restart the app server." } };
  }
};

const wait = (ms) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const escapeHtml = (value) =>
  String(value || "").replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char] || char;
  });

const showToast = (message) => {
  const text = String(message || "").trim();
  if (!text) return;
  let toast = document.querySelector("#app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "app-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("is-visible");
  if (appToastTimer) window.clearTimeout(appToastTimer);
  appToastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
};

const formatOrderNumber = (stripeSessionId) => {
  const raw = String(stripeSessionId || "").trim();
  if (!raw) return "N/A";
  const compact = raw.replace(/^cs_(test_|live_)?/i, "");
  const tail = compact.slice(-8).toUpperCase();
  return `SH-${tail || "N/A"}`;
};

const isGenericItemsLabel = (value) => {
  const label = String(value || "").trim().toLowerCase();
  if (!label) return false;
  return /^\d+\s+items?$/.test(label) || label === "stonehorn item";
};

const formatOrderItemsLabel = (order) => {
  if (Array.isArray(order?.cartItems) && order.cartItems.length) {
    const normalized = order.cartItems
      .map((entry) => {
        const name = String(entry?.item || "").trim();
        const quantity = Math.max(1, Number(entry?.quantity || 1));
        if (!name) return "";
        if (isGenericItemsLabel(name)) return "";
        const sku = String(entry?.sku || PRODUCT_SKUS[name] || "").trim();
        const base = quantity > 1 ? `${quantity}x ${name}` : name;
        return sku ? `${base} (${sku})` : base;
      })
      .filter(Boolean);
    if (normalized.length) {
      return normalized.join(", ");
    }
  }
  const itemList = String(order?.itemList || "").trim();
  if (itemList && !isGenericItemsLabel(itemList)) return itemList;
  const fallback = String(order?.item || "Stonehorn Item").trim() || "Stonehorn Item";
  if (isGenericItemsLabel(fallback)) return "Stonehorn Order";
  return fallback;
};

const getOrderSkuSummary = (order) => {
  const skuSet = new Set();
  if (Array.isArray(order?.cartItems)) {
    order.cartItems.forEach((entry) => {
      const name = String(entry?.item || "").trim();
      const sku = String(entry?.sku || PRODUCT_SKUS[name] || "").trim();
      if (sku) skuSet.add(sku);
    });
  }
  if (!skuSet.size) {
    const singleSku = PRODUCT_SKUS[String(order?.item || "").trim()];
    if (singleSku) skuSet.add(singleSku);
  }
  return Array.from(skuSet).join(", ");
};

const getRefundState = (order) => {
  const raw = String(order?.refundStatus || "").trim().toLowerCase();
  const amount = Math.max(0, Number(order?.refundAmount || 0)) / 100;
  if (raw === "refunded") {
    return {
      label: amount > 0 ? `Refunded ($${amount.toFixed(2)})` : "Refunded",
      className: "fulfillment-bad",
      isFull: true,
    };
  }
  if (raw === "partial") {
    return {
      label: amount > 0 ? `Partially Refunded ($${amount.toFixed(2)})` : "Partially Refunded",
      className: "fulfillment-neutral",
      isFull: false,
    };
  }
  return { label: "", className: "", isFull: false };
};

const formatAddressForDisplay = (order) => {
  const address = order?.shippingAddress;
  if (!address) return "N/A";
  return `${address.address1 || ""} ${address.address2 || ""}, ${address.city || ""}, ${address.state || ""} ${address.zip || ""}`
    .replace(/\s+,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
};

const buildLabelCopyText = (order) => {
  const orderNum = formatOrderNumber(order?.stripeSessionId);
  const customer = String(order?.customerName || "").trim() || String(order?.customerEmail || "").trim() || "Customer";
  const address = formatAddressForDisplay(order);
  const items = formatOrderItemsLabel(order);
  const skus = getOrderSkuSummary(order);
  const dateRaw = order?.paidAt || order?.createdAt || "";
  const orderDate = dateRaw ? new Date(dateRaw).toLocaleString() : "N/A";
  return [
    `Order: ${orderNum}`,
    `Order Date: ${orderDate}`,
    `Customer: ${customer}`,
    `Email: ${order?.customerEmail || "N/A"}`,
    `Ship To: ${address}`,
    `Items: ${items}`,
    `SKU: ${skus || "N/A"}`,
  ].join("\n");
};

const printPackingSlip = (order) => {
  const orderNum = formatOrderNumber(order?.stripeSessionId);
  const customer = String(order?.customerName || "").trim() || "Customer";
  const email = String(order?.customerEmail || "").trim() || "N/A";
  const address = formatAddressForDisplay(order);
  const items = formatOrderItemsLabel(order);
  const skus = getOrderSkuSummary(order);
  const dateRaw = order?.paidAt || order?.createdAt || "";
  const orderDate = dateRaw ? new Date(dateRaw).toLocaleString() : "N/A";
  const printWindow = window.open("", "_blank", "width=780,height=900");
  if (!printWindow) return;
  printWindow.document.write(`<!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Packing Slip ${escapeHtml(orderNum)}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
      h1 { margin: 0 0 16px; }
      p { margin: 8px 0; }
      .line { border-top: 1px solid #ddd; margin: 14px 0; }
      .label { font-weight: 700; }
      .mono { font-family: Menlo, Monaco, Consolas, monospace; }
    </style>
  </head>
  <body>
    <h1>Stonehorn Packing Slip</h1>
    <p><span class="label">Order:</span> <span class="mono">${escapeHtml(orderNum)}</span></p>
    <p><span class="label">Order Date:</span> ${escapeHtml(orderDate)}</p>
    <div class="line"></div>
    <p><span class="label">Customer:</span> ${escapeHtml(customer)}</p>
    <p><span class="label">Email:</span> ${escapeHtml(email)}</p>
    <p><span class="label">Ship To:</span> ${escapeHtml(address)}</p>
    <div class="line"></div>
    <p><span class="label">Items:</span> ${escapeHtml(items)}</p>
    <p><span class="label">SKU:</span> <span class="mono">${escapeHtml(skus || "N/A")}</span></p>
  </body>
  </html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

const ensureProductZoomModal = () => {
  if (productZoomModal) return productZoomModal;
  const modal = document.createElement("div");
  modal.className = "product-zoom-modal hidden";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="product-zoom-backdrop" data-action="close"></div>
    <div class="product-zoom-dialog" role="dialog" aria-modal="true" aria-label="Product image zoom">
      <button class="product-zoom-close" type="button" data-action="close" aria-label="Close">x</button>
      <img class="product-zoom-image" alt="Product image enlarged" />
    </div>
  `;
  modal.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.getAttribute("data-action") === "close") {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  });
  document.body.appendChild(modal);
  productZoomModal = modal;
  return modal;
};

const trackProductImageClick = (item) => {
  const safeItem = String(item || "").trim();
  if (!safeItem) return;
  jsonFetch("/api/product-click", {
    method: "POST",
    timeoutMs: 4000,
    body: JSON.stringify({ item: safeItem }),
  }).catch(() => null);
};

const openProductZoom = ({ src, alt }) => {
  if (!src) return;
  const modal = ensureProductZoomModal();
  const imageEl = modal.querySelector(".product-zoom-image");
  if (!(imageEl instanceof HTMLImageElement)) return;
  imageEl.src = src;
  imageEl.alt = alt || "Product image enlarged";
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
};

const initProductImageZoom = () => {
  const productCards = Array.from(document.querySelectorAll(".hat-shot, .hoodie-card"));
  productCards.forEach((card) => {
    const img = card.querySelector("img");
    const button = card.querySelector(".add-cart-btn");
    if (!(img instanceof HTMLImageElement) || !(button instanceof HTMLElement)) return;
    if (img.dataset.zoomBound === "1") return;
    const item = String(button.getAttribute("data-item") || "").trim();
    img.dataset.zoomBound = "1";
    img.classList.add("zoomable-product-image");
    img.addEventListener("click", () => {
      openProductZoom({ src: img.src, alt: img.alt });
      trackProductImageClick(item);
    });
  });
};

const getDesktopNotifyEnabled = () => localStorage.getItem(STAFF_NOTIFY_DESKTOP_KEY) === "true";

const setDesktopNotifyEnabled = (enabled) => {
  if (enabled) localStorage.setItem(STAFF_NOTIFY_DESKTOP_KEY, "true");
  else localStorage.removeItem(STAFF_NOTIFY_DESKTOP_KEY);
};

const updateDesktopNotifyStatus = () => {
  if (!staffNotifyDesktopStatus || !staffNotifyDesktopToggle) return;
  const enabled = getDesktopNotifyEnabled();
  const supported = typeof window !== "undefined" && "Notification" in window;
  staffNotifyDesktopToggle.checked = enabled;
  if (!supported) {
    staffNotifyDesktopStatus.textContent = "Desktop notifications are not supported on this browser.";
    return;
  }
  const permission = Notification.permission;
  if (!enabled) {
    staffNotifyDesktopStatus.textContent = "Desktop notifications are off.";
    return;
  }
  if (permission === "granted") {
    staffNotifyDesktopStatus.textContent = "Desktop notifications are on.";
    return;
  }
  if (permission === "denied") {
    staffNotifyDesktopStatus.textContent = "Browser blocked notifications. Enable them in browser settings.";
    return;
  }
  staffNotifyDesktopStatus.textContent = "Desktop notifications are on (permission pending).";
};

const sendDesktopOrderNotification = (message) => {
  const supported = typeof window !== "undefined" && "Notification" in window;
  if (!supported || !getDesktopNotifyEnabled()) return;
  if (Notification.permission !== "granted") return;
  try {
    const n = new Notification("Stonehorn Order Alert", { body: message });
    window.setTimeout(() => n.close(), 6000);
  } catch {
    // Ignore browser notification failures
  }
};

const renderStaffNotifications = (items, unreadCount) => {
  if (!staffNotifyBox || !staffNotifyList || !staffNotifyCount) return;
  const safeItems = Array.isArray(items) ? items : [];
  staffNotifyBox.classList.remove("hidden");
  staffNotifyCount.textContent =
    unreadCount > 0 ? `${unreadCount} new order${unreadCount === 1 ? "" : "s"}.` : "No new orders.";
  if (!safeItems.length) {
    staffNotifyList.innerHTML = '<p class="small">No order notifications yet.</p>';
    return;
  }
  staffNotifyList.innerHTML = safeItems
    .slice(0, 8)
    .map((entry) => {
      const ts = entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "";
      const amount = Math.max(0, Number(entry.amountTotal || 0)) / 100;
      const unreadClass = entry.unread ? "fulfillment-bad" : "";
      return `<p class="small ${unreadClass}">Order ${escapeHtml(entry.shortOrderId || "N/A")} | $${amount.toFixed(
        2
      )} | ${escapeHtml(entry.customerEmail || "N/A")} ${ts ? `| ${escapeHtml(ts)}` : ""}</p>`;
    })
    .join("");
};

const loadStaffNotifications = async (options = {}) => {
  if (!staffNotifyBox || !staffNotifyList || !staffNotifyCount) return;
  const { silent = false } = options;
  const { ok, data } = await jsonFetch("/api/staff/notifications?limit=12", { method: "GET" });
  if (!ok) {
    if (!silent) {
      staffNotifyBox.classList.add("hidden");
    }
    return;
  }
  const unreadCount = Math.max(0, Number(data.unreadCount || 0));
  const items = Array.isArray(data.items) ? data.items : [];
  renderStaffNotifications(items, unreadCount);
  if (silent && unreadCount > lastStaffUnreadCount) {
    const delta = unreadCount - lastStaffUnreadCount;
    const latest = items.find((entry) => entry && entry.unread) || items[0];
    const label = latest?.shortOrderId ? ` (${latest.shortOrderId})` : "";
    const msg = `New order alert: ${delta} new${label}.`;
    showToast(msg);
    sendDesktopOrderNotification(msg);
  }
  lastStaffUnreadCount = unreadCount;
};

const startStaffNotificationPolling = async () => {
  if (!staffNotifyBox) return;
  updateDesktopNotifyStatus();
  if (staffNotifyPollTimer) {
    window.clearInterval(staffNotifyPollTimer);
    staffNotifyPollTimer = null;
  }
  await loadStaffNotifications({ silent: false });
  staffNotifyPollTimer = window.setInterval(() => {
    loadStaffNotifications({ silent: true });
  }, 20000);
};

const stopStaffNotificationPolling = () => {
  if (!staffNotifyPollTimer) return;
  window.clearInterval(staffNotifyPollTimer);
  staffNotifyPollTimer = null;
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getProductImageForItem = (item) => PRODUCT_IMAGE_MAP[String(item || "").trim()] || "";
const bindAddToCartButton = (btn) => {
  if (!btn || btn.dataset.cartBound === "1") return;
  btn.dataset.cartBound = "1";
  btn.addEventListener("click", () => {
    const item = String(btn.getAttribute("data-item") || "").trim();
    const mappedPrice = publicPriceMap.get(item);
    const unitPrice = Number.isFinite(mappedPrice) && mappedPrice > 0 ? Number(mappedPrice) : Number(btn.getAttribute("data-price") || 0);
    if (!item || !Number.isFinite(unitPrice) || unitPrice <= 0) return;
    const image = getProductImageForItem(item) || String(btn.getAttribute("data-image") || "").trim();
    const stock = publicInventoryMap.get(item);
    const cart = getCart();
    const existing = cart.find((entry) => entry.item === item);
    const currentQty = existing ? existing.quantity : 0;
    const nextQty = Math.min(10, currentQty + 1);
    if (stock && stock.remaining !== null && nextQty > Number(stock.remaining || 0)) {
      const msg =
        Number(stock.remaining || 0) > 0 ? `Only ${stock.remaining} left for ${item}.` : `${item} is sold out.`;
      if (cartStatus) {
        cartStatus.textContent = msg;
      }
      showToast(msg);
      applyInventoryToButtons();
      return;
    }
    if (existing) existing.quantity = nextQty;
    else cart.push({ item, unitPrice, quantity: 1, image });
    saveCart(cart);
    renderCart();
    const addedMsg = `${item} added to cart.`;
    if (cartStatus) cartStatus.textContent = addedMsg;
    showToast(addedMsg);
  });
};

const getCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        item: String(item.item || "").trim().slice(0, 120),
        unitPrice: Number(item.unitPrice || item.price || 0),
        quantity: Math.max(1, Math.min(10, Number(item.quantity || 1))),
        image: String(item.image || getProductImageForItem(item.item)).trim(),
      }))
      .filter((item) => item.item && Number.isFinite(item.unitPrice) && item.unitPrice > 0);
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const getCartTotal = (cart) => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

const updateCartCount = () => {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  cartCountEls.forEach((el) => {
    el.textContent = String(count);
  });
};

const renderCart = () => {
  if (!cartList || !cartTotal) {
    updateCartCount();
    return;
  }
  const cart = getCart();
  updateCartCount();
  if (!cart.length) {
    cartList.innerHTML = '<p class="small">Your cart is empty.</p>';
    cartTotal.textContent = "$0.00";
    if (cartCheckoutBtn) cartCheckoutBtn.classList.add("disabled");
    return;
  }
  cartList.innerHTML = cart
    .map((item, idx) => {
      const imageSrc = item.image || getProductImageForItem(item.item);
      return `
      <article class="cart-row">
        <div class="cart-row-main">
          ${
            imageSrc
              ? `<img class="cart-thumb" src="${escapeHtml(imageSrc)}" alt="${escapeHtml(item.item)}" loading="lazy" />`
              : ""
          }
          <p class="small"><strong>${escapeHtml(item.item)}</strong></p>
        </div>
        <p class="small">$${item.unitPrice.toFixed(2)} x ${item.quantity}</p>
        <div class="hunter-gate-actions">
          <button class="btn btn-ghost btn-sm cart-action" data-action="decrease" data-idx="${idx}" type="button">-</button>
          <button class="btn btn-ghost btn-sm cart-action" data-action="increase" data-idx="${idx}" type="button">+</button>
          <button class="btn btn-ghost btn-sm cart-action" data-action="remove" data-idx="${idx}" type="button">Remove</button>
        </div>
      </article>
    `;
    })
    .join("");
  cartTotal.textContent = `$${getCartTotal(cart).toFixed(2)}`;
  if (cartCheckoutBtn) cartCheckoutBtn.classList.remove("disabled");
};

const applyInventoryToButtons = () => {
  document.querySelectorAll(".add-cart-btn").forEach((btn) => {
    const item = String(btn.getAttribute("data-item") || "").trim();
    if (!item) return;
    const stock = publicInventoryMap.get(item);
    let note = btn.parentElement?.querySelector(".stock-note");
    if (!note && btn.parentElement) {
      note = document.createElement("p");
      note.className = "small stock-note";
      btn.parentElement.appendChild(note);
    }
    if (!stock || stock.remaining === null) {
      btn.disabled = false;
      btn.classList.remove("disabled");
      if (note) note.textContent = "";
      return;
    }
    if (!stock.inStock || Number(stock.remaining) <= 0) {
      btn.disabled = true;
      btn.classList.add("disabled");
      if (note) note.textContent = "Sold out";
      return;
    }
    btn.disabled = false;
    btn.classList.remove("disabled");
    if (stock.lowStock) {
      note.textContent = `Only ${stock.remaining} left`;
    } else if (note) {
      note.textContent = "";
    }
  });

  if (lineupGrid) {
    const hats = Array.from(lineupGrid.querySelectorAll(".hat-shot"));
    hats.forEach((card, idx) => {
      if (!card.dataset.baseOrder) card.dataset.baseOrder = String(idx);
    });
    hats.sort((a, b) => {
      const aItem = String(a.querySelector(".add-cart-btn")?.getAttribute("data-item") || "").trim();
      const bItem = String(b.querySelector(".add-cart-btn")?.getAttribute("data-item") || "").trim();
      const aStock = publicInventoryMap.get(aItem);
      const bStock = publicInventoryMap.get(bItem);
      const aBtnDisabled = Boolean(a.querySelector(".add-cart-btn")?.disabled);
      const bBtnDisabled = Boolean(b.querySelector(".add-cart-btn")?.disabled);
      const aInStock = !aBtnDisabled && (!aStock || aStock.remaining === null || (aStock.inStock && Number(aStock.remaining || 0) > 0));
      const bInStock = !bBtnDisabled && (!bStock || bStock.remaining === null || (bStock.inStock && Number(bStock.remaining || 0) > 0));
      if (aInStock !== bInStock) return aInStock ? -1 : 1;
      return Number(a.dataset.baseOrder || 0) - Number(b.dataset.baseOrder || 0);
    });
    hats.forEach((card) => lineupGrid.appendChild(card));
  }
  ensureFirstHatVisibleOnPhone();
};

const loadPublicInventory = async () => {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const { ok, data } = await jsonFetch("/api/inventory/public", { method: "GET", timeoutMs: 8000 });
    if (ok && Array.isArray(data.items)) {
      publicInventoryMap = new Map(data.items.map((entry) => [entry.item, entry]));
      applyInventoryToButtons();
      return;
    }
    if (attempt === 0) {
      await wait(300);
    }
  }
};

const applyPublicPricing = () => {
  document.querySelectorAll(".add-cart-btn").forEach((btn) => {
    const item = String(btn.getAttribute("data-item") || "").trim();
    if (!item) return;
    const price = publicPriceMap.get(item);
    if (!Number.isFinite(price) || price <= 0) return;
    btn.setAttribute("data-price", String(price));
    btn.textContent = `Add To Cart - $${Number(price).toFixed(2)}`;
  });

  document.querySelectorAll("[data-price-item]").forEach((el) => {
    const item = String(el.getAttribute("data-price-item") || "").trim();
    if (!item) return;
    const price = publicPriceMap.get(item);
    if (!Number.isFinite(price) || price <= 0) return;
    el.textContent = `$${Number(price).toFixed(2)}`;
  });

  const cart = getCart();
  let changed = false;
  cart.forEach((entry) => {
    const price = publicPriceMap.get(entry.item);
    if (Number.isFinite(price) && price > 0 && Number(entry.unitPrice) !== Number(price)) {
      entry.unitPrice = Number(price);
      changed = true;
    }
  });
  if (changed) {
    saveCart(cart);
    renderCart();
  } else {
    updateCartCount();
  }
};

const loadPublicPricing = async () => {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const { ok, data } = await jsonFetch("/api/pricing/public", { method: "GET", timeoutMs: 8000 });
    if (ok && Array.isArray(data.items)) {
      publicPriceMap = new Map(data.items.map((entry) => [entry.item, Number(entry.price)]));
      applyPublicPricing();
      return;
    }
    if (attempt === 0) {
      await wait(300);
    }
  }
};

const loadSiteAnnouncement = async () => {
  if (!siteAnnouncement || !siteAnnouncementText) {
    if (window.location.pathname.endsWith("/index.html") || window.location.pathname === "/") {
      const heroContent = document.querySelector(".hero-content");
      if (heroContent) {
        const section = document.createElement("div");
        section.className = "announcement-hero hidden";
        section.id = "site-announcement";
        section.setAttribute("aria-live", "polite");
        const text = document.createElement("p");
        text.id = "site-announcement-text";
        section.appendChild(text);
        const heading = heroContent.querySelector("h1");
        if (heading && heading.parentNode) {
          heading.insertAdjacentElement("afterend", section);
        } else {
          heroContent.insertBefore(section, heroContent.firstChild);
        }
        siteAnnouncement = section;
        siteAnnouncementText = text;
      }
    }
  }
  if (!siteAnnouncement || !siteAnnouncementText) return;
  const { ok, data } = await jsonFetch("/api/announcement", { method: "GET" });
  if (!ok) return;
  const enabled = Boolean(data.enabled);
  const message = String(data.message || "").trim();
  if (!enabled || !message) {
    siteAnnouncement.classList.add("hidden");
    siteAnnouncementText.textContent = "";
    return;
  }
  siteAnnouncementText.textContent = message;
  siteAnnouncement.classList.remove("hidden");
};

const getAuthMe = async () => {
  const { ok, data } = await jsonFetch("/api/auth/me", { method: "GET" });
  if (!ok) return { loggedIn: false, role: "guest", name: "", email: "" };
  return data;
};

const initBoardAdminMode = async () => {
  if (!recentGrid) return;
  const me = await getAuthMe();
  boardAdminMode = me.role === "admin";
};

const getCheckoutProfile = async () => {
  const { ok, data } = await jsonFetch("/api/profile/checkout", { method: "GET" });
  if (!ok) return null;
  return data.profile || {};
};

const saveCheckoutProfile = async (profile) => {
  const { ok, data } = await jsonFetch("/api/profile/checkout", {
    method: "POST",
    body: JSON.stringify(profile),
  });
  return { ok, data };
};

if (joinForm) {
  joinForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = joinForm.querySelector("button");
    const emailInput = joinForm.querySelector("#email");
    if (!button || !emailInput) return;
    const email = String(emailInput.value || "").trim();
    if (!email) {
      button.textContent = "Enter Email";
      return;
    }
    button.textContent = "Joining...";
    button.disabled = true;
    const { ok, data } = await jsonFetch("/api/drops/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    if (!ok) {
      button.textContent = data.error ? "Invalid Email" : "Try Again";
      button.disabled = false;
      return;
    }
    button.textContent = data.alreadySubscribed ? "Already On List" : "You Are In";
  });
}

addCartButtons.forEach((btn) => bindAddToCartButton(btn));
initProductImageZoom();
ensureFirstHatVisibleOnPhone();

if (mobileNavToggle && mainNavLinks) {
  mobileNavToggle.addEventListener("click", () => {
    const isOpen = mainNavLinks.classList.toggle("is-open");
    mobileNavToggle.classList.toggle("is-open", isOpen);
    mobileNavToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mainNavLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNavLinks.classList.remove("is-open");
      mobileNavToggle.classList.remove("is-open");
      mobileNavToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
      mainNavLinks.classList.remove("is-open");
      mobileNavToggle.classList.remove("is-open");
      mobileNavToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (cartList) {
  cartList.addEventListener("click", (event) => {
    const btn = event.target.closest(".cart-action");
    if (!btn) return;
    const idx = Number(btn.getAttribute("data-idx"));
    const action = btn.getAttribute("data-action");
    const cart = getCart();
    if (!Number.isInteger(idx) || idx < 0 || idx >= cart.length) return;
    if (action === "increase") cart[idx].quantity = Math.min(10, cart[idx].quantity + 1);
    if (action === "decrease") cart[idx].quantity = Math.max(1, cart[idx].quantity - 1);
    if (action === "remove") cart.splice(idx, 1);
    saveCart(cart);
    renderCart();
  });
}

if (cartClearBtn) {
  cartClearBtn.addEventListener("click", () => {
    saveCart([]);
    renderCart();
    if (cartStatus) cartStatus.textContent = "Cart cleared.";
    showToast("Cart cleared.");
  });
}

if (cartCheckoutBtn) {
  cartCheckoutBtn.addEventListener("click", (event) => {
    const cart = getCart();
    if (!cart.length) {
      event.preventDefault();
      if (cartStatus) cartStatus.textContent = "Add products before checkout.";
    }
  });
}

const renderRecentBoardCards = (items, append = false) => {
  if (!recentGrid) return;
  const html = items
    .map(
      (item) => `
      <article class="recent-card reveal is-visible">
        ${
          boardAdminMode
            ? `<button class="recent-delete-btn" data-id="${escapeHtml(item.id || "")}" type="button" aria-label="Delete post">×</button>`
            : ""
        }
        <img src="${escapeHtml(item.imagePath)}" alt="${escapeHtml(item.trophyType || "Bragging board entry")}" loading="lazy" />
        <p class="small"><strong>${escapeHtml(item.name || "Stonehorn Hunter")}</strong></p>
        <p class="small">${escapeHtml(item.trophyType || "Trophy Entry")}</p>
        <p class="small recent-story">${escapeHtml(item.story || "No story shared yet.")}</p>
      </article>
    `
    )
    .join("");
  if (append) recentGrid.insertAdjacentHTML("beforeend", html);
  else recentGrid.innerHTML = html;
};

const setRecentLoadMoreState = ({ hasMore, loading = false }) => {
  if (!recentLoadMoreBtn) return;
  recentLoadMoreBtn.classList.toggle("hidden", !hasMore);
  recentLoadMoreBtn.disabled = loading;
  recentLoadMoreBtn.textContent = loading ? "Loading..." : "Load More";
};

const loadRecentBoard = async ({ append = false } = {}) => {
  if (!recentGrid) return;
  const offset = append ? recentBoardOffset : 0;
  if (!append) {
    recentBoardOffset = 0;
    recentBoardTotal = 0;
    setRecentLoadMoreState({ hasMore: false, loading: true });
  } else {
    setRecentLoadMoreState({ hasMore: true, loading: true });
  }
  const { ok, data } = await jsonFetch(
    `/api/bragging/recent?limit=${encodeURIComponent(RECENT_BOARD_PAGE_SIZE)}&offset=${encodeURIComponent(offset)}`,
    { method: "GET" }
  );
  if (!ok || !Array.isArray(data.items)) {
    if (!append) {
      recentGrid.innerHTML = '<p class="small">Could not load recent entries.</p>';
    }
    setRecentLoadMoreState({ hasMore: false, loading: false });
    return;
  }
  if (!append && !data.items.length) {
    recentGrid.innerHTML = '<p class="small">No approved entries yet. Submit yours to start the board.</p>';
    setRecentLoadMoreState({ hasMore: false, loading: false });
    return;
  }
  renderRecentBoardCards(data.items, append);
  recentBoardOffset = offset + data.items.length;
  recentBoardTotal = Number(data.total || recentBoardOffset);
  const hasMore = Boolean(data.hasMore) && recentBoardOffset < recentBoardTotal;
  setRecentLoadMoreState({ hasMore, loading: false });
};

if (recentLoadMoreBtn) {
  recentLoadMoreBtn.addEventListener("click", async () => {
    await loadRecentBoard({ append: true });
  });
}

if (recentGrid) {
  recentGrid.addEventListener("click", async (event) => {
    const btn = event.target.closest(".recent-delete-btn");
    if (!btn || !boardAdminMode) return;
    const id = String(btn.getAttribute("data-id") || "").trim();
    if (!id) return;
    const confirmed = window.confirm("Delete this bragging board post?");
    if (!confirmed) return;
    const { ok, data } = await jsonFetch(`/api/admin/submissions/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!ok) {
      if (boardStatus) boardStatus.textContent = data.error || "Could not delete post.";
      return;
    }
    if (boardStatus) boardStatus.textContent = "Post deleted.";
    await loadRecentBoard({ append: false });
  });
}

const setBoardEntryAndFocus = (entryValue) => {
  if (!boardForm) return;
  boardForm.classList.remove("hidden");
  const entry = boardForm.querySelector("#entry-path");
  if (entry && entryValue) entry.value = entryValue;
  boardForm.scrollIntoView({ behavior: "smooth", block: "start" });
};

if (boardOptionTwo && boardForm) {
  boardOptionTwo.addEventListener("click", (event) => {
    const href = boardOptionTwo.getAttribute("href") || "";
    if (href.startsWith("#")) {
      event.preventDefault();
      setBoardEntryAndFocus("Paying the $25 board fee");
    }
  });
}

if (boardForm) {
  const params = new URLSearchParams(window.location.search);
  const fromCheckout = params.get("from_checkout") === "1";
  const entryToken = params.get("entry_token") || "";
  const entrySessionId = params.get("session_id") || "";
  const entryPath = params.get("entry_path") || "";
  const entry = boardForm.querySelector("#entry-path");
  const tokenInput = boardForm.querySelector("#entry-token");
  if (tokenInput) tokenInput.value = entryToken;
  if (entryPath && entry) entry.value = entryPath;
  boardForm.classList.add("hidden");

  if (fromCheckout) {
    if (!entryToken) {
      if (!entrySessionId) {
        if (boardStatus) boardStatus.textContent = "No valid entry token was found. Use your order confirmation link.";
      } else {
        jsonFetch(`/api/checkout/session-status?session_id=${encodeURIComponent(entrySessionId)}`, { method: "GET" }).then(
          ({ ok, data }) => {
            if (!ok || !data?.paid) {
              if (boardStatus) boardStatus.textContent = "Payment is still processing. Try this link again in a minute.";
              return;
            }
            if (!data.braggingEntryEligible || !data.braggingEntryToken) {
              if (boardStatus) {
                boardStatus.textContent =
                  data.braggingEntryUsed
                    ? "Entry already submitted for this purchase."
                    : "This purchase does not currently have an active entry token.";
              }
              return;
            }
            if (tokenInput) tokenInput.value = data.braggingEntryToken;
            if (entry && data.braggingEntryPath) entry.value = data.braggingEntryPath;
            if (boardStatus) {
              boardStatus.textContent = "Checkout complete. You can submit one Bragging Board entry for this purchase.";
            }
            setBoardEntryAndFocus(data.braggingEntryPath || entryPath || "Buying a hat");
          }
        );
      }
    } else {
      jsonFetch(`/api/bragging/entry-access?token=${encodeURIComponent(entryToken)}`, { method: "GET" }).then(
        ({ ok, data }) => {
          if (!ok || !data.allowed) {
            if (boardStatus) {
              boardStatus.textContent = data?.reason || "This entry link is not valid.";
            }
            return;
          }
          if (entry && data.entryPath) entry.value = data.entryPath;
          if (boardStatus) {
            boardStatus.textContent = "Checkout complete. You can submit one Bragging Board entry for this purchase.";
          }
          setBoardEntryAndFocus(data.entryPath || entryPath || "Buying a hat");
        }
      );
    }
  }

  boardForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = boardForm.querySelector("button");
    const photoInput = boardForm.querySelector("#trophy-photo");
    const nameInput = boardForm.querySelector("#hunter-name");
    const typeInput = boardForm.querySelector("#trophy-type");
    const storyInput = boardForm.querySelector("#story");
    const entryInput = boardForm.querySelector("#entry-path");
    const entryTokenInput = boardForm.querySelector("#entry-token");
    if (!button || !photoInput || !nameInput || !typeInput || !storyInput || !entryInput || !entryTokenInput) return;
    if (!entryTokenInput.value) {
      button.textContent = "Invalid Entry Link";
      if (boardStatus) boardStatus.textContent = "Use your order confirmation link to submit your entry.";
      return;
    }
    if (!photoInput.files.length) {
      button.textContent = "Add Trophy Photo First";
      return;
    }
    const file = photoInput.files[0];
    if (!file.type.startsWith("image/")) {
      button.textContent = "Image File Required";
      return;
    }
    button.textContent = "Uploading...";
    button.disabled = true;
    try {
      const imageDataUrl = await fileToDataUrl(file);
      const { ok, data } = await jsonFetch("/api/bragging/submit", {
        method: "POST",
        body: JSON.stringify({
          name: nameInput.value.trim(),
          trophyType: typeInput.value.trim(),
          story: storyInput.value.trim(),
          entryPath: entryInput.value,
          entryToken: entryTokenInput.value.trim(),
          imageDataUrl,
        }),
      });
      if (!ok) {
        button.textContent = "Submit Failed";
        button.disabled = false;
        if (boardStatus) boardStatus.textContent = data.error || "Submission failed.";
        return;
      }
      button.textContent = "Submitted";
      boardForm.classList.add("hidden");
      entryTokenInput.value = "";
      if (boardStatus) boardStatus.textContent = "Submission received and pending review. This purchase entry has been used.";
    } catch {
      button.textContent = "Submit Failed";
      button.disabled = false;
      if (boardStatus) boardStatus.textContent = "Upload failed. Try again.";
    }
  });
}

const renderAdminItems = (items) => {
  if (!adminList) return;
  if (!items.length) {
    adminList.innerHTML = '<p class="small">No submissions yet.</p>';
    return;
  }
  adminList.innerHTML = items
    .map(
      (item) => `
      <article class="recent-card reveal is-visible">
        <img src="${escapeHtml(item.imagePath)}" alt="Submission ${escapeHtml(item.id)}" loading="lazy" />
        <p class="small"><strong>${escapeHtml(item.name || "Unknown Hunter")}</strong></p>
        <p class="small">${escapeHtml(item.trophyType || "No trophy type provided")}</p>
        <p class="small recent-story">${escapeHtml(item.story || "No story provided.")}</p>
        <p class="small">Status: ${escapeHtml(item.status || "pending")}</p>
        <div class="hunter-gate-actions">
          <button class="btn btn-sm admin-action" data-id="${item.id}" data-action="approve">Approve</button>
          <button class="btn btn-ghost btn-sm admin-action" data-id="${item.id}" data-action="reject">Reject</button>
          <button class="btn btn-ghost btn-sm admin-action" data-id="${item.id}" data-action="edit">Edit</button>
          <button class="btn btn-ghost btn-sm admin-action" data-id="${item.id}" data-action="delete">Delete</button>
        </div>
      </article>
    `
    )
    .join("");

  adminList.querySelectorAll(".admin-action").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");
      if (!id || !action) return;

      if (action === "edit") {
        const current = items.find((entry) => entry.id === id) || {};
        const nextName = prompt("Edit hunter name:", current.name || "");
        if (nextName === null) return;
        const nextType = prompt("Edit trophy type:", current.trophyType || "");
        if (nextType === null) return;
        const nextStory = prompt("Edit short story:", current.story || "");
        if (nextStory === null) return;
        const { ok, data } = await jsonFetch(`/api/admin/submissions/${id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: nextName.trim(),
            trophyType: nextType.trim(),
            story: nextStory.trim(),
          }),
        });
        if (!ok) {
          if (adminStatus) adminStatus.textContent = data.error || "Edit failed.";
          return;
        }
        if (adminStatus) adminStatus.textContent = "Submission updated.";
        await loadAdminQueue();
        return;
      }

      if (action === "delete") {
        const confirmed = window.confirm("Delete this submission? This removes it from the bragging board.");
        if (!confirmed) return;
        const { ok, data } = await jsonFetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
        if (!ok) {
          if (adminStatus) adminStatus.textContent = data.error || "Delete failed.";
          return;
        }
        if (adminStatus) adminStatus.textContent = "Submission deleted.";
        await loadAdminQueue();
        return;
      }

      const { ok } = await jsonFetch(`/api/admin/submissions/${id}/${action}`, { method: "POST" });
      if (!ok) {
        if (adminStatus) adminStatus.textContent = "Action failed.";
        return;
      }
      if (adminStatus) adminStatus.textContent = `Submission ${action}d.`;
      await loadAdminQueue();
    });
  });
};

const loadAdminQueue = async () => {
  if (!adminList) return;
  const { ok, data } = await jsonFetch("/api/admin/submissions", { method: "GET" });
  if (!ok) {
    adminList.innerHTML = '<p class="small">Login required to view submissions.</p>';
    return;
  }
  renderAdminItems(data.items || []);
};

const renderAdminOrders = (items) => {
  if (!adminOrdersList) return;
  if (!items.length) {
    adminOrdersList.innerHTML = '<p class="small">No orders yet.</p>';
    return;
  }
  adminOrdersList.innerHTML = items
    .map((item) => {
      const amount = Number(item.amountTotal || item.unitAmount || 0) / 100;
      const purchaseDate = item.paidAt || item.createdAt ? new Date(item.paidAt || item.createdAt).toLocaleString() : "-";
      const emailState = item.emailSentAt ? "Sent" : item.emailError ? "Error" : "Pending";
      const orderNum = formatOrderNumber(item.stripeSessionId);
      const itemSummary = formatOrderItemsLabel(item);
      const skuSummary = getOrderSkuSummary(item);
      const refundState = getRefundState(item);
      const customerName = String(item.customerName || "").trim() || "N/A";
      const fulfillmentState =
        item.status === "shipped"
          ? "Shipped"
          : item.status === "packed"
            ? "Packed"
            : item.status === "paid"
              ? "Unfulfilled"
              : item.status === "cancelled" && refundState.isFull
                ? "Cancelled (Refunded)"
              : item.status || "Unknown";
      const fulfillmentClass =
        item.status === "shipped" || item.status === "packed"
          ? "fulfillment-good"
          : item.status === "paid"
            ? "fulfillment-bad"
            : "fulfillment-neutral";
      const shippedDate = item.shippedAt ? new Date(item.shippedAt).toLocaleDateString() : "";
      const trackingSummary =
        item.status === "shipped" && item.trackingNumber
          ? `${item.carrier ? `${item.carrier} ` : ""}${item.trackingNumber}`
          : "";
      return `
      <article class="recent-card order-card reveal is-visible">
        <details class="order-details">
          <summary class="small">
            <strong>${escapeHtml(orderNum)}</strong> | ${escapeHtml(purchaseDate)} | $${amount.toFixed(2)} | ${escapeHtml(customerName)}
          </summary>
          <div class="order-details-body">
            <p class="small"><strong>${escapeHtml(itemSummary)}</strong></p>
            ${skuSummary ? `<p class="small">SKU: ${escapeHtml(skuSummary)}</p>` : ""}
            <p class="small">Email: ${escapeHtml(item.customerEmail || "N/A")}</p>
            <p class="small">Status: ${escapeHtml(item.status || "unknown")} | Purchased: ${escapeHtml(purchaseDate)}</p>
            <p class="small ${fulfillmentClass}">Fulfillment: ${fulfillmentState}${shippedDate ? ` (${shippedDate})` : ""}</p>
            ${refundState.label ? `<p class="small ${refundState.className}">Payment: ${escapeHtml(refundState.label)}</p>` : ""}
            ${trackingSummary ? `<p class="small">Tracking: ${escapeHtml(trackingSummary)}</p>` : ""}
            <p class="small">Confirmation Email: ${emailState}</p>
          </div>
        </details>
      </article>
      `;
    })
    .join("");
};

const renderFilteredAdminOrders = () => {
  const query = (adminOrdersSearch?.value || "").trim().toLowerCase();
  if (!query) {
    renderAdminOrders(adminOrdersCache);
    return;
  }
  const filtered = adminOrdersCache.filter((item) => {
    const email = String(item.customerEmail || "").toLowerCase();
    const orderId = String(item.stripeSessionId || "").toLowerCase();
    const shortOrder = formatOrderNumber(item.stripeSessionId).toLowerCase();
    return email.includes(query) || orderId.includes(query) || shortOrder.includes(query);
  });
  renderAdminOrders(filtered);
};

const loadAdminOrders = async () => {
  if (!adminOrdersList) return;
  const { ok, data } = await jsonFetch("/api/admin/orders", { method: "GET" });
  if (!ok) {
    adminOrdersList.innerHTML = '<p class="small">Login required to view orders.</p>';
    return;
  }
  adminOrdersCache = Array.isArray(data.items) ? data.items.slice(0, 5) : [];
  renderFilteredAdminOrders();
};

const loadDropSubscribers = async () => {
  if (!dropsCount) return;
  const { ok, data } = await jsonFetch("/api/admin/drops/subscribers", { method: "GET" });
  if (!ok) {
    dropsCount.textContent = "Admin login required to view subscribers.";
    return;
  }
  const items = Array.isArray(data.items) ? data.items : [];
  dropsCount.textContent = `${items.length} subscriber${items.length === 1 ? "" : "s"}.`;
};

const loadAdminAnnouncement = async () => {
  if (!announcementEnabled || !announcementMessage) return;
  const { ok, data } = await jsonFetch("/api/admin/announcement", { method: "GET" });
  if (!ok) {
    if (announcementStatus) announcementStatus.textContent = "Admin login required to load announcement.";
    return;
  }
  announcementEnabled.checked = Boolean(data.enabled);
  announcementMessage.value = String(data.message || "");
  if (announcementStatus) {
    const stamp = data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "Not set";
    announcementStatus.textContent = `Current announcement loaded. Last updated: ${stamp}`;
  }
};

const renderAdminInventory = (items) => {
  if (!inventoryList) return;
  if (!items.length) {
    inventoryList.innerHTML = '<p class="small">No inventory items found.</p>';
    return;
  }
  const header = `
    <div class="inventory-row inventory-row-head">
      <p class="small"><strong>Item</strong></p>
      <p class="small"><strong>On Hand</strong></p>
      <p class="small"><strong>Price</strong></p>
      <p class="small"><strong>Clicks</strong></p>
      <p class="small"><strong>Remaining</strong></p>
    </div>
  `;
  inventoryList.innerHTML = items
    .map((entry) => {
      const stockVal = entry.remaining === null || typeof entry.remaining === "undefined" ? "" : String(entry.remaining);
      const priceVal = Number(adminPriceMap.get(entry.item) || 0).toFixed(2);
      const skuLabel = String(PRODUCT_SKUS[String(entry.item || "").trim()] || "N/A");
      const clickCount = Math.max(0, Number(entry.clickCount || 0));
      const remainingLabel =
        entry.remaining === null ? "Not tracked" : `${entry.remaining} left (sold ${entry.sold || 0})`;
      return `
        <div class="inventory-row">
          <p class="small"><strong>${escapeHtml(entry.item)}</strong><br /><span class="small">SKU: ${escapeHtml(skuLabel)}</span></p>
          <input type="number" min="0" step="1" data-item-stock="${escapeHtml(entry.item)}" value="${escapeHtml(stockVal)}" placeholder="Untracked" />
          <input type="number" min="0.01" step="0.01" data-item-price="${escapeHtml(entry.item)}" value="${escapeHtml(priceVal)}" />
          <p class="small">${clickCount}</p>
          <p class="small">${escapeHtml(remainingLabel)}</p>
        </div>
      `;
    })
    .join("");
  inventoryList.innerHTML = header + inventoryList.innerHTML;
};

const loadAdminInventory = async () => {
  if (!inventoryList) return;
  const [inventoryResp, pricingResp] = await Promise.all([
    jsonFetch("/api/admin/inventory", { method: "GET" }),
    jsonFetch("/api/admin/pricing", { method: "GET" }),
  ]);
  if (!inventoryResp.ok) {
    inventoryList.innerHTML = '<p class="small">Admin login required to view inventory.</p>';
    return;
  }
  if (pricingResp.ok && Array.isArray(pricingResp.data.items)) {
    adminPriceMap = new Map(pricingResp.data.items.map((entry) => [entry.item, Number(entry.price)]));
  } else {
    adminPriceMap = new Map();
  }
  renderAdminInventory(Array.isArray(inventoryResp.data.items) ? inventoryResp.data.items : []);
};

const renderFulfillmentOrders = (items) => {
  if (!fulfillmentList) return;
  if (!items.length) {
    fulfillmentList.innerHTML = '<p class="small">No open fulfillment orders.</p>';
    return;
  }
  fulfillmentList.innerHTML = items
    .map((item) => {
      const amount = Number(item.amountTotal || item.unitAmount || 0) / 100;
      const refundState = getRefundState(item);
      const canPack = item.status === "paid" && !refundState.isFull;
      const canShip = (item.status === "paid" || item.status === "packed") && !refundState.isFull;
      const orderDateRaw = item.paidAt || item.createdAt || "";
      const orderDate = orderDateRaw ? new Date(orderDateRaw).toLocaleString() : "N/A";
      const itemSummary = formatOrderItemsLabel(item);
      const skuSummary = getOrderSkuSummary(item);
      const address = item.shippingAddress
        ? `${item.shippingAddress.address1 || ""} ${item.shippingAddress.address2 || ""}, ${item.shippingAddress.city || ""}, ${item.shippingAddress.state || ""} ${item.shippingAddress.zip || ""}`.trim()
        : "N/A";
      const orderNum = formatOrderNumber(item.stripeSessionId);
      const customerName = String(item.customerName || "").trim() || "N/A";
      return `
        <article class="recent-card order-card reveal is-visible">
          <details class="order-details">
            <summary class="small">
              <strong>${escapeHtml(orderNum)}</strong> | ${escapeHtml(orderDate)} | $${amount.toFixed(2)} | ${escapeHtml(customerName)}
            </summary>
            <div class="order-details-body">
              <p class="small"><strong>${escapeHtml(itemSummary)}</strong></p>
              ${skuSummary ? `<p class="small">SKU: ${escapeHtml(skuSummary)}</p>` : ""}
              <p class="small">Email: ${escapeHtml(item.customerEmail || "N/A")}</p>
              <p class="small">Ship To: ${escapeHtml(address)}</p>
              <p class="small">Status: ${escapeHtml(item.status || "unknown")}</p>
              ${refundState.label ? `<p class="small ${refundState.className}">Payment: ${escapeHtml(refundState.label)}</p>` : ""}
              ${
                item.trackingNumber
                  ? `<p class="small">Tracking: ${escapeHtml(item.carrier || "")} ${escapeHtml(item.trackingNumber || "")}</p>`
                  : ""
              }
              <div class="hunter-gate-actions">
                ${
                  canPack
                    ? `<button class="btn btn-sm fulfillment-action" data-action="pack" data-id="${escapeHtml(item.stripeSessionId || "")}" type="button">Mark Packed</button>`
                    : ""
                }
                ${
                  canShip
                    ? `<button class="btn btn-ghost btn-sm fulfillment-action" data-action="ship" data-id="${escapeHtml(item.stripeSessionId || "")}" type="button">Mark Shipped</button>`
                    : ""
                }
                <button class="btn btn-ghost btn-sm fulfillment-action" data-action="copy-label" data-id="${escapeHtml(item.stripeSessionId || "")}" type="button">Copy For Label</button>
                <button class="btn btn-ghost btn-sm fulfillment-action" data-action="print-slip" data-id="${escapeHtml(item.stripeSessionId || "")}" type="button">Print Slip</button>
              </div>
            </div>
          </details>
        </article>
      `;
    })
    .join("");

  fulfillmentList.querySelectorAll(".fulfillment-action").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const orderId = btn.getAttribute("data-id") || "";
      const action = btn.getAttribute("data-action") || "";
      if (!orderId || !action) return;

      if (action === "pack") {
        const confirmed = window.confirm("Mark this order as packed?");
        if (!confirmed) return;
        const { ok, data } = await jsonFetch(`/api/worker/orders/${encodeURIComponent(orderId)}/pack`, { method: "POST" });
        if (!ok) {
          if (workerStatus) workerStatus.textContent = data.error || "Could not mark packed.";
          return;
        }
        if (workerStatus) workerStatus.textContent = "Order marked packed.";
        await loadFulfillmentOrders();
        return;
      }

      if (action === "ship") {
        const carrier = prompt("Carrier (UPS, USPS, FedEx, etc):", "UPS");
        if (carrier === null) return;
        const trackingNumber = prompt("Tracking number:");
        if (trackingNumber === null) return;
        const fulfillmentNotes = prompt("Optional fulfillment note:", "") || "";
        const { ok, data } = await jsonFetch(`/api/worker/orders/${encodeURIComponent(orderId)}/ship`, {
          method: "POST",
          body: JSON.stringify({
            carrier: carrier.trim(),
            trackingNumber: trackingNumber.trim(),
            fulfillmentNotes: fulfillmentNotes.trim(),
          }),
        });
        if (!ok) {
          if (workerStatus) workerStatus.textContent = data.error || "Could not mark shipped.";
          return;
        }
        if (workerStatus) workerStatus.textContent = "Order marked shipped.";
        await loadFulfillmentOrders();
        return;
      }

      if (action === "copy-label") {
        const target = items.find((entry) => String(entry.stripeSessionId || "") === String(orderId));
        if (!target) return;
        const text = buildLabelCopyText(target);
        try {
          await navigator.clipboard.writeText(text);
          if (workerStatus) workerStatus.textContent = "Order copied for shipping label.";
        } catch {
          if (workerStatus) workerStatus.textContent = "Could not copy to clipboard.";
        }
        return;
      }

      if (action === "print-slip") {
        const target = items.find((entry) => String(entry.stripeSessionId || "") === String(orderId));
        if (!target) return;
        printPackingSlip(target);
        if (workerStatus) workerStatus.textContent = "Packing slip opened for print.";
      }
    });
  });
};

const loadFulfillmentOrders = async () => {
  if (!fulfillmentList) return;
  const selectedStatus = String(workerOrderFilter?.value || "latest").trim().toLowerCase();
  const allowed = new Set(["latest", "open", "paid", "packed", "shipped", "created", "cancelled", "all"]);
  const status = allowed.has(selectedStatus) ? selectedStatus : "latest";
  const apiStatus = status === "latest" ? "open" : status;
  const { ok, data } = await jsonFetch(`/api/worker/orders?status=${encodeURIComponent(apiStatus)}`, { method: "GET" });
  if (!ok) {
    fulfillmentList.innerHTML = '<p class="small">Worker or admin login required to view fulfillment orders.</p>';
    if (workerFilterCount) workerFilterCount.textContent = "";
    return;
  }
  const allItems = Array.isArray(data.items) ? data.items : [];
  const items = status === "latest" ? allItems.slice(0, 10) : allItems.slice(0, 20);
  const statusLabel =
    status === "latest"
      ? "open"
      : status;
  if (workerFilterCount) {
    const shownLimit = status === "latest" ? 10 : 20;
    workerFilterCount.textContent = `Showing ${Math.min(items.length, shownLimit)} of ${allItems.length} ${statusLabel} order${
      allItems.length === 1 ? "" : "s"
    }.`;
  }
  if (!items.length) {
    const label =
      status === "latest"
        ? "No recent open fulfillment orders."
        : status === "open"
          ? "No open fulfillment orders."
        : `No ${status} orders found.`;
    fulfillmentList.innerHTML = `<p class="small">${escapeHtml(label)}</p>`;
    return;
  }
  renderFulfillmentOrders(items);
};

if (adminOrdersSearch) {
  adminOrdersSearch.addEventListener("input", () => {
    renderFilteredAdminOrders();
  });
}

if (adminLoginBtn && adminPassword) {
  adminLoginBtn.addEventListener("click", async () => {
    const email = (adminEmail?.value || "").trim();
    const password = adminPassword.value;
    const { ok, data } = await jsonFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!ok) {
      if (adminStatus) adminStatus.textContent = data.error || "Login failed.";
      return;
    }
    if (data.role !== "admin") {
      if (adminStatus) adminStatus.textContent = "Admin access required.";
      return;
    }
    if (adminStatus) adminStatus.textContent = "Logged in.";
    if (adminAuthBox) adminAuthBox.classList.add("hidden");
    await loadAdminQueue();
    await loadAdminOrders();
    await loadDropSubscribers();
    await loadAdminAnnouncement();
    await loadAdminInventory();
    await startStaffNotificationPolling();
  });
}

if (adminRefreshBtn) {
  adminRefreshBtn.addEventListener("click", async () => {
    await loadAdminQueue();
  });
}

if (adminOrdersRefreshBtn) {
  adminOrdersRefreshBtn.addEventListener("click", async () => {
    await loadAdminOrders();
  });
}

if (dropsRefreshBtn) {
  dropsRefreshBtn.addEventListener("click", async () => {
    await loadDropSubscribers();
    if (dropsStatus) dropsStatus.textContent = "Subscriber list refreshed.";
  });
}

if (dropsSendBtn) {
  dropsSendBtn.addEventListener("click", async () => {
    const subject = String(dropsSubject?.value || "").trim();
    const message = String(dropsMessage?.value || "").trim();
    if (!subject || !message) {
      if (dropsStatus) dropsStatus.textContent = "Subject and message are required.";
      return;
    }
    dropsSendBtn.disabled = true;
    dropsSendBtn.textContent = "Sending...";
    let imageDataUrl = "";
    const photoFile = dropsPhoto?.files?.[0];
    if (photoFile) {
      if (!photoFile.type.startsWith("image/")) {
        if (dropsStatus) dropsStatus.textContent = "Drop photo must be an image file.";
        dropsSendBtn.disabled = false;
        dropsSendBtn.textContent = "Send Update To All Subscribers";
        return;
      }
      try {
        imageDataUrl = String(await fileToDataUrl(photoFile));
      } catch {
        if (dropsStatus) dropsStatus.textContent = "Could not read image file.";
        dropsSendBtn.disabled = false;
        dropsSendBtn.textContent = "Send Update To All Subscribers";
        return;
      }
    }
    const { ok, data } = await jsonFetch("/api/admin/drops/send-update", {
      method: "POST",
      body: JSON.stringify({ subject, message, imageDataUrl }),
    });
    if (!ok) {
      if (dropsStatus) dropsStatus.textContent = data.error || "Send failed.";
      dropsSendBtn.disabled = false;
      dropsSendBtn.textContent = "Send Update To All Subscribers";
      return;
    }
    if (dropsStatus) dropsStatus.textContent = `Update sent. ${data.sent}/${data.total} delivered, ${data.failed} failed.`;
    if (dropsPhoto) dropsPhoto.value = "";
    dropsSendBtn.disabled = false;
    dropsSendBtn.textContent = "Send Update To All Subscribers";
  });
}

if (announcementRefreshBtn) {
  announcementRefreshBtn.addEventListener("click", async () => {
    await loadAdminAnnouncement();
  });
}

if (announcementSaveBtn) {
  announcementSaveBtn.addEventListener("click", async () => {
    const enabled = Boolean(announcementEnabled?.checked);
    const message = String(announcementMessage?.value || "").trim();
    if (enabled && !message) {
      if (announcementStatus) announcementStatus.textContent = "Message is required when announcement is enabled.";
      return;
    }
    announcementSaveBtn.disabled = true;
    announcementSaveBtn.textContent = "Saving...";
    const { ok, data } = await jsonFetch("/api/admin/announcement", {
      method: "POST",
      body: JSON.stringify({ enabled, message }),
    });
    if (!ok) {
      if (announcementStatus) announcementStatus.textContent = data.error || "Could not save announcement.";
      announcementSaveBtn.disabled = false;
      announcementSaveBtn.textContent = "Save Announcement";
      return;
    }
    if (announcementStatus) announcementStatus.textContent = enabled ? "Announcement saved and enabled." : "Announcement saved and hidden.";
    announcementSaveBtn.disabled = false;
    announcementSaveBtn.textContent = "Save Announcement";
  });
}

if (inventoryRefreshBtn) {
  inventoryRefreshBtn.addEventListener("click", async () => {
    await loadAdminInventory();
    if (inventoryStatus) inventoryStatus.textContent = "Inventory refreshed.";
  });
}

if (inventorySaveBtn) {
  inventorySaveBtn.addEventListener("click", async () => {
    if (!inventoryList) return;
    const stockInputs = Array.from(inventoryList.querySelectorAll("input[data-item-stock]"));
    const priceInputs = Array.from(inventoryList.querySelectorAll("input[data-item-price]"));
    const inventoryPayload = stockInputs.map((input) => {
      const item = String(input.getAttribute("data-item-stock") || "");
      const raw = String(input.value || "").trim();
      return {
        item,
        stock: raw === "" ? null : Number(raw),
      };
    });
    const pricingPayload = priceInputs.map((input) => ({
      item: String(input.getAttribute("data-item-price") || ""),
      price: Number(String(input.value || "").trim()),
    }));
    inventorySaveBtn.disabled = true;
    inventorySaveBtn.textContent = "Saving...";
    const inventoryResp = await jsonFetch("/api/admin/inventory", {
      method: "POST",
      body: JSON.stringify({ items: inventoryPayload }),
    });
    if (!inventoryResp.ok) {
      if (inventoryStatus) inventoryStatus.textContent = inventoryResp.data.error || "Could not save inventory.";
      inventorySaveBtn.disabled = false;
      inventorySaveBtn.textContent = "Save Inventory + Prices";
      return;
    }
    const pricingResp = await jsonFetch("/api/admin/pricing", {
      method: "POST",
      body: JSON.stringify({ items: pricingPayload }),
    });
    if (!pricingResp.ok) {
      if (inventoryStatus) inventoryStatus.textContent = pricingResp.data.error || "Inventory saved, but pricing failed.";
      inventorySaveBtn.disabled = false;
      inventorySaveBtn.textContent = "Save Inventory + Prices";
      return;
    }
    adminPriceMap = new Map(
      (Array.isArray(pricingResp.data.items) ? pricingResp.data.items : []).map((entry) => [entry.item, Number(entry.price)])
    );
    renderAdminInventory(Array.isArray(inventoryResp.data.items) ? inventoryResp.data.items : []);
    if (inventoryStatus) inventoryStatus.textContent = "Inventory and pricing saved.";
    await loadPublicInventory();
    inventorySaveBtn.disabled = false;
    inventorySaveBtn.textContent = "Save Inventory + Prices";
  });
}

if (workerLoginBtn && workerPassword) {
  workerLoginBtn.addEventListener("click", async () => {
    const email = (workerEmail?.value || "").trim();
    const password = workerPassword.value;
    const { ok, data } = await jsonFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!ok) {
      if (workerStatus) workerStatus.textContent = data.error || "Login failed.";
      return;
    }
    if (data.role !== "worker" && data.role !== "admin") {
      if (workerStatus) workerStatus.textContent = "Worker or admin access required.";
      return;
    }
    if (workerStatus) workerStatus.textContent = `Logged in as ${data.email || data.name || "staff"}.`;
    if (workerAuthBox) workerAuthBox.classList.add("hidden");
    await loadFulfillmentOrders();
    await startStaffNotificationPolling();
  });
}

if (workerRefreshBtn) {
  workerRefreshBtn.addEventListener("click", async () => {
    await loadFulfillmentOrders();
  });
}

if (workerOrderFilter) {
  workerOrderFilter.addEventListener("change", async () => {
    await loadFulfillmentOrders();
  });
  workerOrderFilter.addEventListener("input", async () => {
    await loadFulfillmentOrders();
  });
}

if (staffNotifyRefreshBtn) {
  staffNotifyRefreshBtn.addEventListener("click", async () => {
    await loadStaffNotifications({ silent: false });
  });
}

if (staffNotifyMarkReadBtn) {
  staffNotifyMarkReadBtn.addEventListener("click", async () => {
    const { ok } = await jsonFetch("/api/staff/notifications/mark-read", {
      method: "POST",
      body: JSON.stringify({ all: true }),
    });
    if (!ok) return;
    await loadStaffNotifications({ silent: false });
  });
}

if (staffNotifyClearBtn) {
  staffNotifyClearBtn.addEventListener("click", async () => {
    const { ok } = await jsonFetch("/api/staff/notifications/clear", {
      method: "POST",
      body: JSON.stringify({ all: true }),
    });
    if (!ok) return;
    await loadStaffNotifications({ silent: false });
    showToast("Alerts cleared.");
  });
}

if (staffNotifyDesktopToggle) {
  staffNotifyDesktopToggle.addEventListener("change", async () => {
    const wantsEnabled = Boolean(staffNotifyDesktopToggle.checked);
    const supported = typeof window !== "undefined" && "Notification" in window;
    if (!supported) {
      setDesktopNotifyEnabled(false);
      updateDesktopNotifyStatus();
      return;
    }
    if (!wantsEnabled) {
      setDesktopNotifyEnabled(false);
      updateDesktopNotifyStatus();
      return;
    }
    if (Notification.permission === "granted") {
      setDesktopNotifyEnabled(true);
      updateDesktopNotifyStatus();
      return;
    }
    if (Notification.permission === "denied") {
      setDesktopNotifyEnabled(false);
      updateDesktopNotifyStatus();
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setDesktopNotifyEnabled(permission === "granted");
    } catch {
      setDesktopNotifyEnabled(false);
    }
    updateDesktopNotifyStatus();
  });
}

const initAdminPages = async () => {
  if (!adminList && !adminOrdersList) return;
  const me = await getAuthMe();
  if (me.role === "admin") {
    if (adminAuthBox) adminAuthBox.classList.add("hidden");
    if (adminStatus) adminStatus.textContent = `Logged in as ${me.email || "admin"}.`;
    if (adminEmail && !adminEmail.value) adminEmail.value = me.email || "";
    await loadAdminQueue();
    await loadAdminOrders();
    await loadDropSubscribers();
    await loadAdminAnnouncement();
    await loadAdminInventory();
    await startStaffNotificationPolling();
  } else {
    if (adminAuthBox) adminAuthBox.classList.remove("hidden");
    if (adminStatus) adminStatus.textContent = "Admin login required for this page.";
    stopStaffNotificationPolling();
    if (staffNotifyBox) staffNotifyBox.classList.add("hidden");
  }
};

const initFulfillmentPage = async () => {
  if (!fulfillmentList) return;
  const me = await getAuthMe();
  if (me.role === "admin" || me.role === "worker") {
    if (workerAuthBox) workerAuthBox.classList.add("hidden");
    if (workerStatus) workerStatus.textContent = `Logged in as ${me.email || me.name || "staff"}.`;
    if (workerEmail && !workerEmail.value) workerEmail.value = me.email || "";
    await loadFulfillmentOrders();
    await startStaffNotificationPolling();
  } else {
    if (workerAuthBox) workerAuthBox.classList.remove("hidden");
    if (workerStatus) workerStatus.textContent = "Worker or admin login required for this page.";
    stopStaffNotificationPolling();
    if (staffNotifyBox) staffNotifyBox.classList.add("hidden");
  }
};

if (loginForm && signupForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = loginForm.querySelector("#login-email")?.value || "";
    const password = loginForm.querySelector("#login-password")?.value || "";
    const { ok, data } = await jsonFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!ok) {
      if (loginStatus) loginStatus.textContent = data.error || "Login failed.";
      return;
    }
    localStorage.setItem(CHECKOUT_PREF_KEY, loginSavePref?.checked ? "true" : "false");
    if (loginStatus) loginStatus.textContent = "Login successful.";
    window.location.href = data.role === "worker" ? "./fulfillment.html" : "./index.html";
  });

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = signupForm.querySelector("#signup-name")?.value || "";
    const email = signupForm.querySelector("#signup-email")?.value || "";
    const password = signupForm.querySelector("#signup-password")?.value || "";
    const { ok, data } = await jsonFetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    if (!ok) {
      if (signupStatus) signupStatus.textContent = data.error || "Signup failed.";
      return;
    }
    localStorage.setItem(CHECKOUT_PREF_KEY, signupSavePref?.checked ? "true" : "false");
    if (signupStatus) signupStatus.textContent = "Account created.";
    window.location.href = "./index.html";
  });
}

if (accountGreeting) {
  getAuthMe().then((me) => {
    if (!me.loggedIn) {
      accountGreeting.textContent = "You are not logged in.";
      if (accountRole) accountRole.textContent = "Login to save checkout info.";
      if (staffLinks) staffLinks.classList.add("hidden");
      if (adminOnlyLinks) adminOnlyLinks.classList.add("hidden");
      return;
    }
    accountGreeting.textContent = `Welcome, ${me.name || "Stonehorn member"}.`;
    if (accountRole) accountRole.textContent = `Role: ${me.role}`;
    if (accountLoginLink) accountLoginLink.classList.add("hidden");
    if (staffLinks) {
      if (me.role === "admin" || me.role === "worker") staffLinks.classList.remove("hidden");
      else staffLinks.classList.add("hidden");
    }
    if (adminOnlyLinks) {
      if (me.role === "admin") adminOnlyLinks.classList.remove("hidden");
      else adminOnlyLinks.classList.add("hidden");
    }
  });
}

if (accountLogoutBtn) {
  accountLogoutBtn.addEventListener("click", async () => {
    await jsonFetch("/api/auth/logout", { method: "POST" });
    window.location.href = "./login.html";
  });
}

if (checkoutForm && checkoutItem && checkoutPrice) {
  const params = new URLSearchParams(window.location.search);
  const itemParam = params.get("item") || "";
  const priceParam = Number(params.get("price") || "0");
  const returnTo = params.get("return_to") || "";
  const entryPath = params.get("entry_path") || "";
  const cart = getCart();
  const isCartCheckout = !itemParam && cart.length > 0;

  let item = itemParam || "Stonehorn Hat";
  let price = Number.isFinite(priceParam) && priceParam > 0 ? priceParam : 42;

  if (isCartCheckout) {
    item = `${cart.reduce((sum, entry) => sum + entry.quantity, 0)} items`;
    price = getCartTotal(cart);
    if (checkoutCartSummary) {
      checkoutCartSummary.classList.remove("hidden");
      checkoutCartSummary.innerHTML = cart
        .map((entry) => `${escapeHtml(entry.item)} x ${entry.quantity} - $${(entry.unitPrice * entry.quantity).toFixed(2)}`)
        .join("<br />");
    }
    if (checkoutQty) {
      checkoutQty.value = "1";
      checkoutQty.disabled = true;
    }
  }

  checkoutItem.value = item;
  checkoutPrice.value = `$${price.toFixed(2)}`;

  if (itemParam) {
    jsonFetch("/api/pricing/public", { method: "GET" }).then(({ ok, data }) => {
      if (!ok || !Array.isArray(data.items)) return;
      const match = data.items.find((entry) => String(entry.item || "") === itemParam);
      if (!match) return;
      const nextPrice = Number(match.price || 0);
      if (!Number.isFinite(nextPrice) || nextPrice <= 0) return;
      price = nextPrice;
      checkoutPrice.value = `$${price.toFixed(2)}`;
    });
  }

  getAuthMe().then(async (me) => {
    if (!me.loggedIn) {
      if (checkoutStatus) checkoutStatus.textContent = "Tip: login to save checkout info for next time.";
      return;
    }
    const profile = await getCheckoutProfile();
    if (!profile) return;
    if (checkoutName) checkoutName.value = profile.fullName || me.name || "";
    if (checkoutEmail) checkoutEmail.value = profile.email || me.email || "";
    if (checkoutAddress1) checkoutAddress1.value = profile.address1 || "";
    if (checkoutAddress2) checkoutAddress2.value = profile.address2 || "";
    if (checkoutCity) checkoutCity.value = profile.city || "";
    if (checkoutState) checkoutState.value = profile.state || "";
    if (checkoutZip) checkoutZip.value = profile.zip || "";
    if (checkoutCountry) checkoutCountry.value = profile.country || "US";
  });

  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = checkoutForm.querySelector("button");
    if (!button) return;
    const checkoutCart = isCartCheckout ? getCart() : [];
    const quantity = isCartCheckout ? 1 : Math.max(1, Math.min(10, Number(checkoutQty?.value || 1)));
    button.textContent = "Redirecting...";
    button.disabled = true;

    const payload = {
      item,
      unitPrice: price,
      quantity,
      cartItems: isCartCheckout ? checkoutCart : [],
      itemList: isCartCheckout
        ? checkoutCart
            .map((entry) => {
              const name = String(entry?.item || "").trim();
              const qty = Math.max(1, Number(entry?.quantity || 1));
              if (!name) return "";
              return qty > 1 ? `${qty}x ${name}` : name;
            })
            .filter(Boolean)
            .join(", ")
        : "",
      returnTo,
      entryPath,
      customerName: checkoutName?.value || "",
      customerEmail: checkoutEmail?.value || "",
      address1: checkoutAddress1?.value || "",
      address2: checkoutAddress2?.value || "",
      city: checkoutCity?.value || "",
      state: checkoutState?.value || "",
      zip: checkoutZip?.value || "",
      country: checkoutCountry?.value || "US",
    };

    const me = await getAuthMe();
    const savePref = localStorage.getItem(CHECKOUT_PREF_KEY) !== "false";
    if (me.loggedIn && me.role === "user" && savePref) {
      await saveCheckoutProfile({
        fullName: payload.customerName,
        email: payload.customerEmail,
        address1: payload.address1,
        address2: payload.address2,
        city: payload.city,
        state: payload.state,
        zip: payload.zip,
        country: payload.country,
      });
    }

    const { ok, data } = await jsonFetch("/api/create-checkout-session", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!ok || !data.url) {
      button.textContent = "Continue To Payment";
      button.disabled = false;
      if (checkoutStatus) checkoutStatus.textContent = data.error || "Unable to start checkout right now.";
      return;
    }
    if (isCartCheckout) {
      sessionStorage.setItem("stonehorn_clear_cart_after_payment", "1");
    }
    window.location.href = data.url;
  });
}

if (window.location.pathname.endsWith("/success.html") && checkoutStatus) {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");
  const urlEntryToken = params.get("entry_token") || "";
  const urlEntryPath = params.get("entry_path") || "Buying a hat";
  if (successBragBtn) successBragBtn.classList.add("hidden");

  if (successBragBtn && urlEntryToken) {
    successBragBtn.href = `./bragging-board.html?from_checkout=1&entry_token=${encodeURIComponent(
      urlEntryToken
    )}&entry_path=${encodeURIComponent(urlEntryPath)}`;
  }

  if (!sessionId) {
    checkoutStatus.textContent = "Payment completed. Confirmation email is on the way.";
    if (successBragBtn && urlEntryToken) successBragBtn.classList.remove("hidden");
  } else {
    jsonFetch(`/api/checkout/session-status?session_id=${encodeURIComponent(sessionId)}`, {
      method: "GET",
    }).then(({ ok, data }) => {
      if (!ok) {
        checkoutStatus.textContent = "Payment received. We are finalizing your order.";
        if (successBragBtn && urlEntryToken) successBragBtn.classList.remove("hidden");
        return;
      }
      checkoutStatus.textContent = data.paid
        ? `Payment confirmed${data.customerEmail ? ` for ${data.customerEmail}` : ""}.`
        : "Payment is processing. Refresh in a moment.";

      if (data.paid && sessionStorage.getItem("stonehorn_clear_cart_after_payment") === "1") {
        saveCart([]);
        updateCartCount();
        sessionStorage.removeItem("stonehorn_clear_cart_after_payment");
      }

      if (data.paid && data.braggingEntryEligible && data.braggingEntryToken && successBragBtn) {
        const path = data.braggingEntryPath || "Buying a hat";
        successBragBtn.href = `./bragging-board.html?from_checkout=1&entry_token=${encodeURIComponent(
          data.braggingEntryToken
        )}&entry_path=${encodeURIComponent(path)}`;
        successBragBtn.classList.remove("hidden");
      } else if (data.paid && !data.braggingEntryUsed && urlEntryToken && successBragBtn) {
        successBragBtn.classList.remove("hidden");
      } else if (data.paid && data.braggingEntryUsed) {
        checkoutStatus.textContent += " Bragging Board entry already submitted for this purchase.";
      }
    });
  }
}

loadPublicPricing();
renderCart();
loadPublicInventory();
initBoardAdminMode().then(() => loadRecentBoard());
initAdminPages();
initFulfillmentPage();
loadSiteAnnouncement();
