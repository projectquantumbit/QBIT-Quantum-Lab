export const EXPERIMENTS=[
 {id:'superposition',number:'01',title:'Quantum Superposition',tag:'Beginner',description:'Create a balanced qubit state and observe probability amplitudes after a Hadamard gate.'},
 {id:'entanglement',number:'02',title:'Bell-State Entanglement',tag:'Intermediate',description:'Build a Bell pair and observe correlations between two entangled qubits.'},
 {id:'interference',number:'03',title:'Quantum Interference',tag:'Beginner',description:'Use H–Z–H to see phase information change measurement outcomes.'},
 {id:'teleportation',number:'04',title:'Teleportation Preparation',tag:'Advanced',description:'Explore the coherent gates of teleportation. The measurement/feed-forward stage is explained separately.'},
 {id:'grover',number:'05',title:'Grover’s Search',tag:'Advanced',description:'Mark a two-qubit target state, then amplify its probability.'},
 {id:'qft',number:'06',title:'Quantum Fourier Transform',tag:'Advanced',description:'Explore the unitary gates and controlled phase rotations of a three-qubit QFT.'},
];
export const LESSONS=[
 {title:'A Quantum Bit',body:'Unlike a classical bit, a pure qubit is described by complex amplitudes α|0⟩ + β|1⟩, with |α|² + |β|² = 1. Measurement does not reveal both amplitudes; it samples an outcome.'},
 {title:'Superposition',body:'A Hadamard gate prepares (|0⟩ + |1⟩)/√2 from |0⟩. Each measured outcome then has probability 1/2. Superposition is more than simple uncertainty because phase affects later gates.'},
 {title:'Quantum Gates',body:'Single-qubit gates are 2×2 unitary matrices. Applied to complex amplitudes, they preserve state normalization. Controlled gates condition an operation on the state of another qubit.'},
 {title:'Quantum Entanglement',body:'The Bell state (|00⟩ + |11⟩)/√2 cannot be factored into two independent pure qubit states. Measuring either qubit produces correlated results. Local Bloch vectors are mixed.'},
 {title:'Interference & Phase',body:'Quantum amplitudes may add or cancel. The H–Z–H example maps |0⟩ to |1⟩, showing how phase becomes a measurable difference after another gate.'},
 {title:'Quantum Measurement',body:'For basis state k with amplitude aₖ, the Born rule gives probability |aₖ|². Repeated circuit runs approximate these probabilities, while one ideal measurement collapses the state.'},
 {title:'Bloch Sphere',body:'The Bloch sphere represents the reduced state of one qubit. Pure states lie on its surface; entanglement with other qubits can produce vectors inside the sphere.'},
 {title:'Quantum Algorithms',body:'Grover’s search uses amplitude amplification. The quantum Fourier transform transforms computational-basis amplitudes and appears in several quantum algorithms.'},
];
