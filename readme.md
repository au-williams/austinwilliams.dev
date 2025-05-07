# [au-williams.github.io](https://au-williams.github.io)

My personal web app made with the [React](https://react.dev/) front-end and [Redux](https://redux.js.org/) state manager. It's built using [Vite](https://vite.dev/) and deployed to [GitHub Pages](https://pages.github.com/) — accessible online at [https://austinwilliams.dev/](https://austinwilliams.dev/). 🚀

<img style="height: 75px" src="src/assets/images/readme_logos.png"/>

> [!NOTE]
> This web app is accessible at the [`.net`](https://austinwilliams.net) and [`.org`](https://austinwilliams.org) top-level domains too! They forward to the [`.dev`](https://austinwilliams.dev) domain. But the `.com` domain is owned by an advertising agency which keeps it out of my reach for this project. 🌠

This project can be started with [npm](https://www.npmjs.com/):

```bash
$ npm run dev
```

And be deployed to [GitHub Pages](https://pages.github.com/):

```bash
$ npm run deploy
```

<!--
  TODO: scss modules   https://github.com/css-modules/css-modules
  https://stackoverflow.com/questions/60735091/whats-the-main-diffrence-style-scss-vs-style-module-scss
-->

> [!IMPORTANT]
> Style sheets are made with Sass and compile into CSS on build. Most Sass files are named `*.module.scss` to use CSS modules which are CSS files that have their class names and animation names scoped locally by default. You can read more about CSS modules here: https://stackoverflow.com/a/60736310/. 🔍

## Components

<details>

<summary>🧩 components/about-button</summary>

### [🧩 components/about-button](https://github.com/au-williams/au-williams.github.io/blob/master/src/components/about-button)

[TODO]

</details>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->

<details>

<summary>🧩 components/code-block</summary>

### [🧩 components/code-block](https://github.com/au-williams/au-williams.github.io/blob/master/src/components/code-block)

[TODO]

</details>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->

<details>

<summary>🧩 components/code-line</summary>

### [🧩 components/code-line](https://github.com/au-williams/au-williams.github.io/blob/master/src/components/code-line)

[TODO]

</details>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->

<details>

<summary>🧩 components/code-window</summary>

### [🧩 components/code-window](https://github.com/au-williams/au-williams.github.io/blob/master/src/components/code-window)

[TODO]

</details>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->

<details>

<summary>🧩 components/content-section</summary>

### [🧩 components/content-section](https://github.com/au-williams/au-williams.github.io/blob/master/src/components/content-section)

[TODO]

</details>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->

<details>

<summary>🧩 components/hover-tooltip</summary>

### [🧩 components/hover-tooltip](https://github.com/au-williams/au-williams.github.io/blob/master/src/components/hover-tooltip)

[TODO]

</details>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->

## Settings

<details>

<summary>🛠️ config/app-config.ts</summary>

### [🛠️ config/app-config.ts](https://github.com/au-williams/au-williams.github.io/blob/master/src/config/app-config.ts)

This file contains the settings variables for logic across the web app.

</details>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->

<details>

<summary>🛠️ styles/_variables.module.scss</summary>

### [🛠️ styles/_variables.module.scss](https://github.com/au-williams/au-williams.github.io/blob/master/src/styles/_variables.module.scss)

This file contains the settings variables for styles across the web app. I prefer building my views so everything is in place before fine-tuning styles by eye so most notable properties will be found here such as base colors, durations, sizes, and more.

This file name starts with an underscore to make use of Sass's partial functionality, which are files containing snippets of CSS that can be included in other Sass files. The underscore lets Sass know that the file is only a partial file and that it should <ins>not</ins> be generated into a CSS file. Read more here: https://sass-lang.com/guide/#partials

</details>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->



<!-- Uses React
Uses Google Analytics (ReactGA)

# Design goals

# Starting the development environment

> $ npm start

# Deploying

> $ npm run deploy

# components

"deploy": "gh-pages -d build" -->
