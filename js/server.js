const contractSource = `
payable contract Gas = 
    record user = {
        
        ownerAddress : address,
        password : string,
        receipts : map(int, receipt)
        }

    record receipt = {
        name  :string,
        amount : int,
        buyDate : int,
        carType : string
        }
    
  

    record state = {
        users: map(string,user)
        
        }

    entrypoint init() = { users = {}}

    entrypoint getNumberOfReceipts(password : string) = 
        // let ownerAddress = Call.caller
        let receipts = state.users[password].receipts
        Map.size(receipts)


    entrypoint getNumberOfUsers() = 
        Map.size(state.users)


    // stateful entrypoint login(username': string, password' : string) = 
    //     let newUser = {
    //         userName = username',
    //         receipts = state.users[Call.caller].receipts,
    //         ownerAddress = Call.caller,
    //         password = password'
    //         }


    //     let userAddress = Call.caller
    //     switch(Map.lookup(userAddress, state.users))
    //         None => abort("")
    //         Some(x) => x

    stateful entrypoint register(name' : string, password' : string) = 
        let newUser = {
            ownerAddress = Call.caller,
            password = password',
            receipts = {}
            }
        put(state{users[password'] = newUser})
        "Successful"



    payable stateful entrypoint buyGas(
        amount' :int, carType' : string, name' : string, password' : string) = 

            let newUser  = {
               
                ownerAddress = Call.caller,
                password = password',
                receipts ={}
                }

            let receipt = {
                name = name',
                amount = amount',

                buyDate = Chain.timestamp,
                carType = carType'
            
                }

            let id = Map.size(state.users[password'].receipts) +1
            // put(state{users[password'] = newUser})
            put(state{users[password'].receipts[id] = receipt})
            // switch(Map.lookup(password', state.users))
            //     None => put(state{users[password'] = newUser, users[password'].receipts[id] = receipt})
            //     Some(x) => put(state{users[password'].receipts[id] = receipt})
      
            
            
            
            "Thank you for patronizing"


     // get a receipt of a user
    // entrypoint getOneReceipt(index:int) = 
    //     let caller = Call.caller
    //     switch(Map.lookup(index, state.users[caller].receipts[index]))
    //         None => abort("There is no receipt with this id")
    //         Some(x) => x
      
 
    entrypoint getReceipt(password : string) = 
        state.users[password].receipts
 


    

`



const contractAddress ='ct_VcpZokid52bzW8ZEQ4MZ4DEC9p7nv52MhatyJoJxxTMUyRku2';
var client = null;
var receiptArray = [];



async function callStatic(func, args) {
  //Create a new contract instance that we can interact with
  const contract = await client.getContractInstance(contractSource, {
    contractAddress
  });

  const calledGet = await contract
    .call(func, args, {
      callStatic: true
    })
    .catch(e => console.error(e));

  const decodedGet = await calledGet.decode().catch(e => console.error(e));
  console.log("number of posts : ", decodedGet);
  return decodedGet;
}

async function contractCall(func, args, value) {
  const contract = await client.getContractInstance(contractSource, {
    contractAddress
  });
  //Make a call to write smart contract func, with aeon value input
  const calledSet = await contract
    .call(func, args, {
      amount: value
    })
    .catch(e => console.error(e));

  return calledSet;
}
function renderReceipts()
{
    // receiptArray = receiptArray.sort(function(a,b){return b.Price - a.Price})
    var template = $('#template').html();
    
    Mustache.parse(template);
    var rendered = Mustache.render(template, {receiptArray});

    
  

    $('#receipt').html(rendered);
    console.log("for loop reached")
}


window.addEventListener('load', async () => {
    $("#loader").show();
    $('#sliders').hide();

    $('#registerForm').show();



    console.log("initializing client")
    client = await Ae.Aepp();
    console.log(client)
  

    
    // totalCar =  await callStatic('getTotalCars', [])
    // console.log(totalCar)

    // receipts = await callStatic('getReceipt', [])
    // console.log(receipts)
  
//     for (let i = 1; i <= totalCar; i++) {
  
     
//       const car = await callStatic('getCar', [i])
//       console.log(car)
//       console.log("This is the cars exit date : ", car.exitDate)
  
//       receiptArray.push({
//         id     : car.id,
//         owner           : car.owner,
//         nameOfCar          : car.nameOfCar,
//         image :car.image,
//         nameOfOwner          : car.nameOfOwner,
//         lisencePlate            : car.lisencePlate,
//         entryDate: Date(car.entryDate),
//         exitDate : 0,
//         checkedOut : car.checkedOut
//       })

//    renderCars();
        
//     }
  
    
    
    $("#loader").hide();
  //   $("#loader").hide();
  });
  console.log("Finished")

$('#submitBtn').click( async function (event) {
  $("#loader").show();
  event.preventDefault()
  console.log("purchasing gas ")
 
  
 


  // index = event.target.id
  // console.log("index", index)




  // console.log(index)

  password = ($('#confirmPassword').val());
  carType = ($('#model').val());
  name = ($('#name').val());
  amount = ($('#amount').val());
  console.log(amount)
  $("#loader").show();
  await contractCall("buyGas", [amount,carType, name, password], parseInt(amount, 10) )
  // var numberOfReceipts = await callStatic('getNumberOfReceipts', [password])
  // console.log("number of receipts ", numberOfReceipts)
  var receipts = await callStatic('getReceipt', [password])
  console.log(receipts)
  console.log(receipts.length)

for(i = 1; i<=receipts.length ; i++){
  var div = document.createElement("div");
  div.innerHTML =  `Receipt ${i}`;
  document.body.appendChild(div);

}
   
  $("#loader").hide();

  // location.reload()
  console.log("registered succesffully")

  // renderCars()
  $('#registerForm').hide();
  $('#sliders').show();


 


$("#loader").hide();
})
  
  
  $('#regBtn').click( async function (event) {
    $("#loader").show();
    event.preventDefault()
    console.log("registering ")
   
    
   

  
    // index = event.target.id
    // console.log("index", index)
  
 
  
  
    // console.log(index)

    password = ($('#password').val());
    // carType = ($('#model').val());
    name = ($('#name').val());
    console.log("amount ",password)
    console.log("name ",name)
    await contractCall("register", [name,password], 0)
    var numberOfReceipts = await callStatic('getNumberOfReceipts', [password])
    console.log("number of receipts ", numberOfReceipts)
    var receipts = await callStatic('getReceipt', [password])
    console.log(receipts)
    // receiptArray.push(
    //   {

    //   }
    // )
    
  
  
    // location.reload()
    console.log("registered succesffully")


  
    // renderCars()
    $('#registerForm').hide();
    $('#sliders').show();

  
   
 

  $("#loader").hide();
})