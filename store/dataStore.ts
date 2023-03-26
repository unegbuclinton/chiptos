import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export enum E_Views {
    'FULL',
    'PERSONAL',
    'SINGLE',
    'COLLECTION'
}

export type T_DataStore = {
    loading?: boolean;
    allLoaded?: boolean;
    currentContract: string;
    currentView?: E_Views;
    contractData?: any;
    personalData?: any;
    singleAsset?: any;
    initSuccess?: boolean;
    partialInitSuccess?: boolean;

    setLoading: Function;
    setAllLoaded: Function;
    setCurrentContract: Function;
    setContractData: Function;
    setCurrentView: Function;
    setPersonalData: Function;
    setSingleAsset: Function;
    setInitSuccess: Function;
    setPartialInitSuccess: Function;
}


const useDataStore = create<any>(devtools((set) => ({

    initSuccess: false,
    setInitSuccess: (b:boolean) => set({initSuccess: b}),

    partialInitSuccess: false,
    setPartialInitSuccess: (b:boolean) => set({partialInitSuccess: b}),

    loading: false,
    setLoading: (b:boolean) => set({ loading: b }),

    allLoaded: false,
    setAllLoaded: (b:boolean) => set({ allLoaded: b }),
    
    currentContract: 'Chiptos 512',
    setCurrentContract: (contractName:string) => set({ currentContract: contractName}),
    
    contractData: {},
    setContractData: (newData:any) => set({ contractData: newData }),
    
    currentView: E_Views.FULL, // FULL, PERSONAL, SINGLE, COLLECTION
    setCurrentView: (newView:E_Views) => set({ currentView: newView}),
    
    personalData: {},
    setPersonalData: (newData:any) => set({ personalData: newData}),
    
    singleAsset: {},
    setSingleAsset: (ast:any) => set({ singleAsset: ast })
    
})))


export default useDataStore

/*

the nestore function would have to return a hook,
that binds to state changes for the supplied path


const stoHook = createSto({
    hello: 'world'
})

const createSto = (sto) => {
    let store = sto

    const hook = (key) => {
        const [s, ss] = useState()
        ss(store.get(key))
    }

    const set = () => {}
    const get = () => {}

    return {
        set,
        get,
        hook
    }
}
*/