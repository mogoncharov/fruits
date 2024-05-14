const fruitsList = document.querySelector('.fruits__list'); 
const shuffleButton = document.querySelector('.shuffle__btn'); 
const minWeight = document.querySelector('.minweight__input'); 
const maxWeight = document.querySelector('.maxweight__input'); 
const filterButton = document.querySelector('.filter__btn'); 
const filterClearButton = document.querySelector('.filter__clear__btn'); 
const sortKindLabel = document.querySelector('.sort__kind'); 
const sortTimeLabel = document.querySelector('.sort__time'); 
const sortChangeButton = document.querySelector('.sort__change__btn'); 
const sortActionButton = document.querySelector('.sort__action__btn'); 
const kindInput = document.querySelector('.kind__input'); 
const colorInput = document.querySelector('.color__input'); 
const weightInput = document.querySelector('.weight__input'); 
const addActionButton = document.querySelector('.add__action__btn'); 
const delActionButton = document.querySelector('.del__action__btn'); 


let colorRGBJson = `[
  ["фиолетовый", "#8b00ff"],
  ["зеленый", "#84cd1b"],
  ["розово-красный", "#dc143c"],
  ["желтый", "#ffd800"],
  ["светло-коричневый", "#cd853f"],
  ["оранжевый", "#ff8800"]
]`;

let fruitsJSON = `[
  {"id": "1", "kind": "Мангустин", "color": "фиолетовый", "weight": 13, "checked": false},
  {"id": "2", "kind": "Дуриан", "color": "зеленый", "weight": 35, "checked": false },
  {"id": "3", "kind": "Личи", "color": "розово-красный", "weight": 17, "checked": false},
  {"id": "4", "kind": "Карамбола", "color": "желтый", "weight": 28, "checked": false},
  {"id": "5", "kind": "Тамаринд", "color": "светло-коричневый", "weight": 22, "checked": false}
]`;

let fruits = JSON.parse(fruitsJSON);
let fruitsNoFilter = fruits.slice();

const colorRGB = new Map(JSON.parse(colorRGBJson));

function onlyNumLiter() {
  this.value = this.value.replace(/[^\d.]/g, '');
}
weightInput.addEventListener('input', onlyNumLiter);
minWeight.addEventListener('input', onlyNumLiter);
maxWeight.addEventListener('input', onlyNumLiter);

function fruitByID(arr, id){
  
  for (let i=0; i < arr.length; i++){
    if (id == arr[i].id){
      return arr[i];
    }
  }
}

function fruitClick(event){
  let id = event.currentTarget.id.substring(6);
  let fruit = fruitByID(fruits, id); 
  fruit.checked = !fruit.checked;
  display();
}

const display = () => {
  let checkClass = '';
  let bgColor;
  fruitsList.innerHTML = '';

  for (let i = 0; i < fruits.length; i++) {
    const oneFruit = document.createElement('li');
    oneFruit.className = 'fruit__item';
    if (fruits[i].checked) {
      oneFruit.className +=  ' fruit__item__checked';
    }
    oneFruit.id = 'fruit_' + fruits[i].id;
    bgColor = colorRGB.get(fruits[i].color);
    oneFruit.style.background = !bgColor ? '#96969d' : bgColor;
    oneFruit.innerHTML = `<div class="fruit__info">
    <div>index: ${i}</div>
    <div>id: ${fruits[i].id}</div>
    <div>kind: ${fruits[i].kind}</div>
    <div>color: ${fruits[i].color}</div>
    <div>weight (кг): ${fruits[i].weight}</div>
    </div>`;
    oneFruit.onclick = fruitClick;
    fruitsList.appendChild(oneFruit);
    
  }

};

display();

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleFruits = () => {
  let result = [];
  let arrayIndex;

  if (fruits.length <= 1){
    alert('Нечего перемешивать :(');
    return;
  }
  while (fruits.length > 0) {
    arrayIndex = getRandomInt(0, fruits.length - 1);
    result.push(fruits[arrayIndex]);
    fruits.splice(arrayIndex, 1)
  }

  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

const filterFruits = () => {
  let result = [];
  let minWeightValue = Number(minWeight.value);
  let maxWeightValue = Number(maxWeight.value);

  if (!minWeightValue) {
    minWeightValue = 0;
    minWeight.value = minWeightValue;
  }
  if (!maxWeightValue) {
    maxWeightValue = 1000;
    maxWeight.value = maxWeightValue;
  }
  if (maxWeightValue < minWeightValue) {
    maxWeightValue = minWeightValue;
    maxWeight.value = maxWeightValue;
  }
  result = fruitsNoFilter.filter((item) => {
    return (item.weight >= minWeightValue) && (item.weight <= maxWeightValue);
  });
  fruits = result;
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

const filterClearFruits = () => {
  fruits = fruitsNoFilter.slice();
}

filterClearButton.addEventListener('click', () => {
  filterClearFruits();
  display();
});


let sortKind = 'bubbleSort'; 
let sortTime = '-'; 

const comparationColor = (a, b) => {
  if (!a) {
    return true;
  }
  else if (!b) {
    return false;
  }
  if (a.color == b.color) {
    return a.id < b.id;
  }

  let aColor = colorRGB.get(a.color);
  let bColor = colorRGB.get(b.color);
  
  if (!aColor) {
    return true;
  }
  if (!bColor) {
    return false;
  }

  const aNum = Number(aColor.replace('#', '0x'));
  const bNum = Number(bColor.replace('#', '0x'));
  
  return aNum < bNum;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        if (comparation(arr[j], arr[j + 1])) {
          let temp = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
  },

  quickSort(arr, comparation) {
    function swap(items, firstIndex, secondIndex) {
      const temp = items[firstIndex];
      items[firstIndex] = items[secondIndex];
      items[secondIndex] = temp;
    }
    function partition(items, left, right) {
      var pivot = items[Math.floor((right + left) / 2)],
        i = left,
        j = right;
      while (i <= j) {
        while (i <= j && comparation(pivot, items[i])) {
          i++;
        }
        while (i <= j && comparation(items[j], pivot)) {
          j--;
        }
        if (i <= j) {
          swap(items, i, j);
          i++;
          j--;
        }
      }
      return i;
    }
    function quickSortA(arr, start, end) {
      var index;
      if (arr.length > 1) {
        start = typeof start != "number" ? 0 : start;
        end = typeof end != "number" ? arr.length - 1 : end;
        index = partition(arr, start, end);

        if (start < index - 1) {
          quickSortA(arr, start, index - 1);
        }
        if (index < end) {
          quickSortA(arr, index, end);
        }
      }
    }

    quickSortA(arr);
  },

  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
    sortTimeLabel.textContent = sortTime;
  },
};


sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
});

function nextID(arr){
  let id = 0;
  for (let i=0; i < arr.length; i++){
    if (id < Number(arr[i].id)){
      id = Number(arr[i].id);
    }
  }
  return id + 1;
}

addActionButton.addEventListener('click', () => {
  let kindInputValue = kindInput.value;
  if (!kindInputValue) {
    alert('Заполните поле "kind:"!');
    return;
  }
  kindInputValue = kindInputValue.charAt(0).toUpperCase() + kindInputValue.slice(1).toLowerCase();
  const colorInputValue = colorInput.value;
  if (!colorInputValue) {
    alert('Заполните поле "color:"!');
    return;
  }
  const weightInputValue = Number(weightInput.value);
  if (!weightInputValue) {
    alert('Заполните поле "weight:"!');
    return;
  }
  if (fruits.some((fruit => fruit.kind == kindInputValue))) {
    alert(kindInputValue + ' уже есть в списке!');
    return;
  }
  fruits.push({
    "id": nextID(fruits),
    "kind": kindInputValue,
    "color": colorInputValue,
    "weight": weightInputValue,
    "checked": false
  });
  display();
});

delActionButton.addEventListener('click', () => {
  let result = [];
  
  result = fruits.filter((item) => {
    return !item.checked;
  });
  fruits = result;
  display();
});