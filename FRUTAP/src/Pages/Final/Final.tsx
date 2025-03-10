import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import "./Final.css";

export default function Final() {
  const navigate = useNavigate();
  const [podeClicar, setPodeClicar] = useState(false); // Controla o clique para navegação
  const [mensagemExibida, setMensagemExibida] = useState(false); // Controla se a animação foi exibida

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Impede rolagem
    document.body.style.zoom = "reset"; // Impede zoom

    // Função para falar um texto e só permitir clique depois que a fala e a animação terminarem
    const speak = (text: string, callback?: () => void) => {
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel(); // Cancela falas pendentes
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pt-BR";
        utterance.rate = 1;
        utterance.onend = () => {
          if (mensagemExibida) setPodeClicar(true); // 🔥 Libera o clique apenas quando a mensagem também foi exibida
          if (callback) callback();
        };
        speechSynthesis.speak(utterance);
      } else {
        console.warn("speechSynthesis não é suportado neste navegador.");
      }
    };

    if (!sessionStorage.getItem("frutapaoFalouFinal")) {
      setTimeout(() => {
        speak("Após o término do evento, retorne aqui pois haverá uma surpresa.", () => {
          if (mensagemExibida) setPodeClicar(true);
        });
        sessionStorage.setItem("frutapaoFalouFinal", "true");
      }, 1000);
    } else {
      // 🔥 Se já falou antes, navega direto após 10s
      setTimeout(() => navigate("/"), 10000);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.zoom = "";
    };
  }, [navigate, mensagemExibida]); // Dependência adicionada para liberar clique após a animação

  // 🔥 Simula um evento de conclusão da animação
  const handleTextoCompleto = () => {
    setTimeout(() => {
      setMensagemExibida(true);
      if (!sessionStorage.getItem("frutapaoFalouFinal")) {
        setPodeClicar(false); // Aguarda a fala antes de liberar o clique
      } else {
        setPodeClicar(true); // Se já falou antes, libera imediatamente
      }
    }, 500); // Pequeno delay para garantir a exibição completa
  };

  // 🔥 Função para navegar ao clicar
  const handleClick = () => {
    if (podeClicar) {
      navigate("/");
    }
  };

  return (
    <div className="container" onClick={handleClick}>
      <div className="content">
        <h1 className="title">FINAL</h1>
        <TypeAnimation
          sequence={[
            "Após o término do evento,", 
            1000, 
            "retorne aqui pois haverá uma surpresa.", 
            () => handleTextoCompleto() // 🔥 Chama a função quando a animação termina
          ]}
          wrapper="h2"
          speed={50}
          repeat={0}
          className="final-text"
        />
        <p className="click-text" style={{ opacity: podeClicar ? 1 : 0.3 }}>
          Clique em qualquer lugar para voltar
        </p>
      </div>
    </div>
  );
}
