function howManyParts(x) {
    let y = 0;
    for (let c = 0; c < meck.length; c++) {
        if (meck[c].subtype == x) y++;
    }
    if (y == 0) {
        for (let c = 0; c < meck.length; c++) {
            for (let c2 = 0; c2 < meck[c].contains.length; c2++) {
                if (!(meck[c].contains[c2] == null)) {
                    if (meck[c].contains[c2].subtype == x) y++;
                } else continue;
            }
        }
    }
    return y;
}
function getLimbByID(x) {
    for (let c=0; c < meck.length; c++) {
        if (meck[c].id == x) return meck[c];
    }
}
function getEquipByCode(x, old=false) {
    if (old == false) {
        let y = x.indexOf('_');
        let whatLimb = x.slice(0, y);
        let whatEq = x.slice(y+1);
        y = meck[whatLimb];
        for (let c in y.contains) {
            if (y.contains[c].id == whatEq) 
                return y.contains[c];
        }
    }
    else {
        for (c in meck) {
            for (let c2 in meck[c].contains) {
                if (meck[c].contains[c2].oldID == x) 
                    return meck[c].contains[c2];
            }
        }
    }
}
function fuckDef(event) {
    event.preventDefault();
}
function mektonRounding(x) {
    let y = (Math.ceil(x*10)/10);
    return y;
}
function stopHereMotherFucker(parrent, child) {
    child.onmouseover = function(event) {
        parrent.draggable = false;
    }
    child.onmouseout = function(event) {
        parrent.draggable = true;
    }
}

class Limb {
    constructor(limb) {
        // Внутренности
        if (limb != "T") partCount++;
        this.id = partCount;
        this.type = 'limb';
        this.equipCounter = 0;
        this.contains = [];
        this.armor = null;

        // Форма
        let tex = 
            `<div id='limbWindow${partCount}' class="limbWindow">
                <form name="limb${partCount}" onchange="updLimb(getLimbByID(${partCount}))">
                    <div class="limbShell">
                        <div class="limbCore" id="baseLimb${partCount}">
                            <p>
                                <button type="button" onclick='delLimb(${partCount})'>Х</button>
                                <input name='name'>
                            </p>
                            <select name="mclass">${mClassOptionDOM}</select>
                            <select name="type" hidden>
                                <option value="1">Wheels</option>
                                <option value="2">Treads</option>
                            </select>
                            <p>
                                <span id='status${partCount}'></span>
                                <span id='spaceLeft${partCount}'></span>
                            </p>
                        </div>
                        <div class="armorBlock" id="limbArmor${partCount}">
                            <p id="emptyArmorLabel${partCount}">Put some armor here</p>
                        </div>
                    </div>
                </form>
                <div id="equipList${partCount}">
                    <p id="emptyEquipLabel${partCount}">Put equipement here</p>
                </div>
            </div>`;
        mechWindow.insertAdjacentHTML('beforeend', tex); 
        this.inGUI = {
            limbWindow: $(`#limbWindow${partCount}`)[0],
            status: $(`#status${partCount}`)[0],
            baseLimb: $(`#baseLimb${partCount}`)[0],
            limbArmor: $(`#limbArmor${partCount}`)[0],
            equipList: $(`#equipList${partCount}`)[0],
            spaceLeft: $(`#spaceLeft${partCount}`)[0],
            form: document.forms[`limb${partCount}`],
        }
        this.inGUI.limbWindow.dataLink = this;
        switch(limb) {
            case 'T':
                this.name = 'Torso';
                this.subtype = 'limbT';
                this.inGUI.limbWindow.getElementsByTagName('button')[0].remove();
                break
            case 'H':
                this.name = 'Head' + howManyParts('limbH');
                this.subtype = 'limbH';
                break
            case 'A':
                this.name = 'Arm' + howManyParts('limbA');
                this.subtype = 'limbA';
                break
            case 'L':
                this.name = 'Leg' + howManyParts('limbL');
                this.subtype = 'limbL';
                break
            case 'W':
                this.name = 'Wing' + howManyParts('limbW');
                this.subtype = 'limbW';
                break
            case 'P':
                this.name = 'Pod' + howManyParts('limbP');
                this.subtype = 'limbP';
                break
            case 'O':
                this.name = 'Pod' + howManyParts('limbO');
                this.subtype = 'limbO';
                this.wheelSwitch = 1;
                this.inGUI.form['type'].hidden = false;
                break
        }
        this.inGUI.limbWindow.ondragover = fuckDef;
        this.inGUI.limbArmor.ondrop = addArmor;
        this.inGUI.equipList.ondrop = addEquip;
        this.inGUI.form.elements['name'].value = this.name;
        this.updFromForm();
    }
    updFromForm() {
        this.name = this.inGUI.form.elements["name"].value;
        this.mclass = Number(this.inGUI.form.elements['mclass'].value);
        this.name = this.inGUI.form.elements['name'].value;
        switch (this.subtype) {
            case 'limbT':
                this.cost = this.maxSpace = this.kills = this.mclass * 2;
                this.inGUI.status.innerHTML = `Cost: ${this.cost} CP, Weight: ${this.kills/2}t`;
                break
            case 'limbH':
                this.cost = this.maxSpace = this.kills = this.mclass;
                this.inGUI.status.innerHTML = `Cost: ${this.cost} CP, Weight: ${this.kills/2}t`; 
                break
            case 'limbA':
                this.cost = this.maxSpace = this.kills = this.mclass + 1;
                this.plusDmg = Math.floor((this.mclass-1)/3);
                this.throw = Math.floor(this.mclass/2)+1;
                this.inGUI.status.innerHTML = `Cost: ${this.cost} CP, Weight: ${this.kills/2}t, +${this.plusDmg} Damage, ${this.throw} throw distance`;  
                break
            case 'limbL':
                this.cost = this.maxSpace = this.kills = this.mclass + 1;
                this.plusDmg = Math.floor((this.mclass-1)/2);
                this.inGUI.status.innerHTML = `Cost: ${this.cost} CP, Weight: ${this.kills/2}t, +${this.plusDmg} Damage`;
                break
            case 'limbW':
                this.cost = this.maxSpace = this.kills = this.mclass;
                this.inGUI.status.innerHTML = `Cost: ${this.cost} CP, Weight: ${this.kills/2}t`;
                break
            case 'limbP':
                this.cost = this.mclass;
                this.maxSpace = this.mclass * 2;
                this.kills = 0;
                this.inGUI.status.innerHTML = `Cost: ${this.cost} CP, Weight: ${this.kills/2}t`;
                break
            case 'limbO':
                this.wheelSwitch = Number(this.inGUI.form['type'].value)
                this.cost = this.maxSpace = this.kills = this.mclass * this.wheelSwitch;
                this.inGUI.status.innerHTML = `Cost: ${this.cost} CP, Weight: ${this.kills/2}t`;
                break
        }
        callUpdTotal();
    }
    updFromJSON(x) {
        this.oldID = x.id;
        this.inGUI.form.elements["name"].value = x.name;
        this.inGUI.form.elements['mclass'].value = x.mclass;
        this.inGUI.form.elements['type'].value = x.wheelSwitch;
        // partCount--;
        this.updFromForm();
    }
    get export() {
        let y = function(self) {
            let x = []
            for (let c in self.contains) {
                x.push(self.contains[c].export);
            }
            return x;
        }
        let z = function(self) {
            if (self.armor != null) return self.armor.export
            else return null;
        }
        let x = {
            id: this.id,
            mclass: this.mclass,
            name: this.name,
            type: this.type,
            subtype: this.subtype, 
            armor: z(this),
            contains: y(this),
        } 

        return x;
    }
}
class Armor {
    constructor(limbID) {
        this.limbLink = getLimbByID(limbID);
        if (this.limbLink.armor != null) delArmor(this.limbLink.id);
        let tex = 
            `<div id="armor${limbID}" style="border:initial" onchange="updArmor('${limbID}')">
                <p><button type="button" onclick='delArmor(${limbID})'>X</button><b>Armor</b></p>
                <p>
                    <select name="armorClass" >
                        ${mClassOptionDOM}
                    </select>
                    <select name="armorType">
                        <option value="0">Ablative</option>
                        <option value="1" selected>Standart</option>
                        <option value="2">Alpha</option>
                        <option value="4">Beta</option>
                        <option value="8">Gamma</option>
                    </select>
                </p>
                <p>
                    R.A.M.:
                    <select name="armorRAM">
                        <option value="N/A">N/A</option>
                        <option value="1/5">1/5</option>
                        <option value="1/4">1/4</option>
                        <option value="1/3">1/3</option>
                        <option value="1/2">1/2</option>
                    </select>
                </p>
                <p id="armorStatus${limbID}"></p>
            </div>`;
        this.limbLink.inGUI.limbArmor.insertAdjacentHTML('beforeend', tex);
        $(`#emptyArmorLabel${limbID}`)[0].hidden = true;
        this.inGUI = $(`#armor${limbID}`)[0];
        this.inGUI.dataLink = this;
        this.updFromForm();
    }
    updFromForm() {
        // let y = this.limbLink;
        let mclass = Number(this.limbLink.inGUI.form['armorClass'].value);
        let mdc = Number(this.limbLink.inGUI.form[`armorType`].value);
        let costmod1 = 1;
        switch (mdc) {
            case 0: costmod1 = 0.5; break;
            case 1: costmod1 = 1; break;
            case 2: costmod1 = 1.25; break;
            case 4: costmod1 = 1.5; break;
            case 8: costmod1 = 2.0; break;
        }
        let mram = this.limbLink.inGUI.form['armorRAM'].value;
        let costmod2 = 1;
        let mpen = 0;
        switch (mram) {
            case 'N/A': costmod2 = 1; mpen = 0; break;
            case '1/5': costmod2 = 1.5; mpen = 1; break;
            case '1/4': costmod2 = 1.8; mpen = 0.8; break;
            case '1/3': costmod2 = 2.2; mpen = 0.75; break;
            case '1/2': costmod2 = 2.5; mpen = 0.66; break;
        }
        this.class = mclass;
        this.dc = mdc;
        this.ram = mram;
        this.sp = Math.ceil(mclass - (mclass * mpen));
        this.mass = mclass/2;
        this.cost = mclass * costmod1 * costmod2;
        let curDesc = $(`#armorStatus${this.limbLink.id}`)[0];
        curDesc.innerHTML = `SP: ${this.sp} | DC: ${mdc} | Cost: ${this.cost} | Mass: ${this.mass}`;
        callUpdTotal();
    }
    updFromJSON(x) {
        this.limbLink.inGUI.form.armorClass.value = x.class;
        this.limbLink.inGUI.form.armorType.value = x.dc;
        this.limbLink.inGUI.form.armorRAM.value = x.ram;
        this.updFromForm();
    }
    get export() {
        let x = {
            class: this.class,
            dc: this.dc,
            ram: this.ram,
        }
        return x;
    }
}
class SlavePart {
    constructor(targ, n, limb=targ.limbLink) {
        //Внутренности
        // let limb = targ.limbLink;
        this.masterLink = targ;
        this.masterLink.slaveParts.push(this);
        limb.equipCounter++;
        this.id = limb.equipCounter;
        this.space = Number(n);
        this.masterLink.space = this.masterLink.space - this.space;
        this.subtype = "slavePart";
        this.cp = 0;
        this.kills = 0;
        this.equipCode = `${limb.id}_${limb.equipCounter}`;

        // Форма
        let tex = 
        `<form id=equip${this.equipCode}>
            <div>
                <p>
                    <button type="button" onclick="delSlave('${this.equipCode}')">Х</button>
                    Slave Part of 
                    <span id=slaveName${this.equipCode}>${this.masterLink.name}</span>
                    <span id=slaveSpace${this.equipCode}> | Space: ${this.space}</span>
                </p>
            </div>
        </form>`
        limb.inGUI.equipList.insertAdjacentHTML('beforeend', tex);
        this.inGUI = $(`#equip${this.equipCode}`)[0];
        this.inGUI.masterName = $(`#slaveName${this.equipCode}`)[0];
        this.inGUI.space = $(`#slaveSpace${this.equipCode}`)[0];
        limb.equipCounter++;
        this.inGUI.dataLink = this;
        this.inGUI.draggable = "true";
        this.inGUI.ondragstart = function(event) {
            event.dataTransfer.setData('text/plain', this.dataLink.equipCode);
        }
    }
    updGUI() {

    }
    updFromJSON(x, newMaster) {
        this.masterLink = newMaster;
        this.masterLink.slaveParts.push(this);
        this.space = x.space;
    }
    get export() {
        let x = {
            id: this.masterLink.equipCode,
            space: this.space,
            subtype: this.subtype,
        }
        return x;
    }
}
class EquipBase {
    constructor(limbID) {
        //Внутренние данные
        this.limbLink = getLimbByID(limbID);
        this.limbLink.equipCounter++;
        this.id = this.limbLink.equipCounter;
        this.equipCode = this.limbLink.id + '_' + this.id;
        this.slaveParts = [];

        //форма
        $(`#emptyEquipLabel${this.limbLink.id}`).hide();
        let tex = 
            `<form name="equip${this.equipCode}" onchange="updBeam('${this.equipCode}')">
            </form>`;
        this.limbLink.inGUI.equipList.insertAdjacentHTML('beforeend', tex);
        this.inGUI = document.forms[`equip${this.equipCode}`]
        this.inGUI.dataLink = this;
        this.inGUI.draggable = "true";
        this.inGUI.ondragstart = function(event) {
            event.dataTransfer.setData('text/plain', this.dataLink.equipCode);
        }
        stopHereMotherFucker(this.inGUI, this.inGUI.name);
    }
    updSlaveNames() {
        for (let c in this.slaveParts) {
            this.slaveParts[c].inGUI.masterName.innerHTML = this.name; 
        }
    }
    checkSlaveSizes() {
        let size = this.space;
        for (let c in this.slaveParts) {
            if (size + this.slaveParts[c].space >= this.spaceFull) {
                if (size < this.spaceFull) {
                    this.slaveParts[c].space = this.spaceFull - size;
                    size += this.slaveParts[c].space;
                }
                else {
                    this.slaveParts[c].space = 0;
                }
                this.slaveParts[c].inGUI.space.innerHTML = ` | Space: ${this.slaveParts[c].space}`
            }
            else {
                size += this.slaveParts[c].space;
            }
        }
    }
}
class Beam extends EquipBase {
    constructor(limbID) {
        // Внутренние данные
        super(limbID);
        this.type= 'weapon'; 
        this.subtype= 'beam';

        // Форма
        this.inGUI.innerHTML = 
            `<div>
                <p>
                    <button type="button" onclick="delEquip('${this.equipCode}')">Х</button>
                    <b><input name='name' value='Beam Weapon'></b>
                    <button type="button" onclick="splitEquipWin('${this.equipCode}')">
                        <img src='split_icon.png'>
                    </button>
                </p>
                <p id="status${this.equipCode}"></p>
                <p>
                    Damage:
                    <select name="damage">
                        <option value = "1_4">1 dmg | Range 4</option>
                        <option value = "2_6">2 dmg | Range 6</option>
                        <option value = "3_7">3 dmg | Range 7</option>
                        <option value = "4_8">4 dmg | Range 8</option>
                        <option value = "5_9">5 dmg | Range 9</option>
                        <option value = "6_10">6 dmg | Range 10</option>
                        <option value = "7_11">7 dmg | Range 11</option>
                        <option value = "8_11">8 dmg | Range 11</option>
                        <option value = "9_12">9 dmg | Range 12</option>
                        <option value = "10_13">10 dmg | Range 13</option>
                        <option value = "11_13">11 dmg | Range 13</option>
                        <option value = "12_14">12 dmg | Range 14</option>
                        <option value = "13_14">13 dmg | Range 14</option>
                        <option value = "14_15">14 dmg | Range 15</option>
                        <option value = "15_15">15 dmg | Range 15</option>
                        <option value = "16_16">16 dmg | Range 16</option>
                        <option value = "17_16">17 dmg | Range 16</option>
                        <option value = "18_17">18 dmg | Range 17</option>
                        <option value = "19_17">19 dmg | Range 17</option>
                        <option value = "20_18">20 dmg | Range 18</option>
                    </select>
                    Range:
                    <select name="range">
                        <option value = "0.62">25%</option>
                        <option value = "0.75">50%</option>
                        <option value = "0.88">75%</option>
                        <option value = "1" selected>100%</option>
                        <option value = "1.12">125%</option>
                        <option value = "1.25">150%</option>
                        <option value = "1.38">175%</option>
                        <option value = "1.5">200%</option>
                        <option value = "1.75">250%</option>
                        <option value = "2">300%</option>
                    </select>
                    Accuracy:
                    <select name="accuracy">
                        <option value = "0.6">-2</option>
                        <option value = "0.8">-1</option>
                        <option value = "0.9">0</option>
                        <option value = "1" selected>+1</option>
                        <option value = "1.5">+2</option>
                        <option value = "2">+3</option>
                    </select>
                    Warm-up Time:
                    <select name="warmup">
                        <option value = "1">0</option>
                        <option value = "0.9">1</option>
                        <option value = "0.7">2</option>
                        <option value = "0.6">3</option>
                    </select>
                    Shots:
                    <select name="shots">
                        <option value = "1">∞</option>
                        <option value = "0.9">10</option>
                        <option value = "0.8">5</option>
                        <option value = "0.7">3</option>
                        <option value = "0.6">2</option>
                        <option value = "0.5">1</option>
                        <option value = "0.33">0</option>
                    </select>
                    Wide Angle:
                    <select name="angle">
                        <option value = "1">N/A</option>
                        <option value = "2">Hex</option>
                        <option value = "3">60°</option>
                        <option value = "5">180°</option>
                        <option value = "7">300°</option>
                        <option value = "9">360°</option>
                    </select>
                    Burst:
                    <select name="burst">
                        <option value = "1">1</option>
                        <option value = "1.5">2</option>
                        <option value = "2">3</option>
                        <option value = "2.5">4</option>
                        <option value = "3">5</option>
                        <option value = "3.5">6</option>
                        <option value = "4">7</option>
                        <option value = "4.5">8</option>
                        <option value = "5">∞</option>
                    </select>
                </p>
                <p>
                    Clip-fed: <input name="clip" type="checkbox" >
                    Target: Standart <input type="radio" name="target" value="standart" checked>
                </p>
                <table>
                    <tr>
                        <td>Anti-Missle <input type="radio" name="target" value="am"></td>
                        <td>Anti-Personel <input type="radio" name="target" value="ap"></td>
                        <td>Anti-Missle & Anti-Personel <input type="radio" name="target" value="amap"></td>
                    </tr>
                    <tr>
                        <td>Variable <input type="radio" name="target" value="vam"></td>
                        <td>Variable <input type="radio" name="target" value="vap"></td>
                        <td>All-Purpouse <input type="radio" name="target" value="vamap"></td>
                    </tr>
                </table>
                <p> 
                    Fragile: <input name="fragile" type="checkbox"> 
                    Long Range: <input name="longrange" type="checkbox"> 
                    Hydro: <input name="hydro" type="checkbox"> 
                    Mega-Beam: <input name="mega" type="checkbox"> 
                    Disruptor: <input name="disruptor" type="checkbox"> 
                </p>
            </div>`
        stopHereMotherFucker(this.inGUI, this.inGUI.name);
        this.updFromForm()
    }
    updFromForm() {
        let newa = this;
        let formdata = newa.inGUI.elements;
        this.name = formdata.name.value;
        newa.cp = 0;
        newa.range = formdata.damage.value;
        let c = newa.range.indexOf('_');
        newa.damage = Number(newa.range.slice(0, c));
        newa.cp = newa.damage * 1.5;
        newa.range = Number(newa.range.slice(c+1));
    
        newa.rangemod = Number(formdata.range.value);
        switch (newa.rangemod) {
            case '0.62': newa.range = Math.ceil(newa.range * 0.25); break;
            case '0.75': newa.range = Math.ceil(newa.range * 0.5); break;
            case '0.88': newa.range = Math.ceil(newa.range * 0.75); break;
            case '1': break;
            case '1.12': newa.range = Math.ceil(newa.range * 1.25); break;
            case '1.25': newa.range = Math.ceil(newa.range * 1.5); break;
            case '1.38': newa.range = Math.ceil(newa.range * 1.75); break;
            case '1.5': newa.range *= 2; break;
            case '1.75': newa.range = Math.ceil(newa.range * 2.5); break;
            case '2': newa.range *= 3; break;
        }
        newa.accuracy = Number(formdata.accuracy.value);
        newa.warmup = Number(formdata.warmup.value);
        newa.shots = Number(formdata.shots.value);
        newa.angle = Number(formdata.angle.value);
        newa.burst = Number(formdata.burst.value);
        newa.cp = newa.cp * newa.rangemod * newa.accuracy * newa.warmup * newa.shots * newa.angle * newa.burst;
    
        newa.clip = formdata.clip.checked;
        if (newa.clip) newa.cp *= 0.9;
        newa.target = formdata.target.value;
        switch (newa.target) {
            case 'standart' : break;
            case 'am' : break;
            case 'ap' : break;
            case 'amap' : newa.cp *= 1.8; break;
            case 'vam' : newa.cp *= 1.8; break;
            case 'vap' : newa.cp *= 1.8; break;
            case 'vamap' : newa.cp *= 2.6; break;
        }
        newa.fragile = formdata.fragile.checked;
        newa.longrange = formdata.longrange.checked;
        if (newa.longrange) newa.cp *= 1.33;
        newa.hydro = formdata.hydro.checked;
        if (newa.hydro) newa.cp *= 0.2;
        newa.mega = formdata.mega.checked;
        if (newa.mega) newa.cp *= 10;
        newa.disruptor = formdata.disruptor.checked;
        if (newa.disruptor) newa.cp *= 2;
    
        newa.cp = mektonRounding(newa.cp);
        if (newa.fragile == true) newa.mass = 0.5
        else newa.kills = newa.cp/2;
        newa.spaceFull = newa.cp;
        if (this.slaveParts.length == 0) newa.space = newa.spaceFull;
        else if (this.space > this.spaceFull) this.space = this.spaceFull;
        $(`#status${this.equipCode}`)[0].innerHTML = newa.cp + ' CP, Range: ' + (newa.range * newa.rangemod) + ', Max. Range: ' + (newa.range * newa.rangemod)*(newa.range * newa.rangemod);
        super.updSlaveNames();
        super.checkSlaveSizes();
        callUpdTotal();
    }
    updFromJSON(x) {
        this.oldID = x.id;
        let formdata = this.inGUI.elements;
        for (let c = 0; c < 20; c++) {
            let foo = formdata.damage.options[c].value.indexOf('_');
            foo = Number(formdata.damage.options[c].value.slice(0, foo))
            if (foo == x.damage) formdata.damage.options[c].selected = true;
        }
        formdata.name.value = x.name;
        formdata.range.value = String(x.rangemod);
        formdata.accuracy.value = String(x.accuracy);
        formdata.warmup.value = String(x.warmup);
        formdata.shots.value = String(x.shots);
        formdata.angle.value = String(x.angle);
        formdata.burst.value = String(x.burst);
        formdata.clip.checked = x.clip;
        formdata.target.value = String(x.target);
        formdata.fragile.checked = x.fragile;
        formdata.longrange.checked = x.longrange;
        formdata.hydro.checked = x.hydro;
        formdata.mega.checked = x.mega;
        formdata.disruptor.checked = x.disruptor;
        this.updFromForm();
    }
    get export() {
        let x = {
            id: this.equipCode,
            accuracy: this.accuracy,
            angle: this.angle,
            burst: this.burst,
            clip: this.clip,
            damage: this.damage,
            disruptor: this.disruptor,
            fragile: this.fragile,
            hydro: this.hydro,
            longrange: this.longrange,
            mega: this.mega,
            name: this.name,
            rangemod: this.rangemod,
            shots: this.shots,
            subtype: this.subtype,
            target: this.target,
            type: this.type,
            warmup: this.warmup,
        }
        return x;
    }
}

const mClassOptionDOM = 
    `<option value="1">Superlight</option>
    <option value="2">Lightweight</option>
    <option value="3">Striker</option>
    <option value="4">Mediumstriker</option>
    <option value="5">Heavy Striker</option>
    <option value="6">Mediumweight</option>
    <option value="7">Light Heavy</option>
    <option value="8">Medium Heavy</option>
    <option value="9">Armored Heavy</option>
    <option value="10">Super Heavy</option>
    <option value="11">Mega Heavy</option>` 
let totalMass = 0;
let totalCost = 0;
let partCount = 0;
let statusbar = document.getElementById('stat');
let mechWindow = $(".mechWindow")[0];
let meck = [];
let meckMult = {sosik: "yaya"};
let isLoad = false;
document.addEventListener("updTotal", function(event) {
    setTimeout(updTotal,4);
})
addLimb("T");

function addLimb(limb) {
    meck.push(new Limb(limb));
}
function addArmor(event) {
    event.preventDefault();
    data = event.dataTransfer.getData("text/plain");
    if (data == "armor") {
        let limbID = this.id.slice(9);
        getLimbByID(limbID).armor = new Armor(limbID);
    } 
}
function addEquip(event) {
    let original = undefined;
    event.preventDefault();
    let data = event.dataTransfer.getData("text/plain");
    let x = getLimbByID(Number(this.id.slice(9)));
    if (data.indexOf('_') != -1) {
        original = getEquipByCode(data);
        data = original.subtype;
    }
    switch (data) {
        case 'beam': x.contains.push(new Beam(x.id));  break;
        case 'slavePart': x.contains.push(new SlavePart(original.masterLink, original.space, x));  break;
    }
    if (typeof original != 'undefined') {
        let trans = x.contains.at(-1);
        let z = original.export;
        if (original.subtype == 'slavePart') {
            delSlave(original.equipCode);
        }
        else {
            trans.updFromJSON(z);
            delEquip(original.equipCode);
        }
    }
}
function loadEquip(limb, data) {
    switch (data.subtype) {
        case 'beam': 
            limb.contains.push(new Beam(limb.id));
            limb.contains.at(-1).updFromJSON(data); 
            break;
        case 'slavePart':
            limb.contains.push(data);
    }
}

function updLimb(x) {
    x.updFromForm();
} 
function updArmor(x) {;
    getLimbByID(x).armor.updFromForm();
} 
function updBeam(x) {
    getEquipByCode(x).updFromForm();
} 
function splitEquipWin(x) {
    targ = getEquipByCode(x);
    let tex = 
    `<div class="systemMessage" id="splitWin">
        <form name="splitWin">
            <p>How many spaces you want to split?</p>
            <input name="num" type="range" max="${targ.space-1}" min="1">
            <span id='splC'></span>
            <button onclick="splitEquip('${x}')" type="button">OK</button>
            <button onclick="$('#splitWin')[0].remove();">X</button>
        </form>
    </div>`
    document.body.insertAdjacentHTML('beforeend', tex);
    document.forms.splitWin.num.onmousemove = function() {
        $('#splC')[0].innerHTML = document.forms.splitWin.num.value;
    }
}
function splitEquip(x) {
    targ = getEquipByCode(x);
    n = document.forms.splitWin.num.value;
    $('#splitWin')[0].remove();
    targ.limbLink.contains.push(new SlavePart(targ, n));
    callUpdTotal();
}

function delLimb(x) {
    for (let c = 0; c < meck.length; c++) {
        if (meck[c].id == x) meck.splice(c, 1);
    }
    $(`#limbWindow${x}`).remove();
    updTotal();
}
function delArmor(x) {
    for (let c = 0; c < meck.length; c++) {
        if (meck[c].id == x) meck[c].armor = null;
    }
    $(`#armor${x}`)[0].remove();
    $(`#emptyArmorLabel${x}`)[0].hidden = false;
    updTotal();
} 
function delEquip(x) {
    let c = x.indexOf('_'); //cashe variable
    let whatLimb = x.slice(0, c);
    let whatEq = x.slice(c+1);
    y = getEquipByCode(x);
    y.inGUI.remove();
    for (c in meck[whatLimb].contains) {
        if (meck[whatLimb].contains[c] == y) {
            y = c;
            break;
        }
    }
    meck[whatLimb].contains.splice(y, 1);
    if (meck[whatLimb].contains.length == 0) {$(`#emptyEquipLabel${whatLimb}`).show()}; 
    updTotal();
}
function delSlave(x) {
    let c = x.indexOf('_'); //cashe variable
    let whatLimb = x.slice(0, c);
    let whatEq = x.slice(c+1);
    y = getEquipByCode(x);
    y.inGUI.remove();
    for (c in y.masterLink.slaveParts) {
        if (y.masterLink.slaveParts[c] == y) {
            y.masterLink.space += y.space;
            y.masterLink.slaveParts.splice(c, 1);
        }
    }
    for (c in meck[whatLimb].contains) {
        if (meck[whatLimb].contains[c] == y) {
            y = c;
            break;
        }
    }
    meck[whatLimb].contains.splice(y, 1);
    if (meck[whatLimb].contains.length == 0) {$(`#emptyEquipLabel${whatLimb}`).show()}; 
    updTotal();
} 

function callUpdTotal() {
    document.dispatchEvent(new Event('updTotal'));
}
function updTotal() {
    totalCost = 0;
    totalMass = 0;
    for (let c in meck) {
        totalMass += meck[c].kills/2;
        totalCost += meck[c].cost;
        if (meck[c].armor!= undefined) {
            totalCost += meck[c].armor.cost;
            totalMass += meck[c].armor.mass;
        } 
        spaces = 0;
        for (c2 in meck[c].contains) {
            totalCost += meck[c].contains[c2].cp;
            totalMass += meck[c].contains[c2].kills;
            spaces += meck[c].contains[c2].space;
        }
        meck[c].inGUI.spaceLeft.innerHTML = ` | Spaces: ${spaces}/${meck[c].maxSpace}`
        if (spaces > meck[c].maxSpace) meck[c].inGUI.spaceLeft.style.color = "red"
        else meck[c].inGUI.spaceLeft.style.color = "black";
        
    }
    statusbar.innerHTML = `Cost: ${totalCost} CP, Mass: ${totalMass}t`;
}

function saveJsonTotal() {
    let x = [];
    for (let c in meck) {
        x.push(meck[c].export);
    }
    x = JSON.stringify([x, meckMult]);
    let tex = 
    `<div class="systemMessage" id="saveWin">
        <p>JSON of your mech:</p>
        <input value='${x}'>
        <button onclick="$('#saveWin')[0].remove();">OK</button>
    </div>`
    document.body.insertAdjacentHTML('beforeend', tex); 
}
function loadJsonShowDialog() {
    let tex = 
    `<div class="systemMessage" id="loadWin">
        <form name="loadWin">
            <p>Put here JSON of your meck:</p>
            <input name="lMeck">
            <button onclick="loadJsonTotal()" type="button">OK</button>
        </form>
    </div>`
    document.body.insertAdjacentHTML('beforeend', tex); 
}
function loadJsonTotal() {
    let x = document.forms.loadWin.elements.lMeck.value;
    x = JSON.parse(x);
    let loadCore = x[0];
    let loafOptions = x[1];
    $('.mechWindow')[0].innerHTML = "";
    meck = [];
    partCount = 0;
    isLoad = true;
    $('#loadWin')[0].remove();
    for (let c in loadCore) {
        addLimb(loadCore[c].subtype.slice(4, 5));
        meck.at(-1).updFromJSON(loadCore[c]);
        if (loadCore[c].armor != null) {
            meck.at(-1).armor = new Armor(meck.at(-1).id);
            meck.at(-1).armor.updFromJSON(loadCore[c].armor);
        }
        for (let c2 in loadCore[c].contains) { 
            let loadData=loadCore[c].contains[c2];
            loadEquip(meck.at(-1), loadData);
        }
    }
    for (let c in meck) {
        for (let c2 in meck[c].contains) {
            if (meck[c].contains[c2].subtype == 'slavePart') {
                eq = getEquipByCode(meck[c].contains[c2].id, true);
                n = meck[c].contains[c2].space;
                meck[c].contains[c2] = new SlavePart(eq, n, getLimbByID(c));
            }
        }
    }
    updTotal();
} 