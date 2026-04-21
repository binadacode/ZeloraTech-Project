import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  Stars, 
  Icosahedron, 
  Sphere, 
  Line 
} from '@react-three/drei';
import * as THREE from 'three';
import styles from './SplashScreen3D.module.css';

const Core = () => {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Smooth rotation
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
    
    // Subtle pulse effect (oscillating between 1.0 and 1.1)
    const scale = 1 + Math.sin(time * 2) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <Icosahedron ref={meshRef} args={[1, 1]} position={[0, 0, 0]}>
      <meshStandardMaterial 
        color="#2684FF" 
        wireframe={true} 
        emissive="#2684FF"
        emissiveIntensity={0.5}
      />
      <pointLight intensity={2} distance={5} color="#2684FF" />
    </Icosahedron>
  );
};

const NetworkNode = ({ position }) => {
  return (
    <group>
      <Sphere args={[0.05, 16, 16]} position={position}>
        <meshStandardMaterial 
          color="#00f2ff" 
          emissive="#00f2ff" 
          emissiveIntensity={2} 
        />
      </Sphere>
      {/* Connection to core */}
      <Line 
        points={[[0, 0, 0], position]} 
        color="#00f2ff" 
        lineWidth={0.5} 
        transparent 
        opacity={0.3} 
      />
    </group>
  );
};

const TalentNetwork = () => {
  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 20; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const distance = 2.5 + Math.random() * 1.5;
      
      const x = distance * Math.sin(phi) * Math.cos(theta);
      const y = distance * Math.sin(phi) * Math.sin(theta);
      const z = distance * Math.cos(phi);
      
      temp.push([x, y, z]);
    }
    return temp;
  }, []);

  const groupRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef}>
        <Core />
        {nodes.map((pos, i) => (
          <NetworkNode key={i} position={pos} />
        ))}
      </group>
    </Float>
  );
};

const SplashScreen3D = ({ isExiting }) => {
  return (
    <div className={`${styles.container} ${isExiting ? styles.exiting : ''}`}>
      <div className={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <color attach="background" args={['#0f172a']} />
          <ambientLight intensity={0.5} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <TalentNetwork />
          
          <fog attach="fog" args={['#0f172a', 5, 20]} />
        </Canvas>
      </div>

      <div className={styles.overlay}>
        <h1 className={styles.title}>tiimi</h1>
        <div className={styles.status}>Initializing Talent Network...</div>
      </div>
    </div>
  );
};

export default SplashScreen3D;
