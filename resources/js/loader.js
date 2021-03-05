// =====================================================================================================
// SOme sample API functions for the Flying Dutchman data base.
// =====================================================================================================
// Author: Lars Oestreicher, 2018
//
// Adapted from a mySQL data base.
//
// We use (global) variables to store the data. This is not generally advisable, but has the
// advantage that the data is easy to access through simple APIs. Also, when storing as local storage,
// all data is stored as strings, which might be adding some complexity.
//
function allUserNames() {
    var nameCollect = [];
    for (i = 0; i < DB.users.length; i++) {
        nameCollect.push(DB.users[i].username);
    }
    return nameCollect;
}

// =====================================================================================================
// This is an example of a file that will return an array with some specific details about a
// selected user name (not the first name/alst name). It will also add details from another "database"
// which contains the current account status for the person.
//
function userDetails(userName) {
    var userCollect = [];
    var userID;
    var userIndex;
    var account;

    // First we find the user ID of the selected user. We also save the index number for the record in the JSON
    // structure.
    //
    for (i = 0; i < DB.users.length; i++) {
        if (DB.users[i].username == userName) {
            userID = DB.users[i].user_id;
            userIndex = i;
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

    // This is the way to add the details you want from the db into your own data structure.
    // If you want to change the details, then just add or remove items accordingly below.
    userCollect.push(
        DB.users[userIndex].user_id,
        DB.users[userIndex].username,
        DB.users[userIndex].first_name,
        DB.users[userIndex].last_name,
        DB.users[userIndex].email,

        account
    );

    return userCollect;
}

// =====================================================================================================
// This function will change the credit amount in the user's account. Note that the amount given as argument is the new
// balance and not the changed amount (± balance).
//
function changeBalance(userName, newAmount) {

    // We use this variable to store the userID, since that is the link between the two data bases.
    var userID;

    // First we find the userID in the user data base.
    //
    for (i = 0; i < DB.users.length; i++) {
        if (DB.users[i].username == userName) {
            userID = DB.users[i].user_id;
        };
    };

    // Then we match the userID with the account list.
    // and change the account balance.
    //
    for (i = 0; i < DB.account.length; i++) {
        if (DB.account[i].user_id == userID) {
            DB.account[i].creditSEK = newAmount;   // This changes the value in the JSON object.
        };
    };
}

// =====================================================================================================
// Returns a list of all the names of the beverages in the database. This function can be used as a
// recipe for similar functions.
//
function allBeverages() {

    // Using a local variable to collect the items.
    var collector = [];

    // The DB is stored in the variable engBev, with "spirits" as key element. If you need to select only certain
    // items, you may introduce filter functions in the loop... see the template within comments.
    //
    for (i = 0; i < engBev.length; i++) {
        collector.push([engBev[i].namn, engBev[i].varugrupp]);
    };
    return collector;
}

// =====================================================================================================
// This function returns the names of all strong beverages (i.e. all that contain a percentage of alcohol
// higher than the strength given in percent.
//
function allStrongBeverages(strength) {

    // Using a local variable to collect the items.
    //
    var collector = [];

    // The DB is stored in the variable engBev, with "spirits" as key element. If you need to select only certain
    // items, you may introduce filter functions in the loop... see the template within comments.
    //
    for (i = 0; i < engBev.length; i++) {

        // We check if the percentage alcohol strength stored in the data base is lower than the
        // given limit strength. If the limit is set to 14, also liqueuers are listed.
        //
        if (percentToNumber(engBev[i].alkoholhalt) > strength) {

            // The key for the beverage name is "namn", and beverage type is "varugrupp".
            //
            collector.push([engBev[i].namn, engBev[i].varugrupp]);
        };
    };

    // Don't forget to return the result.
    //
    return collector;
}

// =====================================================================================================
// Lists all beverage types in the database. As you will see, there are quite a few, and you might want
// select only a few of them for your data.
//
function beverageTypes() {
    var types = [];
    for (i = 0; i < engBev.length; i++) {
        addToSet(types, engBev[i].catgegory);
    };
    return types;
}

function selectedCategory(product){
    if (product == 'All'){
        return (engBev);
    }

    var types = [];

    for (i = 0; i < engBev.length; i++) {
        if (engBev[i].catgegory == product){
            types.push(engBev[i]);
        };
    };
    return types;
}

// =====================================================================================================
// Adds an item to a set, only if the item is not already there.
// The set is modelled using an array.
//
function addToSet(set, item) {
    if (!set.includes(item)) {
        set.push(item);
    }
    return set;
}

// =====================================================================================================
// Convenience function to change "xx%" into the percentage in whole numbers (non-strings).
//
function percentToNumber(percentStr) {
    return Number(percentStr.slice(0,-1));
}

// =====================================================================================================

//========================BARTENDER MENU PAGE WITH 4 FOUNCTION BELOW========================================================================



//=============Show all drinks in Available options box ==========================

list()
function list() {
    var html = '';
    engBev.forEach((ele, i) => {
        html += `
        <div class="list_item">
            <!----articleid--->
            <p class='drinkID'>${ele.articleid}</p>
            <!----articleid--->
            <p class='drinkName'>${ele.name}-${ele.alcoholstrength}</p>
            <!----name+(alcoholstrength)--->
            <p class="drinkPrice">${ele.priceinclvat}</p>
            <!----priceinclvat--->
            <a href='javascript:;' class="nav_btn" class="addToMenu" onClick='addlist(${i},this)'>Add to Menu</a>
        </div>
        `
    });
    document.querySelector('.listbox').innerHTML = html;
}


//============click 'add to menu', the drink will be add to the menu，and it will be removed from available options==========================

function addlist(index, e) {
    console.log(e.parentNode.childNodes)
    var articleid = e.parentNode.childNodes[3].innerHTML;
    var drinkName = e.parentNode.childNodes[7].innerHTML;
    var drinkPrice = e.parentNode.childNodes[11].innerHTML;
    var html = `
        <div class="list_item" id=''>
            <!----articleid--->
            <p class='drinkID'>${articleid}</p>
            <!----articleid--->
            <p class='drinkName'>${drinkName}</p>
            <!----name+(alcoholstrength)--->
            <p class="drinkPrice">${drinkPrice}</p>
            <!---priceinclvat--->
            <a onClick="deleted(${index},this)" class="deleteFromMenu"><img class="delete" src="resources/Images/delete.png"></a>
            <form class='changePriceBox'>
                <label>SEK</label>
                <input type="text" value='${drinkPrice}'>
                <a href='javascript:;' class="nav_btn" class="changePrice" onClick="changeprice(${index},this)">Change price</a>
            </form>
        </div>
    `;
    var length = document.querySelectorAll('.addlist .list_item').length;
    console.log(length);
    document.querySelector('.addlist').insertAdjacentHTML("beforeEnd", html);
    document.querySelector(`.listbox .list_item:nth-child(${index + 1})`).style.display = 'none'
}



//============click"x",the drink will be removed from Menu，and show in available options==========================

function deleted(index, e) {
    e.parentNode.remove();
    document.querySelector(`.listbox .list_item:nth-child(${index + 1})`).style.display = 'block'
}


//============In the Menu,write price+click "change price",the price will be changed.==========================


function changeprice(index, e) {
    var price = e.parentNode.childNodes[3].value;
    console.log(price)
    e.parentNode.parentNode.childNodes[11].innerHTML = price;
    document.querySelector(`.listbox .list_item:nth-child(${index + 1}) .drinkPrice`).innerHTML = price;
}
// =====================================================================================================
// END OF FILE
// =====================================================================================================
// =====================================================================================================


