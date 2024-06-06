if (document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded',ready);
}else{
    ready();
}

var cartItemList = JSON.parse(localStorage.getItem('cartItemList')) || [];
var login_info_JSON =  localStorage.getItem("login_info");



function ready(){

    

    if(document.title != "Login"){
        const mobile = document.querySelector(".menu_toggle");
            const mobileLink = document.querySelector(".sidebar");


            mobile.addEventListener('click', function(){
                mobileLink.classList.toggle('active');
                mobile.classList.toggle('is_active');
            })

            mobileLink.addEventListener('click', function(){
                menubar = document.querySelector(".is_active");
                if(window.innerWidth <= 768 && menubar){
                    mobileLink.classList.toggle('active');
                    mobile.classList.toggle('is_active');
                }
            })

          var sidebar_login_button = document.getElementsByClassName("sidebar_login_button")[0];

          var login_info = JSON.parse(login_info_JSON);

        if(login_info===null||login_info.username === "" || login_info.password ===""){
            sidebar_login_button.innerHTML = `
            <span class="material-symbols-outlined"> login </span>Login
            
            `

            sidebar_login_button.addEventListener("click",function(){
                window.location.href = "login.html";
            
            });
        }else{
            sidebar_login_button.innerHTML = `
            <span class="material-symbols-outlined"> logout </span>Logout

            `
            sidebar_login_button.addEventListener("click",function(){
                var login_info = JSON.parse(login_info_JSON);

                login_info.username = "";
                login_info.password = "";

                login_info.address =  "";
                login_info.phoneNumber = "";
                
                login_info.gender = "";

                localStorage.setItem('login_info', JSON.stringify(login_info));

                window.location.href = "index.html";
            });
        }
        
    }

    

    if(document.title === "Login"){

        const loginButton = document.getElementsByClassName("login_button")[0];
        loginButton.addEventListener('click', login);

    }

    if(document.title === "Home Page"){
        const add_to_cart_buttons = document.getElementsByClassName("add_to_cart_button");


        for(var i = 0; i < add_to_cart_buttons.length; i++){
            add_to_cart_buttons[i].addEventListener('click', addToCart);
        }

        
        if(login_info_JSON === null||login_info.username === "" || login_info.password ===""){
            document.getElementsByClassName("welcome_p")[0].innerHTML = "Welcome Guest";
        }else{
            var login_info  = JSON.parse(login_info_JSON);

            document.getElementsByClassName("welcome_p")[0].innerHTML = "Welcome " + login_info.username;
        }

        const search_button = document.getElementsByClassName("search_button")[0];

        search_button.addEventListener("click" , searchItem);

        const filter_cardList = document.getElementsByClassName("filter_card");

        for(var i = 0; i < filter_cardList.length; i++){
            filter_cardList[i].addEventListener("click", filterItem);
        }
        
    }


    if(document.title === "MyCart"){

        const removeCartItemButtons  = document.getElementsByClassName("remove_item");

        for(var i = 0; i < removeCartItemButtons.length; i++){
            removeCartItemButtons[i].addEventListener('click', removeCartItem);
        }

        var titlePutList = [];
        var rowPutList = [];

        for (var i = 0; i < cartItemList.length; i++){

            var rowIndex = binarySearch(titlePutList,cartItemList[i].title);

            if(rowIndex!=-1){

                var quantity = rowPutList[rowIndex].getElementsByClassName("cart_item_quantity")[0].value;

                quantity = parseInt(quantity);

                

                quantity+=1

                rowPutList[rowIndex].getElementsByClassName("cart_item_quantity")[0].value = quantity.toString();

                continue;
            
            }

            var cart_row_container = document.getElementsByClassName('cart_row_container')[0];

            var cartRow = document.createElement('div');
            cartRow.classList.add('cart_row');
            cartRow.setAttribute('data-item-id', cartItemList[i].id);

            cartRow.innerHTML = `
            
            <img src="${cartItemList[i].image}" alt="cart_item" class="cart_item_img">
            <div class="cart_item_detail"><h3 class="cart_item_title">${cartItemList[i].title}</h4>
            <p class="cart_item_description">${cartItemList[i].caption}</p></div>

            <div class="cart_item_quantity_container"><button class="cart_item_decrease">-</button>
            <input type="number" class="cart_item_quantity" value="1">
            <button class="cart_item_increase">+</button></div>
            
            
            <h4 class="cart_item_price">${cartItemList[i].price}</h4>

            <button class="remove_item">Remove</button>
            
            `

            cart_row_container.append(cartRow);

            cartRow.getElementsByClassName('remove_item')[0].addEventListener('click', removeCartItem);
            cartRow.getElementsByClassName('cart_item_increase')[0].addEventListener('click', increaseCartItem);
            cartRow.getElementsByClassName('cart_item_decrease')[0].addEventListener('click', decreaseCartItem);
            cartRow.getElementsByClassName('cart_item_quantity')[0].addEventListener('change', changeCartItemQuantity);

            titlePutList.push(cartItemList[i].title);
            rowPutList.push(cartRow);

        }
        
        updateCartTotalPrice();

        

    }

    if(document.title === "Profile"){

        const save_changes = document.getElementsByClassName("save_changes")[0];
        save_changes.addEventListener("click" , saveChanges);

        login_info = JSON.parse(login_info_JSON);

        document.getElementById("username_input").value = login_info.username;
        document.getElementById("phone_input").value = login_info.phoneNumber;
        document.getElementById("address_input").value = login_info.address;
        var gender =login_info.gender;

        if (gender = "male"){
            document.getElementById("male").checked = true;
        }else{
            document.getElementById("female").checked = true;
        }
        
        


    }

    

}

function changeCartItemQuantity(event){
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }

    updateCartTotalPrice();
}

function removeCartItem(event){
    var buttonClicked = event.target;
    var cart_row = buttonClicked.parentElement;
    var itemID = cart_row.getAttribute('data-item-id');

    for(var i = 0; i < cartItemList.length; i++){
        if(cartItemList[i].id === itemID){
            cartItemList.splice(i, 1);
        }
    }

    localStorage.setItem('cartItemList', JSON.stringify(cartItemList));
    buttonClicked.parentElement.remove();
    updateCartTotalPrice();

}

function increaseCartItem(event){
    var buttonClicked = event.target;
    var cart_row = buttonClicked.parentElement.parentElement;
    var itemTitle = cart_row.getElementsByClassName('cart_item_title')[0].innerText;

    var cartItemList = JSON.parse(localStorage.getItem('cartItemList'));

    image = cart_row.getElementsByClassName('cart_item_img')[0].src;
    price = cart_row.getElementsByClassName('cart_item_price')[0].innerText;
    itemTitle = cart_row.getElementsByClassName('cart_item_title')[0].innerText;
    itemCaption =cart_row.getElementsByClassName('cart_item_description')[0].innerText;

    
    var itemID = Date.now();
    itemID = String(itemID);

    var cartItem = {
        id : itemID,
        title : itemTitle,
        caption : itemCaption,
        image : image,
        price : price,
    }

    cartItemList.push(cartItem);

    localStorage.setItem('cartItemList', JSON.stringify(cartItemList));
    updateCartTotalQuantity(cart_row);
    updateCartTotalPrice();

}

function decreaseCartItem(event){

    var buttonClicked = event.target;
    var cart_row = buttonClicked.parentElement.parentElement;
    var itemTitle = cart_row.getElementsByClassName('cart_item_title')[0].innerText;

    var cartItemList = JSON.parse(localStorage.getItem('cartItemList'));

    itemTitle = cart_row.getElementsByClassName('cart_item_title')[0].innerText;

    var quantity = 0;

    for(var i = 0; i < cartItemList.length; i++){
        if(cartItemList[i].title === itemTitle){
            quantity += 1;
        }
    }

    console.log(quantity);

    if(quantity>1){
        for(var i = 0; i < cartItemList.length; i++){
            if(cartItemList[i].title === itemTitle){
                cartItemList.splice(i, 1);
                break;
            }
        }
    }

    

    localStorage.setItem('cartItemList', JSON.stringify(cartItemList));
    updateCartTotalQuantity(cart_row);
    updateCartTotalPrice();


}


function updateCartTotalQuantity(cart_row){

    var itemTitle = cart_row.getElementsByClassName("cart_item_title")[0].innerHTML;

    var cartItemList = JSON.parse(localStorage.getItem('cartItemList'));
    
    var total = 0;

    for(var i = 0; i < cartItemList.length; i++){
        if(cartItemList[i].title === itemTitle){
            total += 1;
        }
    }

    cart_row.getElementsByClassName('cart_item_quantity')[0].value = total;

}

function addToCart(event){

    if(login_info_JSON === null){
        
        window.location.href = "login.html";
        return;

    }

    var buttonClicked = event.target;

    var itemToCart_detailCard = buttonClicked.parentElement.parentElement;
    var detail_card_caption  = itemToCart_detailCard.getElementsByClassName('detail_card_caption')[0];
    
    image = itemToCart_detailCard.getElementsByClassName('detail_img')[0].src;
    price = itemToCart_detailCard.getElementsByClassName('price')[0].innerText;
    itemTitle = detail_card_caption.getElementsByClassName('detail_title')[0].innerText;
    itemCaption =detail_card_caption.getElementsByClassName('detail_description')[0].innerText;

    itemID = Date.now();
    itemID = String(itemID);

    var cartItem = {
        id : itemID,
        title : itemTitle,
        caption : itemCaption,
        image : image,
        price : price,
    }

    cartItemList.push(cartItem);

    localStorage.setItem('cartItemList', JSON.stringify(cartItemList));
}

function searchItem(event){
     
    var searchButton = event.target;

    var itemList = [];

    var detail_cards = document.getElementsByClassName("detail_card");

        for(var i = 0; i < detail_cards.length; i++){
            
            var itemTitle = detail_cards[i].getElementsByClassName('detail_title')[0].innerText;
            
            if(itemTitle.toLowerCase().includes(searchButton.value.toLowerCase())){
                itemList.push(detail_cards[i]);
            }

            detail_cards[i].style.display = "none";

            
        }

        for(var j = 0; j < itemList.length; j++){

            detail_cards[i].style.display = "block";

        }

}

function updateCartTotalPrice(){
    var cartRowContainer = document.getElementsByClassName('cart_row_container')[0];
    var cartRows = cartRowContainer.getElementsByClassName('cart_row');
    var total = 0;

    for(var i = 0; i < cartRows.length; i++){
        var price = cartRows[i].getElementsByClassName('cart_item_price')[0].innerHTML;
        var quantity = cartRows[i].getElementsByClassName('cart_item_quantity')[0].value;

        price = price.replace('$', '');
        price = parseFloat(price);
        total  += ( price * quantity ) ;

        
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart_total_price')[0].innerHTML = '$' + total;

}

function login(event){
    
    event.preventDefault();
    var loginbutton = event.target;

    var login_container = loginbutton.parentElement;

    var username = login_container.getElementsByClassName('login_username')[0].value;
    var password = login_container.getElementsByClassName('login_password')[0].value;

    if(username === "" || password === ""){
        alert("Please enter username and password");
        return;
    }

    var login_info = {
        username : username,
        password : password,
        address : "",
        phoneNumber : "",
        
        gender : "",
    }
    
    var login_info_string = JSON.stringify(login_info);
    localStorage.setItem('login_info', login_info_string);

    window.location.href = "index.html";
}

function saveChanges(event){

    event.preventDefault();

    var saveChangeButton = event.target;

    var username = document.getElementById('username_input').value;
    var phone = document.getElementById('phone_input').value;
    var address = document.getElementById('address_input').value;
    var gender = null

    if(document.getElementById('male').checked){
        gender = "male";
    }else if(document.getElementById('female').checked){
        gender = "female";
    }

    login_info = JSON.parse(login_info_JSON);

    login_info.username = username;
    login_info.phoneNumber = phone;
    login_info.address = address;
    login_info.gender = gender;

    localStorage.setItem('login_info', JSON.stringify(login_info));

    window.location.href = "profile.html";

}

function filterItem(event){

    event.stopPropagation();

    var filterCard = event.currentTarget;

    var filterKeyword  = filterCard.getAttribute('data-filter-kind').toString();

    var detail_cards = document.getElementsByClassName("detail_card");

    for(var i = 0; i < detail_cards.length; i++){
        detail_cards[i].style.display = "none";
    }
    
    if(filterKeyword === "all"){
        
        for(var i = 0; i < detail_cards.length; i++){
            detail_cards[i].style.display = "block";
        }

    }else{

        for(var i = 0; i < detail_cards.length; i++){

            if(detail_cards[i].getAttribute('data-filter-kind').toString() === filterKeyword){
                detail_cards[i].style.display = "block";
            }

            
        }

    }






}


function binarySearch(arr, key){
    let start = 0;
    let end = arr.length - 1;

    while (start <= end) {
        let middle = Math.floor((start + end) / 2);

        if (arr[middle] === key) {
            
            return middle;
        } else if (arr[middle] < key) {
            
            start = middle + 1;
        } else {
            
            end = middle - 1;
        }
    }
    
    return -1;
}
