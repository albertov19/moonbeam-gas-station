import React from "react";
import { Container, Grid } from "semantic-ui-react";
import Head from "next/head";
import Image from "next/image";

import GasInfo from "../components/gas-info";

const MoonbeamGasStation = () => {
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
          <Image src={require("/public/moongas.gif")} width={8} height={1} layout="responsive" />
        </Grid.Column>
      </Grid>
      <h1>Moonbeam Network Basic Gas Station</h1>
      <Grid>
        <Grid.Column width={8} stretched verticalAlign="top">
          <h2>Moonbeam</h2>
          <GasInfo network={"moonbeam"} />
        </Grid.Column>
      </Grid>
      <Grid>
        <Grid.Column width={8} stretched verticalAlign="top">
          <h2>Moonriver</h2>
          <GasInfo network={"moonriver"} />
        </Grid.Column>
      </Grid>
      <Grid>
        <Grid.Column width={8} stretched verticalAlign="top">
          <h2>Moonbase</h2>
          <GasInfo network={"moonbase"} />
        </Grid.Column>
      </Grid>
      <Grid>
        <Grid.Column width={8} stretched verticalAlign="top">
          <h2>Moonbeam Dev Node</h2>
          <GasInfo network={"moonbeam-dev"} />
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default MoonbeamGasStation;
