/* App Web - Primeira Blockchain */

// SHA256 com Crypto-js
const SHA256 = require('crypto-js/sha256');

// Import do leveldb 
const Leveldb = require('./blockchainDatabase.js');

// Objeto para persistir a Blockchain
const db = new Leveldb.leveldb;

// Imports para o web server 
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app   = express();


// Classe do Bloco 

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}


// Classe Blockchain 

class Blockchain{
  constructor(){
    
    // Cria a chain em memória
    this.chain = [];
    
    // Obtendo height do bloco, o que permite adicionar bloco ao banco de dados sem exclusão de cadeia
    db.getBlocksCount().then((result) => {
      
      // Se retornar vazio, cria um genesis block
      if(!result) {
        let GenBlock = new Block("Primeiro Bloco na Chain - Genesis block");
        GenBlock.time = new Date().getTime().toString().slice(0,-3);
        GenBlock.height = 0;
        GenBlock.hash = SHA256(JSON.stringify(GenBlock)).toString();
        this.chain.push(GenBlock);
        db.addDataToLevelDB(JSON.stringify(GenBlock).toString());
        
        // Senão cria um novo bloco com a height correta
        // NOTA: isto significa que um novo bloco será adicionado ao construir a classe Blockchain
        }else {
          db.getLevelDBData(result - 1).then((resultBlock) => {
            if(!resultBlock){
              console.log('Cant ID last DB block');
              
              // Criar novo bloco com a height + 1 do último bloco adicionado
              // o novo bloco é adicionado à cadeia de banco de dados e à cadeia de memória
            }else{
              var lastDBblock = JSON.parse(resultBlock);
              var PH = lastDBblock.hash;
              let CB = new Block();
              CB.previousBlockHash = PH;
              CB.height = result;
              CB.time = new Date().getTime().toString().slice(0,-3);
              CB.hash = SHA256(JSON.stringify(CB)).toString();
              
              // Chain na memória
              this.chain.push(CB);
              
              // Chain no banco de dados
              db.addDataToLevelDB(JSON.stringify(CB).toString());
              
            }
           }).catch((err) => { console.log(err); });
          
        }
    }).catch((err) => { console.log(err); });
    
  }


// Cria um Novo Bloco

  addBlock(newBlock){
    
    // Height do bloco a partir da chain em memória
    newBlock.height = this.chain[this.chain.length - 1].height + 1;
    
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    
    // Hash do bloco anterior
    if(newBlock.height>0){
    
      // Vai ter que mudar para nenhum valor de hash anterior, ou seja, a partir de 0 
      newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
    }
    
    // Hash do bloco com SHA256 usando newBlock e convertendo para uma string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    
    // Adicionando objeto de bloco à cadeia
    db.addDataToLevelDB(JSON.stringify(newBlock).toString());
    
    // Adicionar bloco à cadeia na memória
  	this.chain.push(newBlock);
  }


// Valida um Único Bloco

      validateBlock(blockHeight){
        return new Promise(resolve => {
        
        // Obtém o bloco
        db.getLevelDBData(blockHeight).then((block) => {
          if (!block){
            console.log('Error With getting Block within validateBlock')
            resolve("A Error Accored, please check block range");
          }else{
            
            // Transforme o bloco em objeto
            var obj = JSON.parse(block);
            
            // Grava o hash do bloco
            var blockhash = obj.hash;
            
            // Transforma o bloco hash em string vazia
            obj.hash = "";
            
            // Rehash do bloco
            var validBlockHash = SHA256(JSON.stringify(obj)).toString();
            
            // Colocar de volta o hash para validação
            obj.hash = blockhash;
            
            // Comparar hashes e validar o bloco
            if (obj.hash === validBlockHash){
              var CorrectString = ("Block #"+obj.height+" is validated and intacted")
              console.log('\x1b[32m%s\x1b[0m',CorrectString);
              resolve("Valid");
            }else{
              console.log('\x1b[31m%s\x1b[0m',"WARNING block #"+obj.height+" has been tampered with or corrupt. Please check chain integerite using validateChain()");
              resolve("Invalid");
            }
      }
    });
  });
  }


// Validando Toda Cadeia de Blocos 

    validateChain(){
      return new Promise(resolve => {
      
      // Obter a height da chain
      db.getBlocksCount().then((result) => {
        if(!result) {
          console.log('Error with getting chain height within validateChain');
          }else {
            var CorrectCounter = 0;
            
            // Loop através de cada bloco do bloco um usado para comparar o hash anterior
            for (var a = 0; a < result + 1; a++){
            
              // Obter valor de blocos usado para comparar
              // OBSERVAÇÃO: Objetos de bloco são retornados como sequências de caracteres
              db.getLevelDBData(a-1).then((hash) => {
                if (!hash){
                  console.log('Error With getting block within validateChain')
                }else{
            
                  // Transforme a string de volta no objeto de bloco
                  var obj = JSON.parse(hash);
            
                  // Mantém o hash de bloco para comparar
                  var blockhash = obj.hash;
            
                  // Remover hash do objeto de bloco
                  obj.hash = "";
            
                  // Bloco hash com SHA256 para comparar com o hash no bloco
                  var validBlockHash = SHA256(JSON.stringify(obj)).toString();
            
                  // Colocar de volta o hash do objeto que foi removido
                  obj.hash = blockhash;
            
                  // O bloco da gênese não tem um hash anterior, o bloco é comparado apenas ao hash feito ao bloco
                  if (obj.height == 0){
            
                    // Comparando o hash que acabamos de criar (validBlockHash) com o hash no bloco
                    if (obj.hash === validBlockHash){
                      console.log("genesis Block Valid")
                    }else{
                      console.log("genesis block invalid")
            
                      // Se a gênese é inválida, resolvemos a Promise com string e height do bloco
                      var StringEnder = "Chain invalid, please check block "+obj.height;
                      resolve(StringEnder);
                    }
                  }else{
                  
                  // Se não for bloco de gênese, pegue o bloco anterior subtraindo um da height
                  db.getLevelDBData(obj.height - 1).then((priorHash) => {
                    if (!priorHash){
                      console.log("Error getting next Block")
                      }else{
                        
                        // Tornar o bloco anterior em um objeto
                        var Newobj = JSON.parse(priorHash);
                       
                        // Vailação completa do bloco
                        if (Newobj.hash === obj.previousBlockHash && validBlockHash === obj.hash){
                          
                          // Chegar ao fim da cadeia e resolver a promise com uma string válida
                          if (result - 2 == CorrectCounter){
                            resolve("CHAIN VALID")
                          }
                         
                          // Contador para a posição da chain
                          CorrectCounter += 1;
                        
                        // Se o bloco ou bloco anterior for inválido, resolva a promise com uma string com blocos inválidos
                        }else{
                          console.log("Check prior hash match with blocks:",obj.height, "&",obj.height -1  )
                          var prior = obj.height - 1
                          var StringEnder = "CHAIN invalid, please check blocks "+obj.height+" and "+prior;
                          resolve(StringEnder);
                        }
                      }
                  });
                }
                }
              }).catch((err) => { console.log(err);});
            }
          }
          
      }).catch((err) => { console.log(err); });
      
    })
  }

// Obtém a height da Blockchain

    getHeight(){
      return new Promise(resolve => {
        db.getBlocksCount().then((result) => {
          if (!result){
            console.log('Error With getting hash')
          }else{
            resolve(result);
          }
        });
      });
    }

  
// Obtendo um único bloco da Blockchain

    getBlock(BlockN){
      return new Promise(resolve => {
        db.getLevelDBData(BlockN).then((result) => {
          if(!result){
          }else{
            resolve(result);
          }
        })
      })
    }


// Obtendo a Blockchain inteira

    ChainRecon(){
      return new Promise(resolve => {
        db.getChain().then((chain) => {
          if (!chain){
            console.log('Error With getting Chain')
            resolve("Cant sync chain");
          }else{
            resolve(chain);
          }
        });
      });
  }
}


// Criando o objeto Blockchain
const PrivateChain = new Blockchain;


/* Criando Blocos */

async function BlockCreator(timing,amount){
  return new Promise(resolve => {
  (function theLoop (i) {
    setTimeout(function () {
        const BlockModel = new Block;
        PrivateChain.addBlock(BlockModel);
          i++;
      if (i < amount - 1) { 
            theLoop(i) 
          } else {
            resolve("Blocks Added Successful");
          }
    }, timing);
    })(0);
  });
  }



/* App Web */

app.use(bodyParser.urlencoded({ extended: true })); 
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Obter solicitação feita pelo cliente para obter um único bloco
// Usa getBlock dentro da classe blockchain
app.get('/singleBlock',async function(req,res){

    var BlockNumber = req.query.SingleB;
    var x = await PrivateChain.getBlock(BlockNumber);
    res.setHeader('Content-Type','text/json',);
    res.json({'Block': x});
    res.end();

});

// Obter solicitação feita pelo cliente para validar o bloco
// Usa validate Block dentro da classe blockchain
app.get('/blocks',async function(req,res){

    var BlockNumber = req.query.Block;
    var x = await PrivateChain.validateBlock(BlockNumber);
    res.setHeader('Content-Type','text/json',);
    res.json({'Block': x});
    res.end();  

});

// Obter solicitação feita pelo cliente para obter cadeia apenas para visual
// Usa o ChainRecon dentro da classe BlockChain
app.get('/chain',async function(req,res){

  var CC = await PrivateChain.ChainRecon();
  res.setHeader('Content-Type','text/json',);
  res.json({'chain': CC});
  res.end();

});

// Obter solicitação feita pelo cliente para validar a cadeia
// Usa validateChain dentro da classe BlockChain
app.get('/valchain',async function(req,res){

  var VC = await PrivateChain.validateChain();
  res.setHeader('Content-Type','text/json',);
  res.json({'chain': VC});
  res.end();

});

// Obter pedido feito pelo cliente para obter a altura da cadeia
// Usa getHeight dentro da classe BlockChain
app.get('/height',async function(req,res){

  var H = await PrivateChain.getHeight();
  res.setHeader('Content-Type','text/json',);
  res.json({'Height': H});
  res.end();

});

// Post request do cliente para adicionar blocos à cadeia
// Usa o Blockcreator para criar mais blocos
app.post('/addblock',async function(req,res) {

  var Response = BlockCreator(req.body.timing,req.body.amount)
  res.setHeader('Content-Type','text/json',);
  res.json({'BlockStatus': Response});
  res.end();
  
});

// Post request do cliente para alterar blocos à cadeia
// Usando changeDBData uma ferramenta somente de desenvolvimento
app.post('/Change',async function(req,res) {

  var key = req.body.height;
  var value = JSON.stringify(req.body).toString();
  var Response = db.changeDBData(key,value);
  res.setHeader('Content-Type','text/json',);
  res.json({'BlockStatus': Response});
  res.end();

})

// Obtém o arquivo html
fs.readFile('./privateblockchain.html', function (err, html) {
app.get('/',function(req,res){

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write(html);  
  res.end();

  });
});

// Iniciando o servidor web
app.listen(8080, function() {
  console.log('Abra o browser e digite (ou copie e cole): http://127.0.0.1:8080/');
});
