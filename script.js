// ambil elemen dari HTML
const inputText = document.getElementById("inputText");
const keyInput = document.getElementById("key");
const ivInput = document.getElementById("iv");
const modeSelect = document.getElementById("mode");
const outputText = document.getElementById("outputText");

const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");

const BLOCK_SIZE = 4;


// membagi teks menjadi blok
function splitBlocks(text){
    let blocks = [];

    for(let i=0; i<text.length; i += BLOCK_SIZE){
        blocks.push(text.substring(i, i + BLOCK_SIZE).padEnd(BLOCK_SIZE, " "));
    }

    return blocks;
}


// fungsi XOR dua string
function xorStrings(a, b){

    let result = "";

    for(let i=0; i<a.length; i++){

        let charCode =
        a.charCodeAt(i) ^ b.charCodeAt(i % b.length);

        result += String.fromCharCode(charCode);
    }

    return result;
}


// fungsi enkripsi dasar
function encryptBlock(block, key){
    return xorStrings(block, key);
}


// fungsi dekripsi dasar
function decryptBlock(block, key){
    return xorStrings(block, key);
}


// MODE ECB

function ECB_encrypt(blocks, key){

    let result = "";

    blocks.forEach(block => {
        result += encryptBlock(block, key);
    });

    return result;
}


function ECB_decrypt(blocks, key){

    let result = "";

    blocks.forEach(block => {
        result += decryptBlock(block, key);
    });

    return result;
}


// MODE CBC

function CBC_encrypt(blocks, key, iv){

    let result = "";
    let previous = iv;

    blocks.forEach(block => {

        let xored = xorStrings(block, previous);

        let encrypted = encryptBlock(xored, key);

        result += encrypted;

        previous = encrypted;
    });

    return result;
}



function CBC_decrypt(blocks, key, iv){

    let result = "";
    let previous = iv;

    blocks.forEach(block => {

        let decrypted = decryptBlock(block, key);

        let original = xorStrings(decrypted, previous);

        result += original;

        previous = block;
    });

    return result;
}


// MODE OFB

function OFB_process(blocks, key, iv){

    let result = "";
    let feedback = iv;

    blocks.forEach(block => {

        feedback = encryptBlock(feedback, key);

        let cipher = xorStrings(block, feedback);

        result += cipher;
    });

    return result;
}


// MODE CFB

function CFB_encrypt(blocks, key, iv){

    let result = "";
    let feedback = iv;

    blocks.forEach(block => {

        let encrypted = encryptBlock(feedback, key);

        let cipher = xorStrings(block, encrypted);

        result += cipher;

        feedback = cipher;
    });

    return result;
}


function CFB_decrypt(blocks, key, iv){

    let result = "";
    let feedback = iv;

    blocks.forEach(block => {

        let encrypted = encryptBlock(feedback, key);

        let plain = xorStrings(block, encrypted);

        result += plain;

        feedback = block;
    });

    return result;
}

function toBase64(str){
    return btoa(str);
}

function fromBase64(str){
    return atob(str);
}

function validateInput(){

    let text = inputText.value.trim();
    let key = keyInput.value.trim();
    let iv = ivInput.value.trim();
    let mode = modeSelect.value;

    if(text === ""){
        alert("Teks/Pesan belum diisi!");
        return false;
    }

    if(key === ""){
        alert("Key / Kunci belum diisi!");
        return false;
    }

    if((mode === "cbc" || mode === "ofb" || mode === "cfb") && iv === ""){
        alert("Initialization Vector (IV) wajib diisi untuk mode CBC, OFB, dan CFB!");
        return false;
    }

    return true;
}


// ENCRYPT BUTTON

encryptBtn.onclick = function(){

    if(!validateInput()){
        return;
    }

    let text = inputText.value;
    let key = keyInput.value;
    let iv = ivInput.value;
    let mode = modeSelect.value;

    let blocks = splitBlocks(text);

    let result = "";

    if(mode === "ecb")
        result = ECB_encrypt(blocks, key);

    else if(mode === "cbc")
        result = CBC_encrypt(blocks, key, iv);

    else if(mode === "ofb")
        result = OFB_process(blocks, key, iv);

    else if(mode === "cfb")
        result = CFB_encrypt(blocks, key, iv);


    outputText.value = toBase64(result);
};


// DECRYPT BUTTON

decryptBtn.onclick = function(){

     if(!validateInput()){
        return;
    }

    let text = inputText.value;
    let key = keyInput.value;
    let iv = ivInput.value;
    let mode = modeSelect.value;

    let decoded = fromBase64(text);
    let blocks = splitBlocks(decoded);

    let result = "";

    if(mode === "ecb")
        result = ECB_decrypt(blocks, key);

    else if(mode === "cbc")
        result = CBC_decrypt(blocks, key, iv);

    else if(mode === "ofb")
        result = OFB_process(blocks, key, iv);

    else if(mode === "cfb")
        result = CFB_decrypt(blocks, key, iv);


    outputText.value = result;
};

modeSelect.addEventListener("change", function(){

    if(modeSelect.value === "ecb"){
        ivInput.disabled = true;
        ivInput.value = "";
    } else {
        ivInput.disabled = false;
    }

});

if(modeSelect.value === "ecb"){
    ivInput.disabled = true;
}