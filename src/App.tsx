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
  if (props.group_number != 0) {
  return (
    <mesh
      position={[props.x + (props.group_len / 2), props.y, props.z]}
      ref={meshRef}
    >
      <boxGeometry args={[props.group_len, 1, 1]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  )} else {
    return <></>
  }
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
            <camera position={[-10, -10, analysisData.height / 2]} />
            {analysisData.data.map((xy, z) => 
              xy.map((x_group_data, y) => 
                x_group_data.map((group_info) => {
                  const color =
                    group_info.group == 0 ? 'white' :
                    group_info.group == 1 ? 'green' :
                    group_info.group == 2 ? 'red' :
                    group_info.group == 3 ? 'blue' :
                    group_info.group == 4 ? 'yellow' : 'white';
                  return <Box
                      x={group_info.start}
                      y={y}
                      z={z}
                      group_number={group_info.group}
                      group_len={group_info.end - group_info.start}
                      color={color}
                    />
                })
              )
            )}
          </Canvas>
          :
          (<></>)
        }
      </div>
    </div>
  );
}

export default App;
