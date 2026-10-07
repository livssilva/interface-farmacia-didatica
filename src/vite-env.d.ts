/// <reference types="vite/client" />
import * as React from "react";

declare global {
    namespace JSX {
        type Element = React.ReactElement;
    }
}
