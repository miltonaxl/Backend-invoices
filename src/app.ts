/**
 * 
 * This is the entry point of the application.
 * It creates an instance of the express application and starts the server on the specified port.
 * 
 */

import express from 'express';
import router from './routes';
import { errorHandler } from './shared/middlewares/error';
import { AppDataSource } from './config/database';
import { settings } from './config/env';

const app = express();
const PORT = settings.PORT;

app.use(express.json());

app.use('/api', router);
app.use(errorHandler);

AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(error => {
        console.error('❌ Failed to connect to the database', error);
    });
