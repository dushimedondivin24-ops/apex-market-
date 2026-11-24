/* =========================================================
   APEX MARKET — seller & admin dashboards
   ========================================================= */
(function () {
  "use strict";

  const A = window.Apex;
  const state = A.state;
  const esc = A.esc;
  const money = A.money;

  const REVENUE_STATUS = (o) => o.status !== "Cancelled";

  A.sellerRevenue = function (sellerId) {
    return state.orders.filter(REVENUE_STATUS).reduce((sum, o) => {
      return sum + o.items.filter((i) => i.sellerId === sellerId).reduce((n, i) => n + i.price * i.qty, 0);
    }, 0);
  };

  A.sellerOrders = function (sellerId) {
    return state.orders
      .filter((o) => o.items.some((i) => i.sellerId === sellerId))
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  A.sellerUnits = function (sellerId) {
    return state.orders.filter(REVENUE_STATUS).reduce((sum, o) => {
      return sum + o.items.filter((i) => i.sellerId === sellerId).reduce((n, i) => n + i.qty, 0);
    }, 0);
  };

  function gate(role, title, copy) {
    const u = state.user;
    return `<div class="container"><div class="card gate">
      <div class="gate-icon">${role === "admin" ? "🛡️" : "🏪"}</div>
      <h1>${esc(title)}</h1>
      <p>${esc(copy)}</p>
      ${u ? `<div class="demo-note">You're signed in as <strong>${esc(u.name)}</strong> (${esc(u.role)}). This area needs the ${role} role — use the demo login to switch instantly.</div>` : ""}
      <div class="gate-actions">
        <button class="btn btn-primary" data-action="quick-login" data-role="${role}">Continue as demo ${role}</button>
        <button class="btn btn-ghost" data-action="open-auth">Sign in</button>
        <a class="btn btn-ghost" href="#/shop">Back to shop</a>
      </div>
    </div></div>`;
  }

  function tabs(active, items, group) {
    return `<div class="dash-tabs">${items.map(([key, label]) =>
      `<button class="dash-tab ${active === key ? "active" : ""}" data-action="${group}-tab" data-tab="${key}">${label}</button>`).join("")}</div>`;
  }

  /* ================= SELLER ================= */
  A.sellerPage = function () {
    const u = state.user;
    if (!u || (u.role !== "seller" && u.role !== "admin")) {
      return gate("seller", "Your seller dashboard", "Sign in as a seller to manage your shop, products and orders.");
    }
    const seller = A.seller(state.sellerId) || state.sellers[0];
    const products = state.products.filter((p) => p.sellerId === seller.id);
    const orders = A.sellerOrders(seller.id);
    const revenue = A.sellerRevenue(seller.id);
    const pending = orders.filter((o) => o.status === "Pending" || o.status === "Confirmed").length;
    const tab = A.sellerTab;

    const hero = `<div class="dash-hero">
      <div>
        <span class="eyebrow" style="color:#f59e0b">Seller workspace</span>
        <h1>${esc(seller.name)}</h1>
        <p>${esc(seller.location)} · ${seller.verified ? "Verified seller" : "Verification pending"} · ★ ${seller.rating} · joined ${esc(seller.joined)}</p>
      </div>
      <div style="display:flex;gap:9px;flex-wrap:wrap;align-items:center;position:relative;z-index:1">
        <select class="select" data-action="switch-seller" aria-label="Preview another shop">
          ${state.sellers.filter((s) => s.status === "approved").map((s) => `<option value="${s.id}" ${s.id === seller.id ? "selected" : ""}>${esc(s.name)}</option>`).join("")}
        </select>
        <a class="btn btn-light btn-sm" href="#/shop">View storefront</a>
      </div>
    </div>`;

    const stats = `<div class="stat-grid">
      <div class="card stat-card"><div class="stat-label">Revenue</div><div class="stat-value">${money(revenue)}</div><div class="stat-trend">From ${orders.length} orders</div></div>
      <div class="card stat-card"><div class="stat-label">Live products</div><div class="stat-value">${products.length}</div><div class="stat-trend neutral">${products.filter((p) => p.stock <= 8).length} low on stock</div></div>
      <div class="card stat-card"><div class="stat-label">Orders to fulfil</div><div class="stat-value">${pending}</div><div class="stat-trend ${pending ? "" : "neutral"}">${pending ? "Action needed" : "All caught up"}</div></div>
      <div class="card stat-card"><div class="stat-label">Units sold</div><div class="stat-value">${A.sellerUnits(seller.id)}</div><div class="stat-trend neutral">Across all orders</div></div>
    </div>`;

    let body = "";

    if (tab === "overview") {
      const topProducts = [...products]
        .map((p) => ({ p, sold: orders.reduce((n, o) => n + o.items.filter((i) => i.productId === p.id).reduce((m, i) => m + i.qty, 0), 0) }))
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5);
      const maxSold = Math.max(1, ...topProducts.map((t) => t.sold));

      body = `<div class="dash-grid">
        <div class="card panel">
          <div class="panel-head"><h2>Recent orders</h2><button class="link-btn" data-action="seller-tab" data-tab="orders">View all</button></div>
          ${orders.length ? `<div class="table-wrap"><table>
            <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Status</th><th>Your items</th></tr></thead>
            <tbody>${orders.slice(0, 5).map((o) => {
              const mine = o.items.filter((i) => i.sellerId === seller.id);
              const value = mine.reduce((n, i) => n + i.price * i.qty, 0);
              return `<tr>
                <td class="cell-title">${esc(o.id)}</td>
                <td>${esc(o.customer)}</td>
                <td>${A.date(o.createdAt)}</td>
                <td><span class="status ${String(o.status).toLowerCase()}">${esc(o.status)}</span></td>
                <td class="cell-title">${money(value)}</td>
              </tr>`;
            }).join("")}</tbody>
          </table></div>` : `<p class="small text-muted">No orders yet. Share your storefront to get your first sale.</p>`}
        </div>
        <div class="card panel">
          <h2>Best sellers</h2>
          <div class="bars">
            ${topProducts.map(({ p, sold }) => `<div class="bar-row">
              <div class="bar-label"><span>${esc(p.emoji)} ${esc(p.name.length > 26 ? p.name.slice(0, 26) + "…" : p.name)}</span><strong>${sold}</strong></div>
              <div class="bar-track"><div class="bar-fill" style="width:${Math.round((sold / maxSold) * 100)}%"></div></div>
            </div>`).join("") || `<p class="small text-muted">Add products to see sales performance.</p>`}
          </div>
          <button class="btn btn-primary btn-block mt-16" data-action="add-product">+ Add a product</button>
        </div>
      </div>`;
    }

    if (tab === "products") {
      body = `<div class="card panel" style="margin-bottom:18px">
        <div class="panel-head"><h2>Add a product</h2><span class="small text-muted">Listed instantly in the demo</span></div>
        <form class="inline-form" data-form="add-product">
          <div class="form-grid">
            <div class="field"><label for="ap-name">Product name</label><input id="ap-name" name="name" placeholder="e.g. Handmade table lamp" required></div>
            <div class="field"><label for="ap-category">Category</label><select id="ap-category" name="category">${state.categories.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></div>
            <div class="field"><label for="ap-price">Price (BIF)</label><input id="ap-price" name="price" type="number" min="1000" step="500" placeholder="45000" required></div>
            <div class="field"><label for="ap-stock">Stock</label><input id="ap-stock" name="stock" type="number" min="0" max="999" placeholder="12" required></div>
            <div class="field"><label for="ap-emoji">Emoji / icon</label><input id="ap-emoji" name="emoji" maxlength="4" placeholder="🛋️"></div>
            <div class="field"><label for="ap-badge">Badge (optional)</label><input id="ap-badge" name="badge" placeholder="New"></div>
            <div class="field full"><label for="ap-desc">Description</label><textarea id="ap-desc" name="description" placeholder="Describe the product, materials and who it is for." required></textarea></div>
          </div>
          <div class="form-actions"><button class="btn btn-primary" type="submit">Publish product</button></div>
        </form>
      </div>
      <div class="card panel">
        <div class="panel-head"><h2>Your catalogue (${products.length})</h2></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>${products.map((p) => `<tr>
            <td><div class="flex-cell"><span class="table-thumb">${p.emoji}</span><div><div class="cell-title">${esc(p.name)}</div><div class="cell-sub">${esc((A.category(p.category) || {}).name || p.category)}</div></div></div></td>
            <td>${money(p.price)}</td>
            <td>${p.stock}</td>
            <td>★ ${Number(p.rating).toFixed(1)}</td>
            <td><span class="status ${p.moderation === "approved" ? "delivered" : "pending"}">${esc(p.moderation)}</span></td>
            <td><div class="actions-cell">
              <button class="mini-btn" data-action="restock" data-id="${p.id}">+10 stock</button>
              <button class="mini-btn danger" data-action="delete-product" data-id="${p.id}">Delete</button>
            </div></td>
          </tr>`).join("") || `<tr><td colspan="6" class="small text-muted">No products yet — add your first one above.</td></tr>`}</tbody>
        </table></div>
      </div>`;
    }

    if (tab === "orders") {
      body = `<div class="card panel">
        <div class="panel-head"><h2>Orders containing your items (${orders.length})</h2></div>
        ${orders.length ? `<div class="table-wrap"><table>
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Your value</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>${orders.map((o) => {
            const mine = o.items.filter((i) => i.sellerId === seller.id);
            return `<tr>
              <td><div class="cell-title">${esc(o.id)}</div><div class="cell-sub">${A.date(o.createdAt)}</div></td>
              <td>${esc(o.customer)}<div class="cell-sub">${esc(o.city)}</div></td>
              <td>${mine.map((i) => `${esc(i.emoji || "📦")} ${esc(i.name)} × ${i.qty}`).join("<br>")}</td>
              <td class="cell-title">${money(mine.reduce((n, i) => n + i.price * i.qty, 0))}</td>
              <td><span class="status ${String(o.status).toLowerCase()}">${esc(o.status)}</span></td>
              <td><div class="actions-cell">
                ${o.status !== "Delivered" && o.status !== "Cancelled" ? `<button class="mini-btn success" data-action="advance-order" data-id="${o.id}">Mark ${A.STATUSES[A.statusIndex(o.status) + 1] || "done"}</button>` : "—"}
              </div></td>
            </tr>`;
          }).join("")}</tbody>
        </table></div>` : `<p class="small text-muted">No orders yet.</p>`}
      </div>`;
    }

    if (tab === "shop") {
      body = `<div class="dash-grid">
        <div class="card panel">
          <h2>Shop profile</h2>
          <form class="inline-form" data-form="shop-profile">
            <div class="field"><label for="sp-name">Shop name</label><input id="sp-name" name="name" value="${esc(seller.name)}" required></div>
            <div class="field"><label for="sp-location">Location</label><input id="sp-location" name="location" value="${esc(seller.location)}" required></div>
            <div class="field"><label for="sp-color">Brand colour</label><input id="sp-color" name="color" type="color" value="${esc(seller.color)}" style="height:44px;padding:4px"></div>
            <div class="form-actions"><button class="btn btn-primary" type="submit">Save profile</button></div>
          </form>
        </div>
        <div class="card panel">
          <h2>Verification</h2>
          <div class="summary-row"><span>Status</span><strong>${seller.verified ? "✓ Verified" : "Pending review"}</strong></div>
          <div class="summary-row"><span>Shop rating</span><strong>★ ${seller.rating}</strong></div>
          <div class="summary-row"><span>Total sales</span><strong>${seller.sales.toLocaleString("en-US")}</strong></div>
          <div class="summary-row"><span>Commission</span><strong>10% per sale</strong></div>
          <p class="summary-note" style="text-align:left">Verified sellers get a trust badge, priority placement and access to promoted listings. Verification is managed by the platform admin.</p>
          <a class="btn btn-ghost btn-block" href="#/admin">Open admin dashboard</a>
        </div>
      </div>`;
    }

    return `<div class="container" style="padding:26px 0 70px">
      ${hero}${stats}${tabs(tab, [["overview", "Overview"], ["products", "Products"], ["orders", "Orders"], ["shop", "Shop profile"]], "seller")}${body}
    </div>`;
  };

  /* ================= ADMIN ================= */
  A.adminPage = function () {
    const u = state.user;
    if (!u || u.role !== "admin") {
      return gate("admin", "Platform administration", "The admin dashboard is restricted to the platform team. Use the demo admin login to explore moderation, sellers and platform revenue.");
    }
    const tab = A.adminTab;
    const gmv = state.orders.filter(REVENUE_STATUS).reduce((n, o) => n + o.total, 0);
    const commission = Math.round(gmv * 0.1);
    const pendingSellers = state.sellers.filter((s) => s.status !== "approved").length;
    const pendingProducts = state.products.filter((p) => p.moderation !== "approved").length;
    const openOrders = state.orders.filter((o) => o.status === "Pending" || o.status === "Confirmed").length;
    const maxMonth = Math.max(...state.monthly.map((m) => m.value));

    const hero = `<div class="dash-hero">
      <div>
        <span class="eyebrow" style="color:#f59e0b">Platform control</span>
        <h1>APEX MARKET admin</h1>
        <p>Moderate sellers and products, monitor orders and track marketplace revenue.</p>
      </div>
      <div style="position:relative;z-index:1;display:flex;gap:9px;flex-wrap:wrap">
        <a class="btn btn-light btn-sm" href="#/seller">Seller view</a>
        <button class="btn btn-ghost btn-sm" style="color:#fff;border-color:rgba(255,255,255,.3)" data-action="sign-out">Sign out</button>
      </div>
    </div>`;

    const stats = `<div class="stat-grid">
      <div class="card stat-card"><div class="stat-label">Gross merchandise value</div><div class="stat-value">${money(gmv)}</div><div class="stat-trend neutral">Total order value</div></div>
      <div class="card stat-card"><div class="stat-label">Est. commission (10%)</div><div class="stat-value">${money(commission)}</div><div class="stat-trend">Platform revenue</div></div>
      <div class="card stat-card"><div class="stat-label">Open orders</div><div class="stat-value">${openOrders}</div><div class="stat-trend neutral">${state.orders.length} total</div></div>
      <div class="card stat-card"><div class="stat-label">Needs review</div><div class="stat-value">${pendingSellers + pendingProducts}</div><div class="stat-trend ${pendingSellers + pendingProducts ? "" : "neutral"}">${pendingSellers} sellers · ${pendingProducts} products</div></div>
    </div>`;

    let body = "";

    if (tab === "overview") {
      const recent = [...state.orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
      body = `<div class="dash-grid">
        <div class="card panel">
          <div class="panel-head"><h2>Order volume (M BIF)</h2><span class="small text-muted">Last 6 months</span></div>
          <div class="bars">
            ${state.monthly.map((m) => `<div class="bar-row">
              <div class="bar-label"><span>${esc(m.label)} 2026</span><strong>${m.value.toFixed(1)} M</strong></div>
              <div class="bar-track"><div class="bar-fill" style="width:${Math.round((m.value / maxMonth) * 100)}%"></div></div>
            </div>`).join("")}
          </div>
          <div class="order-detail-grid" style="border-top:1px solid var(--line);margin-top:20px">
            <div><div class="mini-label">Sellers approved</div><p>${state.sellers.filter((s) => s.status === "approved").length} of ${state.sellers.length}</p></div>
            <div><div class="mini-label">Live products</div><p>${state.products.filter((p) => p.moderation === "approved").length} of ${state.products.length}</p></div>
          </div>
        </div>
        <div class="card panel">
          <h2>Latest activity</h2>
          <div class="activity">
            ${recent.map((o) => `<div class="activity-item"><span class="activity-dot"></span><div><strong>${esc(o.customer)}</strong> placed ${esc(o.id)}<span>${A.timeAgo(o.createdAt)} · ${money(o.total)} · ${esc(o.status)}</span></div></div>`).join("")}
          </div>
        </div>
      </div>`;
    }

    if (tab === "sellers") {
      body = `<div class="card panel">
        <div class="panel-head"><h2>Sellers (${state.sellers.length})</h2><span class="small text-muted">Approve, suspend or inspect shops</span></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Shop</th><th>Location</th><th>Rating</th><th>Sales</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>${state.sellers.map((s) => `<tr>
            <td><div class="flex-cell"><span class="seller-avatar" style="width:34px;height:34px;border-radius:9px;background:${s.color};font-size:11px">${s.initials}</span><div><div class="cell-title">${esc(s.name)} ${s.verified ? '<span class="verified">✓</span>' : ""}</div><div class="cell-sub">Joined ${esc(s.joined)}</div></div></div></td>
            <td>${esc(s.location)}</td>
            <td>★ ${s.rating}</td>
            <td>${s.sales.toLocaleString("en-US")}</td>
            <td><span class="status ${s.status === "approved" ? "delivered" : s.status === "pending" ? "pending" : "cancelled"}">${esc(s.status)}</span></td>
            <td><div class="actions-cell">
              ${s.status !== "approved" ? `<button class="mini-btn success" data-action="approve-seller" data-id="${s.id}">Approve</button>` : `<button class="mini-btn danger" data-action="suspend-seller" data-id="${s.id}">Suspend</button>`}
              <a class="mini-btn" href="#/shop">View shop</a>
            </div></td>
          </tr>`).join("")}</tbody>
        </table></div>
      </div>`;
    }

    if (tab === "products") {
      body = `<div class="card panel">
        <div class="panel-head"><h2>Product moderation (${state.products.length})</h2><span class="small text-muted">${pendingProducts} awaiting review</span></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Product</th><th>Seller</th><th>Category</th><th>Price</th><th>Moderation</th><th>Actions</th></tr></thead>
          <tbody>${state.products.map((p) => `<tr>
            <td><div class="flex-cell"><span class="table-thumb">${p.emoji}</span><div class="cell-title">${esc(p.name)}</div></div></td>
            <td>${esc((A.seller(p.sellerId) || {}).name || "—")}</td>
            <td>${esc((A.category(p.category) || {}).name || p.category)}</td>
            <td>${money(p.price)}</td>
            <td><span class="status ${p.moderation === "approved" ? "delivered" : p.moderation === "rejected" ? "cancelled" : "pending"}">${esc(p.moderation)}</span></td>
            <td><div class="actions-cell">
              ${p.moderation !== "approved" ? `<button class="mini-btn success" data-action="approve-product" data-id="${p.id}">Approve</button>` : `<button class="mini-btn danger" data-action="reject-product" data-id="${p.id}">Unlist</button>`}
              <a class="mini-btn" href="#/product/${p.id}">View</a>
            </div></td>
          </tr>`).join("")}</tbody>
        </table></div>
      </div>`;
    }

    if (tab === "orders") {
      body = `<div class="card panel">
        <div class="panel-head"><h2>All orders (${state.orders.length})</h2><span class="small text-muted">Advance fulfilment status</span></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Order</th><th>Customer</th><th>City</th><th>Total</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>${[...state.orders].sort((a, b) => b.createdAt - a.createdAt).map((o) => `<tr>
            <td><div class="cell-title">${esc(o.id)}</div><div class="cell-sub">${A.date(o.createdAt)}</div></td>
            <td>${esc(o.customer)}</td>
            <td>${esc(o.city)}</td>
            <td class="cell-title">${money(o.total)}</td>
            <td>${esc(o.payment)}<div class="cell-sub">${esc(o.paymentStatus)}</div></td>
            <td><span class="status ${String(o.status).toLowerCase()}">${esc(o.status)}</span></td>
            <td><div class="actions-cell">
              ${o.status !== "Delivered" && o.status !== "Cancelled" ? `<button class="mini-btn success" data-action="advance-order" data-id="${o.id}">${A.STATUSES[A.statusIndex(o.status) + 1] || "Complete"}</button>` : "—"}
              <button class="mini-btn" data-action="track-order" data-id="${o.id}">Track</button>
            </div></td>
          </tr>`).join("")}</tbody>
        </table></div>
      </div>`;
    }

    return `<div class="container" style="padding:26px 0 70px">
      ${hero}${stats}${tabs(tab, [["overview", "Overview"], ["sellers", "Sellers"], ["products", "Products"], ["orders", "Orders"]], "admin")}${body}
    </div>`;
  };
})();
