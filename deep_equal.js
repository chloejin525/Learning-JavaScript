/*
Write a function, deepEqual. 
It takes two values and returns true only if they are 
  (1) the same value, OR
  (2) objects with the same properties whose values are also equal when compared with a recursive call to deepEqual. 
To ﬁnd out whether to compare two things by identity (use the === operator for that) or by looking at their properties, you can use the typeof operator. 
If it produces "object" for both values, you should do a deep comparison. 
But you have to take one silly exception into account: by a historical accident, typeof null also produces "object".
*/

// The console.log line in the function helps locate where the comparison stops

function deepEqual(a,b){
  if (typeof a === typeof b){
    if (a === b) {
      // console.log(1);
      return true;
    } else if (typeof a === 'object'){
      if (Object.keys(a).length===Object.keys(b).length) {
        for (var i = 0; i < Object.keys(a).length; i++) {
          var keyA = Object.keys(a)[i];
          var keyB = Object.keys(b)[i];
          var valueA = Object.values(a)[i];
          var valueB = Object.values(b)[i];
          if (keyA !== keyB || valueA !== valueB ) {
            // console.log(2);
            return false;
          }
        }
        // console.log(3);
        return true;
      }
      else {
        // console.log(4);
        return false;
      }
    } else {
      // console.log(5);
      return false;
    }
  } else {
    return false;
  }
}

var obj1 = { value: 1 , name: "apple"};
var obj2 = { value: 1 , name: "pear"};
deepEqual(obj1, obj2);


