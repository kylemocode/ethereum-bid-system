#  盲拍投標板
##   流程
    user進行deploy contract
    (0) user抵押1000
    (1) user寫投標板                                        (流程鎖#1)
    (2) user進行reveal                                     (流程鎖#2)(時間鎖"before(revealEnd)")
    (3) user決定是否withdraw                                (流程鎖#3)
    若withdraw,則將當下的抵押餘額存入"pocket",並回到(0)
    (4) auctionend                                                  (時間鎖"after(revealEnd)")
    (5) 根據用戶之"pocket"中的金額進行還款       
##  函式
### bid
        若用戶狀態為"0"(尚未寫板),紀錄盲標,並更改用戶狀態為"1"(已寫板)
### reveal 
        (0) 在"revealEnd"之前皆可用
        
        (1)
            判斷用戶輸入的資料是否與先前寫板時的盲標一致,若沒有不一致,進入(2),否則進入(5)
        (2)
            將refund 設為 deposits[msg.sender](用戶抵押金),若 refund >= 出價 ,進入(3)
        (3)
            判斷是否為當前最高出價,若是,進入(3-1);若否,則進入(3-2)
        (3-1) refund 扣除 (出價＋訂金+手續費),進入(4)
        (3-2) refund 扣除 (出價＋訂金+手續費),並將(出價＋訂金)加入pendingReturn,進入(4)
        (4)
            清除盲標資料(防止重複reveal),進入(5)
        (5)
            將refund加入pendingReturn,將用戶狀態設為"2"(已出價)
### placebid
    若出價最高,更新"最高出價者"(highestBidder)與"最高標金"(highestBid)

### withdraw
        (1)
            若用戶之pendingReturn不為0,且用戶狀態為"2"(已出價),進入(2)
        (2)
            將pendingReturn的值加入"總還款金額"(pocket[msg.sender]),並將用戶狀態設為"0"(尚未寫板)
    p.s.用戶可透過是否能重新可bid去觀察自己是否成功placeBid
### auctionEnd
        (0) 在"revealEnd"之後皆可用
            
        (1)
            宣告結束(ended = true),更新payvalue
### checkprice
            查看highestBid
### checkhb
            查看highestBidder
### checkpocket
            (0)在"revealEnd"之後皆可用
        
            查看"用戶的總還款金額"(pocket[msg.sender])          

        
    
        
    
    



