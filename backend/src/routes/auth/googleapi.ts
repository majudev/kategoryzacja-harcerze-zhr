import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { randomBytes } from 'crypto';
import { AuthorizationCode } from 'simple-oauth2';

const router = Router();
const prisma = new PrismaClient();

const google = new AuthorizationCode({
    client: {
        id: process.env.OAUTH_GOOGLE_ID as string,
        secret: process.env.OAUTH_GOOGLE_SECRET as string,
    },
    auth: {
        tokenHost: 'https://oauth2.googleapis.com',
        tokenPath: '/token',
        authorizeHost: 'https://accounts.google.com',
        authorizePath: '/o/oauth2/v2/auth',
    },
});

router.get('/', async (req: Request, res: Response) => {
    const authorizationUri = google.authorizeURL({
        redirect_uri: (process.env.BASEURL as string) + '/api/auth/google/callback',
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        state: randomBytes(16).toString('hex'),
    });

    res.redirect(authorizationUri);
});

router.get('/callback', async (req: Request, res: Response) => {
    const { code } = req.query;
    const options = {
        redirect_uri: (process.env.BASEURL as string) + '/api/auth/google/callback',
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        code: code as string,
    };

    try {
        const accessToken = await google.getToken(options);

        //console.log('The resulting token: ', accessToken.token);

        const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + encodeURIComponent(accessToken.token.access_token as string),{
            method: "GET",
        });
        const status = response.status;
        if(status !== 200){
            res.redirect((process.env.BASEURL as string) + '/login?status=error&code=401&message=invalid+OAuth2+code+provided');
            return;
        }
        const body = await response.json();
        const email = body.email;
        const name = body.name;

        if(email === undefined || email === null || name === undefined || name === null){
            //fail_internal_error(res, "google returned unsupported reply");
            res.redirect((process.env.BASEURL as string) + '/login?status=error&code=500&message=google+provided+unsupported+reply');
        }

        const user = await prisma.user.upsert({
            create: {
                email: email,
            },
            where: {
                email: email,
            },
            update: {
                lastLogin: new Date()
            },
            select: {
                id: true,
                role: true,
                districtAdmin: true,
            }
        });

        req.session.authenticated = true;
        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.userDistrictAdmin = user.districtAdmin;
        
        res.set('Content-Type', 'text/html');
        res.send(Buffer.from('<html><head><META http-equiv="refresh" content="0;' + (process.env.BASEURL as string) + '/"></head></html>'));
    } catch (error: any) {
      //fail_internal_error(res, "authentication failed");
      res.redirect((process.env.BASEURL as string) + '/login?status=error&code=401&message=authentication+failed');
      return;
    }
});

export default router;
