# [austinwilliams.dev](https://au-williams.github.io)

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

<summary>🧩 /src/components/about-button/</summary>

### [🧩 /src/components/about-button/](https://github.com/au-williams/au-williams.github.io/blob/master/src/components/about-button)

This component manages the about button. It initializes on a timer, animates its translation on a loop, and reacts to the clients mouseover events. When mousing over, the arrow quickly expands to its furthest animation point.

🗃️ `Redux state` [/src/redux/about-button-slice.ts](https://github.com/au-williams/au-williams.github.io/blob/master/src/redux/about-button-slice.ts)

</details>

<details>

<summary>🧩 /src/components/code-block/</summary>

### [🧩 /src/components/code-block/](https://github.com/au-williams/au-williams.github.io/blob/master/src/components/code-block)

This component is the final component in the [code-window](#-srccomponentscode-window) component tree. It's responsible for rendering the size, shape, and color of an element that resembles a block of code. It's encapsulated by the [code-line](#-srccomponentscode-line) component.

🗃️ `Redux state` [/src/redux/code-block-slice.ts](https://github.com/au-williams/au-williams.github.io/blob/master/src/redux/code-block-slice.ts)

</details>

<details>

<summary>🧩 /src/components/code-line/</summary>

### [🧩 /src/components/code-line/](https://github.com/au-williams/au-williams.github.io/blob/master/src/components/code-line)

This component is the middle component of the [code-window](#-srccomponentscode-window) component tree. It's responsible for encapsulating one-to-many [code-block](#-srccomponentscode-block) components and reacting to the clients mouseover events.

🗃️ `Redux state` [/src/redux/code-line-slice.ts](https://github.com/au-williams/au-williams.github.io/blob/master/src/redux/code-line-slice.ts)

</details>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->

<details>

<summary>🧩 /src/components/code-window/</summary>

### [🧩 /src/components/code-window/](https://github.com/au-williams/au-williams.github.io/blob/master/src/components/code-window)

This component is the start of the [code-window](#-srccomponentscode-window) component tree. It's responsible for updating updatable [code-block](#-srccomponentscode-block) components encapsulated by [code-line](#-srccomponentscode-line) components, or generating a new code-line component that is based on the previous code-line contents to adhere to the constraints defined in [/src/config/app-config.ts](#%EF%B8%8F-srcconfigapp-configts).

🗃️ `Redux state` [/src/redux/code-window-slice.ts](https://github.com/au-williams/au-williams.github.io/blob/master/src/redux/code-window-slice.ts)

</details>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->

<details>

<summary>🧩 /src/components/content-section/</summary>

### [🧩 /src/components/content-section/](https://github.com/au-williams/au-williams.github.io/blob/master/src/components/content-section)

[TODO]

</details>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->

<details>

<summary>🧩 /src/components/hover-tooltip/</summary>

### [🧩 /src/components/hover-tooltip/](https://github.com/au-williams/au-williams.github.io/blob/master/src/components/hover-tooltip)

[TODO]

</details>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->

> [!TIP]
> The Redux-managed state for these components is found in [`/src/redux/`](https://github.com/au-williams/au-williams.github.io/blob/master/src/redux). Check the component details above for their associated slice file names if they exist. 🗃️

## Settings

<details>

<summary>🛠️ /src/config/app-config.ts</summary>

### [🛠️ /src/config/app-config.ts](https://github.com/au-williams/au-williams.github.io/blob/master/src/config/app-config.ts)

This file contains the settings variables for logic across the web app.

</details>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->
<!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -->

<details>

<summary>🛠️ /src/styles/_variables.module.scss</summary>

### [🛠️ /src/styles/_variables.module.scss](https://github.com/au-williams/au-williams.github.io/blob/master/src/styles/_variables.module.scss)

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
