import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';

import * as ethers from 'ethers';

const GasInfo = ({ network }) => {
  // Initial State
  const [connected, setConnected] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(BigInt(0));
  const [nTxs, setNTxs] = useState(BigInt(0));
  const [avgGasPrice, setAvgGasPrice] = useState(BigInt(0));
  const [baseFee, setBaseFee] = useState(BigInt(0));
  const [maxGasPrice, setMaxGasPrice] = useState(BigInt(0));
  const [feeHistory, setFeeHistory] = useState(new Array());
  const [blockUsed, setBlockUsed] = useState(BigInt(0));
  const [txPoolPending, setTxPoolPending] = useState(BigInt(0));
  const [txPoolQueued, setTxPoolQueued] = useState(BigInt(0));

  useEffect(() => {
    onUpdate();
    const intervalID = setInterval(() => onUpdate(), 6000);
    return () => {
      clearInterval(intervalID);
    };
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
        case 'moonbeam':
          web3 = new ethers.providers.StaticJsonRpcProvider(
            'https://moonbeam.unitedbloc.com',
            {
              chainId: 1284,
              name: 'moonbeam',
            }
          );
          break;
        case 'moonriver':
          web3 = new ethers.providers.StaticJsonRpcProvider(
            'https://moonriver.unitedbloc.com',
            {
              chainId: 1285,
              name: 'moonriver',
            }
          );
          break;
        case 'moonbase':
          web3 = new ethers.providers.StaticJsonRpcProvider(
            'https://moonbase.unitedbloc.com',
            {
              chainId: 1287,
              name: 'moonbase',
            }
          );
          break;
        case 'moonbeam-dev':
          web3 = new ethers.providers.StaticJsonRpcProvider(
            'http://127.0.0.1:9933',
            {
              chainId: 1281,
              name: 'moonbeam-dev',
            }
          );
          break;
        default:
          console.error('Network not supported');
          break;
      }

      // Fetch Latest Block
      const latestBlock = await web3.getBlockNumber();

      setConnected(true);

      // Fetch Latest Block Information
      const blockInfo = await web3.getBlockWithTransactions(latestBlock);
      const blockUsed =
        (BigInt('100') * BigInt(blockInfo.gasUsed)) /
        BigInt(blockInfo.gasLimit);
      const blockTxInfo = blockInfo.transactions;

      // Base Fee
      let baseFee =
        (BigInt(1000) * BigInt(blockInfo.baseFeePerGas)) / BigInt('1000000000');

      // Loop through tx to get the gas price of each
      let gasPrices = Array();
      for (let i = 0; i < blockTxInfo.length; i++) {
        gasPrices[i] = Number(
          BigInt(blockTxInfo[i].gasPrice) / BigInt('1000000000')
        );
      }
      // Get Avg Gas Price, Min Gas Price and Max Gas Price
      let nTxs;
      let avgGasPrice: BigInt;
      let maxGasPrice: BigInt;
      // Check if there are txs in the block
      if (gasPrices.length) {
        nTxs = gasPrices.length;
        // If so, check if there is more than one tx and handle each case
        if (gasPrices.length === 1) {
          avgGasPrice = BigInt(1000) * BigInt(gasPrices[0]);
        } else {
          avgGasPrice = BigInt(
            Math.trunc(
              (1000 * gasPrices.reduce((a, b) => a + b)) / gasPrices.length
            )
          );
        }
        maxGasPrice = BigInt(1000) * BigInt(Math.max.apply(Math, gasPrices));
      } else {
        // If there were no txs, the min gas Price is still valid
        let gasPrice = BigInt(await web3.getGasPrice()) / BigInt('1000000000');
        nTxs = 0;
        avgGasPrice = BigInt(1000) * gasPrice;
        maxGasPrice = BigInt(1000) * gasPrice;
      }

      // Get Tx Pool Status
      const txPoolStatus = await web3.send('txpool_status');

      // Save variables
      setCurrentBlock(latestBlock);
      setBlockUsed(blockUsed);
      setBaseFee(baseFee);
      setNTxs(nTxs);
      setAvgGasPrice(
        (BigInt(1000) * BigInt(gasPrices.reduce((a, b) => a + b))) /
          BigInt(gasPrices.length)
      );
      setMaxGasPrice(maxGasPrice);
      setTxPoolPending(BigInt(txPoolStatus.pending));
      setTxPoolPending(BigInt(txPoolStatus.queued));

      setFeeHistory(
        (await customWeb3Request(web3, 'eth_feeHistory', ['0x5', 'latest']))
          .baseFeePerGas
      );
    } catch (error) {
      console.error(error);
      setConnected(false);
    }
  };

  return (
    <Container>
      {connected ? (
        <div>
          <h3>Gas Price from Latest Block {currentBlock.toString()}</h3>
          <table className='ui celled table'>
            <tbody>
              <tr>
                <td style={{ width: '50%' }}>
                  <b>Number of Txs</b>
                </td>
                <td style={{ textAlign: 'right' }}>{nTxs.toString()}</td>
              </tr>
              <tr>
                <td style={{ width: '50%' }}>
                  <b>% of Block Used</b>
                </td>
                <td style={{ textAlign: 'right' }}>{blockUsed.toString()} %</td>
              </tr>
              <tr>
                <td style={{ width: '50%' }}>
                  <b>Base Fee</b>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {(Number(baseFee) / 1000).toPrecision(4)} GWei
                </td>
              </tr>
              <tr>
                <td style={{ width: '50%' }}>
                  <b>Max. Gas Price of Block</b>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {(Number(maxGasPrice) / 1000).toPrecision(4)} GWei
                </td>
              </tr>
              <tr>
                <td style={{ width: '50%' }}>
                  <b>Avg. Gas Price of Block</b>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {(Number(avgGasPrice) / 1000).toPrecision(4)} GWei
                </td>
              </tr>
              <tr>
                <td style={{ width: '50%' }}>
                  <b>Tx Pool Pending</b>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {txPoolPending.toString()}
                </td>
              </tr>
              <tr>
                <td style={{ width: '50%' }}>
                  <b>Tx Pool Queued</b>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {txPoolQueued.toString()}
                </td>
              </tr>
              <tr>
                <td style={{ width: '50%' }}>
                  <b>Fee History Base Fee Per Gas (5 Blocks)</b>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {JSON.stringify(feeHistory, null, '\n')}
                </td>
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
