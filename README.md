# Simple GUI viewer for Unique Bible App

The UI is a javascript app using [react.js](https://reactjs.org/) and [next.js](https://nextjs.org/).  It retrieves data using API calls to UBA. 

## Setup

* Install [node](https://nodejs.dev/en/download/)
   * Mac: `brew install node`
* Install [yarn](https://www.npmjs.com/package/yarn)
   * Mac: `npm i -g yarn`
* Run `yarn` to install all the dependencies

## Running in local dev mode

Start UBA in API server mode:
* `python3 uba.py api-server`

Verify API server works:
* http://localhost:8080/bible

Start GUI:
* `yarn run dev`

Open browser:
* http://localhost:3000/
