// External requirements
var express = require("express");
var rp = require("request-promise");
var util = require("util");
var exec = require("child_process").exec;

// Initialize app
var app = express();

// Internal requirements
var config = require("./config/config");
var createHandler = require("./config/webhookHandler");

// Router
var router = express.Router();
router.get('/', landingPage);
router.post('/', handle);
app.use('/', router);

// App listens on port
app.listen(config.port, function() {
  console.log("Listening on " + config.port);
  console.log("===============================================");
});

// Webhook handler
var handler = createHandler({ path: "/", secret: config.github.secret});

handler.on('push', function (event) {
  var repo = event.payload.repository.full_name;
  var message = event.payload.head_commit.message;
  console.log("\n" + message + "\n");
  return runBash(repo, message);
});

function handle(req, res) {
  return handler(req, res, function (err) {
    console.log(err);
  });
}

// Bash command for heroku
function runBash(origin, message) {
  var repo1 = origin.split("/")[1],
      repo2 = config.github.destination.split("/")[1],
      username = config.github.username,
      password = config.github.password,
      email = config.github.email,
      name = config.github.name,
      dest = config.github.destination,
      fileMap = config.github.fileMap,
      userPass = username + ":" + password,
      temp = "temp" + Date.now().toString();

  var bashScript = "mkdir " + temp + " &&" +
                   " cd " + temp + " &&" +
                   " git clone https://" + userPass + "@github.com/" + origin + ".git &&" +
                   " cd " + repo1 + " &&" +
                   ' git config user.email "' + email + '" &&' +
                   ' git config user.name "' + name + '" &&' +
                   " git remote rm origin &&" + moveFiles(fileMap) +
                   " git add . &&" +
                   " git commit -m '" + message + "' &&" +
                   " cd .. &&" +
                   " git clone https://" + userPass + "@github.com/" + dest + ".git &&" +
                   " rm -rf "+ repo2 +"/* &&" +
                   " cp -R " + repo1 + "/* " + repo2 + " &&" +
                   " cd " + repo2 + " &&" +
                   ' git config user.email "' + email + '" &&' +
                   ' git config user.name "' + name + '" &&' +
                   " git add -A &&" +
                   " git commit -m '" + message + "' &&" +
                   ' echo "machine github.com login ' + username + ' password ' + password + '" >> ~/.netrc &&' +
                   " git push origin &&" +
                   " cd .. &&" +
                   " cd .. &&" +
                   " rm -rf " + temp;
  return exec(bashScript, function (stderr, output, error) {
    console.log('output: ' + output);
    console.log('stderr:' + stderr);
    if (error !== null) console.log('exec error: ' + error);
    console.log("=========================================");
  });
}

function moveFiles(fileMap) {
  if (!fileMap) return "";
  var dirs = fileMap.split("/");
  var array = [];
  for (var i = 0; i < dirs.length; i++) {
    if (i > 0) {
      var currentPath = [];
      for (var j = i; j >= 0; j--) {
        currentPath.unshift(dirs[j] + "/");
      }
      array.push("mkdir " + currentPath.join("") + " && ");
    } else {
      array.push("mkdir " + dirs[i] + " && ");
    }
  }
  var string = array.join(" ");
  return string + "mv * " + currentPath.join("") + " || true && ";
}

// Landing page for GET request
function landingPage(req, res) {
  res.send({ message: "This app is designed for a POST request only."});
}

// var filewalker = require('filewalker');
// var path = require('path');
// var pry = require('pryjs');
// var exec = require('child_process').exec;

// var findStarterFiles = function(rootDir, fileMap, callback) {
//   results = []
//   filewalker(rootDir)
//     .on('dir', function(f) {
//       match = f.match(fileMap)
//       if (match) {
//         results.push({
//           path: path.resolve(rootDir, match[0]),
//           captures: match.slice(1)
//         })
//       }
//     })
//     .on('error', function(err) {
//       console.error(err);
//     })
//     .on('done', function() {
//       callback(results);
//     })
//   .walk();
// }

// var copyFiles = function(sourceRootDir, resultsArray) {
//   command = ""
//   for (p in resultsArray) {
//     command += "mkdir -p " + path.resolve(sourceRootDir, resultsArray[p].captures.join('/')) + " && cp -rf " + resultsArray[p].path + "/ $_ && "
//   }
//   command += "echo 'Done Copying'"
//   exec(command, function(error, stdout, stderr) {
//     console.log(stdout);
//   });
// }

// var sourceRootDir = path.resolve(__dirname, 'curriculum-newdev')
// var destinationRootDir = path.resolve(__dirname, 'starter-code')
// var fileMap = /trainer-guides\/([^\.].*)\/([0-9]+-.+)\/exercises\/(.+)_startercode$/

// findStarterFiles(sourceRootDir, fileMap, function(res) {
//   copyFiles(destinationRootDir, res)
// });

