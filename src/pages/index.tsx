import * as React from 'react'
import { useState } from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'
import Grid, { GridSpacing } from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.secondary.dark,
  },
  paper: {
    height: 140,
    width: 100,
  },
}))

const IndexPage = () => {
  const classes = useStyles()
  const [spacing, setSpacing] = useState<GridSpacing>(8)

  return (
    <Layout>
      <SEO title='Home' />
      <Container>
        <Grid container className={classes.root} spacing={spacing}>
          <Grid item xs={4}>
            {/* <Grid container justify='center' spacing={spacing}>
            {[0, 1, 2, 3].map(value => (
              <Grid key={value} justify='center' item>
              </Grid>
              ))}
            </Grid> */}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}

export default IndexPage
