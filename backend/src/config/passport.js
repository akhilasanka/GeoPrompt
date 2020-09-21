
'use strict';
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const secret = "cmpe295b_geoprompt_node";

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    var opts = 
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret
    };
    passport.use('user', new JwtStrategy(opts, function (token, done) {
        console.log("in passport user strategy")
        if(token.isLoggedIn) {
            console.log("user is authorized")
            return done(null, token);
        } else {
            console.log("UnAuthorized User")
            return done("Not valid token", false)
        }
    }));
};