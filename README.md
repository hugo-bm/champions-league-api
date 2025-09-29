# champions-league-api

---

# Brief Description

This project is based on the "Recreating the Champions League API with Node.js and Express" project from the DIO course. This project aims to build an API with comprehensive soccer information, initially using information from the Champions League. The API provides integration with detailed information about teams, players, matches, and standings, ideal for platforms that require fast and reliable access to up-to-date statistics, supporting a fluid and responsive user interface.

![C4 Context Diagram](./docs/context-diagram-c4.svg)

## Project structure

```bash
.
├── .devcontainer
│   ├── devcontainer.json
│   └── dockerfile
├── docker
│   └── dockerfile
├── docs
├── .editorconfig
├── eslint.config.mts
├── .gitignore
├── jest.config.js
├── LICENSE
├── nodemon.json
├── package.json
├── package-lock.json
├── .prettierrc.json
├── README.md
├── src
├── tests
└── tsconfig.json
```

---

# Tech Stack

## Languages ​​and Runtime

- Node.js: An asynchronous, event-driven runtime environment for JavaScript, based on Chrome's V8 engine, enabling the construction of scalable, high-performance applications.

- TypeScript: (version 5.9.2 or higher) - A JavaScript superset that adds static typing and advanced features, providing greater robustness, maintainability, and quality in application development.

## Quality and Productivity Tools

- ESLint: (version 9.11.1) - A linting tool for JavaScript that performs static code analysis, ensuring compliance with best practices and established standards.

- Prettier: (version 3.3.3) - An opinionated code formatter for JavaScript and other languages, promoting a consistent and standardized style.

## Development Tools

- Nodemon: (version 3.1.4) – A tool for monitoring files in Node.js projects, allowing the application to automatically restart whenever changes are detected during development.

## Package Management

- npm: (version 10.7.0 or higher) – The official Node.js package manager, responsible for dependency management and development script automation.

## Container-based Virtualized Environment

- Docker: (version 27.2.0 or higher) – A platform for creating, managing, and running containers, facilitating the deployment and scalability of applications in isolated environments.

---
# How to Run Locally

To run the Staging environment, follow these instructions:

Make sure you are in the Champions-League-Api directory!

```bash
# To verify you are in the correct folder, run:
pwd
# You should see something similar to:
# /home/user/champions-league-api

# To initialize the environment, run the following command:

docker compose -f 'docker/docker-compose.yml' up -d --build

# To access the container, use the following command:

docker exec -it champions-api bash

# To close the environment, run the command:

docker compose -f 'docker/docker-compose.yml' down
```

To run the development environment, use the tutorials presented at: [Developing inside a Container](https://code.visualstudio.com/docs/devcontainers/containers)

---
# Status (🚧 Work in Progress)

This project is currently under development and is not accepting pull requests at this time.  
Suggestions, recommendations, or issue reports should be submitted via **issues**.  
We appreciate your contribution in advance.