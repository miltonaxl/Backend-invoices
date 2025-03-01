/**
 * 
 * This file is responsible for creating a connection to the database using TypeORM.
 * It defines a DataSource object called AppDataSource that contains the database connection configuration.
 * The AppDataSource object is exported so that it can be used in other parts of the application.
 * 
 */
import { DataSource } from 'typeorm';
import { settings } from './env';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: settings.DB_HOST,
    port: settings.DB_PORT,
    username: settings.DB_USER,
    password: settings.DB_PASSWORD,
    database: settings.DB_NAME,
    entities: ['src/**/*entity.ts'],
    synchronize: true,
    logging: false,
});