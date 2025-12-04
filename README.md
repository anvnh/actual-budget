# Actual Budget

A local-first personal finance system.

## Development Setup

This guide provides instructions for setting up the development environment for Actual Budget on different operating systems.

### Prerequisites

- [Node.js](https://nodejs.org/) (version >= 22)
- [Yarn](https://yarnpkg.com/) (version >= 4)

### General Instructions (Linux, macOS, Windows)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/actualbudget/actual.git
    cd actual
    ```

2.  **Install dependencies:**
    ```bash
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    yarn start:server-dev
    ```
    This will start the backend server and the frontend client in development mode. The application will be available at `http://localhost:3000`.

### NixOS

If you are on NixOS, you might encounter an error related to the shebang of the scripts. The scripts in this project are written in bash and some of them might have a hardcoded shebang `#!/bin/bash`. On NixOS, `bash` is not located at `/bin/bash`.

To fix this, you need to change the shebang of the following scripts to `#!/usr/bin/env bash` and add `set -e` on the next line:

- `packages/plugins-service/bin/build-service-worker`
- `packages/loot-core/bin/build-browser`
- `packages/loot-core/bin/copy-migrations`
- `bin/package-browser`
- `bin/package-electron`

After fixing the shebangs, you can follow the general instructions to run the project.