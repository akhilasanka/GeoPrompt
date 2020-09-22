# GeoPrompt

## Steps to run

Preliminary step: clone the repository

- To run backend
  1. Make sure node(.js) is installed in local
  2. Navigate to backend folder in terminal
  3. Execute command 'npm install'
  4. Execute command 'npm start'
     This will start the backend server in http://localhost:3001.
     
- To run frontend
  1.Check if your machine has the following dependencies:
    a. Node (node -v)
    b. npm (npm -v)
  2. Install Android studio application and install atleast one simulator device within Android studio.
  3. Navigate to Frontend folder in terminal.
  4. Execute command 'npm install'
  5. Execute command 'adb -s <device_name> reverse tcp:backend_port tcp:backend_port'
  6. Execute command 'react-native start --port 8081'
  7. Open another tab in the terminal. Execute command 'react-native run-android'
     This will launch the Geoprompt application in the emulator
 
