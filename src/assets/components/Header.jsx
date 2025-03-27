import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faClose,
  faBars,
  faUser,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import BASE_URL from "./../../services/baseUrl.js";

const Header = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
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
          setIsAuthenticated(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Помилка перевірки автентифікації");
        }

        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Помилка перевірки автентифікації:", error);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
    };

    checkAuth();
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getLinkClasses = (path) => {
    const baseClasses =
      "rounded-lg px-8 py-2 transition duration-300 ease-in-out";
    return `${baseClasses} ${
      isActive(path) ? "bg-gray-200 font-bold" : "hover:bg-gray-200"
    }`;
  };

  const getMobileLinkClasses = (path) => {
    const baseClasses = "block rounded-lg border border-gray-400 p-4";
    return `${baseClasses} ${
      isActive(path) ? "bg-gray-200 font-bold" : "hover:bg-gray-200"
    }`;
  };

  return (
    <>
      <header className="mx-auto my-3 flex h-[65px] w-full max-w-[1490px] items-center justify-between rounded-lg bg-white px-8 py-4 shadow-2xl">
        <div className="flex items-center text-[22px]">
          <FontAwesomeIcon icon={faUtensils} />
        </div>

        <nav>
          <ul className="hidden items-center gap-2 text-[20px] sm:flex lg:gap-16">
            <li>
              <Link to="/" className={getLinkClasses("/")}>
                Меню
              </Link>
            </li>
            <li>
              <Link to="/basket" className={getLinkClasses("/basket")}>
                Кошик
              </Link>
            </li>
            {!!user && (
              <li>
                <Link to="/orders" className={getLinkClasses("/orders")}>
                  Мої замовлення
                </Link>
              </li>
            )}

            <li>
              {isAuthenticated ? (
                <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
                  <FontAwesomeIcon icon={faUser} />
                </Link>
              ) : (
                <Link to="/login" className={getLinkClasses("/login")}>
                  <FontAwesomeIcon icon={faRightToBracket} />
                </Link>
              )}
            </li>
          </ul>
        </nav>
        <button
          onClick={() => setOpenSidebar(true)}
          className="block text-[20px] sm:hidden"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </header>

      <nav
        className={`fixed right-0 top-0 z-10 h-full w-full transform bg-white shadow-lg transition-transform duration-300 ${
          openSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between py-6 pl-4 pr-8 text-[22px] font-bold">
          <ul className="flex w-[80%] flex-col gap-4">
            <li>
              <Link
                to="/"
                className={getMobileLinkClasses("/")}
                onClick={() => setOpenSidebar(false)}
              >
                Меню
              </Link>
            </li>
            <li>
              <Link
                to="/basket"
                className={getMobileLinkClasses("/basket")}
                onClick={() => setOpenSidebar(false)}
              >
                Кошик
              </Link>
            </li>
            {!!user && (
              <li>
                <Link
                  to="/orders"
                  className={getMobileLinkClasses("/orders")}
                  onClick={() => setOpenSidebar(false)}
                >
                  Мої замовлення
                </Link>
              </li>
            )}
            <li>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className={getMobileLinkClasses("/dashboard")}
                  onClick={() => setOpenSidebar(false)}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span className="ml-4">Профіль</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={getMobileLinkClasses("/login")}
                  onClick={() => setOpenSidebar(false)}
                >
                  <FontAwesomeIcon icon={faRightToBracket} />
                  <span className="ml-4">Вхід</span>
                </Link>
              )}
            </li>
          </ul>
          <button
            onClick={() => setOpenSidebar(false)}
            className="block text-[22px] sm:hidden"
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Header;
