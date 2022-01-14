// Material Dashboard 2 PRO React base styles
import typography from "assets/theme/base/typography";

// Material Dashboard 2 PRO React helper functions
import pxToRem from "assets/theme/functions/pxToRem";

const { size } = typography;

export default {
  styleOverrides: {
    root: {
      padding: pxToRem(16),
      fontSize: size.xl,
    },
  },
};
