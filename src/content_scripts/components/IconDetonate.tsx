import * as React from "react";

import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

import { ReactComponent as Logo } from "../../logo.svg";

const IconDetonate = (props: SvgIconProps): JSX.Element => (
  <SvgIcon {...props} component={Logo} />
);

export default IconDetonate;
