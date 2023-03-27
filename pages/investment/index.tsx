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
  Spinner,
  Modal,
} from "react-bootstrap";
import { TbWorld } from "react-icons/tb";
import { BsBricks, BsCheckCircle } from "react-icons/bs";
import { HiArrowsUpDown } from "react-icons/hi2";
import TokenCard from "../../src/components/TokenCard";
import { BtnGreen } from "../../src/components/BtnGreen";
import { useState, useCallback, useEffect } from "react";
import { useSmartContract } from "../../src/lib/providers/SmartContractProvider";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import KYCModal, { ModalData } from "../../src/components/KYCModal";
import { useWeb3Modal } from "@web3modal/react";
import TermsModal from "../../src/components/TermsModal";
import BtnGreenSquared from "../../src/components/BtnGreenSquared";

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

type State = {
    kyc?: ModalData,
    eula: boolean
}

export default function Investment() {
  const { open } = useWeb3Modal();
  const [state, setState] = useState<State>({eula: false}) //TODO: do something with the data
  const [showModal, setShowModal] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [mintWhenConnected, setMintWhenConnected] = useState(false)
  const hideModal = useCallback(() => {
    setShowModal(false);
  }, []);
  const hideTerms = useCallback(() => {
    setShowTerms(false);
  }, []);
  const onAcceptTerms = useCallback(async ()=>{
    setState((prev)=>({...prev, eula: true}))
  },[])

  const submitModal = useCallback(async (data: ModalData) => {
    setState((prev)=>({...prev, kyc: data}))
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
  const { write, isLoading, isSuccess, isError, error } = useContractWrite(config);
  const onMint = useCallback(async ()=>{
    if(amount <= 0) return;
    if(!address){
        open()
        setMintWhenConnected(true)
    }else if(write){
        write()
    }
  },[write, amount, address, open])
  useEffect(()=>{
    if(mintWhenConnected && address){
      setMintWhenConnected(false)
      onMint()
    }
  },[onMint, address, mintWhenConnected])

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  useEffect(()=>{
    if(isSuccess){
      setShowSuccessModal(true)
    }
  },[isSuccess])
  return (
    <>
      <KYCModal visible={showModal} onHide={hideModal} onSubmit={submitModal} />
      <TermsModal visible={showTerms} onHide={hideTerms} onAccept={onAcceptTerms}/>
      <Modal show={showSuccessModal} dialogClassName="modal-dialog modal-dialog-centered" onHide={()=>setShowSuccessModal(false)}>
        <Modal.Title>
          <div className="h3 p-5 text-center">¡Transacción completada de forma exitosa!</div>
        </Modal.Title>
        <Modal.Body>
            <div className="text-center">
              <div className="mb-5">
                <BsCheckCircle size={100} className="text-success"/>
              </div>
              <BtnGreenSquared>Ir al Dashboard</BtnGreenSquared>
            </div>
        </Modal.Body>
      </Modal>
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
            <BtnGreen disabled={state.kyc ? true : false} onClick={()=>setShowModal(true)}>Completar</BtnGreen>
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
            <fieldset disabled={state.kyc ? state.eula : true}>
                <BtnGreen onClick={()=>setShowTerms(true)}>Aceptar</BtnGreen>
            </fieldset>
          </Col>
        </Row>
      </ContainerW50>
      <Container style={{ paddingTop: "5rem", paddingBottom: "7rem" }}>
        <Row>
          <Col className="pb-5" lg={6}>
            <TokenCard></TokenCard>
          </Col>
          <Col lg={6}>
            <Container className="w-75 mx-auto" style={{minHeight: 600}}>
              <Form>
                <h1 className="fw-bold h4 text-center" color="#4A4A4A">
                  Comprar cupón de inversión
                </h1>
                <fieldset disabled={!state.eula}>
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
                    <p>{amount} cupones de inversión</p>
                  </div>
                  {/* <div className="d-flex justify-content-between">
                    <p>Fee</p>
                    <p>1 USDT</p>
                  </div> */}
                </Container>
                <BtnGreen
                  disabled={amount <= 0 || isLoading}
                  onClick={onMint}
                  className="w-100 my-2"
                  style={{ height: "3rem" }}
                >
                  {isLoading && <><Spinner size="sm"/>{" "}</>}
                  Comprar con Metamask
                </BtnGreen>
                {/* <BtnGreen className="w-100 my-2" style={{ height: "3rem" }}>
                  Comprar con tarjeta de crédito
                </BtnGreen> */}
                </fieldset>
              </Form>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}
