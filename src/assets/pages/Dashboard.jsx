import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "../hooks/useTitle.jsx";
import { useBackgroundColor } from "../hooks/useBackgroundColor.jsx";

import { useAuth } from "./../contexts/AuthContext.jsx";

import BASE_URL from './../../services/baseUrl.js';

const Dashboard = () => {
  useTitle("Профіль");
  useBackgroundColor("bg-blue-500");

  const [user, setUser] = useState(null);
  const { logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Токен відсутній");
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

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setError("Не вдалося отримати дані користувача");
        }
      } catch (error) {
        console.error("Помилка отримання користувача:", error);
        setError("Не вдалося отримати дані користувача");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    setError("");

    try {
      await logout();
      localStorage.removeItem("token");
      setModalMessage("Вихід успішний!");
      setModalVisible(true);
    } catch (error) {
      console.error("Помилка виходу:", error);
      setError("Не вдалося вийти з системи");
      setModalMessage("Не вдалося вийти з системи");
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    if (!error) {
      navigate("/lab5");
      window.location.reload();
    }
  };

  return (
    <main className="w-full py-4 flex-grow mx-auto max-w-[1490px] flex-1 text-center text-[20px]">
      <section className="w-full rounded-lg bg-white py-2 text-[30px] text-center">
        <h1>Профіль</h1>
      </section>
      <section className="mt-4 bg-white px-2 py-4 rounded-lg">
        <p className="mb-4">
          <strong>Електронна пошта:</strong> {user?.email}
        </p>
        <section className="flex flex-col items-center md:flex-row justify-center gap-8 my-8">
          <button
            onClick={handleLogout}
            className="block w-full md:w-[60%] rounded-lg bg-blue-600 px-4 py-2.5 text-center text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out"
          >
            Вийти
          </button>
        </section>
        {modalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
              <h3 className="text-lg font-bold mb-4">Статус реєстрації</h3>
              <p>{modalMessage}</p>
              <button
                onClick={closeModal}
                className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Закрити
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
