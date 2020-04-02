import React from 'react';
import styled from 'styled-components';

const Items = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(270px, 300px));
`;
const Layout = ({ children, title }) => (
  <>
    <Items>{children}</Items>
  </>
);

export default Layout;
