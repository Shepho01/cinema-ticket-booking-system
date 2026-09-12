import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [member, setMember] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/auth/me",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          setMember(null);
          return;
        }

        const data = await response.json();
        setMember(data.member);
      } catch (err) {
        console.error("Authentication check failed:", err);
        setMember(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const logout = async () => {
    await fetch(
      "http://localhost:5000/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    setMember(null);
  };

  return (
    <AuthContext.Provider
      value={{
        member,
        setMember,
        authLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}