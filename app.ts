import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from "express";
import passport from "passport";
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from './generated/prisma';

import { userRouter } from "./routes/userRouter";
import { fileRouter } from "./routes/fileRouter";

import crypto from 'crypto';

const app = express();
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


const cookieSecret = crypto.randomBytes(32).toString('hex')


app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: cookieSecret,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use("/", userRouter);
app.use("/", fileRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));