import { useEffect, useState } from "react";
import { useTitle } from "./../hooks/useTitle.jsx";
import { useBackgroundColor } from "./../hooks/useBackgroundColor.jsx";

import { useAuth } from "./../contexts/AuthContext.jsx";

import Order from "../components/Order.jsx";

import { loadOrdersFirestore } from "../../services/orders.js";

const Orders = () => {
  useTitle("Замовлення");
  useBackgroundColor("bg-green-500");

  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        if (currentUser) {
          const userOrders = await loadOrdersFirestore(currentUser.uid);
          setOrders(userOrders || []);
          setError(null);
        }
      } catch (error) {
        console.error("Помилка завантаження замовлень:", error);
        if (error.message.includes("авторизація")) {
          setError("Помилка авторизації. Будь ласка, увійдіть знову.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const sortedOrders = orders.sort(
    (a, b) => new Date(b.orderStartDatetime) - new Date(a.orderStartDatetime)
  );

  return (
    <main className="mx-auto w-full flex-grow max-w-[1490px] flex-1 rounded-lg py-4 text-center text-[30px]">
      <section className="w-full rounded-lg bg-white py-2 text-[30px]">
        <h1>Замовлення</h1>
      </section>

      <section className="mt-4 max-w-[1490px] 2xl:mx-auto">
        {isLoading ? (
            <div className="h-[380px] mt-4 text-white text-[20px] flex items-center justify-center">
            Завантаження...
          </div>
        ) : error ? (
          <div className="h-[340px] text-white border-4 border-white rounded-lg flex items-center justify-center">
            {error}
          </div>
        ) : orders.length ? (
          <ul className="grid grid-cols-1 gap-2">
            {sortedOrders.map((order) => (
              <Order key={order.orderId} order={order} />
            ))}
          </ul>
        ) : (
          <div className="h-[340px] text-white border-4 border-white rounded-lg flex items-center justify-center">
            Пусто
          </div>
        )}
      </section>
    </main>
  );
};

export default Orders;
