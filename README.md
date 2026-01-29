# WebSockets

In a nutshell, **WebSocket** is a technology that enables bidirectional, full-duplex communication between client and server over a persistent, single-socket connection

#### The WebSocket technology includes two core building blocks:

1. The **WebSocket protocol**. Enables communication between clients and servers over the web, and supports transmission of binary data and text strings. For more details, see the [WebSocket protocol](https://websocket.org/guides/websocket-protocol/).

You will get `WebSocket implementation` at the end of article ([WebSocket protocol](https://websocket.org/guides/websocket-protocol/))

2. The **WebSocket API**. Allows you to perform necessary actions, like managing the WebSocket connection, sending and receiving messages, and listening for events triggered by the server. For more details, see the [WebSocket API](https://websocket.org/reference/websocket-api/)

## What is the WebSocket API ?

The WebSocket API is a browser-based interface that allows web applications to open a persistent connection with a server. It enables the exchange of data in both directions without the need for repeated HTTP requests.

_This API is supported in all modern browsers and is the foundation of many frontend real-time applications_

[The WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) makes it possible to open a two-way interactive communication session between the user's browser and a server.

Read the first few paras from [The WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) to understand

## We use ws (nodejs) & Websocket contructor (browser)

Use [ws](https://www.npmjs.com/package/ws) to create websocket server in nodejs. To know more about `ws` classes & utility functions, look at [ws/docs/ws.md](https://github.com/websockets/ws/blob/HEAD/doc/ws.md)

### Server security

Server (websocket server) should track client so to prevent repeated connection (handshake) with server. See [track clients](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#keeping_track_of_clients)

### How to create unique identifier for each websocket client connection in server, Since wss.clients returns a set which contains connected clients. But these connected client objects does not contain unique identifier property.

Solution - [solution](https://github.com/websockets/ws/issues/859)

### JSON.stringify converts js value into JSON formatted string

The primary function is to take structured JavaScript data (objects, arrays, numbers, strings, booleans, and null values) and represent them as a flat, contiguous string of text that adheres to the universal JSON standard.

But, JSON.stringify() handles certain JavaScript data types in specific way

Supported Types: Strings, numbers, booleans, arrays, plain objects, and null are all converted to their JSON equivalents
Omitted/Ignored Types: Properties with values of function, Symbol, or undefined are completely omitted from the resulting JSON string

**So when we use JSON.parse() to convert it into normal object, it omits those types**

**IMP Learning**  
whenever we install any application or software in windows OS, we must specify the path of installed application (.exe file) in `environment variables`.  
Go to system env varibles, we will get "path" or "PATH" variables. Variables are in Key-value pairs. So path/PATH will be key and its value will be string which will contains paths of multiple installed apps/software separated by ";" . Double click it, & you will see the list of paths. Click `new` and add the newly installed app's path. click Ok.  
Now, we can run that app/software from any directory. Example, we installs nodejs, add its path in env vars. Now when we run `node -v` or `node file-name.js` , it runs because OS finds node with the help of Path/PATH variables.
