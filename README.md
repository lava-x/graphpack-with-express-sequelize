# Graphpack with Express and Sequelize Starter

> A `GraphQL Server` starter project with implementatiom of [Graphpack](https://github.com/glennreyes/graphpack), Express, Sequelize, [Passport](http://www.passportjs.org/)

## Install & Usage

There are few things to do before we're getting started

1. Install project dependencies, run the command below:
   ```bash
   yarn
   ```
2. Setup PotgresSQL for your machine https://postgresapp.com/ or https://www.postgresql.org/download/ or others
3. Start PotgresSQL
4. You are good to go 👍

### Sequelize JS

http://docs.sequelizejs.com/class/lib/associations/base.js~Association.html

### Start development server

> To start the development server, simply run:

```bash
yarn dev
```

Simply access graphql server endpoints with http://localhost:4000/graphql (By default). If you would like to configure server port please refer to this [link](https://github.com/glennreyes/graphpack#configure-server-port) or goes to `/graphpack.config.js`

### Run production build

> To create a production-ready build run following command:

```bash
yarn build
```

> The following command will run the build and start the app

```bash
yarn start
```

# Folder Structure

```
/ config
    - default.json
    - local.json
    - production.json
/ src
    / helpers
        - TokenHelper.js
    / libs
        / passport
            / strategies
                - jwt.js
                - local.js
            - index.js
        - sequelize.js
    / models
    / resolvers
    context.js
    schema.graphql
- babel.config.js
- graphpack.config.js
```

- `/config` - place for your config value
- `/src/helpers` - helper file, you can import helper with
  ```js
  import TokenHelper from 'helpers/TokenHelper';
  import yourHelper from 'helpers/yourHelper';
  ```
- `/src/libs` - place for library, you can import your libs with
  ```js
  import Passport from 'libs/Passport';
  import SomeLibrary from 'libs/SomeLibrary';
  ```
- `/src/models` - Sequelize models, for details go to `Getting Started` - `Add Sequelize Model` section
- `/src/resolvers` - GraphQL resolvers, see this [link](https://github.com/glennreyes/graphpack#srcresolversjs-required). <br/>You can import resolvers with
  ```js
  import { isAuthenticated } from 'resolvers/Auth';
  import { getProfile } from 'resolvers/User';
  ```
- `/src/context.js` - see this [link](https://www.apollographql.com/docs/apollo-server/essentials/data.html#context) and [link](https://github.com/glennreyes/graphpack#srccontextjs)
- `/src/schema.graphql` - GraphQL type definitions, see this [Schemas and Types](https://graphql.org/learn/schema/) and [link](https://github.com/glennreyes/graphpack#srcschemagraphql-required)
- `babel.config.js` - To customize babel configuration, see this [link](https://github.com/glennreyes/graphpack#customize-babel-configuration)
- `graphpack.config.js` - To customize webpack configuration, see this [link](https://github.com/glennreyes/graphpack#customize-webpack-configuration)

# Getting Started

## Config

You can modify the config files for different environment like `production` and `development` under folder `/config`, please refer to this [package](https://github.com/lorenwest/node-config) for more details.

1. default.json - value default for `development` and `production`
2. production.json - its for `production` and will be override `default.json` value
3. local.json - for local development, will override `default.json`

## Add Sequelize Model

Create your mongoose model under folder `/src/models`, see http://docs.sequelizejs.com/manual/models-definition.html for more details.

```js
// --- Example - user.model.js
/**
 * See http://docs.sequelizejs.com/manual/getting-started.html#modeling-a-table
 * or http://docs.sequelizejs.com/manual/models-definition.html#configuration
 * for more details
 */
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = (sequelize) => {
  class UserSchema extends Model {}
  UserSchema.init(
    {
      name: { type: Sequelize.STRING, allowNull: false },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true },
      },
      password: { type: Sequelize.STRING, allowNull: false },
      roles: {
        type: Sequelize.ARRAY(Sequelize.ENUM('admin', 'user')),
        allowNull: false,
        defaultValue: ['user'],
      },
    },
    {
      sequelize,
      modelName: 'user',
      timestamps: true,
    }
  );

  UserSchema.associate = (models) => {
    UserSchema.hasMany(models.post, { onDelete: 'CASCADE' });
    UserSchema.hasMany(models.comment, { onDelete: 'CASCADE' });
    UserSchema.hasMany(models.article, { onDelete: 'CASCADE' });
  };
  return UserSchema;
};
```

> Note: Please use `require` for import packages and `module.exports` for exporting your model like example above.

Once you add your model, you are able to access your model in your resolvers. To access your sequalize schemas with `context.schemas`

```js
export function someResolver(obj, args, context, info) {
  const YourSchema = context.schemas.yourSchema;
}
```

> In above example the `yourSchema` in `context.schemas.yourSchema` is based on your file name. The name will be [camel cased string](https://lodash.com/docs/4.17.11#camelCase).

Example:

1. `test-schema.model.js` will be `testSchema`,
2. `other_schema.model.js` will be `otherSchema`
3. etc

## Authentication

By default, this project will be using [passport-jwt](https://github.com/themikenicholson/passport-jwt) and [passport-local](https://github.com/jaredhanson/passport-local) for authentication. If you would like to know more about `PassportJS` please refer to http://www.passportjs.org/docs/

> You can switch to your preferred authentication other than `passport-jwt` in `/src/context.js` line 17

> If you want to stick back to `passport-jwt` please override `jwt secret` value in `/config` folder

### Add passport strategy

Create your passport strategies under folder `/src/libs/passport/strategies`

Example:

```js
// local.js - under '/src/libs/passport/strategies/local.js'
import config from 'config';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';

const LocalStrategy = passportLocal.Strategy;

export default (schemas) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await schemas.user.findOne({ where: { email } });
          if (!user) {
            return done(null, false, {
              message: 'Please enter a valid email and password',
            });
          }
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            return done(null, false, {
              message: 'Incorrect email or password.',
            });
          }
          return done(null, user, {
            message: 'Logged In Successfully',
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
```

> Note: Strategy will be auto loaded once you created

### Usage

You can authenticate your user in `resolvers` like example below:

```js
import passport from 'passport';

export async function signin(parent, args, context, info) {
  const { req, res } = context;
  const tokenHelper = context.helpers.token;
  // inject signin params to request body for passport middleware to consume
  Object.assign(req.body, args); // <-- this is the magic
  return new Promise((resolve, reject) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return reject(info ? info.message : 'Login failed');
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          return reject(err);
        }
        const token = tokenHelper.sign({ userId: user.id, name: user.name });
        return resolve({
          token,
          user,
        });
      });
    })(req, res);
  });
}
```

#### Retrict user to access GraphQL server

You can retirct user to access certian query or mutation with method below

```js
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from 'resolvers/auth';
import { getArticles } from 'resolvers/article';
import { getProfile, getUser } from 'resolvers/user';
import { someResolver } from 'resolvers/blabla';

export default {
  Query: {
    getUser: combineResolvers(isAuthenticated('admin'), getUser), // only user with admin role can access
    profile: combineResolvers(isAuthenticated(['admin', 'user']), getProfile), // user with admin role and user role can access
    someResolver: combineResolvers(isAuthenticated(), someResolver), // default to only user role
    getArticles, // public access
  },
};
```

## Resolvers

You define all your resolvers under `/src/resolvers/index.js`, it will map your resolvers to GraphQL definitions.

Example:

```js
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, signin, signup } from 'resolvers/auth';
import { getArticleById, getArticles, createArticle } from 'resolvers/article';
import { getPost, getPosts, createPost } from 'resolvers/post';
import { getPostComments, getComment, createComment } from 'resolvers/comment';
import { getProfile, getUser, getUsers } from 'resolvers/user';

const resolvers = {
  Query: {
    hello: () => 'world!',
    profile: getProfile,
    getArticle: getArticleById,
    getArticles,
    getPost,
    getPosts,
    getPostComments,
    getComment,
    getUser: combineResolvers(isAuthenticated('admin'), getUser),
    getUsers: combineResolvers(isAuthenticated('admin'), getUsers),
  },
  Mutation: {
    createArticle: combineResolvers(isAuthenticated(), createArticle),
    createPost: combineResolvers(isAuthenticated(), createPost),
    createComment: combineResolvers(isAuthenticated(), createComment),
    signin,
    signup,
  },
  Post: {
    comments: function(obj, args, context, info) {
      return context.schemas.comment.find({ post: obj.id });
    },
  },
};

export default resolvers;
```

> See this [link](https://github.com/glennreyes/graphpack#srcresolversjs-required) for more details

# Playground

You are able to access graphql playground with url http://localhost:4000/graphql (by default) in development mode.<br />
Just copy below code and paste to your playground and you are good to go

```graphql
mutation signup {
  signup(name: "Louis Loo", email: "louis@mail.com", password: "somepassword") {
    token
    user {
      id
      name
      email
    }
  }
}

mutation signin {
  signin(email: "louis@mail.com", password: "somepassword") {
    token
    user {
      id
      name
      email
    }
  }
}

# ================ admin access
query getUser {
  getUser(id: "5bfee5873ddb10bfac84aa76") {
    id
    name
    email
    roles
  }
}

query getUsers {
  getUsers {
    id
    name
    email
    roles
  }
}

# ================ user access
query getLoginProfile {
  profile {
    id
    name
    email
  }
}

mutation createArticle {
  createArticle(title: "Article 1", body: "article 1 content 1") {
    id
    user {
      id
      name
      email
    }
    title
    body
  }
}

mutation createPost {
  createPost(title: "Post 1", content: "post 1 content 1") {
    id
    user {
      id
      name
      email
    }
    title
    content
  }
}

mutation createComment {
  createComment(postId: "5bfedd15515d1dbe931cd57c", content: "Comment 1") {
    id
    user {
      id
      name
      email
    }
    content
  }
}

# ================ normal access
query sayHello {
  hello
}

query getArticles {
  getArticles(size: 20, page: 1) {
    id
    user {
      id
      name
      email
    }
    title
    body
  }
}

query getArticleWithId {
  getArticle(id: "5bfe455e4fdf2bb8131db4b5") {
    id
    user {
      id
      name
      email
    }
    title
    body
  }
}

query getPosts {
  getPosts(size: 20, page: 1) {
    id
    user {
      id
      name
      email
    }
    title
    content
    comments {
      user {
        name
      }
      content
    }
  }
}

query getPostWithId {
  getPost(id: "5bfedd15515d1dbe931cd57c") {
    id
    user {
      id
      name
      email
    }
    title
    content
  }
}

query getPostComments {
  getPostComments(post: "5bfedd15515d1dbe931cd57c", size: 20, page: 1) {
    id
    user {
      id
      name
      email
    }
    content
    post
  }
}

query getCommentWithId {
  getComment(id: "5bffa485edf4c8ca4933328a") {
    id
    user {
      id
      name
      email
    }
    content
    post
  }
}
```

> Some query or mutation will need authorization, replace `__YOUR_TOKEN__` with your token

```json
{
  "Authorization": "Bearer __YOUR_TOKEN__"
}
```
