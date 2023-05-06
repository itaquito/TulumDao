import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Spinner, Stack } from "react-bootstrap";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useAccount } from "wagmi";
import { BtnGreen } from "../../src/components/BtnGreen";
import BtnGreenSquared from "../../src/components/BtnGreenSquared";
import Card from "../../src/components/Card/Card";
import Notification from "../../src/components/Notification";
import ProgressCircle from "../../src/components/ProgressCircle/ProgressCircle";
import TokenCard from "../../src/components/TokenCard";
import { useAPI } from "../../src/hooks/hooks";
import { useSmartContract } from "../../src/lib/providers/SmartContractProvider";
import classes from "../../styles/Dashboard.module.css";

const USD_VALUE = 120;

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Dashboard() {
  const { address } = useAccount();
  const [{name: fullName}, getPrevKYC] = useAPI<{name?: string}>({
    url: "/api/registration/user", disabled: true, method: "POST", initialValue: {}
  })
  const [{value: retInversion}] = useAPI<{value: number}>({
    url: "/api/ret_inversion", initialValue: {value: 0}
  })
  const { openConnectModal } = useConnectModal();
  const { read } = useSmartContract();
  const [vouchers, setVouchers] = useState([]);
  const [totalSuply, setTotalSuply] = useState<number>(0);
  const [nOwners, setNOwners] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [data, fetchData] = useAPI<string[]>({url: `/api/dashboard/${address}`, disabled: true, initialValue: []})
  const { push } = useRouter();
  useEffect(() => {
    if (!address) return;
    read("getWallet", [address])
      .then((r) => {
        setVouchers(r as any);
        setIsLoading(false);
      })
      .catch((e) => console.error(e));
  }, [read, address]);

  useEffect(() => {
    read("totalSupply").then(async (r) => {
      const nTokens: number = (r as any).toNumber();
      setTotalSuply(nTokens);
      const owners = new Map<string, any>();
      for (let i = 1; i <= nTokens; i++) {
        const res = await read("ownerOf", [i]);
        owners.set(`${res}`, true);
        setNOwners(owners.size);
      }
    });
  }, [read]);

  useEffect(()=>{
    if(address){
      fetchData()
      getPrevKYC({address: address})
    }
  },[address, fetchData, getPrevKYC])

  useEffect(() => {
    if (!address && openConnectModal) {
      openConnectModal();
    }
  }, [address, openConnectModal]);

  if (isLoading) {
    return (
      <Container className="my-5">
        <div className="w-100 text-center" style={{ minHeight: "60vh" }}>
          <Spinner />
        </div>
      </Container>
    );
  }

  if (vouchers.length <= 0) {
    return (<Container className="my-5">
      <div className="w-100 text-center" style={{ minHeight: "60vh" }}>
        <BtnGreenSquared
          onClick={() => push("/investment")}
        >
          Invertir
        </BtnGreenSquared>
      </div>
    </Container>);
  }

  return (
    <>
      <Container className="my-5">
        <div className={`${classes["grid-container"]}`}>
          <div className={`${classes["grid-item1"]}`}>
            <TokenCard type="grid" name={fullName}/>
          </div>

          <Card className={`${classes["grid-item2"]}`}>
            <h4 className={`${classes["grid-title"]}`}>
              Fondos recaudados por Reserva Kaax
            </h4>
            <p className={`${classes["grid-text"]}`}>
              ${numberWithCommas(totalSuply * USD_VALUE)} USD
            </p>
          </Card>

          <Card className={`${classes["grid-item3"]}`}>
            <h4 className={`${classes["grid-title"]}`}>
              Número de inversionistas
            </h4>
            <p className={`${classes["grid-text"]}`}>
              {numberWithCommas(nOwners)} inversionistas
            </p>
          </Card>

          <Card className={`${classes["grid-item4"]}`}>
            <h4 className={`${classes["grid-title"]}`}>Tu inversión</h4>
            <p className={`${classes["grid-text"]}`}>
              ${numberWithCommas(vouchers.length * USD_VALUE)} USD
            </p>
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
                    ${numberWithCommas(vouchers.length * USD_VALUE * (1+retInversion))}
                  </p>
                  <p className={`${classes["info-container__percentage"]} `}>
                    +{(retInversion*100).toFixed(2)}%
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
              onClick={() => push("/investment")}
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
              {data.length}
            </span>
          </Stack>

          <Stack gap={4}>
            {data.map((t, idx) => (
              <Notification
                key={idx}
                asunto={t[1]}
                detalles={t[2]}
                tipo={t[3]}
                variant={idx === 0 ? "success" : undefined}
              />
            ))}
          </Stack>
        </div>
      </Container>
    </>
  );
}
