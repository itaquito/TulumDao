import { google } from "googleapis";
import { useEffect, useMemo, useState } from "react";
import { Container, Stack } from "react-bootstrap";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useAccount } from "wagmi";
import { BtnGreen } from "../../src/components/BtnGreen";
import Card from "../../src/components/Card/Card";
import Notification from "../../src/components/Notification";
import ProgressCircle from "../../src/components/ProgressCircle/ProgressCircle";
import TokenCard from "../../src/components/TokenCard";
import { useSmartContract } from "../../src/lib/providers/SmartContractProvider";
import classes from "../../styles/Dashboard.module.css";

export async function getServerSideProps() {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const range = `Dashboard!A:D`;

  const response: any = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  return {
    props: {
      data: response.data.values,
    },
  };
}

export default function Dashboard({ data }: { data: string[] }) {
  const { address } = useAccount();
  const { read } = useSmartContract();
  const [vouchers, setVouchers] = useState([]);
  useEffect(() => {
    if (!address) return;
    read("getWallet", [address])
      .then((r) => setVouchers(r as any))
      .catch((e) => console.error(e));
  }, [read, address]);

  const filteredData = useMemo(() => {
    if (!address) return [];
    if (!data) return [];
    return data.filter((t) => t[0] === address);
  }, [data, address]);

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
            <p className={`${classes["grid-text"]}`}>
              {vouchers.length} vouchers
            </p>
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
              {filteredData.length}
            </span>
          </Stack>

          <Stack gap={4}>
            {filteredData.map((t, idx)=><Notification
              key={idx}
              asunto={t[1]}
              detalles={t[2]}
              tipo={t[3]}
              variant={idx === 0 ? "success" : undefined}
            />)}
          </Stack>
        </div>
      </Container>
    </>
  );
}
