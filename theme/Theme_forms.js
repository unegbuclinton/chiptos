const forms = {
  label: {
    fontSize: 1,
    fontWeight: "body",
  },
  input: {
    borderColor: "grey_7",
    borderRadius: 0,
    "&:focus": {
      borderColor: "primary",
    //   boxShadow: (t) => `0 0 0 2px ${t.colors.primary_c}`,
      outline: "none",
    },
  },
  select: {
    borderColor: "transparent",
    borderRadius: 2,
    bg: 'primary_b',
    "&:focus": {
      borderColor: "white",
    //   boxShadow: (t) => `0 0 0 2px ${t.colors.primary_c}`,
      outline: "none",
    },
  },
  options:{
    bg: '#0f0'
  },
  textarea: {
    borderColor: "grey_7",
    "&:focus": {
      borderColor: "primary_c",
    //   boxShadow: (t) => `0 0 0 2px ${t.colors.primary_c}`,
      outline: "none",
    },
  },
  checkbox:{
      borderColor: "grey_7",
      color: 'primary_c',
    "&:focus": {
      borderColor: "primary_c",
    //   boxShadow: (t) => `0 0 0 2px ${t.colors.primary_c}`,
      outline: "none",
    },
  },
  slider: {
    bg: "muted",
  },
  switch:{
    'input:checked ~ &': {
      bg: 'primary_b',
    },
  }
};
export default forms