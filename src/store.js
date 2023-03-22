import { dequal } from "dequal/lite";
import { canProxy, INTERNAL_LISTENERS } from "./utils";

export const Store = (initialObject = {}) => {
  const listeners = new Set();
  const propListeners = new Map();

  const notifyUpdate = (op) => {
    listeners.forEach((listener) => listener(op));
  };

  const getPropListener = (prop) => {
    let listener = propListeners.get(prop);
    if (!listener) {
      listener = (op) => {
        var newOp = [].concat(op);
        newOp[1] = [prop].concat(newOp[1]);
        notifyUpdate(newOp);
      };

      propListeners.set(prop, listener);
    }

    return listener;
  };

  const popPropListener = (prop) => {
    let listener = propListeners.get(prop);
    propListeners.delete(prop);
    return listener;
  };

  const handler = {
    get: (target, prop, receiver) => {
      if (prop === INTERNAL_LISTENERS) {
        return listeners;
      }

      return Reflect.get(target, prop, receiver);
    },
    set: (target, prop, value, receiver) => {
      // 判断前一个和当前的值是否相等
      const hasPrevValue = Reflect.has(target, prop);
      let prevValue = Reflect.get(target, prop, receiver);
      if (hasPrevValue) {
        const tempObj = JSON.parse(JSON.stringify(prevValue));
        if (dequal(tempObj, value)) {
          return true;
        }
      }

      let childListeners = prevValue?.[INTERNAL_LISTENERS] ?? undefined;
      if (childListeners) {
        childListeners.delete(popPropListener(prop));
      }

      let nextValue;

      if (value !== null && value[INTERNAL_LISTENERS]) {
        nextValue = value;
        nextValue[INTERNAL_LISTENERS].add(getPropListener(prop));
      } else if (canProxy(value)) {
        nextValue = Store(value);
        nextValue[INTERNAL_LISTENERS].add(getPropListener(prop));
      } else {
        nextValue = value;
      }

      Reflect.set(target, prop, nextValue, receiver);
      notifyUpdate(["set", [prop], value, prevValue]);
      return true;
    },
  };

  const baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));
  const proxyObj = new Proxy(baseObject, handler);

  Reflect.ownKeys(initialObject).forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(initialObject, key);
    if (desc.get || desc.set) {
      Object.defineProperty(baseObject, key, desc);
    } else {
      proxyObj[key] = initialObject[key];
    }
  });

  return proxyObj;
};
