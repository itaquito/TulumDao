import { useCallback, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { BsBricks } from "react-icons/bs";
import { TbWorld } from "react-icons/tb";
import BtnGreenSquared from "./BtnGreenSquared";
import UploadInput from "./UploadInput";

export type ModalData = {
  nombre: string;
  rfc: string;
  kyc?: File;
  solicitud?: File;
};

type Props = {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: ModalData) => Promise<void>;
};

const INITIAL_STATE: ModalData = {
  nombre: "",
  rfc: "",
  kyc: undefined,
  solicitud: undefined,
};

export default function KYCModal({ visible, onHide, onSubmit }: Props) {
  const [state, setState] = useState(INITIAL_STATE);

  const onSubmitCallback = useCallback(async () => {
    try{
      if(state.nombre && state.rfc && state.kyc && state.solicitud){
        onSubmit && await onSubmit(state);
        onHide && onHide()
      }
    }catch(e){
      console.error(e)
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
                  <UploadInput onChange={(f)=>setState(prev=>({...prev, solicitud: f}))} className="mb-3"/>
                </div>
              </Col>
            </Row>
          </Col>
          <Col>
            <Form.Group className="py-2" controlId="info">
              <Form.Control
                onChange={({target}) =>
                  setState((prev) => ({ ...prev, nombre: target.value }))
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
            <BtnGreenSquared className="mt-3 mb-2" onClick={onSubmitCallback}>Subir</BtnGreenSquared>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
