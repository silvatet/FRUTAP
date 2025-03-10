import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import "./Entrada.css";

export default function Entrada() {
  const navigate = useNavigate();
  const [falaContador, setFalaContador] = useState(0); // Conta quantas vezes já falou

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.zoom = "reset";

    // 🔥 Função para falar um texto com limite de 3 repetições
    const speak = (text: string) => {
      if ("speechSynthesis" in window && falaContador < 3) {
        speechSynthesis.cancel(); // Cancela qualquer fala pendente
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pt-BR";
        utterance.rate = 1;
        speechSynthesis.speak(utterance);
        setFalaContador((prev) => prev + 1); // Atualiza o contador
      } else {
        console.warn("speechSynthesis não é suportado neste navegador ou limite atingido.");
      }
    };

    // Verificar se já falou e garantir que a fala ocorra no máximo 3 vezes
    if (!sessionStorage.getItem("frutapaoFalouEntrada")) {
      speak("Seja bem-vindo à Convenção 2025 da Frutap! Eu sou Frutapão e vou te acompanhar nesse evento.");
      sessionStorage.setItem("frutapaoFalouEntrada", "true");

      // 🔥 Configura chamadas repetidas a cada 20 segundos, parando após 3 tentativas
      const falaInterval = setInterval(() => {
        if (falaContador < 3) {
          speak("Seja bem-vindo à Convenção 2025 da Frutap! Eu sou Frutapão e vou te acompanhar nesse evento.");
        } else {
          clearInterval(falaInterval); // Para de repetir após 3 tentativas
        }
      }, 20000);

      return () => clearInterval(falaInterval); // Limpa o intervalo ao desmontar o componente
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.zoom = "";
    };
  }, [falaContador]); // ⚡ Dependência para atualizar a fala corretamente

  const handleClick = () => {
    navigate("/cracha");
  };

  return (
    <div className="container" onClick={handleClick}>
      <div className="content">
        <h1 className="title">ENTRADA</h1>
        <TypeAnimation
          sequence={[
            "Seja bem-vindo à Convenção 2025 da Frutap!",
            1000,
            "Eu sou Frutapão e vou te acompanhar nesse evento.",
          ]}
          wrapper="h2"
          speed={50}
          repeat={0}
          className="intro-text"
        />
        <p className="click-text">Clique em qualquer lugar para continuar</p>
      </div>
    </div>
  );
}
