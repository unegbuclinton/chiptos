const typo = {
    fonts: {
        body: `Menlo, monospace`,
        // body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
        heading: "Menlo, monospace",
        monospace: "Menlo, monospace",
        special:'Menlo, monospace',
      },
      fontSizes: [10, 12, 14, 16, 18, 20, 22, 24, 30, 34, 38, 42, 46, 50],
      fontWeights: {
        ultraLite: 200,
        lite: 300,
        body: 400,
        heading: 700,
        bold: 700,
      },
      lineHeights: {
        body: 1.5,
        heading: 1.25,
        code: 2,
        expanded: 1.8
      },
      text: {
        default: {
          fontSize: [2,3,4],
          color: 'text',
          lineHeight: 'body',
          fontFamily: 'special',
        },
        caps: {
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
        },
        heading: {
          color: 'primary_a',
          letterSpacing: '.1em',
          fontFamily: 'special',
          fontWeight: 'bold',
      },
    },
    links: {
      nav:{
        fontSize: '.8rem',
        padding: '.25rem .5rem',
        marginRight: '.5rem',
        borderBottom: '3px solid transparent',
        '&:hover':{
          borderColor: 'grey_0'
        }
      },
      heading:{
        textDecoration: 'none',
        color: 'primary_b',
        letterSpacing: 1
      }
    }
}
export default typo