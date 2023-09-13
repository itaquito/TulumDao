import React, { useState, useEffect, useMemo, useCallback } from "react";
import SmartContractProviderWrapper, { useSmartContract } from "../lib/providers/SmartContractProvider";
import abiMarket from "../assets/market.abi.json";
import abiProducts from "../assets/villas.abi.json";
import { Col, Container, Row, Button, Card } from "react-bootstrap";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { ipfsFetch, useIPFSSrc } from "../hooks/ipfsFetch";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { parseEther } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";

function weiToEther(value: BigNumber) {
    const eth = BigNumber.from("1000000000000000000");
    return (value as any) / (eth as any);
}

type ProductInfo = {
    token: number;
    seller: string;
    price: BigNumber;
};

type ProductDetails = {
    name: string;
    description: string;
    image: string;
};

function numberWithCommas(x: number) {
    return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function useProductInfo(token: number) {
    const [state, setState] = useState<ProductDetails | undefined>(undefined);
    const { read } = useSmartContract();
    useEffect(() => {
        const func = async () => {
            const uri = await read("tokenURI", [token]);
            const raw = await ipfsFetch(uri as any);
            const data = await raw.json();
            setState({
                name: data.name,
                image: data.image,
                description: data.description,
            });
        };
        func();
    }, [read, token]);
    return state;
}

function useWrite(name: string) {
    const { openConnectModal } = useConnectModal();
    const { getABI, contractAddress } = useSmartContract();
    const { address } = useAccount();
    const [actWhenConnect, setActWhenConnect] = useState(false);
    const [currentArgs, setCurrentArgs] = useState({})

    const ABI = useMemo(() => {
        return getABI(name);
    }, [getABI, name]);

    const { write, isLoading, isSuccess, isError, error } = useContractWrite({
        address: contractAddress,
        abi: [ABI],
        functionName: name
    });
    const onWrite = useCallback((args: any) => {
        if (!address && openConnectModal) {
            setCurrentArgs(args)
            openConnectModal();
            setActWhenConnect(true);
        } else if (write) {
            write({...(args ?? {}), from: address});
        }
    }, [write, address, openConnectModal]);

    useEffect(() => {
        if (actWhenConnect && address) {
            setActWhenConnect(false);
            onWrite({...(currentArgs ?? {}), from: address});
        }
    }, [onWrite, address, actWhenConnect, currentArgs]);
    return {write: onWrite, isLoading: isLoading};
}

interface ProductCardProps extends ProductInfo {
    onBuy: () => void;
    badge?: string;
    disabled?: boolean;
}

const ProductCard = (props: ProductCardProps) => {
    const details = useProductInfo(props.token);
    const src = useIPFSSrc(details?.image);
    const price = Number(weiToEther(props.price));
    if (!details) {
        return <React.Fragment />;
    }
    return (
        <Col className="pb-3" md={6} lg={4}>
            <Card className="mx-auto" style={{ width: "90%" }}>
                <Card.Img variant="top" src={src} />
                <Card.Body style={{ backgroundColor: "#50AE89", color: "#FEFEFE" }}>
                    <Card.Title className="fw-bold h5">{details.name}</Card.Title>
                    <Card.Subtitle>
                        {numberWithCommas(price)} {props.badge}
                    </Card.Subtitle>
                    <Card.Text className="fw-thin">
                        <small>{details.description}</small>
                    </Card.Text>
                    <Button disabled={props.disabled} variant="light" className="w-100" onClick={props.onBuy}>
                        Comprar
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    );
};

function MarketplaceWrapper() {
    const [items, setItems] = useState<ProductInfo[]>([]);
    const { read } = useSmartContract();
    const {write, isLoading} = useWrite("buyItem");
    useEffect(() => {
        const func = async () => {
            const items = [];
            const res = await read("getListings");
            for (const item of res) {
                if (`${item.holder}` === "0x0000000000000000000000000000000000000000") {
                    break;
                }
                items.push({
                    token: Number(item.tokenId),
                    seller: item.seller as string,
                    price: BigNumber.from(item.price),
                });
            }
            setItems(items);
        };
        func();
    }, [read]);

    return (
        <SmartContractProviderWrapper abi={abiProducts} address="0xc357714f319Ad99BCA0C9210F65eA0295acF2eE1">
            <Row>
                {items.map((t, idx) => (
                    <ProductCard
                        {...t}
                        key={idx}
                        onBuy={() => {
                            write({
                                args: [t.token],
                                value: t.price
                            })
                        }}
                        disabled={isLoading}
                        badge="MATIC"
                    />
                ))}
            </Row>
        </SmartContractProviderWrapper>
    );
}

export default function MarketplaceGrid() {
    return (
        <SmartContractProviderWrapper abi={abiMarket} address="0x45BAa80dF1e88F3c8355cCA898030199ecdBA637">
            <MarketplaceWrapper />
        </SmartContractProviderWrapper>
    );
}
