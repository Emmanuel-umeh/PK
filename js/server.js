const contractSource = `
payable contract Gas = 
    record user = {
        name : string,
        ownerAddress : address,
        amount : int,
        carType : string
        }

    record state = {
        userCars : map(address,user)
        }

    entrypoint init() = { userCars = {} }

    entrypoint getNumberOfReceipt() = 
        Map.size(state.userCars)


    payable stateful entrypoint buyGas(
        amount' :int, carType' : string, name' : string) = 

            let receipt = {
                name = name',
                amount = amount',
                ownerAddress = Call.caller,
                carType = carType'
            
                }

            Chain.spend(Contract.address, amount')

            let id = getNumberOfReceipt() +1

            let userAddress = Call.caller
            put(state{userCars[userAddress] = receipt})
            
            "Thank you for patronizing"



    entrypoint getReceipt() = 
        state.userCars
 


    
    

`



const contractAddress ='ct_2eRD2SM5FPHrE3PyUsDpgV2GZTYjD7qRv3axDnJe6cr8Kf9bJP';
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
    console.log("initializing client")
    client = await Ae.Aepp();
    console.log(client)
  
    // totalCar =  await callStatic('getTotalCars', [])
    // console.log(totalCar)

    receipts = await callStatic('getReceipt', [])
    console.log(receipts)
  
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

// $('.modal-body').on('click', '#checkInBtn', async function () {
//   $("#loader").show();
//   console.log("Adding car to the blockchain")
//   // event.preventDefault();
//   console.log("Adding car to the blockchain")

  
//   // const keys = ['Lisence_no', 'owner_name', 'nameOfCar', 'd_o_a', 'image', 'slot']

//   const Lisence_no = $('#Lisence_no').val()
  
//   owner_name = ($('#owner_name').val());
//   nameOfCar = ($('#nameOfCar').val());

//   image = ($('#image').val())

  


 
//   console.log(image)

//   const promise = await contractCall("addCar", [nameOfCar, owner_name, image, Lisence_no], 0)
//  if(promise !== undefined){

   

//     const carId = await callStatic('getTotalCars', [])

//     const newCar = await callStatic('getCar', [carId])
//     receiptArray.push({
//       id     : newCar.id,
//       owner           : newCar.owner,
//       nameOfCar          : newCar.nameOfCar,
//       image :newCar.image,
//       nameOfOwner          : newCar.nameOfOwner,
//       lisencePlate            : newCar.lisencePlate,
//       entryDate: Date(newCar.entryDate),
//       exitDate : 0,
//       checkedOut : newCar.checkedOut
//     })
  
//     console.log("added")
  
//     renderCars()
  
//     $("#loader").hide();
  

// }else{
//   console.log("Reverting request, Request failed")
//   $("#loader").hide();
// }
// })

  
  
  $('#submitBtn').click( async function (event) {
    $("#loader").show();
    event.preventDefault()
    console.log("buying gas")
   
    
   

  
    // index = event.target.id
    // console.log("index", index)
  
 
  
  
    // console.log(index)

    amount = ($('#amount').val());
    console.log(amount)
    await contractCall("buyGas", [amount], parseInt(amount, 10) )
  
  
  
    // location.reload()
    console.log("bought succesffully")
  
    // renderCars()
   
 

  $("#loader").hide();
})