import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().optional(),
    DB_PATH: z.string().optional(),
  })
  .refine((v) => v.NODE_ENV !== 'production' || Boolean(v.DB_PATH), {
    message: 'DB_PATH is required in production',
    path: ['DB_PATH'],
  });

const parsed = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_PATH: process.env.DB_PATH,
});

export const PORT = parsed.PORT ? Number(parsed.PORT) : 3000;
export const NODE_ENV = parsed.NODE_ENV;
export const DB_PATH = parsed.DB_PATH ?? join(__dirname, '../data.sqlite');

export default { PORT, NODE_ENV, DB_PATH };
