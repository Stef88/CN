const probl1 = () => {
	let pow = 1;
	let n = Math.pow(10, pow); 

	while (1 !== (1 + n)){
		pow--;
		n = Math.pow(10, pow);
	}

	return [n, pow];
}

console.log(`Rezultatul problemei 1 este ${probl1()}`);


const probl2 = () => {

	let numbers =[
		Math.random() * 100,
		Math.random() * 100,
		Math.random() * 100
	];

	while(((numbers[0]*numbers[1])*numbers[2]) === (numbers[0]*(numbers[1]*numbers[2]))) {
		numbers =[
			Math.random() * 100,
			Math.random() * 100,
			Math.random() * 100
		];
	}

	return numbers;
}

console.log(`Rezultatul problemei 2 este ${probl2()}`);

jQuery(document).ready(function(){ 
	jQuery("#solve-1").click(function(e){
		jQuery( "#solve-1" ).text( `Tha Daaa`);
		jQuery( "#solve" ).html( `<span>Rezultatul problemei 1 este ${probl1()}</span>`);
	});	
});


//Strassen

// Scalar stuff
var Scalar = {};
(function () {
	"use strict";
  Scalar.mulFunc = function (first, second) {
    return first * second;
  };

  Scalar.addFunc = function (first, second) {
    return first + second;
  };

  Scalar.subFunc = function (first, second) {
    return first - second;
  };
})();

// Matrix stuff
var Matrix = {};
(function () {
  "use strict";
  var Create2DArray = function (a, b) {
    var arr = [];
    for (var i = 0; i < a; i++) {
      arr[i] = [];
      for (var j = 0; j < b; j++) {
        arr[i][j] = 0.0;
      }
    }
    return arr;
  };

  var windower = function(win) {
    var _win = win || {};
    return {
      from_i: _win.from_i || 0,
      to_i:     _win.to_i || 0,
      from_j: _win.from_j || 0,
      to_j:     _win.to_j || 0
    };
  };

  var randomizer = function (matrix, from, to) {
    
    function getRandomInt(from, to) {
    	return Math.floor(Math.random() * (to - from + 1)) + from;
	};

    for (var i = 0; i < matrix.n; i++) {
      for (var j = 0; j < matrix.m; j++) {
        matrix.set(i, j, getRandomInt(from, to));
      }
    }
    return matrix;
  };

  var add = function(a, b) {
    if (a.n !== b.n || a.m !== b.m) {
      throw "incompatible matrices, different dimensions";
    }
    var c = Matrix.new(a.n, a.m, "(" + a.name + "+" + b.name + ")");
    for (var i = 0; i < c.n; i++) {
      for (var j = 0; j < c.m; j++) {
        var sum = Scalar.addFunc(a.get(i, j),b.get(i, j));
        c.set(i, j, sum);
      }
    }
    return c;
  };

  var sub = function(a, b) {
    if (a.n !== b.n || a.m !== b.m) {
      throw "incompatible matrices, different dimensions";
    }
    var c = Matrix.new(a.n, a.m, "(" + a.name + "-" + b.name + ")");
    for (var i = 0; i < c.n; i++) {
      for (var j = 0; j < c.m; j++) {
        var diff = Scalar.subFunc(a.get(i, j),b.get(i, j));
        c.set(i, j, diff);
      }
    }
    return c;
  };

  var mul = function(a, b, c) {
    if (a.m !== b.n) {
      throw "incompatible matrices";
    }
    for (var i = 0; i < a.n; i++) {
      for (var j = 0; j < b.m; j++) {
        var val = 0.0;
        for (var k = 0; k < a.m; k++) {
          var aCell = a.get(i, k);
          var bCell = b.get(k, j);
          var tmp = Scalar.mulFunc(aCell, bCell);
          val = Scalar.addFunc(val, tmp);
        }
        c.set(i, j, val);
      }
    }
  };

  Matrix.new = function(n, m, name) {
    var win = windower({to_i:n, to_j: m});
    return newWindowedMatrix(new Create2DArray(n,m), win, name);
  };

  var newWindowedMatrix = function (mat, windows, name) {
    var i0 = windows.from_i,
        i1 = windows.to_i,
        j0 = windows.from_j,
        j1 = windows.to_j;

    var partitioner = function(from_i, from_j, to_i, to_j, name) {
      var win = windower({
        from_i: i0 + from_i,
        to_i: i0 + to_i,
        from_j: j0 + from_j,
        to_j: j0 + to_j
      });
      return newWindowedMatrix(mat, win, name);
    };

    var checkRange = function(i, j) {
      if (i < i0)       {
        throw "i too low, was "+i+" but must be under " + i0 + " in matrix " + name;
      }
      if (i >= i1) {
        throw "i too high, was "+i+" but must not exceed " + i1 + " in matrix " + name;
      }
      if (j < j0)       {
        throw "j too low, was "+j+" but must be under " + j0 + " in matrix " + name;
      }
      if (j >= j1) {
        throw "j too high, was "+j+" but must not exceed " + j1 + " in matrix " + name;
      }
    };

    var getter = function(i, j) {
      var real_i = i + i0,
          real_j = j + j0;
      checkRange(real_i, real_j);
      return mat[real_i][real_j];
    };

    var setter = function(i, j, val) {
      var real_i = i + i0,
          real_j = j + j0;
      checkRange(real_i, real_j);
      mat[real_i][real_j] = val;
    };

    return {
      name: name || "",
      _mat: mat,
      partition: partitioner,
      randomize: function(from, to) { return randomizer(this, from, to); },
      add: function(other) { return add(this, other); },
      sub: function(other) { return sub(this, other); },
      get: getter,
      set: setter,
      n: i1 - i0,
      m: j1 - j0
    };
  };



  Matrix.stdMatrixMul = function (a, b) {
    var c = Matrix.new(a.n, b.m, "(" + a.name + b.name + ")");
    mul(a,b,c);
    return c;
  };

  var nextPow2 = function(n) {
    var currentPow2 = Math.floor(Math.log(n)/Math.log(2));
    return Math.pow(2, currentPow2 + 1);
  };

  var growNextPowerOf2 = function(orig) {
    if (orig.n !== orig.m) {
      throw "incompatible matrices, different dimensions";
    }

    var nextN = nextPow2(orig.n);
    if (nextN/2 === orig.n) {
      // Don't need to grow it
      return orig;
    }
    var grownMat = Matrix.new(nextN, nextN);
    for (var i = 0; i < orig.n; i++) {
      for (var j = 0; j < orig.n; j++) {
        grownMat.set(i, j, orig.get(i, j));
      }
    }
    return grownMat;
  };


  var strassen = function(a, b, c, leafSize) {

    if (a.n <= leafSize) {
      mul(a, b, c);
      return;
    }

    var A = growNextPowerOf2(a);
    var B = growNextPowerOf2(b);

    var n = A.n;

    var A11 = A.partition(0,   0,   n/2, n/2, "A11");
    var A12 = A.partition(0,   n/2, n/2, n,   "A12");
    var A21 = A.partition(n/2, 0,   n,   n/2, "A21");
    var A22 = A.partition(n/2, n/2, n,   n,   "A22");

    var B11 = B.partition(0,   0,   n/2, n/2, "B11");
    var B12 = B.partition(0,   n/2, n/2, n,   "B12");
    var B21 = B.partition(n/2, 0,   n,   n/2, "B21");
    var B22 = B.partition(n/2, n/2, n,   n,   "B22");

    var P1 = Matrix.new(n, n, "M1");
    var P2 = Matrix.new(n, n, "M2");
    var P3 = Matrix.new(n, n, "M3");
    var P4 = Matrix.new(n, n, "M4");
    var P5 = Matrix.new(n, n, "M5");
    var P6 = Matrix.new(n, n, "M6");
    var P7 = Matrix.new(n, n, "M7");

    leafSize++;

    strassen(A11.add(A22), B11.add(B22), P1, leafSize);
    strassen(A21.add(A22), B11         , P2, leafSize);
    strassen(A11         , B12.sub(B22), P3, leafSize);
    strassen(A22         , B21.sub(B11), P4, leafSize);
    strassen(A11.add(A12), B22         , P5, leafSize);
    strassen(A21.sub(A11), B11.add(B12), P6, leafSize);
    strassen(A12.sub(A22), B21.add(B22), P7, leafSize);

    var C11 = P1.add(P4).sub(P5).add(P7);
    var C12 = P3.add(P5);
    var C21 = P2.add(P4);
    var C22 = P1.add(P3).sub(P2).add(P6);

    var halfN = C11.n / 2;
    for (var i = 0; i < c.n; i++) {
      for (var j = 0; j < c.n; j++) {
        if (i < halfN && j < halfN) {
          c.set(i, j, C11.get(i, j));
        }
        else if (i < halfN && j >= halfN) {
          c.set(i, j, C12.get(i, j - halfN));
        }
        else if (i >= halfN && j < halfN) {
          c.set(i, j, C21.get(i - halfN, j));
        }
        else if (i >= halfN && j >= halfN) {
          c.set(i, j, C22.get(i - halfN, j - halfN));
        }
      }
    }
  };

  Matrix.strassenMatrixMul = function (a, b, leafSize) {
    if (a.n !== b.n || a.m !== b.m) {
      throw "incompatible matrices, different dimensions";
    }
    if (a.n !== a.m) {
      throw "incompatible matrices, not square matrices";
    }
    var c = Matrix.new(a.n, b.m, "M4 - Strassen");
    strassen(a, b, c, leafSize);
    return c;
  };
})();


var M1 = Matrix.new(4, 4, "M1");
var M2 = Matrix.new(4, 4, "M2");
var M3 = Matrix.new(4, 4, "M3");
var M4 = Matrix.new(4, 4, "M4");


// var randomizer = function (matrix, from, to)
M1.randomize(1, 3);
M2.randomize(1, 3);


console.log(M1);
console.log(M2);

M3 = Matrix.stdMatrixMul(M1, M2, M3);

M4 = Matrix.strassenMatrixMul(M1, M2, 1);

// var mul = function(a, b, c)

console.log(M3);
console.log(M4);

// console.log(strassen(M1, M2, 0));


