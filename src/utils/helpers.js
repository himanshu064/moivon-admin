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
