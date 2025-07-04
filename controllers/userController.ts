import { render } from "ejs";
import bcrypt from "bcrypt";
import { json } from "stream/consumers";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
const userController: { [key: string]: any } = {};

import * as prismaQueries from "../db/prismaQueries";
import * as arrQueries from "../db/arrQueries";
import * as qbittorrentQueries from "../db/qbittorrentQueries";
import * as fsQueries from "../db/fs";
import * as statsQueries from "../db/stats";
import * as fileQueries from "../db/fileQueries";
import { User } from "../generated/prisma";
const db = {
  ...prismaQueries,
  ...arrQueries,
  ...qbittorrentQueries,
  ...fsQueries,
  ...statsQueries,
  ...fileQueries,
};

// Passport.js configuration start

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username: string, password: string, done) => {
      try {
        const userFindByName = await db.userFindByName(username);
        const user = userFindByName;
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const userFindById = await db.userFindById(id);
    const user = userFindById;
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Passport.js configuration end

userController.MainGet = async (req, res) => {
  if(req.user) {
  res.render("index", {
    title: "index",
    stats: await db.getStats(),
    donatePercentage: 20,
    requestPercentage: 20,
    username: req.user.username,
    info: {
      up: 300,
      down: 300,
      ratio: 1
    },
    hasJellyfin: req.user.hasJellyfin,
    hasSymphonium: req.user.hasSymphonium,
    hasImmich: req.user.hasImmich,
  });
  } else {
    res.render("login", {
    title: "redirect from index",
    message: ""
    })
  }
};

userController.profileGet = async (req, res) => {
  const userId = req.user?.id;
  if (userId) {
    res.render("profile", {
      title: "Main",
      folders: await db.folderGetAll(userId),
      files: await db.filesGetWithoutFolder(userId),
    });
  } else {
    res.status(401).send("401: Access denied");
  }
};

userController.signUpGet = (req, res) => {
  res.render("sign-up", {
    title: "Sign Up Form",
    message: "",
  });
};

userController.signUpPost = async (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password === confirmPassword) {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const hashedPassword = await bcrypt.hash(password, 16)
      await db.userCreate(username, hashedPassword);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.render("sign-up", {
        title: "Sign Up Form",
        message: "An error occurred. Please try again.",
      });
    }
  } else {
    res.render("sign-up", {
      title: "Sign Up Form",
      message: "Passwords do not match.",
    });
  }
};

userController.logInGet = (req, res) => {
  res.render("login", {
    title: "Log In Form",
    message: "",
  });
};

userController.logInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
});

export { userController };