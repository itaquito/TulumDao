import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Col, Container, Row, Button, Card } from "react-bootstrap";
import { useIPFSSrc } from "../../src/hooks/ipfsFetch";
import MarketplaceGrid from "../../src/components/MarketplaceGrid";

const ProductCard = () => {
    const src = useIPFSSrc("ipfs://QmXeDGvLjpBvmfoHfqZaAZp96K997REPS5Di2xcTaEqe7i/image.png");

    return (
        <Card className="mx-auto" style={{ width: "90%" }}>
            <Card.Img variant="top" src={src} />
            <Card.Body style={{ backgroundColor: "#50AE89", color: "#FEFEFE" }}>
                <Card.Title className="fw-bold h5">Villa #1</Card.Title>
                <Card.Subtitle>ERC</Card.Subtitle>
                <Card.Text className="fw-thin">
                    <small>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mus ut ornare felis pharetra, eu in a
                        tortor.
                    </small>
                </Card.Text>
                <Button variant="light" className="w-100">
                    Comprar
                </Button>
            </Card.Body>
        </Card>
    );
};

export default function Marketplace() {
    return (
        <Container className="my-5">
            <MarketplaceGrid />
        </Container>
    );
}
