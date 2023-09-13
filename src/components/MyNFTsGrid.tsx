import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useAccount } from "wagmi";
import abi from "../assets/villas.abi.json";
import { ipfsFetch, useIPFSSrc } from "../hooks/ipfsFetch";
import SmartContractProviderWrapper, { useSmartContract } from "../lib/providers/SmartContractProvider";

type ProductDetails = {
    name: string;
    description: string;
    image: string;
};

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

interface ProductCardProps {
    token: number;
}

const ProductCard = (props: ProductCardProps) => {
    const details = useProductInfo(props.token);
    const src = useIPFSSrc(details?.image);
    if (!details) {
        return <React.Fragment />;
    }
    return (
        <Col className="py-3" md={4} lg={3}>
            <Card className="mx-auto" style={{ width: "90%" }}>
                <Card.Img variant="top" src={src} />
                <Card.Body style={{ backgroundColor: "#50AE89", color: "#FEFEFE" }}>
                    <Card.Title className="fw-bold h5">{details.name}</Card.Title>
                    <Card.Subtitle>ERC-721</Card.Subtitle>
                    <Card.Text className="fw-thin">
                        <small>{details.description}</small>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
};

function MarketplaceWrapper() {
    const [items, setItems] = useState<number[]>([]);
    const { address } = useAccount();
    const { read } = useSmartContract();
    useEffect(() => {
        const func = async () => {
            const res = await read("getWallet", [address]);
            setItems((res as any).map((t: any) => Number(t)));
        };
        func();
    }, [read, address]);

    return (
        <Row>
            {items.map((t) => (
                <ProductCard token={t} key={t} />
            ))}
        </Row>
    );
}

export default function MyNFTsGrid() {
    return (
        <SmartContractProviderWrapper abi={abi} address="0xc357714f319Ad99BCA0C9210F65eA0295acF2eE1">
            <MarketplaceWrapper />
        </SmartContractProviderWrapper>
    );
}
