export class SolanaTransactionManager {

  _rpc

  constructor(rpc) {
    this._rpc = rpc
  }

  async analyseTransaction(payer, txn) {

    const simulation = await this.simulateTransaction(txn)
    const fee = await this.estimateFee(txn)

    console.log("simulation", simulation)
    console.log("fee", fee)
  }

  async simulateTransaction(txn) {
    return await this._rpc.simulateTransaction(txn)
  }


  async estimateFee(txn) {
    return await txn.getEstimatedFee(this._rpc)
  }

}


export class SimulationResult {
  fee = 0; //Lamports

  siteStats = {};

  inputAmounts = {}
  outputAmounts = {}

  instructionCount = 0
}
