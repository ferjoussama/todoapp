# TodoApp

React Native and Laravel for the backend.

![Demo GIF](https://github.com/ferjoussama/todoapp/blob/main/Animation.gif?raw=true)

## Installation

### Laravel Backend

**Requirements:**

- php 8.2

1. Navigate to the Laravel backend directory: `cd back-end`

2. Copy and configure the environment file: `cp .env.example .env`

4. Install composer dependencies: `composer install`

3. Generate the application key: `php artisan key:generate`

4. Run migrations: `php artisan migrate`

5. Start the Laravel development server: `php artisan serve`

The Laravel backend should be running at http://127.0.0.1:8000.

### React Native App (Android)

**Android Requirements:**

- buildToolsVersion = "34.0.0"
- minSdkVersion = 21
- compileSdkVersion = 34
- targetSdkVersion = 34
- ndkVersion = "25.1.8937393"

1. Clone the repository: `git clone https://github.com/ferjoussama/todoapp.git && cd todoapp && cd front-end-reactnative`

2. Install dependencies: `npm install`

3. Ensure Android Studio is installed and configured, then run the app on an Android emulator or device: `npm run android`

## Usage

1. Execute Laravel job queue for delayed email notifications: `php artisan queue:work`

2. Make sure to modify the .env file in the React Native app for the API endpoint, for example, **http://127.0.0.1:8000/api**

3. Set up a reverse connection between the local machine and an Android device using this command in the React Native app folder: `adb reverse tcp:8000 tcp:8000`

## Information

This app uses **https://mailtrap.io/** for SMTP mail testing.

In case of checking delayed mail notifications, please use these credentials:

- URL: https://mailtrap.io/
- Email: oussamaferj@gmail.com
- Password: **todoapp123++**

