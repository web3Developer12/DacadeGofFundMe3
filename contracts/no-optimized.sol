//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract OptimizedNo{

    struct campaign {
        address beneficiary;
        uint256 startDate;
        uint256 endDate;
        uint256 goal;
        string  category;
        string  title;
        string  description;
        string  storageCid;
    }
    
    struct campaign_funds {
        address raiser;
        uint256 amount;
        uint256 timestamp;
    }
   
    campaign[] campaigns;
    mapping(string => campaign_funds[]) campaigns_funds;
    mapping(string => campaign)       campaigns_details;
    string[] title_ledger;
    address owner;

    constructor(){
        owner = msg.sender;
    }

    function exist(string memory _title) internal view returns(bool){
        for(uint256 i=0;i<title_ledger.length;i++){
            string memory _str = title_ledger[i];
            if(keccak256(abi.encodePacked(_str)) == keccak256(abi.encodePacked(_title))){
                return true;
            }
        }
        return false;
    }

    function launch(
        uint256 _startDate,uint256 _endDate,uint256 _raisedAmount,
        string memory _category,string memory _title,string memory _description,string memory _cid
    ) external returns(bool){

        require(exist(_title) != true,"campaign already exist");
        campaign  memory _campaign= campaign(
            msg.sender,_startDate,_endDate,_raisedAmount,_category,
            _title,_description,_cid
        );

        campaigns.push(_campaign);
        campaigns_details[_title] = _campaign;
        title_ledger.push(_campaign.title);
        return true;
    }

    function contribute(string memory _title) external payable{

        require(exist(_title) == true,"campaign don't exist");
        require(msg.value > 0,"amount must be greater than 0");
        require(
            (msg.value / (10 ** 18)) > campaigns_details[_title].goal == false,
            "amount exceed the campaign goal"
        );

        campaign_funds memory donation =  campaign_funds(
            msg.sender,msg.value,block.number
        );
        campaigns_funds[_title].push(donation);
    }

    function claim(string memory _title) external payable{

        require(exist(_title) == true,"campaign don't exist");
        require(campaigns_details[_title].beneficiary == msg.sender,"you are not the beneficiary");

        uint256 _totalRaised = 0;
        campaign_funds[] memory _funds = campaigns_funds[_title];
        for(uint256 i=0;i<_funds.length;i++){
            _totalRaised+=_funds[i].amount;
            delete _funds[i];
        }
        require(_totalRaised == campaigns_details[_title].goal,"the goal is not yet achieved");
        payable(campaigns_details[_title].beneficiary).transfer(_totalRaised);

    }
    function fetch() external view returns(campaign[] memory){
        return campaigns;
    }

    receive() external payable{

    }
    

}
