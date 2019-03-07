# Eurotas

Framework for moving starter code from the [Sparta Global Curriculum](https://github.com/dannysmith/curriculum-newdev) to the [Starter Code](https://github.com/dannysmith/starter-code) repo.

## What it does

Eurotas uses Github webkhooks to deploy code pushed to one repository (the original) automatically in another (the destination). It is currently configured to work best for the purposes of Sparta Global and our curriculum system, but could easily be adapted for use in other applications. The setup requires prior knowledge of Heroku and the Heroku toolbelt.

## Before you start

Ensure the following:

- Your github details have access to both the original and destination repositories, which both already exist
- You have a valid current Github API key (can easily be generated like [this](https://github.com/blog/1509-personal-api-tokens))
- You have a Heroku account and the Heroku toolbelt installed.

```shell
GITHUB_AUTH_TOKEN=
GITHUB_DESTINATION_REPO=
GITHUB_USERNAME=
GITHUB_PASSWORD=
GITHUB_EMAIL=
GITHUB_NAME=
EUROTAS_FILEMAP=
GITHUB_WEBHOOK_SECRET=
```

## Set up

1. Clone down this repo, then create a new app using that repo with `heroku create`
2. Push this app to Heroku using `git push heroku master`
3. Add [this buildpack](https://github.com/zeke/github-buildpack) using the command `heroku buildpacks:add --index 1 https://github.com/zeke/github-buildpack`
4. Using the `heroku config:set` command, add the following config variables to your Heroku app:

  - GITHUB_AUTH_TOKEN, your Github API key
  - GITHUB_DESTINATION_REPO, the repo to push to in the format \

    <username\>/\<repo name\="">
    </repo></username\>

  - GITHUB_NAME, the name connected to your Github account

  - GITHUB_EMAIL, the email address connected to your Github account
  - GITHUB_USERNAME, your Github username
  - GITHUB_PASSWORD, your Github password
  - DESTINATION_DIRECTORY, an optional parameter for selecting a destination directory path. It should be either the name of a directory, or a path in the format \

    <directory\>/\<nested directory\=""> to the necessary depth.</nested></directory\>

  - GITHUB_WEBHOOK_SECRET, the secret you entered when you set up your WebHook on GitHub.

5. On Github, in the Settings tab of the original repo, add a webhook with the url of the Heroku app you have created and an appropriate secret.

Done! Whenever a push is made to the original repo, the folder structure will be copied into the second repo. Nifty!

## Copyright

Copyright 2016 testing Circle Ltd. All Rights Reserved.
