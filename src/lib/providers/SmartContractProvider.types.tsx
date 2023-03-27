import { Result } from "ethers/lib/utils.js";
import { ReactNode } from "react";
import { useContractWrite } from "wagmi";
import { SendTransactionResult } from "@wagmi/core";

export type Address = `0x${string}` 
export type ReadFunction = (functionName: string, args?: any[], overrides?: Overrides) => Promise<Result>

interface ABIVar {
  internalType: string;
  name: string;
  type: string;
  indexed?: boolean;
}

export interface Overrides {
    from: Address
}

export interface ABIObject {
  name?: string;
  type: string;
  inputs?: ABIVar[];
  outputs?: ABIVar[];
  stateMutability?: string;
}

export interface SmartContractProviderProps {
  children?: ReactNode;
  address: Address;
  abi: ABIObject[];
}

export type SmartContractContextType = {
  contractAddress: Address;
  getABI: (functionName: string) => ABIObject | undefined;
  read: ReadFunction;
  write: (
    functionName: string,
    args?: any[],
    overrides?: Overrides,
  ) => Promise<SendTransactionResult>;
};

useContractWrite;
