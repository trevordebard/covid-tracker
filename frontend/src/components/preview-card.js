import React from 'react';
import styled from 'styled-components';

const PreviewContainer = styled.div`
  border-radius: 3px;
  box-shadow: 0 4px 6px hsla(0, 0%, 0%, 0.2);
  :hover {
    box-shadow: 0 6px 8px hsla(0, 0%, 0%, 0.4);
  }
  @media (min-width: 600px) {
    flex: 1 50%;
    max-width: calc(50% - 0.5rem);
  }

  h3 {
    font-size: 2rem;
  }
  p {
    margin: 0.2rem;
    font-size: 1.5rem;
  }
`;
const Preview = ({ children, title }) => (
  <PreviewContainer>
    <h3>{title}</h3>
    <div>{children}</div>
  </PreviewContainer>
);

export default Preview;
