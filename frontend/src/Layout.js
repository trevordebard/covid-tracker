import React from 'react';
import styled from 'styled-components';

const Items = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;
const Layout = ({ children, title }) => (
  <>
    <Items>{children}</Items>
  </>
);

export default Layout;
