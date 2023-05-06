import {
  EthereumClient
} from "@web3modal/ethereum";

import React, { createContext, useContext, useMemo } from "react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { Web3ContextType, Web3ProviderProps } from "./Web3Provider.types";
import { publicProvider } from 'wagmi/providers/public';
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import '@rainbow-me/rainbowkit/styles.css';



const Web3Context = createContext<Web3ContextType|null>(null);

export default function Web3Provider(props: Web3ProviderProps) {
  const [client, value] = useMemo(() => {
    const { chains, provider, webSocketProvider } = configureChains(
      props.chains,
      [publicProvider()]
    );
    const { connectors } = getDefaultWallets({
      appName: props.appName,
      projectId: props.projectId,
      chains,
    });
    const client = createClient({
      autoConnect: true,
      connectors,
      provider,
      webSocketProvider,
    } as any);
    const ethereumClient = new EthereumClient(client, chains);
    return [
      client,
      {
        chains: chains,
        ethereumClient: ethereumClient,
        projectId: props.projectId,
      },
    ];
  }, [props.projectId, props.chains, props.appName]);

  return (
    <Web3Context.Provider value={value}>
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={props.chains}>
          {props.children}
        </RainbowKitProvider>
      </WagmiConfig>
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be inside Web3Provider");
  }
  return context;
}
