//============================= Drag and Drop ================================

function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, el) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	ev.target.appendChild(document.getElementById(data));
}

//============================== Switch language ===============================
function switchLanguage () {
  if (language=='en'){// English
     document.getElementById("languageId").src="./resources/img/swedish.png";  
     language='se';
     update_language();
     update_total();
  }else{
    document.getElementById("languageId").src="./resources/img/english.png";
    language='en';
    update_language();
    update_total();
  }// Swedish
}

function update_language(){
  keys = lanDict['keys'];
  for (idx in keys) {
      key = keys[idx];
      $("." + key).text(get_string(key));
      $("#" + key).text(get_string(key));
  };
}
//==============================


function getInfo() {
    var username = document.getElementById("uname").value
    var password = document.getElementById("psw").value
    var typeofuser = null;
	
	//looks though all the users in DBloaded.js and sets usertype into the corresponging type if
	//user+password matches
    for(i = 0; i < DB.users.length; i++){
		
        if(username == DB.users[i].username && password == DB.users[i].password) { 
			typeofuser = DB.users[i].credentials;
			localStorage.setItem("userID", DB.users[i].user_id);
			localStorage.setItem("LoggedIn", true);
		}
        
    }
	// checks which type of user logged in and switches onto the corresponding page or error if no user+password matched
	switch (typeofuser) {
  		case "0":
			window.location.href = "bartenderMain.html";
			break;
  		case "3":
			update_userInfo();
			document.getElementById('myLogin').style.display = "none";
			//window.location.href = "vipProfile.html";
			break;
  		default:
			window.location.href = "https://datahahah.ytmnd.com";
	}
}


function update_userInfo() {
    
	var userID;
    var userName;
	var account;
	var loggedIn;
	
	loggedIn = localStorage.getItem("LoggedIn");
	
	userID = localStorage.getItem("userID");

    // First we find the user ID of the selected user. We also save the index number for the record in the JSON
    // structure.
    //
    for (i = 0; i < DB.users.length; i++) {
        if (DB.users[i].user_id == userID) {   
            userName = DB.users[i].first_name  + " " + DB.users[i].last_name;
        };
    };

    // We get the current account status from another table in the database, account. We store this in
    // a variable here for convenience.
    //
    for (i = 0; i < DB.account.length; i++) {
        if (DB.account[i].user_id == userID) {
            account = DB.account[i].creditSEK;
        }
    };

    loginContainer = document.getElementById('loginContainer')
	
	var button = document.createElement('button');
	
	if (loggedIn == "true"){
		
		loginContainer.removeChild(loginContainer.firstChild);
		
		button.innerHTML = 'Logout';
		button.onclick = function() {localStorage.setItem("LoggedIn", false); localStorage.setItem("userID", null); update_userInfo()};
		button.className="loginButton";
		loginContainer.appendChild(button);	
		
		document.getElementById('userInfo').style.display = "initial";
		document.getElementById('userNameP').textContent = userName;
		document.getElementById('userCreditP').textContent = "Credits: " + account + " kr";
		
		
	} 
	else {	
		
		loginContainer.removeChild(loginContainer.firstChild);

		button.innerHTML = 'Login';
		button.onclick = function() {document.getElementById('myLogin').style.display='block'};
		button.className="loginButton";
		loginContainer.appendChild(button);
		document.getElementById('userInfo').style.display = "none";
				
	}
}

//============================== Purchase Items ===============================

function add_to_cart (prod){
  var newElement = add_element_to_cart(prod);
  document.getElementById('cartItems').appendChild(newElement);
  update_total();
}

function remove_cart_items(id){
  var myNode = document.getElementById('cartItems'); // find the cart
  for (i = 0; i < myNode.childNodes.length; i++) { 
    if (myNode.childNodes[i].id == id){ //if the cart item is the same as the id we want
      myNode.removeChild(myNode.childNodes[i]);  // remove from cart 
    }
  }
  update_total();
}

function change_quantity(){
  //get content from page 
  //perform operation 
  //update model 
  //update view
  update_total();
}

function update_total(){
  var total = 0;
  var myNode = document.getElementById('cartItems'); // find the cart
  for (i = 0; i < myNode.childNodes.length; i++) { 
    if (isFinite(myNode.childNodes[i].childNodes[3].value) && myNode.childNodes[i].childNodes[3].value > 0){
      var itemTotal = multiply(myNode.childNodes[i].childNodes[1].textContent, myNode.childNodes[i].childNodes[3].value);
      total = add(total, itemTotal);
      }
      else{
      total = 0;
      }
  }
  var popupTot = document.getElementById('cartSubTotal');
  var pageTot = document.getElementById('total');
  pageTot.textContent = lanDict[language].total + " " + total.toFixed(2) + ' kr';
  popupTot.textContent = pageTot.textContent;
}

// Work in progress
function show_drink_dets(prod){

  console.log (prod);

}

//============================== Sort and Select Catagories ========================
function set_categories (){
  var children = document.getElementById("filterBox").children;
  for (i = 0; i < children.length; i++){
    children[i].id = topCategory[i];
  }
}

function list_selected(category){
  var category = category.id;
  remove_prod(); //clear list
  var list = selectedCategory(category);
  var iter = list.length;
  if (iter > cnst['max_list_item']){ iter = cnst['max_list_item']};
  for (i = 0; i < iter; i++){
    drink_box(list[i]);
  }
}

function remove_prod(){
  var myNode = document.getElementById("groupDrinkBox");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.lastChild);
  }
  //removes the prod boxes.
}

//============================== Create item box ========================
function drink_box(prod) {
  var prodDiv = prod.articleid; //name the div
  var dst = "groupDrinkBox"; //get the name of the head div

  var div = document.createElement('div'); //create the div
  div.className = 'singleDrinkBox';  //create the div class name for css code
  div.id = prodDiv; //make the prod id into the div id

  var img = document.createElement('img'); //for storing the img
  var name = document.createElement('p'); //for storing the name
  var price = document.createElement('p'); //for storing the price
  var addToCartButton = document.createElement('button');  //for the add to cart button 

  img.src = prod.img;
  name.textContent = prod.name + " (" + prod.alcoholstrength + ")"; 
  price.textContent = "SEK " + prod.priceinclvat;
  document.getElementById(dst).appendChild(div);
  addToCartButton.textContent = 'Add to cart';
  addToCartButton.className = 'addToCartButton';

  //functionalities
  img.onclick = function() {show_drink_dets(prod)}; // for showing drinks details 
  //add all elements to the div 
  div.onclick = function() {
  add_to_cart(prod)
  //play sound
  var audio = new Audio('./resources/addToCart.mp3');
  audio.play();
  //play sound end
  }
  
  //add all elements to the div 
  document.getElementById(prodDiv).appendChild(img);
  document.getElementById(prodDiv).appendChild(name);
  document.getElementById(prodDiv).appendChild(price);
  document.getElementById(prodDiv).appendChild(addToCartButton);
}

//=============================== Create cart item ===========================

function add_element_to_cart(prod){
  var div = document.createElement('div'); // added element 
  div.className = "basketElement";
  div.id = "Basket Item" + prod.nr;

  var name = document.createElement('itemTitle');
  var price = document.createElement('itemPrice');
  var quantity = document.createElement('input');
  var deleteButton = document.createElement('button');
  var divider = document.createElement('hr');

  price.id = 'price';
  quantity.id = 'quantity';
  deleteButton.onclick = function() {remove_cart_items(div.id)};
  name.textContent = prod.name;
  price.textContent = prod.priceinclvat;
  quantity.defaultValue = 1;
  quantity.onkeyup = function(){update_total()};
  deleteButton.textContent = "Remove";

  div.appendChild(name);
  div.appendChild(price);
  div.appendChild(deleteButton);
  div.appendChild(quantity);
  div.appendChild(divider);
  return div;
}

//============================== Create order requests ========================


//============================== Update and set View ========================

function update_view() {
  // place all the products 
  for (i = 0; i < 12; i++){
    var prod = get_product(i); //THIS MAY NEED TO BE CHANGED TO JSON
    drink_box(prod);
  }
  set_categories ();
  update_language();
  update_total();
  update_userInfo();
}

// We don't update the view the first time until the document is ready
// loading.
$(document).ready(function() {
  update_view();
})
