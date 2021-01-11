import { compose, spacing, sizing, borders } from "@material-ui/system";
import { Button, styled } from "@material-ui/core";

const SystemButton = styled(Button)(compose(spacing, sizing, borders));

export const StyledButton = (props) => <SystemButton disableElevation {...props} />;
