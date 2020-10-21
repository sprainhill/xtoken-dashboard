require('dotenv').config()
const Web3 = require('web3')
const client = require('node-rest-client-promise').Client()
const INFURA_KEY = process.env.INFURA_KEY
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY
const web3 = new Web3(`wss://mainnet.infura.io/ws/v3/${INFURA_KEY}`)
const XSNX_CORE_ADDRESS = process.env.XSNX_CORE_ADDRESS
const etherscan_url = `http://api.etherscan.io/api?module=contract&action=getabi&address=${XSNX_CORE_ADDRESS}&apikey=${ETHERSCAN_KEY}`

let mintEvents

async function getContractAbi() {
  const etherscan_response = await client.getPromise(etherscan_url)
  const CONTRACT_ABI = JSON.parse(etherscan_response.data.result)
  return CONTRACT_ABI
}

async function eventQuery() {
  const CONTRACT_ABI = await getContractAbi()
  // console.log("CONTRACT_ABI : ", CONTRACT_ABI)
  const contract = new web3.eth.Contract(CONTRACT_ABI, XSNX_CORE_ADDRESS)

  // get events between blocks
  const START_BLOCK = 0
  // const END_BLOCK = 7701000

  mintEvents = await contract.getPastEvents("Mint", 
  {
    fromBlock: START_BLOCK,
    toBlock: 'latest' // can also specify 'latest'
  })

  mintEvents = mintEvents.length
  // console.log("mintEvents : ", mintEvents)

  // contract.getPastEvents("Mint", 
  // {
  //   fromBlock: START_BLOCK,
  //   toBlock: 'latest' // can also specify 'latest'
  // })
  // .then(events => {
  //   // console.log("events : ", events)
  //   mintEvents = events.length
  //   // let numMintEvents = mintEvents.length
  // })
  // .catch(err => {
  //   console.log("error : ", err)
  // })

  return mintEvents
}

const getMintEvents = async () => {
  const result = await eventQuery()
  return result
}

(async () => {
  console.log("getMintEvents() : ", getMintEvents())

})()

// getMintEvents()

// // console.log("mintEvents : ", mintEvents)
// console.log("eventQuery() : ", eventQuery())
