let btn = document.querySelector('#btn');
let liftSpaces = document.querySelector('#lift_space');
let backButton = document.querySelector('#regenerate_btn');
let box = document.querySelector('.form-simulate');
liftSpaces.style.display = 'none';
let floorCnt = document.querySelector('#floorcount');
let liftCnt = document.querySelector('#lift');

btn.addEventListener('click', () => {
  if(floorCnt.value <= 0 || liftCnt.value <= 0){ 
    alert("Enter a Valid Number!!");
          return ;
  }

  let element;
  let liftSection = document.createElement('div');
  liftSection.setAttribute('id', 'lift_section');
  let liftAvailable = new Map();
  let box = document.querySelector('.form-simulate');
  let floorCount = document.querySelector('#floorcount');
  let liftCount = document.querySelector('#lift');
  let lift_Space = document.querySelector('#main_section');
  lift_Space.appendChild(liftSection);
  let lift = document.querySelector('#lift_space'); // for lift space

  
  box.style.display = 'none';
  let floor;

  for (let i = 0; i < floorCount.value; i++) {
    floor = document.createElement('div');
    floor.className = 'floor';

    const floorNumber = i + 1;
    floor.classList.add('floorNumber', floorNumber);

    const upButton = `<button type="button" class ='buttonList upButtonList' data-floor-number="${floorNumber}">Up</button>`;
    const downButton = `<button type="button" class ='buttonList downButtonList' data-floor-number="${floorNumber}">Down</button>`;

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
    let pTag = document.createElement('p');
    pTag.setAttribute('id', 'floorCount');
    let num = floorCount.value - i; // number of floor counts
    let textnew = document.createTextNode('Floor No. ' + num);
    pTag.appendChild(textnew);
    floor.appendChild(pTag);
    lift_Space.appendChild(floor);
    liftAvailable.set(floor, 0);
  }
  let doorleft = '',
    doorright = '',
    lift_background = '',
    lifts = [],
    distance = '';
  initialValue = 0;

  for (let j = 0; j < liftCount.value; j++) {
    doorleft = document.createElement('div');
    doorleft.setAttribute('class', 'left');
    doorright = document.createElement('div');
    doorright.setAttribute('class', 'right');
    lift_background = document.createElement('div'); // background for the lift, when the door will open
    lift_background.setAttribute('class', 'lift_box');
    lift_background.setAttribute('id', `${j + 1}`);
    lift_background.setAttribute('data-status', 'free');
    lift_background.appendChild(doorleft);
    lift_background.appendChild(doorright);
    lift_background.style.display = 'flex';
    let last = floor.childNodes[floor.childNodes.length - 1];
    floor.insertBefore(liftSection, last);
    lift_background.setAttribute('data-status', 'free');
    lift_background.setAttribute('data-current', 0);
    liftSection.appendChild(lift_background);
    lifts.push(lift_background);
  }
  console.log('check Height before');
  console.log(floorCount.value);
  console.log(liftCount.value);
  if(floorCount.value ==1  && liftCount.value >0) { 
  element = document.getElementsByClassName("lift_box");
    console.log('check Height');
    // Get the element
    for (let j = 0; j < liftCount.value; j++) {
      element[j].style.bottom = "100px";
 }
 

}  


  let requestArray = [];
  let flag = false,
    i = 0;
  let floorList = document.querySelectorAll('.floor');
  let buttonList = document.querySelectorAll('.upButtonList');
  let downButtonList = document.querySelectorAll('.downButtonList');
  console.log(buttonList);
  let reverseButtonArray = Array.from(buttonList).reverse();
  let reverseDownButtonArray = Array.from(downButtonList).reverse();
  let reverseFloorList = Array.from(floorList).reverse();

  // console.log(reverseDownButtonArray.length);
  // setTimeout(() => {

  // up button
  reverseButtonArray.map((button, index) => {
    button.addEventListener('click', () => {
      requestArray.push(index);
      // console.log(` button click from this floor ${index}`);
      const buttonIndex = index;
      // disable this button
      button.disabled = true;
      requestArray.push(index);
      // start movement
      handleLiftMovement(index, buttonIndex, button);
      console.log('button', button);
    });
  });

  // down button
  reverseDownButtonArray.map((button, index) => {
    button.addEventListener('click', () => {
      console.log(` button click from this floor ${index}`);
      const buttonIndex = index;
      // disable this button before movement starts
      button.disabled = true;
      requestArray.push(index);
      console.log('button', button);
      // start movement
      handleLiftMovement(index + 1, buttonIndex, button);
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
  //           handleLiftMovement(position);W
  //     });

  let requestQueue = [];

  let testIndex;
  function handleLiftMovement(index, buttonIndex, button) {
    // Find the most suitable lift
    let freeLift = findNearestFreeLift(index);
  
    if (!freeLift) {
      requestQueue.push({ index, buttonIndex, button });
      return;
    }

    moveLift(freeLift, index, buttonIndex, button);
  }

  function findNearestFreeLift(targetFloor) {
    let nearestLift = null;
    let shortestDistance = Infinity;

    lifts.forEach((lift) => {
      if (lift.dataset.status === 'free') {
        const currentFloor = Number(lift.dataset.current);
        const distance = Math.abs(currentFloor - targetFloor);

        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestLift = lift;
        }
      }
    });

    return nearestLift;
  }

  function moveLift(lift, targetFloor, buttonIndex, button) {
    lift.setAttribute('data-status', 'busy');
    const currentFloor = Number(lift.dataset.current);
    const distance = Math.abs(currentFloor - targetFloor);
    // Move lift
    lift.style.bottom = `${148.8 * targetFloor}px`;
    lift.style.transition = `bottom ${distance * 2}s linear`;
   
    // Schedule door operations
    const moveTime = distance * 2000;

    setTimeout(() => {
      openDoors(lift);

      setTimeout(() => {
        closeDoors(lift);

        setTimeout(() => {
          completeLiftOperation(lift, targetFloor, button);
        }, 2500);
      }, 2500);
    }, moveTime);
  }

  // function openDoors(lift) {
  
  //   lift.childNodes[0].style.width = '0px';
  //   lift.childNodes[1].style.width = '0px';
  //   lift.childNodes[0].style.transition = 'width 2.5s linear';
  //   lift.childNodes[1].style.transition = 'width 2.5s linear';
  
  //   // lift.childNodes[0].style.position = 'absolute';  
  //   // lift.childNodes[1].style.position = 'absolute'; 
  // } 

  // function closeDoors(lift) {
  //   console.log('closeDoor');
  //   lift.childNodes[0].style.width = '1.5rem';
  //   lift.childNodes[1].style.width = '1.5rem';
  //   lift.childNodes[0].style.transition = 'width 2.5s linear';
  //   lift.childNodes[1].style.transition = 'width 2.5s linear';
  //   // lift.childNodes[0].style.position = 'absolute';  
  //   // lift.childNodes[1].style.position = 'absolute';
  //   // setTimeout(() => {
  //   //   lift.style.position = "relative"; 
  //   // }, 1000);
    
  // } 

  function openDoors(lift) {
    lift.childNodes[0].style.width = '0';
    lift.childNodes[1].style.width = '3rem';
    lift.childNodes[0].style.transition = 'width 2.5s';
    lift.childNodes[1].style.transition = 'width 2.5s';
}

function closeDoors(lift) {
    lift.childNodes[0].style.width = '90rem';
    lift.childNodes[1].style.width = '3rem';
    lift.childNodes[0].style.transition = 'width 2.5s';
    lift.childNodes[1].style.transition = 'width 2.5s';
}

  function completeLiftOperation(lift, targetFloor, button) {
    lift.setAttribute('data-status', 'free');
   
    lift.setAttribute('data-current', targetFloor);
    button.disabled = false;
    
    // Process next request if any
    if (requestQueue.length > 0) {
      const nextRequest = requestQueue.shift();
      handleLiftMovement(
        nextRequest.index,
        nextRequest.buttonIndex,
        nextRequest.button
      );
    }
  }

  // if(floorCount.value()>0 && liftCount.value()>0)
  backButton.addEventListener('click', () => {
    let child = lift_Space.firstElementChild;
    while (child) {
      child.remove();
      child = lift_Space.firstElementChild;
    }
    box.style.display = 'block';
    liftSpaces.style.display = 'none';
  });
  let liftSpaces = document.querySelector('#lift_space');
  liftSpaces.style.display = 'block';
});    
//  }
// } else  if(floorCount.value < 0 && liftCount.value <0 ) {
//      alert('Valid Numbers!!');
//   }