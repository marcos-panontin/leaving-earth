import { manuevers } from "./manuevers.js";

// CAPTURING DOM ELEMENTS

const ship = document.getElementById("shipImg");
const shipContainer = document.querySelector(".ship-icon-container");
const contextMenu = document.getElementById('contextMenu');
const locationsContainer = document.getElementById("locations-container");

//DECLARING BUTTONS
const newShipButton = document.getElementById("create-new-ship-btn");


// DECLARING VARIABLES
const shipsArray = [];
const shipTop = shipContainer.getBoundingClientRect().top;
const shipRight = shipContainer.getBoundingClientRect().right;
const shipBottom = shipContainer.getBoundingClientRect().bottom;
const shipLeft = shipContainer.getBoundingClientRect().left;

let shipCurrentLocation = "Earth";
// CHECKING WHICH LOCATION MATCHES THE SHIP COORDINATES
const locationsCollection = Array.from(
    document.getElementsByClassName("location")
);


// Calling rightClick function
document.oncontextmenu = rightClick;



//CLOSING CONTEXT MENU ON LEFT CLICK ELSEWHERE

document.addEventListener("click", (event) => {
    if (
        document.getElementById("contextMenu").innerHTML && !event.target.classList.contains('shipImg') && event.target.tagName !== 'LI') {
        document.getElementById("contextMenu").classList.add("displayNone");
    }
});

function rightClick(e) {
    // Preventing the default right click menu from popping up

    e.preventDefault();
    const targetListaDeClasses = e.target.classList;

    // Checking what class the clicked element contains and triggering the aproppriate response

    switch (true) {
        case targetListaDeClasses.contains("shipImg"):
            //REMOVING DISPLAYNONE FROM CLOSING PREVIOUS MENU
            contextMenu.classList.remove("displayNone");
console.log(e.target.parentNode.dataset.currentlocation)

            //APAGANDO O MENU ANTERIOR
            document.getElementById("contextMenu").innerHTML = "";

            //MOSTRANDO O MENU PARA NAVE
            const menu = document.createElement("ul");
            menu.classList.add("context-menu");

            // const currentLocation = findShipLocation()
            const shipId = e.target.id;
            console.log(shipId);
            // const currentLocation = shipCurrentLocation
            const currentLocation = e.target.parentNode.dataset.currentlocation;
            for (let index = 0; index < manuevers.length; index += 1) {
                if (manuevers[index].From === currentLocation) {
                    // CREATING THE MENU WITH POSSIBLE LOCATIONS
                    const menuItem = document.createElement("li");
                    menuItem.innerHTML += `<i class="bi bi-rocket-takeoff"></i> to ${manuevers[index].To} | Difficulty: ${manuevers[index].Difficulty}`;
                    menu.appendChild(menuItem);
                    // LISTENING FOR CLICKS ON LOCATIONS AND CALLING THE TRAVEL TO FUNCTION
                    menuItem.addEventListener("click", () => {
                        travelTo(manuevers[index].To, shipId);
                    });
                }
            }
            menu.style.left = e.pageX + "px";
            menu.style.top = e.pageY + "px";
            document.getElementById("contextMenu").appendChild(menu);
            break;

        case targetListaDeClasses.contains("location"):
            console.log("Clicou em locação");
            break;
    }
}


function travelTo(futureLocation, shipID) {
    contextMenu.classList.add("displayNone");
    const shipContainer = document.getElementById(shipID);

    locationsCollection.forEach((location) => {
        if (futureLocation === location.name) {
            shipContainer.setAttribute("style", "border: 1px solid black");
            shipContainer.style.gridRow = location.dataset.row;
            shipContainer.style.gridColumn = location.dataset.column;
            shipContainer.dataset.currentlocation = location.name;
        }
    });
}

function dockNewShip() {
createNewShip();
}

function createNewShip() {
    const newShip = new Ship(2, 10);
    Ship.count += 1;
    shipsArray.push(newShip);

    // creating the newShip HTML

    const newShipHTML = document.createElement('div');
    newShipHTML.classList.add("ship-icon-container");
    newShipHTML.id = `ship${Ship.count}`;
    newShipHTML.dataset.currentlocation = 'Earth'
    const newShipImgTag = document.createElement('img');
    newShipImgTag.classList.add('shipImg');
    newShipImgTag.src = `images/otherImages/nave${Ship.count}.png`;
        newShipImgTag.id = `ship${Ship.count}`

    newShipHTML.appendChild(newShipImgTag);
    locationsContainer.appendChild(newShipHTML)
}


function Ship (parameter1, parameter2) {
    this.name = `Ship${Ship.count}`;
    this.propulsion = parameter1;
    this.weight = parameter2;
    this.currentLocation = '';
    this.imageSRC = '';

}

Ship.count = 0;

// EVENT LISTENERS

newShipButton.addEventListener('click', dockNewShip)



//////////////////////////////////////////
//////// MOVING THE SHIP /////////////////
//////////////////////////////////////////






// DEPRECATED CODE

// function initialShipRender() {
//     // ship.style.gridRowStart = "5";
//     // ship.style.gridColumnStart = "3";
//     // ship.style.border = 'solid 1px yellow'
//     // console.log(ship);
// }

// initialShipRender();



// CODE FOR DRAGGING THE SHIP (NOT WORKING, DONT KNOW WHY)

// /* draggable element */
// const shipItem = document.querySelector(".shipImg");

// shipItem.addEventListener("dragstart", dragStart);

// function dragStart(e) {
    //     e.dataTransfer.setData("text/plain", e.target.id);
    //     setTimeout(() => {
        //         e.target.classList.add("hide");
        //     }, 0);
        // }
        
        // /* drop targets */
        // const locations = document.querySelectorAll(".location");
        
// boxes.forEach((box) => {
//     location.addEventListener("dragenter", dragEnter);
//     location.addEventListener("dragover", dragOver);
//     location.addEventListener("dragleave", dragLeave);
//     location.addEventListener("drop", drop);
// });

// function dragEnter(e) {
    //     e.preventDefault();
//     e.target.classList.add("drag-over");
// }

// function dragOver(e) {
    //     e.preventDefault();
    //     e.target.classList.add("drag-over");
    // }
    
    // function dragLeave(e) {
        //     e.target.classList.remove("drag-over");
        // }
        
        // function drop(e) {
            //     e.target.classList.remove("drag-over");
            
//     // get the draggable element
//     const id = e.dataTransfer.getData("text/plain");
//     const draggable = document.getElementById(id);

//     // add it to the drop target
//     e.target.appendChild(draggable);

//     // display the draggable element
//     draggable.classList.remove("hide");
// }



// UNUSED FUNCTION TO FIND SHIP LOCATION. DECIDED TO START AT EARTH AND UPDATE A CURRENTSHIPLOCATION VARIABLE
// function findShipLocation () {

//     for (let location of locationsCollection) {

    

//         //     console.log(
//         //         `Location: ${location.name} /// locationTop: ${
//         //             location.getBoundingClientRect().top
//         //         } / locationRight: ${
//         //             location.getBoundingClientRect().right
//         //         } / locationBottom: ${
//         //             location.getBoundingClientRect().bottom
//         //         } / locationLeft: ${location.getBoundingClientRect().left}`
//         //     );
        
//         // console.log(
//         //     shipTop > location.getBoundingClientRect().top &&
//         //         shipBottom < location.getBoundingClientRect().bottom &&
//         //         shipLeft > location.getBoundingClientRect().left &&
//         //         shipRight < location.getBoundingClientRect().right
//         // );

//         if (
//             shipTop > location.getBoundingClientRect().top &&
//             shipBottom < location.getBoundingClientRect().bottom &&
//             shipLeft > location.getBoundingClientRect().left &&
//             shipRight < location.getBoundingClientRect().right
//         ) {

//             shipCurrentLocation = location.name;
//             return shipCurrentLocation;
//         }
//     };
// }