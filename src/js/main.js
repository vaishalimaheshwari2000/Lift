let btn = document.querySelector("#btn");
let liftSpaces = document.querySelector("#lift_space");
let backButton = document.querySelector("#regenerate_btn");
let box = document.querySelector(".form-simulate");


liftSpaces.style.display = "none";
btn.addEventListener("click", () => {
  let liftSection = document.createElement("div");
  liftSection.setAttribute("id", "lift_section");
  let liftAvailable = new Map();
  let box = document.querySelector(".form-simulate");
  let floorCount = document.querySelector("#floorcount");
  let liftCount = document.querySelector("#lift");
  let lift_Space = document.querySelector("#main_section");
  lift_Space.appendChild(liftSection);
  let lift = document.querySelector("#lift_space"); // for lift space


  box.style.display = "none";
  let floor;

  for (let i = 0; i < floorCount.value; i++) {
    floor = document.createElement("div");
    floor.className = "floor";

    const floorNumber = i + 1;
    floor.classList.add("floorNumber", floorNumber);

    const upButton = `<button type="button" class ='buttonList upButtonList' data-floor-number="${floorNumber}">Up</button>`
    const downButton = `<button type="button" class ='buttonList downButtonList' data-floor-number="${floorNumber}">Down</button>`

    if (i > 0 && i < floorCount.value - 1) {
      floor.innerHTML += upButton;
      floor.innerHTML += downButton;
    }
    if (i == 0) {
      floor.innerHTML += downButton;
    }
    if (i == floorCount.value - 1) {
      floor.innerHTML += upButton;
    }
    let pTag = document.createElement("p");
    pTag.setAttribute("id", "floorCount");
    let num = floorCount.value - i; // number of floor counts
    let textnew = document.createTextNode("Floor No. " + num);
    pTag.appendChild(textnew);
    floor.appendChild(pTag);
    lift_Space.appendChild(floor);
    liftAvailable.set(floor, 0 );
 }
  let doorleft = "",
    doorright = "",
    lift_background = "",
    lifts = [],
    distance = "";
  initialValue = 0;


  for (let j = 0; j < liftCount.value; j++) {
    doorleft = document.createElement("div");
    doorleft.setAttribute("class", "left");
    doorright = document.createElement("div");
    doorright.setAttribute("class", "right");
    lift_background = document.createElement("div"); // background for the lift, when the door will open
    lift_background.setAttribute("class", "lift_box");
    lift_background.setAttribute("id", `${j+1}` );
    lift_background.setAttribute("data-status", "free");
    lift_background.appendChild(doorleft);
    lift_background.appendChild(doorright);
    lift_background.style.display = "flex";
    let last = floor.childNodes[floor.childNodes.length - 1];
    floor.insertBefore(liftSection, last);
    lift_background.setAttribute("data-status", "free");
    lift_background.setAttribute("data-current", 0);
    liftSection.appendChild(lift_background);
    lifts.push(lift_background);
  }

  let requestArray = [];
  let flag = false,
    i = 0;
  let floorList = document.querySelectorAll(".floor");
  let buttonList = document.querySelectorAll(".upButtonList");
  let downButtonList = document.querySelectorAll(".downButtonList");
  console.log(buttonList);
  let reverseButtonArray = Array.from(buttonList).reverse();
  let reverseDownButtonArray = Array.from(downButtonList).reverse();
  let reverseFloorList = Array.from(floorList).reverse();


  
  console.log(reverseDownButtonArray.length);
  // setTimeout(() => {

  // up button 
    reverseButtonArray.map((button,index) => {
      button.addEventListener("click", () => {
        requestArray.push(index);
        console.log(` button click from this floor ${index}`);
        const buttonIndex = index; 
        // disable this button
        button.disabled = true;
        requestArray.push(index); 
        // start movement
        handleLiftMovement(index, buttonIndex,button);
        console.log('button', button);
      });
    });


    // down button 
    reverseDownButtonArray.map((button,index) => {
      button.addEventListener("click", () => {
        console.log(` button click from this floor ${index}`);
        const buttonIndex = index;
         // disable this button before movement starts
        button.disabled = true; 
        requestArray.push(index);
        console.log('button', button);
        // start movement
        handleLiftMovement(index+1, buttonIndex,button);
       
      });
    });
   
     
  // },2000);
  //   floorList.forEach((buttonList,index)=>{

  //    console.log(index);
  //    position = index;
  //     buttonList.forEach((i,position) => {


  //         i.addEventListener("click", () => {
  //         // console.log(position);
  //         // console.log(indexReverseFloorList);
  //         handleLiftMovement(position);
  //       });
  //   });

  // });

  // for(let i = 0; i <reverseFloorList.length;i++){

  //   reverseFloorList.forEach((reverseFloorList,i) => {
  //     let buttonList = reverseFloorList.querySelector(".buttonList");

  //     // reverseFloorList.addEventListener('click', () => {
  //     // console.log(i);

  //     // buttonList.forEach((buttonList) => {


  //       buttonList.addEventListener("click", () => {
  //             console.log(i);
  //             // console.log(indexReverseFloorList);
  //             handleLiftMovement(i);
  //           },i);
  //         // });
  //       // },i);
  // });

  // buttonList.forEach((i,position) => {


  //           i.addEventListener("click", () => {
  //           // console.log(position);
  //           // console.log(indexReverseFloorList);
  //           handleLiftMovement(position);
  //     });



  let requestQueue = [];

  let testIndex;
  function handleLiftMovement(index, buttonIndex,button) {

    freeLift = lifts.find ((item) => {
      return item.dataset.status === "free";
    });
   

    // liftAvailable.set(index,freeLift.dataset.id);
  
    
    if (!freeLift) {
      requestQueue.push({ index, buttonIndex, button });
      // return;
   }
    setTimeout(() => {
      if (requestQueue.length > 0) {
        liftsMovement(freeLift, requestQueue[0]);
        freeLift.setAttribute("data-current", requestQueue[0]);
        requestQueue.shift();
      }
    }, `${(distance * 2000) + 7000}`) ;


    liftsMovement(freeLift, index, buttonIndex,button);
    
     
    freeLift.setAttribute("data-current", index);
    
    
  } 


  function liftsMovement(freeLift, floorIndex, buttonIndex,button) {
    
    freeLift.setAttribute("data-status", "busy");
    let currentPosition = Number(freeLift.dataset.current);
    distance = Math.abs(currentPosition - Number(floorIndex));
    // console.log(currentPosition, floorIndex, distance);
    freeLift.style.bottom = `${148.8 * floorIndex}px`;
    freeLift.style.transition = `bottom  ${distance * 2}s`;
    doorsMovement(freeLift, requestArray,button , buttonIndex);
  
  
  
}


  function doorsMovement(freeLift, requestArray,button , buttonIndex) {
    setTimeout(() => {
      freeLift.childNodes[0].style.width = "0px";
      freeLift.childNodes[1].style.width = "0px";
      freeLift.style.transition = "none";
      freeLift.childNodes[0].style.transition = "width 2.5s";
      freeLift.childNodes[1].style.transition = "width 2.5s";
    }, `${distance * 2000}`);
    setTimeout(() => {
      freeLift.childNodes[0].style.width = "1.5rem";
      freeLift.childNodes[1].style.width = "1.5rem";
      freeLift.childNodes[0].style.transition = "width 2.5s";
      freeLift.childNodes[1].style.transition = "width 2.5s";
      freeLift.style.transition = "none";
      freeLift.setAttribute("data-status", "free");
      // console.log(requestArray);

         
     //  enable this button
     button.disabled = false;
           


     if (requestQueue.length > 0) {
      let nextRequest = requestQueue.shift();
      handleLiftMovement(nextRequest.index, nextRequest.buttonIndex, nextRequest.button);
    }

  }, `${(distance * 2000) + 2500}`);

  }

  backButton.addEventListener("click", () => {
    let child = lift_Space.firstElementChild;
    while (child) {
      child.remove();
      child = lift_Space.firstElementChild;
    }
    box.style.display = "block";
    liftSpaces.style.display = "none";
  });
  let liftSpaces = document.querySelector("#lift_space");
  liftSpaces.style.display = "block";
});
