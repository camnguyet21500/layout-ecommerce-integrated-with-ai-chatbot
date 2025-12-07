//   ANGULAR
var app = angular.module("myApp", []);
app.controller("proCtrl", function ($scope) {
  $scope.carts = [
    {
      id: 1,
      name: "Baebody Eye Cream Corporis",
      photo: "pro1.jpg",
      price: 68.0,
    },
  ];
  $scope.cart = [];
  $scope.cart = JSON.parse(localStorage.getItem("cart"));

  $scope.total = 0;

  for(var i = 0; i <$scope.cart.length; i++){
    $scope.total += $scope.cart[i].price * $scope.cart[i].quantity;
  }

  $scope.minus = function (id) {
    var check = false;

    for (var i = 0; i < $scope.cart.length; i++) {
      if ($scope.cart[i].id == id) {
        if ($scope.cart[i].quantity > 1) {
          $scope.cart[i].quantity--;
          localStorage.setItem("cart", JSON.stringify($scope.cart));
        } else {
          $scope.cart.splice(i, 1);
          localStorage.setItem("cart", JSON.stringify($scope.cart));
        }
      }
    }
    $scope.total = 0;
    for(var i = 0; i <$scope.cart.length; i++){
        $scope.total += $scope.cart[i].price * $scope.cart[i].quantity;
      }

  };

  $scope.add = function (id) {
    var check = false;

    for (var i = 0; i < $scope.cart.length; i++) {
      if ($scope.cart[i].id == id) {
          $scope.cart[i].quantity ++;
          localStorage.setItem("cart", JSON.stringify($scope.cart));
      }
    }
    $scope.total = 0;
    for(var i = 0; i <$scope.cart.length; i++){
        $scope.total += $scope.cart[i].price * $scope.cart[i].quantity;
      }
  };
});
