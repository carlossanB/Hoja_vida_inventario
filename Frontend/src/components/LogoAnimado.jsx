import React from 'react';
import styled from 'styled-components';

const LogoAnimado = ({ size = 36 }) => {
  return (
    <StyledWrapper $size={size}>
      <img
        src="/favicon.png"
        alt="Logo"
        className="logo"
      />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .logo {
    height: ${(props) => props.$size}px;
    width: ${(props) => props.$size}px;
    object-fit: contain;
    animation: float 3s ease-in-out infinite;
    filter: drop-shadow(0 2px 6px rgba(0, 180, 160, 0.25));
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }
`;

export default LogoAnimado;