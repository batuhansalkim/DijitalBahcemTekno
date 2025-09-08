// Zeynep'in gönderdiği ABI dosyası
// Bu dosyayı Zeynep sana gönderecek

export const REGISTRY_ABI = [
  "function registerTree(string memory rfid, string memory cid, bytes memory deviceSig) external",
  "function getByRfid(string memory rfid) external view returns (string memory)",
  "function registerSatelliteData(string memory location, string memory cid) external",
  "event TreeRegistered(string indexed rfid, string cid, address indexed owner, uint256 timestamp)",
  "event SatelliteDataRegistered(string location, string cid, uint256 timestamp)"
];

export const ACCESS_CONTROL_ABI = [
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function grantRole(bytes32 role, address account) external",
  "function revokeRole(bytes32 role, address account) external",
  "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
  "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)"
];

export const VERIFIER_ABI = [
  "function verifySignature(bytes memory signature, string memory data, address expectedSigner) external pure returns (bool)",
  "function verifyRFIDSignature(string memory rfid, uint256 timestamp, bytes memory signature) external pure returns (bool)"
];
