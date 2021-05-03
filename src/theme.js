import { createMuiTheme } from '@material-ui/core/styles'
import { blueGrey, purple } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: purple[300],
      main: purple[500],
      dark: purple[700],
    },
    secondary: {
      light: blueGrey[300],
      main: blueGrey[500],
      dark: blueGrey[900],
    },

    type: 'dark',
  },
  typography: {},
  overrides: {},
})

export default theme
