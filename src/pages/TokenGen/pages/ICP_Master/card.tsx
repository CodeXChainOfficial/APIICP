import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const flipAnimation = keyframes`
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(180deg);
  }
`;

const waveAnimation = keyframes`
  0% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 100% 0%;
  }
`;

const Card = styled.div`
  position: relative;
  width: 250px;
  height: 170px;
  transform-style: preserve-3d;
  transition: transform 0.05s;
  transform-origin: center bottom;

  flex-direction: column;
  border-radius: 8px;
  


  &:hover {
    transform: rotateX(180deg);
  }
`;

const CardFace = styled.div`
border-radius: 8px;

  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform-origin: center bottom;
`;

const FrontFace = styled(CardFace)`
background:
linear-gradient(blue, transparent),
linear-gradient(to top left, purple, transparent),
linear-gradient(to top right, red, transparent);
background-blend-mode:screen;  background-size: 200% 100%;
  animation: ${waveAnimation} 3s linear infinite;
  transition: border-color 0.3s;
  border: 2px solid grey;

`;

const BackFace = styled(CardFace)`
background:
        linear-gradient(red, transparent),
        linear-gradient(to top left, lime, transparent),
        linear-gradient(to top right, blue, transparent);
        background-blend-mode: screen;  color: #FFF;
        
        animation: ${waveAnimation} 1s linear infinite;

  transform: rotateX(180deg);

`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 16px;
`;

interface MyCardProps {
  name: string;
  description: string;
}

const MyCard: React.FC<MyCardProps> = ({ name, description }) => {
  return (
    <Card>
      <FrontFace>
        <Title>{name}</Title>
      </FrontFace>
      <BackFace>
        <Description>{description}</Description>
      </BackFace>
    </Card>
  );
};

export default MyCard;
