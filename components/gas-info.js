import React, { Component } from "react";
import * as ethers from "ethers";

class GasInfo extends Component {
  static async getInitialProps() {
    onUpdate();
  }

  // Initial State
  state = {
    currentBlock: 0,
    avgGasPrice: 0,
    minGasPrice: 0,
    maxGasPrice: 0,
  };

  async componentDidMount() {
    await this.onUpdate();
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  onUpdate = async () => {
    try {
      // Get Web3 Provider
      let web3;
      if (this.props.network === "moonbeam") {
        web3 = new ethers.providers.StaticJsonRpcProvider("https://rpc.api.moonbeam.network", {
          chainId: 1284,
          name: "moonbeam",
        });
      } else if (this.props.network === "moonriver") {
        web3 = new ethers.providers.StaticJsonRpcProvider(
          "https://rpc.api.moonriver.moonbeam.network",
          {
            chainId: 1285,
            name: "moonriver",
          }
        );
      } else if (this.props.network === "moonbase") {
        web3 = new ethers.providers.StaticJsonRpcProvider(
          "https://rpc.api.moonbase.moonbeam.network",
          {
            chainId: 1287,
            name: "moonbase-alpha",
          }
        );
      } else {
        console.log("Network not supported");
      }

      // Fetch Latest Block
      const latestBlock = await web3.getBlockNumber();

      // Fetch Latest Block Information
      const blockTxInfo = (await web3.getBlockWithTransactions(latestBlock)).transactions;

      // Loop through tx to get the gas price of each
      let gasPrices = Array();
      for (let i = 0; i < blockTxInfo.length - 1; i++) {
        gasPrices[i] = blockTxInfo[i].gasPrice / ethers.BigNumber.from("1000000000");
      }
      // Get Avg Gas Price, Min Gas Price and Max Gas Price
      let avgGasPrice;
      let minGasPrice;
      let maxGasPrice;
      // Check if there are txs in the block
      if (gasPrices.length) {
        // If so, check if there is more than one tx and handle each case
        if (gasPrices.length === 0) {
          avgGasPrice = gasPrices[0];
        } else {
          avgGasPrice = gasPrices.reduce((a, b) => a + b) / gasPrices.length;
        }
        minGasPrice = Math.min.apply(Math, gasPrices);
        maxGasPrice = Math.max.apply(Math, gasPrices);
      } else {
        // If there were no txs, the min gas Price is still valid
        let gasPrice = (await web3.getGasPrice()) / ethers.BigNumber.from("1000000000");
        avgGasPrice = gasPrice;
        minGasPrice = gasPrice;
        maxGasPrice = gasPrice;
      }

      // Save variables
      this.setState({
        currentBlock: latestBlock,
        avgGasPrice: avgGasPrice.toFixed(1),
        minGasPrice: minGasPrice.toFixed(1),
        maxGasPrice: maxGasPrice.toFixed(1),
      });
    } catch (error) {
      console.log(error);
    }
    this.intervalID = setTimeout(this.onUpdate.bind(this), 5000);
  };

  render() {
    return (
      <div>
        <h3>Gas Price from Latest Block {this.state.currentBlock}</h3>
        <table className="ui celled table">
          <tbody>
            <tr>
              <td style={{ width: "60%" }}>
                <b>Min. Gas Price of Block</b>
              </td>
              <td style={{ textAlign: "right" }}>{this.state.minGasPrice} GWei</td>
            </tr>
            <tr>
              <td style={{ width: "60%" }}>
                <b>Max. Gas Price of Block</b>
              </td>
              <td style={{ textAlign: "right" }}>{this.state.maxGasPrice} GWei</td>
            </tr>
            <tr>
              <td style={{ width: "60%" }}>
                <b>Avg. Gas Price of Block</b>
              </td>
              <td style={{ textAlign: "right" }}>{this.state.avgGasPrice} GWei</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default GasInfo;
