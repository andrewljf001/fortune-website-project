let API_BASE = localStorage.getItem("API_BASE") || "http://localhost:8080";
const tokenKey = "fortune_demo_token";
const token = () => localStorage.getItem(tokenKey);

const meInfo = document.getElementById("meInfo");
const ordersInfo = document.getElementById("ordersInfo");
const statusText = document.getElementById("statusText");
const apiBaseText = document.getElementById("apiBaseText");
const apiBaseInput = document.getElementById("apiBaseInput");

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.style.color = isError ? "#9c1a1a" : "#11407f";
}

function syncApiBaseUI() {
  apiBaseText.textContent = API_BASE;
  apiBaseInput.value = API_BASE;
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token()) headers.Authorization = `Bearer ${token()}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

function showError(err) {
  setStatus(err.message || String(err), true);
}

async function loadMe() {
  if (!token()) {
    meInfo.textContent = "未登录";
    return;
  }
  try {
    const data = await request("/api/me");
    const user = data.user;
    meInfo.innerHTML = user
      ? `<div class="user-card"><strong>${user.display_name}</strong><div>${user.email}</div><div class="meta">创建于：${new Date(user.created_at).toLocaleString()}</div></div>`
      : "未登录";
  } catch (err) {
    meInfo.textContent = "登录状态无效，请重新登录";
    localStorage.removeItem(tokenKey);
    showError(err);
  }
}

async function loadOrders() {
  if (!token()) {
    ordersInfo.textContent = "请先登录";
    return;
  }
  try {
    const data = await request("/api/orders");
    if (!data.orders.length) {
      ordersInfo.textContent = "你还没有订单";
      return;
    }
    ordersInfo.innerHTML = data.orders
      .map(
        (order) => `
        <article class="order-card">
          <strong>#${order.id} ${order.fortune_type}</strong>
          <div class="meta">状态：${order.status} ｜ 金额：¥${order.amount_cny} ｜ 时间：${new Date(order.created_at).toLocaleString()}</div>
          <div class="question">${order.question}</div>
        </article>
      `
      )
      .join("");
  } catch (err) {
    showError(err);
  }
}

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const payload = {
      displayName: document.getElementById("regName").value.trim(),
      email: document.getElementById("regEmail").value.trim(),
      password: document.getElementById("regPassword").value
    };
    const data = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    localStorage.setItem(tokenKey, data.token);
    await loadMe();
    await loadOrders();
    setStatus("注册成功，已自动登录。");
  } catch (err) {
    showError(err);
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const payload = {
      email: document.getElementById("loginEmail").value.trim(),
      password: document.getElementById("loginPassword").value
    };
    const data = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    localStorage.setItem(tokenKey, data.token);
    await loadMe();
    await loadOrders();
    setStatus("登录成功。");
  } catch (err) {
    showError(err);
  }
});

document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const payload = {
      fortuneType: document.getElementById("fortuneType").value,
      amountCny: Number(document.getElementById("amountCny").value),
      question: document.getElementById("question").value.trim()
    };
    await request("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    document.getElementById("question").value = "";
    await loadOrders();
    setStatus("订单已创建。");
  } catch (err) {
    showError(err);
  }
});

document.getElementById("refreshOrders").addEventListener("click", loadOrders);
document.getElementById("saveApiBase").addEventListener("click", () => {
  const value = apiBaseInput.value.trim().replace(/\/+$/, "");
  if (!value) {
    setStatus("API 地址不能为空", true);
    return;
  }
  localStorage.setItem("API_BASE", value);
  API_BASE = value;
  syncApiBaseUI();
  setStatus("API 地址已更新。");
});

syncApiBaseUI();
loadMe();
loadOrders();
