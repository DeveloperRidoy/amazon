import { motion } from 'framer-motion';
import styled from 'styled-components';


function SubmitButton({children, loading, style, className, spinColor= 'black', onClick, disabled, type="submit"}) {
    return (
      <Button
        type={type}
        style={style || { backgroundColor: " #ffd49d" }}
        className={className}
        onClick={onClick}
        disabled={disabled}
      >
        <span>{children}</span>
        {loading && (
          <Spinner
            style={{
              borderTop: `2px solid ${spinColor}`,
              borderLeft: `2px solid ${spinColor}`,
              marginLeft: !children ? 0 : '3px'
            }}
          />
        )}
      </Button>
    );
}

export default SubmitButton


const Button = styled(motion.button)`
    padding: 5px 10px;
    border-radius: 3px;
    border: none;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-around;
    &:hover {
      background-color: #f1b96f;
    }
    &:focus {
      transform: scale(0.95);
    }
`

const Spinner = styled(motion.div)`
    border: 2px solid transparent;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    -webkit-animation: spin 0.5s linear infinite; /* Safari */
    animation: spin 0.5s linear infinite;

  /* Safari */
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;