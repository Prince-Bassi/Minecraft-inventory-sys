const craftingElem = document.querySelector(".craftingCont .craftingMenu .crafting");
const outputElem = document.querySelector(".craftingCont .craftingMenu .output");
const inventoryElem = document.querySelector(".craftingCont .inventory");
const slots = document.querySelectorAll(".craftingCont .slot");
let activeSlot;

class Slot {
       constructor(elem) {
              this.slot = elem;
              this.item = "";
              this.numItems = 0;

              this.slot.addEventListener("click", () => {
                     this.moveItem();
              });
              this.slot.addEventListener("contextmenu", (event) => {
                     event.preventDefault();
                     this.removeItem();
                     return false
              })

              this.slot.textContent = this.item;
       }

       update() {
              this.slot.innerHTML = this.item;
              if (this.numItems > 1) {
                     this.slot.innerHTML += `<sub>${this.numItems}</sub>`;
              }
       }

       removeItem() {
              this.item = "";
              this.slot.textContent = this.item;
       }

       moveItem() {
              const clickedFrom = activeSlot;
              const clickedTo = this;

              if (!clickedFrom && this.item !== "") { //For selecting boxes
                     clickedTo.slot.classList.add("active");
                     activeSlot = clickedTo;
              }
              else if (clickedFrom && (clickedTo.slot.parentNode.classList.contains("output") || (clickedFrom.slot.parentNode.classList.contains("output") && clickedTo.item != ""))) { //selected doesnt work
                     clickedFrom.slot.classList.remove("active");
                     activeSlot = undefined;
              }
       }

       switchItem(clickedFrom, clickedTo, num) {
              

              clickedFrom.update();
              clickedTo.update();

              clickedFrom.slot.classList.remove("active");
              activeSlot = undefined;
       }
}

class Inventory {
       constructor(elem) {
              this.inventory = elem;
              this.slots = Array.from(this.inventory.querySelectorAll(".slot")).map(slot => new Slot(slot));

              this.invMap = [
                     "W","S","L","W","W","W","W","W","W",
                     "","","","","","","","","",
                     "","","","","","","","",""
              ]

              this.numItemsMap = [
                     64,64,64,64,64,64,64,64,64,
                     0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0
              ]

              for (let i = 0; i < this.slots.length; i++) {
                     this.slots[i].item = this.invMap[i];
                     this.slots[i].numItems = this.numItemsMap[i];
                     this.slots[i].update();
              }
       }
}

class CraftingTable {
       constructor(elem) {
              this.table = elem;
              this.slots = Array.from(this.table.querySelectorAll(".slot")).map(slot => new Slot(slot));

              for (let slot of this.slots) {
                     slot.slot.addEventListener("click", () => {
                            this.checkRecipe();
                     });
              }
       }

       checkRecipe() {
              const currentRecipe = [];
              for (let slot of this.slots) {
                     currentRecipe.push(slot.item);
              }
              
              for (let recipeName in recipes) {
                     if (Array.isArray(recipes[recipeName][0])) {
                            for (let i of recipes[recipeName]) {
                                   if (currentRecipe.toString() === i.toString()) {
                                          console.log("crafted", eval(recipeName));
                                   }
                            }
                     }
                     else {
                            if (currentRecipe.toString() === recipes[recipeName].toString()) {
                                   console.log("crafted");
                            }
                     }
              }

       }
}

class Output {
       constructor(elem) {
              this.output = elem;
              this.slot = new Slot(this.output.querySelector(".slot"));
       }
}

class CraftingMenu {
      constructor(_craftingElem, _outputElem, _inventoryElem) {
              this.crafting = new CraftingTable(_craftingElem);
              this.output = new Output(_outputElem);
              this.inventory = new Inventory(_inventoryElem);
      }
}

const craftingTable = new CraftingMenu(craftingElem, outputElem, inventoryElem);
