import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./assets/components/Footer.jsx";
import Header from "./assets/components/Header.jsx";
import Menu from "./assets/pages/Menu.jsx";
import Basket from "./assets/pages/Basket.jsx";
import Orders from "./assets/pages/Orders.jsx";
import Signup from "./assets/components/auth/Signup.jsx";
import Login from "./assets/components/auth/Login.jsx";
import { AuthProvider } from "./assets/contexts/AuthContext.jsx";
import Dashboard from "./assets/pages/Dashboard.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/lab5/signup"
            element={
              <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-md p-8">
                  <Signup />
                </div>
              </div>
            }
          />
          <Route
            path="/lab5/login"
            element={
              <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-md p-8">
                  <Login />
                </div>
              </div>
            }
          />
          <Route
            path="/lab5"
            element={
              <div className="flex min-h-screen flex-col">
                <Header />
                <Menu />
                <Footer />
              </div>
            }
          />
          <Route
            path="/lab5/basket"
            element={
              <div className="flex min-h-screen flex-col">
                <Header />
                <Basket />
                <Footer />
              </div>
            }
          />
          <Route
            path="/lab5/orders"
            element={
              <div className="flex min-h-screen flex-col">
                <Header />
                <Orders />
                <Footer />
              </div>
            }
          />
          <Route
            path="/lab5/dashboard"
            element={
              <div className="flex min-h-screen flex-col">
                <Header />
                <Dashboard />
                <Footer />
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
