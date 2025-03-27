import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useBackgroundColor } from "./../hooks/useBackgroundColor.jsx";
import { useTitle } from "./../hooks/useTitle.jsx";

import BasketItem from "./../components/BasketItem.jsx";

import {
  saveOrderFirestore,
  loadOrdersFirestore,
} from "../../services/orders.js";
import {
  loadBasketFirestore,
  saveBasketFirestore,
} from "../../services/basket.js";

import BASE_URL from './../../services/baseUrl.js';


const Basket = () => {
  useTitle("Кошик");
  useBackgroundColor("bg-yellow-500");

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [basket, setBasket] = useState([]);
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          const localBasket = JSON.parse(localStorage.getItem("basket")) || [];
          setBasket(localBasket);
          return;
        }

        const userResponse = await fetch(`${BASE_URL}/api/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.status === 401 || userResponse.status === 403) {
          localStorage.removeItem("token");
          setUser(null);
          const localBasket = JSON.parse(localStorage.getItem("basket")) || [];
          setBasket(localBasket);
          setError("Помилка авторизації. Будь ласка, увійдіть знову.");
          return;
        }

        if (!userResponse.ok) {
          throw new Error("Помилка отримання даних користувача");
        }

        const userData = await userResponse.json();
        setUser(userData.user);

        const userBasket = await loadBasketFirestore(userData.user.uid);
        setBasket(userBasket || []);

        const userOrders = await loadOrdersFirestore(userData.user.uid);
        setOrders(userOrders || []);

        setError(null);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
        setUser(null);
        const localBasket = JSON.parse(localStorage.getItem("basket")) || [];
        setBasket(localBasket);
        setError("Помилка підключення до сервера");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [location.pathname]);

  const updateBasket = async (newBasket) => {
    try {
      setBasket(newBasket);
      if (user) {
        await saveBasketFirestore(user.uid, newBasket);
        setError(null);
      } else {
        localStorage.setItem("basket", JSON.stringify(newBasket));
      }
    } catch (error) {
      console.error("Помилка оновлення кошика:", error);
      if (error.message.includes("авторизація")) {
        setUser(null);
        localStorage.setItem("basket", JSON.stringify(newBasket));
        setError("Помилка авторизації. Будь ласка, увійдіть знову.");
      } else {
        setError("Помилка оновлення кошика. Спробуйте ще раз.");
      }
    }
  };

  const makeOrder = async () => {
    if (!user) return;

    try {
      const maxOrderId =
        orders.length > 0
          ? Math.max(...orders.map((order) => order.orderId))
          : 0;

      const newOrder = {
        orderId: maxOrderId + 1,
        items: basket,
        orderStartDatetime: new Date(),
        totalPrice: basket.reduce(
          (accum, cur) => accum + cur.dish.price * cur.count,
          0
        ),
        totalCount: basket.reduce((accum, cur) => accum + cur.count, 0),
        orderEndDatetime: new Date(new Date().getTime() + 30 * 300),
      };

      await saveOrderFirestore(user.uid, newOrder);
      await saveBasketFirestore(user.uid, []);
      setBasket([]);
      setError(null);
      navigate("/orders");
    } catch (error) {
      console.error("Помилка оформлення замовлення:", error);
      if (error.message.includes("авторизація")) {
        setUser(null);
        setError("Помилка авторизації. Будь ласка, увійдіть знову.");
      } else if (error.message.includes("Кількість страв повинна бути в межах від 1 до 10")) {
        setModalMessage("Кількість страв повинна бути в межах від 1 до 10");
        setModalVisible(true);
      } else {
        setError("Помилка оформлення замовлення. Спробуйте ще раз.");
      }
    }
  };

  const incrementBasketItem = (id) => {
    const newBasket = basket.map((item) =>
      item.orderDishId === id
        ? { ...item, count: item.count < 100 ? item.count + 1 : item.count }
        : item
    );
    updateBasket(newBasket);
  };

  const decrementBasketItem = (id) => {
    const newBasket = basket.map((item) =>
      item.orderDishId === id
        ? { ...item, count: item.count > 0 ? item.count - 1 : item.count }
        : item
    );
    updateBasket(newBasket);
  };

  const deleteBasketItem = (id) => {
    const newBasket = basket.filter((item) => item.orderDishId !== id);
    updateBasket(newBasket);
  };

  const handleOrderClick = () => {
    if (!user) {
      setModalMessage("Потрібно зареєструватись, щоб оформити замовлення!");
      setModalVisible(true);
    } else {
      makeOrder();
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    navigate("/login");
  };

  const closeModalWarning = () => {
    setModalVisible(false);
  };


  return (
    <main className="mx-auto w-full flex-grow max-w-[1490px] flex-1 rounded-lg py-4 text-center text-[30px]">
      <section className="w-full rounded-lg bg-white py-2 text-[30px]">
        <h1>Кошик</h1>
      </section>

      <section className="mt-4 max-w-[1490px] rounded-lg border-[4px] border-white px-2 py-4 2xl:mx-auto">
        <article>
          {isLoading ? (
            <div className="h-[380px] mt-4 text-white text-[20px] flex items-center justify-center">
              Завантаження...
            </div>
          ) : error ? (
            <div className="h-[380px] mt-4 text-white flex items-center justify-center">
              {error}
            </div>
          ) : basket.length ? (
            <>
              <ul className="col-span-1 grid grid-cols-1 gap-2">
                {basket.map((item) => (
                  <BasketItem
                    key={item.orderDishId}
                    item={item}
                    incrementBasketItem={incrementBasketItem}
                    decrementBasketItem={decrementBasketItem}
                    deleteBasketItem={deleteBasketItem}
                  />
                ))}
              </ul>
              <footer className="mx-auto mt-4 flex w-full max-w-[1490px] flex-col items-center justify-between gap-4 rounded-lg bg-white px-8 py-4 text-left text-[14px] md:text-[18px] md:flex-row xl:text-[22px]">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex items-center gap-2 w-[200px] md:w-[280px] xl:w-[340px]">
                    <span>Загальний рахунок</span>
                    <span className="text-gray-500">
                      $
                      {basket.reduce(
                        (accum, cur) => accum + cur.dish.price * cur.count,
                        0
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Загальна кількість</span>
                    <span className="h-[35px] w-[35px] rounded-lg bg-gray-300 p-1 text-center text-[14px] md:text-[18px]">
                      {basket.reduce((accum, cur) => accum + cur.count, 0)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleOrderClick}
                  className="rounded-lg border-[2px] border-black px-6 py-2 transition duration-300 ease-in-out hover:bg-black hover:text-white"
                >
                  Замовити
                </button>
              </footer>
            </>
          ) : (
            <div className="h-[340px] text-white flex items-center justify-center">
              Пусто
            </div>
          )}
        </article>
      </section>
      {modalVisible && (
        <div className="text-[20px] fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <p>{modalMessage}</p>
            <button
              onClick={modalMessage === "Кількість страв повинна бути в межах від 1 до 10" ? closeModalWarning : closeModal}
              className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Basket;
