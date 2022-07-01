import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as InstagramStrategy } from "passport-instagram";
import {
  apiVersion,
  callbackUrl,
  facebookAppId,
  facebookAppSecret,
  githubAppId,
  githubAppSecret,
  googleClientId,
  googleClientSecret,
  instagramAppId,
  instagramAppSecret,
  twitterAppId,
  twitterAppSecret,
} from "../config/config.js";

const getProfile = (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  done(null, { profile });
};

const url = (provider) => `${callbackUrl}/api/${apiVersion}/${provider}/callback`;

const googleStrategy = () => {
  return new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: url("google"),
    },(accessToken,refreshToken,profile,done)=>{
      //console.log({accessToken,refreshToken,profile})
      scope: ['profile', 'email'],
      done(null,{profile})
  })
};

const useGoogleStrategy = () =>{
  return new GoogleStrategy({
      clientID:oauthClientID,
      clientSecret:oauthClientSecret,
      callbackURL:callbackUrl("google")
  },getProfile)
}

const facebookStrategy = () => {
  return new FacebookStrategy(
    {
      clientID: facebookAppId,
      clientSecret: facebookAppSecret,
      callbackURL: url("facebook"),
      profileFields: ["id", "emails", "displayName", "name", "photos"],
    },
    getProfile
  );
};

const twitterStrategy = () => {
  return new TwitterStrategy(
    {
      callbackURL: url("twitter"),
      consumerKey: twitterAppId,
      consumerSecret: twitterAppSecret,
      includeEmail: true,
    },
    getProfile
  );
};
const instagramStrategy = () => {
  return new InstagramStrategy(
    {
      callbackURL: url("instagram"),
      clientID: instagramAppId,
      clientSecret: instagramAppSecret,
      profileFields: ["id", "emails", "displayName", "name", "photos"],
    },
    getProfile
  );
};

const githubStrategy = () => {
  return new GithubStrategy(
    {
      callbackURL: url("github"),
      clientID: githubAppId,
      clientSecret: githubAppSecret,
      scope: ["user:email"],
    },
    getProfile
  );
};

export {
  googleStrategy,
  facebookStrategy,
  twitterStrategy,
  githubStrategy,
  instagramStrategy,
};
