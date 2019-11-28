# Innovalab Back-end

Follow this steps to run the app:

* Execute ```npm install``` to install all the dependecies.
* Configure the following environment variables:
    * db_host_dev
    * db_host_prod
    * db_password
    * db_name_dev
    * db_name_prod
    * db_user_dev
    * db_user_prod
    * DEBUG
    * NODE_ENV
    * jwtPrivateKey
* Execute ```npm run dev``` to run the app in development mode. To run in production
first build the app with ```npm build``` then run the index with ```node index```.