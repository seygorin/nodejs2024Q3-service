# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

The app will start on port (4000 as default). You can change the port in .env file.

## Docker

### Prerequisites

- Docker - [Download & Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose - [Download & Install Docker Compose](https://docs.docker.com/compose/install/)

### Running with Docker

1. Build and run the containers:

```bash
docker-compose up -d
```

2. The application will be available at:
- API: http://localhost:4000
- Swagger UI: http://localhost:4000/api

3. View logs:

```bash
docker-compose logs -f
```

4. Stop containers:

```bash
docker-compose down
```

## Documentation

After starting the app, you can explore API documentation:

- Swagger UI: http://localhost:4000/api
- OpenAPI specification is available in files:
  - `doc/api.yaml`
  - `doc/api.json`

The OpenAPI specification files are automatically generated on server startup and saved to the `/doc` folder.

## API Endpoints

The service provides the following endpoints:

### Users

- GET `/user` - get all users
- GET `/user/:id` - get single user by id
- POST `/user` - create user
- PUT `/user/:id` - update user
- DELETE `/users:id` - delete user

### Artists

- GET `/artist` - get all artists
- GET `/artist/:id` - get single artist by id
- POST `/artist` - create artist
- PUT `/artist/:id` - update artist
- DELETE `/artist/:id` - delete artist

### Albums

- GET `/album` - get all albums
- GET `/album/:id` - get single album by id
- POST `/album` - create album
- PUT `/album/:id` - update album
- DELETE `/album/:id` - delete album

### Tracks

- GET `/track` - get all tracks
- GET `/track/:id` - get single track by id
- POST `/track` - create track
- PUT `/track/:id` - update track
- DELETE `/track/:id` - delete track

### Favorites

- GET `/favs` - get all favorites
- POST `/favs/track/:id` - add track to favorites
- DELETE `/favs/track/:id` - remove track from favorites
- POST `/favs/album/:id` - add album to favorites
- DELETE `/favs/album/:id` - remove album from favorites
- POST `/favs/artist/:id` - add artist to favorites
- DELETE `/favs/artist/:id` - remove artist from favorites

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
