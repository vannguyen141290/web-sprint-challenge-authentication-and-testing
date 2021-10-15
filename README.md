# Authentication and Testing Sprint Challenge

**Read these instructions carefully. Understand exactly what is expected _before_ starting this Sprint Challenge.**

This challenge allows you to practice the concepts and techniques learned over the past sprint and apply them in a concrete project. This sprint explored **Authentication and Testing**. During this sprint, you studied **authentication, JSON web tokens, unit testing, and backend testing**. In your challenge this week, you will demonstrate your mastery of these skills by creating **a dad jokes app**.

This is an individual assessment. All work must be your own. All projects will be submitted to Codegrade for automated review. You will also be given feedback by code reviewers on Monday following the challenge submission. For more information on the review process [click here.](https://www.notion.so/lambdaschool/How-to-View-Feedback-in-CodeGrade-c5147cee220c4044a25de28bcb6bb54a)

You are not allowed to collaborate during the sprint challenge.

## Project Setup

- [ ] Run `npm install` to install your dependencies.
- [ ] Run tests locally executing `npm test`.

## Project Instructions

Dad jokes are all the rage these days! In this challenge, you will build a real wise-guy application.

Users must be able to call the `[POST] /api/auth/register` endpoint to create a new account, and the `[POST] /api/auth/login` endpoint to get a token.

We also need to make sure nobody without the token can call `[GET] /api/jokes` and gain access to our dad jokes.

We will hash the user's password using `bcryptjs`, and use JSON Web Tokens and the `jsonwebtoken` library.

### MVP

Your finished project must include all of the following requirements (further instructions are found inside each file):

- [ ] An authentication workflow with functionality for account creation and login, implemented inside `api/auth/auth-router.js`.
- [ ] Middleware used to restrict access to resources from non-authenticated requests, implemented inside `api/middleware/restricted.js`.
- [ ] A minimum of 2 tests per API endpoint, written inside `api/server.test.js`.

**IMPORTANT Notes:**

- Do not exceed 2^8 rounds of hashing with `bcryptjs`.
- If you use environment variables make sure to provide fallbacks in the code (e.g. `process.env.SECRET || "shh"`).
- You are welcome to create additional files but **do not move or rename existing files** or folders.
- Do not alter your `package.json` file except to install extra libraries. Do not update existing packages.
- The database already has the `users` table, but if you run into issues, the migration is available.
- In your solution, it is essential that you follow best practices and produce clean and professional results.
- Schedule time to review, refine, and assess your work and perform basic professional polishing.

## Submission format

- [ ] Submit via Codegrade by pushing commits to your `main` branch on Github.
- [ ] Check Codegrade before the deadline to compare its results against your local tests.
- [ ] Check Codegrade on the days following the Sprint Challenge for reviewer feedback.
- [ ] New commits will be evaluated by Codegrade if pushed _before_ the sprint challenge deadline.

## Interview Questions

Be prepared to demonstrate your understanding of this week's concepts by answering questions on the following topics.

1. Differences between using _sessions_ or _JSON Web Tokens_ for authentication.

- Users send to server credentials which normally contain username and password. The server then verifies the credentials and create a session using sessions library. The session then produces cookies. Server responses to users' request by sending back cookies with session id. Users send the cookie together with whatever request they want to the server and server will response with the right data if cookies is valid.
- JWT is created by using jsonwebtoken Library. It is sent back to users when credential is verified. Users then store the token in local store and do not need to send the token whenever they want to send a request. The front end developers will take care of how to protect certain resoucers by building private routes using token.

2. What does `bcryptjs` do to help us store passwords in a secure manner?

- It hashes the password to make it a total different string that hackers will have difficulties to figure out. Also bcryptjs adds what is called salt which becomes a part of the hashed password string which increase the secure level.

3. How are unit tests different from integration and end-to-end testing?

- unit tests check the correctness of a piece of code in isolation, for example, test if a function works and returns a correct value
- integration tests test how different parts work well together. for example, endpoint testing
- end-to-end testing is used to test the UI. it simulates behavior of users interacting with the webpage, for example, clicking, hovering. It is also used to test data access in database

4. How does _Test Driven Development_ change the way we write applications and tests?

- we build the tests during the development process. Normally, developers would build the webpage and proceed to the testing phase before production. TDD requires testing each small funtionality or pieace of codes first. if the codes are not working well, they would rewrite it. this way, it will be easier to catch and resolve bugs


