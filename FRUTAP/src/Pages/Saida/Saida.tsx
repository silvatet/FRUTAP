import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./Saida.css";

function Saida() {
  const navigate = useNavigate();
  const [selecoes, setSelecoes] = useState<string[]>([]);
  const [dadosSalvos, setDadosSalvos] = useState(false);
  const [podeClicar, setPodeClicar] = useState(false); // 🔥 Permite navegação após salvamento

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Impede rolagem
    document.body.style.zoom = "reset"; // Impede zoom

    const speak = (text: string) => {
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel(); // Cancela falas pendentes
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pt-BR";
        utterance.rate = 1;
        speechSynthesis.speak(utterance);
      } else {
        console.warn("speechSynthesis não é suportado neste navegador.");
      }
    };

    if (!sessionStorage.getItem("frutapaoFalouSaida")) {
      setTimeout(() => {
        speak("Selecione suas expectativas para o evento.");
        sessionStorage.setItem("frutapaoFalouSaida", "true");
      }, 1000);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.zoom = "";
    };
  }, []);

  const handleCheckboxChange = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = evento.target;
    setSelecoes((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleConfirmar = () => {
    if (selecoes.length === 0) {
      alert("Selecione pelo menos uma opção.");
      return;
    }
    salvarEmExcel();
  };

  const salvarEmExcel = () => {
    const data = selecoes.map((selecao, index) => ({
      ID: index + 1,
      Expectativa: selecao,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expectativas");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "expectativas-evento.xlsx");
    setDadosSalvos(true);

    // 🔥 Permite a navegação ao clicar na tela após 2s
    setTimeout(() => {
      setPodeClicar(true);
    }, 2000);
  };

  // 🔥 Ao clicar na tela, vai para a tela final se puder clicar
  const handleClick = () => {
    if (podeClicar) {
      navigate("/final");
    }
  };

  return (
    <div className="container" onClick={handleClick}>
      <h1 className="title">EXPECTATIVAS DO EVENTO</h1>
      <p className="text">Marque os itens que mais lhe interessam:</p>

      <div className="checkbox-container">
        <label>
          <input type="checkbox" value="Lançamentos" onChange={handleCheckboxChange} />
          Lançamentos
        </label>
        <label>
          <input type="checkbox" value="Campanhas de marketing" onChange={handleCheckboxChange} />
          Campanhas de marketing
        </label>
        <label>
          <input type="checkbox" value="História da Frutap" onChange={handleCheckboxChange} />
          História da Frutap
        </label>
        <label>
          <input type="checkbox" value="Outros" onChange={handleCheckboxChange} />
          Outros
        </label>
      </div>

      <button className="botao-confirmar" onClick={handleConfirmar} disabled={dadosSalvos}>
        {dadosSalvos ? "Salvando..." : "Confirmar"}
      </button>

      {podeClicar && <p className="click-text">Clique na tela para continuar</p>}
    </div>
  );
}

export default Saida;
