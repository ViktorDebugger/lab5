import BASE_URL from "./baseUrl.js";

export const saveOrderFirestore = async (userId, order) => {
  if (!userId || !order) {
    throw new Error("Відсутні обов'язкові дані");
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Необхідна авторизація");
    }

    const response = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, order }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Неправильний формат відповіді від сервера");
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
      }
      throw new Error(data.message || "Помилка при збереженні замовлення");
    }

    return data;
  } catch (error) {
    console.error("Помилка збереження замовлення:", error.message);
    throw error;
  }
};

export const loadOrdersFirestore = async (userId) => {
  if (!userId) {
    throw new Error("Відсутній ідентифікатор користувача");
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Необхідна авторизація");
    }

    const response = await fetch(`${BASE_URL}/api/orders/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Неправильний формат відповіді від сервера");
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
      }
      throw new Error(data.message || "Помилка при завантаженні замовлень");
    }

    return data;
  } catch (error) {
    console.error("Помилка завантаження замовлень:", error.message);
    throw error;
  }
};

export const updateDishGrade = async (userId, orderId, dishId, grade) => {
  if (!userId || !orderId || !dishId || !grade) {
    throw new Error("Відсутні обов'язкові дані");
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Необхідна авторизація");
    }

    const response = await fetch(
      `${BASE_URL}/api/orders/${userId}/${orderId}/${dishId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ grade }),
      }
    );

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Неправильний формат відповіді від сервера");
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
      }
      throw new Error(data.message || "Помилка при оновленні оцінки");
    }

    return data;
  } catch (error) {
    console.error("Помилка оновлення оцінки:", error.message);
    throw error;
  }
};
