import { RedisMemoryServer } from "redis-memory-server";

jest.mock("../event-bus");

let redis: RedisMemoryServer;

beforeAll(async () => {
    redis = new RedisMemoryServer();
    await redis.start();
    const PORT = await redis.getPort();
    process.env.REDIS_HOST = await redis.getHost();
    process.env.REDIS_PORT = "" + PORT;
});

beforeEach(async () => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await redis.stop();
});