pragma solidity ^0.4.24;

contract BlindAuction {
   

    address public beneficiary;
    uint public biddingEnd;
    uint public revealEnd;
    bool public ended;
    mapping(address => bytes32) blindBids;
    mapping(address => uint) deposits;
    mapping(address => uint) flag;

    address public highestBidder;
    uint public highestBid;


    // Allowed withdrawals of previous bids
    mapping(address => uint) pendingReturns;//暗帳
    mapping(address => uint) pocket;//總帳
    event AuctionEnded(address winner, uint highestBid);

    /// Modifiers are a convenient way to validate inputs to
    /// functions. `onlyBefore` is applied to `bid` below:
    /// The new function body is the modifier's body where
    /// `_` is replaced by the old function body.
    modifier onlyBefore(uint _time) { require(now < _time); _; }
    modifier onlyAfter(uint _time) { require(now > _time); _; }

    constructor(
        uint _biddingTime,
        uint _revealTime,
        address _beneficiary
    ) public {
        beneficiary = _beneficiary;
        biddingEnd = now + _biddingTime;
        revealEnd = biddingEnd + _revealTime;
    }

    /// Place a blinded bid with `_blindedBid` = keccak256(value,
    /// fake, secret).
    /// The sent ether is only refunded if the bid is correctly     <----最後用ether交易
    /// revealed in the revealing phase. The bid is valid if the
    /// ether sent together with the bid is at least "value" and
    /// "fake" is not true. Setting "fake" to true and sending
    /// not the exact amount are ways to hide the real bid but
    /// still make the required deposit. The same address can
    /// place multiple bids.
    //function check() public view returns(uint e){
    //  e=eeee;
    //  return e;  
    //}
    function checkpocket() public view returns(uint pr){
        if(ended){
        if(pendingReturns[msg.sender] > 0){
            uint am = pendingReturns[msg.sender];
            pendingReturns[msg.sender] = 0;
            pocket[msg.sender] += am;
        }
        pr = pocket[msg.sender];
        flag[msg.sender] = 4;
        }
        else{
            pr = 0;
        }
        return pr;
    }
      
    function checkhb() public view returns(address hb){
        hb = highestBidder;
        return hb;
    }

    function checkprice() public view returns(uint price){
        price = highestBid;
        return price;
    }


    function bid(uint value1,bool fake1,bytes1 secret1)
    public
        //onlyBefore(biddingEnd)
    {
        if(flag[msg.sender] == 0){      //流程鎖#0
            bytes32 _blindedBid = keccak256(abi.encodePacked(value1, fake1, secret1));
            blindBids[msg.sender] = _blindedBid;
            deposits[msg.sender] = 1000;
            
            flag[msg.sender]=1;
        }
    }

    /// Reveal your blinded bids. You will get a refund for all
    /// correctly blinded invalid bids and for all bids except for
    /// the totally highest.
    //<>/
    function reveal(uint value,bool fake,bytes1 secret)
        public
        onlyBefore(revealEnd)
       // payable
    {
        //Bid bid = bids[msg.sender];
    uint refund;
        
        if(flag[msg.sender]==1){       //流程鎖#1
            if(blindBids[msg.sender] != keccak256(abi.encodePacked(value, fake, secret))){
            }
            else{
                refund = deposits[msg.sender];
                
                if(refund >= value){
                
                    if (placeBid(msg.sender, value)){
                    
                        refund -= value;
                        refund -= uint(value/200+2);//<>/          
                    }
                    else{//<>/
                
                        refund -= value;
                        refund -= uint(value/200+2);//<>/先付滿
                        pendingReturns[msg.sender] += value;//<>/
                        pendingReturns[msg.sender] += uint(value/250+1);//<>/ 
                    }
                }
                
                blindBids[msg.sender] = bytes32(0);
            }   
            
            pendingReturns[msg.sender] += refund;
            flag[msg.sender]=2;
        //msg.sender.transfer(refund);
        }
    }

    // This is an "internal" function which means that it
    // can only be called from the contract itself (or from
    // derived contracts).
    function placeBid(address bidder, uint value) internal ///  判定當前最高出價
            returns (bool success)
    {        
        //if
        if (value <= highestBid) {
            return false;
        }
        if (highestBidder != 0) {
            // Refund the previously highest bidder.
            pendingReturns[highestBidder] += highestBid;
            pendingReturns[highestBidder] += uint(highestBid/250+1);//<>/ //
        }

        highestBid = value;
        highestBidder = bidder;                          ///只紀錄當前最高者的address
        
        return true;
    }

    /// Withdraw a bid that was overbid. 
    function withdraw() 
        public
        //payable
        //onlyAfter(revealEnd)//<>/
    {
        uint amount = pendingReturns[msg.sender];
        
        if (amount > 0 && flag[msg.sender]==2) { //流程鎖#2
            // It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `transfer` returns (see the remark above about
            // conditions -> effects -> interaction).
            pocket[msg.sender]+= amount;//丟回去明帳
            pendingReturns[msg.sender] = 0;
            
            flag[msg.sender]=0;//回到未出價狀態
            //msg.sender.transfer(amount);

        }
    }

    /// End the auction and send the highest bid
    /// to the beneficiary.
    function auctionEnd()
        public
        onlyAfter(revealEnd)
    {
        require(!ended);
        emit AuctionEnded(highestBidder, highestBid); ///<-----得標者highestbidder
        ended = true;
        uint payvalue;
        uint pay = uint(highestBid/250+1);//<>/
        payvalue = (highestBid-pay);//要付給beneficary的金額
        pocket[highestBidder]+=highestBid;
        pocket[highestBidder]-=payvalue;
        //beneficiary.transfer(highestBid-pay);//<>/
    }

}