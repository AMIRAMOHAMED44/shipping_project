import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constant/axiosConfig";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const initalState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN": {
      return { ...state, user: action.payload, isAuthenticated: true };
    }
    case "LOGOUT": {
      return initalState;
    }
    default:
      return state;
  }
}

const AuthProvider = ({ children }) => {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initalState
  );
  const navigate = useNavigate();
  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      try {
        const decoded = jwtDecode(access);
        dispatch({ type: "LOGIN", payload: decoded });
      } catch (e) {
        console.log("Access token invalid or expired");
        logout();
      }
    }
  }, []);
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${baseUrl}/api/users/login/`, {
        email,
        password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      const decoded = jwtDecode(access);
      console.log(decoded);

      dispatch({ type: "LOGIN", payload: decoded });
      navigate("/");
    } catch {
      console.log("Invalid credentials");
    }
  };
  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth, AuthContext };
