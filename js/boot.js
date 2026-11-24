/* =========================================================
   APEX MARKET — router, events and application boot
   ========================================================= */
(function () {
  "use strict";

  const A = window.Apex;
  const state = A.state;
  const esc = A.esc;
  const $ = A.$;
  const app = $("#app");

  const CAT_EMOJI = { electronics: "💻", fashion: "👜", home: "🏠", beauty: "✨", groceries: "🥭", sports: "🏃" };
  const CAT_GRAD = {
    electronics: ["#dbeafe", "#e0f2fe"],
    fashion: ["#fef3c7", "#fde68a"],
    home: ["#e2e8f0", "#f1f5f9"],
    beauty: ["#fce7f3", "#fbcfe8"],
    groceries: ["#dcfce7", "#bbf7d0"],
    sports: ["#d1fae5", "#a7f3d0"]
  };

  /* ---------------- routing ---------------- */
  function parseRoute() {
    const raw = (location.hash || "#/").replace(/^#/, "") || "/";
    const [path, query] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    return { parts: parts, params: new URLSearchParams(query || "") };
  }

  function applyShopParams(params) {
    if ([...params.keys()].length === 0) return;
    const f = A.shopFilters;
    f.q = params.get("q") || "";
    f.category = params.get("cat") || "all";
    f.sort = params.get("sort") || "featured";
    if (params.get("all") === "1") { f.category = "all"; f.q = ""; f.price = "all"; f.rating = 0; }
    f.price = "all";
    f.rating = 0;
  }

  function view() {
    const { parts, params } = parseRoute();
    const page = parts[0] || "";

    if (page === "") return { title: "APEX MARKET — Your Marketplace. Your Choice.", html: A.homePage() };
    if (page === "shop") { applyShopParams(params); return { title: "Shop — APEX MARKET", html: A.shopPage() }; }
    if (page === "product") return { title: "Product — APEX MARKET", html: A.productPage(parts[1]) };
    if (page === "cart") return { title: "Cart — APEX MARKET", html: A.cartPage() };
    if (page === "checkout") return { title: "Checkout — APEX MARKET", html: A.checkoutPage() };
    if (page === "confirm") return { title: "Order confirmed — APEX MARKET", html: A.confirmPage(parts[1]) };
    if (page === "track") return { title: "Track order — APEX MARKET", html: A.trackPage(parts[1]) };
    if (page === "orders") return { title: "My orders — APEX MARKET", html: A.ordersPage() };
    if (page === "seller") return { title: "Seller dashboard — APEX MARKET", html: A.sellerPage() };
    if (page === "admin") return { title: "Admin dashboard — APEX MARKET", html: A.adminPage() };
    return { title: "Not found — APEX MARKET", html: A.notFound() };
  }

  function render(scroll) {
    const result = view();
    if (app) app.innerHTML = result.html;
    document.title = result.title;
    A.syncHeader();

    const page = parseRoute().parts[0] || "";
    A.$$(".main-nav a").forEach((a) => {
      const key = a.dataset.nav;
      const active = (key === "shop" && (page === "shop" || page === "product")) || (key === page) || (key === "categories" && page === "shop");
      a.classList.toggle("active", active);
    });

    if (scroll) window.scrollTo({ top: 0, behavior: "auto" });
  }

  A.render = render;
  A.navigate = function (hash) {
    if (location.hash === hash) render(false);
    else location.hash = hash;
  };

  /* ---------------- click handling ---------------- */
  document.addEventListener("click", function (e) {
    if (e.target.classList && e.target.classList.contains("modal-overlay")) {
      A.closeModal();
      return;
    }

    const el = e.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    const id = el.dataset.id;

    switch (action) {
      case "close-modal":
        A.closeModal();
        break;

      case "go-cart":
        A.navigate("#/cart");
        break;

      case "toggle-menu": {
        const nav = $("#mobileNav");
        const open = nav.classList.toggle("open");
        el.setAttribute("aria-expanded", open ? "true" : "false");
        break;
      }

      case "add-cart":
        A.addToCart(id, 1);
        render(false);
        break;

      case "detail-add-cart":
        A.addToCart(id, A.detailQty);
        A.detailQty = 1;
        render(false);
        break;

      case "buy-now":
        A.addToCart(id, A.detailQty);
        A.detailQty = 1;
        A.navigate("#/checkout");
        break;

      case "detail-qty": {
        A.detailQty = Math.max(1, Math.min(20, A.detailQty + Number(el.dataset.step || 0)));
        render(false);
        break;
      }

      case "detail-tab":
        A.detailTab = el.dataset.tab;
        render(false);
        break;

      case "wish":
        A.toggleWish(id);
        render(false);
        break;

      case "cart-qty":
        A.updateQty(id, (state.cart.find((l) => l.id === id) || { qty: 0 }).qty + Number(el.dataset.step || 0));
        render(false);
        break;

      case "cart-remove":
        A.removeItem(id);
        render(false);
        break;

      case "clear-cart":
        if (confirm("Remove all items from your cart?")) {
          state.cart = [];
          state.coupon = "";
          A.save();
          A.syncHeader();
          render(false);
          A.toast("Cart cleared");
        }
        break;

      case "clear-search":
        A.shopFilters.q = "";
        try { history.replaceState(null, "", "#/shop"); } catch (err) { /* ignore */ }
        render(false);
        break;

      case "clear-filters":
        A.shopFilters = { q: "", category: "all", price: "all", rating: 0, sort: "featured" };
        try { history.replaceState(null, "", "#/shop"); } catch (err) { /* ignore */ }
        render(false);
        break;

      case "toggle-filters":
        $("#shopFilters").classList.toggle("open");
        break;

      case "open-account":
        A.openAccountModal();
        break;

      case "open-auth":
        A.openAuthModal("signin");
        break;

      case "auth-mode":
        A.openAuthModal(el.dataset.mode);
        break;

      case "quick-login": {
        const role = el.dataset.role || "customer";
        A.signIn({ role: role, name: role === "admin" ? "Platform Admin" : role === "seller" ? "Demo Seller" : "Demo Customer" });
        A.closeModal();
        A.toast(`Signed in as ${role} (demo)`, "success");
        A.navigate(role === "admin" ? "#/admin" : role === "seller" ? "#/seller" : "#/orders");
        break;
      }

      case "sign-out":
        A.signOut();
        render(false);
        break;

      case "open-policy":
        A.openPolicy(el.dataset.policy);
        break;

      case "track-order":
        A.trackId = id || "";
        A.navigate("#/track");
        if (location.hash === "#/track") render(false);
        break;

      case "advance-order":
        A.advanceOrder(id);
        render(false);
        break;

      case "cancel-order":
        if (confirm("Cancel this order? This cannot be undone in the demo.")) {
          A.cancelOrder(id);
          render(false);
        }
        break;

      case "seller-tab":
        A.sellerTab = el.dataset.tab;
        render(false);
        break;

      case "admin-tab":
        A.adminTab = el.dataset.tab;
        render(false);
        break;

      case "add-product":
        A.sellerTab = "products";
        render(false);
        setTimeout(() => {
          const input = $("#ap-name");
          if (input) { input.focus(); input.scrollIntoView({ behavior: "smooth", block: "center" }); }
        }, 60);
        break;

      case "restock": {
        const p = A.product(id);
        if (p) { p.stock += 10; A.save(); A.toast(`${p.name}: stock increased by 10`, "success"); render(false); }
        break;
      }

      case "delete-product": {
        const p = A.product(id);
        if (!p) break;
        if (confirm(`Delete “${p.name}” from the catalogue?`)) {
          state.products = state.products.filter((x) => x.id !== id);
          state.cart = state.cart.filter((l) => l.id !== id);
          A.save();
          A.syncHeader();
          A.toast("Product deleted");
          render(false);
        }
        break;
      }

      case "approve-product": {
        const p = A.product(id);
        if (p) { p.moderation = "approved"; A.save(); A.toast("Product approved", "success"); render(false); }
        break;
      }

      case "reject-product": {
        const p = A.product(id);
        if (p) { p.moderation = "rejected"; A.save(); A.toast("Product unlisted"); render(false); }
        break;
      }

      case "approve-seller": {
        const s = A.seller(id);
        if (s) { s.status = "approved"; s.verified = true; A.save(); A.toast(`${s.name} approved`, "success"); render(false); }
        break;
      }

      case "suspend-seller": {
        const s = A.seller(id);
        if (s) { s.status = "suspended"; A.save(); A.toast(`${s.name} suspended`); render(false); }
        break;
      }

      case "reset-demo":
        if (confirm("Reset all demo data (cart, orders, accounts and catalogue changes)?")) {
          A.resetDemo();
          A.shopFilters = { q: "", category: "all", price: "all", rating: 0, sort: "featured" };
          A.navigate("#/");
          setTimeout(() => render(true), 10);
          A.toast("Demo data reset", "success");
        }
        break;

      default:
        break;
    }
  });

  /* ---------------- change handling ---------------- */
  document.addEventListener("change", function (e) {
    const filter = e.target.closest("[data-filter]");
    if (filter && filter.dataset.filter) {
      const key = filter.dataset.filter;
      if (key === "category") A.shopFilters.category = filter.value;
      else if (key === "price") A.shopFilters.price = filter.value;
      else if (key === "rating") A.shopFilters.rating = Number(filter.value);
      else if (key === "sort") A.shopFilters.sort = filter.value;
      render(false);
      return;
    }

    if (e.target.dataset.action === "switch-seller") {
      state.sellerId = e.target.value;
      A.save();
      render(false);
    }
  });

  /* ---------------- forms ---------------- */
  document.addEventListener("submit", function (e) {
    const form = e.target;
    const type = form.dataset.form || (form.id === "headerSearch" || form.id === "mobileSearch" ? "search" : "");

    if (type === "search") {
      e.preventDefault();
      const input = form.querySelector('input[name="q"]');
      const q = (input ? input.value : "").trim();
      A.shopFilters = { q: q, category: "all", price: "all", rating: 0, sort: "featured" };
      const target = "#/shop" + (q ? "?q=" + encodeURIComponent(q) : "");
      if (location.hash === target) render(true);
      else location.hash = target;
      const nav = $("#mobileNav");
      if (nav) nav.classList.remove("open");
      return;
    }

    if (type === "coupon") {
      e.preventDefault();
      A.setCoupon(form.elements.code.value);
      render(false);
      return;
    }

    if (type === "track") {
      e.preventDefault();
      const value = String(form.elements.id.value || "").trim().toUpperCase();
      A.trackId = value;
      A.navigate("#/track");
      render(false);
      return;
    }

    if (type === "auth") {
      e.preventDefault();
      const role = form.elements.role ? form.elements.role.value : "customer";
      const name = form.elements.name ? form.elements.name.value : "";
      const email = form.elements.email.value;
      A.signIn({ name: name, email: email, role: role });
      A.closeModal();
      A.toast(`Welcome${name ? ", " + name.split(" ")[0] : ""}! Signed in as ${role}.`, "success");
      A.navigate(role === "admin" ? "#/admin" : role === "seller" ? "#/seller" : "#/orders");
      return;
    }

    if (type === "checkout") {
      e.preventDefault();
      const data = new FormData(form);
      let ok = true;
      ["name", "phone", "email", "address"].forEach((field) => {
        const input = form.elements[field];
        let valid = String(data.get(field) || "").trim().length > 0;
        if (field === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get(field) || "").trim());
        if (input && input.closest(".field")) input.closest(".field").classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) {
        A.toast("Please complete the highlighted fields", "error");
        const first = form.querySelector(".field.invalid input, .field.invalid select");
        if (first) first.focus();
        return;
      }
      const order = A.createOrder({
        name: String(data.get("name")).trim(),
        email: String(data.get("email")).trim(),
        phone: String(data.get("phone")).trim(),
        city: data.get("city"),
        address: String(data.get("address")).trim(),
        notes: String(data.get("notes") || "").trim(),
        payment: data.get("payment")
      });
      if (order) {
        A.toast(`Order ${order.id} placed`, "success");
        A.navigate("#/confirm/" + order.id);
      }
      return;
    }

    if (type === "add-product") {
      e.preventDefault();
      const f = form.elements;
      const name = String(f.name.value || "").trim();
      const price = Number(f.price.value || 0);
      const stock = Number(f.stock.value || 0);
      const cat = f.category.value;
      const desc = String(f.description.value || "").trim();
      if (!name || !desc || !(price > 0)) {
        A.toast("Please complete the product name, price and description", "error");
        return;
      }
      const seller = A.seller(state.sellerId) || state.sellers[0];
      const id = "p" + Date.now();
      state.products.unshift({
        id: id,
        name: name,
        category: cat,
        sellerId: seller.id,
        price: price,
        rating: 5,
        reviews: 0,
        stock: stock,
        emoji: String(f.emoji.value || "").trim() || CAT_EMOJI[cat] || "📦",
        gradient: CAT_GRAD[cat] || ["#e7efe9", "#f7e7cc"],
        badge: String(f.badge.value || "").trim() || "New",
        moderation: "approved",
        description: desc,
        features: [],
        createdAt: Date.now()
      });
      A.save();
      A.toast(`“${name}” published to your shop`, "success");
      render(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (type === "shop-profile") {
      e.preventDefault();
      const seller = A.seller(state.sellerId);
      if (!seller) return;
      const f = form.elements;
      seller.name = String(f.name.value || "").trim() || seller.name;
      seller.location = String(f.location.value || "").trim() || seller.location;
      seller.color = String(f.color.value || seller.color);
      A.save();
      A.toast("Shop profile updated", "success");
      render(false);
      return;
    }
  });

  /* ---------------- boot ---------------- */
  window.addEventListener("hashchange", function () { render(true); });

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  if (!location.hash || location.hash === "#") {
    try { history.replaceState(null, "", "#/"); } catch (err) { location.hash = "#/"; }
  }

  A.syncHeader();
  render(true);
})();
