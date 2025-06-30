import { url } from "./configuration";

export const index = async (page = 1, perPage = 12) => {
  const res = await fetch(`${url}/products?page=${page}&per_page=${perPage}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return await res.json();
};

export const getSpecificProduct = async (productId) => {
  const res = await fetch(`${url}/products/${productId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return await res.json();
};

export const featuredProducts = async () => {
  const res = await fetch(`${url}/featured-products`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return await res.json();
};

export const getCategories = async () => {
  const res = await fetch(`${url}/categories`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return await res.json();
};

export const fetchOrders = async (token) => {
  const res = await fetch(`${url}/orders`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const fetchCarts = async (token) => {
  const res = await fetch(`${url}/carts`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const fetchWishlists = async (token) => {
  const res = await fetch(`${url}/wishlists`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};


export default {
  index,
  getSpecificProduct,
  getCategories,
  fetchOrders,
  fetchCarts,
  fetchWishlists,
};