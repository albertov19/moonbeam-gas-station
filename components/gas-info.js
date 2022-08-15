import React, { useState, useEffect } from "react";
import { Container } from "semantic-ui-react";

import * as ethers from "ethers";

const GasInfo = ({ network }) => {
  // Initial State
  const [connected, setConnected] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [nTxs, setNTxs] = useState(0);
  const [avgGasPrice, setAvgGasPrice] = useState(0);
  const [minGasPrice, setMinGasPrice] = useState(0);
  const [maxGasPrice, setMaxGasPrice] = useState(0);
  const [chainMinGasPrice, setChainMinGasPrice] = useState(0);
  const [feeHistory, setFeeHistory] = useState(new Array());

  useEffect(async () => {
    setInterval(async () => await onUpdate(), 5000);
  }, []);

  const customWeb3Request = async (web3Provider, method, params) => {
    try {
      return await web3Provider.send(method, params);
    } catch (error) {
      throw new Error(error.body);
    }
  };

  const onUpdate = async () => {
    // Get Web3 Provider
    let web3;
    try {
      switch (network) {
        case "moonbeam":
          web3 = new ethers.providers.StaticJsonRpcProvider("https://rpc.api.moonbeam.network", {
            chainId: 1284,
            name: "moonbeam",
          });
          break;
        case "moonriver":
          web3 = new ethers.providers.StaticJsonRpcProvider(
            "https://rpc.api.moonriver.moonbeam.network",
            {
              chainId: 1285,
              name: "moonriver",
            }
          );
          break;
        case "moonbase":
          web3 = new ethers.providers.StaticJsonRpcProvider(
            "https://rpc.api.moonbase.moonbeam.network",
            {
              chainId: 1287,
              name: "moonbase",
            }
          );
          break;
        case "moonbeam-dev":
          web3 = new ethers.providers.StaticJsonRpcProvider("http://127.0.0.1:9933", {
            chainId: 1281,
            name: "moonbeam-dev",
          });
          break;
        default:
          console.error("Network not supported");
          break;
      }

      // Fetch Latest Block
      const latestBlock = await web3.getBlockNumber();

      setConnected(true);

      // Fetch Latest Block Information
      const blockTxInfo = (await web3.getBlockWithTransactions(latestBlock)).transactions;

      // Loop through tx to get the gas price of each
      let gasPrices = Array();
      for (let i = 0; i < blockTxInfo.length; i++) {
        gasPrices[i] = blockTxInfo[i].gasPrice / ethers.BigNumber.from("1000000000");
      }
      // Get Avg Gas Price, Min Gas Price and Max Gas Price
      let nTxs;
      let avgGasPrice;
      let minGasPrice;
      let maxGasPrice;
      // Check if there are txs in the block
      if (gasPrices.length) {
        nTxs = gasPrices.length;
        // If so, check if there is more than one tx and handle each case
        if (gasPrices.length === 1) {
          avgGasPrice = gasPrices[0];
        } else {
          avgGasPrice = gasPrices.reduce((a, b) => a + b) / gasPrices.length;
        }
        minGasPrice = Math.min.apply(Math, gasPrices);
        maxGasPrice = Math.max.apply(Math, gasPrices);
      } else {
        // If there were no txs, the min gas Price is still valid
        let gasPrice = (await web3.getGasPrice()) / ethers.BigNumber.from("1000000000");
        nTxs = 0;
        avgGasPrice = gasPrice;
        minGasPrice = gasPrice;
        maxGasPrice = gasPrice;
      }

      // Save variables
      setCurrentBlock(latestBlock);
      setNTxs(nTxs);
      setAvgGasPrice(avgGasPrice.toFixed(1));
      setMinGasPrice(minGasPrice.toFixed(1));
      setMaxGasPrice(maxGasPrice.toFixed(1));
      setChainMinGasPrice((await web3.getGasPrice()) / ethers.BigNumber.from("1000000000"));
      setFeeHistory(
        (await customWeb3Request(web3, "eth_feeHistory", ["0x5", "latest"])).baseFeePerGas
      );
    } catch (error) {
      setConnected(false);
    }
  };

  return (
    <Container>
      {connected ? (
        <div>
          <h3>Gas Price from Latest Block {currentBlock}</h3>
          <table className="ui celled table">
            <tbody>
              <tr>
                <td style={{ width: "60%" }}>
                  <b>Number of Txs</b>
                </td>
                <td style={{ textAlign: "right" }}>{nTxs}</td>
              </tr>
              <tr>
                <td style={{ width: "60%" }}>
                  <b>Min. Gas Price of Block</b>
                </td>
                <td style={{ textAlign: "right" }}>{minGasPrice} GWei</td>
              </tr>
              <tr>
                <td style={{ width: "60%" }}>
                  <b>Max. Gas Price of Block</b>
                </td>
                <td style={{ textAlign: "right" }}>{maxGasPrice} GWei</td>
              </tr>
              <tr>
                <td style={{ width: "60%" }}>
                  <b>Avg. Gas Price of Block</b>
                </td>
                <td style={{ textAlign: "right" }}>{avgGasPrice} GWei</td>
              </tr>
              <tr>
                <td style={{ width: "60%" }}>
                  <b>Network Min Gas Price</b>
                </td>
                <td style={{ textAlign: "right" }}>{chainMinGasPrice} GWei</td>
              </tr>
              <tr>
                <td style={{ width: "60%" }}>
                  <b>Fee History Base Fee Per Gas (5 Blocks)</b>
                </td>
                <td style={{ textAlign: "right" }}>{JSON.stringify(feeHistory, null, "\n")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <h4>Network not Available</h4>
      )}
    </Container>
  );
};

export default GasInfo;
