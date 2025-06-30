import { url } from "./configuration";

export const checkToken = async (token) => {
  const res = await fetch(`${url}/user`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const logout = async (token) => {
  const res = await fetch(`${url}/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const login = async (body) => {
  const res = await fetch(`${url}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await res.json();
};


export const register = async (form) => {
  const res = await fetch(`${url}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  return await res.json();
};


export const index = async (token) => {
  const res = await fetch(`${url}/user`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};


export default {
  checkToken,
  logout,
  login,
  register,
  index,
};