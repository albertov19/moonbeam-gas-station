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
      if (this.props.network === "moonriver") {
        web3 = new ethers.providers.StaticJsonRpcProvider(
          "https://rpc.moonriver.moonbeam.network",
          {
            chainId: 1285,
            name: "moonriver",
          }
        );
      } else if (this.props.network === "moonbase") {
        web3 = new ethers.providers.StaticJsonRpcProvider(
          "https://moonbeam-alpha.api.onfinality.io/public",
          {
            chainId: 1287,
            name: "moonbase-alpha",
          }
        );
      } else {
        console.error("Network not supported");
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
      let avgGasPrice = gasPrices.reduce((a, b) => a + b) / gasPrices.length;
      let minGasPrice = Math.min.apply(Math, gasPrices);
      let maxGasPrice = Math.max.apply(Math, gasPrices);

      // Save variables
      this.setState({
        currentBlock: latestBlock,
        avgGasPrice: avgGasPrice.toFixed(1),
        minGasPrice: minGasPrice.toFixed(1),
        maxGasPrice: maxGasPrice.toFixed(1),
      });

      this.intervalID = setTimeout(this.onUpdate.bind(this), 5000);
    } catch (error) {
      console.log(error);
    }
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
