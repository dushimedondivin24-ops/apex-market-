/* =========================================================
   APEX MARKET — core: state, helpers, cart, auth, UI shell
   ========================================================= */
(function () {
  "use strict";

  const seed = window.APEX_SEED;
  const STORAGE_KEY = "apexmarket.demo.v1";
  const A = (window.Apex = {});

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const clone = (v) => JSON.parse(JSON.stringify(v));
  const esc = (v) =>
    String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (v) => `${Math.round(Number(v) || 0).toLocaleString("en-US")} BIF`;

  A.$ = $;
  A.$$ = $$;
  A.esc = esc;
  A.money = money;

  /* ---------------- state ---------------- */
  function freshState() {
    return {
      version: 1,
      categories: clone(seed.categories),
      sellers: clone(seed.sellers),
      products: clone(seed.products),
      reviews: clone(seed.reviews),
      orders: clone(seed.demoOrders),
      monthly: clone(seed.monthly),
      cart: [],
      wishlist: [],
      user: null,
      sellerId: "nova",
      coupon: "",
      lastOrder: null
    };
  }

  let state;
  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!state || state.version !== 1) state = freshState();
  } catch (err) {
    state = freshState();
  }
  A.state = state;

  A.save = function () {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (err) { /* storage may be blocked */ }
  };

  A.resetDemo = function () {
    Object.keys(state).forEach((k) => delete state[k]);
    Object.assign(state, freshState());
    A.save();
  };

  A.shopFilters = { q: "", category: "all", price: "all", rating: 0, sort: "featured" };
  A.detailQty = 1;
  A.detailTab = "description";
  A.sellerTab = "overview";
  A.adminTab = "overview";
  A.authMode = "signin";

  /* ---------------- lookups ---------------- */
  A.product = (id) => state.products.find((p) => p.id === id);
  A.seller = (id) => state.sellers.find((s) => s.id === id);
  A.category = (id) => state.categories.find((c) => c.id === id);
  A.order = (id) => state.orders.find((o) => o.id === id);

  A.grad = function (p) {
    const g = (p && p.gradient) || ["#e7efe9", "#f7e7cc"];
    return `--g1:${g[0]};--g2:${g[1]}`;
  };

  A.stars = function (rating) {
    const full = Math.round(Number(rating) || 0);
    return "★★★★★☆☆☆☆☆".slice(5 - full, 10 - full);
  };

  A.date = function (ts) {
    const d = new Date(Number(ts) || Date.now());
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  A.timeAgo = function (ts) {
    const diff = Date.now() - Number(ts || Date.now());
    const mins = Math.round(diff / 60000);
    if (mins < 60) return `${Math.max(1, mins)} min ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs} h ago`;
    const days = Math.round(hrs / 24);
    return days === 1 ? "yesterday" : `${days} days ago`;
  };

  /* ---------------- cart ---------------- */
  A.cartCount = function () {
    return state.cart.reduce((sum, line) => sum + line.qty, 0);
  };

  A.cartItems = function () {
    return state.cart
      .map((line) => {
        const p = A.product(line.id);
        if (!p) return null;
        return { product: p, qty: line.qty, lineTotal: p.price * line.qty };
      })
      .filter(Boolean);
  };

  A.addToCart = function (id, qty) {
    const product = A.product(id);
    if (!product) return;
    const line = state.cart.find((l) => l.id === id);
    const amount = Math.max(1, Number(qty) || 1);
    if (line) line.qty = Math.min(line.qty + amount, 20);
    else state.cart.push({ id: id, qty: amount });
    A.save();
    A.syncHeader();
    A.toast(`${product.name} added to cart`, "success");
  };

  A.updateQty = function (id, qty) {
    const line = state.cart.find((l) => l.id === id);
    if (!line) return;
    line.qty = Math.max(0, Math.min(20, Number(qty) || 0));
    if (line.qty === 0) state.cart = state.cart.filter((l) => l.id !== id);
    A.save();
    A.syncHeader();
  };

  A.removeItem = function (id) {
    state.cart = state.cart.filter((l) => l.id !== id);
    A.save();
    A.syncHeader();
    A.toast("Item removed from cart");
  };

  A.setCoupon = function (code) {
    const clean = String(code || "").trim().toUpperCase();
    if (!clean) { state.coupon = ""; A.save(); return; }
    if (clean === "APEX10" || clean === "WELCOME10") {
      state.coupon = "APEX10";
      A.toast("Promo applied: 10% off your items", "success");
    } else {
      state.coupon = "";
      A.toast("That promo code is not valid", "error");
    }
    A.save();
  };

  A.totals = function () {
    const items = A.cartItems();
    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
    const delivery = subtotal === 0 ? 0 : subtotal >= 50000 ? 0 : 3000;
    const discount = state.coupon === "APEX10" ? Math.round(subtotal * 0.1) : 0;
    return { items: items, subtotal: subtotal, delivery: delivery, discount: discount, total: subtotal + delivery - discount };
  };

  /* ---------------- wishlist ---------------- */
  A.inWishlist = (id) => state.wishlist.includes(id);
  A.toggleWish = function (id) {
    if (A.inWishlist(id)) {
      state.wishlist = state.wishlist.filter((x) => x !== id);
      A.toast("Removed from wishlist");
    } else {
      state.wishlist.push(id);
      A.toast("Saved to wishlist", "success");
    }
    A.save();
  };

  /* ---------------- toast & modal ---------------- */
  A.toast = function (message, type) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.className = "toast show" + (type ? " " + type : "");
    clearTimeout(A._toastTimer);
    A._toastTimer = setTimeout(() => { el.className = "toast"; }, 2600);
  };

  A.openModal = function (html, wide) {
    const root = $("#modalRoot");
    if (!root) return;
    root.innerHTML = `<div class="modal-overlay"><div class="modal${wide ? " wide" : ""}" role="dialog" aria-modal="true">${html}</div></div>`;
    document.body.style.overflow = "hidden";
    const input = root.querySelector("input, select, textarea");
    if (input) setTimeout(() => input.focus(), 60);
  };

  A.closeModal = function () {
    const root = $("#modalRoot");
    if (root) root.innerHTML = "";
    document.body.style.overflow = "";
  };

  A.modalHead = function (title, sub) {
    return `<div class="modal-head"><div><h2>${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ""}</div>
      <button class="modal-close" data-action="close-modal" aria-label="Close">×</button></div>`;
  };

  /* ---------------- auth (demo only) ---------------- */
  A.signIn = function (opts) {
    const name = String(opts.name || "").trim() || (opts.role === "admin" ? "Admin User" : opts.role === "seller" ? "Seller Account" : "Demo Customer");
    state.user = {
      name: name,
      email: String(opts.email || "").trim() || "demo@apexmarket.local",
      role: opts.role || "customer",
      sellerId: opts.role === "seller" ? state.sellerId : null
    };
    A.save();
    A.syncHeader();
  };

  A.signOut = function () {
    state.user = null;
    A.save();
    A.syncHeader();
    A.closeModal();
    A.toast("Signed out");
  };

  A.syncHeader = function () {
    const count = $("#cartCount");
    if (count) count.textContent = String(A.cartCount());
    const label = $("#accountLabel");
    if (label) label.textContent = state.user ? state.user.name.split(" ")[0] : "Sign in";
    A.save();
  };

  /* ---------------- orders ---------------- */
  A.STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered"];
  A.statusIndex = (status) => Math.max(0, A.STATUSES.indexOf(status));

  A.createOrder = function (details) {
    const totals = A.totals();
    if (!totals.items.length) return null;
    const now = Date.now();
    const order = {
      id: "APX-" + String(Math.floor(20000 + Math.random() * 79999)),
      customer: details.name,
      email: details.email,
      phone: details.phone,
      city: details.city || "Bujumbura",
      address: details.address,
      notes: details.notes || "",
      items: totals.items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        qty: i.qty,
        sellerId: i.product.sellerId,
        emoji: i.product.emoji
      })),
      subtotal: totals.subtotal,
      delivery: totals.delivery,
      discount: totals.discount,
      total: totals.total,
      payment: details.payment || "Cash on delivery",
      paymentStatus: details.payment === "Cash on delivery" ? "Pending" : "Paid (sandbox)",
      status: "Pending",
      createdAt: now
    };
    state.orders.unshift(order);
    state.cart = [];
    state.coupon = "";
    state.lastOrder = order.id;
    A.save();
    A.syncHeader();
    return order;
  };

  A.advanceOrder = function (id) {
    const order = A.order(id);
    if (!order) return;
    const idx = A.statusIndex(order.status);
    if (idx < A.STATUSES.length - 1) {
      order.status = A.STATUSES[idx + 1];
      A.save();
      A.toast(`Order ${id} marked ${order.status.toLowerCase()}`, "success");
    }
  };

  A.cancelOrder = function (id) {
    const order = A.order(id);
    if (!order) return;
    order.status = "Cancelled";
    A.save();
    A.toast(`Order ${id} cancelled`);
  };

  /* ---------------- content ---------------- */
  A.policies = {
    delivery: {
      title: "Delivery policy",
      body: "Orders in Bujumbura are delivered within 1–3 working days. Orders to other provinces take 2–5 working days. Delivery is free on orders over 50,000 BIF; otherwise a flat fee of 3,000 BIF applies. Sellers prepare their own parcels and APEX MARKET coordinates the handover."
    },
    returns: {
      title: "Returns & refunds",
      body: "You may request a return within 7 days of delivery if the item is unused, in its original packaging and not a perishable good. Refunds are issued to the original payment method, or as cash for cash-on-delivery orders. Open a dispute from your order page and the platform team will review it."
    },
    privacy: {
      title: "Privacy",
      body: "This is an academic demonstration. All products, sellers, customers and orders are fictional sample data stored only in your own browser. No information is transmitted to a server and no real payment is processed."
    },
    terms: {
      title: "Terms of use",
      body: "APEX MARKET is a multi-vendor marketplace: sellers are responsible for the products they list, while the platform sets the rules and supports transactions. This demo is provided for coursework and evaluation only and must not be used for real commerce."
    },
    commission: {
      title: "Fees & commission",
      body: "APEX MARKET earns revenue from seller commissions, optional shop subscriptions, promoted listings and value-added services. A typical commission is 8–12% of the item value. Gross merchandise value is not platform revenue: only agreed fees and commissions count as income."
    }
  };

  A.POLICY_ICONS = { delivery: "🚚", returns: "↩️", privacy: "🔒", terms: "📄", commission: "💳" };

  A.orderTimeline = function (status) {
    if (status === "Cancelled") {
      return `<div class="demo-note" style="margin-top:16px">This order was cancelled. Contact support if you need help placing a new order.</div>`;
    }
    const idx = A.statusIndex(status);
    return `<div class="timeline">${A.STATUSES.map((s, i) => `
      <div class="timeline-step${i <= idx ? " done" : ""}">
        <div class="timeline-dot">${i <= idx ? "✓" : i + 1}</div>
        <div>${s}</div>
      </div>`).join("")}</div>`;
  };

  /* ---------------- shared partials ---------------- */
  A.productCard = function (p) {
    const seller = A.seller(p.sellerId);
    const badge = p.stock <= 8 ? `<span class="badge low">Low stock</span>` : p.badge ? `<span class="badge${/sale/i.test(p.badge) ? " sale" : p.badge === "New" ? " new" : ""}">${esc(p.badge)}</span>` : "";
    const wished = A.inWishlist(p.id);
    return `<article class="product-card">
      <div class="product-media" style="${A.grad(p)}">
        ${badge}
        <button class="wish-btn${wished ? " active" : ""}" data-action="wish" data-id="${p.id}" aria-label="Save to wishlist">${wished ? "♥" : "♡"}</button>
        <a href="#/product/${p.id}" class="product-emoji" aria-hidden="true">${p.emoji}</a>
      </div>
      <div class="product-body">
        <a class="product-seller" href="#/seller">${esc(seller ? seller.name : "APEX seller")} ${seller && seller.verified ? '<span class="verified">✓</span>' : ""}</a>
        <h3 class="product-title"><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
        <div class="product-rating"><span class="stars">${A.stars(p.rating)}</span> ${Number(p.rating).toFixed(1)} <span>(${p.reviews})</span></div>
        <div class="price-row"><span class="price">${money(p.price)}</span>${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ""}</div>
        <div class="stock-note${p.stock <= 8 ? " low" : ""}">${p.stock <= 8 ? `Only ${p.stock} left` : "In stock"}</div>
        <div class="product-actions">
          <button class="btn btn-dark btn-sm" data-action="add-cart" data-id="${p.id}">Add to cart</button>
          <a class="btn btn-ghost btn-sm" href="#/product/${p.id}">View</a>
        </div>
      </div>
    </article>`;
  };

  A.orderCard = function (o, compact) {
    const itemLines = o.items.map((i) => `<div class="order-line"><span class="ol-emoji">${i.emoji || "📦"}</span><span class="ol-name">${esc(i.name)}<span>${money(i.price)} × ${i.qty}</span></span><span>${money(i.price * i.qty)}</span></div>`).join("");
    return `<article class="card order-card">
      <div class="order-head">
        <div>
          <h3>Order ${esc(o.id)}</h3>
          <p>Placed ${A.date(o.createdAt)} · ${esc(o.customer)}</p>
        </div>
        <span class="status ${String(o.status).toLowerCase()}">${esc(o.status)}</span>
      </div>
      <div class="order-items">${itemLines}</div>
      ${compact ? "" : `<div class="order-detail-grid">
        <div><div class="mini-label">Delivery address</div><p>${esc(o.address)}<br>${esc(o.city)}</p></div>
        <div><div class="mini-label">Payment</div><p>${esc(o.payment)} · ${esc(o.paymentStatus)}</p></div>
      </div>`}
      <div class="order-foot">
        <span>${o.items.reduce((n, i) => n + i.qty, 0)} item(s) · ${esc(o.payment)}</span>
        <strong>${money(o.total)}</strong>
      </div>
      ${compact ? "" : A.orderTimeline(o.status)}
      <div class="order-foot" style="border-top:0;padding-top:0">
        <button class="link-btn" data-action="track-order" data-id="${o.id}">Track this order</button>
        ${o.status !== "Delivered" && o.status !== "Cancelled" ? `<button class="link-btn" data-action="cancel-order" data-id="${o.id}">Cancel order</button>` : ""}
      </div>
    </article>`;
  };
})();
