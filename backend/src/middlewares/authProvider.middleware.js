import { oauthClientID, oauthClientSecret, callback_url, facebook_app_id, facebook_app_secret, github_client_id, github_client_secret, twitter_consumer_id, twitter_consumer_secret } from '../config/config.js';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github';
import { Strategy as TwitterStrategy } from 'passport-twitter';

const callBackUrl = (provider)=>`${callback_url}/api/v1/${provider}/callback`

const useGoogleStrategy = () =>{
    return new GoogleStrategy({
        clientID:oauthClientID,
        clientSecret:oauthClientSecret,
        callbackURL:callBackUrl("google")
    },(accessToken,refreshToken,profile,done)=>{
        console.log({accessToken,refreshToken,profile})
        done(null,{profile})
    })
}

const useFacebookStrategy = () =>{
    return new FacebookStrategy({
        clientID:facebook_app_id,
        clientSecret:facebook_app_secret,
        callbackURL:callBackUrl("facebook"),
        profileFields:['id','displayName','email','photos'],
        //enableProof:true,
        //passReqToCallback:true  
    },(accessToken,refreshToken,profile,done)=>{
        console.log({accessToken,refreshToken,profile})
        done(null,{profile})
    })
}

const useGitHubStrategy = () =>{
    return new GitHubStrategy({
        clientID:github_client_id,
        clientSecret:github_client_secret,
        callbackURL:callBackUrl("github"),
        profileFields:['id','displayName','email','photos']
    },(accessToken,refreshToken,profile,done)=>{
        console.log({accessToken,refreshToken,profile})
        done(null,{profile})
    })
}

const useTwitterStrategy = () =>{
    return new TwitterStrategy({
        consumerKey:twitter_consumer_id,
        consumerSecret:twitter_consumer_secret,
        callbackURL:callBackUrl("twitter"),
        profileFields:['id','displayName','email','photos']
    },(accessToken,refreshToken,profile,done)=>{
        console.log({accessToken,refreshToken,profile})
        done(null,{profile})
    })
}

export {
    useGoogleStrategy,
    useFacebookStrategy,
    useGitHubStrategy,
    useTwitterStrategy
}