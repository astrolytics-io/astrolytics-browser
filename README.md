# Nucleus-Browser

[Nucleus.sh](https://wwww.nucleus.sh)'s browser SDK.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Documentation](#documentation)
3. [How to Contribute](#how-to-contribute)
4. [License](#license)

## Getting Started

To get started with Nucleus, create an account at [Nucleus](https://dash.nucleus.sh/login) and grab the App ID, then
use the SDK to start tracking events.

```bash
# with npm
npm install nucleus-browser

# or with yarn
yarn add nucleus-browser
```

Then, initialize it in your JavaScript file:

```javascript
import Nucleus from 'nucleus-browser';

Nucleus.init('YOUR_APP_ID');
```

Replace `'YOUR_APP_ID'` with the unique ID of your app. You can get it [here](https://dash.nucleus.sh/account).

You can check examples [here](./playground).

## API

### Initialization

Initialize Nucleus SDK with your application ID. Optional configuration parameters can also be passed.

```javascript
Nucleus.init('YOUR_APP_ID', options);
```

Nucleus also supports passing the following options as second argument:

```js
Nucleus.init('APP_ID', {
  endpoint: 'wss://app.nucleus.sh', // only option, we don't allow self hosting yet :(
  disableInDev: true, // disable in development mode. We recommend not to call
                      // `init` method, as that will be more reliable.
  debug: false, // if set to `true`, will log a bunch of things.
  disableTracking: false, // will not track anything. You can also use `Nucleus.disableTracking()`.
                          // note that some events will still be added to the queue, so if you call
                          // Nucleus.enableTracking() again, they will be sent to the server.
  automaticPageTracking: true, // will track all page changes.
  reportInterval: 2 * 1000, // at which interval the events are sent to the server.
  sessionTimeout: 60 * 30 * 1000, // time after which the session is ended
  cutoff: 60 * 60 * 48 * 1000, // time after which event that were not sent yet are deleted
  disableErrorReports: false, // wether to disable error tracking
})
```

### Tracking

Track events with optional custom data

```javascript
Nucleus.track("click", { foo: 'bar' });
```

### Error Tracking

Track errors with a name and the Error object.

```javascript
Nucleus.trackError(name, error);
```

By default Nucleus will listen for `window.onerror` and `window.onunhandledrejection` events and send them to the API. If you want
to disable this behaviour, you can set `disableTracking` to `true`:

```js
Nucleus.init('APP_ID', { disableTracking: true })
```

### User Identification

Identify a user by a unique ID and optionally set custom properties.

```javascript
Nucleus.identify('04f8846d-ecca-4a81-8740-f6428ceb7f7b', { firstName: 'Brendan', lastName: 'Eich' });
```

### Page Tracking

Track page views with the page name and optional parameters. If the page name is not provided, the current window's pathname is used.

```javascript
Nucleus.page('/about', { foo: 'baz' });
```

By default, Nucleus will track any page change that fires a 'popstate' event. If your framework is handling route changes differently,
you should manually call `Nucleus.page`.

### Disabling Tracking

To disable tracking

```javascript
Nucleus.disableTracking();
```

### Enabling Tracking

To enable tracking

```javascript
Nucleus.enableTracking();
```

## How to Contribute

We're always looking for contributions from the community. Here's how you can help:

1. **Report Bugs**: Create an issue report detailing the bug you've found.
2. **Suggest Features**: Have a great idea for Nucleus? Don't hesitate to put it forward by creating an issue.
3. **Submit Pull Requests**: Feel free to fix a bug or add a new feature and create a pull request. Make sure to follow the existing code style, and write clear commit messages explaining your changes.
