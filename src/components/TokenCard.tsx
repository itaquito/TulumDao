import { Container } from "react-bootstrap";
import styled from "styled-components";
import { BsStars } from "react-icons/bs";

const CardContainer = styled(Container)`
  width: 60%;
  height: 100%;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: end;
  position: relative;

  background: conic-gradient(
    from -70.88deg at 49.82% 36.14%,
    #122620 -121.88deg,
    #f6c343 123.75deg,
    #122620 238.12deg,
    #f6c343 483.75deg
  );
`;

export interface TokenCardProps{
  type?: "grid",
  name?: string,
  id?: number,
  date?: string
}

export default function TokenCard(props: TokenCardProps) {
  return (
    <CardContainer
      className=" px-2 py-4 text-light"
      style={props.type === "grid" ? { width: "100%" } : { width: "60%" }}
    >
      <BsStars
        className="my-2"
        size={32}
        style={{
          position: "absolute",
          right: "10%",
          top: "3%",
        }}
      />
      <Container className="pt-3">
        <p className="fw-bold m-0">Miembro Tulum</p>
        <p className="fw-light" style={{ fontSize: "0.9rem" }}>
          {props.id === undefined ? "" : `Token id: ${props.id}`}
        </p>
        <p className="fw-bold m-0">{props.name ?? ""}</p>
        <p className="fw-light m-0" style={{ fontSize: "0.8rem" }}>
          {props.date ? `Fecha de maduración: ${props.date}`  : ""}
        </p>
      </Container>
    </CardContainer>
  );
}
