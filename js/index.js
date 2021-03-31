let fecha = document.getElementById("fecha");
fecha.innerHTML = `${new Date().getUTCDay()} / ${new Date().getMonth()} / ${new Date().getFullYear()}`



// Establecemos que los metodos _product y _cashier
// recibiran como valor los objetos db_products y db_cashier
let products = _product(db_products);
let cash = _cashier(db_cash);
let purchase = _purchases(db_purchase);
let sales = _sales(db_sales);

// funcion para buscar un elemento con el id cash
// y llenarlo con el valor obtenido en la variable cash
const getCash = () =>{
  let cashText = document.getElementById("cash");
  cashText.innerHTML = `<h5 class='font-weight-bold'>Capital: $ ${cash.getStored()} MXN</h5>`
}


// constructor de tabla con for each 
const buildTable = () =>{
  let table = document.getElementById("productTable");
  let lista = table.getElementsByTagName("tbody")[0];
  lista.innerHTML = "";

  products.getAllProducts().forEach(element => {
    let row = document.createElement("tr");
    const sellButton = `sale-${element.id}`;
    const purchaseButton = `purchase-${element.id}`;
    row.innerHTML = `
      <th scope="row">${element.id}</th>
      <td>${element.name}</td>
      <td>${element.stored}</td>
      <td>${element.price}</td>
      <td><button type='button' class="btn btn-info" id="${sellButton}">Vender</button></td>
      <td><button type="button" class="btn btn-outline-info" id="${purchaseButton}">Comprar</td>
    `;
    lista.appendChild(row);
    document.getElementById(sellButton).addEventListener('click',(e) => {
      sellButtonEvent(element.id);
    });
    document.getElementById(purchaseButton).addEventListener('click',(e) =>{
      purchaseButtonEvent(element.id);
    });
  });
};




const buildSaleTable = () =>{
  let table = document.getElementById("salesTable");
  let lista = table.getElementsByTagName("tbody")[0];
  lista.innerHTML = "";

  sales.getAllSales().forEach(element => {
    let row = document.createElement("tr");
    let date = moment(element.date);
    row.innerHTML = `
      <th scope="row">${element.productId}</th>
      <td>${date.format('LLLL')}</td>
      <td>${element.quantity}</td>
      <td>${element.totalPrice}</td>
    `;
    lista.appendChild(row);
  });
};


const buildPurchaseTable = () =>{
  let table = document.getElementById("purchasesTable");
  let lista = table.getElementsByTagName("tbody")[0];
  lista.innerHTML = "";

  purchase.getAllPurchases().forEach(element => {
    let row = document.createElement("tr");
    let date = moment(element.date);
    row.innerHTML = `
      <th scope="row">${element.productId}</th>
      <td>${date.format('LLLL')}</td>
      <td>${element.quantity}</td>
      <td>${element.price}</td>
      <td>${element.totalPrice}</td>
    `;
    lista.appendChild(row);
  });
};




const sellButtonEvent = (id) =>{
  let contanier = document.getElementById("sellContanier");
  let producto = products.getProduct(id);
  contanier.innerHTML = `
  <h3 class="col-12 bg-info py-2 text-white">Venta de Producto</h3>
  <div class="col-sm-4 col-xs-5">
    <h4>${producto.name}</h4>
    <h5>Existencia: ${producto.stored}kg</h5>
  </div>  
  <div class="col-sm-5 col-xs-7">
    <label for="sellItem">Cantidad a vender (kg)</label>
    <input type="text" class="form-control" id="sellItem" required>
  </div>
  <div class="col-sm-3 mt-3 mb-3 col-xs-12">
  <button type="button" class="btn btn-lg btn-block btn-success" id="btnSellItem"> <i class="far fa-check-square"></i>&nbsp;&nbsp;Vender</button>
    <button type="button" class="btn btn-lg btn-block btn-danger" id="cancelSell"> <i class="far fa-window-close"></i>&nbsp;&nbsp;Cancelar</button>
  </div>
  `;
  document.getElementById('btnSellItem').addEventListener('click', (e) =>{
    const amount = new Number(document.getElementById("sellItem").value);
    sellProductAction(producto,amount);
 
  });

  document.getElementById('cancelSell').addEventListener('click', cancelOp);
}

const purchaseButtonEvent = (id) =>{
  let contanier = document.getElementById("purchaseContanier");
  let producto = products.getProduct(id);
  contanier.innerHTML = `
  <h3 class="col-12 bg-primary py-2 text-white">Compra de Producto</h3>
  <div class="col-sm-4 col-xs-5">
    <h4>${producto.name}</h4>
    <h5>Existencia: ${producto.stored}kg</h5>
  </div>  
  <div class="col-sm-5 mb-3 col-xs-7">
    <label for="purchaseItem">Cantidad a comprar (kg)</label>
    <input type="number" class="form-control" id="purchaseItem" required>

    <label for="purchasePrice">Precio de compra (kg)</label>
    <input type="number" class="form-control" id="purchasePrice" required>
  </div>
  <div class="col-sm-3 mt-3 col-xs-12 mb-3">
  <button type="button" class="btn btn-lg btn-block btn-success" id="btnPurchaseItem"> <i class="far fa-check-square"></i>&nbsp;&nbsp;Vender</button>
    <button type="button" class="btn btn-lg btn-block btn-danger" id="cancelPurchase"> <i class="far fa-window-close"></i>&nbsp;&nbsp;Cancelar</button>
  </div>`;
  document.getElementById('btnPurchaseItem').addEventListener('click',(e) =>{
    const amount = new Number(document.getElementById("purchaseItem").value);
    const price = new Number(document.getElementById("purchasePrice").value);
    purchaseProductAction(producto,amount,price);
  });

  document.getElementById(cancelPurchase).addEventListener('click',cancelOp)
}

const purchaseProductAction = (producto,amount,price) =>{
  try {
    const total = price * amount;
    products.purchase(producto.id,amount);
    cash.purchase(total);
    purchase.new(producto.id,amount,price);
    alert("Se realizó la operacion");
  } catch (err) {
    alert(err.error);
    
  }

  buildTable();
  getCash();
  cancelOp();
  buildPurchaseTable();
}

const sellProductAction = (product,amount) =>{
  try {
    // cantidad ingresada por precio a publico
    const totalSale = amount * product.price;
    // se invoca atributos
    products.sale(product.id,amount);
    cash.sale(totalSale);
    sales.new(product.id,amount,product.price);
    alert("Se realizó la operación")
  } catch (err) {
    alert(err.error);
  }

  buildTable();
  getCash();
  cancelOp();
  buildSaleTable();

}

const cancelOp = () =>{
  document.getElementById("sellContanier").innerHTML = "";
  document.getElementById("purchaseContanier").innerHTML = "";

}


const newProductEvent = () =>{
  const name = document.getElementById('np_name').value;
  const stored = new Number(document.getElementById('np_stored').value);
  const purchasePrice = new Number(document.getElementById('np_p_price').value);
  const salePrice = new Number(document.getElementById('np_s_price').value);

  try {
    cash.purchase(stored*purchasePrice);
    const newProd = products.newProduct(name,stored,salePrice);
    purchase.new(newProd.id,stored,purchasePrice);
  } catch (error) {
    alert(error.error);
  }
// se reconstruye la tabla con los nuevos valores del arreglo de productos
  buildTable();
  // se aplica la resta de lo que se compro y se muestra en pantalla
  getCash();
  // se resetea el formulario
  document.getElementById('addProduct').reset();
  //se invoca evento para mostrar en pantalla boton de añadir producto
  addProductEventEnd();
  buildPurchaseTable();
}

const addProductEventStart = () =>{
  document.getElementById('addProduct').style.display= "block";
  document.getElementById('addProductBtn').style.display= "none";
}

const addProductEventEnd = () =>{
  document.getElementById('addProduct').style.display= "none";
  document.getElementById('addProductBtn').style.display= "block";
}



// se dipsara la funcion submitEvent  pero recarga la pagina
// por lo que se pierde informacion pero con el metodo preventDefault
// evita la recarga
const submitEvent = (e) =>{
  e.preventDefault();

  switch(e.target.id){
    case 'addProduct':
      newProductEvent();
      break;
    default:

      break;
  }
}




addEventListener('load',getCash);
addEventListener('load',buildTable);
addEventListener('load',buildSaleTable);
addEventListener('load',buildPurchaseTable);
// al hacer clic en el boton de tipo submit

addEventListener('submit',submitEvent);
document.getElementById("addProductBtn").addEventListener('click',addProductEventStart);
document.getElementById("cancelNewProd").addEventListener('click',addProductEventEnd);
