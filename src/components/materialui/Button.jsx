import { compose, spacing, sizing, borders } from "@material-ui/system";
import { Button, styled } from "@material-ui/core";

export const StyledButton = styled(Button)(compose(spacing, sizing, borders));
