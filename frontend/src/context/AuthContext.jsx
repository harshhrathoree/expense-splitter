import {
    createContext,
    useState,
    useEffect,
  } from "react";
  
  import {
    refreshUserSession,
  } from "@/services/auth.service";

  import {
    setAccessToken,
    clearAccessToken,
  } from "@/api/tokenmanager";
  
  export const AuthContext =
    createContext();
  
  function AuthProvider({
    children,
  }) {
    const [user, setUser] =
      useState(null);
  
      const [
        accessToken,
        setAccessTokenState,
      ] = useState(null);
  
    const [loading, setLoading] =
      useState(true);
  
      const login = (
        userData,
        token
      ) => {
      
        setAccessToken(token);
      
        setUser(userData);
      
        setAccessTokenState(token);
      };
  
      const logout = () => {

        clearAccessToken();
      
        setUser(null);
      
        setAccessTokenState(null);
      };
  
    useEffect(() => {
      const restoreSession =
        async () => {
          try {
            const data =
              await refreshUserSession();
  
            setUser(data.user);
  
            setAccessToken(
                data.accessToken
              );
              
              setAccessTokenState(
                data.accessToken
              );
          } catch (error) {
            console.log(
              "No active session"
            );
          } finally {
            setLoading(false);
          }
        };
  
      restoreSession();
    }, []);
  
    return (
      <AuthContext.Provider
        value={{
          user,
          accessToken,
          loading,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export default AuthProvider;