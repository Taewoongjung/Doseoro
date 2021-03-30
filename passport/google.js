const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/user');

// {"web":{
// "client_id":"761701334575-tfu8kdj10m33htg4nfffkuqqoi05688n.apps.googleusercontent.com"  ***
// ,"project_id":"peaceful-field-309212"
// ,"auth_uri":"https://accounts.google.com/o/oauth2/auth" ***
// ,"token_uri":"https://oauth2.googleapis.com/token"  ***
// ,"auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs"
// ,"client_secret":"PVDJSTpU47BINZ2LB-_ta-w2" ***
// ,"redirect_uris":["http://localhost:1000/auth/google/callback"]}}  ***

module.exports = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        tokenURL: process.env.GOOGLE_TOKEN,
        // authorizationURL:'https://accounts.google.com/o/oauth2/auth',
        // authorizationURL: process.env.GOOGLE_AUTH,
        callbackURL: '/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {  // 이 서비스에서는 구글 profile만 받아옴
        console.log('google profile', profile);
        try { // 회원 가입과 로그인이 동시에 일어남
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'google' },
            });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile._json && profile._json.google_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'google',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
