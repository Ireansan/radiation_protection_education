import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Custom MUI Button and Field
 */
const CustomButton = styled(Button)({
    "&:disabled": {
        backgroundColor: "#202020",
        color: "#404040",
    },
});
const CustomTextField = styled(TextField)({
    "& label": {
        color: "#606060",
        "&.Mui-focused": {
            color: "#606060",
        },
        "&.Mui-disabled": {
            color: "#202020",
        },
    },
    "& .MuiInput-underline:after": {
        borderColor: "#606060",
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "#808080",
        },
        "&:hover fieldset": {
            borderColor: "#606060",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#606060",
        },
        "&.Mui-disabled fieldset": {
            borderColor: "#202020",
        },
    },
});

export { CustomButton, CustomTextField };
