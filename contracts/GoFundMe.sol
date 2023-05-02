/**

@title GoFundMe
@dev A smart contract that allows users to create and contribute to fundraising campaigns
@notice This contract is licensed under the MIT license
*/


//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GoFundMe{

    struct campaign_funds {
        address raiser;
        uint256 amount;
        uint256 timestamp;
    }

    struct campaign {
        address beneficiary;
        uint256 startDate;
        uint256 endDate;
        uint256 goal;
        string  category;
        string  title;
        string  description;
        string  web3storage;
        string  web3storagePath;
        uint256 totalRaised;
    }

    mapping    (string => campaign) campaigns;

    string[]   title_ledger;
    address    immutable owner;

    campaign  _pointer_campaign;


    IERC20 private immutable celoToken = IERC20(0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9);


    constructor(){
        owner = msg.sender;
    }

    /**
        * @dev Check if a campaign exists
        * @param _key The title of the campaign
        * @return true if the campaign exists, false otherwise
    */

    function exist(string calldata _key) internal view returns(bool){
        return campaigns[_key].startDate > 0 ? true:false;
    }

    /**
        * @dev Create a new fundraising campaign
        * @param _goal The fundraising goal in wei
        * @param _category The category of the campaign
        * @param _title The title of the campaign
        * @param _description The description of the campaign
        * @param _cid The IPFS CID of the campaign
        * @param _cidPath The IPFS CID path of the campaign
        * @return true if the campaign is successfully created
    */
    function launch(
    uint256 _goal,string calldata _category,string calldata _title,string calldata _description,string calldata _cid,string calldata _cidPath
) external returns(bool){

    require(exist(_title) == false,"campaign already exist");

    campaign memory newCampaign;
    newCampaign.beneficiary = msg.sender;
    newCampaign.startDate   = block.timestamp;
    newCampaign.endDate     = block.timestamp;
    newCampaign.goal        = _goal;
    newCampaign.category    = _category;
    newCampaign.title       = _title;
    newCampaign.description = _description;
    newCampaign.web3storage = _cid;
    newCampaign.web3storagePath = _cidPath;

    campaigns[_title] = newCampaign;
    title_ledger.push(_title);

    return true;
}

    /**
        * @dev Contribute to a fundraising campaign
        * @param _title The title of the campaign
    */
    function contribute(string calldata _title) external payable{

        require(exist(_title) == true,"campaign don't exist");
        require(msg.value > 0,"amount must be greater than 0");
        require(msg.value + campaigns[_title].totalRaised <= campaigns[_title].goal, "Amount exceed the campaign goal");
        celoToken.approve(address(this) ,msg.value);
        celoToken.transferFrom(msg.sender, address(this), msg.value);        

        campaigns[_title].totalRaised += msg.value;
        
    }

    /**
        @dev Allows the beneficiary of a campaign to claim the funds if the goal has been achieved.
        @param _title The title of the campaign.
        Requirements:
        The campaign must exist.
        The caller must be the beneficiary of the campaign.
        The total amount raised must be equal to the campaign goal.
        Approval must be granted to this contract to transfer the funds on behalf of the user.
    */

    function claim(string calldata _title) external payable{

        require(exist(_title) == true,"campaign don't exist");
        require(campaigns[_title].beneficiary == msg.sender,"you are not the beneficiary");
        require(
            campaigns[_title].totalRaised == campaigns[_title].goal,
            "the goal is not yet achieved"
        );
        uint256 _totalRaised = campaigns[_title].totalRaised;
        celoToken.approve(address(this), _totalRaised);
        celoToken.transferFrom(address(this),campaigns[_title].beneficiary,_totalRaised);
        
    }

    /**
        @dev Returns an array of campaign titles that have been launched.
        @return An array of strings representing the campaign titles.
    */

    function getKeys() external view returns(string[] memory){
        return title_ledger;
    }

    /**
        @dev Returns the campaign data associated with the given _key.
        @param _key The key of the campaign to fetch data for.
        @return The campaign data stored in a campaign struct.
    */
    function fetchData(string calldata _key) external view returns(campaign memory){
        return campaigns[_key];
    }

    receive() external payable{

    }

    /**
        @dev Destroys the contract and transfers any remaining funds to the owner.
        Requirements:
        The contract must have no remaining funds.
        Only the owner can call this function.
    */

    function destroy() external {
        uint256 balance = address(this).balance;
        require(balance <= 0, "No remaining funds");
        require(msg.sender == owner);
        selfdestruct(payable(msg.sender));
    }
}
