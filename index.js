// Default configuration
const floorCount = 10;
const liftCount = 5;

// html reference
const building = document.getElementById("building");

// global states
let floors = [];

const globalState = [];
// Global State of floors and lift -1 means no lift and the number means the id of lift. Single lift is allowed the in one floor.
// [
//   {
//     floor: 0,
//     lift: 0
//   },
//   {
//     floor: 1,
//     lift: -1
//   },
//   {
//     floor: 2,
//     lift: 1
//   },
//   {
//     floor: 3,
//     lift: 2
//   },
//   {
//     floor: 4,
//     lift: -1
//   },
// ]

for (let index = 0; index < floorCount; index++) {
  globalState.push({ floor: index, lift: -1 });
}

function createFloors() {
  // creating floor and adding it to global floors state.
  for (let index = 0; index < floorCount; index++) {
    const floorContainer = document.createElement("div");
    floorContainer.classList.add("floor", "flex");
    floorContainer.id = `floor-${index}`;
    floorContainer.innerHTML = createNewFloor(
      globalState[index].floor,
      globalState[index].lift
    );

    // console.log(floorContainer.innerHTML);
    floors.push(floorContainer);
  }

  // adding all the floors to the ui in building container
  for (let index = 0; index < floors.length; index++) {
    building.appendChild(floors[index]);
  }

  const idxs = getNIndex(floorCount - 1)
  
  // adding all the liftCount no of lifts in each floor
  for (let index = 0; index < liftCount; index++) {
    const floorIdx = idxs[index];
    console.log(floorIdx, floorCount - 1);
    const liftContainer = document.getElementById(`lift-container-${floorIdx}`);
    globalState[floorIdx].lift = index;
    liftContainer.innerHTML = createNewLift(index);

    // adding event listeners to move the lift to the only floors which have lift.
    if (floorIdx === 0) {
      const downButton = document.getElementById(`down-0`);
      downButton.addEventListener("click", () => {
        down(floorIdx, index);
      });
    } else if (floorIdx === floorCount - 1) {
      const upButton = document.getElementById(`up-${liftCount - 1}`);
      upButton.addEventListener("click", () => {
        up(floorIdx, index);
      });
    } else {
      const downButton = document.getElementById(`down-${floorIdx}`);
      const upButton = document.getElementById(`up-${floorIdx}`);
      upButton.addEventListener("click", () => {
        up(floorIdx, index);
      });
      downButton.addEventListener("click", () => {
        down(floorIdx, index);
      });
    }
    console.log(floorIdx);
  }
}

function updateFloors(state) {
  building.innerHTML = "";
  floors = [];

  // creating floor and adding it to global floors state.
  for (let index = 0; index < floorCount; index++) {
    const floorContainer = document.createElement("div");
    floorContainer.classList.add("floor", "flex");
    floorContainer.id = `floor-${index}`;
    floorContainer.innerHTML = createNewFloor(
      state[index].floor,
      state[index].lift
    );

    console.log(state[index].lift);
    floors.push(floorContainer);
  }

  // adding all the floors to the ui in building container
  for (let index = 0; index < floors.length; index++) {
    building.appendChild(floors[index]);

    if (state[index].lift !== -1) {
      // adding event listeners to move the lift to the only floors which have lift.
      if (index === 0) {
        const downButton = document.getElementById(`down-0`);
        downButton.addEventListener("click", () => {
          down(index, state[index].lift);
        });
      } else if (index === floorCount - 1) {
        const upButton = document.getElementById(`up-${floorCount - 1}`);
        upButton.addEventListener("click", () => {
          up(index, state[index].lift);
        });
      } else {
        const downButton = document.getElementById(`down-${index}`);
        const upButton = document.getElementById(`up-${index}`);
        upButton.addEventListener("click", () => {
          up(index, state[index].lift);
        });
        downButton.addEventListener("click", () => {
          down(index, state[index].lift);
        });
      }
    }
  }
}

createFloors();

function createNewFloor(floorNo, lift) {
  // add the buttons

  let buttons = ``;
  let liftToAdd = ``;

  if (floorNo === 0) {
    buttons = `
            <button class="down" id="down-${floorNo}">DOWN</button>
        `;
  } else if (floorNo === floorCount - 1) {
    buttons = `
              <button class="up" id="up-${floorNo}">UP</button>
          `;
  } else {
    buttons = `
                <button class="up" id="up-${floorNo}">UP</button>
                <button class="down" id="down-${floorNo}">DOWN</button>
            `;
  }

  if (lift !== -1 && lift !== NaN && lift !== undefined && lift !== null) {
    liftToAdd = `<div class="lift center" id=lift-${lift}>${lift}</div>`;
  }

  const baseFloor = `
    <div class="left">
      <div class="buttons flex flex-col-reverse">
          ${buttons}
      </div>
      <div class="lift-container" id="lift-container-${floorNo}">
          ${liftToAdd}
      </div>
      <div class="floor-divider"></div>
    </div>
    <div class="floor-count flex flex-col-reverse" id="floor-count-${floorNo}">
      <span>Floor ${floorNo}</span>
    </div>
`;
  return baseFloor;
}

function createNewLift(lift) {
  return `<div class="lift center" id=${lift}>${lift}</div>`;
}

function up(currentFloor, lift) {
  console.log("up", currentFloor, lift, globalState[currentFloor - 1]);
  if (globalState[currentFloor - 1].lift !== -1) {
    console.log("lift already present");
    // alert('lift already present')
    return;
  }

  globalState[currentFloor - 1].lift = lift;
  globalState[currentFloor].lift = -1;

  console.log(globalState);
  updateFloors(globalState);
}

console.log(globalState);
function down(currentFloor, lift) {
  console.log("down", currentFloor, lift, globalState[currentFloor + 1]);
  if (globalState[currentFloor + 1].lift !== -1) {
    console.log("lift already present");
    // alert('lift already present')
    return;
  }

  globalState[currentFloor + 1].lift = lift;
  globalState[currentFloor].lift = -1;

  console.log(globalState);
  updateFloors(globalState);
}

function getRandomIndx(min = 0, max = floorCount) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNIndex(n = floorCount) {
  const idxs = [];

  while (idxs.length < n) {
    const id = getRandomIndx(0, n-1)
    if (!idxs.includes(id)){
      idxs.push(id)
    }
  }
  return idxs
}