# Hermes
Project Management system written in MERN stack.

## Table of contents
[Description](#description)<br />
[Technology stack](#technology-stack)<br />
[Architecture](#architecture)<br />
[Project structure](#project-structure)<br />
[Security](#security)<br />
[Features](#features)<br />
[Installation](#installation)<br />
[Showcase](#showcase)<br />
[TODO](#todo)<br />
[Licence](#licence)<br /><br />

## Description
Hermes is an open-source web application providing a set of tools designed to perform tasks in the Project Management field. Users can organize into companies, organizational units and teams in order to perform various tasks related to predefined projects.

One of the key features of Hermes is a complete isolation of company's ecosystem which allows its users to keep their confidential data safe. In other words, users can only access information related directly to their company/organizational unit/team.

## Technology stack
Hermes was created in MERN stack which incorporates the following technologies:
- MongoDB
- ExpressJS
- React
- Node.js

## Architecture
Hermes is a full-stack application consisting of separate client and server sub services. Communication between these services is provided by REST API implemented on backend and is actively used in various CRUD-related operations and is a core element of Token Based Authentication. 

## Project structure
### Client
- `/public` - root directory for serving static content<br />
  - `/images` - directory for public images served by client application<br />
- `/src` - core directory in client project<br />
  - `/assets` - directory storing CSS stylesheets, custom scripts etc.<br />
    - `/css` - CSS styles directory<br />
  - `/components` - root directory of all React class based components<br />
  - `/middleware` - contains client-side handler for Token Based Authentication along with translation middleware responsible for managing `LocalStorage`<br />
  - `/services` - currently stores only `i18n` translation service<br />
  - `/translations` - root directory of translations<br />
    - `/pl` - Polish translation via `common.json`<br />
    - `/en` - English translation via `common.json`<br /><br /><br />

<p align="center">
  <img src="./showcase/component-hierarchy.png" width="650" alt="Component hierarchy in client app" />
</p>
<p align="center">
  <em>Figure 1. Component hierarchy in client app</em>
</p><br />

### Server
- `/public` - root directory for serving static content<br />
  - `/images` - directory for public images served by server application<br />
- `/src` - core directory in server project<br />
  - `/config` - currently stores only `Passport` config with definition of `Local`/`Jwt` strategies<br />
  - `/middleware` - contains authentication, data validation and error handlers<br />
  - `/models` - implements data models used by `mongoose` library<br />
  - `/routes` - root directory of REST API routes<br />
    - `/protected` - routes protected by authentication middleware<br />
    - `/public` - routes publicly accessible without authentication<br />
  - `/services` - root directory of services related to user registration and Atlas cloud<br />
    - `/db` - MongoDB transactional services<br/>

## Security
Hermes uses a session-less, Token Based Authentication system. It consists of several aspects:
- it uses a pair of JWT tokens - `access` and `refresh`
- every route stored in `/routes/protected` directory has applied authentication middleware
- `LocalStrategy` handles Basic Auth employed in `/auth/login` route
- `JwtStrategy` handles access to restricted resources via Bearer Token
- Sensitive information like DB url, username or password are stored in environmental variables and are managed by `dotenv` library. For security reasons, `.env` file is disconnected from Git version control system.
- both in registration and authentication flow, password is encrypted by `bcrypt` library and its hash is stored in Atlas cloud.<br />

<p align="center">
  <img src="./showcase/auth-flow.png" width="650" alt ="user authentication flow" />
</p>
<p align="center">
  <em>Figure 2. User Authentication Flow</em>
</p><br />
  
### Access and Refresh tokens

<p align="center">
  <img src="./showcase/access-refresh-tokens.png" width="650" alt="access and refresh token" />
</p>
<p align="center">
  <em>Figure 3. Access/Refresh token characteristics and differences</em>
</p>
