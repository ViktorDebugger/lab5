import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown, faX } from "@fortawesome/free-solid-svg-icons";

const BasketItem = ({
  item,
  incrementBasketItem,
  decrementBasketItem,
  deleteBasketItem,
}) => {
  return (
    <li className="basket-item col-span-1 mx-auto grid w-full grid-cols-2 items-center rounded-lg bg-white px-8 py-4 sm:grid-cols-4">
      <div className="col-span-1">
        <img
          src={item.dish.image}
          alt={item.dish.name}
          className="h-[65px] w-[75px] rounded-lg shadow-2xl md:w-[100px]"
        />
      </div>

      <div className="col-span-1">
        <h2 className="w-24 truncate text-[14px] sm:text-[16px] md:w-48 text-left md:text-[22px]">
          {item.dish.name}
        </h2>
      </div>

      <div className="col-span-1 text-center">
        <p className="text-[22px] text-gray-500">
          $ {item.dish.price * item.count}.00
        </p>
      </div>

      <div className="col-span-1 flex items-center justify-end gap-2 text-[12px] sm:text-[14px] md:text-[20px]">
        <span>Кількість</span>
        <span className="h-[35px] w-[35px] rounded-lg bg-gray-300 p-2 text-center md:p-1 text-[14px] md:text-[20px]">
          {item.count}
        </span>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => incrementBasketItem(item.orderDishId)}
            className="rounded-lg bg-gray-300 transition px-1 duration-300 ease-in-out hover:bg-gray-400"
          >
            <FontAwesomeIcon icon={faAngleUp} />
          </button>

          <button
            onClick={() => deleteBasketItem(item.orderDishId)}
            className="rounded-lg bg-gray-300 transition px-1 duration-300 ease-in-out hover:bg-gray-400"
          >
            <FontAwesomeIcon icon={faX} />
          </button>

          <button
            onClick={() => decrementBasketItem(item.orderDishId)}
            className="rounded-lg bg-gray-300 px-1 transition duration-300 ease-in-out hover:bg-gray-400"
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default BasketItem;
