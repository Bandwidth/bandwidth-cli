# bandwidth_cli
[setup](#Installation)

## Installation
This Bandwidth CLI uses nodeJs version X.X.X. If node is not installed on your computer, visit https://nodejs.org/en/download/ for installation instructions for node.

With node on your machine, install the package globally through npm (or yarn)
```
npm install -g @bandwidth/cli

or

yarn global add @bandwidth/cli
```

log into your bandwidth account by specifying your account id, and your dashboard username and password.

'''
\>bandwidth login
Leaving a field blank will keep it at its previous value.
? Please enter your Bandwidth dashboard username myUsername
? Please enter your Bandwidth dashboard password. This will be securely stored. **********
? Please enter your Bandwidth account ID. 1234567
Your credentials have been saved. You can now start using the CLI.
'''
