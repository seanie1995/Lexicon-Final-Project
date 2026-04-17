import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'packages/db/prisma/schema.prisma',
  datasource: { url: env('DIRECT_URL') },
})