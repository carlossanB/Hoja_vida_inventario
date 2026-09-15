import React from 'react';
import styled from 'styled-components';

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Buscar por inventario, marca o modelo...',
}) => {
  return (
    <StyledWrapper>
      <div id="poda">
        <div className="glow" />
        <div className="border-effect" />

        <div id="main">
          <input
            type="text"
            name="search"
            className="input"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />

          <div id="search-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  max-width: 380px;

  #poda {
    position: relative;
    width: 100%;
  }

  #main {
    position: relative;
    width: 100%;
  }

  .input {
    width: 100%;
    height: 46px;
    border-radius: 14px;
    border: 1.5px solid #e2e8f0;
    padding-left: 44px;
    padding-right: 16px;
    font-size: 14px;
    font-weight: 500;
    color: #0f172a;           /* texto oscuro → legible en claro */
    background: #ffffff;
    outline: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s;
  }

  .input::placeholder {
    color: #94a3b8;           /* placeholder visible */
    font-weight: 400;
  }

  .input:focus {
    border-color: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15);
  }

  #search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #14b8a6;
    pointer-events: none;
    display: flex;
  }

  /* Efecto glow suave */
    .glow {
    position: absolute;
    inset: -6px;
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(45, 212, 191, 0.45), rgba(13, 148, 136, 0.2));
    filter: blur(14px);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    z-index: -1;
    }

  .border-effect {
    position: absolute;
    inset: -1px;
    border-radius: 15px;
    background: linear-gradient(135deg, #2dd4bf, #0d9488);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    z-index: -1;
  }

  #poda:focus-within .glow,
  #poda:hover .glow {
    opacity: 1;
  }

  #poda:focus-within .border-effect {
    opacity: 0.7;
  }

  /* ===== MODO OSCURO (clase .dark en html o body) ===== */

    html.dark &,
    body.dark &,
    .dark & {
    .input {
        background: #0f172a !important;
        border-color: #1e293b !important;
        color: #f1f5f9 !important;
        box-shadow: none !important;
    }

    .input::placeholder {
        color: #64748b !important;
    }

    .input:focus {
        border-color: #2dd4bf !important;
        box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.15) !important;
    }

    #search-icon {
        color: #2dd4bf !important;
    }
    }

    /* Fallback si el sistema está en oscuro y no hay clase .dark */

    /* Responsive */
    @media (max-width: 768px) {
    max-width: 100%;

    .input {
        height: 44px;
        font-size: 13.5px;
    }
    }

    @media (max-width: 480px) {
    .input {
        height: 42px;
        font-size: 13px;
        padding-left: 40px;
    }

    #search-icon {
        left: 12px;
    }
    }
    `;

export default SearchInput;