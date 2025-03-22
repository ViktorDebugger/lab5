import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useBackgroundColor } from "./../hooks/useBackgroundColor.jsx";
import { useTitle } from "./../hooks/useTitle.jsx";

import DishCard from "./../components/DishCard.jsx";
import CategorySelect from "./../components/CategorySelect.jsx";
import SearchInput from "./../components/SearchInput.jsx";
import Pagination from "./../components/Pagination.jsx";

import {
  loadBasketFirestore,
  saveBasketFirestore,
} from "../../services/basket.js";

import BASE_URL from './../../services/baseUrl.js';


const Menu = () => {
  useTitle("Меню");
  useBackgroundColor("bg-red-500");

  const itemsPerPage = 8;
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dishes, setDishes] = useState([]);
  const location = useLocation();
  const [inputSearch, setInputSearch] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [basket, setBasket] = useState([]);
  const [dishesData, setDishesData] = useState([]);

  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          setUser(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Помилка отримання даних користувача");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Помилка отримання користувача:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, [location.pathname]);

  useEffect(() => {
    const fetchDishes = async () => {
      setIsloading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/api/dishes`);

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Неправильний формат відповіді від сервера");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Помилка при отриманні страв");
        }

        const data = await response.json();
        setDishesData(data || []);
      } catch (error) {
        console.error("Помилка при отриманні страв: ", error);
        setError(error.message);
      } finally {
        setIsloading(false);
      }
    };

    fetchDishes();
  }, []);

  useEffect(() => {
    setFilteredDishes(dishesData);
    setDishes(dishesData.slice(0, itemsPerPage) || []);
  }, [dishesData]);

  useEffect(() => {
    updateDishes();
  }, [selectCategory]);

  useEffect(() => {
    const loadAndTransferBasket = async () => {
      try {
        const localBasket = JSON.parse(localStorage.getItem("basket")) || [];

        if (!user) {
          setBasket(localBasket || []);
          return;
        }

        try {
          const basketFromFirestore = await loadBasketFirestore(user.uid);
          if (basketFromFirestore?.length > 0) {
            setBasket(basketFromFirestore || []);
            localStorage.removeItem("basket");
          } else if (localBasket.length > 0) {
            await saveBasketFirestore(user.uid, localBasket);
            setBasket(localBasket || []);
            localStorage.removeItem("basket");
          }
        } catch (error) {
          if (error.message.includes("авторизація")) {
            setUser(null);
            setBasket(localBasket || []);
          }
          setError(error.message);
        }
      } catch (error) {
        console.error("Помилка роботи з кошиком:", error.message);
        setError("Помилка при роботі з кошиком");
      }
    };

    loadAndTransferBasket();
  }, [user]);

  const updateDishes = () => {
    if (!dishesData) return;

    const filtered = dishesData.filter(
      (dish) =>
        dish.name.toLowerCase().includes(inputSearch.toLowerCase()) &&
        (selectCategory ? dish.category === selectCategory : true)
    );
    setFilteredDishes(filtered);
    setCurrentPage(1);
    setDishes(filtered.slice(0, itemsPerPage));
  };

  const handleSelect = (value) => {
    setSelectCategory(value);
  };

  const handleOrder = async (dishId) => {
    const selectedDish = dishes.find((dish) => dish.id === dishId);
    if (selectedDish) {
      const newBasket = [
        ...basket,
        { orderDishId: basket.length + 1, dish: selectedDish, count: 1 },
      ];
      setBasket(newBasket || []);

      if (user) {
        try {
          await saveBasketFirestore(user?.uid, newBasket);
        } catch (error) {
          console.error("Помилка збереження корзини в Firestore:", error);
          setError("Помилка при роботі з кошиком");
        }
      } else {
        localStorage.setItem("basket", JSON.stringify(newBasket));
      }
    }
  };

  const isInBasket = (dishName) => {
    return (basket || []).some((item) => item.dish.name === dishName);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const start = (pageNumber - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setDishes(filteredDishes.slice(start, end) || []);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  return (
    <main className="mx-auto py-4 flex-grow w-full max-w-[1490px] flex-1 rounded-lg text-center text-[20px]">
      <section className="w-full rounded-lg bg-white py-2 text-[30px]">
        <h1>Меню</h1>
      </section>

      <section className="mt-4 flex max-w-[1490px] flex-col items-center justify-between gap-2 rounded-lg bg-white px-2 py-4 sm:flex-row 2xl:mx-auto">
        <CategorySelect value={selectCategory} onChange={handleSelect} />
        <SearchInput
          value={inputSearch}
          onChange={setInputSearch}
          onSearch={updateDishes}
        />
      </section>

      <section>
        {isLoading ? (
          <div className="h-[380px] mt-4 text-white border-4 border-white rounded-lg flex items-center justify-center">
            Завантаження...
          </div>
        ) : error ? (
          <div className="h-[380px] mt-4 text-white border-4 border-white rounded-lg flex items-center justify-center">
            {error}
          </div>
        ) : dishes?.length ? (
          <ul className="mt-4 grid max-w-[1490px] grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:mx-auto">
            {dishes.map((item) => (
              <DishCard
                key={item.id}
                dish={item}
                handleOrder={handleOrder}
                isInBasket={isInBasket}
              />
            ))}
          </ul>
        ) : (
          <div className="h-[380px] mt-4 text-white border-4 border-white rounded-lg flex items-center justify-center">
            Пусто
          </div>
        )}
      </section>

      {!isLoading && dishes?.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
};

export default Menu;
