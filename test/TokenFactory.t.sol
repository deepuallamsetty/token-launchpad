// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {TokenFactory} from "../src/tokens/TokenFactory.sol";
import {ERC20Token} from "../src/tokens/ERC20Token.sol";

contract TokenFactoryTest is Test{
    TokenFactory public tokenFactory;

    address alice=makeAddr("alice");
    address bob=makeAddr("bob");

    function setUp() public {
        tokenFactory = new TokenFactory();
    }


    function test_CreateToken()public{
        string memory name = "MyToken";
        string memory symbol = "MTK";
        uint256 initialSupply = 1000;
        address tokenAddress = tokenFactory.createToken(name, symbol, initialSupply);
        ERC20Token token = ERC20Token(tokenAddress);
        assertEq(token.name(), name);
        assertEq(token.symbol(), symbol);
        assertEq(token.totalSupply(), initialSupply*10**18);
    }

    function test_TokenTracking() public{
        address tokenAddress = tokenFactory.createToken("Token1", "TKN1", 1000);
        assertEq(tokenFactory.getTotalTokens(), 1);
        assertEq(tokenFactory.getAllTokens()[0], tokenAddress);
    }

    function test_TokensByCreator() public {
    vm.prank(alice);
    address token1 = tokenFactory.createToken("AliceToken", "ALT", 1000);
    
    vm.prank(alice);
    address token2 = tokenFactory.createToken("AliceToken2", "ALT2", 2000);

    vm.prank(bob);
    address token3 = tokenFactory.createToken("BobToken", "BOB", 500);

    address[] memory aliceTokens = tokenFactory.getTokensByOwner(alice);
    address[] memory bobTokens = tokenFactory.getTokensByOwner(bob);

    assertEq(aliceTokens.length, 2);
    assertEq(bobTokens.length, 1);
    assertEq(aliceTokens[0], token1);
    assertEq(aliceTokens[1], token2);
    assertEq(bobTokens[0], token3);
    assertEq(tokenFactory.getTotalTokens(), 3);
}

function test_CreatorGetsAllTokens() public {
    vm.prank(alice);
    address tokenAddress = tokenFactory.createToken("AliceToken", "ALT", 1000);
    
    ERC20Token token = ERC20Token(tokenAddress);
    
    assertEq(token.balanceOf(alice), 1000 * 10 ** 18);
    assertEq(token.owner(), alice);
}

function testFuzz_CreateToken(uint256 initialSupply) public {
    initialSupply = bound(initialSupply, 1, 1000000);
    
    vm.prank(alice);
    address tokenAddress = tokenFactory.createToken("FuzzToken", "FZZ", initialSupply);
    
    ERC20Token token = ERC20Token(tokenAddress);
    
    assertEq(token.totalSupply(), initialSupply * 10 ** 18);
    assertEq(token.balanceOf(alice), initialSupply * 10 ** 18);
    assertEq(tokenFactory.getTotalTokens(), 1);
}
}