// import { PlayMini } from "@emotion-icons/remix-fill";

// //================================================= STANDARDS
const buttonStandard = {
  // fontWeight: "bold",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  py: 1,
  px: 3,
  mx: 1,
  cursor: "pointer",
  borderRadius: 2,
  // borderStyle: "solid",
  // borderWidth: "2px",
  transition: 1,
  fontSize: [2, 3, 3],
  userSelect: 'none'
};

// // const smallButtonStandard = {
// //   fontWeight: "bold",
// //   display: "flex",
// //   justifyContent: "center",
// //   alignItems: "center",
// //   py: "4px",
// //   px: "8px",
// //   mx: 1,
// //   cursor: "pointer",
// //   borderRadius: 2,
// //   borderStyle: "inset",
// //   border: "2px solid",
// //   transition: 1,
// //   fontSize: [1, 2, 2],
// // };
// const outlineStandard = {
//   ...buttonStandard,
//   py: 1,
//   px: 3,
//   bg: "transparent",
//   transition: 1,
// };
// const iconStandard = {
//   display: 'flex',
//   justifyContent: "center",
//   alignItems: "center",
//   mx: 1,
//   p: ".2em",
//   cursor: "pointer",
//   borderRadius: "50%",
//   height: "2em",
//   width: "2em",
//   minHeight: "2em",
//   maxHeight: "2em,",
//   minWidth: "2em",
//   maxWidth: "2em",
//   color: "text",
//   bg: "transparent",
//   transition: 1,
//   ":hover": {
//     bg: "primary_b",
//     color: "text",
//   },
//   ":active": {
//     bg: "primary_a",
//     color: "bg",
//   },
// };
// //================================================= COLORS
// const plain = {
//   color: "text",
//   bg: "transparent",
//   hover: "primary_c",
//   active: "primary_a",
//   disabled: "grey_4",
//   // hoverShadow: (theme) => `0 3px 3px 3px ${theme.colors.primary_t}`,
//   hoverShadow: '',
//   // activeShadow: (theme) => `0 2px 2px 2px ${theme.colors.primary_t}`,
//   activeShadow: '',
//   shadowInset: (theme) => `inset 0 0 0 2px ${theme.colors.grey_7}`,

// };
// const primary = {
//   color: "text",
//   bg: "primary_b",
//   shadowInset: (theme) => `inset 0 0 0 2px ${theme.colors.primary_b}`,
//   hover: "primary_c",
//   hoverInset: (theme) => `inset 0 0 0 2px ${theme.colors.primary_c}`,
//   active: "primary_a",
//   activeInset: (theme) => `inset 0 0 0 2px ${theme.colors.primary_a}`,
//   disabled: "grey_4",
//   disabledInset: (theme) => `inset 0 0 0 2px ${theme.colors.grey_4}`,

//   // hoverShadow: (theme) => `0 3px 3px 3px ${theme.colors.primary_t}`,
//   // activeShadow: (theme) => `0 2px 2px 2px ${theme.colors.primary_t}`,
// };
// const secondary = {
//   color: "text",
//   bg: "grey_7",
//   shadowInset: (theme) => `inset 0 0 0 2px ${theme.colors.grey_7}`,
//   hover: "grey_8",
//   hoverInset: (theme) => `inset 0 0 0 2px ${theme.colors.grey_8}`,
//   active: "grey_9",
//   activeInset: (theme) => `inset 0 0 0 2px ${theme.colors.grey_9}`,
// };
// const accent = {
//   color: "grey_0",
//   bg: (theme) =>
//     `linear-gradient(45deg, ${theme.colors.primary_b}, ${theme.colors.accent_b} 40%, ${theme.colors.accent_b} 60%, ${theme.colors.primary_b} 80%)`,
//   hover: (theme) =>
//     `linear-gradient(45deg, ${theme.colors.primary_a} 10%, ${theme.colors.accent_a})`,
//   active: "accent_b",
//   // hoverShadow: (theme) => `0 3px 3px 3px ${theme.colors.accent_t}`,
//   // activeShadow: (theme) => `0 2px 2px 2px ${theme.colors.accent_t}`,
// };
// const disabled = {
//   color: "grey_0",
//   bg: "grey_2",
//   shadowInset: (theme) => `inset 0 0 0 2px ${theme.colors.grey_2}`,
//   cursor: 'not-allowed',
//   textDec: 'line-through'
// };

export default {
  //================================================ THEMED
  plain: {
    ...buttonStandard,
    color: plain.color,
    bg: plain.bg,
    borderColor: plain.bg,
    ":hover": {
      bg: plain.hover,
      boxShadow: plain.hoverShadow,
    },
    ":active": {
      bg: plain.active,
      boxShadow: plain.activeShadow,
    },
  },
  primary: {
    ...buttonStandard,
    bg: primary.bg,
    color: primary.color,
    borderColor: primary.bg,

    ":hover": {
      bg: primary.hover,
      borderColor: primary.hover,
      boxShadow: primary.hoverShadow,
    },
    ":active": {
      bg: primary.active,
      borderColor: primary.active,
      boxShadow: primary.activeShadow,
    },
  },
  secondary: {
    ...buttonStandard,
    bg: secondary.bg,
    color: secondary.color,
    borderColor: secondary.bg,
    ":hover": {
      bg: secondary.hover,
      boxShadow: secondary.hoverInset,
    },
    ":active": {
      bg: secondary.active,
      boxShadow: secondary.activeInset,
    },
  },
  accent: {
    ...buttonStandard,
    position: "relative",
    transition: 1,
    // border: "2px solid transparent",
    color: "text",
    overflow: "hidden",
    // boxShadow: theme => `inset 0 0 0 2px ${theme.colors.accent_c}`,
    bg: "transparent",
    "::before": {
      transition: 1,
      backgroundImage: accent.bg,
      position: "absolute",
      content: "''",
      top: "-50px",
      right: "-100px",
      bottom: "0",
      left: "-20px",
      zIndex: "-1",
    },
    ":active": {
      bg: "primary_t",
    },
    ":hover::before": {
      transform: "translateX(-100px)",
    },
    ":active::before": {
      transform: "translateY(50px)",
    },
  },
  disabled: {
    ...buttonStandard,
    color: disabled.color,
    bg: disabled.bg,
    cursor: disabled.cursor,
    textDecoration: disabled.textDec,
  },
  //================================================ OUTLINE
  outline: {
    plain: {
      ...outlineStandard,
      color: 'text',
      borderColor: 'text',
      fontWeight: "bold",
      boxShadow: plain.shadowInset,


      ":hover": {
        bg: plain.hover,
        color: plain.color,
        borderColor: plain.hover,
        boxShadow: plain.hoverShadow,
      },
      ":active": {
        bg: plain.active,
        color: plain.color,
        borderColor: plain.active,
        boxShadow: plain.activeShadow,
      },
    },
    primary: {
      ...outlineStandard,
      color: "primary_b",
      borderColor: "primary_b",
      fontWeight: "bold",
      boxShadow: primary.shadowInset,

      ":hover": {
        bg: primary.hover,
        color: primary.color,
        boxShadow: primary.hoverInset,
      },
      ":active": {
        bg: primary.active,
        color: primary.color,
        borderColor: primary.active,
        boxShadow: primary.activeInset,
      },
    },
    secondary: {
      ...outlineStandard,
      color: secondary.hover,
      boxShadow: secondary.shadowInset,
      ":hover": {
        bg: secondary.hover,
        color: secondary.color,
        boxShadow: secondary.hoverInset,
      },
      ":active": {
        bg: secondary.active,
        color: secondary.color,
        borderColor: secondary.active,
        boxShadow: secondary.activeShadow,
      },
    },
    accent: {
      ...outlineStandard,
      position: "relative",
      transition: 1,
      fontWeight: "bold",
      // border: "2px solid transparent",
      // color: accent.color,
      // borderColor: accent.bg,
      overflow: "hidden",
      bg: "transparent",
      backgroundImage: accent.bg,
      backgroundClip: "text",
      textFillColor: "transparent",
      "::before": {
        transition: 1,
        backgroundImage: accent.bg,
        position: "absolute",
        content: "''",
        top: "-50px",
        right: "-100px",
        bottom: "0",
        left: "-20px",
        zIndex: "-1",
      },
      "::after": {
        transition: 1,
        content: "",
        bg: "grey_0",
        position: "absolute",
        content: "''",
        top: "2px",
        right: "2px",
        bottom: "2px",
        left: "2px",
        borderRadius: 2,
        zIndex: "-1",
      },
      ":hover": {
        backgroundClip: "none",
        bg: "#fff",
        color: "text",
        textFillColor: (theme) => theme.colors.text,
      },
      ":hover::after": {
        bg: "transparent",
      },
      ":hover::before": {
        transform: "translateX(-20px)",
      },
      ":active::before": {
        bg: "transparent",
        color: "#fff",
      },
      ":active::before": {
        transform: "translateX(-100px)",
      },
    },
    disabled: {
      ...outlineStandard,
      color: disabled.bg,
      cursor: disabled.cursor,
      textDecoration: disabled.textDec,
      boxShadow: disabled.shadowInset
    },

    red: {},
    green: {},
    disbled: {},
  },
  //================================================ ICON
  icon: {
    plain: {
      ...iconStandard,
      ":hover": {
        bg: plain.hover,
        color: plain.color,
        boxShadow: plain.hoverShadow,
      },
      ":active": {
        bg: plain.active,
        color: plain.color,
        boxShadow: plain.hoverShadow,
      },
    },
    codeblock: {
      ...iconStandard,
      maxWidth: '2rem',
      maxHeight: '2rem',
      bg: 'grey_1',
      ":hover": {
        bg: plain.hover,
        color: plain.color,
        boxShadow: plain.hoverShadow,
      },
      ":active": {
        bg: plain.active,
        color: plain.color,
        boxShadow: plain.hoverShadow,
      },
    },
    primary: {
      ...iconStandard,
      ":hover": {
        bg: primary.hover,
        color: primary.color,
        boxShadow: primary.hoverShadow,
      },
      ":active": {
        bg: primary.active,
        color: primary.color,
        boxShadow: primary.activeShadow,
      },
    },
    secondary: {
      ...iconStandard,
      color: "grey_4",
      ":hover": {
        bg: secondary.hover,
        color: secondary.color,
        boxShadow: secondary.hoverShadow,
      },
      ":active": {
        bg: secondary.active,
        color: secondary.color,
        boxShadow: secondary.activeShadow,
      },
    },
    accent: {
      ...iconStandard,
      position: "relative",
      overflow: "hidden",
      transition: 1,
      // bg: '#f00',
      backgroundClip: "text",
      color: "accent_b",
      // textFillColor: "transparent",
      "::before": {
        background: accent.bg,
        transition: 1,
        position: "absolute",
        content: "''",
        top: "-50px",
        right: "-100px",
        bottom: "0",
        left: "-20px",
        zIndex: "-1",
        opacity: "0",
      },
      ":hover": {
        color: "text",
        textFillColor: (theme) => theme.colors.text,
      },
      ":hover::before": {
        opacity: "1",
      },
      ":active::before": {
        transform: "translateX(-100px)",
      },
      ":active": {
        bg: "transparent",
      },
    },
    disabled: {
      ...iconStandard,
      color: "grey_5",
      border: "2px solid",
      borderColor: "grey_5",
      borderStyle: "inset",
      p: 1,
      backgroundImage: (theme) =>
        `linear-gradient(-45deg, ${theme.colors.grey_0} 45%, ${theme.colors.grey_5} 50%, ${theme.colors.grey_0} 55%)`,
      cursor: "not-allowed",
      ":hover": {
        bg: "none",
      },
    },
    red: {},
    green: {},
    disbled: {},
  },
  //================================================ CUSTOM
  close: {
    color: "text",
    m: 3,
    cursor: "pointer",
  },
  menuItem: {
    width: "100%",
    m: 0,
    my:0,
    px: 2,
    py: 2,
    borderRadius: 0,
    textAlign: "left",
    bg: "transparent",
    cursor: "pointer",
    fontSize: [2, 3, 3],
    transition: 1,
    color: 'text',
    borderBottom: '1px solid',
    borderColor: 'grey_1',

    ":hover": {
      bg: primary.hover,
    },
    ":active": {
      bg: primary.active,
    },
  },
  codeMenuItem: {
    overflow: 'auto',
    width: "100%",
    m: 0,
    my:'-4px',
    ml: '-1px',
    px: 2,
    py: 2,
    borderRadius: 0,
    textAlign: "left",
    bg: "transparent",
    cursor: "pointer",
    fontSize: [2, 3, 3],
    transition: 1,
    color: 'text',
    border: '1px solid',
    borderColor: 'grey_1',
    bg: 'grey_0',

    ":hover": {
      bg: primary.hover,
    },
    ":active": {
      bg: primary.active,
    },
  },
  
};
