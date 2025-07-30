//
// db/index.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// database connection with neon postgres
//

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export { sql }; 