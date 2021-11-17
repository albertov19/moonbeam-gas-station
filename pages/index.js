import React, { Component } from "react";
import { Container, Grid } from "semantic-ui-react";
import Head from "next/head";

import GasInfo from "../components/gas-info";

class MoonbeamGasStation extends Component {
  async componentDidMount() {}
  render() {
    return (
      <Container>
        <br />
        <Head>
          <title>Moonbeam Gas Station</title>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />
        </Head>
        <Grid>
          <Grid.Column width={8} stretched verticalAlign="top">
            <h2>Moonriver Basic Gas Station</h2>
            <GasInfo network={"moonriver"} />
          </Grid.Column>
        </Grid>
        <br />
        <br />
        <Grid>
          <Grid.Column width={8} stretched verticalAlign="top">
            <h2>Moonbase Alpha Basic Gas Station</h2>
            <GasInfo network={"moonbase"} />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default MoonbeamGasStation;
