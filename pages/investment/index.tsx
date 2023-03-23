import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import {
  Col,
  Container,
  Row,
  Button,
  Badge,
  Form,
  Stack,
} from "react-bootstrap";
import { TbWorld } from "react-icons/tb";
import { BsBricks } from "react-icons/bs";
import { HiArrowsUpDown } from "react-icons/hi2";
import TokenCard from "../../src/components/TokenCard";
import { BtnGreen } from "../../src/components/BtnGreen";
import { useState, useCallback } from "react";
import { useSmartContract } from "../../src/lib/providers/SmartContractProvider";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import KYCModal, { ModalData } from "../../src/components/KYCModal";

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 110px;
  height: 110px;
  object-fit: cover;
`;

const ContainerW50 = styled(Row)`
  width: 90%;

  @media (min-width: 992px) {
    width: 50%;
  }
`;

export default function Investment() {
  const [showModal, setShowModal] = useState(false);
  const hideModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const submitModal = useCallback(async (data: ModalData) => {
    console.log(data); //TODO: do something with the data
  }, []);
  const { address } = useAccount();
  const [amount, setAmount] = useState(0);
  //const { write } = useSmartContract();
  /*const mint = useCallback(()=>{
        write("mint", [address, amount , 0])
        .then((r) => (r as any).write())
        .catch((e) => console.error(e))
    },[write, address, amount])
    */
  const { config } = usePrepareContractWrite({
    address: "0x7E5d1bd04280E1Ca2c5Aa2567fA5184094Fc87E5",
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "_to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_mintAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_pid",
            type: "uint256",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    functionName: "mint",
    args: [address as any, amount as any, 0 as any],
  });
  const { write } = useContractWrite(config);
  console.log(write);
  return (
    <>
      <KYCModal visible={showModal} onHide={hideModal} onSubmit={submitModal} />
      <ContainerW50 className="mx-auto border p-5 mt-5">
        <h1 className="fw-bold h3">Antes de Invertir</h1>
        <p>
          Tienes que completar unos pasos para asegurarnos que todo salga bien.
        </p>
        <Row className="pt-3">
          <Col className="pb-4" lg={6}>
            <TbWorld
              className="rounded-circle p-2 mb-4"
              size={42}
              color={"#FEFEFE"}
              style={{ backgroundColor: "#BEB024" }}
            />
            <p className="fw-bold">Verificación KYC</p>
            <p>
              Esta verificación es conducida por una compañia independiente para
              asegurarnos de cumplir con las normas y regulaciones.
            </p>
            <BtnGreen onClick={()=>setShowModal(true)}>Completar</BtnGreen>
          </Col>
          <Col lg={6}>
            <BsBricks
              className="rounded-circle p-2 mb-4"
              size={42}
              color={"#FEFEFE"}
              style={{ backgroundColor: "#BEB024" }}
            />
            <p className="fw-bold">Aceptar terminos & condiciones</p>
            <p>
              Estos son todos los terminos y condiciones relevantes para la obra
              y la distribucion de la ganancia on-chain.
            </p>
            <BtnGreen>Aceptar</BtnGreen>
          </Col>
        </Row>
      </ContainerW50>
      <Container style={{ paddingTop: "5rem", paddingBottom: "7rem" }}>
        <Row>
          <Col className="pb-5" lg={6}>
            <TokenCard></TokenCard>
          </Col>
          <Col lg={6}>
            <Container className="w-75 mx-auto">
              <Form>
                <h1 className="fw-bold h4 text-center" color="#4A4A4A">
                  Comprar cupón de inversión
                </h1>
                <Row className="mb-3">
                  <Col xs={4}>
                    <Form.Group controlId="formGridState">
                      <Form.Label className="fw-bold">De</Form.Label>
                      <Form.Select defaultValue="Choose...">
                        <option>USDT</option>
                        <option>...</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={8}>
                    <Form.Group controlId="formGridCity">
                      <Form.Label className="fw-bold">Amount</Form.Label>
                      <Form.Control
                        onChange={({ target }) =>
                          setAmount(parseInt(target.value))
                        }
                      />
                      <Form.Text className="text-muted">
                        Balance{" "}
                        <Badge pill bg="light" text="dark">
                          $1,000,000.00
                        </Badge>
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                <HiArrowsUpDown size={32} />
                <Row className="mt-3 mb-5">
                  <Col xs={4}>
                    <Form.Group controlId="formGridCity">
                      <Form.Label>Hacia</Form.Label>
                      <Form.Control />
                      <Form.Text className="text-muted">Cupón</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col xs={8}>
                    <Form.Group controlId="formGridCity">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control />
                      <Form.Text className="text-muted">
                        Balance{" "}
                        <Badge pill bg="light" text="dark">
                          $1,000,000.00
                        </Badge>
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                <h6>Summary</h6>
                <Container
                  className="py-2 mb-3"
                  style={{ backgroundColor: "#F4ECDD", borderRadius: "" }}
                >
                  <div className="d-flex justify-content-between">
                    <p>Precio</p>
                    <p>10,000.00 USDT</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>Vas a recibir</p>
                    <p>2 cupones de inversión</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>Fee</p>
                    <p>1 USDT</p>
                  </div>
                </Container>
                <BtnGreen
                  onClick={write}
                  className="w-100 my-2"
                  style={{ height: "3rem" }}
                >
                  Comprar con Metamask
                </BtnGreen>
                <BtnGreen className="w-100 my-2" style={{ height: "3rem" }}>
                  Comprar con tarjeta de crédito
                </BtnGreen>
              </Form>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}
