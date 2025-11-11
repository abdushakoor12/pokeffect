import { Atom } from "@effect-atom/atom-react";
import { BrowserHttpClient, BrowserKeyValueStore } from "@effect/platform-browser";
import { Layer, ManagedRuntime } from "effect";

const appLayer = Layer.mergeAll(
    BrowserHttpClient.layerXMLHttpRequest,
    BrowserKeyValueStore.layerLocalStorage,
);

export const runtime = ManagedRuntime.make(appLayer);
export const runtimeAtom = Atom.runtime(appLayer);