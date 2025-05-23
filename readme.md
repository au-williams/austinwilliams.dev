# [austinwilliams.dev](https://austinwilliams.dev/)

My personal web app made with the [React](https://react.dev/) front-end and [Redux](https://redux.js.org/) state manager. It's built using [Vite](https://vite.dev/) and deployed to [GitHub Pages](https://pages.github.com/) via [Cloudflare](https://www.cloudflare.com/) and [GitHub Actions](https://github.com/au-williams/austinwilliams.dev/actions) CI/CD — accessible online at [https://austinwilliams.dev/](https://austinwilliams.dev/). ⚡🚀

<img style="height: 75px" src="src/assets/images/readme_logos.png"/>

> [!NOTE]
> This web app is accessible at the [`.net`](https://austinwilliams.net) and [`.org`](https://austinwilliams.org) top-level domains too! They redirect to the [`.dev`](https://austinwilliams.dev) domain. But the `.com` domain is owned by an advertising agency which keeps it out of my reach for this project. 🌠

This project can be started with [npm](https://www.npmjs.com/):

```bash
$ npm start
```

<!-- And be deployed to [GitHub Pages](https://pages.github.com/):

```bash
$ npm run deploy
``` -->

<!--
  TODO: scss modules   https://github.com/css-modules/css-modules
  https://stackoverflow.com/questions/60735091/whats-the-main-diffrence-style-scss-vs-style-module-scss
-->

> [!IMPORTANT]
> Style sheets are made with [Sass](https://sass-lang.com/) and compile into CSS on build. Most Sass files are named `*.module.scss` to use CSS modules which are CSS files that have their class names and animation names scoped locally by default. You can read more about CSS modules here: https://stackoverflow.com/a/60736310/. 🔍

## Components

<!-- about-button component -->

<details>

<summary>🧩 /src/components/about-button/</summary>

### [🧩 /src/components/about-button/](src/components/about-button)

This component manages the about button. It initializes on a timer, animates its translation on a loop, and reacts to the clients mouseover events. When mousing over, the arrow quickly expands to its furthest animation point.

🗃️ `Redux state` [/src/redux/about-button-slice.ts](src/redux/about-button-slice.ts)

</details>

<!-- code-block component -->

<details>

<summary>🧩 /src/components/code-block/</summary>

### [🧩 /src/components/code-block/](src/components/code-block)

This component is the final component in the [code-window](#-srccomponentscode-window) component tree. It's responsible for rendering the size, shape, and color of an element that resembles a block of code. It's encapsulated by the [code-line](#-srccomponentscode-line) component.

🗃️ `Redux state` [/src/redux/code-block-slice.ts](src/redux/code-block-slice.ts)

</details>

<!-- code-line component -->

<details>

<summary>🧩 /src/components/code-line/</summary>

### [🧩 /src/components/code-line/](src/components/code-line)

This component is the middle component of the [code-window](#-srccomponentscode-window) component tree. It's responsible for encapsulating one-to-many [code-block](#-srccomponentscode-block) components and reacting to the clients mouseover events.

🗃️ `Redux state` [/src/redux/code-line-slice.ts](src/redux/code-line-slice.ts)

</details>

<!-- code-window component -->

<details>

<summary>🧩 /src/components/code-window/</summary>

### [🧩 /src/components/code-window/](src/components/code-window)

This component is the start of the [code-window](#-srccomponentscode-window) component tree. It's responsible for updating updatable [code-block](#-srccomponentscode-block) components encapsulated by [code-line](#-srccomponentscode-line) components, or generating a new code-line component that is based on the previous code-line contents to adhere to the constraints defined in [/src/config/app-config.ts](#%EF%B8%8F-srcconfigapp-configts). 🛠️

🗃️ `Redux state` [/src/redux/code-window-slice.ts](src/redux/code-window-slice.ts)

</details>

<!-- content-section component -->

<details>

<summary>🧩 /src/components/content-section/</summary>

### [🧩 /src/components/content-section/](src/components/content-section)

This component manages the content encapsulated by the `<section>` tags. It animates its initializion on page scroll, animates each of its child articles during their separate initializations, and reacts to the clients mouseover events. When mousing over certain elements, such as the emoji images, they will respond with a short animation.

🗃️ `Redux state` [/src/redux/content-section-slice.ts](src/redux/content-section-slice.ts)

</details>

<!-- hover-tooltip component -->

<details>

<summary>🧩 /src/components/hover-tooltip/</summary>

### [🧩 /src/components/hover-tooltip/](src/components/hover-tooltip)

This component manages the tooltip that displays as a pop-up when hovering above text content. It appears on the mouseover event and disappears on the mouseout event. Tooltip content includes an image and some text which is typically used to display the destination of an outgoing anchor tag.

🗃️ `Redux state` [/src/redux/hover-tooltip-slice.ts](src/redux/hover-tooltip-slice.ts)

</details>

<!-- page-redirect component -->

<details>

<summary>🧩 /src/components/page-redirect/</summary>

### [🧩 /src/components/page-redirect/](src/components/page-redirect)

This component manages redirecting the page using the React Router library. It's meant to allow analytics before redirect, and stub out future enhancements, such as displaying the URL you are redirecting to with a cancellation timer. Redirected routes are configurable in [/src/config/app-config.ts](#%EF%B8%8F-srcconfigapp-configts). 🛠️

</details>

> [!IMPORTANT]
> The [Redux](https://redux.js.org/) state for these components is found in [/src/redux/](src/redux). Expand the component details above to display their associated file names, if any exist, which are created using [Redux Toolkit](https://redux-toolkit.js.org/). 🗃️

## Settings

<details>

<!-- app-config.ts settings -->

<summary>🛠️ /src/config/app-config.ts</summary>

### [🛠️ /src/config/app-config.ts](src/config/app-config.ts)

This file contains the settings variables for logic across the web app, most of which belongs to the code generation algorithm. My philosophy is that art imitates reality - but only to an extent - because reality was not designed to be asthetically pleasant. Generation settings include how many code lines are visible, how long a code line can be, how far the indentation can expand, etc. Settings pertaining to [Google Analytics](https://marketingplatform.google.com/about/analytics/) can be found here too.

</details>

<!-- _variables.module.scss settings -->

<details>

<summary>🛠️ /src/styles/_variables.module.scss</summary>

### [🛠️ /src/styles/_variables.module.scss](src/styles/_variables.module.scss)

This file contains the settings variables for styles across the web app. I prefer building my views so everything is in place before fine-tuning styles by eye so most design properties will be found here such as base colors, durations, sizes, and more.

This file name starts with an underscore to make use of [Sass](https://sass-lang.com/)'s partial functionality, which are files containing snippets of CSS that can be included in other Sass files. The underscore lets Sass know that the file is only a partial file and that it should <ins>not</ins> be generated into a CSS file. Read more here: https://sass-lang.com/guide/#partials

</details>
