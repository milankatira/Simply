// ** MUI Imports
import Grid from '@mui/material/Grid'
import authRoute from 'src/@core/utils/auth-route'
// ** Demo Components Imports
import TypographyTexts from 'src/views/typography/TypographyTexts'
import TypographyHeadings from 'src/views/typography/TypographyHeadings'

const TypographyPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TypographyHeadings />
      </Grid>
      <Grid item xs={12}>
        <TypographyTexts />
      </Grid>
    </Grid>
  )
}

export default authRoute(TypographyPage)
