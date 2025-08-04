![Aithor_App_Logo](public/logo.png)
# It is an android application created by the react native cli 
# latest running version of Aithor - v 1.0.0

# Code to run in VS Code Cli or Window Powershell
# Deleting previous cache and junks 
- Remove-Item -Recurse -Force android\build
- Remove-Item -Recurse -Force android\\.gradle
- npx react-native clean (optional)

# Action from the project root directory

# Gradlew cleaning
- cd android 
- ./gradlew clean
- cd..

# Creating a debug app to test the app
- npx react-native run-android
- adb reverse tcp:8081 tcp:8081 ( In another terminal )

# For building the release apk or app 
- cd android
- ./gradlew assembleRelease

# For re run the metro 
- npm start

# For developer use only - 
# Changing the app version and codebase
- go to path -
- android/app/build.gradle
- change the version name (for version)
- change the version code (for codebase)

