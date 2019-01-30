/* Persistência de Dados com LevlDB */

const level = require('level');
const chainDB = './chaindata';


class leveldb {
  constructor() {
    this.db = level(chainDB);
  }

// Adicionar dados ao levelDB com chave e valor (Promise)
addLevelDBData(key, value) {
  let self = this;
  return new Promise(function(resolve, reject) {
      self.db.put(key, value, function(err) {
          if (err) {
              console.log('Block ' + key + ' submission failed', err);
              reject(err);
          }
          resolve(value);
      });
  });
}

// NOTA: ISSO É SOMENTE PARA O DESENVOLVIMENTO
// Usado em app.js para alterblocks para mostrar essa cadeia e o trabalho de validação de bloco
changeDBData(key,value){
    let self = this;
    return new Promise(function(resolve,reject) {
        self.db.put(key,value,(err,value) => {
            if(err){
                if (err.type == "NotFoundError"){
                    resolve("Block Not Found");
                }
            }else{
                resolve("Block Change Successful");
            }
        })
    })
   
}

// Obter dados do levelDB com chave (Promise)
getLevelDBData(key){
  let self = this; 

  // Como estamos retornando uma Promise, precisaremos disso para poder fazer referência a 'this' dentro do construtor Promise
  return new Promise(function(resolve, reject) {
      self.db.get(key, (err, value) => {
          if(err){
              if (err.type == 'NotFoundError') {
                  resolve(undefined);
              }else {
                  console.log('Block ' + key + ' get failed', err);
                  reject(err);
              }
          }else {
              resolve(value);
          }
      });
  });
}

// Adicione dados ao levelDB com valor
 addDataToLevelDB(value) {
  let self = this;
    let i = 0;
    return new Promise(function(resolve,reject){
      self.db.createReadStream().on('data', function(data) {
        i++;
      }).on('error', function(err) {
        reject(err)
      }).on('close', function() {
        
        self.addLevelDBData(i, value);
        resolve(true)
      });
    })

};

// Cria um contador para cada objeto no banco de dados
getBlocksCount() {
  let self = this;
  var a = 0;
  return new Promise(function(resolve, reject) {
  self.db.createReadStream().on('data', function(data) {
      a++;
  }).on('error', function(err) {
      reject(err)
  }).on('close', function() {
    resolve(a);
  });
});
}

// Usado somente para app.js
// Permitir que o cliente veja a blockchain
getChain() {
  let self = this;
  var BC = [];
  return new Promise(function(resolve, reject) {
  self.db.createReadStream().on('data', function(data) {
      BC.push(data);

  }).on('error', function(err) {
      reject(err)
  }).on('close', function() {  
    resolve(BC);
  });
});
}

}

module.exports.leveldb = leveldb;




