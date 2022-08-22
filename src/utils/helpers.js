export const formatCurrency = (price, currency = "USD") => {
  if (!price) return null;
  const stringPrice = price.toString();
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    stringPrice
  );
};

export const checkMaxFileSize = (size, max_size) => {
  const sizeInMB = size / 1024 / 1024;
  return sizeInMB < max_size;
};

export const isEmpty = (param) => (param ? !Object.keys(param).length : true);

export const objectToQueryParams = (obj) =>
  Object.keys(obj)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join("&");

export const isLocalImage = (url = "") =>
  !url ? undefined : url.toString().includes("blob");

export function capitalizeFirstLetter(string) {
  if (!string) return null;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getMapsLocation = (location) => {
  if (!location) return null;
  if (typeof location !== "string") return null;

  if (isValidURL(location)) {
    return location;
  }

  return `https://www.google.com/maps/place/${encodeURIComponent(location)}`;
};

export function isValidURL(string) {
  var res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
}

export function getPaginatedRecordNumber({
  page = 1,
  index = 0,
  per_page = 10,
}) {
  return per_page * page - per_page + index + 1;
}
