import { Store, subscribe, subscribeKey } from "./src";

const state = Store({
  a: "1",
  b: "2",
  obj: { foo: "bar", b: "ooo", a: "yyy" },
  obj2: { arr: [1, 2, 3] },
});
const unsubscribe = subscribe(state, (v) => {
  console.error("state changed", state, v);
});

const unsubscribeKey = subscribeKey(state, "a", (v) => {
  console.error("state changed by key1", state, v);
});

const unsubscribeKey2 = subscribeKey(state.obj, "b", (v) => {
  console.error("state changed by key2", state, v);
});

const unsubscribeKey3 = subscribeKey(state.obj2, "arr", (v) => {
  console.error("state changed by key3", state, JSON.stringify(v));
});

setTimeout(() => {
  state.obj2 = {
    arr: [2, 3, 4],
  };
}, 1000);
