import { Button } from "react-bootstrap";
import styled from "styled-components";

export const BtnGreen = styled(Button)`
  background-color: #122620 !important;
  border: none;
  transition: all 0.3s ease;
  transform: scale(1);
  &:hover {
    transform: scale(1.05) perspective(1px);
  }
`;
