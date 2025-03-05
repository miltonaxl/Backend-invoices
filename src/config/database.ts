/**
 * 
 * This file is responsible for creating a connection to the database using TypeORM.
 * It defines a DataSource object called AppDataSource that contains the database connection configuration.
 * The AppDataSource object is exported so that it can be used in other parts of the application.
 * 
 */
import { DataSource } from 'typeorm';
import path from 'path';
import { settings } from './env';

const isTestEnv = process.env.NODE_ENV === 'test';
const PROJECT_ROOT = path.resolve(__dirname, '../');

const entities_routes = PROJECT_ROOT + '/**/*entity.{js,ts}';

export const AppDataSource = new DataSource({
    type: isTestEnv ? 'sqlite' : 'postgres',
    database: isTestEnv ? ':memory:' : settings.DB_NAME,
    host: isTestEnv ? undefined : settings.DB_HOST,
    port: isTestEnv ? undefined : settings.DB_PORT,
    username: isTestEnv ? undefined : settings.DB_USER,
    password: isTestEnv ? undefined : settings.DB_PASSWORD,
    entities: [entities_routes],
    synchronize: settings.SYNC_DB,
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
            console.log("🚀 Connected to the database.");
        } catch (error) {
            console.log("❌  You're trying to connect to the database... \n", error);
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