import axios from "axios";
import { envVariables } from "../config/dotenv.config";
import axiosRetry from "axios-retry";

const {WEATHER_API_BASE_URL, WEATHER_API_KEY} = envVariables

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });


export const getWeather = async(city: string):Promise<void> => {
    const url = `${WEATHER_API_BASE_URL}?q=${city}&appid=${WEATHER_API_KEY}`	
  try {
    const response = await axios.get(url);
      return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("error counld not fetch weather");
  }
}

