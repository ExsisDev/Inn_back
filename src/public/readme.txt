export db_password=4Fx7ClGV6m
export app_password=123
export DEBUG=app:startup
export NODE_ENV=production

----------------------PROMESAS-------------------------

const p = new Promise((resolve, reject) => {
   resolve(1);
});

const q = new Promise((resolve, reject) => {
   resolve(2);
})

p.then(result => {
   console.log('Result', result));
}.catch(err => {
   console.log('Error', err.message);
})

Promise.all([p, q])
   .then(result => console.log(result));  //el resultado es un arreglo con el resultado de ambas promesas

Promise.race([p, q])
   .then(result => console.log(result)); //el resultado corresponde a la primera promesa en terminar


----------------------ASYNC/AWAIT-------------------------

function function1(parameters){
   return new Promise(resolve => {
      setTimeout(() => {
         resolve('resolved');
      }, 2000);
   });
}

async function showFunctions(){
   try{
      const response1 = await function1(parameters); //la función retorna una promesa
   }catch(err){
      console.log(err);
   }
}

showFunctions();

