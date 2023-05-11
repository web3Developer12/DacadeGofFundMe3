//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract GoFundMe {
    /*
        This defines a campaign struct that will store information about 
        each fundraising campaign launched using the GoFundMe contract.
    */
    struct campaign {
        bytes32 hash;
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
        bool    closed         ;
    }

    mapping    (bytes32 => campaign) campaigns;
    bytes32[]  hashes;
    address[]  allowedToClaim;


    /*Register hash off all campaings in the blockchain */
    address     private immutable owner;


    

    constructor(){
        /*owner of the smart contract*/
        owner = msg.sender;
    }

    function isAllowedToClaim() internal view returns(bool){
        for(uint256 i=0;i<allowedToClaim.length;++i){
            if(allowedToClaim[i] == msg.sender){
                return true;
            }
        }
        return false;
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
            hash,msg.sender,block.timestamp,block.timestamp + 22 weeks,
            _goal * (10 ** 18),0,0,_category,_title,_description,_cid,_cidPath,false
        );

        campaigns[hash] = _newCampaign;
        hashes.push(hash);
        allowedToClaim.push(msg.sender);
        return hash;
    }

    /**This function raise a specific campaign */
    function contribute(bytes32 key) external payable{

        require(exist(key) == true);
        require(msg.value > 0);

        uint256 remaining = campaigns[key].goal - campaigns[key].celoRaised;
        require(msg.value <= remaining,"amount exceed goal");
        
        campaigns[key].donations  += 1;
        campaigns[key].celoRaised += msg.value;
    }
    
    /*Only beneficiary listed can withdraw funds */
    modifier onlyAllowedToClaim {
      require(isAllowedToClaim());
      _;
    }

    /**This function claim the total celo raised for a campaign */
    function claim(bytes32 key) external onlyAllowedToClaim{

        require(exist(key) == true && campaigns[key].closed == false);
        require(campaigns[key].beneficiary == msg.sender);
        (bool s,) = (msg.sender).call{value:campaigns[key].celoRaised}("");
        require(s);
        campaigns[key].closed = true;
    }

    function getHashes() external view returns(bytes32[] memory){
        return hashes;
    }

    function readByHashes(bytes32 key) external view returns(campaign memory){
        return campaigns[key];
    }

    receive() external payable{}

}
