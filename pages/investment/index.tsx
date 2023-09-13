import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState, useMemo, use } from "react";
import { Badge, Col, Container, Form, Modal, Row, Spinner } from "react-bootstrap";
import { BsBricks, BsCheckCircle } from "react-icons/bs";
import { TbWorld } from "react-icons/tb";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import styled from "styled-components";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { BtnGreen } from "../../src/components/BtnGreen";
import BtnGreenSquared from "../../src/components/BtnGreenSquared";
import KYCModal, { ModalData } from "../../src/components/KYCModal";
import TermsModal from "../../src/components/TermsModal";
import TokenCard from "../../src/components/TokenCard";
import TokensDropdown, { TokenState } from "../../src/components/TokensDropdown";
import { useSmartContract } from "../../src/lib/providers/SmartContractProvider";
import ERC20TokensProvider from "../../src/providers/ERC20TokensProvider";
import { useAPI } from "../../src/hooks/hooks";
import LoadingContainer from "../../src/components/LoadingContainer";

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
  kyc?: ModalData;
  eula: boolean;
  token: TokenState;
};

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Investment() {
  const { openConnectModal } = useConnectModal();
  const [prevKYC, getPrevKYC] = useAPI<{ is_new: boolean; name?: string; isLoading?: boolean, user_id?: number, created_at?: string}>({
    url: "/api/registration/user",
    disabled: true,
    method: "POST",
    initialValue: { is_new: true, isLoading: true },
  });
  const [, uploadKYC] = useAPI<{ success: boolean; message?: string }>({
    url: "/api/registration/register",
    disabled: true,
    method: "POST",
  });
  const [state, setState] = useState<State>({ eula: false, token: { symbol: "", pid: 0 } }); //TODO: do something with the data
  const [showKYC, setShowModal] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [mintWhenConnected, setMintWhenConnected] = useState(false);
  const { push } = useRouter();
  const hideKYC = useCallback(() => {
    setShowModal(false);
  }, []);
  const hideTerms = useCallback(() => {
    setShowTerms(false);
  }, []);
  const onAcceptTerms = useCallback(async () => {
    setState((prev) => ({ ...prev, eula: true }));
  }, []);
  const onChangeToken = useCallback((token: TokenState) => {
    setState((prev) => ({ ...prev, token: token }));
  }, []);
  const { address } = useAccount();

  const submitKYC = useCallback(
    async (data: ModalData) => {
      if (!address) {
        return;
      }
      const formData = new FormData();
      for (const name of Object.keys(data)) {
        formData.append(name, (data as any)[name]);
      }
      formData.append("address", address);
      const res = await uploadKYC(formData);
      if (res.success) {
        setState((prev) => ({ ...prev, kyc: data }));
      } else {
        alert(res.message ?? "Error desconocido");
      }
    },
    [address, uploadKYC]
  );

  useEffect(() => {
    if (!address && openConnectModal) {
      openConnectModal();
    }
  }, [address, openConnectModal]);

  const [amount, setAmount] = useState(1);
  const { read, getABI, contractAddress } = useSmartContract();
  const ABI = useMemo(() => {
    return getABI("mint");
  }, [getABI]);
  const prepareContract = usePrepareContractWrite({
    address: contractAddress,
    abi: [ABI],
    functionName: "mint",
    args: [address, amount, state.token.pid],
  });
  const { write, isLoading, isSuccess, isError, error } = useContractWrite(prepareContract.config);
  const onMint = useCallback(async () => {
    if (amount <= 0) return;
    if (!address && openConnectModal) {
      openConnectModal();
      setMintWhenConnected(true);
    } else if (write) {
      write();
    }
  }, [write, amount, address, openConnectModal]);
  useEffect(() => {
    if (mintWhenConnected && address) {
      setMintWhenConnected(false);
      onMint();
    }
  }, [onMint, address, mintWhenConnected]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  useEffect(() => {
    if (isSuccess) {
      setShowSuccessModal(true);
    }
  }, [isSuccess]);
  const [price, setPrice] = useState(0);
  useEffect(() => {
    read("AllowedCrypto", [state.token.pid]).then((res: any) => {
      setPrice(Number(res[1]));
    });
  }, [read, state.token.pid]);
  const [canMint, setCanMint] = useState<boolean>(true);
  useEffect(() => {
    if (prepareContract.error && address && amount) {
      read("canMint", [amount, state.token.pid]).then((res: any) => {
        setCanMint(res);
      });
    } else {
      setCanMint(true);
    }
  }, [read, prepareContract.error, address, amount, state.token.pid]);

  useEffect(() => {
    if (address) {
      getPrevKYC({ address: address });
    }
  }, [address, getPrevKYC]);
  return (
    <LoadingContainer isLoading={prevKYC.isLoading}>
      <KYCModal visible={showKYC} onHide={hideKYC} onSubmit={submitKYC} />
      <TermsModal visible={showTerms} onHide={hideTerms} onAccept={onAcceptTerms} />
      <Modal
        show={showSuccessModal}
        dialogClassName="modal-dialog modal-dialog-centered"
        onHide={() => setShowSuccessModal(false)}
      >
        <Modal.Title>
          <div className="h3 p-5 text-center">¡Transacción completada de forma exitosa!</div>
        </Modal.Title>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-5">
              <BsCheckCircle size={100} className="text-success" />
            </div>
            <BtnGreenSquared onClick={() => push("/dashboard")}>Ir al Dashboard</BtnGreenSquared>
          </div>
        </Modal.Body>
      </Modal>
      {prevKYC.is_new ? (
        <ContainerW50 className="mx-auto border p-5 mt-5">
          <h1 className="fw-bold h3">Antes de Invertir</h1>
          <p>Tienes que completar unos pasos para asegurarnos que todo salga bien.</p>
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
                Esta verificación es conducida por una compañia independiente para asegurarnos de cumplir con las normas
                y regulaciones.
              </p>
              <BtnGreen disabled={!prevKYC.is_new || state.kyc ? true : false} onClick={() => setShowModal(true)}>
                Completar
              </BtnGreen>
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
                Estos son todos los terminos y condiciones relevantes para la obra y la distribucion de la ganancia
                on-chain.
              </p>
              <fieldset disabled={state.kyc ? state.eula : true}>
                <BtnGreen onClick={() => setShowTerms(true)}>Aceptar</BtnGreen>
              </fieldset>
            </Col>
          </Row>
        </ContainerW50>
      ) : (
        <Container className="p-5 my-5">¡Bienvenido {prevKYC.name}!</Container>
      )}

      <Container style={{ paddingTop: "5rem", paddingBottom: "7rem" }}>
        <Row>
          <Col className="pb-5" lg={6}>
            <TokenCard name={prevKYC.name ?? state.kyc?.name} date={prevKYC.created_at} id={prevKYC.user_id} />
          </Col>
          <Col lg={6}>
            <Container className="w-75 mx-auto" style={{ minHeight: 600 }}>
              <Form>
                <h1 className="fw-bold h4 text-center" color="#4A4A4A">
                  Comprar cupón de inversión
                </h1>
                <fieldset disabled={!state.eula && prevKYC.is_new}>
                  <Row className="mb-3">
                    <Col xs={4}>
                      <ERC20TokensProvider>
                        <TokensDropdown label="De" onChange={onChangeToken} />
                      </ERC20TokensProvider>
                    </Col>
                    <Col xs={8}>
                      <Form.Group controlId="formGridCity">
                        <Form.Label className="fw-bold">Cantidad</Form.Label>
                        <Form.Control
                          onChange={({ target }) => setAmount(target.value ? parseInt(target.value) : 0)}
                          type="number"
                          min={1}
                          defaultValue={1}
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
                  <Container className="py-2 mb-3" style={{ backgroundColor: "#F4ECDD", borderRadius: "" }}>
                    <div className="d-flex justify-content-between">
                      <p>Precio</p>
                      {state.token.symbol ? (
                        <p>
                          ${numberWithCommas(price * amount)} {state.token.symbol}
                        </p>
                      ) : (
                        <p>Cargando...</p>
                      )}
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
                    disabled={amount <= 0 || isLoading || prepareContract.isError || prepareContract.isLoading}
                    onClick={onMint}
                    className="w-100 my-2"
                    style={{ height: "3rem" }}
                  >
                    {(isLoading || prepareContract.isLoading) && (
                      <>
                        <Spinner size="sm" />{" "}
                      </>
                    )}
                    {state.token.symbol ? `Comprar con ${state.token.symbol}` : "Cargando..."}
                  </BtnGreen>
                  <div className="text-muted text-center">{!canMint && "¡Saldo insuficiente!"}</div>
                  {/* <BtnGreen className="w-100 my-2" style={{ height: "3rem" }}>
                  Comprar con tarjeta de crédito
                </BtnGreen> */}
                </fieldset>
              </Form>
            </Container>
          </Col>
        </Row>
      </Container>
    </LoadingContainer>
  );
}
