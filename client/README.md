# React-Group-Project_Social-Media


## [Pursuit-Core-Web-React-Group-Project](https://github.com/joinpursuit/Pursuit-Core-Web-React-Group-Project)

For this project, in a group, build a Full-Stack Application with Express.js, PostgreSQL and React where users can upload and view images. 

## App Specifications

- Users can create an account and sign in
- Users have a profile where thery can change their display name and profile image
- Users can post an image with a caption and/or hashtags
- Users can view images uploaded by other users in their feed

### Screens

Your app should have the functionality outlined below.  Feel free to add features, and make the UI whatever makes the most sense to your group.

#### Login and Signup form

- An input for entering an email address
- A 'Sign In' button that logs the user in
- A 'Create Account" button that creates a new user

Successfully logging-in or creating an account should redirect the user to their feed. Note that we won't be using a password for logging-in or signing-up just an email address. Prevent a user signing-up with an email that is already registered. 

#### Feed

- Display images uploaded by all users
- Have a search bar that can search by hashtags and display only the relevant images

#### Profile

- Display the email address of the currently logged-in user
- Display the profile image of the current user and allow them to change their profile picture
- Include a "Logout" button that logs the user out and presents the login screen

#### Upload image form

- Give the user the ability to upload an image
- The user should be able to add hashtags to their upload
- Include a "Post" button
You can do this in the feed page ala Tumblr or Reddit style or have it entirely in a separate front-end route.

### Bonus Feature ideas

- Like an image
- Leave an emoji response on an image
- Comment on an image
- Show trending hashtags in the feed
- Allow users to befriend/follow other users and in their feed only display posts of people they follow.
- In the user profile have a theme toggle checkbox. Have it change the appearance of your App in some fashion, for instance toggle between light and dark theme (black background and white fonts).

### Resources
- [Uploading an Image | Creating a REST API with Node.js [VIDEO]](https://www.youtube.com/watch?v=srPXMt1Q0nY)
- [React Image Upload Made Easy [VIDEO]](https://www.youtube.com/watch?v=XeiOnkEI7XI)
- [How to upload, display and save images using node.js and express [STACKOVERFLOW]](https://stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express) 
- [Multer for file upload in Express.js](https://github.com/expressjs/multer)
- [express-generator](https://expressjs.com/en/starter/generator.html). To get a basic scaffolding for an Express server in a folder called `server/` run `npx express-generator --no-view server/`

## To start off
* Assemble into your groups.
* Review [The Groupwork Notes](./groupwork.md)
* Get a trello board from the [template](https://trello.com/b/dYKNBTdL) and add all the team members and instructors to it. The trello usernames for instructors are alejandrofranco23, wynter21 & jungraejang.
* Discuss the project and pick a name for your App.
* Agree on roles for every team member. (add this as ticket on trello)
* Review sample group norms and establish your own. (add this as a ticket on trello)
* Start working on Wireframes. (break down an add as tickets on trello)
  * https://wireframe.cc/
  * https://www.draw.io/
  * Drawing with pen and paper. Upload photo of drawing to trello.
* Break down the project into 7-10 **major tasks**. Add them as tickets/cards to trello board.
* Break down **major tasks** into sub(smaller) tasks. Add them as tickets/cards to trello board.
* Before starting to **code** your team have to get signed off by an instructor on your initial tickets on your trello board, wireframes, group roles and group norms. To get signed off tag us (Wynter, JR and Alejo) on a trello ticket called `Get sign off` we will comment on the ticket whether you are ready to go or need to rework things.



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
