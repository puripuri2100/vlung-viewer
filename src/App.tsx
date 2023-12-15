import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }


  const [analysisData, setAnalysisData] = useState<analysis_result>(null);

  async function get_analysis_data() {
    setAnalysisData(await invoke("get_analysis_data"));
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <button onClick={get_analysis_data}>ファイルを選択</button>
    </div>
  );
}

export default App;
