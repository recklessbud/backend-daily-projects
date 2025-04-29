import express from 'express';
import { envVariables } from './config/dotenv.config';
import { errorHandler } from './middleware/errorHandler.middleware';
import { getCityWeather } from './services/weatherApi';
import { weatherRateLimiter } from './middleware/limiter.middleware';
const app = express();
const { PORT } = envVariables

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler)

app.post('/api', weatherRateLimiter, getCityWeather);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 