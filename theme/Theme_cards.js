export default {
  default: {
    marginTop: 3,
    padding: 3,
    border: "1px solid",
    borderColor: "primary_b",
    borderRadius: 2,
    boxShadow: "card",
    background: "text",
    '&:p': {
      color: '#f00'
    }
  },
  primary: {
      marginTop: 3,
      padding: 3,
      border: "1px solid",
      borderColor: "lite",
      borderRadius: 2,
      boxShadow: "card",
      background: "text",
    },
    glass: {
      padding: 3,
      boder: 'none',
      borderRadius: 2,
      boxShadow: 'card',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(3px)',
      transition:  1,
      overflow: 'hidden',
      zIndex: 1,
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.13)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'card_lift',
      }
    },
    post: {
      padding: 3,
      border: 'none',
      borderRadius: 2,
      boxShadow: 'card',
      overflow: 'hidden',
      bg: 'grey_0',
      mb: 4,
      transition:  1,
      ':hover': {
        filter: 'brightness(98%)',
        boxShadow: 'card_lift',
        bg: 'faint',
      },
    },
    modal: {
      padding: 3,
      border: 'none',
      borderRadius: 2,
      boxShadow: 'card',
      overflow: 'hidden',
      bg: 'grey_0',
      color: 'grey_2',
      width: '35rem',

      

  }
}