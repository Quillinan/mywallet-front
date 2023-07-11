import styled from "styled-components"
import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function TransactionsPage() {
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const { tipo } = useParams();
  const navigate = useNavigate();

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/transactions/${tipo}`, {
        value: Number(value),
        description
      }, {
        headers: {
          token: localStorage.getItem("token")
        }
      });

      console.log(response.data);
      navigate("/home");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <TransactionsContainer>
      <h1>Nova TRANSAÇÃO</h1>
      <form onSubmit={handleSaveTransaction}>
        <input
          data-test="registry-amount-input"
          placeholder="Valor"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <input
          data-test="registry-name-input"
          placeholder="Descrição"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          data-test="registry-save"
          type="submit">Salvar TRANSAÇÃO</button>
      </form>
    </TransactionsContainer>
  );
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`
