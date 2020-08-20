// <reference lib="webworker" />
// import { useOutboxDB, OutboxDB, QueueItem } from "./odb/useOutboxDB";

// useOutboxDB().then((db) => {
//   console.log({ db });
// });

interface ExtendableEvent extends Event {
  waitUntil(f: any): void;
}

interface FetchEvent extends ExtendableEvent {
  readonly clientId: string;
  readonly preloadResponse: Promise<any>;
  readonly replacesClientId: string;
  readonly request: Request;
  readonly resultingClientId: string;
  respondWith(r: Response | Promise<Response>): void;
}

// self.addEventListener("fetch", (e) => {
//   const {
//     respondWith,
//     request,
//     request: { method, url }
//   } = e as FetchEvent;
//   const compare = !process.env.NEXT_PUBLIC_GRAPHQL_URL?.localeCompare(url);
//   if (compare && method.toUpperCase() === "POST") {
//     if (!navigator.onLine) {
//       console.log("Is offline...");
//       respondWith(
//         new Response(
//           new Blob([JSON.stringify({ message: "Is offline..." })], {
//             type: "application/json"
//           }),
//           {
//             status: 200,
//             statusText: "Is offline..."
//           }
//         )
//       );
//     }

//     request
//       .clone()
//       .json()
//       .then((result) => {
//         if (result.query) {
//           // return cache?
//           respondWith(
//             fetch(request.clone())
//               .then((res) => {
//                 return res;
//               })
//               .catch((e) => {
//                 return new Response(null, {
//                   status: 200,
//                   statusText: e
//                 });
//               })
//           );
//         }
//         if (result.mutation) {
//           // store in queue
//         }
//       });

//     // request.json().then((data) => {
//     //   console.log("Adding request to queue", { url, data });
//     // });
//   }
// });

export default undefined;
