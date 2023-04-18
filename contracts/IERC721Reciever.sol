// SPDX-License-Identifier: MIT
pragma solidity =0.8.19;

interface IERC721Reciever {
    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes calldata _data
    ) external returns(bytes4);
}