// SPDX-License-Identifier: MIT LICENSE

// ipfs://QmXv5qh5eP1wF2MqMe3K5SeYqb9grfEHoqQAgS9kB8XjUw/   data.json
//0x7E5d1bd04280E1Ca2c5Aa2567fA5184094Fc87E5  NFT
//0xD56A96921d03243f20CD72c71703d92C016B2813 UST Fake
//0x326C977E6efc84E512bB9C30f76E30c160eD06FB LINK
//0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e TST
//0xD7E7315b859B7aB0e292c69436456905840e446f USDA

//TEST Contracts:
//0xAC1e5E3Ef7CEE6b26a81C8Fc19D13Cd63B7701c3 ERC721
//0xf61aae0b3eEB9988205dec012C9626500F107795 USDA
//0x1e72d5B403A049af04BE1f3146BBD63CC4264FE0 USDB
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

pragma solidity ^0.8.0;

contract Collection is ERC721Enumerable, Ownable {

    struct TokenInfo {
        IERC20 paytoken;
        uint256 costvalue;
    }

    TokenInfo[] public AllowedCrypto;
    
    using Strings for uint256;
    string constant public baseURI = "ipfs://QmXv5qh5eP1wF2MqMe3K5SeYqb9grfEHoqQAgS9kB8XjUw/";
    string constant baseExtension = ".json";
    uint256 constant public maxSupply = 10000;
    bool public paused = false;

    constructor() ERC721("Tulum NFT", "TLM") {}

    function addCurrency(IERC20 _paytoken, uint256 _costvalue) public onlyOwner {
        AllowedCrypto.push(
            TokenInfo({
                paytoken: _paytoken,
                costvalue: _costvalue
            })
        );
    }

    function mint(address _to, uint256 _mintAmount, uint256 _pid) public payable {
        TokenInfo storage tokens = AllowedCrypto[_pid];
        IERC20 paytoken;
        paytoken = tokens.paytoken;
        uint256 cost = tokens.costvalue;
        uint256 supply = totalSupply();
        require(!paused);
        require(_mintAmount > 0);
        require(supply + _mintAmount <= maxSupply);
        
        if (msg.sender != owner()) {
            require(canMint(_mintAmount, _pid), "Not enough balance to complete transaction.");
        }
        for (uint256 i = 1; i <= _mintAmount; i++) {
            paytoken.transferFrom(msg.sender, address(this), cost);
            _safeMint(_to, supply + i);
        }
    }

    function canMint(uint256 _mintAmount, uint256 _pid) public view returns (bool){
        TokenInfo storage tokens = AllowedCrypto[_pid];
        IERC20 paytoken = tokens.paytoken;
        uint256 cost = tokens.costvalue;
        uint256 balance = paytoken.balanceOf(msg.sender);
        return balance >= cost * _mintAmount;
    }

    function getWallet(address _wallet) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_wallet);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_wallet, i);
        }
        return tokenIds;
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(baseURI, "data", baseExtension));
    }
    
    function pause(bool _state) public onlyOwner() {
        paused = _state;
    }
    
    function withdraw(uint256 _pid) public payable onlyOwner() {
        TokenInfo storage tokens = AllowedCrypto[_pid];
        IERC20 paytoken;
        paytoken = tokens.paytoken;
        paytoken.transfer(msg.sender, paytoken.balanceOf(address(this)));
    }
}
