// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GoFundMe {

    struct CampaignFunds {
        address raiser;
        uint256 amount;
        uint256 timestamp;
    }

    struct Campaign {
        address beneficiary;
        uint256 startDate;
        uint256 endDate;
        uint256 goal;
        string category;
        string title;
        string description;
        string cid;
        string cidPath;
        uint256 fundsRegister;
        CampaignFunds[] funds;
    }

    mapping (string => Campaign) private campaigns;
    string[] private titleLedger;
    address private immutable owner;

    IERC20 private immutable celoToken;

    constructor(address _celoToken) {
        owner = msg.sender;
        celoToken = IERC20(_celoToken);
    }

    function exist(string calldata _title) public view returns(bool) {
        return campaigns[_title].startDate > 0;
    }

    function launch(
        uint256 _goal, string calldata _category, string calldata _title, string calldata _description,
        string calldata _cid, string calldata _cidPath
    ) external returns(bool) {
        require(!exist(_title), "Campaign already exists");
        Campaign memory campaign = Campaign({
            beneficiary: msg.sender,
            startDate: block.timestamp,
            endDate: block.timestamp,
            goal: _goal,
            category: _category,
            title: _title,
            description: _description,
            cid: _cid,
            cidPath: _cidPath,
            fundsRegister: 0,
            funds: new CampaignFunds[](0)
        });
        campaigns[_title] = campaign;
        titleLedger.push(_title);
        return true;
    }

    function contribute(string calldata _title) external payable {
        require(exist(_title), "Campaign does not exist");
        require(msg.value > 0, "Amount must be greater than 0");
        Campaign storage campaign = campaigns[_title];
        require(msg.value + campaign.fundsRegister <= campaign.goal, "Amount exceeds the campaign goal");
        celoToken.transferFrom(msg.sender, address(this), msg.value);
        CampaignFunds memory donation = CampaignFunds({
            raiser: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        });
        campaign.fundsRegister += msg.value;
        campaign.funds.push(donation);
    }

    function claim(string calldata _title) external {
        require(exist(_title), "Campaign does not exist");
        Campaign storage campaign = campaigns[_title];
        require(campaign.beneficiary == msg.sender, "You are not the beneficiary");
        require(campaign.fundsRegister == campaign.goal, "The goal has not been achieved");
        uint256 totalRaised = campaign.fundsRegister;
        campaign.fundsRegister = 0;
        for (uint i = 0; i < campaign.funds.length; i++) {
            celoToken.transfer(campaign.funds[i].raiser, campaign.funds[i].amount);
        }
        delete campaign.funds;
    }

    function getKeys() external view returns(string[] memory) {
        return titleLedger;
    }

    function fetchData(string calldata _title) external view returns(Campaign memory) {
        return campaigns[_title];
    }

    function destroy() external {
        require(msg.sender == owner, "You are not the owner");
        selfdestruct(payable(owner));
    }

    receive() external payable {}
}
