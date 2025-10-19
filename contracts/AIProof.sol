// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIProof {
    // Structure to store proof information
    struct ProofRecord {
        address creator;
        string cid;
        uint256 timestamp;
    }

    // Mapping from hashProof to ProofRecord
    mapping(bytes32 => ProofRecord) public proofs;

    // Event emitted when a new proof is created
    event ProofCreated(
        bytes32 indexed hashProof,
        address indexed creator,
        string cid,
        uint256 timestamp
    );

    /**
     * @dev Creates a new proof record
     * @param hashProof The hash of the prompt and AI output
     * @param cid The IPFS CID of the metadata
     */
    function createProof(bytes32 hashProof, string memory cid) public {
        // Ensure this proof hasn't been recorded before
        require(proofs[hashProof].timestamp == 0, "Proof already exists");

        // Store the proof record
        proofs[hashProof] = ProofRecord({
            creator: msg.sender,
            cid: cid,
            timestamp: block.timestamp
        });

        // Emit the event
        emit ProofCreated(hashProof, msg.sender, cid, block.timestamp);
    }

    /**
     * @dev Gets a proof record
     * @param hashProof The hash of the prompt and AI output
     * @return ProofRecord The proof record
     */
    function getProof(bytes32 hashProof) public view returns (ProofRecord memory) {
        return proofs[hashProof];
    }
}