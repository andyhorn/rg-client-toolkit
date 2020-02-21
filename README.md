# Red Giant Client Toolkit
This app contains a large suite of tools for managing the licenses and configuration of client machines using Red Giant floating licenses, including:
* Port Scanner
  - Attempts to make a TCP connection on up to three ports using the server IP/Hostname
  - Will graphically display the success/failure status for each port
  - Useful for determining if the server is behind a firewall or is open for connections
* License Scanner
  - The client license file must be configured correctly and in the exact right location to work properly
  - Verifies the license file is a '.lic' file and not a '.config' file
  - Verifies the presence, spelling, and capitalization of the 'licenses' directory
  - Offers one-click fixes for the above errors
* License Creator
  - Simplifies the setup process by allowing a user to create a new copy of the client license file
  - Enter the server's IP/Hostname and the main RLM port number
  - Generates the correct filename and default location for the platform (Windows vs. macOS)
* Serial Removal
  - An encapsulated utility that removes all Red Giant serial numbers registered in suite installers
  - Does not remove serial numbers registered via the Red Giant Application Manager
  - Prompts for Administrator rights before running to ensure proper removal of serial data
* Other Utilities
  - Simple switches allow you to set the current system as a "Render-Only" machine or to enable/disable client logging
  - Reads/writes to the local filesystem to modify the 'rlm-options.txt' file

## Project setup
To run the development project, first install the dependencies using:
```
npm install
```

### Compiles and hot-reloads for development
This app uses and requires the Electron base to run, it will not operate as a stand-alone Vue.js app
```
npm run electron:serve
```

### Compiles and minifies for production
```
npm run electron:build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
