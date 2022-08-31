import { Store, subscribe, subscribeKey } from "./src";

const state = Store({ a: "1", b: "2", obj: { foo: "bar", b: "ooo", a: "yyy" } });
const unsubscribe = subscribe(state, (v) => {
  console.error("state changed", state, v);
});

const unsubscribeKey = subscribeKey(state, "a", (v) => {
  console.error("state changed by key1", state, v);
});

const unsubscribeKey2 = subscribeKey(state.obj, "b", (v) => {
  console.error("state changed by key2", state, v);
});

setTimeout(() => {
  state.obj.b = "111";
}, 1000);

setTimeout(() => {
  console.log("unsubscribe");
  unsubscribe();
  unsubscribeKey();
  unsubscribeKey2();
}, 3000);

setTimeout(() => {
  state.a = "3";
}, 4000);
