import { INTERNAL_LISTENERS } from "./utils";

export const subscribe = (proxyObj, callback) => {
  let ops = [];
  let listener = (op) => {
    ops.push(op);
    callback(ops.splice(0));
  };

  proxyObj[INTERNAL_LISTENERS].add(listener);

  return () => {
    proxyObj[INTERNAL_LISTENERS].delete(listener);
  };
};

export const subscribeKey = (proxyObj, key, callback) => {
  return subscribe(proxyObj, (ops) => {
    if (ops.some((op) => op[1][0] === key)) {
      callback(proxyObj[key]);
    }
  });
};
