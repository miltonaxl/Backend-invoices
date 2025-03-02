/**
 * 
 * This file is responsible for creating a connection to the database using TypeORM.
 * It defines a DataSource object called AppDataSource that contains the database connection configuration.
 * The AppDataSource object is exported so that it can be used in other parts of the application.
 * 
 */
import { DataSource } from 'typeorm';
import { settings } from './env';

const isTestEnv = process.env.NODE_ENV === 'test';

export const AppDataSource = new DataSource({
    type: isTestEnv ? 'sqlite' : 'postgres',
    database: isTestEnv ? ':memory:' : settings.DB_NAME,
    host: isTestEnv ? undefined : settings.DB_HOST,
    port: isTestEnv ? undefined : settings.DB_PORT,
    username: isTestEnv ? undefined : settings.DB_USER,
    password: isTestEnv ? undefined : settings.DB_PASSWORD,
    entities: ['src/**/*entity.ts'],
    synchronize: isTestEnv,
    dropSchema: isTestEnv,
    logging: false,
});



export const connectDatabase = async () => {

    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }


    if (!AppDataSource.isInitialized) {
        try {
            await AppDataSource.initialize();
        } catch (error) {
            console.log("❌  You're trying to connect to the database...");
        }
    }
};

export const disconnectDatabase = async () => {
    if (AppDataSource.isInitialized) {
        console.log("🚀 Disconnecting from the database...");
        await AppDataSource.destroy();
        console.log("✅ Database connection closed.");
    }
};