// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YourContract is ERC20 {
	address owner;
	constructor(uint256 initialSupply) ERC20("RTC Test Coin", "RTC") {
		_mint(msg.sender, initialSupply * 10**decimals());
	}
}
