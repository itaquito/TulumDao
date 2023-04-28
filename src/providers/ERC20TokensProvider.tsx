import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import SmartContractProviderWrapper, { useSmartContract } from '../lib/providers/SmartContractProvider';
import { Address, ReadFunction } from '../lib/providers/SmartContractProvider.types';
import abi from "../assets/erc20.abi.json"

type ER20TokensContextType = {
    contracts: Address[];
    getRead: (address: Address)=> ReadFunction | undefined
};

type Dict = {[key: Address]: ReadFunction}

const ER20TokensContext = createContext<ER20TokensContextType | null>(null)

function ERC20TokenWrapper({onChange}: {onChange: (read: ReadFunction, address: Address)=>void}){
    const { read, contractAddress } = useSmartContract() 
    useEffect(()=>{
        onChange && onChange(read, contractAddress)
    },[read, contractAddress, onChange])
    return <React.Fragment/>
}

export default function ERC20TokensProvider({children}: {children?: ReactNode}) {
    const { read } = useSmartContract() 
    const [contracts, setContracts] = useState<Address[]>([])
    const [dict, setDict] = useState<Dict>({})

    const onAddContract = useCallback((read: ReadFunction, address: Address)=>{
        setDict((prev)=>({...prev, [address]: read}))
    },[])
    useEffect(()=>{
        const run = async ()=>{
            let i = 0
            const arr : Address[] = []
            while(true){
                try{
                    const res = await read("AllowedCrypto", [i])
                    arr.push(res[0])
                    i++
                }catch(e){
                    break;
                }
            }
            setContracts(arr)
        }
        run()
    },[read])
   const value = useMemo(()=>({contracts, getRead: (address: Address)=>dict[address]}),[contracts, dict])
  return (
    <ER20TokensContext.Provider value={value}>
        {contracts.map((t, idx)=>(
            <SmartContractProviderWrapper key={idx} address={t} abi={abi as any}>
                <ERC20TokenWrapper onChange={onAddContract}/>
            </SmartContractProviderWrapper>)
        )}
        {children}
    </ER20TokensContext.Provider>
  )
}

export function useERC20Tokens(){
    const context = useContext(ER20TokensContext)
    if(!context){
        throw new Error("useERC20Tokens must be inside ERC20TokensProvider");
    }
    return context
}