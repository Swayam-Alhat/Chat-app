import JWT from "jsonwebtoken";

export const getToken = (req) => {
  // req contains all lot of info. it also contain req Info.
  // req contains Key who's data type is Symbol & its corresponding value is whole reqInfo object.
  // So, we have to access that key. (Its not similar to other keys in object because this key is of Symbol type)
  // returns array which contains keys from provided object whose data type is Symbol()
  const symbolKeys = Object.getOwnPropertySymbols(req);

  // value inside Symbol("..") is called description. we have method to access it and use it to access the required key
  const kHeaderSymbol = symbolKeys.find(
    (symbolKey) => symbolKey.description === "kHeaders",
  );

  // When Key is Symbol, we have to use [] braces and mention the reference
  const cookieValue = req[kHeaderSymbol].cookie;
  const index = cookieValue.indexOf("=");

  // because if char is not found, indexOf returns -1
  if (index !== -1) {
    // returns part of string after the specified index
    const token = cookieValue.substring(index + 1);
    return token;
  } else {
    return null;
  }
};

export const getUserFromToken = (token) => {
  try {
    const user = JWT.verify(token, process.env.JWT_SECRET);
    return user;
  } catch (error) {
    console.log("Error while connection: ", error.message);
  }
};
