/* eslint-disable prettier/prettier */
import axios from "axios"
import * as SecureStorage from "expo-secure-store"
import { Alert } from "react-native";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const apiClient = axios.create({
baseURL:API_BASE_URL, 
timeout:20000, 
headers:{
    "Content-Type":"application/json"
}
})

const getAccessToken = async ()=>{
    try {
        return await SecureStorage.getItem("token")
    } catch (error) {
        throw error
    }
}


apiClient.interceptors.request.use(
    async (config)=>{
        const token = await getAccessToken()
        if (token){
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config
    }, 
    (error)=>{
        return Promise.reject(error)
    }
)


apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
    
      // If the error is related to network issues
      if (error.message === "Network Error") {
        Alert.alert("Network Error", "Please check your internet connection.");
      }
  
      // Handle other status codes, e.g., 500 for server errors
      if (error.response && error.response.status >= 500) {
        Alert.alert("Internal Server Error", "Something went wrong on our side.");
      }
  
      // You can log the error to an external service for debugging
      console.error("Error response:", error.response.data || error.message);
  
      // Always reject the error so the calling code can handle it
      return Promise.reject(error);
    }
  );
  
  export default apiClient;
  