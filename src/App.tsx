import { useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import "./App.css";


function Box(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // カメラの回転
  //useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}


function App() {


  const [analysisData, setAnalysisData] = useState<analysis_data | null>(null);

  async function get_analysis_data() {
    setAnalysisData(await invoke("read_file"));
  }

  return (
    <div className="container">
      <h1>vlung</h1>

      <button style={{marginBottom:"5vh"}} onClick={get_analysis_data}>ファイルを選択</button>

      <div style={{width: "100%", height:"65vh", justifyContent: "center"}}>
        {analysisData ?
          <Canvas style={{background:"black"}}>
            <OrbitControls makeDefault />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />
          </Canvas>
          :
          (<></>)
        }
      </div>
    </div>
  );
}

export default App;
