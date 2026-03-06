const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/User");
const userRepository = require("../repositories/userRepository");
const { v4: uuidv4 } = require("uuid");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.SERVER_URL}/api/auth/google/callback`,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        // console.log("Google Profile:", JSON.stringify(profile, null, 2));

        const email = profile.email || profile.emails?.[0]?.value || profile._json?.email;
        const firstNameRaw = profile.name?.givenName || profile.given_name || profile._json?.given_name || profile.displayName?.split(' ')[0] || "User";
        const lastNameRaw = profile.name?.familyName || profile.family_name || profile._json?.family_name || profile.displayName?.split(' ')[1] || "Name";
        const picture = profile.picture || profile.photos?.[0]?.value || profile._json?.picture || "";

        // Ensure names meet minlength requirement (3 chars)
        let givenName = firstNameRaw.trim();
        let familyName = lastNameRaw.trim();

        if (givenName.length < 3) givenName += "User";
        if (familyName.length < 3) familyName += "Name";

        let user = await userRepository.findByGoogleId(profile.id);
        if (user) {
            return done(null, user);
        }

        if (email) {
            user = await userRepository.findByEmail(email);
        }

        if (user) {
            // console.log("Found existing user by email:", user.emailId);
            user.googleId = profile.id;

            // Update missing fields
            if (!user.firstname) user.firstname = givenName;
            if (!user.lastname) user.lastname = familyName;
            if (!user.profilePic && picture) user.profilePic = picture;

            await userRepository.saveUser(user);
            return done(null, user);
        }

        // console.log("Creating new user:", { givenName, familyName, email });

        const newUser = new User({
            firstname: givenName,
            lastname: familyName,
            emailId: email,
            googleId: profile.id,
            profilePic: picture,
            password: uuidv4(),
            status: "Active",
            isAstrologer: false,
            role: "customer"
        });

        const validationError = newUser.validateSync();
        if (validationError) {
            console.error("Validation Error Details:", validationError);
            return done(validationError, null);
        }

        await newUser.save();
        done(null, newUser);
    } catch (err) {
        console.error("Google Auth Error:", err);
        done(err, null);
    }
}));

module.exports = passport;
