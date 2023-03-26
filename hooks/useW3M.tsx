import React, { useState, useContext, createContext, useEffect, useRef, useMemo } from "react";
import Web3 from "web3";
import { Web3Provider as IMPORTED_WEB_3_PROVIDER } from "@ethersproject/providers";
import IMPORTED_WEB_3_MODAL from "web3modal";
import EventEmitter from "events";


//+ ///////////////////////////////////////////////////////////////  INTERFACES

export interface IContextProviderProps {
  children?: any;
}

export interface ICreateProviderConfig {
  /** Run in debug mode */
  debug?: boolean;
  /** Initial state  */
  initialState?: object;
  /** Custom provider options object to override defaults */
  providerOptions?: any;
  /** Verification callback. Fires on connection change */
  verify?: Function;
  /** Auto reconnect on mount */
  reconnect?: boolean;

  /** Callback invoked on connecting event */
  onConnecting?: Function;
  /** Callback invoked on connect event */
  onConnect?: Function;
  /** Callback invoked on disconnect event */
  onDisconnect?: Function;
  /** Callback invoked on account change event */
  onAccountChange?: Function;
  /** Callback invoked on network change event */
  onNetworkChange?: Function;

  /** Callback invoked on network change event */
  onVerifying?: Function;
  /** Callback invoked on network change event */
  onVerified?: Function;
  /** Callback invoked on network change event */
  onVerifyFail?: Function;

  /** Callback invoked on network change event */
  onSigning?: Function;
  /** Callback invoked on network change event */
  onSigned?: Function;
  /** Callback invoked on network change event */
  onSignFail?: Function;

  /** Callback invoked once on hook init */
  onInit?: Function;


  /** Require a signed message to confirm user address */
  requireSign?: boolean;
  /** Custom message to show on wallet sign */
  signMessage?: string;
}

export interface ICreateStateConfig {
	/** Run in debug mode */
	debug?: boolean;
	/** Custom provider options object to override defaults */
	providerOptions?: any;
	/** Verification callback. Fires on connection change */
	verify?: Function;
	/** Auto reconnect on mount */
	reconnect?: boolean;
  
	/** Callback invoked on connecting event */
	onConnecting?: Function;
	/** Callback invoked on connect event */
	onConnect?: Function;
	/** Callback invoked on disconnect event */
	onDisconnect?: Function;
	/** Callback invoked on account change event */
	onAccountChange?: Function;
	/** Callback invoked on network change event */
	onNetworkChange?: Function;
  
	/** Callback invoked on network change event */
	onVerifying?: Function;
	/** Callback invoked on network change event */
	onVerified?: Function;
	/** Callback invoked on network change event */
	onVerifyFail?: Function;
  
	/** Callback invoked on network change event */
	onSigning?: Function;
	/** Callback invoked on network change event */
	onSigned?: Function;
	/** Callback invoked on network change event */
	onSignFail?: Function;
  
  
	/** Require a signed message to confirm user address */
	requireSign?: boolean;
	/** Custom message to show on wallet sign */
	signMessage?: string;
  }

export enum EventTypes {
	CONNECTING = 'CONNECTING',
	CONNECTED = "CONNECTED",
	DISCONNECTED = "DISCONNECTED",
	ACCOUNT_CHANGED = "ACCOUNT_CHANGED",
	NETWORK_CHANGED = "NETWORK_CHANGED",
	SIGNING = 'SIGNING',
	SIGNED = 'SIGNED',
	SIGN_FAIL = 'SIGN_FAIL',
	VERIFYING = 'VERIFYING',
	VERIFIED = 'VERIFIED',
	VERIFY_FAIL = 'VERIFY_FAIL',
}

export enum ConnectionStatus {
	NOT_CONNECTED = 'NOT_CONNECTED',
	CONNECTING = 'CONNECTING',
	CONNECTED = 'CONNECTED',
	DISCONNECTED = 'DISCONNECTED',
	SIGNING = 'SIGNING',
	VERIFYING = 'VERIFYING',
}



//+/////////////////////////////////////////////////////////////////////  UTILS
const supportedChains: any[] = [
  {
    name: "Unknown Network",
    short_name: "UNK",
    chain: "ETH",
    network: "local",
    chain_id: -1,
    network_id: -1,
    rpc_url: "http://localhost:8545",
    native_currency: {
      symbol: "ETH",
      name: "Ethereum",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
  {
    name: "Ethereum Mainnet",
    short_name: "eth",
    chain: "ETH",
    network: "mainnet",
    chain_id: 1,
    network_id: 1,
    rpc_url: "https://mainnet.infura.io/v3/%API_KEY%",
    native_currency: {
      symbol: "ETH",
      name: "Ethereum",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
    explorer: "https://etherscan.io/",
  },
  {
    name: "Ethereum Ropsten",
    short_name: "rop",
    chain: "ETH",
    network: "ropsten",
    chain_id: 3,
    network_id: 3,
    rpc_url: "https://ropsten.infura.io/v3/%API_KEY%",
    native_currency: {
      symbol: "ETH",
      name: "Ethereum",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
    explorer: "https://ropsten.etherscan.io/",
  },
  {
    name: "Ethereum Rinkeby",
    short_name: "rin",
    chain: "ETH",
    network: "rinkeby",
    chain_id: 4,
    network_id: 4,
    rpc_url: `https://rinkeby.infura.io/v3/%API_KEY%`,
    native_currency: {
      symbol: "ETH",
      name: "Ethereum",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
    explorer: "https://rinkeby.etherscan.io/",
  },
  {
    name: "Ethereum Görli",
    short_name: "gor",
    chain: "ETH",
    network: "goerli",
    chain_id: 5,
    network_id: 5,
    rpc_url: "https://goerli.infura.io/v3/%API_KEY%",
    native_currency: {
      symbol: "ETH",
      name: "Ethereum",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
  {
    name: "RSK Mainnet",
    short_name: "rsk",
    chain: "RSK",
    network: "mainnet",
    chain_id: 30,
    network_id: 30,
    rpc_url: "https://public-node.rsk.co",
    native_currency: {
      symbol: "RSK",
      name: "RSK",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
  {
    name: "Ethereum Kovan",
    short_name: "kov",
    chain: "ETH",
    network: "kovan",
    chain_id: 42,
    network_id: 42,
    rpc_url: "https://kovan.infura.io/v3/%API_KEY%",
    native_currency: {
      symbol: "ETH",
      name: "Ethereum",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
    explorer: "https://kovan.etherscan.io/",
  },
  {
    name: "Ethereum Classic Mainnet",
    short_name: "etc",
    chain: "ETC",
    network: "mainnet",
    chain_id: 61,
    network_id: 1,
    rpc_url: "https://ethereumclassic.network",
    native_currency: {
      symbol: "ETH",
      name: "Ethereum",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
  {
    name: "POA Network Sokol",
    short_name: "poa",
    chain: "POA",
    network: "sokol",
    chain_id: 77,
    network_id: 77,
    rpc_url: "https://sokol.poa.network",
    native_currency: {
      symbol: "POA",
      name: "POA",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
  {
    name: "POA Network Core",
    short_name: "skl",
    chain: "POA",
    network: "core",
    chain_id: 99,
    network_id: 99,
    rpc_url: "https://core.poa.network",
    native_currency: {
      symbol: "POA",
      name: "POA",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
  {
    name: "xDAI Chain",
    short_name: "xdai",
    chain: "POA",
    network: "dai",
    chain_id: 100,
    network_id: 100,
    rpc_url: "https://dai.poa.network",
    native_currency: {
      symbol: "xDAI",
      name: "xDAI",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
  {
    name: "Callisto Mainnet",
    short_name: "clo",
    chain: "callisto",
    network: "mainnet",
    chain_id: 820,
    network_id: 1,
    rpc_url: "https://clo-geth.0xinfra.com/",
    native_currency: {
      symbol: "CLO",
      name: "CLO",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
  {
    name: "Binance Smart Chain",
    short_name: "bsc",
    chain: "smartchain",
    network: "mainnet",
    chain_id: 56,
    network_id: 56,
    rpc_url: "https://bsc-dataseed1.defibit.io/",
    native_currency: {
      symbol: "BNB",
      name: "BNB",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
];

function getChainData(chainId: number): any {
  let chainData = supportedChains.filter(
    (chain: any) => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    chainData = supportedChains[0];
  }

  const API_KEY = process.env.REACT_APP_INFURA_ID;

  if (
    chainData.rpc_url.includes("infura.io") &&
    chainData.rpc_url.includes("%API_KEY%") &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl,
    };
  }

  return chainData;
}
//+ ////////////////////////////////////////////////////////////////////////////


// type IW3MContextReturn = {
// 	Provider: any;
// 	Consumer: any;
// 	onEvent: EventTypes;
// }

// const initalContext:any = {}
// const W3MCTX = createContext(initalContext);

// export const useW3MContext: () => any = () => {
//   return useContext(W3MCTX);
// };

/**
 * useW3M
 * 
 * This is a stateful web3modal controller that returns a provider with state
 * included
 * @param config 
 * @returns ContextProvider
 */
export const useW3MProvider = (config: ICreateProviderConfig) => {
	const connectionAbandoned = useRef(false);
	const connectionInProgress = useRef(false);
	const wasInitialized = useRef(false);
	const currentStatus = useRef(ConnectionStatus.NOT_CONNECTED);

	const CONSTANTS: any = {
		GLOBAL_WEB_3_MODAL: null,
		GLOBAL_WEB_3_PROVIDER: null,
		PROVIDER: null,
		LIBRARY: null,
		NETWORK: null,
		ADDRESS: null,
		CHAIN_ID: null,
		CHAIN_NAME: null,
		SSKEY_WAS_CONNECTED: "W3M_WAS_CONNECTED",
		SSKEY_SHOULD_RECONNECT: "W3M_SHOULD_RECONNECT",
		DEFAULT_CONTEXT: {
		status: ConnectionStatus.NOT_CONNECTED,
		chainId: null,
		address: null,
		connected: false,
		connecting: false,
		reconnect: config.reconnect ? config.reconnect : false,
		signed: null,
		verificationResult: null,
		},
	};



	const [ctx, setCtx] = useState(CONSTANTS.DEFAULT_CONTEXT);
	const [state, setState] = useState(config.initialState || null);

	const toggleReconnect = (bool: boolean) => {
		if (typeof window !== "undefined" && window.sessionStorage) {
		sessionStorage.setItem("W3M_SHOULD_RECONNECT", bool.toString());
		setCtx({ ...ctx, reconnect: bool });
		}
	};

	/** Console log an item if func in debug mode */
	const debug = (...msg: any) => {
		config.debug && console.log('W3M |',...msg);
	};
















  	//+ ///////////////////////////////////////////////////////////////////////
  	//+ //////////////////////////////////////////////////////////////  FIRE CB

	const e = useMemo(()=> new EventEmitter(),[])
	/**
	 * events??
	 * @param event EventTypes
	 * @param cb 
	 * @returns 
	 */
	const onEvent = (event:EventTypes, cb:(...args: any[]) => void) => e.on(event, cb)

	const [trigger_onConnecting, emitConnecting] = useState(false);
	const [trigger_onConnect, emitConnect] = useState(false);
	const [trigger_onDisconnect, emitDisconnect] = useState(false);
	const [trigger_accountChange, emitAccountChange] = useState(false);
	const [trigger_onNetworkChange, emitNetworkChange] = useState(false);
	const [trigger_onVerifying, emitVerifying] = useState(false);
	const [trigger_onVerified, emitVerified] = useState(false);
	const [trigger_onVerifyFail, emitVerifyFail] = useState(false);
	const [trigger_onSigning, emitSigning] = useState(false);
	const [trigger_onSigned, emitSigned] = useState(false);
	const [trigger_onSignFail, emitSignFail] = useState(false);
	const [trigger_init, emitInit] = useState(false);


	useEffect(() => {
		const args = {...ctx, state, setState, Provider: CONSTANTS.PROVIDER}

		if (trigger_onConnect) {
			e.emit(EventTypes.CONNECTED, args);
			emitConnect(false);
			config.onConnect && config.onConnect(args)
		}

		if (trigger_onDisconnect) {
			e.emit(EventTypes.DISCONNECTED, args);
			emitDisconnect(false);
			config.onDisconnect && config.onDisconnect(args)
		}

		if (trigger_accountChange) {
			e.emit(EventTypes.ACCOUNT_CHANGED, args);
			emitAccountChange(false);
			config.onAccountChange && config.onAccountChange(args);
		}

		if (trigger_onNetworkChange) {
			e.emit(EventTypes.NETWORK_CHANGED, args);
			emitNetworkChange(false);
			config.onNetworkChange && config.onNetworkChange(args);
		}

		if (trigger_onConnecting) {
			e.emit(EventTypes.CONNECTING, args);
			emitConnecting(false);
			config.onConnecting && config.onConnecting(args);
		}

		if (trigger_onSigning) {
			e.emit(EventTypes.SIGNING, args);
			emitSigning(false);
			config.onSigning && config.onSigning(args);
		}

		if (trigger_onSigned) {
			e.emit(EventTypes.SIGNED, args);
			emitSigned(false);
			config.onSigned && config.onSigned(args);
		}

		if (trigger_onSignFail) {
			e.emit(EventTypes.SIGN_FAIL, args);
			emitSignFail(false);
			config.onSignFail && config.onSignFail(args);
		}

		if (trigger_onVerifying) {
			e.emit(EventTypes.VERIFYING, args);
			emitVerifying(false);
			config.onVerifying && config.onVerifying(args);
		}

		if (trigger_onVerified) {
			e.emit(EventTypes.VERIFIED, args);
			emitVerified(false);
			config.onVerified && config.onVerified(args);
		}

		if (trigger_onVerifyFail) {
			e.emit(EventTypes.VERIFY_FAIL, args);
			emitVerifyFail(false);
			config.onVerifyFail && config.onVerifyFail(args);
		}

		if (trigger_init) {
			emitInit(false);
			config.onInit && config.onInit(args);
		}
	}, [
		config, ctx, e,
		trigger_onNetworkChange, 
		trigger_accountChange, 
		trigger_onDisconnect, 
		trigger_onConnect,
		trigger_onConnecting,
		trigger_onSigning,
		trigger_onSigned,
		trigger_onSignFail,
		trigger_onVerifying,
		trigger_onVerified,
		trigger_onVerifyFail,
		trigger_init,
	]);








  	//+ ///////////////////////////////////////////////////////////////////////
	//+ ///////////////////////////////////////////////////////////  CONNECTION

	const verifyAddress = async (
		_address: string,
		_msg?: string
	): Promise<boolean> => {
		if (connectionAbandoned.current) {
			// console.log('connection abandoned........')
			resetApp();
			return false;
		}

		let globalSignature;
		let msg = _msg ? _msg : "Sign a message to verify address...?";
		const web3 = new Web3(Web3.givenProvider);

		// attempt to sign a message thru metamask
		// does this work thru any provider?
		const signMessage = async () => {
			// console.log('verifyAddress | signMessage | provider:', window.ethereum)
			try {
				const from = _address;
				const ethereum:any = window.ethereum;
				const sign = await ethereum.request({
					method: "personal_sign",
					params: [msg, from, "Random text"],
				});
				globalSignature = sign;
			} catch (err) {
				console.error(err);
				return false
			}
		};

		// use web3.eth to verify the signature and check the address returned
		// from the verification process against the address passed as arg
		const verifyMessage = async () => {
			try {
				const from = _address;
				const recoveredAddr = web3.eth.accounts.recover(msg, globalSignature);
				if (!recoveredAddr) return false;

				// console.log('verifyAddress | recoveredAddr : ' + recoveredAddr);

				if (recoveredAddr.toLowerCase() === from.toLowerCase()) {
					// console.log(`verifyAddress | Success: ${recoveredAddr}`);
					//! should really just return true here
					return _address;
				} else {
					// console.log(`verifyAddress | Failed to verify message:${recoveredAddr} vs ${from}`,);
					return false;
				}
			} catch (err) {
				// console.log(`verifyAddress | error:`,err);
				debug("verify address error:", err);
				return false;
			}
		};

		try {
		if (connectionAbandoned.current) {
			// console.log('connection abandoned........')
			resetApp();
			return false;
		}
		await signMessage();
		let verifiedAddress = await verifyMessage();

		if (!verifiedAddress) {
			// console.log('verifyAddress | Address could not be verified')
			return false;
		}

		return true;
		} catch (err) {
		// console.log(err)
		debug("verifyMessage | verify message error:", err);
		return false;
		}
	};




	//--------------------------------------------------------------------------
	const handleVerify = async () => {
		if (connectionAbandoned.current) {
			debug('handleVerify | abandoned...')
			resetApp();
			return;
		}

		let verificationResult = null;
		let messageWasSigned = false;

		if (config.requireSign) {
			emitSigning(true)
			setCtx({ ...ctx, status: ConnectionStatus.SIGNING });
			currentStatus.current = ConnectionStatus.SIGNING
			// console.log('requireSign | message:', config.signMessage)
			messageWasSigned = await verifyAddress(
				CONSTANTS.ADDRESS,
				config.signMessage
			);

			if(!messageWasSigned) {
				emitSignFail(true)
				debug('handleVerify | message was not signed...')
				resetApp()
				return {
					verificationResult: null,
					messageWasSigned,
				}
			}
			emitSigned(true)
		}

		if (config.verify) {
			emitVerifying(true)
			setCtx({ ...ctx, status: ConnectionStatus.VERIFYING });
			currentStatus.current = ConnectionStatus.VERIFYING


			if (connectionAbandoned.current) {
				emitVerifyFail(true)
				debug('handleVerify | abandoned...')
				resetApp();
				return;
			}

			verificationResult = await config.verify({
				...ctx,
				chainId: CONSTANTS.CHAIN_ID,
				chainName: CONSTANTS.CHAIN_NAME,
				address: CONSTANTS.ADDRESS,
			});

			if(verificationResult){
				emitVerified(true)
			}else{
				emitVerifyFail(true)
			}
		}

		// console.log('SETTING VERIFICATION RESULT:', verificationResult)

		// setCtx({
		//     ...ctx,
		//     verificationResult,
		//     signed: messageWasSigned,
		//     what: 'the fff?'
		// });

		return {
			verificationResult,
			messageWasSigned,
		};
	};




	//--------------------------------------------------------------------------
	const handleConnection = async (newAccount?: string) => {
		debug('handleConnection ===>')
		if (connectionInProgress.current) {
			debug('handleConnection | connection already in progress')
			return;
		}

		
		try {
			setCtx({ ...ctx, connecting: true, status: ConnectionStatus.CONNECTING});
			currentStatus.current = ConnectionStatus.CONNECTING
			connectionInProgress.current = true;
			connectionAbandoned.current = false;
			emitConnecting(true)

			if (ctx.connected && CONSTANTS.ADDRESS) {
				debug('handleConnection | already connected, re-sign / re-verify')
				
				let res = await handleVerify();
				setCtx({
					...ctx,
					verificationResult: res?.verificationResult,
					signed: res?.messageWasSigned,
				});
				return;
			}
			debug('handleConnection | connecting...')
			
			CONSTANTS.GLOBAL_WEB_3_MODAL = new IMPORTED_WEB_3_MODAL({
				network: getChainData(ctx.chainId || 1).network,
				cacheProvider: true,
				providerOptions: config.providerOptions,
			});

			CONSTANTS.PROVIDER = await CONSTANTS.GLOBAL_WEB_3_MODAL.connect();
			CONSTANTS.LIBRARY = new IMPORTED_WEB_3_PROVIDER(CONSTANTS.PROVIDER);
			CONSTANTS.NETWORK = await CONSTANTS.LIBRARY.getNetwork();
			CONSTANTS.ADDRESS =
				newAccount || CONSTANTS.PROVIDER.selectedAddress
				? CONSTANTS.PROVIDER.selectedAddress
				: CONSTANTS.PROVIDER.accounts[0];
			CONSTANTS.CHAIN_ID = CONSTANTS.NETWORK.chainId;
			CONSTANTS.CHAIN_NAME = CONSTANTS.NETWORK.name;

			let res = await handleVerify();

			
			if (connectionAbandoned.current) {
				debug('handleConnection | abandoned...')
				resetApp();
				return;
			}
			
			await subscribeToProviderEvents(CONSTANTS.PROVIDER);
			setCtx({
				...ctx,
				chainId: CONSTANTS.CHAIN_ID,
				chainName: CONSTANTS.CHAIN_NAME,
				address: CONSTANTS.ADDRESS,
				connected: true,
				connecting: false,
				status: ConnectionStatus.CONNECTED,
				verificationResult: res?.verificationResult,
				signed: res?.messageWasSigned,
			});
			currentStatus.current = ConnectionStatus.CONNECTED


			sessionStorage.setItem(CONSTANTS.SSKEY_WAS_CONNECTED, "true");

			connectionInProgress.current = false;
			debug('handleConnection | connected!')
			emitConnect(true)

		} catch (err) {
			debug("handleConnection | connect error:", err);
			setCtx(CONSTANTS.DEFAULT_CONTEXT);
			connectionInProgress.current = false;
			currentStatus.current = ConnectionStatus.NOT_CONNECTED
		}
	};

	//--------------------------------------------------------------------------
	const subscribeToProviderEvents = async (provider: any) => {
		debug("W3M DEBUG | subscribeToProviderEvents");

		if (!provider.on) {
		return;
		}

		provider.on("accountsChanged", (accounts) => {
			changedAccount(accounts);
		});
		provider.on("chainChanged", () => {
			emitNetworkChange(true)
			handleConnection();
		});
		provider.on("disconnect", () => {
			resetApp();
		});

		// await web3Modal.off('accountsChanged');
	};

	//--------------------------------------------------------------------------
	const unSubscribe = async (provider: any) => {
		// Workaround for metamask widget > 9.0.3 (provider.off is undefined);
		// window.location.reload();
		if (!provider.off) {
		return;
		}

		provider.off("accountsChanged", changedAccount);
		provider.off("networkChanged", handleConnection);
		provider.off("close", resetApp);
	};

	//--------------------------------------------------------------------------
	const changedAccount = async (accounts: any) => {
		debug("changedAccount ===>");
		if (!accounts.length) {
			await resetApp();
		} else {
			handleConnection(accounts[0]);
			emitAccountChange(true)
		//   e.emit(EventTypes.ACCOUNT_CHANGED);
		}
	};

	//--------------------------------------------------------------------------
	const resetApp = async () => {
		debug("resetApp ===>");
		if(connectionAbandoned.current){
			debug('resetApp | connection abandoned, already reset')
			return
		}

		connectionAbandoned.current = true;
		connectionInProgress.current = false;
		sessionStorage.setItem(CONSTANTS.SSKEY_WAS_CONNECTED, "false");

		if (CONSTANTS.GLOBAL_WEB_3_MODAL) {
			debug("resetApp | closing provider, clearing cached provider");
			await CONSTANTS.GLOBAL_WEB_3_MODAL?.provider?.close();
			await CONSTANTS.GLOBAL_WEB_3_MODAL?.clearCachedProvider();
		}

		if (CONSTANTS.GLOBAL_WEB_3_PROVIDER) {
			debug("resetApp | unsubscripbing from provider");
			await unSubscribe(CONSTANTS.GLOBAL_WEB_3_PROVIDER?.provider);
		}

		let shouldReconnect = sessionStorage.getItem(CONSTANTS.SSKEY_SHOULD_RECONNECT) === 'true' ? true : false

    	// currently not connected - use same status
		if(currentStatus.current === ConnectionStatus.CONNECTED){
			debug("resetApp | was connected - disconnecting, setting default context");
			setCtx((_ctx:any) => ({ ...CONSTANTS.DEFAULT_CONTEXT, status: ConnectionStatus.DISCONNECTED, reconnect: shouldReconnect }));
			currentStatus.current = ConnectionStatus.DISCONNECTED
			emitDisconnect(true)
		}else{
			debug("resetApp | not yet connected - resetting to NOT_CONNECTED");
			setCtx({ ...CONSTANTS.DEFAULT_CONTEXT, status: ConnectionStatus.NOT_CONNECTED, reconnect: shouldReconnect });
			currentStatus.current = ConnectionStatus.NOT_CONNECTED
			emitDisconnect(true)
		}
		connectionAbandoned.current = false
	};









  	//+ ///////////////////////////////////////////////////////////////////////
	//+ /////////////////////////////////////////////////////////////  PROVIDER

	const W3MProvider = (props: IContextProviderProps) => {
		return (
		<W3MCTX.Provider
			value={{
				...ctx,
				state,
				setState,
				connect: handleConnection,
				disconnect: resetApp,
				enableReconnect: () => toggleReconnect(true),
				disableReconnect: () => toggleReconnect(false),
				onEvent,
				removeEvents: () => { e.removeAllListeners() }
			}}
		>
			{props.children}
		</W3MCTX.Provider>
		);
	};

	const handleInit = async () => {
		console.log('emitting INIT')
		emitInit(true)
	}


	useEffect(() => {
		if (wasInitialized.current) return;
		debug("init | DEBUG ACTIVE");
		handleInit()

		

		// Was this user connected previously (before unmount)
		let wasConnected = sessionStorage.getItem(CONSTANTS.SSKEY_WAS_CONNECTED);
		let shouldReconnect = sessionStorage.getItem(CONSTANTS.SSKEY_SHOULD_RECONNECT);

		setCtx({ ...ctx, reconnect: shouldReconnect === "true" ? true : false });

		// debug("init | should reconnect:", {
		// 	reconnect: config.reconnect,
		// 	wasConnected,
		// 	isConnected: ctx.connected,
		// 	shouldReconnect,
		// });

		// If should reconnect && was connected && is not connected rn
		if (
			wasConnected === "true" &&
			!ctx.connected &&
			shouldReconnect === "true"
		) {
			console.dir("init | reconnecting...");
			handleConnection();
		}
		wasInitialized.current = true;
		
		return () => { 
			e.removeAllListeners() 
		}
	}, []);

	return W3MProvider;
};












export const useW3MState = (config: ICreateProviderConfig) => {
	const connectionAbandoned = useRef(false);
	const connectionInProgress = useRef(false);
	const wasInitialized = useRef(false);
	const currentStatus = useRef(ConnectionStatus.NOT_CONNECTED);

	const CONSTANTS: any = {
		GLOBAL_WEB_3_MODAL: null,
		GLOBAL_WEB_3_PROVIDER: null,
		PROVIDER: null,
		LIBRARY: null,
		NETWORK: null,
		ADDRESS: null,
		CHAIN_ID: null,
		CHAIN_NAME: null,
		SSKEY_WAS_CONNECTED: "W3M_WAS_CONNECTED",
		SSKEY_SHOULD_RECONNECT: "W3M_SHOULD_RECONNECT",
		DEFAULT_CONTEXT: {
		status: ConnectionStatus.NOT_CONNECTED,
		chainId: null,
		address: null,
		connected: false,
		connecting: false,
		reconnect: config.reconnect ? config.reconnect : false,
		signed: null,
		verificationResult: null,
		},
	};



	const [ctx, setCtx] = useState(CONSTANTS.DEFAULT_CONTEXT);
	const [state, setState] = useState(config.initialState || null);

	const toggleReconnect = (bool: boolean) => {
		if (typeof window !== "undefined" && window.sessionStorage) {
		sessionStorage.setItem("W3M_SHOULD_RECONNECT", bool.toString());
		setCtx({ ...ctx, reconnect: bool });
		}
	};

	/** Console log an item if func in debug mode */
	const debug = (...msg: any) => {
		config.debug && console.log('W3M |',...msg);
	};
















  	//+ ///////////////////////////////////////////////////////////////////////
  	//+ //////////////////////////////////////////////////////////////  FIRE CB

	const e = useMemo(()=> new EventEmitter(),[])
	/**
	 * events??
	 * @param event EventTypes
	 * @param cb 
	 * @returns 
	 */
	const onEvent = (event:EventTypes, cb:(...args: any[]) => void) => e.on(event, cb)

	const [trigger_onConnecting, emitConnecting] = useState(false);
	const [trigger_onConnect, emitConnect] = useState(false);
	const [trigger_onDisconnect, emitDisconnect] = useState(false);
	const [trigger_accountChange, emitAccountChange] = useState(false);
	const [trigger_onNetworkChange, emitNetworkChange] = useState(false);
	const [trigger_onVerifying, emitVerifying] = useState(false);
	const [trigger_onVerified, emitVerified] = useState(false);
	const [trigger_onVerifyFail, emitVerifyFail] = useState(false);
	const [trigger_onSigning, emitSigning] = useState(false);
	const [trigger_onSigned, emitSigned] = useState(false);
	const [trigger_onSignFail, emitSignFail] = useState(false);
	const [trigger_init, emitInit] = useState(false);


	useEffect(() => {
		const args = {...ctx, state, setState, Provider: CONSTANTS.PROVIDER}

		if (trigger_onConnect) {
			e.emit(EventTypes.CONNECTED);
			emitConnect(false);
			config.onConnect && config.onConnect(args)
		}

		if (trigger_onDisconnect) {
			e.emit(EventTypes.DISCONNECTED);
			emitDisconnect(false);
			config.onDisconnect && config.onDisconnect(args)
		}

		if (trigger_accountChange) {
			e.emit(EventTypes.ACCOUNT_CHANGED);
			emitAccountChange(false);
			config.onAccountChange && config.onAccountChange(args);
		}

		if (trigger_onNetworkChange) {
			e.emit(EventTypes.NETWORK_CHANGED);
			emitNetworkChange(false);
			config.onNetworkChange && config.onNetworkChange(args);
		}

		if (trigger_onConnecting) {
			e.emit(EventTypes.CONNECTING);
			emitConnecting(false);
			config.onConnecting && config.onConnecting(args);
		}

		if (trigger_onSigning) {
			e.emit(EventTypes.SIGNING);
			emitSigning(false);
			config.onSigning && config.onSigning(args);
		}

		if (trigger_onSigned) {
			e.emit(EventTypes.SIGNED);
			emitSigned(false);
			config.onSigned && config.onSigned(args);
		}

		if (trigger_onSignFail) {
			e.emit(EventTypes.SIGN_FAIL);
			emitSignFail(false);
			config.onSignFail && config.onSignFail(args);
		}

		if (trigger_onVerifying) {
			e.emit(EventTypes.VERIFYING);
			emitVerifying(false);
			config.onVerifying && config.onVerifying(args);
		}

		if (trigger_onVerified) {
			e.emit(EventTypes.VERIFIED);
			emitVerified(false);
			config.onVerified && config.onVerified(args);
		}

		if (trigger_onVerifyFail) {
			e.emit(EventTypes.VERIFY_FAIL);
			emitVerifyFail(false);
			config.onVerifyFail && config.onVerifyFail(args);
		}

		if (trigger_init) {
			emitInit(false);
			config.onInit && config.onInit(args);
		}
	}, [
		config, ctx, e,
		trigger_onNetworkChange, 
		trigger_accountChange, 
		trigger_onDisconnect, 
		trigger_onConnect,
		trigger_onConnecting,
		trigger_onSigning,
		trigger_onSigned,
		trigger_onSignFail,
		trigger_onVerifying,
		trigger_onVerified,
		trigger_onVerifyFail,
		trigger_init,
	]);








  	//+ ///////////////////////////////////////////////////////////////////////
	//+ ///////////////////////////////////////////////////////////  CONNECTION

	const verifyAddress = async (
		_address: string,
		_msg?: string
	): Promise<boolean> => {
		if (connectionAbandoned.current) {
			// console.log('connection abandoned........')
			resetApp();
			return false;
		}

		let globalSignature;
		let msg = _msg ? _msg : "Sign a message to verify address...?";
		const web3 = new Web3(Web3.givenProvider);

		// attempt to sign a message thru metamask
		// does this work thru any provider?
		const signMessage = async () => {
			// console.log('verifyAddress | signMessage | provider:', window.ethereum)
			try {
				const from = _address;
				const ethereum:any = window.ethereum;
				const sign = await ethereum.request({
					method: "personal_sign",
					params: [msg, from, "Random text"],
				});
				globalSignature = sign;
			} catch (err) {
				console.error(err);
				return false
			}
		};

		// use web3.eth to verify the signature and check the address returned
		// from the verification process against the address passed as arg
		const verifyMessage = async () => {
			try {
				const from = _address;
				const recoveredAddr = web3.eth.accounts.recover(msg, globalSignature);
				if (!recoveredAddr) return false;

				// console.log('verifyAddress | recoveredAddr : ' + recoveredAddr);

				if (recoveredAddr.toLowerCase() === from.toLowerCase()) {
					// console.log(`verifyAddress | Success: ${recoveredAddr}`);
					//! should really just return true here
					return _address;
				} else {
					// console.log(`verifyAddress | Failed to verify message:${recoveredAddr} vs ${from}`,);
					return false;
				}
			} catch (err) {
				// console.log(`verifyAddress | error:`,err);
				debug("verify address error:", err);
				return false;
			}
		};

		try {
		if (connectionAbandoned.current) {
			// console.log('connection abandoned........')
			resetApp();
			return false;
		}
		await signMessage();
		let verifiedAddress = await verifyMessage();

		if (!verifiedAddress) {
			// console.log('verifyAddress | Address could not be verified')
			return false;
		}

		return true;
		} catch (err) {
		// console.log(err)
		debug("verifyMessage | verify message error:", err);
		return false;
		}
	};




	//--------------------------------------------------------------------------
	const handleVerify = async () => {
		if (connectionAbandoned.current) {
			debug('handleVerify | abandoned...')
			resetApp();
			return;
		}

		let verificationResult = null;
		let messageWasSigned = false;

		if (config.requireSign) {
			emitSigning(true)
			setCtx({ ...ctx, status: ConnectionStatus.SIGNING });
			currentStatus.current = ConnectionStatus.SIGNING
			// console.log('requireSign | message:', config.signMessage)
			messageWasSigned = await verifyAddress(
				CONSTANTS.ADDRESS,
				config.signMessage
			);

			if(!messageWasSigned) {
				emitSignFail(true)
				debug('handleVerify | message was not signed...')
				resetApp()
				return {
					verificationResult: null,
					messageWasSigned,
				}
			}
			emitSigned(true)
		}

		if (config.verify) {
			emitVerifying(true)
			setCtx({ ...ctx, status: ConnectionStatus.VERIFYING });
			currentStatus.current = ConnectionStatus.VERIFYING


			if (connectionAbandoned.current) {
				emitVerifyFail(true)
				debug('handleVerify | abandoned...')
				resetApp();
				return;
			}

			verificationResult = await config.verify({
				...ctx,
				chainId: CONSTANTS.CHAIN_ID,
				chainName: CONSTANTS.CHAIN_NAME,
				address: CONSTANTS.ADDRESS,
			});

			if(verificationResult){
				emitVerified(true)
			}else{
				emitVerifyFail(true)
			}
		}

		// console.log('SETTING VERIFICATION RESULT:', verificationResult)

		// setCtx({
		//     ...ctx,
		//     verificationResult,
		//     signed: messageWasSigned,
		//     what: 'the fff?'
		// });

		return {
			verificationResult,
			messageWasSigned,
		};
	};




	//--------------------------------------------------------------------------
	const handleConnection = async (newAccount?: string) => {
		debug('handleConnection ===>')
		if (connectionInProgress.current) {
			debug('handleConnection | connection already in progress')
			return;
		}

		
		try {
			setCtx({ ...ctx, connecting: true, status: ConnectionStatus.CONNECTING});
			currentStatus.current = ConnectionStatus.CONNECTING
			connectionInProgress.current = true;
			connectionAbandoned.current = false;
			emitConnecting(true)

			if (ctx.connected && CONSTANTS.ADDRESS) {
				debug('handleConnection | already connected, re-sign / re-verify')
				
				let res = await handleVerify();
				setCtx({
					...ctx,
					verificationResult: res?.verificationResult,
					signed: res?.messageWasSigned,
				});
				return;
			}
			debug('handleConnection | connecting...')
			
			CONSTANTS.GLOBAL_WEB_3_MODAL = new IMPORTED_WEB_3_MODAL({
				network: getChainData(ctx.chainId || 1).network,
				cacheProvider: true,
				providerOptions: config.providerOptions,
			});

			CONSTANTS.PROVIDER = await CONSTANTS.GLOBAL_WEB_3_MODAL.connect();
			CONSTANTS.LIBRARY = new IMPORTED_WEB_3_PROVIDER(CONSTANTS.PROVIDER);
			CONSTANTS.NETWORK = await CONSTANTS.LIBRARY.getNetwork();
			CONSTANTS.ADDRESS =
				newAccount || CONSTANTS.PROVIDER.selectedAddress
				? CONSTANTS.PROVIDER.selectedAddress
				: CONSTANTS.PROVIDER.accounts[0];
			CONSTANTS.CHAIN_ID = CONSTANTS.NETWORK.chainId;
			CONSTANTS.CHAIN_NAME = CONSTANTS.NETWORK.name;

			let res = await handleVerify();

			
			if (connectionAbandoned.current) {
				debug('handleConnection | abandoned...')
				resetApp();
				return;
			}
			
			await subscribeToProviderEvents(CONSTANTS.PROVIDER);
			setCtx({
				...ctx,
				chainId: CONSTANTS.CHAIN_ID,
				chainName: CONSTANTS.CHAIN_NAME,
				address: CONSTANTS.ADDRESS,
				connected: true,
				connecting: false,
				status: ConnectionStatus.CONNECTED,
				verificationResult: res?.verificationResult,
				signed: res?.messageWasSigned,
			});
			currentStatus.current = ConnectionStatus.CONNECTED


			sessionStorage.setItem(CONSTANTS.SSKEY_WAS_CONNECTED, "true");

			connectionInProgress.current = false;
			debug('handleConnection | connected!')
			emitConnect(true)

		} catch (err) {
			debug("handleConnection | connect error:", err);
			setCtx(CONSTANTS.DEFAULT_CONTEXT);
			connectionInProgress.current = false;
			currentStatus.current = ConnectionStatus.NOT_CONNECTED
		}
	};

	//--------------------------------------------------------------------------
	const subscribeToProviderEvents = async (provider: any) => {
		debug("W3M DEBUG | subscribeToProviderEvents");

		if (!provider.on) {
		return;
		}

		provider.on("accountsChanged", (accounts) => {
			changedAccount(accounts);
		});
		provider.on("chainChanged", () => {
			emitNetworkChange(true)
			handleConnection();
		});
		provider.on("disconnect", () => {
			resetApp();
		});

		// await web3Modal.off('accountsChanged');
	};

	//--------------------------------------------------------------------------
	const unSubscribe = async (provider: any) => {
		// Workaround for metamask widget > 9.0.3 (provider.off is undefined);
		// window.location.reload();
		if (!provider.off) {
		return;
		}

		provider.off("accountsChanged", changedAccount);
		provider.off("networkChanged", handleConnection);
		provider.off("close", resetApp);
	};

	//--------------------------------------------------------------------------
	const changedAccount = async (accounts: any) => {
		debug("changedAccount ===>");
		if (!accounts.length) {
			await resetApp();
		} else {
			handleConnection(accounts[0]);
			emitAccountChange(true)
		//   e.emit(EventTypes.ACCOUNT_CHANGED);
		}
	};

	//--------------------------------------------------------------------------
	const resetApp = async () => {
		debug("resetApp ===>");
		if(connectionAbandoned.current){
			debug('resetApp | connection abandoned, already reset')
			return
		}

		connectionAbandoned.current = true;
		connectionInProgress.current = false;
		sessionStorage.setItem(CONSTANTS.SSKEY_WAS_CONNECTED, "false");

		if (CONSTANTS.GLOBAL_WEB_3_MODAL) {
			debug("resetApp | closing provider, clearing cached provider");
			await CONSTANTS.GLOBAL_WEB_3_MODAL?.provider?.close();
			await CONSTANTS.GLOBAL_WEB_3_MODAL?.clearCachedProvider();
		}

		if (CONSTANTS.GLOBAL_WEB_3_PROVIDER) {
			debug("resetApp | unsubscripbing from provider");
			await unSubscribe(CONSTANTS.GLOBAL_WEB_3_PROVIDER?.provider);
		}

		let shouldReconnect = sessionStorage.getItem(CONSTANTS.SSKEY_SHOULD_RECONNECT) === 'true' ? true : false

    	// currently not connected - use same status
		if(currentStatus.current === ConnectionStatus.CONNECTED){
			debug("resetApp | was connected - disconnecting, setting default context");
			setCtx((_ctx:any) => ({ ...CONSTANTS.DEFAULT_CONTEXT, status: ConnectionStatus.DISCONNECTED, reconnect: shouldReconnect }));
			currentStatus.current = ConnectionStatus.DISCONNECTED
			emitDisconnect(true)
		}else{
			debug("resetApp | not yet connected - resetting to NOT_CONNECTED");
			setCtx({ ...CONSTANTS.DEFAULT_CONTEXT, status: ConnectionStatus.NOT_CONNECTED, reconnect: shouldReconnect });
			currentStatus.current = ConnectionStatus.NOT_CONNECTED
			emitDisconnect(true)
		}
		connectionAbandoned.current = false
	};









  	//+ ///////////////////////////////////////////////////////////////////////
	//+ /////////////////////////////////////////////////////////////  PROVIDER


	const handleInit = async () => {
		console.log('emitting INIT')
		emitInit(true)
	}


	useEffect(() => {
		if (wasInitialized.current) return;
		debug("init | DEBUG ACTIVE");
		handleInit()

		

		// Was this user connected previously (before unmount)
		let wasConnected = sessionStorage.getItem(CONSTANTS.SSKEY_WAS_CONNECTED);
		let shouldReconnect = sessionStorage.getItem(CONSTANTS.SSKEY_SHOULD_RECONNECT);

		setCtx({ ...ctx, reconnect: shouldReconnect === "true" ? true : false });

		// debug("init | should reconnect:", {
		// 	reconnect: config.reconnect,
		// 	wasConnected,
		// 	isConnected: ctx.connected,
		// 	shouldReconnect,
		// });

		// If should reconnect && was connected && is not connected rn
		if (
			wasConnected === "true" &&
			!ctx.connected &&
			shouldReconnect === "true"
		) {
			console.dir("init | reconnecting...");
			handleConnection();
		}
		wasInitialized.current = true;
		
		return () => { 
			e.removeAllListeners() 
		}
	}, []);

	return {
		...ctx,
		state,
		setState,
		connect: handleConnection,
		disconnect: resetApp,
		enableReconnect: () => toggleReconnect(true),
		disableReconnect: () => toggleReconnect(false),
		onEvent,
		removeEvents: () => { e.removeAllListeners() }
	};
};








const initialContext:any = {}
const W3MCTX = createContext(initialContext);

export const useW3MContext: () => {
	address: string;
	state: any,
	setState: Function,
	connected: boolean,
	connect: Function,
	disconnect: Function,
	enableReconnect: Function,
	disableReconnect: Function,

	/** Listen for events:  
	 * "CONNECTING"  
	 * "CONNECTED"  
	 * "DISCONNECTED"  
	 * "ACCOUNT_CHANGED"  
	 * "NETWORK_CHANGED"  
	 * "SIGNING"  
	 * "SIGNED"  
	 * "SIGN_FAIL"  
	 * "VERIFYING"  
	 * "VERIFIED"  
	 * "VERIFY_FAIL"  
	*/
	
	onEvent: Function,
	
	removeEvents: Function
} = () => {
  return useContext(W3MCTX);
};

// export default useW3MProvider