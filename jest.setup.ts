import { connectDatabase, disconnectDatabase } from './src/config/database';

beforeAll(async () => {
    await connectDatabase();
});

beforeEach(async () => {
    await disconnectDatabase();
    await connectDatabase();
});

afterAll(async () => {
    await disconnectDatabase();
});