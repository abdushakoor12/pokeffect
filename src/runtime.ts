import { BrowserHttpClient, BrowserKeyValueStore } from "@effect/platform-browser";
import { Layer, ManagedRuntime } from "effect";

export const runtime = ManagedRuntime.make(Layer.mergeAll(
    BrowserHttpClient.layerXMLHttpRequest,
    BrowserKeyValueStore.layerLocalStorage,
));