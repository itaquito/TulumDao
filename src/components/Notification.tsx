import React, { useMemo } from "react";
import { Stack } from "react-bootstrap";
import { AiOutlineBell } from "react-icons/ai";
import { CiMoneyBill } from "react-icons/ci";

const ICONS = {
  NOTIFICACION: AiOutlineBell,
  TRANSACCION: CiMoneyBill,
};

type Props = {
  asunto: string;
  detalles?: string;
  tipo: string;
  variant?: "success" | "danger" | "warning" | "info";
};

export default function Notification({
  asunto,
  detalles,
  tipo,
  variant,
}: Props) {
    const Icon = useMemo(()=>{
      return (ICONS as any)[tipo] ?? ICONS["NOTIFICACION"]
    },[tipo]) 
  return (
    <div
      className={`d-flex justify-content-center align-items-center ${
        variant ? "border-" + variant : ""
      } border-start border-2 py-2`}
    >
      <span
        className="mx-4 d-flex justify-content-center align-items-center rounded-circle"
        style={{
          height: "40px",
          width: "40px",
          backgroundColor: "#efeffb",
        }}
      >
        <Icon size={30} />
      </span>

      <Stack>
        <span className="fw-bold">{asunto}</span>
        {detalles && <span className="text-secondary">{detalles}</span>}
        
      </Stack>
    </div>
  );
}
