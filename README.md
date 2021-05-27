# Hermes
Project Management system written in MERN stack.<br /><br />

## Table of contents
[Description](#description)<br />
[Features](#features)<br />
[Technology stack](#technology-stack)<br />
[Architecture](#architecture)<br />
[Project structure](#project-structure)<br />
[Security](#security)<br />
[User Interface examples](#user-interface-examples)<br />
[TODO](#todo)<br />
[Licence](#licence)<br /><br />

## Description
Hermes is an open-source web application providing a set of tools designed to perform tasks in the Project Management field. Users can organize into companies, organizational units and teams in order to perform various tasks related to predefined projects.

One of the key features of Hermes is a complete isolation of company's workspace which allows its users to keep their confidential data safe. In other words, users can only access information related directly to their company/organizational unit/team.<br /><br />

## Features
- re-create your company's structure in Hermes by organizing your employees into organizational units and teams
- create and manage your projects as well as their related tasks via simple, straightforward User Interface
- keep your company's data safe from unfair competition by isolating your workspace<br /><br /><br />

## Technology stack
Hermes was created in MERN stack which incorporates the following technologies:
- MongoDB
- ExpressJS
- React
- Node.js<br /><br />

## Architecture
Hermes is a full-stack application consisting of separate client and server sub services. Communication between these services is provided by REST API implemented on backend and is actively used in various CRUD-related operations and is a core element of Token Based Authentication. 

<p align="center">
  <img src="./showcase/client-server-communication-flow.png" width="650" alt="client-server communication flow" />
</p>
<p align="center">
  <em>Figure 1. Client-Server communication Flow within Hermes</em>
</p><br /><br />

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
  <em>Figure 2. Component hierarchy in client app</em>
</p><br /><br />

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
    - `/db` - MongoDB transactional services<br/><br /><br />

## Security
Hermes uses a session-less, Token Based Authentication system. It consists of several aspects:
- it uses a pair of JWT tokens - `access` and `refresh`
- every route stored in `/routes/protected` directory has applied authentication middleware ensuring that user requesting specific resource is authenticated
- `LocalStrategy` handles Basic Auth employed in `/auth/login` route
- `JwtStrategy` handles access to restricted resources via Bearer Token
- Sensitive information like DB url, username or password are stored in environmental variables and are managed by `dotenv` library. For security reasons, `.env` file is disconnected from Git version control system.
- both in registration and authentication flow, password is encrypted by `bcrypt` library and its hash is stored in Atlas cloud.<br /><br />

<p align="center">
  <img src="./showcase/auth-flow.png" width="650" alt ="user authentication flow" />
</p>
<p align="center">
  <em>Figure 3. User Authentication Flow</em>
</p><br />

<p align="center">
  <img src="./showcase/access-refresh-tokens.png" width="650" alt="access and refresh token" />
</p>
<p align="center">
  <em>Figure 4. Access/Refresh token characteristics and differences</em>
</p><br /><br /><br />

## User Interface examples
<table>
  <tr>
    <td><img src="./showcase/dashboard.PNG" height="250" alt="dashboard" /><br /><em>Figure 5. Dashboard view</em></td>
    <td><img src="./showcase/team-overview.PNG" height="250" alt="team overview" /><br /><em>Figure 6. Team overview</em></td>
  </tr>
  <tr>
    <td><img src="./showcase/create-project.PNG" height="250" alt="create new project" /><br /><em>Figure 7. Create new project</em></td>
    <td><img src="./showcase/project-overview.PNG" height="250" alt="project overview" /><br /><em>Figure 8. Project overview</em></td>
  </tr>                                                                           
</table><br /><br />


## TODO

## Licensing
Hermes is being distributed under GPL-3.0 licence.<br />
https://www.gnu.org/licenses/gpl-3.0.html
