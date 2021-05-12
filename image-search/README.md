Image Search Abstraction Layer
=====================

[FCC's Image Search Abstraction Layer project challenge](https://www.freecodecamp.com/challenges/image-search-abstraction-layer):

1. Objective: Build a full stack JavaScript app that allows you to search for images like this: https://cryptic-ridge-9197.herokuapp.com/api/imagesearch/lolcats%20funny?offset=10 and browse recent search queries like this: https://cryptic-ridge-9197.herokuapp.com/api/latest/imagesearch/. Then deploy it to Heroku.

2. Note that for each project, you should create a new GitHub repository and a new Heroku project. If you can't remember how to do this, revisit https://freecodecamp.com/challenges/get-set-for-our-api-development-projects.

3. Here are the specific user stories you should implement for this project:

4. User Story: I can get the image URLs, alt text and page urls for a set of images relating to a given search string.

5. User Story: I can paginate through the responses by adding a ?offset=2 parameter to the URL.

6. User Story: I can get a list of the most recently submitted search strings.

[Demo at Heroku](https://rocky-plateau-99907.herokuapp.com/)

### Image Search API

We'll be using [Imgur API](https://api.imgur.com/endpoints) for image search. So we'll get our Client ID and Secret, and to keep things safe and clean set them up as environment variables (at least the Client ID, we'll need it). For example:
```
export IMGUR_CLIENT_ID="YOUR_IMGUR_CLIENT_ID_HERE"
```
and access it as
```
var imgurClientID = process.env.IMGUR_CLIENT_ID;
```
in your code.

**Dont's forget** to set it up on Heroku as well:
```
heroku config:set IMGUR_CLIENT_ID="YOUR_IMGUR_CLIENT_ID_HERE"
```

### Usage

```
git clone https://github.com/van100j/image-search.git
cd image-search/
npm install
npm start
open http://localhost:5000
```
