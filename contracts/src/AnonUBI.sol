// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AnonUniversalBasicIncome {
    address public owner;
    uint256 public constant claimAmount = 0.001 ether;
    mapping(uint256 => bool) public hasClaimed; // Mapping of user nullifier to claim status
    mapping(address => bool) public hasAddressClaimed; // Mapping to ensure an address hasn't claimed before

    event Claimed(address indexed claimant, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    // Function to claim UBI
    function claimUBI(uint256 userNullifier) public {
        require(
            !hasClaimed[userNullifier],
            "This nullifier has already been used to claim UBI."
        );
        require(
            !hasAddressClaimed[msg.sender],
            "This address has already claimed UBI."
        );
        require(
            address(this).balance >= claimAmount,
            "Contract does not have enough funds."
        );

        hasClaimed[userNullifier] = true;
        hasAddressClaimed[msg.sender] = true;
        payable(msg.sender).transfer(claimAmount);

        emit Claimed(msg.sender, claimAmount);
    }

    // Function to deposit funds into the contract
    function depositFunds() public payable {}

    // Allow the contract to receive ETH
    receive() external payable {}
}
