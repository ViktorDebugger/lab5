import BASE_URL from './baseUrl.js';

export const saveBasketFirestore = async (userId, basket) => {
  if (!userId || !basket) {
    throw new Error("Відсутні обов'язкові дані");
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Необхідна авторизація");
    }
    const response = await fetch(`${BASE_URL}/api/basket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, basket }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Неправильний формат відповіді від сервера");
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
      }
      throw new Error(data.message || "Помилка при збереженні кошика");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Помилка збереження кошика:", error.message);
    throw error;
  }
};

export const loadBasketFirestore = async (userId) => {
  if (!userId) {
    throw new Error("Відсутній ідентифікатор користувача");
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Необхідна авторизація");
    }

    const response = await fetch(`${BASE_URL}/api/basket/${userId}`, {
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
      throw new Error(data.message || "Помилка при завантаженні кошика");
    }

    return data.basket;
  } catch (error) {
    console.error("Помилка завантаження кошика:", error.message);
    throw error;
  }
};
