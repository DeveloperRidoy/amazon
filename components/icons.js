import styled from 'styled-components';
import { FaEye, FaPencilRuler, FaTrashAlt } from 'react-icons/fa'
import { motion } from 'framer-motion';

// star
export const Star = ({ count = 1 }) => {
    const stars = [];
    for (let i = 1; i <= count; i++) {stars.push(i)};
    return (
      <span className="d-flex">
            {stars.map((i) => <StyledStar key={i}/>)}
      </span>
    );
}
const StyledStar = styled.span`
  background-image: url(/images2.png);
  height: 16px;
  width: 17px;
  background-position: -5px -366px;
`;

// custom font_awesome icon
export const FaIcon = ({children, fontSize= 17, color= 'black', boxShadow= '0 0 15px rgba(0, 0, 0, .3)', padding= '5px 10px', cursor='pointer', borderRadius= '5px', margin= 0, className}) => {
    return (
        <StyledFaIcon
          style={{ fontSize, color, boxShadow, padding, cursor, borderRadius, margin }}
          whileTap={{ scale: .9 }}
          className={className}
          
        >
        {children}
      </StyledFaIcon>
    );
}
const StyledFaIcon = styled(motion.div)`
  border: none;
`

// view
export const Eye = ({fontSize, className}) => <FaIcon fontSize={fontSize} className={className} ><FaEye/></FaIcon>

// PencilRuler 
export const PencilRuler = ({fontSize, className}) => <FaIcon fontSize={fontSize} className={className}  ><FaPencilRuler/></FaIcon>

// trashAlt
export const TrashAlt = ({fontSize, className}) => <FaIcon fontSize={fontSize} className={className} ><FaTrashAlt/></FaIcon>