# Remote control for Nakka Online (n01)

> https://nakka.com/n01/online/

** !!! DOCUMENTATION IS STILL IN PROGRESS !!! **


## Chrome extension

* Install chrome-extension
   1. More tools -> Extensions
   2. Load unpacked
   3. Select folder `./chrome-extension`

## App

* Run in docker

    ```
    docker compose -f docker-compose.dev.yml up -d
    ```

* Use already built backend
  * [n01.devant.cz](n01.devant.cz)
  * Open app on mobile [app.n01.devant.cz](http://app.n01.devant.cz)
  * Use backend WS endpoint: `wss://n01.devant.cz/ws`

## OBS

* Tools -> Websocket Server Settings
  * Setup port (<OBS_PORT>)
  * Use endpoint in app: `ws://<YOUR_LOCAL_IP>:<OBS_PORT>`



