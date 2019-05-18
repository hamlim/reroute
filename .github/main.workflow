workflow "Build, Test, and Publish" {
  on = "push"
  resolves = ["Publish"]
}

action "Setup" {
  uses = "actions/npm@master"
  args = "install"
}

action "Build" {
  uses = "actions/npm@master"
  args = "build"
}

action "Bundle" {
  needs = "Build"
  uses = "actions/npm@master"
  args = "bundle"
}

action "Test" {
  needs = "Setup"
  uses = "actions/npm@master"
  args = "test"
}



action "Publish" {
  needs = "Bundle"
  uses = "actions/npm@master"
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}
