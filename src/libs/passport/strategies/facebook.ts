const config = require('config');
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const facebook = config.facebook;

module.exports = function(schemas, services) {
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: facebook.clientID,
        clientSecret: facebook.clientSecret,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // {
          //   provider: '',
          //   id: '',
          //   displayName: '',
          //   name: {
          //     familyName: '',
          //     givenName: '',
          //     middleName: '',
          //   },
          //   gender: '',
          //   emails: [{ value: '' }],
          //   photos: [
          //     {
          //       value: '',
          //     },
          //   ],
          //   _raw: '',
          //   _json: {
          //     id: '',
          //     name: '',
          //     last_name: '',
          //     first_name: '',
          //     email: '',
          //   },
          // };

          const info = profile._json;
          const providerId = info.id;
          const photos = profile.photos;
          const hasPhoto = !!photos && photos.length > 0;
          let user = {
            providerId,
            user: {
              firstName: info.first_name,
              lastName: info.last_name,
              username: null,
              avatar: hasPhoto ? photos[0].value : null,
              email: info.email,
            },
          };
          done(null, user);
        } catch (err) {
          console.log('Failed to connect with fb');
          console.log(JSON.stringify(err, null, 8));
          done(err);
        }
      }
    )
  );
};
