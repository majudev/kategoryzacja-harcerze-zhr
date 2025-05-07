import server from './server';
import logger from './utils/logger';

import 'dotenv/config';

if(process.env.OAUTH_GOOGLE_SECRET === undefined || process.env.OAUTH_GOOGLE_SECRET === ""
|| process.env.OAUTH_GOOGLE_ID === undefined || process.env.OAUTH_GOOGLE_ID === ""){
    console.log("Google OAuth credentials not set. Dying.");
    process.exit(-1);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => logger.info(`Server listening on http://127.0.0.1:${PORT}`));