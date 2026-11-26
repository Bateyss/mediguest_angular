# MediguestAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.13.

# Install & Configure Angular static deploy in a ssr project

### Configure build in angular.json into configurations

baseHref=url where project page will deploy, changes the index context

OutputMode=static as static index.html page

Disable srr with SSR=false

```json
    "github-pages": {
        "baseHref": "https://bateyss.github.io/mediguest_angular/",
        "outputMode": "static",
        "server": false,
        "ssr": false
    }
```
[See angular.json](/angular.json#L59)

Add configuration for ng deploy in architect

```json
    "deploy": {
        "builder": "angular-cli-ghpages:deploy"
    }
```
[See angular.json](/angular.json#L82)

Next configure package.json add into scripts:

```json
{
    "deploy-page": "ng build --configuration github-pages && npx angular-cli-ghpages --dir=dist/mediguest_angular/browser",
    "deploy-ng-gh-pages": "ng deploy --repo=https://github.com/Bateyss/mediguest_angular.git --name=\"bateyss\" --base-href= mediguest_angular/"
}
```

[See package.json](/package.json#L10)

### Now have 2 way to deploy the page in github pages with the bash

## Way 1: angular deploy (github auto configured)

```bash
npm deploy-ng-gh-pages
```

## Way 2: npm deploy with angular-cli-ghpages lib

```bash
npm deploy-page
```

the previous configuration, deploy this angular project as github static page in:

[mediguest_angular](https://bateyss.github.io/mediguest_angular/)

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
