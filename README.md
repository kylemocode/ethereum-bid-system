#  盲拍投標板

##  Install 
    Pleas first install by using npm
   
    $ git clone https://github.com/ALLEN-CHUANG/eth_final_project.git
    $ cd eth_final_project; npm insatll
    $ npm install -g ganache-cli
    
## Activate 
    First make sure you have activate Ganache CLI
    
    $ ganache-cli --blockTime 5
    

## Some function bottoms required (Need input and output declare)
    Rough progress is in main function.
### for user 
    (0) contract deploy (func: build {input: (private_key, bid_endtime, reveal_endtime, what_account})
    (1) bid ( func: bid )
    (2) reveal auction ( func: reveal )
    (3) withdraw ( func: withdraw )
    (4) auction end ( func: auctionEnd )
    (5) get highest bid price ( func: highbid )
    (6) who is highbider ( func: highbider )
    (7) get account balance
    (8) Account login 

##  流程
     用戶進行合約部署(deploy contract)
    (0) 用戶抵押1000 wei
    (1) 用戶"寫投標板"(bid)                                           (流程鎖#1)
    (2) 用戶進行"正式出價"(reveal)                                     (流程鎖#2)(時間鎖"before(revealEnd)")
    (3) 用戶決定是否"重新寫價"(withdraw)                                (流程鎖#3)
        若"重新寫價"(withdraw),則將當下的"抵押餘額"(pendingReturning)存入"總還款餘額"(pocket),並回到抵押階段(0)
    (4) 關閉寫標系統(auctionend)                                                  (時間鎖"after(revealEnd)")
    (5) 根據用戶之 "總還款餘額"(pocket)中的金額進行還款     

##  Function Description in blind.sol (Need more detail descrip.)
### bid
        用戶投標專用，用戶使用此 fucntion 將欲投標之金額上標。
        ( 若用戶狀態為"0"(尚未寫板),紀錄盲標,並更改用戶狀態為"1"(已寫板) )
### reveal 
        (0) 在"出價結束前"( onlyBefore(revealEnd) )可使用
        (1) 判斷用戶輸入的資料是否與先前寫板時的盲標一致,若沒有不一致,進入(2),否則進入(5)
        (2) 將refund 設為 deposits[msg.sender](用戶抵押金),若 refund >= 出價 ,進入(3)
        (3) 判斷是否為當前最高出價,若是,進入(3-1);若否,則進入(3-2)
            (3-1) refund 扣除 (出價＋訂金+手續費),進入(4)
            (3-2) refund 扣除 (出價＋訂金+手續費),並將(出價＋訂金)加入pendingReturn,進入(4)
        (4) 清除盲標資料(防止重複reveal),進入(5)
        (5) 將refund加入pendingReturn,將用戶狀態設為"2"(已出價)
### withdraw
        (1) 若用戶之"抵押餘額"(pendingReturn)不為0,且用戶狀態為"2"(已出價),進入(2)
        (2) 將"抵押餘額"(pendingReturn)的值加入"總還款金額"(pocket  [msg.sender]),並將用戶狀態設為"0"(尚未寫板)
        p.s.用戶可透過是否能重新"寫價"(bid)去觀察自己是否成功"更新標金"(placeBid)
### auctionEnd
        (0) 在"出價結束後"(onlyAfter(revealEnd))方可使用
        (1) 宣告"投標結束"(ended = true),得標者進行扣款

### checkprice
            查看"最高標金"(highestBid)
### checkhb
            查看"得標者"(highestBidder)
### checkpocket
            (0)在"投標結束"(ended = true)之後方可使用
            查看"用戶的總還款金額"(pocket[msg.sender])          

        
    
        
    
    



