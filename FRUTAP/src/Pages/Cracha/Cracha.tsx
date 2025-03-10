import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cracha.css";

// Simulando um banco de dados com 180 usuários
const usuarios = Array.from({ length: 180 }, (_, i) => ({
  cracha: i + 1,
  nome: `Usuário ${i + 1}`,
  divisao: `Divisão ${((i % 5) + 1)}`,
  regiao: `Região ${((i % 3) + 1)}`,
}));

export default function Cracha() {
  const navigate = useNavigate();
  const [cracha, setCracha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [falouMensagem, setFalouMensagem] = useState(false);
  const [podeClicar, setPodeClicar] = useState(false); // Permite navegação após a fala

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Impede rolagem
    document.body.style.zoom = "reset"; // Impede zoom

    return () => {
      document.body.style.overflow = "";
      document.body.style.zoom = "";
    };
  }, []);

  // 🔥 Função para falar um texto de forma segura
  const speak = (text: string, callback?: () => void) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel(); // Cancela falas pendentes
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 1;
      utterance.onend = () => {
        setPodeClicar(true); // Após a fala, habilita o clique para mudar de tela
        if (callback) callback();
      };
      speechSynthesis.speak(utterance);
    } else {
      console.warn("speechSynthesis não é suportado neste navegador.");
    }
  };

  // Fala "Digite o número do seu crachá" apenas na primeira vez
  useEffect(() => {
    if (!sessionStorage.getItem("frutapaoFalouCracha")) {
      setTimeout(() => {
        speak("Digite o número do seu crachá");
        sessionStorage.setItem("frutapaoFalouCracha", "true");
      }, 1000);
    }
  }, []);

  // 🔥 Função chamada ao inserir o crachá
  const handleEntrada = () => {
    if (!cracha) return; // Impede a execução se o campo estiver vazio

    const usuario = usuarios.find((u) => u.cracha === Number(cracha));

    if (usuario) {
      const msg = `Bem-vindo, ${usuario.nome}! Você é da ${usuario.divisao}, localizada na ${usuario.regiao}.`;
      setMensagem(msg);

      if (!falouMensagem) {
        setFalouMensagem(true); // Evita múltiplas falas
        speak(msg); // Após a fala, o clique estará liberado
      }
    } else {
      const msgErro = "Crachá não encontrado. Verifique e tente novamente.";
      setMensagem(msgErro);

      if (!falouMensagem) {
        setFalouMensagem(true); // Evita múltiplas falas
        speak(msgErro);
      }
    }
  };

  // 🔥 Ao clicar na tela, muda para "Saida" se puder clicar
  const handleClick = () => {
    if (podeClicar) {
      navigate("/saida");
    }
  };

  return (
    <div className="container" onClick={handleClick}>
      <h1 className="title">IDENTIFICAÇÃO</h1>

      <p className="text">Digite o número do seu crachá:</p>

      <div className="input-container">
        <input
          type="number"
          value={cracha}
          onChange={(e) => setCracha(e.target.value)}
          placeholder="Digite seu crachá..."
          className="cracha-input"
        />
        <button
          onClick={handleEntrada}
          className="botao-entrar"
          disabled={!cracha} // 🔥 Botão desativado se o campo estiver vazio
        >
          Entrar
        </button>
      </div>

      {mensagem && <p className="welcome-message">{mensagem}</p>}
    </div>
  );
}
