import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext.jsx";

import { useTitle } from "../../hooks/useTitle.jsx";
import { useBackgroundColor } from "../../hooks/useBackgroundColor.jsx";

const Signup = () => {
  useTitle("Реєстрація");
  useBackgroundColor("bg-blue-500");

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Паролі не співпадають");
    }

    if (passwordRef.current.value.length < 6) {
      return setError("Пароль повинен мати щонайменше 6 символів");
    }

    try {
      setError("");
      setLoading(true);
      const idToken = await signup(
        emailRef.current.value,
        passwordRef.current.value
      );
      if (idToken) {
        setModalMessage("Реєстрація успішна!");
        setModalVisible(true);
      } else {
        throw new Error("Не вдалося отримати токен");
      }
    } catch (error) {
      console.error(error);
      setError("Не вдалося створити обліковий запис: " + error);
    }

    setLoading(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    if (!error) {
      navigate("/");
    }
  };

  return (
    <div className="w-full">
      <div className="w-full rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-center text-2xl font-bold">Реєстрація</h2>
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Електронна пошта
            </label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              required
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Пароль (Не менше 6 символів)
            </label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              required
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password-confirm"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Підтвердження паролю
            </label>
            <input
              type="password"
              id="password-confirm"
              ref={passwordConfirmRef}
              required
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
          >
            Зареєструватися
          </button>
        </form>
      </div>
      <div className="mt-4 text-center">
        <p>Вже маєте обліковий запис?</p>
        <div className="mt-2 flex flex-col items-center">
          <Link
            to="/login"
            className="inline-block w-full md:w-[60%] bg-white px-4 py-2.5 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out text-blue-500"
          >
            Увійти
          </Link>
          <Link
            to="/"
            className="inline-block w-full md:w-[60%] bg-white px-4 py-2.5 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out text-blue-500 mt-12"
          >
            Повернутись на головну
          </Link>
        </div>
      </div>

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
    </div>
  );
};

export default Signup;
