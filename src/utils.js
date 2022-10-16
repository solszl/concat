const isObject = (obj) => {
  return typeof obj === "object" && obj !== null;
};

export const canProxy = (obj) => {
  return (
    isObject(obj) &&
    (Array.isArray(obj) || !(Symbol.iterator in obj)) &&
    !(obj instanceof WeakMap) &&
    !(obj instanceof WeakSet) &&
    !(obj instanceof Error) &&
    !(obj instanceof Number) &&
    !(obj instanceof Date) &&
    !(obj instanceof String) &&
    !(obj instanceof RegExp) &&
    !(obj instanceof ArrayBuffer)
  );
};

export const INTERNAL_LISTENERS = "__LISTENER__";

export const deepClone = (value) => {
  if (!(!!value && typeof value == "object")) {
    return value;
  }
  if (Object.prototype.toString.call(value) == "[object Date]") {
    return new Date(value.getTime());
  }
  if (Array.isArray(value)) {
    return value.map(deepClone);
  }
  var result = {};
  Object.keys(value).forEach(function (key) {
    result[key] = deepClone(value[key]);
  });
  return result;
};
