//ИМПОРТЫ
import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js"

//КОМПОНЕНТА

const app = createApp({

    data() {
        return {
            you: {
                x: 0,
                y: 0
            },
            field: [],
            markedField: [],
            selectedButton: null,
            lifes: 1,
            wins: 0,
            message: "Поле обновлено. Будьте осторожнее!",
            isEnd: false,
            isWin: false
        };
    },

    methods: {

        replay() {
            this.lifes = 1;
            this.generateField();
            this.generateMarkedField();
            document.querySelector("#field").style.background = "url('background.jpg')";
            this.you = {
                x: 0,
                y: 0
            };
            if (this.isEnd) {
                this.message = "Пожалуйста, не падайте больше."
            } else this.message = "Ура! Следующая карта...";
            this.isEnd = false;
            this.isWin = false;
            const littleCells = [...document.querySelectorAll(".little-cell")];
            littleCells.forEach((cell) => {
                cell.className = "little-cell";
                cell.innerHTML = "";
            });
            const cells = [...document.querySelectorAll(".cell")];
            cells.forEach((cell) => {
                cell.className = "cell";
            });
        },

        countBombs() {
            let count = 0;
            let chance;
            let alert = false;
            const field = [...document.querySelectorAll(".cell")]
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    try {
                        if (this.field[this.you.y + i][this.you.x + j] == 1) {
                            count ++;
                            chance = Math.random() * 100;
                            if (chance <= 10 && !alert) {
                                let alertPosition = (this.you.y + i) * 10 + this.you.x + j;
                                field[alertPosition].style.backgroundImage = "url('alert.png')";
                                alert = true;
                                setTimeout(() => {
                                    field[alertPosition].style.backgroundImage = "none";
                                }, 2500);
                            }
                        }
                    } catch (error) {};
                }
            }
            const scenarios = [
                "Вы ничего не слышите.",
                "едва различимый",
                "тихий",
                "приглушённый",
                "громкий",
                "очень громкий"
            ];
            let sound;
            if (count == 0) {
                sound = scenarios[0];
            } else if (count > 0 && count < 5) {
                sound = "Вы слышите " + scenarios[count] + " звук осыпающихся камней."
            } else {
                sound = "Вы слышите " + scenarios[5] + " звук осыпающихся камней."
            }
            return [count, sound];
        },

        checkIfDangerous() {
            if (this.field[this.you.y][this.you.x] == 1) {
                if (this.lifes == 1) {
                    this.message = "Вы наступили на опасную клетку! Будьте осторожнее."
                } else {
                    this.isEnd = true;
                    this.message = "Вы наступили на опасную клетку и упали!"
                    document.querySelector("#field").style.background = "black";
                }
                this.lifes --;
                return true;
            }
            return false;
        },

        checkIfWin() {
            for (let i in this.field) {
                for (let j in this.field[i]) {
                    if (this.field[i][j] != this.markedField[i][j]) {
                        return false;
                    }
                }
            }
            return true;
        },

        selectButton(button) {
            if (this.selectedButton != button && this.selectedButton != null) {
                this.selectedButton.className = "button unchecked";
            }
            this.selectedButton = button;
            this.selectedButton.className = "button checked";
        },

        markCell(cell) {
            let text;
            if (this.selectedButton != null) {
                text = this.selectedButton.innerHTML;
            } else return;
            const field = [...document.querySelectorAll(".little-cell")]
            const cellPosition = field.indexOf(cell);
            const cells = [...document.querySelectorAll(".cell")];
            let scenarios = [
                () => {
                    cell.innerHTML = "<div style = 'position: relative; top: 5px;'>" + text + "</div>";
                    cell.className = "little-cell free"
                    cells[cellPosition].className = "cell free";
                },
                () => {
                    cell.innerHTML = "";
                    cell.className = "little-cell little-move"
                    cells[cellPosition].className = "cell little-move";
                },
                () => {
                    cell.innerHTML = "";
                    cell.className = "little-cell bomb"
                    cells[cellPosition].className = "cell bomb";
                },
                () => {
                    cell.innerHTML = "";
                    cell.className = "little-cell";
                    cells[cellPosition].className = "cell";
                }
            ];
            if (!isNaN(parseInt(text))) {
                scenarios[0]();
            } else if (text == "Переход") {
                scenarios[1]();
            } else if (text == "Мина") {
                scenarios[2]();
            } else {
                scenarios[3]();
            }
            if (text == "Мина") {
                this.markedField[Math.trunc(cellPosition / 10)][cellPosition % 10] = 1;
                this.isWin = this.checkIfWin();
                if (this.isWin) {
                    if (this.lifes == 1) {
                        this.wins ++;
                    } else this.wins += 0.5;
                }
            } else if (text == "Очистить") {
                this.markedField[Math.trunc(cellPosition / 10)][cellPosition % 10] = 0;
                this.isWin = this.checkIfWin();
            } else if (text == "Переход") {
                this.markedField[Math.trunc(cellPosition / 10)][cellPosition % 10] = -1;
                this.isWin = this.checkIfWin();
            }
        },

        generateBombsCount() {
            return 12 + Math.floor(Math.random() * 3);
        },

        generateMarkedField() {
            this.markedField = [];
            let template = [];
            for (let i = 0; i < 6; i ++) {
                for (let j = 0; j < 10; j ++) {
                    template.push(0)
                }
                this.markedField.push(template);
                template = [];
            }
            this.markedField[5][0] = -1;
            this.markedField[3][9] = -1;
        },

        generateField() {
            this.field = [];
            for (let i = 0; i < 55; i ++) this.field.push(0);
            let bombs = this.generateBombsCount();
            while (bombs > 0) {
                bombs --;
                this.field[Math.floor(Math.random() * 55)] = 1;
            }
            for (let i = 0; i < 3; i ++) {
                this.field.splice(0, 0, 0);
            }
            this.field.splice(49, 0, -1);
            this.field.splice(39, 0, -1);
            let subarray = [];
            for (let i = 0; i < 6; i++)
                subarray[i] = this.field.slice((i * 10), (i * 10) + 10);
            this.field = subarray;
        },

        mouseMove(event) {
            if (this.isEnd || this.isWin) {
                return;
            }
            let cells = [...document.querySelectorAll(".cell")];
            let subarray = [];
            for (let i = 0; i < 6; i++)
                subarray[i] = cells.slice((i * 10), (i * 10) + 10);
            cells = subarray;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    try {
                        if (cells[this.you.y + i][this.you.x + j] == event.target &&
                            (JSON.stringify(this.you) != '{"x": 0, "y": 5}' || JSON.stringify(this.you) != '{"x": 9, "y": 3}')) {
                            this.you.y += i;
                            this.you.x += j;
                            let dangerous = this.checkIfDangerous();
                            if (!dangerous) {
                                let [bombs, sound] = this.countBombs();
                                this.message = sound + " [" + bombs + "]"
                            }
                        }
                    } catch (error) {};
                }
            }
        },

        move(event) {
            try {
                if (this.isEnd || this.isWin) {
                    return;
                }
                const key = event.code;
                const vector = {
                    "KeyW": [0, -1],
                    "KeyA": [-1, 0],
                    "KeyS": [0, 1],
                    "KeyD": [1, 0],
                    "KeyQ": [-1, -1],
                    "KeyE": [1, -1],
                    "KeyZ": [-1, 1],
                    "KeyX": [1, 1]
                };
                const currentVector = vector[key];
                const abstractPosition = [
                    this.you.x + currentVector[0],
                    this.you.y + currentVector[1]
                ];
                if (abstractPosition[0] < 0 || abstractPosition[0] > 9) {
                    currentVector[0] = 0;
                }
                if (abstractPosition[1] < 0 || abstractPosition[1] > 5) {
                    currentVector[1] = 0;
                }
                if (JSON.stringify(abstractPosition) != "[0,5]" && JSON.stringify(abstractPosition) != "[9,3]") {
                    this.you.x += currentVector[0];
                    this.you.y += currentVector[1];
                    let dangerous = this.checkIfDangerous();
                    if (!dangerous) {
                        let [bombs, sound] = this.countBombs();
                        this.message = sound + " [" + bombs + "]"
                    }
                }
            } catch (error) {};
        }
    },

    mounted() {
        this.generateField();
        this.generateMarkedField();
        const buttons = document.querySelectorAll(".button");
        buttons.forEach((button) => {
            button.onclick = () => {
                this.selectButton(button);
            };
        });
        const littleCells = document.querySelectorAll(".little-cell");
        littleCells.forEach((cell) => {
            cell.onclick = () => {
                this.markCell(cell);
            };
        });
        document.addEventListener("keydown", this.move);
    }

});


app.component("move", {

    data() {
        return {

        };
    },

    props: ["name"],

    template: `
    <div class = "move">
        <div class = "move-picture"></div>
        <div class = "move-name">
            {{ name }}
        </div>
    </div>`
    
})

//ЛОГИКА

app.mount('#app');

//КОНЕЦ ЛОГИКИ хахаха