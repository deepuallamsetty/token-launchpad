// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC20Token.sol";


contract TokenFactory{

   address[] public allTokens;
   mapping(address => address[]) public tokensByOwner;

   event TokenCreated(address indexed tokenAddress,address indexed owner, string name, string symbol, uint256 initialSupply);

   function createToken(string memory _name,string memory _symbol,uint256 _intialSupply) external returns(address){
    
       ERC20Token newToken = new ERC20Token(_name,_symbol,_intialSupply,msg.sender);
       allTokens.push(address(newToken));
       tokensByOwner[msg.sender].push(address(newToken));
       emit TokenCreated(address(newToken),msg.sender,_name,_symbol,_intialSupply);
       return address(newToken);
   }


   function getAllTokens() external view returns (address[] memory) {
    return allTokens;
}

function getTokensByOwner(address _owner) external view returns (address[] memory) {
    return tokensByOwner[_owner];
}

function getTotalTokens() external view returns (uint256) {
    return allTokens.length;
}

}