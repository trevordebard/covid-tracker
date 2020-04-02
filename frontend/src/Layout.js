import React from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  max-width: 98%;
  width: 95%;
  margin: 5rem auto;
`;

const Items = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
`;
const Layout = ({ children, title }) => (
  <LayoutContainer>
    <Items>{children}</Items>
  </LayoutContainer>
);

export default Layout;
