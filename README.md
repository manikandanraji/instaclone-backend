# Instaclone Backend

Instaclone backend is built with Express + MongoDB. If you looking for the frontend repo, [click here](https://github.com/manikandanraji/instaclone-backend)

[Check out the deployed site](https://instaclone2.netlify.app)

## Running Locally

At the root of the project, you should have a .env with the following contents

```js
JWT_SECRET=<yoursupersecret>
JWT_EXPIRE=30d // or anything you prefer
MONGOURI=<your_mongodb_connection_uri>
```

Then run <code>npm i && npm run dev</code> to start the development server

## Deploying the backend to heroku

First create an heroku account and install the heroku cli globally and login

```bash
npm i -g heroku
heroku login
```

Once logged in, create a new heroku application and push it to the remote 'heroku'

```bash
heroku create
git push heroku master
```
Then we need to manually setup the environmental variables using the heroku dashboard

## How it looks

### Home 
![Home](screenshots/home.png)

### Explore
![Explore](screenshots/explore.png)


### Detailed Post
![Detailed Post](screenshots/detailed_post.png)


### Profile
![Profile](screenshots/profile.png)

### Edit Profile
![Edit Profile](screenshots/edit_profile.png)

### New Post
![New Post](screenshots/newpost.png)

## Twitter clone
I also built a twitter clone using Prisma + GraphQL. 

1. [Twitter Clone Frontend](https://github.com/manikandanraji/twitter-clone-frontend)
2. [Twitter Clone Backend](https://github.com/manikandanraji/twitter-clone-backend)
