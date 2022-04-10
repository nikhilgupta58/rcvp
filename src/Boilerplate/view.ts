export function getView(name: string) {
    return `
import React from "react";
import { use${name}Context } from "./utils/context";

export default function ${name}View() {
    const { count } = use${name}Context();
    return <p>${name} View and count is {count}</p>;
}    
`
}