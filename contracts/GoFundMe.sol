//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

// Imports the ERC20 token standard from the OpenZeppelin library.
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GoFundMe {
    /*
        This defines a campaign struct that will store information about 
        each fundraising campaign launched using the GoFundMe contract.
    */
    struct campaign {

        /*The owner of the campaign*/
        address beneficiary    ;
        /*The starting date of the campaign*/
        uint256 startDate      ;
        /*The ending date of the campaign*/
        uint256 endDate        ;
        /*The goal of the campaign*/
        uint256 goal           ;
        /*The total celo raised of the campaign*/
        uint256 celoRaised     ;
        /*The total donation of the campaign*/
        uint256 donations      ;
        /*The category of the campaign*/
        string  category       ;
        /*The title of the campaign*/
        string  title          ;
        /*The description of the campaign*/
        string  description    ;
        /*The link of the cover image in ipfs*/
        string  web3storage    ;
        /*The link of the path in ipfs*/
        string  web3storagePath;
    }

    /*Mapping from campaign hash to their corresponding campaign struct*/
    mapping    (bytes32 => campaign) campaigns;

    /*Register hash off all campaings in the blockchain */
    bytes32[]   private hash_register  ;
    address     private immutable owner;

    /*Instance of the CELO-ERC20 token contract.*/
    IERC20 private immutable ERC = IERC20(0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9);

    bytes32 public lastHash;

    constructor(){
        /*owner of the smart contract*/
        owner = msg.sender;
    }

    /*Check if the campaign already exist*/
    function exist(bytes32 key) internal view returns(bool){
        return campaigns[key].startDate > 0 ? true:false;
    }

    /**This function launch new campaign */
    function launch(
        uint256 _goal,
        string memory _category,
        string memory _title,
        string memory _description,
        string memory _cid,
        string memory _cidPath
    ) external returns(bytes32){

        bytes   memory encoded = abi.encode(msg.sender,_title,_cid);
        bytes32 hash = keccak256(encoded);

        require(exist(hash) == false,"campaign already exist");

        campaign memory _newCampaign = campaign(
            msg.sender,block.timestamp,block.timestamp + 22 weeks,
            _goal,0,0,_category,_title,_description,_cid,_cidPath
        );

        campaigns[hash] = _newCampaign;
        lastHash = hash;
        return hash;
    }

    /**This function raise a specific campaign */
    function contribute(bytes32 key) external payable{

        require(msg.value > 0,"amount must be greater than 0");
        require(exist(key) == true,"campaign don't exist"    );
        require(
            msg.value > campaigns[key].goal == false,
            "amount exceed the campaign goal"
        );

        ERC.transferFrom(msg.sender,address(this),msg.value);
        campaigns[key].donations +=1;
    }

    /**This function claim the total celo raised for a campaign */
    function claim(bytes32 key) external payable{

        require(exist(key) == true,"campaign don't exist");
        require(campaigns[key].beneficiary == msg.sender,"you are not the beneficiary");
        require(
            campaigns[key].celoRaised == campaigns[key].goal,
            "the goal is not yet achieved"
        );
        ERC.transferFrom(address(this),campaigns[key].beneficiary,campaigns[key].celoRaised);
    }

    receive() external payable{}

}
