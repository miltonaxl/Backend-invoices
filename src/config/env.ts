/*
 * 
 * This file is responsible for loading environment variables from the .env file and validating that all required environment variables are present.
 * It defines an object called settings that contains the required environment variables.
 * It checks if all required environment variables are present and logs an error message if any are missing.
 * It exports the settings object so that it can be used in other parts of the application.
 * 
 */


import dotenv from 'dotenv';


dotenv.config();

const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'PORT'];
requiredEnv.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`❌ Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
});


export const settings = {
    DB_HOST: process.env.DB_HOST as string,
    DB_PORT: Number(process.env.DB_PORT),
    DB_USER: process.env.DB_USER as string,
    DB_PASSWORD: process.env.DB_PASSWORD as string,
    DB_NAME: process.env.DB_NAME as string,
    PORT: Number(process.env.PORT) || 3000,
};