import { useCallback, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { BsBricks } from "react-icons/bs";
import { TbWorld } from "react-icons/tb";
import BtnGreenSquared from "./BtnGreenSquared";
import UploadInput from "./UploadInput";

export type ModalData = {
  name: string;
  rfc: string;
  kyc?: File;
  doc?: File;
};

type Props = {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: ModalData) => Promise<void>;
};

const INITIAL_STATE: ModalData = {
  name: "",
  rfc: "",
  kyc: undefined,
  doc: undefined,
};

async function getS3(fileName: String, file: File){
  const url = 'https://c69kcdo99e.execute-api.us-east-1.amazonaws.com/default/putKYC';
  const body={
    key: fileName
  };

  const options: RequestInit = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    await fetch(data, {
      method: "PUT",
      headers: {
        "Content-type": "multipart/form-data"
      },
      body: file
    })
  } catch(error) {
  }
}
export default function KYCModal({ visible, onHide, onSubmit }: Props) {
  const [state, setState] = useState(INITIAL_STATE);
  const [disabled, setDisabled] = useState(false)

  const onSubmitCallback = useCallback(async () => {
    try{
      setDisabled(true)
      if(state.name && state.rfc && state.kyc && state.doc){
        onSubmit && await onSubmit(state);
        onHide && onHide()
        getS3("KYC CQA RESERVA KAAX.xlsm",state.kyc);
        getS3("SOLICITUD_DE_INVERSION_CQA.pdf",state.kyc);
      }
    }catch(e){
      console.error(e)
    }finally{
      setDisabled(false)
    }
  }, [onSubmit, onHide, state]);
  return (
    <Modal
      show={visible}
      onHide={onHide}
      dialogClassName="modal-dialog modal-xl"
    >
      <Modal.Body className="p-5">
        <h3 className="fw-bold h4">Antes de Invertir</h3>
        <p>
          Tienes que completar unos pasos para asegurarnos que todo salga bien.
        </p>
        <Row>
          <Col md="8">
            <Row className="justify-content-center align-items-center">
              <Col>
                <TbWorld
                  className="rounded-circle p-2 mb-2"
                  size={42}
                  color={"#FEFEFE"}
                  style={{ backgroundColor: "#BEB024" }}
                />
                <div className="fw-bold pb-2">Verificación KYC</div>
                <p>
                  Esta verificación es conducida por una compañia independiente
                  para asegurarnos de cumplir con las normas y regulaciones.
                </p>
                <BtnGreenSquared href="/KYC CQA RESERVA KAAX.xlsm" download>Descargar</BtnGreenSquared>
              </Col>
              <Col>
                <BsBricks
                  className="rounded-circle p-2 mb-2"
                  size={42}
                  color={"#FEFEFE"}
                  style={{ backgroundColor: "#BEB024" }}
                />
                <div className="fw-bold pb-2">Solicitud de inversión</div>
                <p>Este documento se requiere para solicitar la inversión</p>
                <BtnGreenSquared href="/SOLICITUD_DE_INVERSION_CQA.pdf" download>Solicitar</BtnGreenSquared>
              </Col>
            </Row>
            <Row className="mt-4 pb-4">
              <Col>
                <div className="w-100 box px-3">
                  <div className="fw-bold pt-3 pb-2">Sube tu documento completado</div>
                  <UploadInput onChange={(f)=>setState(prev=>({...prev, kyc: f}))} className="mb-3"/>
                </div>
              </Col>
              <Col>
                <div className="w-100 box px-3">
                  <div className="fw-bold pt-3 pb-2">Sube tu documento completado</div>
                  <UploadInput onChange={(f)=>setState(prev=>({...prev, doc: f}))} className="mb-3"/>
                </div>
              </Col>
            </Row>
          </Col>
          <Col>
            <Form.Group className="py-2" controlId="info">
              <Form.Control
                onChange={({target}) =>
                  setState((prev) => ({ ...prev, name: target.value }))
                }
                type="text"
                placeholder="Nombre Completo"
                className="mb-4 py-3 box"
              />
              <Form.Control
                onChange={({target}) =>
                  setState((prev) => ({ ...prev, rfc: target.value }))
                }
                type="text"
                placeholder="RFC"
                className="mb-4 py-3 box"
              />
            </Form.Group>
          </Col>
          <Col xs="12" className="text-center">
            <BtnGreenSquared disabled={disabled} className="mt-3 mb-2" onClick={onSubmitCallback}>Subir</BtnGreenSquared>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
