import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import classes from "../../styles/Dashboard.module.css";
import { Col, Container, Row, Stack } from "react-bootstrap";
import TokenCard from "../../src/components/TokenCard";
import { BtnGreen } from "../../src/components/BtnGreen";
import Card from "../../src/components/Card/Card";
import { CiMoneyBill } from "react-icons/ci";
import { AiOutlineBell } from "react-icons/ai";
import ProgressCircle from "../../src/components/ProgressCircle/ProgressCircle";
import { useAccount } from "wagmi";
import { useSmartContract } from "../../src/lib/providers/SmartContractProvider";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { address } = useAccount()
  const { read } = useSmartContract();
  const [vouchers, setVouchers] = useState([])
  useEffect(()=>{
    if(!address)return;
        read("getWallet", [address])
        .then((r) => setVouchers(r as any))
        .catch((e) => console.error(e))
    },[read, address])
  return (
    <>
      <Container className="my-5">
        <div className={`${classes["grid-container"]}`}>
          <div className={`${classes["grid-item1"]}`}>
            <TokenCard type="grid"></TokenCard>
          </div>

          <Card className={`${classes["grid-item2"]}`}>
            <h4 className={`${classes["grid-title"]}`}>
              Fondos recaudados por Reserva Kaax
            </h4>
            <p className={`${classes["grid-text"]}`}>$5,000,000 USD</p>
          </Card>

          <Card className={`${classes["grid-item3"]}`}>
            <h4 className={`${classes["grid-title"]}`}>
              Número de inversionistas
            </h4>
            <p className={`${classes["grid-text"]}`}>46 inversionistas</p>
          </Card>

          <Card className={`${classes["grid-item4"]}`}>
            <h4 className={`${classes["grid-title"]}`}>Tu inversión</h4>
            <p className={`${classes["grid-text"]}`}>$40,000 USD</p>
          </Card>

          <Card className={`${classes["grid-item5"]}`}>
            <h4 className={`${classes["grid-title"]}`}>Tus tokens</h4>
            <p className={`${classes["grid-text"]}`}>{vouchers.length} vouchers</p>
          </Card>

          <Card className={`${classes["grid-item6"]} `}>
            <ProgressCircle percentage="73" />
            <p className={`${classes["description"]} `}>
              Rendimientos proyectados para esta obra basado en tu inversión.
            </p>
            <div className={`${classes["info-container"]} `}>
              <div>
                <p className={`${classes["info-container__title"]} `}>
                  Ganancia
                </p>
                <div className={`${classes["info-container__summary"]} `}>
                  <p className={`${classes["info-container__currency"]} `}>
                    $31,218.00
                  </p>
                  <p className={`${classes["info-container__percentage"]} `}>
                    +83.8%
                  </p>
                </div>
              </div>
              <div>
                <p className={`${classes["info-container__title"]} `}>
                  Total Recibido
                </p>
                <p className={`${classes["info-container__currency"]} `}>
                  $71,218.00 USD
                </p>
              </div>
            </div>
          </Card>

          <Card className={`${classes["grid-item7"]}`}>
            <h4 className={`${classes["grid-text"]}`}>Progreso de la obra</h4>

            <div className="m-4 d-flex flex-column justify-content-center align-items-center">
              <div
                className="position-relative rounded-pill bg-black"
                style={{ width: "100%", height: "15px" }}
              >
                <div
                  className="position-absolute rounded-pill top-0 start-0"
                  style={{
                    width: "100%",
                    height: "15px",
                    backgroundColor: "#ffad0d",
                  }}
                />
                <div
                  className="position-absolute rounded-pill top-0 start-0"
                  style={{
                    width: "75%",
                    height: "15px",
                    backgroundColor: "#ff3236",
                  }}
                />
                <div
                  className="position-absolute rounded-pill top-0 start-0"
                  style={{
                    width: "50%",
                    height: "15px",
                    backgroundColor: "#f5841f",
                  }}
                />
                <div
                  className="position-absolute rounded-pill top-0 start-0"
                  style={{
                    width: "25%",
                    height: "15px",
                    backgroundColor: "#5fc92e",
                  }}
                />
              </div>

              <div className="p-4 w-100 fw-light">
                <table className="w-100 table">
                  <tbody>
                    <tr>
                      <td className="d-flex align-items-center py-2">
                        <div
                          className="rounded-circle me-2"
                          style={{
                            height: "16px",
                            width: "16px",
                            backgroundColor: "#5fc92e",
                          }}
                        />{" "}
                        Fase 1 - Cimientos
                      </td>
                      <td>Completado</td>
                    </tr>

                    <tr>
                      <td className="d-flex align-items-center py-2">
                        <div
                          className="rounded-circle me-2"
                          style={{
                            height: "16px",
                            width: "16px",
                            backgroundColor: "#f5841f",
                          }}
                        />{" "}
                        Fase 2 - Obra Negra
                      </td>
                      <td>En proceso</td>
                    </tr>

                    <tr>
                      <td className="d-flex align-items-center py-2">
                        <div
                          className="rounded-circle me-2"
                          style={{
                            height: "16px",
                            width: "16px",
                            backgroundColor: "#ff3236",
                          }}
                        />{" "}
                        Fase 3 - Plomería y Electricidad
                      </td>
                      <td>Demorado</td>
                    </tr>

                    <tr>
                      <td className="d-flex align-items-center py-2">
                        <div
                          className="rounded-circle me-2"
                          style={{
                            height: "16px",
                            width: "16px",
                            backgroundColor: "#ffad0d",
                          }}
                        />{" "}
                        Fase 4 - Ventanas y puertas
                      </td>
                      <td>Pendiente</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          <div className={`${classes["grid-item8"]}`}>
            <BtnGreen
              style={{
                height: "70%",
                padding: "0rem 2rem",
                whiteSpace: "nowrap",
              }}
            >
              Volver a Invertir
            </BtnGreen>
          </div>
        </div>

        <div className="p-4 shadow rounded bg-white">
          <Stack direction="horizontal" className="mb-4">
            <h2 className="fw-bold h4 mb-0 me-2">Notificaciones</h2>
            <span
              className="d-flex justify-content-center rounded-circle text-white"
              style={{
                height: "25px",
                width: "25px",
                backgroundColor: "#122620",
              }}
            >
              1
            </span>
          </Stack>

          <Stack gap={4}>
            <div className="d-flex justify-content-center align-items-center border-success border-start border-2 py-2">
              <span
                className="mx-4 d-flex justify-content-center align-items-center rounded-circle"
                style={{
                  height: "40px",
                  width: "40px",
                  backgroundColor: "#efeffb",
                }}
              >
                <CiMoneyBill size={30} />
              </span>

              <Stack>
                <span className="fw-bold">
                  La inversión se completó exitósamente, levantamos $5,000,000
                  USDC y ahora es momento de trabajar
                </span>
                <span className="text-secondary">
                  La primera fase va a consistir de contratar a una constructora
                  de confianza para empezar a levantar los cimientos.
                </span>
              </Stack>
            </div>

            <div className="d-flex justify-content-center align-items-center border-start border-2 py-2">
              <span
                className="mx-4 d-flex justify-content-center align-items-center rounded-circle"
                style={{
                  height: "40px",
                  width: "40px",
                  backgroundColor: "#efeffb",
                }}
              >
                <CiMoneyBill size={30} />
              </span>

              <Stack>
                <span className="fw-bold">
                  Constructora contratada y los cimientos de la obra se empizan
                  el 15 de Octubre
                </span>
                <span className="text-secondary">
                  La constructora se llama Constructora Genial S.A. de C.V.
                </span>
              </Stack>
            </div>

            <div className="d-flex justify-content-center align-items-center border-start border-2 py-2">
              <div
                className="mx-4 d-flex justify-content-center align-items-center rounded-circle"
                style={{
                  height: "40px",
                  width: "40px",
                  backgroundColor: "#ffe7e6",
                }}
              >
                <AiOutlineBell size={30} color="#ff3b30" />
              </div>
              <Stack>
                <span className="fw-bold">
                  Una inundación en Tulum nos va a demorar la obra por 3 meses
                  en lo que removemos todo el escombro y resumimos con la
                  construcción
                </span>
                <span className="text-secondary">
                  Las autoridades dicen que nos van a ayudar a tomar medidas de
                  precaución
                </span>
              </Stack>
            </div>

            <div className="d-flex justify-content-center align-items-center border-start border-2 py-2">
              <span
                className="mx-4 d-flex justify-content-center align-items-center rounded-circle"
                style={{
                  height: "40px",
                  width: "40px",
                  backgroundColor: "#efeffb",
                }}
              >
                <CiMoneyBill size={30} />
              </span>

              <Stack>
                <span className="fw-bold">
                  Se vendió el primer departamento
                </span>
                <span className="text-secondary">
                  Paradigm just sent you{" "}
                  <span className="text-black">0.020291 BTC</span>.
                </span>
              </Stack>
            </div>
          </Stack>
        </div>
      </Container>
    </>
  );
}
