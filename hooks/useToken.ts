import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { login } from "../api";
import { useStoreApp } from "@/store";

const useToken = () => {
  const [token, setToken] = useState("");
  const store = useStoreApp((state) => state);

  useEffect(() => {
    const timeout = setInterval(async () => {
      if (!store.isSignout && store.token) {
        const value = SecureStore.getItem("credentials");
        const user = JSON.parse(value as string);
        const data = await login(user.registration, user.password);
        if (data?.token) {
          store.updateToken(data?.token);
          setToken(data?.token);
        }
      }
    }, 300000); // 5 min
    return () => clearInterval(timeout);
  }, [store]);
  return token;
};

export default useToken;
