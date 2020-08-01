declare global {
  interface Window {
    __WB_MANIFEST: any;
  }
}

// import {} from "workbox-background-sync";
// import {} from "workbox-broadcast-update";
// import {} from "workbox-cacheable-response";
// import {} from "workbox-core";
// import {} from "workbox-expiration";
// import {} from "workbox-google-analytics";
// import {} from "workbox-navigation-preload";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
// import {} from "workbox-streams";

precacheAndRoute(self.__WB_MANIFEST);
// Your other SW code goes here.

// require("./fetch");
// require("./sync");

registerRoute(
  /^https?.*/,
  new NetworkFirst({
    cacheName: "offlineCache"
  })
);
