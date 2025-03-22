const DishCard = ({ dish, handleOrder, isInBasket }) => {
  return (
    <li className="w-full max-w-[350px] col-span-1 mx-auto h-[500px] rounded-lg bg-white shadow-2xl duration-300 ease-in-out transition-all hover:bg-red-100 scale-100 hover:scale-[1.01]">
      <div className="mx-auto w-[80%]">
        <img
          src={dish.image}
          alt={dish.name}
          className="h-[200px] w-full rounded-lg shadow-2xl"
        />
      </div>

      <div className="p-4">
        <h2 className="text-[24px] font-bold">{dish.name}</h2>
        <p className="mt-4 text-[20px] text-gray-500">
          Категорія: {dish.category}
        </p>
        <div className="h-[120px]">
          <p className="mt-3 text-[18px] text-gray-800 md:text-[20px]">
            {dish.description}
          </p>
        </div>

        <button
          onClick={() => handleOrder(dish.id)}
          className="disabled:bg-gray-500 disabled:border-gray-500 disabled:text-white rounded-lg border-2 border-green-600 px-2 py-2 text-green-600 transition duration-300 ease-in-out hover:bg-green-600 hover:text-white w-full"
          disabled={isInBasket(dish.name)}
        >
          {isInBasket(dish.name)
            ? "У кошику"
            : `Додати у кошик: $ ${dish.price}.00`}
        </button>
      </div>
    </li>
  );
};

export default DishCard;
