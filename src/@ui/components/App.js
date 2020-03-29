import React from "react";
import styled from "styled-components";

import DisplayHOC from "./DisplayHOC";
import TurnControls from "./TurnControls";

const Wrapper = styled.div`
  background-color: rgb(0, 26, 51);
  width: 100%;
  height: 100vh;
  color: white;
`;

const Console = styled.div`
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translate(-50%, 0);
  text-align: center;
`;

export default ({ Display }) => (
  <Wrapper>
    <DisplayHOC Display={Display} />
    <Console>
      <TurnControls />
    </Console>
  </Wrapper>
);
