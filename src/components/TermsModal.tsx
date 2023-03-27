import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useIsVisible } from "../hooks/hooks";
import BtnGreenSquared from "./BtnGreenSquared";
export type ModalData = {
  nombre: string;
  rfc: string;
  kyc?: File;
  solicitud?: File;
};

type Props = {
  visible: boolean;
  onHide: () => void;
  onAccept: () => Promise<void>;
};

const INITIAL_STATE: ModalData = {
  nombre: "",
  rfc: "",
  kyc: undefined,
  solicitud: undefined,
};

export default function TermsModal({ visible, onHide, onAccept }: Props) {
  const [terms, setTerms] = useState<string[] | null>(null)
  const [canAccept, setCanAccept] = useState(false)
  const [refSetter, isVisible] = useIsVisible()
  useEffect(()=>{
    fetch("/terms.txt").then(async (r)=>{
        const text = await r.text()
        setTerms(text.split("\n"))
    })
  },[])

  const onHideCallback = useCallback(()=>{
    onHide && onHide()
    setCanAccept(false)
  },[onHide])

  useEffect(()=>{
    if(isVisible){
        setCanAccept(true)
    }
  },[isVisible])

  const onAcceptCallack = useCallback(async ()=>{
        onAccept && await onAccept()
        onHideCallback()
  },[onHideCallback, onAccept])
  const [t,setT] = useState<any>()
  console.log(t && {...t})

  return (
    <Modal
      show={visible}
      onHide={onHideCallback}
      dialogClassName="modal-dialog modal-xl"
    >
        <Modal.Title className="px-5 pt-5">
            <h3>Terminos y condiciones</h3>
        </Modal.Title>
        <Modal.Body className="p-5 pt-2">
            {terms && (<React.Fragment>
                <div style={{maxHeight: "65vh", overflowY: "auto"}} className="mb-4">
                    {terms.map((text, idx)=><p key={idx}>{text}</p>)}
                    <div ref={(n)=>n && refSetter(n)}>&nbsp;</div>
                </div>
                <div className="text-end">
                <BtnGreenSquared disabled={!canAccept} onClick={onAcceptCallack}>Aceptar</BtnGreenSquared>
                </div>
            </React.Fragment>)}
        </Modal.Body>
    </Modal>)
}