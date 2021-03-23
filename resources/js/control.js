//============================= Drag and Drop ================================

// Creates a function that can be used to allow for a HTML portion to be used as a drop point. Also prevents the default usage of that event which would be to 
// go to that link. In our case it's not necessary because we have no links but maybe in the future those names once dropped could be linkable to order details and we wouldn't
// want to go to order details every time we just wanted to move an order from say pending to accepted. 
function allowDrop(ev) {
	ev.preventDefault();
}
//Creates and enables... drag
function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}
//Creates and enables... drop
function drop(ev, el) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	ev.target.appendChild(document.getElementById(data));
}

//============================== Switch language ===============================
function switchLanguage () {
  if (language=='en'){
     document.getElementById("languageId").src="./resources/img/swedish.png";   // find the image and set the flag of swe
     language='se'; //change the varable 
     update_language(); 
     update_total();
  }else{
    document.getElementById("languageId").src="./resources/img/english.png"; //// find the image and set the flag of eng
    language='en'; //change the var to eng
    update_language();
    update_total();
  }
}

//This is a function to loop through all the attributes in the page and replace the langauge content with the new langauge.
function update_language(){ 
  keys = lanDict['keys']; //select the headers in the dictionary 
  for (idx in keys) { //loop through the headers 
      key = keys[idx]; //if the key pair is the one used in the page 
      //then replace.
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
			//window.location.href = "vipProfile.html";
			break;
  		default:
			window.location.href = "https://datahahah.ytmnd.com"; //Sends the user to a funny little page that tells them the imput is wrong

	}
}

// May not be fully used,  here as support for other aspects. 
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
//for when an item is selected to the cart
  var newElement = add_element_to_cart(prod);  //create a cart item using the prod id.
  document.getElementById('cartItems').appendChild(newElement); //append it to the cart.
  update_cart(); 
}

function remove_cart_items(id){  //for removing an item from the cart 
  var myNode = document.getElementById('cartItems'); // find the cart
  for (i = 0; i < myNode.childNodes.length; i++) {  //loop though all cart items 
    if (myNode.childNodes[i].id == id){ //if the cart item is the same as the id we want
      myNode.removeChild(myNode.childNodes[i]);  // remove from cart 
    }
  }
  update_cart();
}

function update_cart(){ //function for updating all the values connected to the cart.
  update_model();
  update_total();
}

function update_model(){
  //function for updating the model with the cart item.
  //The thinking here is that the cart item are added to the model when picked and then to the local memory when bought.
  selectedItems = []; //clear the array of selected items
  var myNode = document.getElementById('cartItems'); // find the cart
  for (i = 0; i < myNode.childNodes.length; i++) {  //loop though all cart item on the page
    //add them 
    set_item(
      myNode.childNodes[i].id,  //id
      myNode.childNodes[i].childNodes[0].textContent,  //name
      myNode.childNodes[i].childNodes[1].textContent,  //price
      myNode.childNodes[i].childNodes[3].value  //quantity
      );
    selectedItems.push([item.id, item.name, item.price, item.quantity]); //append them to the array
  }
}

function update_total(){  
//this is for updating the total value of the cart. There are several ways to do this. We could either 
//use the values from the model or from the control. We chose the control. This is not great design, but it works.
  var myNode = document.getElementById('cartItems'); // find the cart
  total = 0; //annul the total 
  for (i = 0; i < myNode.childNodes.length; i++) { // loop through all items in the cart
    // check if the quantity input is a number and is posetive. 
    if (isFinite(myNode.childNodes[i].childNodes[3].value) && myNode.childNodes[i].childNodes[3].value > 0){
      // multiply the quantity and the price.
      var itemTotal = multiply(myNode.childNodes[i].childNodes[1].textContent, myNode.childNodes[i].childNodes[3].value);
      total = add(total, itemTotal); // add to total
      }
  }

  //find the areas to display the elements
  var popupTot = document.getElementById('cartSubTotal'); 
  var pageTot = document.getElementById('total');
  pageTot.textContent = lanDict[language].total + " " + total.toFixed(2) + ' kr';
  popupTot.textContent = pageTot.textContent;
}

function buy_basket(){
    //This adds the array of orders to the local storage for use in the bartender page.
    localStorage.setItem("Order",selectedItems);
}

// Work in progress
function show_drink_dets(prod){
  //the idea behind this was that when you press on the drink, you will get a popup with all the drink details.
  //unfortunetly we did not have time to implment this.
  console.log (prod);
}

//============================== Sort and Select Catagories ========================
function set_categories (){
  //This is a function for setting the category filter boxes.
  var children = document.getElementById("filterBox").children;
  for (i = 0; i < children.length; i++){ //loop through the filter boxes that we have  
    children[i].id = topCategory[i]; //add an id to the box, for example "All", "Vitt vin"
  }
}

function list_selected(category){
  //this function is for showing the selected category.
  var category = category.id;
  remove_prod(); //clear list of displayed items
  var list = selectedCategory(category);  //see in loader
  var iter = list.length;  // get the length 
  if (iter > cnst['max_list_item']){ iter = cnst['max_list_item']}; //check that the list is not longer than our display limit.
  for (i = 0; i < iter; i++){ //go though the number of drinks 
    drink_box(list[i]); //create drink boxes for each
  }
}

function remove_prod(){ 
  //this function clears the view screen 
  var myNode = document.getElementById("groupDrinkBox"); //find the container
  while (myNode.firstChild) { //loop through all the items on display 
    myNode.removeChild(myNode.lastChild); //remove them 
  }
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

  img.src = prod.img; //add the image 
  name.textContent = prod.name + " (" + prod.alcoholstrength + ")";  //set the product name
  price.textContent = "SEK " + prod.priceinclvat; //set the price
  document.getElementById(dst).appendChild(div); //add the div to its destination 
  addToCartButton.className = 'addToCartButton'; //add the cart button 

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
  var div = document.createElement('div'); // create a div element
  div.className = "basketElement"; //assign a class name for it 
  div.id = prod.nr; //assign a id for it 

  //create the vars for all the box values 
  var name = document.createElement('itemTitle'); 
  var price = document.createElement('itemPrice');
  var quantity = document.createElement('input');
  var deleteButton = document.createElement('button');
  var divider = document.createElement('hr');

  price.id = 'price'; //set the id for the price 
  quantity.id = 'quantity'; //set the id for the quantity 
  deleteButton.onclick = function() {remove_cart_items(div.id)}; //add the remove from cart button
  name.textContent = prod.name; //add the text content to the name
  price.textContent = prod.priceinclvat; //same for the price
  quantity.defaultValue = 1; //set a default value of the quantity to be one 
  quantity.onkeyup = function(){update_cart()}; //make sure that the cart is updated once you type in a new quantity
  deleteButton.textContent = "Remove"; //name the remove button 

  //add to the elements to the div 
  div.appendChild(name); 
  div.appendChild(price);
  div.appendChild(deleteButton);
  div.appendChild(quantity);
  div.appendChild(divider);
  return div;
}

//============================== Update and set View ========================

function update_view() {
  // place all the products 
  for (i = 0; i < 12; i++){ // run through the page 
    var prod = get_product(i); //THIS MAY NEED TO BE CHANGED TO JSON
    drink_box(prod); //add the drink boxes  
  } 
  set_categories (); 
  update_language();
  update_cart();
  update_userInfo();
}

// We don't update the view the first time until the document is ready
// loading.
$(document).ready(function() {
  update_view();
})
