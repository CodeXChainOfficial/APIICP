import React, { useEffect, useState } from 'react';
import { FormInputStyle } from './styles/form';
import styled from "@emotion/styled";

interface ApiResponse {
  success: boolean;
  newTokenCount: number;
  tokensCount: number;
  message?: string;
}

const TotalCountDisplay: React.FC = () => {
  const [counts, setCounts] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const fetchTotalCounts = async () => {
      try {
        // Replace this URL with the actual URL of your server
        const apiUrl = 'http://localhost:5004/api/getDeployedTokensCount';

        const response = await fetch(apiUrl);
        const data: ApiResponse = await response.json();

        // Log the entire response to the console for debugging
        console.log('Server response:', data);

        if (data.success) {
          setCounts(data);
        } else {
          console.error('Error retrieving total counts:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTotalCounts();
  }, []);

  return (
    <div>
      <CounterContainer>
      <CounterWrapper>
        <Title>Total deployed: {counts?.tokensCount}</Title>
      </CounterWrapper>
    </CounterContainer>
    </div>
  );
};

export default TotalCountDisplay;
const Title = styled.h2`
  color: var(--blue);
  font-size: 20px;
  font-weight: 400;
  line-height: 32px;
  letter-spacing: 1px;
  text-transform: capitalize;
=

`;

const CounterContainer = styled.div`
  text-align: center; /* Align to the right */
  margin: 20px;
`;

const CounterWrapper = styled.div`
  background-color: #000;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid gray; /* Border color gray */
`;

const CounterTitle = styled.h2`
  color: #FFF;
`;

const CounterValue = styled.p`
  font-size: 28px;
  margin: 0;
`;