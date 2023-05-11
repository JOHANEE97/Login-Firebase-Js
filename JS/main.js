import { createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { collection,addDoc, getDocs,onSnapshot,doc,deleteDoc,getDoc,updateDoc} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js"
import { auth,db } from "./Firebase"
////updateDoc Metodo para actualizar un registro ////lo uso en mi condicional cuando bandera es verdadero
///getDoc me traera solo un registro de la coleccion que usare para el edit ///
///doc obtener un documento ----deleteDoc para eliminar//// recordar documento es como registro en SQL
///onSnapshot metodo de firebase que hace que si hay un cambio o nueva informacion aparezca de una vez y no nos toque recargar la pagina//
///getDocs = consultar todos los documentos de esa coleccion  me trae todos los registros de la coleccion  
///collection me crrea una coleccion en fireStore//
///addDoc crea el documento como en mongodb///
///signInWithEmailAndPassword = funcion de firebase para iniciar sesion con correo y contraseña
///createUserWithEmailAndPassword =funcion de firebase para crear un usuario con correo y contraseña///
///onAuthStateChanged =funcion que usamos para los cambios de estado en la autenticacion///
///////signOut = funcion para cerrar sesion de firebase   

///////////Eventos/////////////
    
   let editStatus = false;///creo esta variable para poder hacer un bandera cuando quiero editar un producto y el boton funcione
   let ProductId = "";
   
   let UserId= "";///guardo el id del usuario para poder validar luego y mostrar los productos que registra cada usuario
     $(function () {
        getProducts();////va al comienzo para que al cargar la pagina me traiga los documentos ya almacenados
       
    
        ///Mostrar formulario al presionar registrar////
        $('#btnSign-up').on('click', ()=>{ 
            $('#sign-up').css('display','block');
            $('#sign-in').css('display','none');///le pasamos el formulario de inicio para que lo oculte y no muestre los dos al tiempo 
        })
///Mostrar formulario de inicio de sesion ////
        $('#btnSign-in').on('click', ()=>{ 
            $('#sign-in').css('display','block');
            $('#sign-up').css('display','none');///le pasamos el formulario de Registrar para que lo oculte y no muestre los dos al tiempo 
        })

////Registrarse//////////           
            $('#btnSend').on('click', ()=>{
                    send();
                    $('#sign-up').css('display','none');
            }) 
//////Inicio de sesion//////////     
        $('#btnLogin').on('click', ()=>{
            
            login();
            
        }) 
////Cerrar sesion////////// 
        $('#btnSign-out').on('click', async ()=>{
          await  signOut(auth);///en este caso solo escrobimos la funcion y le pasamos el parametro auth y debemos definirlo como asyncrona
        })
    ////evento de guardar productos
    $('#btnSave').on('click',()=>{
        SaveProducts();///llamo la funcion de guardar tarea

    })
   
})
         
  
//////////////Funciones//////////

/////Funcion //////

////metodo para saber si la autentificacion cambio mediante el estado nulo o usuario que trae por valor ///
///ocular botones mediante esta funcion de saber si esta iniciado o no ////
 onAuthStateChanged (auth, (users)=>{///el users es el valor que le damos a esta funcion flecha y sera el estado 
                                            ///si esta logueado trae el usuario y si no trae null            
            console.log(users) 
            const loggetIn = $('.logged-in');///estamos obteniendo los botones a lo que les colocamos la clase
            const loggetOut = $('.logged-out');///estamos obteniendo los botones a lo que les colocamos la clase
            
                if(users){///cuando la condicion va sola quiere decir que es true, en este caso esta recorriendo las clases de los botones que creamos
                    loggetIn.each (function(i,e){////en JQUERY EL FOR EACC SE HACE SOLO CON EACH , nos recorre las clases de loged in osea los botones
                        $('#'+ e.id).css('display','inline-block')  ///la funcition en i nos devuelve el index en e el elemento que recorre
                                                            ///aca si hay usuario iniciado nos recorre la clase logget in y nos muestra solo esa que seria el 
                                                            ///boton cerrar sesion.
                    }) 
                    loggetOut.each (function(i,e){////en este caso me va recorrer los botones de iniciar y registrar mediante las clasesy me los va a ocultar
                        $('#'+ e.id).css('display','none')   
                    })   
                     $('#sign-in').css('display','none');///lo usamos para que al momento de que se halla iniciado sesion nos oculte el formulario
                                                   //lo hacemos con la validacion de credentials si tiene info sera true//
                     $('#welcome').text('Bienvenido ' + users.email); //aca damos un mensaje de bienvenida para cuando se halla iniciado sesion ///                 
                     $('#Products').css('display','inline-block')  
                     getProducts();
                     console.log(users.uid);
                     UserId= users.uid///aca le doy valor a la variable global del usualirio que esta en linea
               }else {///SERIA LO MISMO PERO A LA INVERSA 
                    ///quiere secir que si no hay nadie iniciado nos va ocultar el boton iniciar sesion y nos mostrara los botones iniciar y registrar
                    loggetIn.each(function (i,e) {
                        $('#' + e.id).css('display','none')
                    })
                    loggetOut.each(function (i,e) {
                        $('#' + e.id).css('display','inline-block')
                    })
                    $('#welcome').text('');///para que ya no nos muestre el usuario si no lo muestre vacio
                    $('#Products').css('display','none')    
                }
        });

/////registrarse//////
        async function send() {
            let email = $('#email').val();
            let password = $('#password').val();
            console.log(email + ' y ' + password)

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password) 
                console.log(userCredential) 

            } catch (error) {
            console.log(error) 
                if(error.code == 'auth/email-already-in-use'){
                    alert('Usuario ya existe')
                }
                else if (error.code=="auth/invalid-email"){////estos alert son errores que al inspeccionar podemos enviarlos como alerts
                    alert('email invalido')
                }else if (error.code == 'auth/weak-password'){
                    alert('Contraseña invalida')
                } 

            }
        }
//////Iniciar Sesion//////   
    async function login () {////como son funciones asincronas van con async
        let email = $('#email-login').val();
        let passwwprd = $('#password-login').val();
        
        try {

        const credentials = await signInWithEmailAndPassword(auth, email, passwwprd);///le pasamos el auth que el archivo que importamos de Firebase carpeta
        console.log(credentials) ;
        }catch (error) {
            console.log(error) 
            if (error.code === 'auth/user-not-found') {
                alert('El usuario no fue encontrado')
            } else if (error.code === 'auth/wrong-password') {
                alert('La contraseña es incorrecta')
            }    
        }
    }   

///////Cerrar sesion //////    

//////Guardar Tareas////
    function SaveProducts() {
        let name= $('#name').val();
        let description =$('#description').val();///obtenemos los valores de los input
       //este seria para agregar 
       //aca usare mi variable tipo bandera para hacer una validacion
       if(!editStatus){///si es false va a agregar un nuevo producto lo coloco con el diferent
         addDoc(collection (db,'Products'),{///en este casso llamamos las funciones para que cree el documento y para que me lo agregue y le damos un nombre llamado Products
            nameP : name, descriptionP:description, userid :UserId ///aca lo que hacemos es crer las columnas una se llamara namP y la ptra descriptionP
            });///aca tambien guardo el id de usuario para luego validar con la variable global
       }else{///si es verdadero entonces me acutalizara el producto con edit aca actualizo arriba guardo
        updateDoc(doc(db,'Products',ProductId),{///en este casso llamamos las funciones para que cree el documento y para que me lo agregue y le damos un nombre llamado Products
            nameP : name, descriptionP:description }); ///aca lo que hacemos es crer las columnas una se llamara namP y la ptra descriptionP
            editStatus = false;  //lo tengo que dejar en false en su estado inicial    para que el ciclo se reinicie en nuevo registro                                      //paso las columnas tipo jason a ese registro                 ///llamo el metodo de actualizar de firebase/// y accedo a mi coleccion///debo crear tambien una variable locar para guardar el id 
                                                     //coloco la variable producto id que me hace referencia al id del producto que defino en la funcion edit task
       }
                                        //y me tomaran los valores de los input  
                         
           $('#description').val(''); //para que al momento de guardar los input me queden vacios
           $('#name').val('');   
           $('#btnSave').text('Guardar');///para que despues de que pase por aca ya sea para actualizar o guardar quede en su nombre guardar                                        
    }  
    
    
///////////////Funcion para hacer la consulta de las tareas//
    async function getProducts() {
        //const getProducts = await getDocs(collection(db,'Products'))///aca uso la funcion getdocs para hacer la consulta accedo a la coleccion a db y coloco el nombre de la coleccion
        onSnapshot(collection(db,'Products'), (getProducts)=>{///funcion callback de getproductos donde nos tomara los valores de consulta que haceos en el foreach
            
            let html  = ''; //creo esta variable para poder darle estilo e info al div creado
                 getProducts.forEach(doc => {///con el for each nos va a traer los documentos que guardemos en tipo objeto o jason
                 const prodcuts1 = doc.data();///guardo la info en una constante 
                    console.log(doc.data());///el punto data me trae la informacion mas exacta sin tanto codigo
                    
                    if (UserId==prodcuts1.userid) {///aca hago un condicional que si el id del usuario es igual al id del que guardo la info me muestra la tarea guardada 
                            html += `<div class="card col-md-8"style="margin-top: 10px;"  >`+/// el mas e igual me concatena
                                            `<div class="card-body">`+
                                                    `<h3>${prodcuts1.nameP}</h3>` +
                                                    `<p>${prodcuts1.descriptionP}</p>` +                                                    
                                                    `<button id="Ed-${doc.id}" data-id="${doc.id}" class=" BtnEdit btn btn-info" style="margin-right: 10px; ">Editar</button>`+//creamos un boton de editar le agregamos dos iniciales para dfereneciarloss el data - id me traera el id del documento nuevamente sin las dos iniciales el o ed
                                                    `<button id="El-${doc.id}" data-id="${doc.id}" class="BtnDelete btn btn-danger  ">Eliminar</button>`+`<br>`+///creamos u boton para que con cada registro se nos cree un boto
                                                    `<br>`+`<button id="btN+"style="margin-right: 10px;  font-size:20px; ">+</button >`+`<button id="btN-" style="font-size:20px; " >  -  </button>`+
                                                    `</div>`+///al boton le colocamos el id de la tarea para que en cada iteracion su id sea diferente y asi poder                                                    
                                            `</div>`            ///eliminar la tarea correspondiente
                                            console.log('funcionando')                  

                    }                      

        });
            $('#Container').html(html);///para que cuando termine el recorrido la info quede en el container y lo pueda ver en pantalla
                                        //mediante la concateniacion de la variable html
                DeleteTask();           ///la funcion delete de eliminar debe ir aca para que cuando cree el documento tenga la certeza de que ese id ya fue creado y se podra eliminar
                EditTask(); //igualmente la funcion edit debe ir aca porque debe estar creado primero el boton y lo visual
        
        })
                   
    }        
///////////Funcion de eliminar task o producto ///
    function DeleteTask() {
       const Delete =  $('.BtnDelete');//me ingresara solo a los bototnes de eliminar 
        Delete.each (function (i,e){///se hace un for each que nos recorra la variable delete que tiene la clase de toods los botones
               $('#' + e.id).on('click', e=>{//con esto al recorrerlo estamos seleccionando el id al cual le damos click
                    console.log(this.id);
                    const id1 = $(this).data('id');///y me hace referencia al data id y asi se me sale el id limpio//creo una constante en donde guardare el data id que coloco cuando concateno en html+=
                        deleteDoc(doc(db,'Products',id1));///aca uso funcion eliminar del documento que obtengo con doc , y relaciono
                                                  //la base de db con la coleccion Products con el this hacemos referecnia al id de ese registro
               }) 
        } )
    }        
        
///////////Funcion de editar Task o producto///
    function EditTask() {
        const btnEdit= $('.BtnEdit');///realizamos el mismo proceso que en delete
            btnEdit.each (function (i,e) {
           
                $('#' + e.id).on('click',async() =>{///para este metodo la documentacion indica que es asincrono
                    const id2 = $(this).data('id');///creamos la constante para acceder al id de ese registro
                    const docuEdit= await getDoc(doc(db,'Products',id2))///y obtenemos el documento procedente de ese id 
                    const textProduct = docuEdit.data();///creo esta variable para tener acceso a la info tipo jason
                        $('#description').val(textProduct.descriptionP); // asi llamo mis input y les doy el valor de descripcion de ese id y de name que tenga en ese id 
                        $('#name').val(textProduct.nameP); //7
                        
                        editStatus=true;///aca uso mi variable que defini al incio del proyecto para que me funcione como bandera
                        ///y poder hacer la validacion en mi funcion guardar con un if 
                        ProductId = id2;///aca doy valor a mi variable local con el id del registro 
                    //console.log(docuEdit.data());///lo seleccionaos . data para que nos traiga la info mas legible y tipo jason
                    $('#btnSave').text('Actualizar')//tomo ese boton para que cuando le de editar el boton de guardar cambie su texto a actualizar
            }) 
        })
    }
        
                                                   
    