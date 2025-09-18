
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import { User } from "../models/user.model.js";

export const configurePassport = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/v1/users/google/callback",
        scope:["profile","email"]
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    $or: [{ googleId: profile.id }, { email: profile.emails[0].value }]
                });

                if (user) {
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save({ validateBeforeSave: false });
                    }
                    user.fullName = profile.displayName;
                    user.avatar = profile.photos[0].value;
                    return done(null, user);
                } else {
                    const newUser = await User.create({
                        googleId: profile.id,
                        fullName: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                        username: profile.emails[0].value.split('@')[0] + Math.floor(Math.random() * 1000),
                    });
                    return done(null, newUser);
                }
            } catch (error) {
                return done(error, false);
            }
        }
    ))

    passport.use(
      new GithubStrategy({
        clientID: process.env.G_CLIENT_ID,
        clientSecret: process.env.G_CLIENT_SECRET,
        callbackURL: `/api/v1/users/github/callback`,
        scope:['user:email']
      },
          async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails && profile.emails[0].value;
                if (!email) {
                    return done(new Error("Could not retrieve email from Github."), false);
                } 
                let user = await User.findOne({
                    $or: [{ githubId: profile.id }, { email: email }]
                });
                if (user) {
                    if (!user.githubId) {
                        user.githubId = profile.id;
                    }
                    user.fullName = user.fullName || profile.displayName;
                    user.avatar = user.avatar || profile.photo[0].value;
                    await user.save({ validateBeforeSave: false });

                    return done(null, user);
                } else {
                    const newUser = await User.create({
                        githubId: profile.id,
                        fullName: profile.displayName,
                        email: email,
                        avatar: profile.photos[0].value,
                        username: profile.username || `${email.split('@')[0]}${Math.floor(Math.random() * 1000)}`,
                    });
                    
                    return done(null, newUser);
                }
            } catch (error) {
                return done(error, false);
            }
          }
      ));
}
