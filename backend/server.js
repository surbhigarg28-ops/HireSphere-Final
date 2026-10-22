import app from './src/app.js';import {env} from './src/config/env.js';import {connectDB} from './src/config/db.js';
await connectDB();
const server=app.listen(env.port,()=>console.log(`HireSphere API running on http://localhost:${env.port}/api`));
process.on('unhandledRejection',e=>{console.error('Unhandled rejection:',e);server.close(()=>process.exit(1))});
