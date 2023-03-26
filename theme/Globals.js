import { Global } from "@emotion/react";
import theme from 'theme'

const Globals = (props) => (
  <Global
    styles={(theme) => ({
      'body':{
        overflowX: 'hidden',
        // background: '#000',
        // color: '#fff !important',
        // height: '100vh !important',
        maxHeight: '100vh !important',
      },
      'html':{
        position: 'absolute',
        left: '0px',
        right: '0px',
        top: '0px',
        bottom: '0px',
        overflow: 'hidden',
      },
      "*": {
        boxSizing: 'border-box',
      },
      "nav":{
        width: 'min(100vw, 1200px)',
        display: 'flex',
        justifyContent: 'space-between',

      },


















      // text highlight color
      '::selection': {
        background: 'black',
        color: theme.colors.primary_b,
        padding: '10px'
      },
      // mdx footnote online links
      'sup':{
        '> a:link':{
          textDecoration: 'none',
          color: theme.colors.primary_a,
          fontSize: '1em'
        }
      },
      '::marker':{
        color: theme.colors.primary_c,
        fontSize: '1em',
      },
      // task list items
      '.task-list-item  input[type=checkbox]:checked':{
        boxShadow: `0 0 3px 4px ${theme.colors.primary_c}`,
        margin: '.4em',
        marginRight: '1em',
        marginLeft: '0',
        color: 'red'
      },
      '.task-list-item  input[type=checkbox]':{
        margin: '.4em',
        marginRight: '1em',
        marginLeft: '0',
      },
      '.task-list-item::marker':{
          color: 'transparent !important',
      },


      'mark': {
        background: theme.colors.primary_t,
        color: theme.colors.text,
        padding: '2px'
      },
      // customize the inline sup links used for footnotes
      '.footnotes': {
        'hr':{
          display: 'none'
        },
        ':before':{
          padding: '1em',
          fontSize: '1.2em',
          content: "'SOURCES'",
          fontWeight: 'bold',
          // textDecoration: 'underline',
        },
        border: '1px solid',
        borderColor: theme.colors.primary_a,
        borderRadius: '4px',
        background: theme.colors.primary_t,
        color: theme.colors.text,
        padding: '2px',
        marginTop: '3em',

      },

      // customize the backref link in the actual footnotes section
      '.footnote-backref':{
        visibility: 'hidden',
        textDecoration: 'none !important',
        
        
        ':before':{
          textDecoration: 'none',
          visibility: 'visible',
          position: 'relative',
          content: "'⬆️'",
          marginLeft: '.5em',
          height: 'auto',
        },
        ':hover::before':{
          borderBottom: '1px solid white'
        },

      }
      
    })}
  />
);
export default Globals
