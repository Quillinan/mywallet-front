import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate  } from "react-router-dom";

export default function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleNovaEntradaClick = () => {
    navigate("/nova-transacao/entrada");
  };

  const handleNovaSaidaClick = () => {
    navigate("/nova-transacao/saida");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/username`, {
          headers: {
            token: token,
          },
        });
        setUsername(response.data.name);
      } catch (error) {
        console.log(error.response.data);
      }
    };

    const fetchTransactions = async () => {
      try {
  
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/transactions`, {
          headers: {
            token: token,
          },
        });
  
        const { transactions} = response.data;
  
        const total = transactions.reduce((sum, transaction) => {
          return transaction.type === "entrada"
            ? sum + transaction.value
            : sum - transaction.value;
        }, 0);
  
        setTransactions(transactions);
        setBalance(total);
      } catch (error) {
        console.log(error.response.data);
      }
    };
  
    fetchUserName();
    fetchTransactions();
  }, []);

  return (
    <HomeContainer>
      <Header>
        <h1 data-test="user-name">Olá {username}</h1>
        <BiExit data-test="logout" onClick={handleLogout} />
      </Header>

    <TransactionsContainer>
      <ul>
        {transactions.map((transaction) => (
          <ListItemContainer key={transaction._id}>
            <div>
              <span>{transaction.date}</span>
              <strong data-test="registry-name">{transaction.description}</strong>
            </div>
            <Value
              data-test="registry-amount"
              color={transaction.type === "entrada" ? "positivo" : "negativo"}>
              {transaction.value.toFixed(2)}
            </Value>
          </ListItemContainer>
        ))}
      </ul>

      <article>
        <strong>Saldo</strong>
        <Value 
          data-test="total-amount"
          color={balance >= 0 ? "positivo" : "negativo"}>
          {balance.toFixed(2)}
        </Value>
      </article>
    </TransactionsContainer>

    <ButtonsContainer>
      <button
        data-test="new-income"
        onClick={handleNovaEntradaClick}>
        <AiOutlinePlusCircle />
        <p>Nova<br />entrada</p>
      </button>
      <button
        data-test="new-expense"
        onClick={handleNovaSaidaClick}>
        <AiOutlineMinusCircle />
        <p>Nova<br />saída</p>
      </button>
    </ButtonsContainer>

    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  article {
    display: flex;
    justify-content: space-between;   
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;
  
  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "positivo" ? "green" : "red")};
`
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`