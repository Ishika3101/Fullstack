import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Float "mo:base/Float";

actor DBank{
  stable var currentValue: Float=300; //this keyword stable will convert the variable into a persistent variable and otherwise known as flexible variable
  // currentValue :=100;  //after adding stable it will not go back to initial value when reloaded but if := this operator is used then it will redeclare

  stable var startTime=Time.now();
  // Debug.print(debug_show(startTime));

  let id=234345678456789;

  // Debug.print(debug_show(currentValue)); //print the string inside terminal
  
  //private function -only accessible within this actor to make it accessible outside this canister use keyword public
  public func topUp(amount: Float  ){ //natural number
    let tempValue: Float = currentValue-amount;
    if(tempValue>=0 ){
      currentValue+=amount;
      Debug.print(debug_show(currentValue));
    }else{
      Debug.print("Amount too large, currentValue less than 0");
    }
  };
  public func withdrawl(amount: Float){
    currentValue-=amount;
    Debug.print(debug_show(currentValue));
  }; 
  // read -only func-query calls
  public query func checkBalance(): async Float{ //whenever we have output(return) that output should come asynchronously
    return currentValue;
  };
  public func compound(){
    let currentTime=Time.now();
    let timeElapsedNS= currentTime-startTime;
    let timeElapsedS= timeElapsedNS/1000000000; //ns to sec
    currentValue := currentValue*(1.01 ** Float.fromInt(timeElapsedS));
    startTime := currentTime;
  }
}




// import Debug "mo:base/Debug";
// import Time "mo:base/Time";
// import Float "mo:base/Float";

// actor DBank {
//   stable var currentValue: Float = 300;
//   stable var startTime = Time.now();

//   let id = 234345678456789;

//   public func topUp(amount: Float) {
//     let tempValue: Float = currentValue + amount;
//     if (tempValue >= 0) {
//       currentValue += amount;
//       Debug.print(debug_show(currentValue));
//     } else {
//       Debug.print("Amount too large");
//     }
//   };

//   public func withdrawl(amount: Float) {
//     currentValue -= amount;
//     Debug.print(debug_show(currentValue));
//   };

//   public query func checkBalance(): async Float {
//     return currentValue;
//   };

//   public func compound() {
//     let currentTime = Time.now();
//     let timeElapsedNS = currentTime - startTime;
//     let timeElapsedS: Float = Float.fromInt(timeElapsedNS) / 1_000_000_000.0;
//     currentValue := currentValue * (1.01 ** timeElapsedS);
//     startTime := currentTime;
//   };
// }