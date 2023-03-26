
// //================================================= STANDARDS
const buttonStandard = {
  // fontWeight: "bold",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: 'Menlo, monospace',
  fontWeight: 'bold',
  py: 1,
  px: 3,
  mx: 1,
  cursor: "pointer",
  borderRadius: 0,
  border: '0px solid transparent',
  borderBottom: '2px solid white',
  // borderStyle: "solid",
  // borderWidth: "2px",
  transition: 1,
  fontSize: [2, 3, 3],
  userSelect: 'none'
};

const plain = {
  color: "text",
  bg: "transparent",
  hover: "primary_c",
  active: "primary_a",
  disabled: "grey_4",
  // hoverShadow: (theme) => `0 3px 3px 3px ${theme.colors.primary_t}`,
  hoverShadow: '',
  // activeShadow: (theme) => `0 2px 2px 2px ${theme.colors.primary_t}`,

};
const primary = {
  color: "grey_15",
  bg:"primary_b",
  // shadowInset: (theme) => `inset 0 0 0 2px ${theme.colors.primary_b}`,
  hover: "grey_3",
  // hoverInset: (theme) => `inset 0 0 0 2px ${theme.colors.primary_c}`,
  active: "primary_a",
  // activeInset: (theme) => `inset 0 0 0 2px ${theme.colors.primary_a}`,
  disabled: "grey_4",
  // disabledInset: (theme) => `inset 0 0 0 2px ${theme.colors.grey_4}`,

  // hoverShadow: (theme) => `0 3px 3px 3px ${theme.colors.primary_t}`,
  // activeShadow: (theme) => `0 2px 2px 2px ${theme.colors.primary_t}`,
};
const secondary = {
  color: "primary_b",
  bg: "transparent",
  // shadowInset: (theme) => `inset 0 0 0 2px ${theme.colors.grey_7}`,
  hover: "grey_4",
  // hoverInset: (theme) => `inset 0 0 0 2px ${theme.colors.grey_8}`,
  active: "grey_9",
  // activeInset: (theme) => `inset 0 0 0 2px ${theme.colors.grey_9}`,
};
const accent = {
  color: "grey_0",
  // bg: (theme) =>
    // `linear-gradient(45deg, ${theme.colors.primary_b}, ${theme.colors.accent_b} 40%, ${theme.colors.accent_b} 60%, ${theme.colors.primary_b} 80%)`,
  // hover: (theme) =>
    // `linear-gradient(45deg, ${theme.colors.primary_a} 10%, ${theme.colors.accent_a})`,
  active: "accent_b",
  // hoverShadow: (theme) => `0 3px 3px 3px ${theme.colors.accent_t}`,
  // activeShadow: (theme) => `0 2px 2px 2px ${theme.colors.accent_t}`,
};
const disabled = {
  color: "grey_0",
  bg: "tran",
  // shadowInset: (theme) => `inset 0 0 0 2px ${theme.colors.grey_2}`,
  cursor: 'not-allowed',
  textDec: 'line-through'
};

const buttons = {
  //================================================ THEMED
  default: {
    ...buttonStandard,
    color: 'grey_15',
    bg: 'transparent',
    borderColor: 'primary_a',
    ":hover": {
      bg: plain.hover,
      boxShadow: plain.hoverShadow,
      color: 'primary_b'
    },
    ":active": {
      bg: plain.active,
      boxShadow: plain.activeShadow,
    },
  },
  primary: {
    ...buttonStandard,
    bg: 'transparent',
    color: primary.color,
    borderColor: 'transparent',

    ":hover": {
      bg: 'black',
      borderColor: 'primary_b',
      boxShadow: primary.hoverShadow,
      color: 'primary_b',
      outline: '2px solid',
      outlineColor: 'primary_b'
    },
    ":active": {
      bg: 'transparent',
      borderColor: 'primary_b',
      boxShadow: primary.activeShadow,
    },
  },
  secondary: {
    ...buttonStandard,
    bg: 'transparent',
    color: 'secondary_b',
    border: '1px solid',
    borderColor: 'secondary_b',
    ":hover": {
      bg: 'secondary_b',
      boxShadow: secondary.hoverInset,
      color: 'primary_b'
    },
    ":active": {
      bg: secondary.active,
      boxShadow: secondary.activeInset,
    },
    ":disabled":{
      background: 'none',
      borderColor:'grey',
      color:'grey',
      cursor: 'not-allowed',
      ":hover":{
        background:'grey_4'
      }
    }
  },

  iconLight: {
    ...buttonStandard,
    bg: 'transparent',
    color: 'grey_0',
    border: '0px solid transparent',
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center',
    borderBottom: '3px solid transparent',
    ":hover": {
      borderBottom:'3px solid',
      borderColor: 'grey_0'
    },
    ":active": {
    },
  },


  
};

export default buttons


// COINBASE: 0x3e1b43396Cc6A916eF4E93243FAA577B38175A31
// DISCORD:  0x3e1b43396Cc6A916eF4E93243FAA577B38175A31