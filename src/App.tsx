import { useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from '@tauri-apps/api/dialog';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import "./App.css";

type box_props = {
  x: number,
  y: number,
  z: number,
  group_number: number,
  group_len: number,
  color: string
}


function Box(props: box_props) {
  const meshRef = useRef<THREE.Mesh>(null!);
  // カメラの回転
  //useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  return (
    <mesh
      position={[props.x, props.y, props.z]}
      ref={meshRef}
    >
      <boxGeometry args={[props.group_len, 1, 1]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  )
}


function App() {


  const [analysisData, setAnalysisData] = useState<analysis_data | null>(null);

  async function get_analysis_data() {
    const selected = await open({
      directory: false,
      multiple: false,
    });
    if (Array.isArray(selected)) {
      // user selected multiple directories
    } else if (selected === null) {
      // user cancelled the selection
    } else {
      // user selected a single directory
      
      setAnalysisData(await invoke("read_file", {path: selected}));
    }
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
            {analysisData.data.map((xy, z) => {
              return xy.map((x_group_data, y) => {
                let x = 0;
                for (const group_info of x_group_data) {
                  if (group_info.group == 4) {
                    const box = <Box
                      x={x}
                      y={y}
                      z={z}
                      group_number={group_info.group}
                      group_len={group_info.length}
                      color='green'
                    />;
                    x = x + group_info.length;
                    return box
                  }
                }
              })
            })}
          </Canvas>
          :
          (<></>)
        }
      </div>
    </div>
  );
}

export default App;
