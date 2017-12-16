// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.

import lending_artifacts from '../../build/contracts/Lending.json'

// Lending is our usable abstraction

var Lending = contract(lending_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var hashOfTrans;
var account,lendingInstance,accounts,iterations=0;

//change timing varaiable to change the repayment interval
var lender,borrower,repayment,iterations=0,repaymentAmountOnEachIteration=1000,timing=10000;


window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    
	Lending.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
		
      accounts = accs;
      account = accounts[0];
	  lender=accounts[4];
	   
	   
	   borrower=accounts[6];
	   
	   
	  

      
    });
  },
 
//This function lends and sends the ether to borrower.
  lendingContract : function(){
	  
	  Lending.deployed().then(function(instance){
		 
			var totalAmount=App.calculateInterest();
			if(totalAmount > 0){
			lendingInstance=instance;
			
			instance.getLendingDetails.call(lender,borrower).then(function(value){
				
				if(value.c[0] === 0){
					
					web3.eth.sendTransaction({from: lender, to: borrower, value: totalAmount},function(error,hash){
						hashOfTrans=hash;
						
					instance.lendingDetailsBetweenParties.sendTransaction(lender,borrower,totalAmount,{from:lender}).then(function(value){
						
						repayment=setInterval(App.repaymentOfAmount,10000);
						alert(value);
						
						
					});
	
	  
				});
				}
				
			});
			
			
			}
	  });
	  
  },
  // This function facilitates repayment of the borrowed amount to lender.
  repaymentOfAmount :function(){
	  
			var amountToBeSend=0;
			lendingInstance.getLendingDetails.call(lender,borrower).then(function(value){
				if(value.valueOf() > 0){
					if((value.valueOf() - repaymentAmountOnEachIteration )< 0){
						amountToBeSend=value.valueOf();
					}
					else
						amountToBeSend=repaymentAmountOnEachIteration;
					web3.eth.sendTransaction({from: borrower, to: lender, value: amountToBeSend},function(error,hash){
					lendingInstance.repaymentDetailsBetweenParties.sendTransaction(lender,borrower,amountToBeSend,{from:lender}).then(function(value){
					lendingInstance.getLendingDetails.call(lender,borrower).then(function(value){
						if(value.valueOf()){
			         var amountToBePaid = document.getElementById("amountToBePaid");
					 amountToBePaid.innerText=value;
					 var iterationsOfRepayment=document.getElementById("iterations");
					 iterations++;
					 iterationsOfRepayment.innerText='';
					 iterationsOfRepayment.innerText=iterations;
					}
			   });
			   
		   });
		   });
			}
			else{
				clearInterval(repayment);
			}
		   
	   });
	   
	
  },
  
  //This function calculates interest.
  calculateInterest : function(){
	
	var amount=document.getElementById("amount").value;
	var interestAmount = amount * 0.1;
	var totalAmount = Number(amount.valueOf()) + Number(interestAmount.valueOf());
	document.getElementById("amountToBePaid").innerText=totalAmount;
	return totalAmount;
  },
  
   
  
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});



