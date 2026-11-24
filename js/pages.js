/* =========================================================
   APEX MARKET — storefront pages
   ========================================================= */
(function () {
  "use strict";

  const A = window.Apex;
  const state = A.state;
  const esc = A.esc;
  const money = A.money;
  const $ = A.$;

  A.trackId = "";
  A.confirmOrderId = "";

  /* ---------------- home ---------------- */
  A.homePage = function () {
    const products = state.products.filter((p) => p.moderation === "approved");
    const featured = products.slice(0, 8);
    const newArrivals = [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
    const sellerCount = state.sellers.filter((s) => s.status === "approved").length;
    const orderCount = 1240 + state.orders.length;

    return `
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Multi-vendor marketplace · Burundi</span>
          <h1>Everything you need, from <em>sellers you trust</em>.</h1>
          <p>APEX MARKET brings independent shops together in one place. Compare offers, pay securely and follow every order from checkout to your door.</p>
          <form class="hero-search" data-form="search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4.2-4.2"/></svg>
            <input type="search" name="q" placeholder="What are you looking for today?" aria-label="Search products">
            <button class="btn btn-primary" type="submit">Search</button>
          </form>
          <div class="hero-chips">
            <span>Popular:</span>
            <a class="chip" href="#/shop?q=coffee">Coffee</a>
            <a class="chip" href="#/shop?q=headphones">Headphones</a>
            <a class="chip" href="#/shop?cat=fashion">Sneakers</a>
            <a class="chip" href="#/shop?cat=home">Home décor</a>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><strong>${sellerCount}</strong><span>Verified sellers</span></div>
            <div class="hero-stat"><strong>${products.length}</strong><span>Products live</span></div>
            <div class="hero-stat"><strong>${orderCount.toLocaleString("en-US")}</strong><span>Orders handled</span></div>
          </div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="hero-card hero-card-main">
            <div class="hero-art-img">🎧</div>
            <h3>Wireless Noise-Cancelling Headphones</h3>
            <p>Nova Electronics · Bujumbura</p>
            <div class="hero-price"><strong>${money(189000)}</strong><span>Best seller</span></div>
          </div>
          <div class="hero-card hero-card-small">
            <div class="mini-row">
              <div class="mini-emoji">☕</div>
              <div><strong>Highlands Coffee</strong><span>Roasted to order · 1 kg</span></div>
            </div>
            <div class="mini-bar"><i></i></div>
            <p style="font-size:10.5px;color:#626b7b;margin-top:6px">82% of this week's stock already claimed</p>
          </div>
          <div class="hero-card hero-rating">
            <div>
              <span class="stars">★★★★★</span>
              <strong>4.9 / 5</strong>
              <span>from 1,800+ buyers</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-sm">
      <div class="container">
        <div class="section-head">
          <div><span class="eyebrow">Browse</span><h2>Shop by category</h2></div>
          <a class="section-link" href="#/shop?all=1">View all products →</a>
        </div>
        <div class="category-grid">
          ${state.categories.map((c) => {
            const count = state.products.filter((p) => p.category === c.id && p.moderation === "approved").length;
            return `<a class="category-card" href="#/shop?cat=${c.id}">
              <div class="category-icon">${c.emoji}</div>
              <h3>${esc(c.name)}</h3>
              <p>${count} product${count === 1 ? "" : "s"}</p>
            </a>`;
          }).join("")}
        </div>
      </div>
    </section>

    <section class="section-sm">
      <div class="container">
        <div class="section-head">
          <div><span class="eyebrow">Hand-picked</span><h2>Featured this week</h2><p>Popular products from verified sellers across Burundi.</p></div>
          <a class="section-link" href="#/shop">Shop everything →</a>
        </div>
        <div class="product-grid">${featured.map(A.productCard).join("")}</div>
      </div>
    </section>

    <section class="trust-strip">
      <div class="container trust-grid">
        <div class="trust-item"><div class="trust-icon">🚚</div><div><h3>Fast local delivery</h3><p>1–3 working days in Bujumbura. Free over 50,000 BIF.</p></div></div>
        <div class="trust-item"><div class="trust-icon">🛡️</div><div><h3>Verified sellers</h3><p>Every shop is reviewed before it can list products.</p></div></div>
        <div class="trust-item"><div class="trust-icon">↩️</div><div><h3>7-day returns</h3><p>Unused items can be returned within one week.</p></div></div>
        <div class="trust-item"><div class="trust-icon">💬</div><div><h3>Buyer protection</h3><p>Open a dispute and our team will step in to help.</p></div></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div><span class="eyebrow">Just landed</span><h2>New in the marketplace</h2></div>
          <a class="section-link" href="#/shop?sort=new">See what's new →</a>
        </div>
        <div class="product-grid">${newArrivals.map(A.productCard).join("")}</div>
      </div>
    </section>

    <section class="section-sm">
      <div class="container">
        <div class="seller-band">
          <div class="seller-band-inner">
            <div>
              <span class="eyebrow">Sell on APEX</span>
              <h2>Your shop. Your customers. One marketplace.</h2>
              <p>Open a digital storefront, list your products and manage orders from a single dashboard. You keep control of your catalogue while APEX MARKET brings the buyers, handles discovery and supports the transaction.</p>
              <div class="seller-band-actions">
                <a class="btn btn-primary" href="#/seller">Open a shop</a>
                <a class="btn btn-light" href="#/admin">View platform admin</a>
              </div>
            </div>
            <div class="seller-metrics">
              <div class="seller-metric"><strong>8–12%</strong><span>Commission per sale</span></div>
              <div class="seller-metric"><strong>1,240+</strong><span>Monthly shoppers</span></div>
              <div class="seller-metric"><strong>48 h</strong><span>Typical payout time</span></div>
              <div class="seller-metric"><strong>0 BIF</strong><span>To open a shop (demo)</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  };

  /* ---------------- shop ---------------- */
  A.shopPage = function () {
    const f = A.shopFilters;
    let list = state.products.filter((p) => p.moderation === "approved");

    if (f.category !== "all") list = list.filter((p) => p.category === f.category);
    if (f.q) {
      const q = f.q.toLowerCase();
      list = list.filter((p) => {
        const seller = A.seller(p.sellerId);
        return [p.name, p.description, p.category, seller ? seller.name : ""].join(" ").toLowerCase().includes(q);
      });
    }
    if (f.price === "under") list = list.filter((p) => p.price < 50000);
    if (f.price === "mid") list = list.filter((p) => p.price >= 50000 && p.price < 150000);
    if (f.price === "high") list = list.filter((p) => p.price >= 150000);
    if (f.rating) list = list.filter((p) => p.rating >= f.rating);

    if (f.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (f.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (f.sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (f.sort === "new") list = [...list].sort((a, b) => b.createdAt - a.createdAt);

    const activeCat = f.category !== "all" ? A.category(f.category) : null;

    return `
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumb"><a href="#/">Home</a><span>/</span><a href="#/shop">Shop</a>${activeCat ? `<span>/</span><span>${esc(activeCat.name)}</span>` : ""}</div>
        <h1 class="page-title">${activeCat ? esc(activeCat.name) : "All products"}</h1>
        <p class="page-sub">${activeCat ? esc(activeCat.blurb) + " — compare offers from independent sellers." : "Browse every product in the marketplace. Use the filters to narrow by category, price and rating."}</p>
      </div>
    </section>
    <div class="container">
      <div class="shop-layout">
        <aside class="filters" id="shopFilters">
          <div class="filter-group">
            <h3>Category</h3>
            <div class="filter-list">
              <label class="filter-option"><input type="radio" name="cat" value="all" data-filter="category" ${f.category === "all" ? "checked" : ""}> All products <span class="count">${state.products.filter((p) => p.moderation === "approved").length}</span></label>
              ${state.categories.map((c) => {
                const n = state.products.filter((p) => p.category === c.id && p.moderation === "approved").length;
                return `<label class="filter-option"><input type="radio" name="cat" value="${c.id}" data-filter="category" ${f.category === c.id ? "checked" : ""}> ${c.emoji} ${esc(c.name)} <span class="count">${n}</span></label>`;
              }).join("")}
            </div>
          </div>
          <div class="filter-group">
            <h3>Price (BIF)</h3>
            <div class="filter-list">
              <label class="filter-option"><input type="radio" name="price" value="all" data-filter="price" ${f.price === "all" ? "checked" : ""}> Any price</label>
              <label class="filter-option"><input type="radio" name="price" value="under" data-filter="price" ${f.price === "under" ? "checked" : ""}> Under 50,000</label>
              <label class="filter-option"><input type="radio" name="price" value="mid" data-filter="price" ${f.price === "mid" ? "checked" : ""}> 50,000 – 150,000</label>
              <label class="filter-option"><input type="radio" name="price" value="high" data-filter="price" ${f.price === "high" ? "checked" : ""}> 150,000 and above</label>
            </div>
          </div>
          <div class="filter-group">
            <h3>Rating</h3>
            <div class="filter-list">
              <label class="filter-option"><input type="radio" name="rating" value="0" data-filter="rating" ${!f.rating ? "checked" : ""}> Any rating</label>
              <label class="filter-option"><input type="radio" name="rating" value="4.5" data-filter="rating" ${f.rating === 4.5 ? "checked" : ""}> ★ 4.5 &amp; up</label>
              <label class="filter-option"><input type="radio" name="rating" value="4.8" data-filter="rating" ${f.rating === 4.8 ? "checked" : ""}> ★ 4.8 &amp; up</label>
            </div>
            <button class="btn btn-ghost btn-sm filter-clear" data-action="clear-filters">Clear all filters</button>
          </div>
        </aside>

        <div>
          <div class="shop-toolbar">
            <p class="result-count"><strong>${list.length}</strong> product${list.length === 1 ? "" : "s"} found</p>
            <div class="shop-controls">
              <button class="btn btn-ghost btn-sm mobile-filter-btn" data-action="toggle-filters">Filters</button>
              <select class="select" data-filter="sort" aria-label="Sort products">
                <option value="featured" ${f.sort === "featured" ? "selected" : ""}>Sort: Featured</option>
                <option value="new" ${f.sort === "new" ? "selected" : ""}>Newest first</option>
                <option value="price-asc" ${f.sort === "price-asc" ? "selected" : ""}>Price: low to high</option>
                <option value="price-desc" ${f.sort === "price-desc" ? "selected" : ""}>Price: high to low</option>
                <option value="rating" ${f.sort === "rating" ? "selected" : ""}>Top rated</option>
              </select>
            </div>
          </div>
          ${f.q ? `<div class="demo-note">Showing results for “${esc(f.q)}”. <button class="link-btn" data-action="clear-search">Clear search</button></div>` : ""}
          ${list.length
            ? `<div class="product-grid">${list.map(A.productCard).join("")}</div>`
            : `<div class="empty-state"><div class="empty-emoji">🔍</div><h3>No products match those filters</h3><p>Try a different category or clear the filters to see the full catalogue.</p><button class="btn btn-dark" data-action="clear-filters">Clear filters</button></div>`}
        </div>
      </div>
    </div>`;
  };

  /* ---------------- product detail ---------------- */
  A.productPage = function (id) {
    const p = A.product(id);
    if (!p) return A.notFound("We couldn't find that product.");
    const seller = A.seller(p.sellerId);
    const cat = A.category(p.category);
    const qty = A.detailQty;
    const reviews = state.reviews.filter((r) => r.productId === p.id);
    const related = state.products.filter((x) => x.id !== p.id && x.category === p.category && x.moderation === "approved").slice(0, 4);
    const features = p.features || [];

    return `
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumb"><a href="#/">Home</a><span>/</span><a href="#/shop">Shop</a><span>/</span><a href="#/shop?cat=${p.category}">${esc(cat ? cat.name : p.category)}</a><span>/</span><span>${esc(p.name)}</span></div>
        <div class="product-detail">
          <div>
            <div class="detail-media" style="${A.grad(p)}">
              ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
              <span class="product-emoji">${p.emoji}</span>
            </div>
            <div class="detail-thumbs">
              ${[0, 1, 2].map((i) => `<div class="detail-thumb${i === 0 ? " active" : ""}" style="${A.grad(p)}">${p.emoji}</div>`).join("")}
            </div>
          </div>
          <div class="detail-info">
            <a class="product-seller" href="#/seller">${esc(seller ? seller.name : "APEX seller")} ${seller && seller.verified ? '<span class="verified">✓ Verified seller</span>' : ""}</a>
            <h1 class="detail-title">${esc(p.name)}</h1>
            <div class="detail-rating">
              <span class="stars" style="color:#e07a00;letter-spacing:2px">${A.stars(p.rating)}</span>
              <strong>${Number(p.rating).toFixed(1)}</strong>
              <span>· ${p.reviews} reviews</span>
              <span>· ${p.stock} in stock</span>
            </div>
            <div class="detail-price">
              <span class="price">${money(p.price)}</span>
              ${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span><span class="status delivered">Save ${money(p.oldPrice - p.price)}</span>` : ""}
            </div>
            <p class="detail-desc">${esc(p.description)}</p>
            <ul class="feature-list">${features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
            <div class="qty-row">
              <div class="qty-control">
                <button data-action="detail-qty" data-step="-1" aria-label="Decrease quantity">−</button>
                <span>${qty}</span>
                <button data-action="detail-qty" data-step="1" aria-label="Increase quantity">+</button>
              </div>
              <span class="small text-muted">${p.stock} available · ships in 1–3 days</span>
            </div>
            <div class="detail-actions">
              <button class="btn btn-dark" data-action="detail-add-cart" data-id="${p.id}">Add to cart · ${money(p.price * qty)}</button>
              <button class="btn btn-primary" data-action="buy-now" data-id="${p.id}">Buy now</button>
              <button class="btn btn-ghost" data-action="wish" data-id="${p.id}">${A.inWishlist(p.id) ? "♥ Saved" : "♡ Save"}</button>
            </div>
            <div class="detail-meta">
              <div class="meta-row">🚚 <span>Free delivery in Bujumbura on orders over <strong>50,000 BIF</strong></span></div>
              <div class="meta-row">↩️ <span><strong>7-day returns</strong> on unused items in original packaging</span></div>
              <div class="meta-row">🛡️ <span>Payment protected · <strong>demo checkout, no real charge</strong></span></div>
            </div>
            ${seller ? `<div class="seller-card card">
              <div class="seller-avatar" style="background:${seller.color}">${seller.initials}</div>
              <div><h4>${esc(seller.name)} ${seller.verified ? '<span class="verified">✓</span>' : ""}</h4><p>${esc(seller.location)} · ${seller.sales.toLocaleString("en-US")} sales · ★ ${seller.rating}</p></div>
              <a class="btn btn-ghost btn-sm" href="#/shop">Visit shop</a>
            </div>` : ""}
          </div>
        </div>
      </div>
    </section>

    <section class="container detail-tabs">
      <div class="tab-nav">
        <button class="tab-btn ${A.detailTab === "description" ? "active" : ""}" data-action="detail-tab" data-tab="description">Description</button>
        <button class="tab-btn ${A.detailTab === "reviews" ? "active" : ""}" data-action="detail-tab" data-tab="reviews">Reviews (${reviews.length})</button>
        <button class="tab-btn ${A.detailTab === "delivery" ? "active" : ""}" data-action="detail-tab" data-tab="delivery">Delivery &amp; returns</button>
      </div>
      <div class="tab-panel ${A.detailTab === "description" ? "active" : ""}">
        <p>${esc(p.description)}</p>
        <ul class="feature-list">${features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      </div>
      <div class="tab-panel ${A.detailTab === "reviews" ? "active" : ""}">
        ${reviews.length ? reviews.map((r) => `<div class="review">
          <div class="review-avatar">${esc(r.name.charAt(0))}</div>
          <div><div class="review-head"><strong>${esc(r.name)}</strong><span class="stars" style="color:#e07a00">${A.stars(r.rating)}</span><span>${A.date(r.date)}</span></div><p>${esc(r.text)}</p></div>
        </div>`).join("") : `<div class="empty-state" style="padding:40px 20px"><div class="empty-emoji">💬</div><h3>No reviews yet</h3><p>Be the first to review this product after your order arrives.</p></div>`}
      </div>
      <div class="tab-panel ${A.detailTab === "delivery" ? "active" : ""}">
        <p><strong>Delivery.</strong> Orders in Bujumbura arrive in 1–3 working days; other provinces take 2–5 working days. Delivery is free over 50,000 BIF, otherwise a flat 3,000 BIF fee applies.</p>
        <p style="margin-top:10px"><strong>Returns.</strong> Unused items in original packaging can be returned within 7 days of delivery. Perishable goods and personal-care items that have been opened cannot be returned.</p>
      </div>
    </section>

    ${related.length ? `<section class="container related-section">
      <div class="section-head"><div><span class="eyebrow">You may also like</span><h2>More in ${esc(cat ? cat.name : "this category")}</h2></div></div>
      <div class="product-grid">${related.map(A.productCard).join("")}</div>
    </section>` : ""}`;
  };

  /* ---------------- cart ---------------- */
  A.cartPage = function () {
    const totals = A.totals();
    if (!totals.items.length) {
      return `<div class="container" style="padding:20px 0 70px">
        <div class="empty-state"><div class="empty-emoji">🛒</div><h3>Your cart is empty</h3><p>Browse the marketplace and add a few things you like. Your cart is saved in this browser.</p><a class="btn btn-dark" href="#/shop">Start shopping</a></div>
      </div>`;
    }
    return `
    <section class="page-hero"><div class="container">
      <div class="breadcrumb"><a href="#/">Home</a><span>/</span><span>Cart</span></div>
      <h1 class="page-title">Shopping cart</h1>
      <p class="page-sub">${A.cartCount()} item(s) from ${new Set(totals.items.map((i) => i.product.sellerId)).size} seller(s).</p>
    </div></section>
    <div class="container cart-layout">
      <div class="cart-list">
        ${totals.items.map(({ product: p, qty, lineTotal }) => `
          <article class="card cart-item">
            <div class="cart-thumb" style="${A.grad(p)}">${p.emoji}</div>
            <div>
              <a class="cart-seller" href="#/seller">${esc((A.seller(p.sellerId) || {}).name || "APEX seller")}</a>
              <h3><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
              <div class="cart-price">${money(p.price)} each</div>
            </div>
            <div class="cart-item-side">
              <div class="qty-control">
                <button data-action="cart-qty" data-id="${p.id}" data-step="-1" aria-label="Decrease">−</button>
                <span>${qty}</span>
                <button data-action="cart-qty" data-id="${p.id}" data-step="1" aria-label="Increase">+</button>
              </div>
              <strong>${money(lineTotal)}</strong>
              <button class="cart-remove" data-action="cart-remove" data-id="${p.id}">Remove</button>
            </div>
          </article>`).join("")}
        <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:6px">
          <a class="btn btn-ghost" href="#/shop">← Continue shopping</a>
          <button class="link-btn" data-action="clear-cart">Clear cart</button>
        </div>
      </div>
      <aside class="card summary">
        <h2>Order summary</h2>
        <div class="summary-row"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
        <div class="summary-row"><span>Delivery</span><strong>${totals.delivery ? money(totals.delivery) : "Free"}</strong></div>
        ${totals.discount ? `<div class="summary-row" style="color:#15803d"><span>Promo APEX10</span><strong>−${money(totals.discount)}</strong></div>` : ""}
        <div class="summary-row total"><span>Total</span><strong>${money(totals.total)}</strong></div>
        ${totals.subtotal < 50000 ? `<div class="free-ship-note" style="margin-top:12px">Add ${money(50000 - totals.subtotal)} more for free delivery.</div>` : `<div class="free-ship-note" style="margin-top:12px">🎉 You've unlocked free delivery.</div>`}
        <form class="promo-row" data-form="coupon">
          <input type="text" name="code" placeholder="Promo code (try APEX10)" value="${esc(state.coupon || "")}" aria-label="Promo code">
          <button class="btn btn-ghost btn-sm" type="submit">Apply</button>
        </form>
        <a class="btn btn-primary btn-block" href="#/checkout">Proceed to checkout</a>
        <div class="secure-row"><span>🔒 Sandbox checkout</span><span>↩️ 7-day returns</span></div>
        <p class="summary-note">This is an academic demo. No payment is taken and no data leaves your browser.</p>
      </aside>
    </div>`;
  };

  /* ---------------- checkout ---------------- */
  A.checkoutPage = function () {
    const totals = A.totals();
    if (!totals.items.length) {
      return `<div class="container" style="padding:20px 0 70px"><div class="empty-state"><div class="empty-emoji">🧾</div><h3>Nothing to check out</h3><p>Your cart is empty. Add a product first, then come back to complete the order.</p><a class="btn btn-dark" href="#/shop">Browse products</a></div></div>`;
    }
    const u = state.user;
    return `
    <section class="page-hero"><div class="container">
      <div class="breadcrumb"><a href="#/">Home</a><span>/</span><a href="#/cart">Cart</a><span>/</span><span>Checkout</span></div>
      <h1 class="page-title">Checkout</h1>
      <p class="page-sub">Demo checkout — use any details you like. Nothing is charged.</p>
    </div></section>
    <form class="container checkout-layout" id="checkoutForm" data-form="checkout" novalidate>
      <div>
        <div class="card checkout-card">
          <h2><span class="step-num">1</span> Contact &amp; delivery</h2>
          <div class="form-grid">
            <div class="field"><label for="ck-name">Full name</label><input id="ck-name" name="name" value="${esc(u ? u.name : "")}" placeholder="e.g. Dushime Don Divin" required><span class="field-error">Please enter your full name.</span></div>
            <div class="field"><label for="ck-phone">Phone</label><input id="ck-phone" name="phone" placeholder="+257 ..." required><span class="field-error">Please enter a phone number.</span></div>
            <div class="field full"><label for="ck-email">Email</label><input id="ck-email" name="email" type="email" value="${esc(u ? u.email : "")}" placeholder="you@example.com" required><span class="field-error">Please enter a valid email.</span></div>
            <div class="field"><label for="ck-city">City / province</label>
              <select id="ck-city" name="city">
                <option>Bujumbura</option><option>Gitega</option><option>Ngozi</option><option>Rumonge</option><option>Kayanza</option><option>Muyinga</option>
              </select>
            </div>
            <div class="field"><label for="ck-address">Delivery address</label><input id="ck-address" name="address" placeholder="Neighbourhood, street, landmark" required><span class="field-error">Please enter a delivery address.</span></div>
            <div class="field full"><label for="ck-notes">Notes for the courier (optional)</label><textarea id="ck-notes" name="notes" placeholder="e.g. Call on arrival, deliver after 4 pm"></textarea></div>
          </div>
        </div>
        <div class="card checkout-card">
          <h2><span class="step-num">2</span> Payment method</h2>
          <div class="option-grid">
            <label class="option-card"><input type="radio" name="payment" value="Mobile Money" checked><span class="option-main"><strong>Mobile Money</strong><span>Lumicash / Ecocash sandbox confirmation</span></span><span class="option-price">Instant</span></label>
            <label class="option-card"><input type="radio" name="payment" value="Card (sandbox)"><span class="option-main"><strong>Card (sandbox)</strong><span>Demo card — no card details are collected</span></span><span class="option-price">Instant</span></label>
            <label class="option-card"><input type="radio" name="payment" value="Cash on delivery"><span class="option-main"><strong>Cash on delivery</strong><span>Pay the courier when your order arrives</span></span><span class="option-price">On arrival</span></label>
          </div>
          <div class="demo-note" style="margin:16px 0 0">🔒 This is a demonstration. No payment details are requested, stored or transmitted.</div>
        </div>
      </div>
      <aside class="card summary">
        <h2>Your order</h2>
        <div class="checkout-items">
          ${totals.items.map(({ product: p, qty, lineTotal }) => `<div class="checkout-item">
            <div class="ci-thumb" style="${A.grad(p)}">${p.emoji}</div>
            <div class="ci-name"><strong>${esc(p.name)}</strong><span>${qty} × ${money(p.price)}</span></div>
            <div class="ci-price">${money(lineTotal)}</div>
          </div>`).join("")}
        </div>
        <div class="summary-row"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
        <div class="summary-row"><span>Delivery</span><strong>${totals.delivery ? money(totals.delivery) : "Free"}</strong></div>
        ${totals.discount ? `<div class="summary-row" style="color:#15803d"><span>Promo APEX10</span><strong>−${money(totals.discount)}</strong></div>` : ""}
        <div class="summary-row total"><span>Total</span><strong>${money(totals.total)}</strong></div>
        <button class="btn btn-primary btn-block" type="submit">Place order · ${money(totals.total)}</button>
        <a class="btn btn-ghost btn-block" href="#/cart" style="margin-top:8px">Back to cart</a>
        <p class="summary-note">By placing this order you agree to the demo <button type="button" class="link-btn" data-action="open-policy" data-policy="terms">terms of use</button>.</p>
      </aside>
    </form>`;
  };

  /* ---------------- confirmation ---------------- */
  A.confirmPage = function (id) {
    const order = A.order(id || state.lastOrder);
    if (!order) return A.notFound("We couldn't find that order.");
    return `<div class="container confirm-wrap">
      <div class="card confirm-hero">
        <div class="confirm-check">✓</div>
        <h1>Order confirmed</h1>
        <p>Thank you, ${esc(order.customer.split(" ")[0])}. Your order is now with the seller.</p>
        <div class="order-ref">Order reference <span>${esc(order.id)}</span></div>
        ${A.orderTimeline(order.status)}
        <p class="small text-muted" style="margin-top:14px">We'll deliver to ${esc(order.address)}, ${esc(order.city)}. Payment: ${esc(order.payment)}.</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:22px">
          <a class="btn btn-dark" href="#/orders">View my orders</a>
          <a class="btn btn-ghost" href="#/track" data-action="track-order" data-id="${order.id}">Track order</a>
          <a class="btn btn-ghost" href="#/shop">Keep shopping</a>
        </div>
      </div>
      <div class="mt-24">${A.orderCard(order)}</div>
    </div>`;
  };

  /* ---------------- tracking ---------------- */
  A.trackPage = function (id) {
    if (id) A.trackId = id;
    const search = String(A.trackId || "").trim().toUpperCase();
    const order = search ? A.order(search) : null;
    return `<div class="container track-wrap">
      <div class="breadcrumb"><a href="#/">Home</a><span>/</span><span>Track an order</span></div>
      <h1 class="page-title">Track your order</h1>
      <p class="page-sub">Enter the order reference we gave you at checkout, for example APX-24084.</p>
      <form class="track-form" data-form="track">
        <input type="text" name="id" value="${esc(search)}" placeholder="APX-00000" aria-label="Order reference">
        <button class="btn btn-dark" type="submit">Track</button>
      </form>
      ${search && !order ? `<div class="empty-state"><div class="empty-emoji">🔎</div><h3>No order found for “${esc(search)}”</h3><p>Check the reference and try again. Demo references include APX-24081, APX-24082, APX-24083 and APX-24084.</p></div>` : ""}
      ${order ? `<div class="card track-result">
        <div class="order-head" style="margin-bottom:0">
          <div><h3>Order ${esc(order.id)}</h3><p>Placed ${A.date(order.createdAt)} · ${esc(order.customer)}</p></div>
          <span class="status ${String(order.status).toLowerCase()}">${esc(order.status)}</span>
        </div>
        ${A.orderTimeline(order.status)}
        <div class="order-detail-grid">
          <div><div class="mini-label">Delivering to</div><p>${esc(order.address)}<br>${esc(order.city)}</p></div>
          <div><div class="mini-label">Items</div><p>${order.items.map((i) => `${esc(i.name)} × ${i.qty}`).join("<br>")}</p></div>
        </div>
        <div class="order-foot"><span>Total paid / due</span><strong>${money(order.total)}</strong></div>
      </div>` : ""}
    </div>`;
  };

  /* ---------------- my orders ---------------- */
  A.ordersPage = function () {
    const orders = [...state.orders].sort((a, b) => b.createdAt - a.createdAt);
    return `<div class="container">
      <section class="page-hero">
        <div class="breadcrumb"><a href="#/">Home</a><span>/</span><span>My orders</span></div>
        <h1 class="page-title">My orders</h1>
        <p class="page-sub">Orders placed from this browser appear here along with the demo order history.</p>
      </section>
      <div class="orders-layout">
        ${orders.length ? orders.map((o) => A.orderCard(o)).join("") : `<div class="empty-state"><div class="empty-emoji">📦</div><h3>No orders yet</h3><p>When you place an order it will appear here with its delivery status.</p><a class="btn btn-dark" href="#/shop">Start shopping</a></div>`}
      </div>
    </div>`;
  };

  A.notFound = function (message) {
    return `<div class="container" style="padding:30px 0 70px"><div class="empty-state">
      <div class="empty-emoji">🧭</div><h3>Page not found</h3>
      <p>${esc(message || "That page doesn't exist. Try the marketplace instead.")}</p>
      <a class="btn btn-dark" href="#/">Back to home</a>
    </div></div>`;
  };

  /* ---------------- auth & policy modals ---------------- */
  A.openAuthModal = function (mode) {
    A.authMode = mode || "signin";
    const signup = A.authMode === "register";
    A.openModal(`${A.modalHead(signup ? "Create your account" : "Welcome back", "Demo accounts — no real credentials needed")}
      <div class="auth-tabs">
        <button class="auth-tab ${!signup ? "active" : ""}" data-action="auth-mode" data-mode="signin">Sign in</button>
        <button class="auth-tab ${signup ? "active" : ""}" data-action="auth-mode" data-mode="register">Create account</button>
      </div>
      <form data-form="auth" class="inline-form">
        ${signup ? `<div class="field"><label for="au-name">Full name</label><input id="au-name" name="name" placeholder="Your name" required></div>` : ""}
        <div class="field"><label for="au-email">Email</label><input id="au-email" name="email" type="email" placeholder="you@example.com" required></div>
        <div class="field"><label for="au-pass">Password</label><input id="au-pass" name="password" type="password" placeholder="Any password (demo)" required></div>
        <div class="field"><label for="au-role">Sign in as</label>
          <select id="au-role" name="role">
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
            <option value="admin">Platform admin</option>
          </select>
        </div>
        <button class="btn btn-primary btn-block" type="submit">${signup ? "Create account" : "Sign in"}</button>
      </form>
      <div class="auth-divider">or try a demo role</div>
      <div class="quick-login">
        <button data-action="quick-login" data-role="customer">🛍️ Customer</button>
        <button data-action="quick-login" data-role="seller">🏪 Seller</button>
        <button data-action="quick-login" data-role="admin">🛡️ Admin</button>
      </div>
      <p class="summary-note">Demo only. Accounts are stored in this browser and never sent anywhere.</p>`);
  };

  A.openAccountModal = function () {
    const u = state.user;
    if (!u) return A.openAuthModal("signin");
    const dashHref = u.role === "admin" ? "#/admin" : u.role === "seller" ? "#/seller" : "#/orders";
    A.openModal(`${A.modalHead(`Hi, ${u.name.split(" ")[0]}`, `${u.email} · ${u.role} account`)}
      <div class="summary-row"><span>Account type</span><strong style="text-transform:capitalize">${esc(u.role)}</strong></div>
      <div class="summary-row"><span>Cart</span><strong>${A.cartCount()} item(s)</strong></div>
      <div class="summary-row"><span>Wishlist</span><strong>${state.wishlist.length} saved</strong></div>
      <div style="display:grid;gap:9px;margin-top:18px">
        <a class="btn btn-primary btn-block" href="${dashHref}" data-action="close-modal">Go to ${u.role === "customer" ? "my orders" : u.role + " dashboard"}</a>
        <a class="btn btn-ghost btn-block" href="#/orders" data-action="close-modal">My orders</a>
        <button class="btn btn-ghost btn-block" data-action="sign-out">Sign out</button>
      </div>`);
  };

  A.openPolicy = function (key) {
    const p = A.policies[key];
    if (!p) return;
    A.openModal(`${A.modalHead(p.title, "APEX MARKET policy · demo")}
      <p style="font-size:13.5px;line-height:1.75;color:#24405f">${esc(p.body)}</p>
      <button class="btn btn-dark btn-block mt-16" data-action="close-modal">Got it</button>`);
  };
})();
