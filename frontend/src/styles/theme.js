// src/theme.js
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: `'Roboto', 'Arial', sans-serif`, // replace with your font
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
  },
  palette: {
    primary: { main: '#5C6F2B' },   // green
    secondary: { main: '#DE802B' }, // burnt orange
  },
})

export default theme
