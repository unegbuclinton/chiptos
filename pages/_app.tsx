import { useEffect, useState } from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useW3MProvider, useW3MState, useW3MContext } from '../hooks/useW3M'
import createDebug from 'debug'
import axios from 'axios'
import PATHS from 'lib/api-paths'
import { ThemeProvider } from 'theme-ui'
import Globals from 'theme/Globals'
import theme from 'theme'
import { SkeletonTheme } from 'react-loading-skeleton'

import { Network, Alchemy } from "alchemy-sdk";



import contractDataMap from '@lib/contractDataMap'
import env from '@lib/env'

import Navbar from '@components/Navbar'
import Footer from '@components/Footer'

import useDataStore, { E_Views } from 'store/dataStore'

const log = createDebug('chiptos:app')




const settings = {
  apiKey: env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);


function MyApp({ Component, pageProps }: AppProps) {
  const providerOptions = {}

  const store_contractData = useDataStore(s => s.contractData)
  const store_currentContract = useDataStore(s => s.currentContract)

  const store_allLoaded = useDataStore(s => s.allLoaded)
  const store_setAllLoaded = useDataStore(s => s.setAllLoaded)

  const store_loading = useDataStore(s => s.loading)
  const store_setLoading = useDataStore(s => s.setLoading)

  const store_setContractData = useDataStore(s => s.setContractData)

  const store_setCurrentView = useDataStore(s => s.setCurrentView)

  const store_personalData = useDataStore(s => s.personalData)
  const store_setPersonalData = useDataStore(s => s.setPersonalData)

  const store_initSuccess = useDataStore(s => s.initSuccess)
  const store_setInitSuccess = useDataStore(s => s.setInitSuccess)
  
  const store_partialInitSuccess = useDataStore(s => s.partialInitSuccess)
  const store_setPartialInitSuccess = useDataStore(s => s.setPartialInitSuccess)


  // const testInit = () => {
  //   console.log('INIT!!!')
  //   store_setLoading(true)

  //   setTimeout(()=>{
  //     store_setLoading(false)
  //   }, 2000)
  // }

  //&                                                                           
  const handleInit = async () => {
    if(store_initSuccess){
      return;
    }
    // setState({...state, loading: true})
    const total_contracts = Object.entries(contractDataMap).length
    
    if(!store_partialInitSuccess){
      store_setLoading(true)
      //& get first page data                                                       
      await Promise.all(Object.entries(contractDataMap).map(async (ctr:any, ctr_idx:number) => {

        const CTR_NAME = ctr[0]
        const CTR_ADDR = ctr[1]

        if(!CTR_ADDR || CTR_ADDR.trim() === ''){
          return false
        }

        let tempAssetArray:any = []

        let asset_contract = null
        let collection = null
        let permalink = null
        let tempData:any = store_contractData
        let traitMap:any = {}



        let REQ = await axios.get(`https://api.opensea.io/api/v1/assets?order_direction=asc&asset_contract_address=${CTR_ADDR}&limit=200&include_orders=false`,{
          headers: { 
            'X-API-KEY': env.OPENSEA_API_KEY
          }
        })
  
        if(REQ.status != 200){
          console.log('error with request:', REQ)
          return;
        }

        if(!asset_contract || !collection || !permalink){
          asset_contract = REQ.data.assets[0].asset_contract
          collection = REQ.data.assets[0].collection
          permalink = REQ.data.assets[0].permalink
        }

        REQ.data.assets.forEach((ass:any) => {
          tempAssetArray.unshift({...ass, asset_contract: CTR_ADDR, permalink: '---', collection: '---'})
          ass.traits.forEach((trait:any) => {
            if(!(trait.trait_type in traitMap)){
              traitMap[trait.trait_type] = [trait.value]
            }else{
              if(!traitMap[trait.trait_type].includes(trait.value)){
                traitMap[trait.trait_type].push(trait.value)
              }
            }
          })
        })


        // "traits": [
        //   {
        //     "trait_type": "Board",
        //     "value": "Red",
        //     "display_type": null,
        //     "max_value": null,
        //     "trait_count": 78,
        //     "order": null
        //   },

        // let t = {
        //   'Board': [
        //     'red'
        //   ]
        // }


        tempData[CTR_NAME] = {
          asset_count: tempAssetArray.length,
          next: REQ.data.next,
          previous: REQ.data.previous,
          current_index: 0,
                                                                                                  //! cross-browser compat sort ? 1 : -1
          assets: tempAssetArray.sort((a:any, b:any) => {
            if(parseInt(a.token_id) > parseInt(b.token_id)){
              // console.log(`SORT 1 | a(${a.token_id}|${parseInt(a.token_id)}) > b(${b.token_id}|${parseInt(b.token_id)})`)
              return 1
            }else{
              // console.log(`SORT 1 | a(${a.token_id}|${parseInt(a.token_id)}) < b(${b.token_id}|${parseInt(b.token_id)})`)
              return -1
            }
          }),
          collection,
          asset_contract,
          permalink,
          trait_map: traitMap,
        }


        // setState({...state, contractData: tempData})
        await store_setContractData(tempData)
      }))

      // setState({...state, loading: false})
      store_setLoading(false)
      store_setPartialInitSuccess(true)
      console.log('Partial init success')
    }else{
      console.log('Skipping partial init...')
    }





    // //& get next page data                                                      
    await Promise.all(Object.entries(contractDataMap).map(async (ctr:any, ctr_idx:number) => {

      const CTR_NAME = ctr[0]
      const CTR_ADDR = ctr[1]

      if(!CTR_ADDR || CTR_ADDR.trim() === ''){
        return false
      }

      if(!store_contractData[CTR_NAME]){
        console.log(`No contractData found for ctr: ${CTR_NAME}`)
        return
      }

      let nextDataCursor:any = store_contractData[CTR_NAME].previous
      let tempAssetArray:any = store_contractData[CTR_NAME].assets
      let tempData:any = store_contractData
      let traitMap:any = store_contractData[CTR_NAME].trait_map


      // const {data} = await axios.get(`https://api.opensea.io/api/v1/assets?order_direction=desc&asset_contract_address=${CTR_ADDR}&limit=20&include_orders=false`,{
        let REQ:any = null
        
      const getNextPage = async () => {

        REQ = await axios.get(`https://api.opensea.io/api/v1/assets?order_direction=desc&asset_contract_address=${CTR_ADDR}&limit=200&include_orders=false&cursor=${nextDataCursor}`,{
          headers: { 
            'X-API-KEY': env.OPENSEA_API_KEY
          }
        })
     

        if(REQ.status != 200){
          console.log('error with request:', REQ)
          return;
        }

  
        REQ.data.assets.forEach((ass:any) => {
          tempAssetArray.unshift({...ass, asset_contract: CTR_ADDR, permalink: '---', collection: '---'})
          ass.traits.forEach((trait:any) => {
            if(!(trait.trait_type in traitMap)){
              traitMap[trait.trait_type] = [trait.value]
            }else{
              if(!traitMap[trait.trait_type].includes(trait.value)){
                traitMap[trait.trait_type].push(trait.value)
              }
            }
          })
        })

        if(REQ.data.previous && REQ.data.previous !== ''){
          nextDataCursor = REQ.data.previous
          // console.log('found prev:', REQ.data.previous)
          console.log('Getting next page...')
          await getNextPage()
        }

      }
      if(nextDataCursor){
        await getNextPage()
      }else{
        console.log('No nextDataCursor found....')
      }

      tempData[CTR_NAME] = {
        ...tempData[CTR_NAME],
        //! cross-browser compat sort ? 1 : -1
        assets: tempAssetArray.sort((a:any, b:any) => {
          if(parseInt(a.token_id) > parseInt(b.token_id)){
            // console.log(`SORT 2 | a(${a.token_id}|${parseInt(a.token_id)}) > b(${b.token_id}|${parseInt(b.token_id)})`)
            return 1
          }else{
            // console.log(`SORT 2 | a(${a.token_id}|${parseInt(a.token_id)}) < b(${b.token_id}|${parseInt(b.token_id)})`)
            return -1
          }
        }),
      }


      // setState({...state, contractData: tempData})
      store_setContractData(tempData)
    }))


    store_setAllLoaded(true)
    store_setInitSuccess(true)
    console.log('ALL LOADED : INIT SUCCESS')


    // setState({...state, loading: false})
  }


  //&                                                                           
  const handleConnect = async ({address}) => {
    console.log('CONNECT | connected:', address)
    store_setCurrentView(E_Views.PERSONAL)
    store_setLoading(true)

    let data = await alchemy.nft.getNftsForOwner(address)

    const ownershipData:any = {}
    const existingContracts = Object.values(contractDataMap)

    data.ownedNfts.forEach((nft:any) => {
      if(existingContracts.includes(nft.contract.address)){
        if(nft.contract.address in ownershipData){
          ownershipData[nft.contract.address].push(nft.tokenId)
        }else{
          ownershipData[nft.contract.address] = [nft.tokenId]
        }
      }
    })

    console.log('ownership:', ownershipData)

    let personalData:any = {}

    Object.entries(store_contractData).forEach((ctr:any, ctr_idx:number) => {
      let CTR_NAME = ctr[0]
      let CTR_DATA = ctr[1]

      personalData[CTR_NAME] = {
        assets: []
      }

      
      
      let arrayOfOwnedTokenIds = ownershipData[contractDataMap[CTR_NAME]]

      if(!(contractDataMap[CTR_NAME] in ownershipData) || !arrayOfOwnedTokenIds){
        console.log(`CONNECT | User owns no tokens in ${CTR_NAME}`)
        return
      }

      console.log(`CONNECT | owned tokens in "${CTR_NAME}" : ${arrayOfOwnedTokenIds}`)

      // personalData[CTR_NAME].assets = CTR_DATA.assets.filter((ast:any) => 
        // arrayOfOwnedTokenIds.includes(ast.token_id)
      // )
      
      CTR_DATA.assets.forEach((ast:any, ast_idx:number) => {
        if(arrayOfOwnedTokenIds.includes(ast.token_id)){
          console.log(`CONNECT | Found owned token: ${ast.token_id}`)
          personalData[CTR_NAME].assets.push(ast)
        }else{
          console.log(`CONNECT | Not owned token: ${ast.token_id} => ${arrayOfOwnedTokenIds}`)
        }
      })

    })

    console.log('CONNECT | personalData:', personalData)

    store_setPersonalData(personalData)


    store_setLoading(false)
  }




  //&                                                                           
  const W3MProvider = useW3MProvider({
    // initialState: {
    //   ensName: null,
    //   currentContract: 'Chiptos 512',
    //   currentToken: null,
    //   currentView: 'FULL', // FULL, PERSONAL, SINGLE,
    //   filterActive: false,
    //   contractData: {}
    // },
    debug: false,
    providerOptions,
    reconnect: true,
    // requireSign: true,
    // signMessage: 'CHIPTOS COLLECTOR | Sign a message to verify your address',
    // verify: performVerification,
    onInit: handleInit,
    // onConnect: handleConnect,
    onDisconnect: () => {
      store_setPersonalData({})
      store_setCurrentView(E_Views.FULL)
    },
    // onAccountChange: (ctx) => console.log('ON ACCOUNT CHANGE:', ctx),
    // onNetworkChange: (ctx) => console.log('ON NETWORK CHANGE:', ctx),
  })


  //&                                                                           
  return (
    <ThemeProvider theme={theme} >
      <Globals />
      <SkeletonTheme baseColor='#222' highlightColor='#444'>
        <W3MProvider>
          <div className='container'>
            <Navbar />
            <div className='container-inner'>
              <Component {...pageProps} />
            </div>
            <Footer />
          </div>
        </W3MProvider>
      </SkeletonTheme>
    </ThemeProvider>
  )
}

export default MyApp
