// contracts/VoteToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VoteToken is ERC20 {
	constructor(uint256 initialSupply) ERC20("RTC VoteToken", "RTC") {
		_mint(_msgSender(), initialSupply * 10**decimals());
	}

	function decimals() public view virtual override returns (uint8) {
		return 0;
	}
}
