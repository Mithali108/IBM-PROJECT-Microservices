const API_BASE_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  refreshAdminData();
  setInterval(refreshAdminData, 3000);
});

async function fetchJson(url) {
  const response = await fetch(`${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`, {
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

async function refreshAdminData() {
  try {
    const [stats, orders] = await Promise.all([
      fetchJson(`${API_BASE_URL}/admin/stats`),
      fetchJson(`${API_BASE_URL}/orders`)
    ]);
    renderStats(stats);
    renderOrders(Array.isArray(orders) ? orders : []);
  } catch (error) {
    console.error("Admin refresh failed:", error);
  }
}

function renderStats(stats) {
  const totalBooks = document.getElementById("totalBooks");
  const totalOrders = document.getElementById("totalOrders");
  const totalRevenue = document.getElementById("totalRevenue");

  if (totalBooks) totalBooks.textContent = String(stats.totalBooks || 0);
  if (totalOrders) totalOrders.textContent = String(stats.totalOrders || 0);
  if (totalRevenue) totalRevenue.textContent = `₹${Number(stats.totalRevenue || 0).toFixed(2)}`;
}

function renderOrders(orders) {
  const table = document.getElementById("ordersTable");
  if (!table) return;

  const tbody = table.querySelector("tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (orders.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" style="text-align:center;">No orders yet</td>`;
    tbody.appendChild(tr);
    return;
  }

  orders.forEach((order) => {
    const tr = document.createElement("tr");
    const orderId = order.id ?? "-";
    const customerName = order.customerName || "Guest";
    const firstTitle = Array.isArray(order.items) && order.items.length > 0
      ? (order.items[0].title || "Book")
      : "Book";
    const orderDate = order.date ? new Date(order.date).toLocaleString("en-IN") : "-";
    const status = "Completed";

    tr.innerHTML = `
      <td>#${orderId}</td>
      <td>${firstTitle}</td>
      <td>${customerName}</td>
      <td>${orderDate}</td>
      <td>${status}</td>
    `;
    tbody.appendChild(tr);
  });
}