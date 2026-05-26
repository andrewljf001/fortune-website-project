const API_BASE = localStorage.getItem("API_BASE") || "http://localhost:8080";
const tokenKey = "fortune_demo_token";
const token = () => localStorage.getItem(tokenKey);

const meInfo = document.getElementById("meInfo");
const ordersInfo = document.getElementById("ordersInfo");

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token()) headers.Authorization = `Bearer ${token()}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

function showError(err) {
  alert(err.message || String(err));
}

async function loadMe() {
  if (!token()) {
    meInfo.textContent = "未登录";
    return;
  }
  try {
    const data = await request("/api/me");
    meInfo.textContent = JSON.stringify(data.user, null, 2);
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
    ordersInfo.textContent = JSON.stringify(data.orders, null, 2);
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
    alert("注册成功");
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
    alert("登录成功");
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
    alert("订单已创建");
  } catch (err) {
    showError(err);
  }
});

document.getElementById("refreshOrders").addEventListener("click", loadOrders);

loadMe();
loadOrders();
