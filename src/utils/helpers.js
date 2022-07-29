export const formatCurrency = (price, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);

export const checkMaxFileSize = (size, max_size) => {
  const sizeInMB = size / 1024 / 1024;
  return sizeInMB < max_size;
};

export const isEmpty = (param) => (param ? !Object.keys(param).length : true);
