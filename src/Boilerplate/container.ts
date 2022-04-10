export function getContainer(name: string) {
    return `
import React from "react";
import ${name}View from "./${name}.view";
import { ${name}Context } from "./utils/context";

export default function ${name}Container() {
    const [count, setCount] = React.useState(1);
    return (
    <${name}Context.Provider
        value={{
        count: count,
        }}
    >
        <${name}View />
    </${name}Context.Provider>
    );
}
`
}