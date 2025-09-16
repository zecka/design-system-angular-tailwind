import { cva } from "class-variance-authority";

export const example = "mb-2"
const btn = cva(["btn mb-3"], {
    variants: {
        intent: {
            primary: ["btn-primary"],
            secondary: ["btn-secondary"],
        },
        size: {
            sm: ["btn-sm"],
            lg: ["btn-lg"],
        },
        disabled: {
            false: null,
            true: ["btn-disabled"],
        },
    },

});


export default btn;