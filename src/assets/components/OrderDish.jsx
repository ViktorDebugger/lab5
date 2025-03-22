import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { updateDishGrade } from "../../services/orders.js";

const OrderDish = ({ item, orderId }) => {
  const { currentUser } = useAuth();
  const [grade, setGrade] = useState(item.grade || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleGrade = async (value) => {
    if (!currentUser || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateDishGrade(currentUser.uid, orderId, item.orderDishId, value);
      setGrade(value);
    } catch (error) {
      console.error("Помилка при оновленні оцінки:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <li className="mx-auto w-full rounded-lg border-b-2 border-gray-300 bg-white px-8 py-4">
      <section className="grid grid-cols-2 sm:grid-cols-4 items-center">
        <figure className="col-span-1">
          <img
            src={item.dish.image}
            alt={item.dish.name}
            className="h-[65px] w-[75px] rounded-lg shadow-2xl md:w-[100px]"
          />
        </figure>
        <div className="col-span-1">
          <h2 className="w-24 truncate text-right text-[14px] md:w-48 md:text-left md:text-[20px]">
            {item.dish.name}
          </h2>
        </div>
        <div className="col-span-1 mt-4 sm:mt-0">
          <p className="text-[22px] text-gray-500">
            $ {item.dish.price * item.count}.00
          </p>
        </div>
        <div className="col-span-1 mt-4 sm:mt-0 flex items-center justify-end gap-2 text-[14px] md:text-[20px]">
          <span>Кількість</span>
          <span className="h-[35px] w-[35px] rounded-lg bg-gray-300 p-2 text-center md:p-1">
            {item.count}
          </span>
        </div>
      </section>

      <footer className="flex items-center justify-center gap-2">
        <span className="text-[14px] md:text-[16px]">Оцінка</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleGrade(star)}
              disabled={isUpdating}
              className={`text-2xl transition-colors duration-200 ${
                star <= grade ? "text-yellow-400" : "text-gray-300"
              } ${
                isUpdating ? "opacity-20 cursor-wait" : "hover:text-yellow-300"
              }`}
            >
              ⟡
            </button>
          ))}
        </div>
      </footer>
    </li>
  );
};

export default OrderDish;
