export function getContext(name: string) {
    return `
import React from "react";

export const ${name}Context = React.createContext(null);

export const use${name}Context = () => {
  const context = React.useContext(${name}Context);
  if (!context)
    throw new Error("use${name}Context can not be used outside it's provider");
  return context;
};
`
}