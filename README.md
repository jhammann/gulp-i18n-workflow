# Gulp i18n workflow
🌐  A Gulp workflow which creates localized HTML files based on YAML locales and i18n templates.

This workflow has been based on the [node-static-i18n](https://github.com/claudetech/node-static-i18n) utility which is used within a Gulp workflow. It takes a `.yml` file and HTML templates and turns them into a localized HTML file.

### Installation

Clone this repository and execute the following command:

```bash
$ yarn install
```

This installs dependencies needed to run the Gulp workflow.
Then either run the default Gulp task or:

```bash
$ gulp serve
```

To start a webserver that watches for changes to either the `.yml` files or HTML templates. When changes are noticed it executes the `i18n-watch` task which executes the `i18n` task. This creates an `index.html` file in the root of the directory which contains the localized content.

### Specific languages

Naturally this workflow supports multiple languages. The standard languages is English (:gb:). By executing the following command you will start the workflow with Korean (:kr:) localization:

```bash
$ gulp serve --lang=kr
```
