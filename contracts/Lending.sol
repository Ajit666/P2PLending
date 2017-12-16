pragma solidity ^0.4.18;


contract Lending{
    
    mapping (address => mapping(address => uint256)) lendingDetails;
    event lendingDetailsBetweenLenderAndBorrower(address indexed lender, address indexed borrower, uint256 amount);
    event repaymentDetails(address lender,address borrower,uint256 amount,uint time);
	
	//It stores the lended money by lender to the borrower.
    function lendingDetailsBetweenParties(address lender,address borrower,uint amount)  returns (uint256) {
        
    if(lendingDetails[lender][borrower] > 0) 
        throw;
     else {
        lendingDetails[lender][borrower]=amount;
        lendingDetailsBetweenLenderAndBorrower(lender,borrower,amount);
     }
     
     return lendingDetails[lender][borrower];
     
    }
    
	//It returns the amount currently lended by borrower.
    function getLendingDetails(address lender,address borrower) returns (uint256) {
        return lendingDetails[lender][borrower];
    }
    
    
	//Repayment being done from borrower to lender account
    function repaymentDetailsBetweenParties(address lender,address borrower,uint256 repaymentAmountOnEachIteration) returns (bool){
        
        if(lendingDetails[lender][borrower] > 0){
            
        
            if((lendingDetails[lender][borrower] - repaymentAmountOnEachIteration) > 0){ //to check underflow
                lendingDetails[lender][borrower]-=repaymentAmountOnEachIteration;
                repaymentDetails(borrower,lender,lendingDetails[lender][borrower],now);
                return false;
            }
            else{
                uint256 temp=lendingDetails[lender][borrower];
                lendingDetails[lender][borrower]=0;
                
                repaymentDetails(borrower,lender,lendingDetails[lender][borrower],now);
                return true;
        }
        
                
        
        }
        
    }
    
    
    
    
    
    
}